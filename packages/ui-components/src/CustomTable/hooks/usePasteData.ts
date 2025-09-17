import { ref, computed } from 'vue';

export interface PasteDataOptions {
  // 数据解析配置
  delimiter?: string | RegExp;
  // 数据验证器
  validator?: (value: string, columnProp: string) => { valid: boolean; message?: string };
  // 是否自动去除空白字符
  trimWhitespace?: boolean;
}

export interface CellData {
  value: string;
  valid: boolean;
  message?: string;
}

export interface AreaInfo {
  row: number;
  col: number;
  prop: string;
  label: string;
}

export interface ParsedResult {
  success: boolean;
  data: CellData[][];
  rowCount: number;
  colCount: number;
  errors?: string[];
}

export interface ConfirmData {
  row: number;
  col: number;
  prop: string;
  value: string;
}

export function usePasteData(options: PasteDataOptions = {}) {
  // 响应式状态
  const pasteContent = ref('');
  const parsedData = ref<CellData[][]>([]);
  const isLoading = ref(false);
  const statusMessage = ref('');
  const statusType = ref<'success' | 'warning' | 'info' | 'error'>('info');

  // 默认配置
  const config = {
    delimiter: /\s+/,
    trimWhitespace: true,
    validator: () => ({ valid: true }),
    ...options
  };

  // 计算属性
  const hasInvalidData = computed(() => {
    return parsedData.value.some(row => row.some(cell => !cell.valid));
  });

  const isDataEmpty = computed(() => {
    return parsedData.value.length === 0;
  });

  const dataStats = computed(() => {
    return {
      rows: parsedData.value.length,
      cols: parsedData.value[0]?.length || 0,
      validCells: parsedData.value.flat().filter(cell => cell.valid).length,
      invalidCells: parsedData.value.flat().filter(cell => !cell.valid).length
    };
  });

  // 核心方法
  function parseClipboardData(text: string, selectedArea: AreaInfo[]): ParsedResult {
    console.log('开始解析粘贴数据:', text.substring(0, 100) + '...');

    if (!text.trim()) {
      parsedData.value = [];
      return { success: false, data: [], rowCount: 0, colCount: 0, errors: ['内容为空'] };
    }

    try {
      const rows = text.trim().split('\n');
      const parsed: CellData[][] = [];
      const errors: string[] = [];

      // 获取目标列信息
      const targetColumns = [...new Set(selectedArea.map(cell => cell.col))].sort();

      rows.forEach((row, rowIndex) => {
        console.log(`解析第${rowIndex + 1}行: "${row}"`);

        // 使用配置的分隔符分割
        const cells = row
          .split(config.delimiter)
          .map(cell => (config.trimWhitespace ? cell.trim() : cell))
          .filter(cell => cell !== '');

        const rowData: CellData[] = [];

        targetColumns.forEach((colIndex, index) => {
          const cellValue = cells[index] || '';
          const column = selectedArea.find(cell => cell.col === colIndex);

          // 应用验证器
          const validation = config.validator ? config.validator(cellValue, column?.prop || '') : { valid: true };

          if (!validation.valid && 'message' in validation && validation.message) {
            errors.push(`第${rowIndex + 1}行第${index + 1}列: ${validation.message}`);
          }

          rowData.push({
            value: cellValue,
            valid: validation.valid,
            message: 'message' in validation ? (validation.message as string) : undefined
          });
        });

        parsed.push(rowData);
      });

      parsedData.value = parsed;
      console.log('解析完成:', parsed.length, '行数据');

      return {
        success: true,
        data: parsed,
        rowCount: parsed.length,
        colCount: targetColumns.length,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      const errorMsg = `解析失败: ${error instanceof Error ? error.message : '未知错误'}`;
      console.error(errorMsg, error);
      return {
        success: false,
        data: [],
        rowCount: 0,
        colCount: 0,
        errors: [errorMsg]
      };
    }
  }

  async function readClipboard(): Promise<{ success: boolean; content?: string; error?: string }> {
    isLoading.value = true;
    statusMessage.value = '';

    try {
      let clipboardText = '';
      console.log('尝试读取剪贴板...');

      if (navigator.clipboard && navigator.clipboard.readText) {
        console.log('使用现代 Clipboard API...');
        clipboardText = await navigator.clipboard.readText();
      } else {
        console.log('Clipboard API 不可用，使用备用方法...');
        // 备用方法
        const tempTextarea = document.createElement('textarea');
        tempTextarea.style.position = 'absolute';
        tempTextarea.style.left = '-9999px';
        tempTextarea.style.opacity = '0';
        document.body.appendChild(tempTextarea);
        tempTextarea.focus();
        tempTextarea.select();
        const pasteSuccess = document.execCommand('paste');
        clipboardText = tempTextarea.value;
        document.body.removeChild(tempTextarea);

        if (!pasteSuccess || !clipboardText) {
          throw new Error('无法读取剪贴板内容');
        }
      }

      if (clipboardText.length === 0) {
        throw new Error('剪贴板内容为空');
      }

      pasteContent.value = clipboardText;
      statusMessage.value = `成功读取剪贴板内容 (${clipboardText.length} 个字符)`;
      statusType.value = 'success';

      return { success: true, content: clipboardText };
    } catch (error) {
      const err = error as Error;
      console.error('剪贴板读取失败:', err);

      let errorMsg = '剪贴板读取失败';
      if (err.name === 'NotAllowedError') {
        errorMsg = '浏览器拒绝访问剪贴板权限';
      } else if (err.name === 'NotSupportedError') {
        errorMsg = '浏览器不支持剪贴板 API';
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        errorMsg = '需要 HTTPS 环境才能自动读取剪贴板';
      }

      statusMessage.value = errorMsg;
      statusType.value = 'error';

      return { success: false, error: errorMsg };
    } finally {
      isLoading.value = false;
    }
  }

  function generateConfirmData(selectedArea: AreaInfo[]): ConfirmData[] {
    const confirmData: ConfirmData[] = [];

    parsedData.value.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const targetColumns = [...new Set(selectedArea.map(c => c.col))].sort();
        const colIndex = targetColumns[cellIndex];
        const cellInfo = selectedArea.find(c => c.col === colIndex);

        if (cellInfo) {
          const actualRowIndex = [...new Set(selectedArea.map(c => c.row))].sort()[rowIndex];
          if (actualRowIndex !== undefined) {
            confirmData.push({
              row: actualRowIndex,
              col: colIndex,
              prop: cellInfo.prop,
              value: cell.value
            });
          }
        }
      });
    });

    return confirmData;
  }

  function getAreaInfo(selectedArea: AreaInfo[]) {
    if (selectedArea.length === 0) {
      return {
        summary: '未选择区域',
        format: '无',
        rows: 0,
        cols: 0
      };
    }

    const rows = [...new Set(selectedArea.map(cell => cell.row))].sort();
    const cols = [...new Set(selectedArea.map(cell => cell.col))].sort();

    const summary = `${rows.length} 行 × ${cols.length} 列 (行 ${rows[0] + 1}-${rows[rows.length - 1] + 1})`;

    const format = cols
      .map(colIndex => {
        const cell = selectedArea.find(c => c.col === colIndex);
        return cell?.label || `列 ${colIndex + 1}`;
      })
      .join(' | ');

    return {
      summary,
      format,
      rows: rows.length,
      cols: cols.length
    };
  }

  function getPreviewColumns(selectedArea: AreaInfo[]) {
    if (selectedArea.length === 0) return [];

    const cols = [...new Set(selectedArea.map(cell => cell.col))].sort();
    return cols.map(colIndex => {
      const cell = selectedArea.find(c => c.col === colIndex);
      return {
        prop: cell?.prop || `col_${colIndex}`,
        label: cell?.label || `列 ${colIndex + 1}`
      };
    });
  }

  function clearData() {
    pasteContent.value = '';
    parsedData.value = [];
    statusMessage.value = '';
    statusType.value = 'info';
    isLoading.value = false;
  }

  function setStatus(message: string, type: typeof statusType.value = 'info') {
    statusMessage.value = message;
    statusType.value = type;
  }

  // 返回所有需要的状态和方法
  return {
    // 状态
    pasteContent,
    parsedData,
    isLoading,
    statusMessage,
    statusType,

    // 计算属性
    hasInvalidData,
    isDataEmpty,
    dataStats,

    // 方法
    parseClipboardData,
    readClipboard,
    generateConfirmData,
    getAreaInfo,
    getPreviewColumns,
    clearData,
    setStatus
  };
}

// 类型已在上面export interface中导出，无需重复导出;
