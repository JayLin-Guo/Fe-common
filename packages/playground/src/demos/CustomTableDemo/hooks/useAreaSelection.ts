import { ref, computed } from 'vue';

export function useAreaSelection() {
  // 选中的行数据
  const selectedRows = ref<any[]>([]);

  // 选中的单元格区域
  const selectedCellPositions = ref<any[]>([]);

  // 区域选择开关
  const enableAreaSelection = ref(true);

  // 当前选中的区域
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

  // 选择变化事件
  function onSelectionChange(selection: any[]) {
    selectedRows.value = selection;
    console.log('Selection changed:', selection);
  }

  // 单行选择事件
  function onSelect(selection: any[], row: any) {
    console.log('Row select:', { selection, row });
  }

  // 全选事件
  function onSelectAll(selection: any[]) {
    console.log('Select all:', selection);
  }

  // 区域选择开始事件
  function onAreaSelectionStart(startCell: any) {
    console.log('Area selection start:', startCell);
  }

  // 区域选择变化事件
  function onAreaSelectionChange(selection: any[]) {
    selectedCellPositions.value = selection;
    currentSelectedArea.value = selection;
    console.log('Area selection change:', selection);
  }

  // 区域选择结束事件
  function onAreaSelectionEnd(selection: any[]) {
    selectedCellPositions.value = selection;
    console.log('Area selection end:', selection);
  }

  return {
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
  };
}
