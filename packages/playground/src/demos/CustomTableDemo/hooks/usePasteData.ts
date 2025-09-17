import { ref, computed, onMounted, onUnmounted, Ref } from 'vue';
import { TableColumn } from '@jr/ui-components';

export function usePasteData(
  tableColumns: Ref<TableColumn[]>,
  currentSelectedArea: any,
  updateTableData: any
) {
  // 粘贴功能相关
  const pasteDialogVisible = ref(false);
  const pasteContent = ref('');
  const parsedData = ref<any[]>([]);

  // 计算属性：预期数据格式
  const expectedDataFormat = computed(() => {
    if (currentSelectedArea.value.length === 0) return '';

    const columns: any = [
      ...new Set(currentSelectedArea.value.map((cell: any) => cell.col)),
    ].sort();
    const columnLabels = columns.map((colIndex: number) => {
      const column = tableColumns.value.find(
        (_: any, index: number) => index === colIndex
      );
      return column?.label || `列${colIndex + 1}`;
    });

    return `${columnLabels.join(' | ')}`;
  });

  // 计算属性：预览列
  const previewColumns = computed(() => {
    if (currentSelectedArea.value.length === 0) return [];

    const columns: any = [
      ...new Set(currentSelectedArea.value.map((cell: any) => cell.col)),
    ].sort();
    return columns.map((colIndex: number) => {
      const column = tableColumns.value.find(
        (_: any, index: number) => index === colIndex
      );
      return {
        label: column?.label || `列${colIndex + 1}`,
        prop: column?.prop || `col${colIndex}`,
        type: column?.type,
      };
    });
  });

  // 计算属性：是否有无效数据
  const hasInvalidData = computed(() => {
    return parsedData.value.some((row: any) =>
      row.some((cell: any) => !cell.valid)
    );
  });

  // 粘贴功能相关方法
  function handlePaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    if (pastedText) {
      console.log('检测到粘贴事件，内容长度:', pastedText.length);
      setTimeout(() => {
        parseClipboardData(pastedText);
      }, 100);
    }
  }

  function parseClipboardData(text: string) {
    console.log('解析粘贴数据:', text);

    const rows = text.trim().split('\n');
    const parsed: any[] = [];

    const targetColumns = [
      ...new Set(currentSelectedArea.value.map((cell: any) => cell.col)),
    ].sort();

    rows.forEach((row, rowIndex) => {
      console.log(`正在解析第${rowIndex + 1}行: "${row}"`);

      let cells: string[] = [];

      // 方法1：尝试2个或更多空格分隔
      cells = row
        .split(/\s{2,}/)
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      console.log(
        `  多空格分割结果: [${cells.join(', ')}] (${cells.length}列)`
      );

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
        const column = tableColumns.value[colIndex as number];
        const cellValue = cells[cellIndex] || '';

        // 数据验证
        let isValid = true;
        let validatedValue = cellValue;

        // 根据列类型进行验证
        if (column?.type === 'textarea') {
          validatedValue = cellValue;
        } else if (column?.prop === 'name') {
          if (!/^[\u4e00-\u9fa5]{2,10}$/.test(cellValue)) {
            isValid = false;
          }
          validatedValue = cellValue;
        } else if (column?.prop === 'id' && cellValue.length === 18) {
          if (!/^\d{17}[\dXx]$/.test(cellValue)) {
            isValid = false;
          }
          validatedValue = cellValue;
        } else if (
          column?.prop === 'phone' ||
          /phone|tel|mobile/i.test(column?.prop || '')
        ) {
          if (!/^1[3-9]\d{9}$/.test(cellValue)) {
            isValid = false;
          }
          validatedValue = cellValue;
        } else if (column?.prop === 'age') {
          const num = parseInt(cellValue);
          if (isNaN(num) || num < 0 || num > 150) {
            isValid = false;
          } else {
            validatedValue = num.toString();
          }
        } else if (column?.prop === 'id' && cellValue.length !== 18) {
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
    if (
      parsedData.value.length === 0 ||
      currentSelectedArea.value.length === 0
    ) {
      return;
    }

    console.log('确认粘贴数据');

    const targetRows = [
      ...new Set(currentSelectedArea.value.map((cell: any) => cell.row)),
    ].sort();
    const targetColumns = [
      ...new Set(currentSelectedArea.value.map((cell: any) => cell.col)),
    ].sort();

    const updateData: any[] = [];

    parsedData.value.forEach((row, rowIndex) => {
      if (rowIndex < targetRows.length) {
        const targetRowIndex = targetRows[rowIndex];

        row.forEach((cell: any, cellIndex: number) => {
          if (cellIndex < targetColumns.length && cell.valid) {
            const targetColIndex = targetColumns[cellIndex];
            const column = tableColumns.value[targetColIndex as number];

            if (column?.prop) {
              updateData.push({
                rowIndex: targetRowIndex,
                colIndex: targetColIndex,
                prop: column.prop,
                oldValue: cell.originalValue,
                newValue: cell.value,
              });
            }
          }
        });
      }
    });

    console.log('准备提交的数据:', updateData);
    handleBatchUpdate(updateData);

    // 关闭弹窗
    pasteDialogVisible.value = false;
    pasteContent.value = '';
    parsedData.value = [];
  }

  // 模拟后端批量更新处理
  function handleBatchUpdate(updateData: any[]) {
    console.log('模拟后端批量更新:', updateData);
    updateTableData(updateData);
    alert(
      `模拟后端处理完成！更新了 ${updateData.length} 个单元格\n\n数据已打印到控制台`
    );
  }

  // 全局键盘事件监听
  function handleGlobalKeydown(event: KeyboardEvent) {
    if (
      event.ctrlKey &&
      event.key === 'v' &&
      currentSelectedArea.value.length > 0
    ) {
      const target = event.target as HTMLElement;

      if (
        target.tagName === 'TEXTAREA' &&
        target.closest('.paste-dialog-content')
      ) {
        return;
      }

      if (target.tagName === 'TEXTAREA' && target.closest('.custom-table')) {
        console.log('在表格 textarea 内粘贴，不触发批量修改');
        return;
      }

      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        console.log('在输入元素内粘贴，不触发批量修改');
        return;
      }

      event.preventDefault();
      readClipboardAndOpenDialog();
    }
  }

  // 读取剪贴板内容并打开弹窗
  async function readClipboardAndOpenDialog() {
    console.log('=== 开始读取剪贴板 ===');

    try {
      let clipboardText = '';

      console.log('检查剪贴板API支持情况:');
      console.log('- navigator.clipboard:', !!navigator.clipboard);
      console.log('- readText方法:', !!navigator.clipboard?.readText);
      console.log('- 是否HTTPS:', location.protocol === 'https:');
      console.log('- 是否localhost:', location.hostname === 'localhost');

      if (navigator.clipboard && navigator.clipboard.readText) {
        console.log('使用现代 Clipboard API...');
        clipboardText = await navigator.clipboard.readText();
        console.log(
          'Clipboard API 读取成功，内容预览:',
          clipboardText.substring(0, 100) + '...'
        );
      } else {
        console.log('Clipboard API 不可用，尝试降级方案...');

        const tempTextarea = document.createElement('textarea');
        tempTextarea.style.position = 'absolute';
        tempTextarea.style.left = '-9999px';
        tempTextarea.style.top = '-9999px';
        tempTextarea.style.opacity = '0';
        document.body.appendChild(tempTextarea);

        tempTextarea.focus();
        tempTextarea.select();

        console.log('临时textarea已创建并获得焦点');

        const pasteSuccess = document.execCommand('paste');
        console.log('execCommand paste 结果:', pasteSuccess);

        clipboardText = tempTextarea.value;
        console.log(
          '降级方案读取结果预览:',
          clipboardText.substring(0, 100) + '...'
        );

        document.body.removeChild(tempTextarea);
      }

      console.log('最终读取的内容长度:', clipboardText.length);

      if (clipboardText.length === 0) {
        throw new Error('读取到的剪贴板内容为空');
      }

      pasteDialogVisible.value = true;
      pasteContent.value = clipboardText;
    } catch (error) {
      console.error('读取剪贴板失败详情:', error);
      const err = error as Error;
      console.log('错误类型:', err.name);
      console.log('错误信息:', err.message);

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

  return {
    pasteDialogVisible,
    pasteContent,
    parsedData,
    expectedDataFormat,
    previewColumns,
    hasInvalidData,
    handlePaste,
    confirmPasteData,
  };
}
