import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import type { UseAreaSelectionOptions, CellPosition, SelectionRange } from '../types';

export function useAreaSelection(options: UseAreaSelectionOptions) {
  let { data, columns, enabled, emit, tableSelector = '.custom-table' } = options;

  // 拖拽状态
  const isDragging = ref(false);
  const startCell = ref<CellPosition | null>(null);
  const currentCell = ref<CellPosition | null>(null);
  const selectedCells = ref<Set<string>>(new Set());

  // 获取单元格键
  function getCellKey(row: number, col: number): string {
    return `${row}-${col}`;
  }

  // 从事件中获取单元格位置
  function getCellPositionFromEvent(event: MouseEvent): CellPosition | null {
    const target = event.target as HTMLElement;
    const cell = target.closest('.table-cell') as HTMLElement;
    if (!cell) return null;

    const row = parseInt(cell.getAttribute('data-row') || '0');
    const col = parseInt(cell.getAttribute('data-col') || '0');
    const type = cell.getAttribute('data-type') || '';

    // 跳过特殊类型的列
    if (type === 'checkbox' || type === 'index' || columns[col].disableAreaSelect) return null;

    return {
      row,
      col,
      rowData: data[row],
      columnData: columns[col]
    };
  }

  // 计算选择范围
  function calculateSelectionRange(start: CellPosition, end: CellPosition): SelectionRange {
    return {
      startRow: Math.min(start.row, end.row),
      endRow: Math.max(start.row, end.row),
      startCol: Math.min(start.col, end.col),
      endCol: Math.max(start.col, end.col)
    };
  }

  // 应用选择范围
  function applySelectionRange(range: SelectionRange) {
    selectedCells.value.clear();

    for (let row = range.startRow; row <= range.endRow; row++) {
      for (let col = range.startCol; col <= range.endCol; col++) {
        // 跳过特殊类型的列
        const column = columns[col];
        if (column && (column.type === 'checkbox' || column.type === 'index')) {
          continue;
        }

        const cellKey = getCellKey(row, col);

        selectedCells.value.add(cellKey);
      }
    }
  }

  // 获取当前选择的单元格位置列表
  const selectedCellPositions = computed(() => {
    const positions: CellPosition[] = [];

    selectedCells.value.forEach(cellKey => {
      const [rowStr, colStr] = cellKey.split('-');
      const row = parseInt(rowStr);
      const col = parseInt(colStr);

      if (row < data.length && col < columns.length) {
        positions.push({
          row,
          col,
          rowData: data[row],
          columnData: columns[col]
        });
      }
    });

    return positions;
  });

  // 检查单元格是否被选中
  function isCellSelected(row: number, col: number): boolean {
    return selectedCells.value.has(getCellKey(row, col));
  }

  // 清除区域选择
  function clearAreaSelection() {
    selectedCells.value.clear();
    isDragging.value = false;
    startCell.value = null;
    currentCell.value = null;
  }

  // 鼠标按下事件处理
  function handleMouseDown(event: Event) {
    const mouseEvent = event as MouseEvent;
    if (!enabled) return;

    const cellPosition = getCellPositionFromEvent(mouseEvent);
    if (!cellPosition) return;

    // 检查是否直接点击在textarea/input元素上
    const target = mouseEvent.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
      return; // 让输入元素正常工作，不启动区域选择
    }

    mouseEvent.preventDefault();

    // 清除之前的选择
    clearAreaSelection();

    // 开始新的拖拽选择
    isDragging.value = true;
    startCell.value = cellPosition;
    currentCell.value = cellPosition;

    // 选中起始单元格
    selectedCells.value.add(getCellKey(cellPosition.row, cellPosition.col));

    emit('areaSelectionStart', cellPosition);
    emit('areaSelectionChange', selectedCellPositions.value);

    // console.log('开始区域选择:', cellPosition);
  }

  // 全局鼠标移动事件
  function handleDocumentMouseMove(event: MouseEvent) {
    if (!isDragging.value || !startCell.value) return;

    const cellPosition = getCellPositionFromEvent(event);
    // console.log(cellPosition, 'cellPosition==================>>>');

    if (!cellPosition) return;

    // 只有当位置真正改变时才更新
    if (
      !currentCell.value ||
      cellPosition.row !== currentCell.value.row ||
      cellPosition.col !== currentCell.value.col ||
      !cellPosition.columnData?.disableAreaSelect
    ) {
      currentCell.value = cellPosition;
      const range = calculateSelectionRange(startCell.value, cellPosition);
      applySelectionRange(range);

      emit('areaSelectionChange', selectedCellPositions.value);
    }
  }

  // 全局鼠标释放事件
  function handleDocumentMouseUp() {
    if (!isDragging.value) return;

    isDragging.value = false;

    emit('areaSelectionEnd', selectedCellPositions.value);

    // console.log('结束区域选择');
  }

  // 绑定事件监听器
  function bindEvents() {
    if (!enabled) return;

    nextTick(() => {
      const table = document.querySelector(tableSelector);
      if (table) {
        table.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);
        // console.log('区域选择事件已绑定');
      }
    });
  }

  // 移除事件监听器
  function unbindEvents() {
    const table = document.querySelector(tableSelector);
    if (table) {
      table.removeEventListener('mousedown', handleMouseDown);
    }

    // 确保清除全局事件监听
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentMouseUp);
    // console.log('区域选择事件已解绑');
  }

  // 更新事件绑定
  function updateEventBindings(options: UseAreaSelectionOptions) {
    updateOptions(options);
    unbindEvents();
    if (enabled) {
      bindEvents();
    }
  }

  // 更新配置options
  function updateOptions(options: UseAreaSelectionOptions) {
    data = options.data;
    columns = options.columns;
    enabled = options.enabled;
    emit = options.emit;
  }

  // 生命周期
  onMounted(() => {
    if (enabled) {
      bindEvents();
    }
  });

  onUnmounted(() => {
    unbindEvents();
  });

  return {
    // 状态
    isDragging,
    selectedCells,
    selectedCellPositions,

    // 方法
    isCellSelected,
    clearAreaSelection,
    bindEvents,
    unbindEvents,
    updateEventBindings
  };
}
