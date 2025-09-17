import { ref, computed, watch } from 'vue';
import type { SelectionEmits, UseTableSelectionOptions } from '../types';

export function useTableSelection(options: UseTableSelectionOptions) {
  let { data, rowKey, defaultSelectedRows, emit } = options;

  const tableData = ref<any[]>(options.data);
  // 选中的行键集合
  const selectedRowKeys = ref<Set<string | number>>(new Set());

  // 获取行的唯一键
  function getRowKey(row: any, index: number): string | number {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    if (typeof rowKey === 'string') {
      return row[rowKey] ?? index;
    }
    return index;
  }

  // 检查行是否被选中
  function isRowSelected(row: any, index: number): boolean {
    const key = getRowKey(row, index);
    return selectedRowKeys.value.has(key);
  }

  // 获取当前选中的行数据
  const selectedRows = computed(() => {
    return tableData.value.filter((row, index) => isRowSelected(row, index));
  });

  // 全选状态计算
  const isAllSelected = computed(() => {
    if (tableData.value.length === 0) return false;

    return tableData.value.every((row, index) => isRowSelected(row, index));
  });

  // 半选状态计算
  const isIndeterminate = computed(() => {
    const selectedCount = tableData.value.filter((row, index) => isRowSelected(row, index)).length;
    return selectedCount > 0 && selectedCount < tableData.value.length;
  });

  // 切换单行选择
  function toggleRowSelection(row: any, index: number) {
    const key = getRowKey(row, index);
    const wasSelected = selectedRowKeys.value.has(key);

    if (wasSelected) {
      selectedRowKeys.value.delete(key);
    } else {
      selectedRowKeys.value.add(key);
    }

    const selection = selectedRows.value;
    emit('select', selection, row);
    emit('selectionChange', selection);
  }

  // 切换全选
  function toggleSelectAll() {
    if (isAllSelected.value) {
      clearSelection();
    } else {
      selectAll();
    }
  }

  // 全选
  function selectAll() {
    selectedRowKeys.value.clear();

    tableData.value.forEach((row, index) => {
      const key = getRowKey(row, index);

      selectedRowKeys.value.add(key);
    });

    const selection = selectedRows.value;
    emit('selectAll', selection);
    emit('selectionChange', selection);
  }

  // 清空选择
  function clearSelection() {
    selectedRowKeys.value.clear();
    const selection = selectedRows.value;
    emit('selectAll', selection);
    emit('selectionChange', selection);
  }

  // 设置选中行（通过行数据）
  function setSelectedRows(rows: any[]) {
    selectedRowKeys.value.clear();
    rows.forEach(row => {
      const index = tableData.value.findIndex(dataRow => {
        const dataKey = getRowKey(dataRow, data.indexOf(dataRow));
        const rowKeyValue = getRowKey(row, 0);
        return dataKey === rowKeyValue;
      });
      if (index !== -1) {
        const key = getRowKey(row, index);
        selectedRowKeys.value.add(key);
      }
    });

    emit('selectionChange', selectedRows.value);
  }

  // 切换行选择状态（供外部调用）
  function toggleRowSelectionByRow(row: any, selected?: boolean) {
    const index = tableData.value.findIndex(dataRow => {
      const dataKey = getRowKey(dataRow, tableData.value.indexOf(dataRow));
      const rowKeyValue = getRowKey(row, 0);
      return dataKey === rowKeyValue;
    });

    if (index === -1) return;

    const key = getRowKey(row, index);
    const isSelected = selectedRowKeys.value.has(key);

    if (selected === undefined) {
      // 切换状态
      if (isSelected) {
        selectedRowKeys.value.delete(key);
      } else {
        selectedRowKeys.value.add(key);
      }
    } else {
      // 设置指定状态
      if (selected && !isSelected) {
        selectedRowKeys.value.add(key);
      } else if (!selected && isSelected) {
        selectedRowKeys.value.delete(key);
      }
    }

    const selection = selectedRows.value;
    emit('select', selection, row);
    emit('selectionChange', selection);
  }

  // 监听默认选中行的变化
  watch(
    () => defaultSelectedRows,
    newValue => {
      if (newValue && newValue.length > 0) {
        setSelectedRows(newValue);
      }
    },
    { immediate: true }
  );

  // 更新配置options
  function updateOptions(options: UseTableSelectionOptions) {
    tableData.value = options.data;
    rowKey = options.rowKey;
    defaultSelectedRows = options.defaultSelectedRows;
    emit = options.emit;
  }

  return {
    // 状态
    selectedRows,
    isAllSelected,
    isIndeterminate,

    // 方法
    updateOptions,
    isRowSelected,
    toggleRowSelection,
    toggleSelectAll,
    selectAll,
    clearSelection,
    setSelectedRows,
    toggleRowSelectionByRow,
    getRowKey
  };
}
