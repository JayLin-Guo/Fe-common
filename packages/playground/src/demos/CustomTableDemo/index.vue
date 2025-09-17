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
      @area-selection-toggle="
        (value: boolean) =>
          onAreaSelectionToggle(value, enableAreaSelection, eventInfo)
      "
      @toolbar-refresh="() => onToolbarRefresh(eventInfo)"
      @toolbar-settings="() => onToolbarSettings(eventInfo)"
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
import { CustomTable } from '@jr/ui-components';
import { useTableData } from './hooks/useTableData';
import { useTableEvents } from './hooks/useTableEvents';
import { useAreaSelection } from './hooks/useAreaSelection';
import { usePasteData } from './hooks/usePasteData';
import { useTableToolbar } from './hooks/useTableToolbar';

// 表格基础数据schema
const { tableData, tableColumns, updateTableData } = useTableData();
// 表格事件
const {
  eventInfo,
  onCellClick,
  onCellMousedown,
  onCellMousemove,
  onCellMouseup,
  onTextareaInput,
  onTextareaChange,
  onTextareaFocus,
  onTextareaBlur,
  onTextareaKeydown,
} = useTableEvents();
// 区域选择
const {
  selectedRows,
  selectedCellPositions,
  enableAreaSelection,
  currentSelectedArea,
  selectedCellsCount,
  selectedAreaInfo,
  onSelectionChange,
  onSelect,
  onSelectAll,
  onAreaSelectionStart,
  onAreaSelectionChange,
  onAreaSelectionEnd,
} = useAreaSelection();
// 粘贴数据
const {
  pasteDialogVisible,
  pasteContent,
  parsedData,
  expectedDataFormat,
  previewColumns,
  hasInvalidData,
  handlePaste,
  confirmPasteData,
} = usePasteData(tableColumns, currentSelectedArea, updateTableData);
// 表格工具栏
const {
  showToolbar,
  toolbarConfig,
  onAreaSelectionToggle,
  onToolbarRefresh,
  onToolbarSettings,
} = useTableToolbar();
</script>

<style lang="scss" scoped></style>
