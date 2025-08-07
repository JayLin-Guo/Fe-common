<template>
  <div class="table-widget" @click="handleClick">
    <!-- 设计模式下的表格预览 -->
    <div v-if="designMode" class="table-design-preview">
      <div class="table-header">
        <h4>📊 表格组件</h4>
        <div class="table-actions">
          <el-button
            size="small"
            type="primary"
            @click.stop="openColumnManager"
          >
            管理列
          </el-button>
        </div>
      </div>

      <!-- 简化的表格预览 -->
      <div class="table-preview">
        <table class="preview-table">
          <thead>
            <tr>
              <th
                v-for="(column, index) in visibleColumns"
                :key="index"
                :style="{ width: column.width ? column.width + 'px' : 'auto' }"
              >
                {{ column.label || column.prop }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in previewData" :key="rowIndex">
              <td v-for="(column, colIndex) in visibleColumns" :key="colIndex">
                {{ getPreviewCellValue(row, column) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-info">
        <span>列数: {{ visibleColumns.length }}</span>
        <span>数据: {{ previewData.length }} 条</span>
      </div>
    </div>

    <!-- 运行时模式 - 使用真实的 BaseTable 组件 -->
    <div v-else class="table-runtime">
      <base-table
        v-bind="tableProps"
        :data="element.control.data || []"
        :config="element.control.config"
        :model-value="element.control.modelValue"
        :total="element.control.total"
      />
    </div>

    <!-- 列管理弹窗 -->
    <el-dialog
      v-model="columnManagerVisible"
      title="表格列管理"
      width="800px"
      append-to-body
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      @close="handleColumnManagerClose"
      @closed="handleColumnManagerClose"
    >
      <div class="column-manager" @click.stop>
        <div class="manager-header">
          <el-button type="primary" @click.stop="addColumn">添加列</el-button>
          <el-button @click.stop="resetColumns">重置为默认</el-button>
        </div>

        <div class="column-list">
          <draggable
            v-model="editingColumns"
            item-key="id"
            class="column-draggable"
            :animation="200"
          >
            <template #item="{ element: column, index }">
              <div class="column-item" :key="column.id || index">
                <div class="column-drag-handle">
                  <Icon icon="carbon:drag-horizontal" />
                </div>

                <div class="column-config">
                  <!-- 列类型选择 -->
                  <div class="config-row">
                    <label>类型:</label>
                    <el-select
                      v-model="column.type"
                      placeholder="选择列类型"
                      clearable
                    >
                      <el-option label="普通列" value="" />
                      <el-option label="选择框" value="selection" />
                      <el-option label="序号" value="index" />
                      <!-- <el-option label="展开行" value="expand" /> -->
                    </el-select>
                  </div>

                  <!-- 基础配置 -->
                  <div
                    class="config-row"
                    v-if="!column.type || column.type === ''"
                  >
                    <label>字段名:</label>
                    <el-input v-model="column.prop" placeholder="数据字段名" />
                  </div>

                  <div class="config-row">
                    <label>标题:</label>
                    <el-input v-model="column.label" placeholder="列标题" />
                  </div>

                  <div class="config-row">
                    <label>插槽名称:</label>
                    <el-input
                      v-model="column.slotName"
                      placeholder="插槽名称"
                    />
                  </div>

                  <!-- 宽度配置 -->
                  <div class="config-row">
                    <label>宽度:</label>
                    <el-input-number
                      v-model="column.width"
                      :min="50"
                      placeholder="列宽"
                    />
                    <label style="margin-left: 10px">最小宽度:</label>
                    <el-input-number
                      v-model="column.minWidth"
                      :min="50"
                      placeholder="最小宽"
                    />
                  </div>

                  <!-- 对齐方式 -->
                  <div class="config-row">
                    <label>对齐:</label>
                    <el-select v-model="column.align">
                      <el-option label="左对齐" value="left" />
                      <el-option label="居中" value="center" />
                      <el-option label="右对齐" value="right" />
                    </el-select>
                  </div>

                  <!-- 其他选项 -->
                  <div class="config-row">
                    <el-checkbox v-model="column.showOverflowTooltip"
                      >显示提示框</el-checkbox
                    >
                    <el-checkbox v-model="column.sortable">可排序</el-checkbox>
                  </div>
                </div>

                <div class="column-actions">
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeColumn(index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancelClick">取消</el-button>
          <el-button type="primary" @click="saveColumns">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import Draggable from 'vuedraggable-es';
// import BaseTable from '../../../baseTable/index.vue';

const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  designMode: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['group-click']);

// 列管理弹窗状态
const columnManagerVisible = ref(false);
const editingColumns = ref([]);

// 计算属性
const visibleColumns = computed(() => {
  return (props.element.control?.config?.tableColumn || []).filter(
    col => col.visible !== false
  );
});

const previewData = computed(() => {
  return props.element.control?.data?.slice(0, 3) || [];
});

const tableProps = computed(() => {
  const { data, config, modelValue, total, ...otherProps } =
    props.element.control || {};
  return {
    ...otherProps,
    border: props.element.config?.showBorder !== false,
    stripe: props.element.config?.showStripe !== false,
  };
});

// 获取预览单元格值
const getPreviewCellValue = (row, column) => {
  if (column.type === 'selection') return '☑';
  if (column.type === 'index') return '1';
  if (column.type === 'expand') return '▶';

  const value = row[column.prop];
  if (value === undefined || value === null) return '-';
  return String(value).length > 20
    ? String(value).substring(0, 20) + '...'
    : value;
};

// 打开列管理器
const openColumnManager = () => {
  // 深拷贝现有配置
  const currentColumns = props.element.control?.config?.tableColumn || [];
  editingColumns.value = JSON.parse(JSON.stringify(currentColumns));

  // 为每个列添加唯一ID（用于拖拽）
  editingColumns.value.forEach((col, index) => {
    if (!col.id) {
      col.id = `col_${Date.now()}_${index}`;
    }
  });

  // 确保有基本列配置
  if (editingColumns.value.length === 0) {
    resetColumns();
  }

  columnManagerVisible.value = true;
};

// 添加新列
const addColumn = () => {
  const newColumn = {
    id: `col_${Date.now()}`,
    type: '',
    prop: `field_${editingColumns.value.length + 1}`,
    label: `列 ${editingColumns.value.length + 1}`,
    width: undefined,
    minWidth: 100,
    align: 'left',
    showOverflowTooltip: false,
    sortable: false,
    visible: true,
  };
  editingColumns.value.push(newColumn);
};

// 删除列
const removeColumn = index => {
  editingColumns.value.splice(index, 1);
};

// 重置列配置
const resetColumns = () => {
  editingColumns.value = [
    { id: 'sel', type: 'selection', width: 50 },
    { id: 'idx', type: 'index', label: '序号', width: 70 },
    { id: 'name', label: '姓名', prop: 'name', minWidth: 100 },
    { id: 'age', label: '年龄', prop: 'age', width: 80 },
    {
      id: 'email',
      label: '邮箱',
      prop: 'email',
      minWidth: 150,
      showOverflowTooltip: true,
    },
  ];
};

// 保存列配置
const saveColumns = () => {
  try {
    // 清理临时ID
    const cleanColumns = editingColumns.value.map(col => {
      const { id, ...cleanCol } = col;
      return cleanCol;
    });

    // 更新元素配置
    if (!props.element.control.config) {
      props.element.control.config = {};
    }
    props.element.control.config.tableColumn = cleanColumns;

    // 触发更新事件
    emits('group-click', props.element);
  } catch (error) {
    console.error('保存列配置失败:', error);
  } finally {
    // 确保弹窗关闭
    closeDialog();
  }
};

// 统一的关闭弹窗方法
const closeDialog = () => {
  columnManagerVisible.value = false;
  editingColumns.value = [];
};

// 关闭列管理器
const handleColumnManagerClose = () => {
  closeDialog();
};

// 处理取消按钮点击
const handleCancelClick = () => {
  closeDialog();
};

// 处理点击事件
const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};

// 监听元素变化
watch(
  () => props.element,
  () => {
    // 确保有默认配置
    if (!props.element.control) {
      props.element.control = {};
    }
    if (!props.element.control.config) {
      props.element.control.config = {
        tableColumn: [],
        pagingColumn: {
          layout: 'total, sizes, prev, pager, next, jumper',
          pageSizes: [10, 20, 30, 50],
        },
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@use '../../styles/theme.scss' as *;

.table-widget {
  @include widget-base;
  padding: $spacing-sm;
  min-height: 200px;
}

.table-design-preview {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
    padding-bottom: $spacing-xs;
    border-bottom: 1px solid $gray-200;

    h4 {
      margin: 0;
      color: $gray-700;
      font-size: $font-size-md;
    }
  }

  .table-preview {
    border: 1px solid $gray-200;
    border-radius: $border-radius-sm;
    overflow: hidden;
    margin-bottom: $spacing-sm;

    .preview-table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        padding: $spacing-xs $spacing-sm;
        border-right: 1px solid $gray-200;
        text-align: left;
        font-size: $font-size-sm;

        &:last-child {
          border-right: none;
        }
      }

      th {
        background: $gray-50;
        font-weight: 500;
        color: $gray-700;
        border-bottom: 1px solid $gray-200;
      }

      td {
        color: $gray-600;
        border-bottom: 1px solid $gray-100;
      }

      tr:last-child td {
        border-bottom: none;
      }
    }
  }

  .table-info {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-xs;
    color: $gray-500;

    span {
      padding: 2px $spacing-xs;
      background: $gray-100;
      border-radius: $border-radius-sm;
    }
  }
}

.table-runtime {
  min-height: 200px;
}

// 弹窗样式
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
  }

  .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .el-dialog__footer {
    padding: 16px 20px;
    border-top: 1px solid #ebeef5;
  }
}

// 列管理器样式
.column-manager {
  .manager-header {
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $gray-200;
  }

  .column-draggable {
    max-height: 400px;
    overflow-y: auto;
  }

  .column-item {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
    padding: $spacing-sm;
    border: 1px solid $gray-200;
    border-radius: $border-radius-sm;
    margin-bottom: $spacing-sm;
    background: $white;

    &:hover {
      border-color: $primary-color;
    }

    .column-drag-handle {
      cursor: grab;
      color: $gray-400;
      padding: $spacing-xs;

      &:hover {
        color: $primary-color;
      }
    }

    .column-config {
      flex: 1;

      .config-row {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-xs;

        &:last-child {
          margin-bottom: 0;
        }

        label {
          min-width: 60px;
          font-size: $font-size-sm;
          color: $gray-600;
        }

        .el-input,
        .el-select {
          width: 120px;
        }

        .el-input-number {
          width: 100px;
        }
      }
    }

    .column-actions {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
    }
  }
}
</style>
