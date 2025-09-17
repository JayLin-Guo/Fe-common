<template>
  <div>
    <CustomTable
      ref="tableRef"
      :data="tableData"
      :columns="tableColumns"
      :border="true"
      :striped="true"
      :enable-area-selection="enableAreaSelection"
      :show-toolbar="showToolbar"
      :toolbar-config="toolbarConfig"
      row-key="id"
      @cell-click="onCellClick"
      @cell-mousedown="onCellMousedown"
      @cell-mousemove="onCellMousemove"
      @cell-mouseup="onCellMouseup"
      @selection-change="onSelectionChange"
      @select="onSelect"
      @select-all="onSelectAll"
      @area-selection-start="onAreaSelectionStart"
      @area-selection-change="onAreaSelectionChange"
      @area-selection-end="onAreaSelectionEnd"
      @textarea-input="onTextareaInput"
      @textarea-change="onTextareaChange"
      @textarea-focus="onTextareaFocus"
      @textarea-blur="onTextareaBlur"
      @textarea-keydown="onTextareaKeydown"
      @area-selection-toggle="onAreaSelectionToggle"
      @toolbar-refresh="onToolbarRefresh"
      @toolbar-settings="onToolbarSettings"
    >
      <!-- 自定义姓名列头 -->
      <template #nameHeader="{ column }">
        <div class="custom-name-header">
          <el-icon><User /></el-icon>
          <span style="margin-left: 4px">{{ column.label }}</span>
          <el-tooltip content="这是用户姓名信息" placement="top">
            <el-icon style="margin-left: 4px; color: #909399"
              ><QuestionFilled
            /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <!-- 自定义描述列头 -->
      <template #descriptionHeader="{ column }">
        <div class="custom-description-header">
          <el-icon><Document /></el-icon>
          <span style="margin-left: 4px">{{ column.label }}</span>
          <el-tag size="small" style="margin-left: 8px">可编辑</el-tag>
        </div>
      </template>
    </CustomTable>

    <!-- 粘贴数据弹窗 -->
    <el-dialog
      v-model="pasteDialogVisible"
      title="粘贴数据预览"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="paste-dialog-content">
        <div class="paste-info">
          <p><strong>选中区域：</strong>{{ selectedAreaInfo }}</p>
          <p><strong>预期数据格式：</strong>{{ expectedDataFormat }}</p>
        </div>

        <div class="paste-input-section">
          <div class="paste-input-header">
            <label>请粘贴您的数据（支持从Excel、表格等复制）：</label>
          </div>
          <el-input
            v-model="pasteContent"
            type="textarea"
            :rows="8"
            placeholder="请在此处粘贴数据...&#10;支持制表符分隔的数据格式&#10;或点击上方'读取剪贴板'按钮"
            @paste="handlePaste"
          />
        </div>

        <div v-if="parsedData.length > 0" class="paste-preview">
          <h4>数据预览：</h4>
          <div class="preview-table">
            <table class="preview-table-content">
              <thead>
                <tr>
                  <th v-for="(col, index) in previewColumns" :key="index">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in parsedData" :key="rowIndex">
                  <td
                    v-for="(cell, cellIndex) in row"
                    :key="cellIndex"
                    :class="{ 'invalid-cell': !cell.valid }"
                  >
                    {{ cell.value }}
                    <span v-if="!cell.valid" class="error-icon">⚠️</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="hasInvalidData" class="warning-message">
            <el-alert
              title="数据格式警告"
              type="warning"
              description="标记为⚠️的数据可能格式不正确，请检查后再提交"
              show-icon
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="pasteDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="confirmPasteData"
            :disabled="parsedData.length === 0"
          >
            确认粘贴 ({{ parsedData.length }} 行数据)
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, h, computed, onMounted, onUnmounted } from 'vue';
import { CustomTable, TableColumn } from '@jr/ui-components';

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    address: '北京市朝阳区',
    status: '在职',
    description: '前端开发工程师，负责Vue项目开发',
    cleanText: '',
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    address: '上海市浦东区',
    status: '离职',
    description: '后端开发工程师，负责Java后台开发',
    cleanText: '',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    address: '广州市天河区',
    status: '在职',
    description: '产品经理，负责产品需求分析',
    cleanText: '',
  },
  {
    id: 4,
    name: '赵六',
    age: 32,
    address: '深圳市南山区',
    status: '在职',
    description: 'UI设计师，负责界面设计',
    cleanText: '',
  },
  {
    id: 5,
    name: '钱七',
    age: 27,
    address: '杭州市西湖区',
    status: '离职',
    description: '测试工程师，负责系统测试',
    cleanText: '',
  },
  {
    id: 6,
    name: '孙八',
    age: 35,
    address: '南京市江宁区',
    status: '在职',
    description: '项目经理，负责项目管理和协调',
    cleanText: '',
  },
]);

// 表格列配置，包含新的类型列
const tableColumns = ref([
  { type: 'checkbox' as const, label: '', width: '50px' }, // 复选框列
  { type: 'index' as const, label: '序号', width: '70px' }, // 序号列
  { prop: 'id', label: 'ID', width: '80px' },
  {
    prop: 'name',
    label: '姓名',
    width: '120px',
    // 使用插槽自定义列头
    headerSlot: 'nameHeader',
  },
  {
    prop: 'age',
    label: '年龄',
    width: '100px',
    // 使用render函数自定义列头
    headerRender: (column: TableColumn, index: number) =>
      h('div', { class: 'custom-header' }, [
        h('span', { style: { color: '#409eff' } }, column.label),
        h('el-icon', { style: { marginLeft: '4px' } }, [h('InfoFilled')]),
      ]),
  },
  {
    prop: 'status',
    label: '状态',
    width: '100px',
    // 使用HTML字符串渲染列头
    headerRender: (column, index) => `
      <div style="display: flex; align-items: center; justify-content: center;">
        <span style="color: #67c23a; font-weight: bold;">${column.label}</span>
        <span style="margin-left: 4px; font-size: 12px; color: #909399;">📊</span>
      </div>
    `,
  },
  {
    prop: 'address',
    label: '地址',
    width: '200px',
    // 使用HTML字符串创建带样式的列头
    headerRender: (column, index) => `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <span>🏠</span>
        <span style="margin-left: 4px;">${column.label}</span>
      </div>
    `,
  },
  { prop: 'phone', label: '电话', width: '140px' },
  { prop: 'idCard', label: '身份证号', width: '180px' },
  {
    prop: 'position',
    label: '职位',
    width: '150px',
    // 使用render函数创建带排序的列头
    headerRender: (column, index) =>
      h(
        'div',
        {
          class: 'sortable-header',
          onClick: () => handleSort(column.prop),
        },
        [
          h('span', column.label),
          h('div', { class: 'sort-icons' }, [
            h('el-icon', { class: 'sort-icon' }, [h('CaretTop')]),
            h('el-icon', { class: 'sort-icon' }, [h('CaretBottom')]),
          ]),
        ]
      ),
  },
  {
    prop: 'description',
    label: '描述',
    width: '250px',
    type: 'textarea' as const,
    headerSlot: 'descriptionHeader', // 使用插槽
    textareaConfig: {
      placeholder: '请输入描述信息...',
      rows: 3,
      autoResize: true,
      showCount: true,
      maxlength: 200,
      // 格式化函数：去除空格和换行符
      formatter: (value: string) => {
        return value
          .replace(/\s+/g, ' ') // 将多个空格替换为单个空格
          .replace(/\n+/g, ' ') // 将换行符替换为空格
          .trim(); // 去除首尾空格
      },
      enablePasteFormatter: true, // 启用粘贴时格式化
    },
  },
  {
    prop: 'cleanText',
    label: '纯净文本',
    width: '200px',
    type: 'textarea' as const,
    textareaConfig: {
      placeholder: '粘贴任何文本，会自动清理格式...',
      rows: 2,
      autoResize: true,
      showCount: false,
      // 更强力的格式化：移除所有空格、换行、制表符
      formatter: (value: string) => {
        return value
          .replace(/[\s\n\r\t]+/g, '') // 移除所有空白字符
          .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''); // 只保留中文、英文、数字
      },
      enablePasteFormatter: true,
    },
  },
]);

// 事件信息
const eventInfo = ref('等待事件触发...');

// 排序处理函数
function handleSort(prop: string | undefined) {
  if (!prop) return;
  console.log('排序列:', prop);
  eventInfo.value = `点击排序列: ${prop}`;
  // 这里可以实现实际的排序逻辑
}

// Toolbar 相关配置
const showToolbar = ref(true);
const toolbarConfig = ref({
  title: '',
  description: '按 Ctrl+V 可批量粘贴数据',
  showAreaSelectionToggle: true,
  showTableInfo: true,
  showSelectionInfo: true,
  showRefresh: true,
  showSettings: true,
});

// 选中的行数据
const selectedRows = ref<any[]>([]);

// 选中的单元格区域
const selectedCellPositions = ref<any[]>([]);

// 区域选择开关
const enableAreaSelection = ref(true);

// 选择变化事件
function onSelectionChange(selection: any[]) {
  selectedRows.value = selection;
  eventInfo.value = `行选择变化: 当前选中 ${selection.length} 行`;
  console.log('Selection changed:', selection);
}

// 单行选择事件
function onSelect(selection: any[], row: any) {
  eventInfo.value = `单行选择变化: ${row.name} - 当前选中 ${selection.length} 行`;
  console.log('Row select:', { selection, row });
}

// 全选事件
function onSelectAll(selection: any[]) {
  eventInfo.value = `全选状态变化: ${selection.length === 0 ? '取消全选' : '全选'} - 选中 ${selection.length} 行`;
  console.log('Select all:', selection);
}

// 区域选择开始事件
function onAreaSelectionStart(startCell: any) {
  eventInfo.value = `开始区域选择: 起始单元格 (${startCell.row}, ${startCell.col})`;
  console.log('Area selection start:', startCell);
}

// 区域选择变化事件
function onAreaSelectionChange(selection: any[]) {
  selectedCellPositions.value = selection;
  currentSelectedArea.value = selection; // 保存当前选中区域

  if (selection.length > 0) {
    eventInfo.value = `区域选择变化: 当前选中 ${selection.length} 个单元格，按 Ctrl+V 可批量粘贴数据`;
  } else {
    eventInfo.value = '未选择区域';
  }

  console.log('Area selection change:', selection);
}

// 区域选择结束事件
function onAreaSelectionEnd(selection: any[]) {
  selectedCellPositions.value = selection;

  if (selection.length > 0) {
    eventInfo.value = `区域选择完成: 共选中 ${selection.length} 个单元格，现在可以按 Ctrl+V 进行批量粘贴`;
  } else {
    eventInfo.value = '区域选择已清除';
  }

  console.log('Area selection end:', selection);
}

// 单元格点击事件
function onCellClick(
  row: any,
  column: any,
  rowIndex: number,
  colIndex: number,
  event: MouseEvent
) {
  if (column.type === 'checkbox' || column.type === 'index') return;
  eventInfo.value = `点击单元格 - 行: ${rowIndex + 1}, 列: ${column.label}, 值: ${row[column.prop]}`;
  console.log('Cell click:', { row, column, rowIndex, colIndex, event });
}

// 单元格鼠标按下事件
function onCellMousedown(
  row: any,
  column: any,
  rowIndex: number,
  colIndex: number,
  event: MouseEvent
) {
  if (column.type === 'checkbox' || column.type === 'index') return;
  eventInfo.value = `鼠标按下 - 行: ${rowIndex + 1}, 列: ${column.label}`;
  console.log('Cell mousedown:', { row, column, rowIndex, colIndex, event });
}

// 单元格鼠标移动事件
function onCellMousemove(
  row: any,
  column: any,
  rowIndex: number,
  colIndex: number,
  event: MouseEvent
) {
  // 注释掉，避免过多输出
  // console.log('Cell mousemove:', { row, column, rowIndex, colIndex });
}

// 单元格鼠标释放事件
function onCellMouseup(
  row: any,
  column: any,
  rowIndex: number,
  colIndex: number,
  event: MouseEvent
) {
  if (column.type === 'checkbox' || column.type === 'index') return;
  eventInfo.value = `鼠标释放 - 行: ${rowIndex + 1}, 列: ${column.label}`;
  console.log('Cell mouseup:', { row, column, rowIndex, colIndex, event });
}

// Textarea 事件处理函数
function onTextareaInput(data: any) {
  console.log('Textarea输入事件:', data);
  eventInfo.value = `单元格编辑: 行${data.rowIndex + 1}, 列${data.colIndex + 1}, 内容已更新`;
}

function onTextareaChange(data: any) {
  console.log('Textarea改变事件:', data);
  eventInfo.value = `Textarea改变: 行${data.rowIndex}, 列${data.colIndex}, 最终值: ${data.value}`;
}

function onTextareaFocus(data: any) {
  console.log('Textarea获得焦点:', data);
  eventInfo.value = `Textarea获得焦点: 行${data.rowIndex}, 列${data.colIndex}`;
}

function onTextareaBlur(data: any) {
  console.log('Textarea失去焦点:', data);
  eventInfo.value = `Textarea失去焦点: 行${data.rowIndex}, 列${data.colIndex}`;
}

function onTextareaKeydown(data: any) {
  console.log('Textarea按键事件:', data);
  if (data.event.key === 'Enter' && data.event.ctrlKey) {
    eventInfo.value = `Textarea快捷键: Ctrl+Enter 在行${data.rowIndex}`;
  }
}

// Toolbar 事件处理方法
function onAreaSelectionToggle(value: boolean) {
  enableAreaSelection.value = value;
  eventInfo.value = `区域选择开关已${value ? '开启' : '关闭'}`;
  console.log('区域选择开关切换:', value);
}

function onToolbarRefresh() {
  eventInfo.value = '刷新表格数据...';
  console.log('工具栏刷新按钮被点击');

  // 模拟刷新操作
  setTimeout(() => {
    eventInfo.value = '表格数据刷新完成';
  }, 1000);
}

function onToolbarSettings() {
  eventInfo.value = '打开表格设置...';
  console.log('工具栏设置按钮被点击');

  // 这里可以打开设置弹窗等
  // 暂时只是示例
}

const currentSelectedArea = ref<any[]>([]);

// 计算选中单元格数量
const selectedCellsCount = computed(() => selectedCellPositions.value.length);

// 计算属性：选中区域信息
const selectedAreaInfo = computed(() => {
  if (currentSelectedArea.value.length === 0) return '无选择';

  const minRow = Math.min(...currentSelectedArea.value.map(cell => cell.row));
  const maxRow = Math.max(...currentSelectedArea.value.map(cell => cell.row));
  const minCol = Math.min(...currentSelectedArea.value.map(cell => cell.col));
  const maxCol = Math.max(...currentSelectedArea.value.map(cell => cell.col));

  return `${maxRow - minRow + 1} 行 × ${maxCol - minCol + 1} 列 (第${minRow + 1}-${maxRow + 1}行, 第${minCol + 1}-${
    maxCol + 1
  }列)`;
});

// 计算属性：预期数据格式
const expectedDataFormat = computed(() => {
  if (currentSelectedArea.value.length === 0) return '';

  const columns = [
    ...new Set(currentSelectedArea.value.map(cell => cell.col)),
  ].sort();
  const columnLabels = columns.map(colIndex => {
    const column = tableColumns.value.find((_, index) => index === colIndex);
    return column?.label || `列${colIndex + 1}`;
  });

  return `${columnLabels.join(' | ')}`;
});

// 计算属性：预览列
const previewColumns = computed(() => {
  if (currentSelectedArea.value.length === 0) return [];

  const columns = [
    ...new Set(currentSelectedArea.value.map(cell => cell.col)),
  ].sort();
  return columns.map(colIndex => {
    const column = tableColumns.value.find((_, index) => index === colIndex);
    return {
      label: column?.label || `列${colIndex + 1}`,
      prop: column?.prop || `col${colIndex}`,
      type: column?.type,
    };
  });
});

// 粘贴功能相关
const pasteDialogVisible = ref(false);
const pasteContent = ref('');
const parsedData = ref<any[]>([]);

// 计算属性：是否有无效数据
const hasInvalidData = computed(() => {
  return parsedData.value.some((row: any) =>
    row.some((cell: any) => !cell.valid)
  );
});

// 粘贴功能相关方法
function handlePaste(event: ClipboardEvent) {
  // 获取粘贴的文本内容
  const pastedText = event.clipboardData?.getData('text') || '';
  if (pastedText) {
    console.log('检测到粘贴事件，内容长度:', pastedText.length);

    // 稍微延迟一下，确保 v-model 更新完成
    setTimeout(() => {
      parseClipboardData(pastedText);
    }, 100);
  }
}

function parseClipboardData(text: string) {
  console.log('解析粘贴数据:', text);

  // 分割行和列
  const rows = text.trim().split('\n');
  const parsed: any[] = [];

  const targetColumns = [
    ...new Set(currentSelectedArea.value.map(cell => cell.col)),
  ].sort();

  rows.forEach((row, rowIndex) => {
    console.log(`正在解析第${rowIndex + 1}行: "${row}"`);

    // 智能分列：先尝试多空格分隔，如果列数不够则尝试单空格
    let cells: string[] = [];

    // 方法1：尝试2个或更多空格分隔
    cells = row
      .split(/\s{2,}/)
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    console.log(`  多空格分割结果: [${cells.join(', ')}] (${cells.length}列)`);

    // 如果列数不够目标列数，尝试单空格分隔
    if (cells.length < targetColumns.length) {
      cells = row
        .split(/\s+/)
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      console.log(
        `  单空格分割结果: [${cells.join(', ')}] (${cells.length}列)`
      );
    }

    // 如果还是不够，尝试制表符分隔
    if (cells.length < targetColumns.length && row.includes('\t')) {
      cells = row
        .split('\t')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      console.log(
        `  制表符分割结果: [${cells.join(', ')}] (${cells.length}列)`
      );
    }

    const parsedRow: any[] = [];

    targetColumns.forEach((colIndex, cellIndex) => {
      const column = tableColumns.value[colIndex];
      const cellValue = cells[cellIndex] || '';

      // 数据验证
      let isValid = true;
      let validatedValue = cellValue;

      // 根据列类型进行验证
      if (column?.type === 'textarea') {
        // textarea 类型，基本不需要特殊验证
        validatedValue = cellValue;
      } else if (column?.prop === 'name') {
        // 姓名列：验证是否为中文姓名
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(cellValue)) {
          isValid = false; // 不是2-10位中文
        }
        validatedValue = cellValue;
      } else if (column?.prop === 'id' && cellValue.length === 18) {
        // 身份证号列：验证18位身份证格式
        if (!/^\d{17}[\dXx]$/.test(cellValue)) {
          isValid = false; // 不是18位身份证格式
        }
        validatedValue = cellValue;
      } else if (
        column?.prop === 'phone' ||
        /phone|tel|mobile/i.test(column?.prop || '')
      ) {
        // 电话号码列：验证11位手机号
        if (!/^1[3-9]\d{9}$/.test(cellValue)) {
          isValid = false; // 不是11位手机号格式
        }
        validatedValue = cellValue;
      } else if (column?.prop === 'age') {
        // 年龄列，验证是否为数字
        const num = parseInt(cellValue);
        if (isNaN(num) || num < 0 || num > 150) {
          isValid = false;
        } else {
          validatedValue = num.toString();
        }
      } else if (column?.prop === 'id' && cellValue.length !== 18) {
        // ID列（非身份证），验证是否为数字
        const num = parseInt(cellValue);
        if (isNaN(num) || num <= 0) {
          isValid = false;
        } else {
          validatedValue = num.toString();
        }
      }

      parsedRow.push({
        value: validatedValue,
        valid: isValid,
        column: column,
        originalValue: cellValue,
      });
    });

    if (parsedRow.length > 0) {
      parsed.push(parsedRow);
    }
  });

  parsedData.value = parsed;
  console.log('解析后的数据:', parsed);
}

function confirmPasteData() {
  if (parsedData.value.length === 0 || currentSelectedArea.value.length === 0) {
    return;
  }

  console.log('确认粘贴数据');

  // 按行列顺序组织数据
  const targetRows = [
    ...new Set(currentSelectedArea.value.map(cell => cell.row)),
  ].sort();
  const targetColumns = [
    ...new Set(currentSelectedArea.value.map(cell => cell.col)),
  ].sort();

  // 构建更新数据
  const updateData: any[] = [];

  parsedData.value.forEach((row, rowIndex) => {
    if (rowIndex < targetRows.length) {
      const targetRowIndex = targetRows[rowIndex];
      const targetRowData: any = tableData.value[targetRowIndex];

      row.forEach((cell: any, cellIndex: number) => {
        if (cellIndex < targetColumns.length && cell.valid) {
          const targetColIndex = targetColumns[cellIndex];
          const column = tableColumns.value[targetColIndex];

          if (column?.prop) {
            // 更新表格数据
            targetRowData[column.prop] = cell.value;

            // 记录更新信息（用于后端提交）
            updateData.push({
              rowIndex: targetRowIndex,
              colIndex: targetColIndex,
              prop: column.prop,
              oldValue: cell.originalValue,
              newValue: cell.value,
              rowData: targetRowData,
            });
          }
        }
      });
    }
  });

  // 这里可以调用后端API提交数据
  console.log('准备提交的数据:', updateData);

  // 模拟后端处理
  handleBatchUpdate(updateData);

  // 关闭弹窗
  pasteDialogVisible.value = false;
  pasteContent.value = '';
  parsedData.value = [];

  eventInfo.value = `批量更新完成: 更新了 ${updateData.length} 个单元格`;
}

// 模拟后端批量更新处理
function handleBatchUpdate(updateData: any[]) {
  console.log('模拟后端批量更新:', updateData);

  // 这里是您实际调用后端API的地方
  // 数据格式：
  // [
  //   {
  //     rowIndex: 0,     // 行索引
  //     colIndex: 2,     // 列索引
  //     prop: 'name',    // 字段名
  //     oldValue: '原值',
  //     newValue: '新值',
  //     rowData: {...}   // 完整行数据
  //   }
  // ]

  // 示例API调用：
  // api.batchUpdateTableData({
  //   updates: updateData,
  //   tableId: 'your-table-id'
  // })

  alert(
    `模拟后端处理完成！更新了 ${updateData.length} 个单元格\n\n数据已打印到控制台`
  );
}

// 全局键盘事件监听
function handleGlobalKeydown(event: KeyboardEvent) {
  // 检测 Ctrl+V 快捷键
  if (
    event.ctrlKey &&
    event.key === 'v' &&
    currentSelectedArea.value.length > 0
  ) {
    const target = event.target as HTMLElement;

    // 检查是否在弹窗的 textarea 中，如果是则不阻止
    if (
      target.tagName === 'TEXTAREA' &&
      target.closest('.paste-dialog-content')
    ) {
      return; // 在粘贴弹窗内的 textarea，允许正常粘贴
    }

    // 检查是否在表格内的 textarea 中，如果是则不阻止
    if (target.tagName === 'TEXTAREA' && target.closest('.custom-table')) {
      console.log('在表格 textarea 内粘贴，不触发批量修改');
      return; // 在表格内的 textarea，允许正常粘贴，不触发批量修改
    }

    // 检查是否在任何输入元素中
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      console.log('在输入元素内粘贴，不触发批量修改');
      return; // 在输入元素内，允许正常粘贴
    }

    // 阻止默认粘贴行为
    event.preventDefault();

    // 尝试读取剪贴板内容
    readClipboardAndOpenDialog();
  }
}

// 读取剪贴板内容并打开弹窗
async function readClipboardAndOpenDialog() {
  console.log('=== 开始读取剪贴板 ===');

  try {
    let clipboardText = '';

    // 检查环境和权限
    console.log('检查剪贴板API支持情况:');
    console.log('- navigator.clipboard:', !!navigator.clipboard);
    console.log('- readText方法:', !!navigator.clipboard?.readText);
    console.log('- 是否HTTPS:', location.protocol === 'https:');
    console.log('- 是否localhost:', location.hostname === 'localhost');

    if (navigator.clipboard && navigator.clipboard.readText) {
      console.log('使用现代 Clipboard API...');

      // 现代浏览器使用 Clipboard API
      clipboardText = await navigator.clipboard.readText();
      console.log(
        'Clipboard API 读取成功，内容预览:',
        clipboardText.substring(0, 100) + '...'
      );
    } else {
      console.log('Clipboard API 不可用，尝试降级方案...');

      // 降级方案：创建临时 textarea 来获取剪贴板内容
      const tempTextarea = document.createElement('textarea');
      tempTextarea.style.position = 'absolute';
      tempTextarea.style.left = '-9999px';
      tempTextarea.style.top = '-9999px';
      tempTextarea.style.opacity = '0';
      document.body.appendChild(tempTextarea);

      tempTextarea.focus();
      tempTextarea.select();

      console.log('临时textarea已创建并获得焦点');

      // 执行粘贴操作
      const pasteSuccess = document.execCommand('paste');
      console.log('execCommand paste 结果:', pasteSuccess);

      clipboardText = tempTextarea.value;
      console.log(
        '降级方案读取结果预览:',
        clipboardText.substring(0, 100) + '...'
      );

      // 清理临时元素
      document.body.removeChild(tempTextarea);
    }

    console.log('最终读取的内容长度:', clipboardText.length);

    if (clipboardText.length === 0) {
      throw new Error('读取到的剪贴板内容为空');
    }

    // 打开粘贴弹窗并填入内容
    pasteDialogVisible.value = true;
    pasteContent.value = clipboardText;

    // 由于 watch 监听，内容会自动解析
    eventInfo.value = `检测到粘贴快捷键，已自动读取剪贴板内容 (${clipboardText.length} 字符)`;
  } catch (error) {
    console.error('读取剪贴板失败详情:', error);
    const err = error as Error;
    console.log('错误类型:', err.name);
    console.log('错误信息:', err.message);

    // 如果读取失败，仍然打开弹窗让用户手动粘贴
    pasteDialogVisible.value = true;
    pasteContent.value = '';
    parsedData.value = [];

    let errorMsg = '读取剪贴板失败';
    if (err.name === 'NotAllowedError') {
      errorMsg = '浏览器拒绝访问剪贴板，请手动粘贴';
    } else if (err.name === 'NotSupportedError') {
      errorMsg = '浏览器不支持剪贴板API，请手动粘贴';
    } else if (
      location.protocol !== 'https:' &&
      location.hostname !== 'localhost'
    ) {
      errorMsg = '需要HTTPS环境才能自动读取剪贴板，请手动粘贴';
    }

    eventInfo.value = errorMsg;
  }
}
// 组件挂载时绑定全局事件
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
});

// 组件卸载时解除绑定
onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});
</script>
<style lang="scss" scoped></style>
