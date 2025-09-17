import { ref } from 'vue';

export function useTableEvents() {
  const eventInfo = ref('等待事件触发...');

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

  return {
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
  };
}
