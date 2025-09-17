import { onMounted, onUnmounted } from 'vue';
import type { TableEventEmits, UseTableEventsOptions } from '../types';

export function useTableEvents(options: UseTableEventsOptions) {
  const { data, columns, emit, tableSelector = '.custom-table' } = options;

  // 处理单元格点击
  function handleCellClick(event: Event) {
    const mouseEvent = event as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    const cell = target.closest('.table-cell') as HTMLElement;
    if (!cell) return;

    const rowIndex = parseInt(cell.getAttribute('data-row') || '0');
    const colIndex = parseInt(cell.getAttribute('data-col') || '0');
    const type = cell.getAttribute('data-type') || '';

    // 如果是复选框列，不触发cellClick事件
    if (type === 'checkbox') return;

    const row = data[rowIndex];
    const column = columns[colIndex];

    emit('cellClick', row, column, rowIndex, colIndex, mouseEvent);
  }

  // 处理单元格鼠标按下
  function handleCellMousedown(event: Event) {
    const mouseEvent = event as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    const cell = target.closest('.table-cell') as HTMLElement;
    if (!cell) return;

    const rowIndex = parseInt(cell.getAttribute('data-row') || '0');
    const colIndex = parseInt(cell.getAttribute('data-col') || '0');
    const type = cell.getAttribute('data-type') || '';

    // 如果是复选框列，不触发cellMousedown事件
    if (type === 'checkbox') return;

    const row = data[rowIndex];
    const column = columns[colIndex];

    emit('cellMousedown', row, column, rowIndex, colIndex, mouseEvent);
  }

  // 处理单元格鼠标移动
  function handleCellMousemove(event: Event) {
    const mouseEvent = event as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    const cell = target.closest('.table-cell') as HTMLElement;
    if (!cell) return;

    const rowIndex = parseInt(cell.getAttribute('data-row') || '0');
    const colIndex = parseInt(cell.getAttribute('data-col') || '0');

    const row = data[rowIndex];
    const column = columns[colIndex];

    emit('cellMousemove', row, column, rowIndex, colIndex, mouseEvent);
  }

  // 处理单元格鼠标释放
  function handleCellMouseup(event: Event) {
    const mouseEvent = event as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    const cell = target.closest('.table-cell') as HTMLElement;
    if (!cell) return;

    const rowIndex = parseInt(cell.getAttribute('data-row') || '0');
    const colIndex = parseInt(cell.getAttribute('data-col') || '0');

    const row = data[rowIndex];
    const column = columns[colIndex];

    emit('cellMouseup', row, column, rowIndex, colIndex, mouseEvent);
  }

  // 绑定事件监听器
  function bindEvents() {
    const table = document.querySelector(tableSelector);
    if (table) {
      table.addEventListener('click', handleCellClick);
      table.addEventListener('mousedown', handleCellMousedown);
      table.addEventListener('mousemove', handleCellMousemove);
      table.addEventListener('mouseup', handleCellMouseup);
    }
  }

  // 移除事件监听器
  function unbindEvents() {
    const table = document.querySelector(tableSelector);
    if (table) {
      table.removeEventListener('click', handleCellClick);
      table.removeEventListener('mousedown', handleCellMousedown);
      table.removeEventListener('mousemove', handleCellMousemove);
      table.removeEventListener('mouseup', handleCellMouseup);
    }
  }

  // 生命周期
  onMounted(() => {
    bindEvents();
  });

  onUnmounted(() => {
    unbindEvents();
  });

  return {
    bindEvents,
    unbindEvents
  };
}
