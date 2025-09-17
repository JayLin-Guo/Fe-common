<template>
  <div class="custom-table-wrapper">
    <!-- Toolbar 工具栏 -->
    <TableToolbar
      v-if="showToolbar"
      v-bind="computedToolbarConfig"
      @update:enableAreaSelection="handleAreaSelectionToggle"
      @refresh="handleToolbarRefresh"
      @settings="handleToolbarSettings"
    >
      <!-- 传递插槽内容 -->
      <template #center>
        <slot name="toolbar-center" />
      </template>
      <template #actions>
        <slot name="toolbar-actions" />
      </template>
    </TableToolbar>

    <table
      class="custom-table"
      :class="{
        'table-border': border,
        'area-selection-enabled': enableAreaSelection,
        'with-toolbar': showToolbar,
      }"
    >
      <thead :class="['table-header']">
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="column.prop || index"
            :style="{ width: column.width }"
            class="table-header-cell"
            :class="[
              {
                'checkbox-column': column.type === 'checkbox',
                'index-column': column.type === 'index',
              },
              headerCellClassName,
            ]"
          >
            <!-- 复选框列头 -->

            <CheckboxCell
              v-if="column.type === 'checkbox'"
              :checked="selection.isAllSelected.value"
              :indeterminate="selection.isIndeterminate.value"
              @change="selection.toggleSelectAll"
            />

            <!-- 序号列头 -->
            <span v-else-if="column.type === 'index'">
              {{ column.label || '#' }}
            </span>

            <!-- 自定义列头插槽 -->
            <slot
              v-else-if="column.headerSlot && $slots[column.headerSlot]"
              :name="column.headerSlot"
              :column="column"
              :columnIndex="index"
            />

            <!-- 自定义列头渲染函数 -->
            <template v-else-if="column.headerRender">
              <!-- 如果返回的是字符串，使用 v-html 渲染 -->
              <div
                v-if="typeof column.headerRender(column, index) === 'string'"
                v-html="column.headerRender(column, index)"
              />
              <!-- 如果返回的是 VNode，使用 component 渲染 -->
              <component
                v-else
                :is="() => column.headerRender!(column, index)"
              />
            </template>

            <!-- 默认列头 -->
            <span v-else>
              {{ column.label }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr
          v-for="(row, rowIndex) in data"
          :key="selection.getRowKey(row, rowIndex)"
          class="table-row"
          :class="{
            'table-row-striped': striped && rowIndex % 2 === 1,
            'table-row-selected': selection.isRowSelected(row, rowIndex),
          }"
        >
          <td
            v-for="(column, colIndex) in columns"
            :key="column.prop || colIndex"
            @contextmenu="
              handleCellContextMenu($event, row, column, rowIndex, colIndex)
            "
            :data-row="rowIndex"
            :data-col="colIndex"
            :data-prop="column.prop"
            :data-type="column.type"
            class="table-cell"
            :class="[
              {
                'checkbox-column': column.type === 'checkbox',
                'index-column': column.type === 'index',
                'textarea-column': column.type === 'textarea',
                'area-selected':
                  enableAreaSelection &&
                  areaSelection?.isCellSelected?.(rowIndex, colIndex),
              },
              cellClassName,
            ]"
            @click="handleCellClick(column, rowIndex, colIndex)"
          >
            <div class="cell-content">
              <!-- 复选框列 -->
              <CheckboxCell
                v-if="column.type === 'checkbox'"
                :checked="selection.isRowSelected(row, rowIndex)"
                @change="() => selection.toggleRowSelection(row, rowIndex)"
              />

              <!-- 序号列 -->
              <IndexCell
                v-else-if="column.type === 'index'"
                :index="rowIndex"
              />
              <!-- Textarea列 -->
              <TextareaCell
                v-else-if="column.type === 'textarea'"
                :ref="el => setTextareaCellRef(el, rowIndex, colIndex)"
                :model-value="column.prop ? getCellValue(row, column.prop) : ''"
                v-bind="column.textareaConfig || {}"
                @update:model-value="
                  value => updateCellValue(row, column.prop, value)
                "
                @input="
                  (value, event) =>
                    handleTextareaInput(
                      row,
                      column,
                      value,
                      event,
                      rowIndex,
                      colIndex
                    )
                "
                @change="
                  (value, event) =>
                    handleTextareaChange(
                      row,
                      column,
                      value,
                      event,
                      rowIndex,
                      colIndex
                    )
                "
                @focus="
                  event =>
                    handleTextareaFocus(row, column, event, rowIndex, colIndex)
                "
                @blur="
                  event =>
                    handleTextareaBlur(row, column, event, rowIndex, colIndex)
                "
                @keydown="
                  event =>
                    handleTextareaKeydown(
                      row,
                      column,
                      event,
                      rowIndex,
                      colIndex
                    )
                "
                @edit-start="
                  () => handleTextareaEditStart(row, column, rowIndex, colIndex)
                "
                @edit-end="
                  () => handleTextareaEditEnd(row, column, rowIndex, colIndex)
                "
              />

              <!-- 自定义插槽 -->
              <slot
                v-else-if="column.prop && $slots[column.prop]"
                :name="column.prop"
                :row="row"
                :column="column"
                :index="rowIndex"
              >
              </slot>

              <!-- 默认显示 -->
              <span v-else>{{
                column.prop ? getCellValue(row, column.prop) : ''
              }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  defineExpose,
  watch,
  ref,
  onMounted,
  onUnmounted,
  computed,
  reactive,
} from 'vue';
import CheckboxCell from './CheckboxCell.vue';
import IndexCell from './IndexCell.vue';
import TextareaCell from './TextareaCell.vue';
import TableToolbar from './TableToolbar.vue';
import { useTableSelection } from './hooks/useTableSelection';
import { useTableEvents } from './hooks/useTableEvents';
import { useAreaSelection } from './hooks/useAreaSelection';
import type { TableProps, AllTableEmits, TableToolbarProps } from './types';

const props = withDefaults(
  defineProps<{
    data: any[];
    columns: any[];
    border?: boolean;
    striped?: boolean;
    height?: string;
    rowKey?: string | ((row: any) => string | number);
    defaultSelectedRows?: any[];
    headerCellClassName?: string;
    cellClassName?: string;
    enableAreaSelection?: boolean;
    showToolbar?: boolean;
    toolbarConfig?: any;
  }>(),
  {
    border: false,
    striped: false,
    rowKey: 'id',
    enableAreaSelection: false,
    showToolbar: false,
    toolbarConfig: () => ({}),
    defaultSelectedRows: () => [],
  }
);

const emit = defineEmits<AllTableEmits>();

// TextareaCell引用管理
const textareaCellRefs = ref<Record<string, any>>({});

const selectionConfig = reactive({
  data: props.data,
  rowKey: props.rowKey,
  defaultSelectedRows: props.defaultSelectedRows,
  emit: emit as any,
});

// 使用选择逻辑 hook
const selection = useTableSelection(selectionConfig);

// 使用事件处理 hook（仅当未启用区域选择时）
const tableEvents = !props.enableAreaSelection
  ? useTableEvents({
      data: props.data,
      columns: props.columns,
      emit: emit as any,
    })
  : null;

// 使用区域选择 hook（仅当启用时）
const areaSelection = useAreaSelection({
  data: props.data,
  columns: props.columns,
  enabled: props.enableAreaSelection,
  emit: emit as any,
});

function handleCellContextMenu(
  event: MouseEvent,
  row: any,
  column: any,
  rowIndex: number,
  colIndex: number
) {
  emit('cellContextMenu', event, row, column, rowIndex, colIndex);
}

// 设置TextareaCell引用
function setTextareaCellRef(el: any, rowIndex: number, colIndex: number) {
  const key = `${rowIndex}-${colIndex}`;
  if (el) {
    textareaCellRefs.value[key] = el;
  } else {
    delete textareaCellRefs.value[key];
  }
}

function handleCellClick(column: any, rowIndex: number, colIndex: number) {
  if (column.type === 'textarea') {
    // 获取对应的TextareaCell引用并触发编辑模式
    const cellRef = textareaCellRefs.value[`${rowIndex}-${colIndex}`];
    // console.log('点击textarea单元格:', { rowIndex, colIndex, cellRef, hasEnterEditMode: !!cellRef?.enterEditMode });
    if (cellRef && cellRef.enterEditMode) {
      cellRef.enterEditMode();
    } else {
      console.warn('未找到TextareaCell引用或enterEditMode方法');
    }
  }
  // 其他类型的单元格点击逻辑可以在这里处理
}

// 键盘事件处理
function handleTextareaKeydown(
  row: any,
  column: any,
  event: KeyboardEvent,
  rowIndex: number,
  colIndex: number
) {
  // 键盘事件现在由TextareaCell内部处理
  // 这里只需要转发事件
  emit('textareaKeydown', { row, column, event, rowIndex, colIndex });
}

const initUpdateTableConfig = () => {
  setTimeout(() => {
    // 初始化hooks
    if (areaSelection) {
      areaSelection.updateEventBindings({
        data: props.data,
        columns: props.columns,
        enabled: props.enableAreaSelection,
        emit: emit as any,
      });
      areaSelection?.clearAreaSelection?.();
    }
    selection.updateOptions({
      data: props.data,
      rowKey: props.rowKey,
      defaultSelectedRows: props.defaultSelectedRows,
      emit: emit as any,
    });
    selection.clearSelection();
  }, 100);
};

// 生命周期管理
onMounted(() => {
  initUpdateTableConfig();
});

onUnmounted(() => {
  if (areaSelection && areaSelection.unbindEvents) {
    areaSelection.unbindEvents();
  }
});

// 获取单元格值
function getCellValue(row: any, prop: string) {
  return row[prop] ?? '';
}

// 更新单元格值
function updateCellValue(row: any, prop: string | undefined, value: string) {
  if (prop) {
    row[prop] = value;
  }
}

// TextareaCell编辑开始事件
function handleTextareaEditStart(
  row: any,
  column: any,
  rowIndex: number,
  colIndex: number
) {
  emit('textareaEditStart', { row, column, rowIndex, colIndex });
}

// TextareaCell编辑结束事件
function handleTextareaEditEnd(
  row: any,
  column: any,
  rowIndex: number,
  colIndex: number
) {
  emit('textareaEditEnd', { row, column, rowIndex, colIndex });
}

// Textarea 事件处理方法
function handleTextareaInput(
  row: any,
  column: any,
  value: string,
  event: Event,
  rowIndex: number,
  colIndex: number
) {
  emit('textareaInput', { row, column, value, event, rowIndex, colIndex });
}

function handleTextareaChange(
  row: any,
  column: any,
  value: string,
  event: Event,
  rowIndex: number,
  colIndex: number
) {
  emit('textareaChange', { row, column, value, event, rowIndex, colIndex });
}

function handleTextareaFocus(
  row: any,
  column: any,
  event: FocusEvent,
  rowIndex: number,
  colIndex: number
) {
  emit('textareaFocus', { row, column, event, rowIndex, colIndex });
}

function handleTextareaBlur(
  row: any,
  column: any,
  event: FocusEvent,
  rowIndex: number,
  colIndex: number
) {
  emit('textareaBlur', { row, column, event, rowIndex, colIndex });
}

// Toolbar 相关计算属性和方法
const computedToolbarConfig = computed<TableToolbarProps>(() => {
  const defaultConfig: TableToolbarProps = {
    title: '数据表格',
    description: '当前数据概览',
    totalRows: props.data.length,
    showAreaSelectionToggle: true,
    showTableInfo: true,
    showSelectionInfo: true,
    showRefresh: false,
    showSettings: false,
    enableAreaSelection: props.enableAreaSelection,
    selectedCount: selection.selectedRows.value.length,
    selectedAreaCount: areaSelection?.selectedCells.value?.size || 0,
    refreshLoading: false,
  };

  return { ...defaultConfig, ...props.toolbarConfig };
});

// 区域选择开关变化
function handleAreaSelectionToggle(value: boolean) {
  emit('areaSelectionToggle', value);
}

// 工具栏刷新按钮
function handleToolbarRefresh() {
  emit('toolbarRefresh');
}

// 工具栏设置按钮
function handleToolbarSettings() {
  emit('toolbarSettings');
}

// 暴露给外部的方法
defineExpose({
  // 行选择相关
  clearSelection: selection.clearSelection,
  selectAll: selection.selectAll,
  toggleRowSelection: selection.toggleRowSelectionByRow,
  setSelectedRows: selection.setSelectedRows,
  getSelectedRows: selection.selectedRows,
  // 区域选择相关
  clearAreaSelection: () => areaSelection?.clearAreaSelection?.(),
  getSelectedCellPositions: () => areaSelection?.selectedCellPositions || [],
  initUpdateTableConfig,
});
</script>

<style scoped>
.custom-table-wrapper {
  position: relative;
  overflow: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
}

/* 区域选择模式样式 */
.custom-table.area-selection-enabled {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.custom-table.area-selection-enabled .table-cell {
  cursor: crosshair;
}

.custom-table.area-selection-enabled .table-cell.checkbox-column,
.custom-table.area-selection-enabled .table-cell.index-column {
  cursor: default;
}

/* 表格边框 */
.custom-table.table-border {
  border: 1px solid #ebeef5;
}

.custom-table.table-border .table-header-cell {
  border-right: 1px solid #ebeef5;
}

.custom-table.table-border .table-cell {
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.custom-table.table-border .table-header-cell:last-child,
.custom-table.table-border .table-cell:last-child {
  border-right: none;
}

/* 表头样式 */
.table-header {
  background-color: #f5f7fa;
}

.table-header-cell {
  padding: 12px 8px;
  text-align: left;
  font-weight: 500;
  color: #909399;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  user-select: none;
}

/* 复选框列和序号列样式 */
.table-header-cell.checkbox-column,
.table-cell.checkbox-column {
  width: 48px;
  text-align: center;
  padding: 8px;
}

.table-header-cell.index-column,
.table-cell.index-column {
  width: 60px;
  text-align: center;
}

/* 表格行样式 */
.table-row {
  transition: background-color 0.25s ease;
}

.table-row:hover {
  background-color: #f5f7fa;
}

.table-row-striped {
  background-color: #fafafa;
}

.table-row-striped:hover {
  background-color: #f5f7fa;
}

.table-row-selected {
  background-color: #ecf5ff;
}

.table-row-selected:hover {
  background-color: #d9ecff;
}

/* 单元格样式 */
.table-cell {
  /* padding: 12px 8px; */
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  vertical-align: middle;
  position: relative;
  cursor: default;
}

.cell-content {
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
  padding: 4px;
  box-sizing: border-box;
}

.textarea-cell {
  height: 100%;
}

/* 区域选择样式 */
.table-cell.area-selected {
  background-color: rgba(24, 144, 255, 0.1) !important;
  position: relative;
}

.table-cell.area-selected::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid #1890ff;
  pointer-events: none;
  box-sizing: border-box;
}

/* 避免区域选择与行选择样式冲突 */
.table-row-selected .table-cell.area-selected {
  background-color: rgba(24, 144, 255, 0.15) !important;
}

/* 带 Toolbar 的表格样式 */
.custom-table.with-toolbar {
  border-top: none;
  border-radius: 0 0 6px 6px;
}

/* Textarea 列样式 */
.table-cell.textarea-column {
  padding: 4px;
  vertical-align: top;
}

/* 移除可编辑单元格样式，现在由TextareaCell组件内部处理 */

/* Textarea 列被选中时的样式 */
.table-cell.textarea-column.area-selected .editable-cell {
  background-color: rgba(24, 144, 255, 0.05);
}

.table-cell.textarea-column.area-selected .textarea-input {
  border-color: #1890ff;
  box-shadow: 0 0 0 1px rgba(24, 144, 255, 0.2);
}

/* 空数据样式 */
.table-body:empty::after {
  content: '暂无数据';
  display: block;
  text-align: center;
  color: #909399;
  padding: 40px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-table {
    font-size: 12px;
  }

  .table-header-cell,
  .table-cell {
    padding: 8px 6px;
  }

  .table-header-cell.checkbox-column,
  .table-cell.checkbox-column {
    padding: 6px 4px;
  }
}
</style>
