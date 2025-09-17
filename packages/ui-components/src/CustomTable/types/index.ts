// 表格列定义类型
export interface TableColumn {
  prop?: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'index' | 'checkbox' | 'textarea' | undefined;
  disableAreaSelect?: boolean; // 是否禁用区域选择
  // textarea 专用配置
  textareaConfig?: {
    placeholder?: string;
    editPlaceholder?: string;
    disabled?: boolean;
    rows?: number;
    autoResize?: boolean;
    showCount?: boolean;
    maxlength?: number;
    formatter?: (value: string) => string; // 格式化函数
    enablePasteFormatter?: boolean; // 是否在粘贴时应用格式化
    editMode?: 'click' | 'always' | 'never';
    autoExitOnBlur?: boolean;
    autoExitOnEscape?: boolean;
    autoExitOnCtrlEnter?: boolean;
    maxHeight?: number | string; // 最大高度
    minHeight?: number | string; // 最小高度
  };
  // 列头自定义渲染
  headerSlot?: string; // 列头插槽名称
  headerRender?: (column: TableColumn, columnIndex: number) => string | any; // 列头渲染函数，支持返回HTML字符串或VNode
}

// 表格组件 Props
export interface TableProps {
  data: any[];
  columns: TableColumn[];
  border?: boolean;
  striped?: boolean;
  height?: string;
  rowKey?: string | ((row: any) => string | number);
  defaultSelectedRows?: any[];
  enableAreaSelection?: boolean; // 是否启用区域选择

  // Toolbar 相关配置
  showToolbar?: boolean;
  toolbarConfig?: Partial<TableToolbarProps>;
}

// 选择相关事件类型
export interface SelectionEmits {
  select: [selection: any[], row: any];
  selectAll: [selection: any[]];
  selectionChange: [selection: any[]];
}

// 表格事件类型
export interface TableEventEmits {
  cellClick: [row: any, column: TableColumn, rowIndex: number, colIndex: number, event: MouseEvent];
  cellMousedown: [row: any, column: TableColumn, rowIndex: number, colIndex: number, event: MouseEvent];
  cellMousemove: [row: any, column: TableColumn, rowIndex: number, colIndex: number, event: MouseEvent];
  cellMouseup: [row: any, column: TableColumn, rowIndex: number, colIndex: number, event: MouseEvent];
}

// 区域选择相关事件类型
export interface AreaSelectionEmits {
  areaSelectionStart: [startCell: CellPosition];
  areaSelectionChange: [selection: CellPosition[]];
  areaSelectionEnd: [selection: CellPosition[]];
}

// Textarea 事件类型
export interface TextareaEmits {
  textareaInput: [data: { row: any; column: any; value: string; event: Event; rowIndex: number; colIndex: number }];
  textareaChange: [data: { row: any; column: any; value: string; event: Event; rowIndex: number; colIndex: number }];
  textareaFocus: [data: { row: any; column: any; event: FocusEvent; rowIndex: number; colIndex: number }];
  textareaBlur: [data: { row: any; column: any; event: FocusEvent; rowIndex: number; colIndex: number }];
  textareaKeydown: [data: { row: any; column: any; event: KeyboardEvent; rowIndex: number; colIndex: number }];
  textareaEditStart: [data: { row: any; column: any; rowIndex: number; colIndex: number }];
  textareaEditEnd: [data: { row: any; column: any; rowIndex: number; colIndex: number }];
}

// Toolbar 工具栏事件类型
export interface ToolbarEmits {
  areaSelectionToggle: [value: boolean];
  toolbarRefresh: [];
  toolbarSettings: [];
}

// cell右键菜单事件类型
export interface CellContextMenuEmits {
  cellContextMenu: [event: MouseEvent, row: any, column: TableColumn, rowIndex: number, colIndex: number];
}

// 所有事件类型的联合
export type AllTableEmits = SelectionEmits &
  TableEventEmits &
  AreaSelectionEmits &
  TextareaEmits &
  ToolbarEmits &
  CellContextMenuEmits;

// TextareaCell 组件 Props
export interface TextareaCellProps {
  modelValue?: string;
  placeholder?: string;
  editPlaceholder?: string;
  disabled?: boolean;
  rows?: number;
  autoResize?: boolean;
  showCount?: boolean;
  maxlength?: number;
  formatter?: (value: string) => string; // 格式化函数，用于处理输入内容
  enablePasteFormatter?: boolean; // 是否在粘贴时应用格式化
  editMode?: 'click' | 'always' | 'never';
  autoExitOnBlur?: boolean;
  autoExitOnEscape?: boolean;
  autoExitOnCtrlEnter?: boolean;
  maxHeight?: number | string; // 最大高度
  minHeight?: number | string; // 最小高度
  disableAreaSelect?: boolean; // 是否禁用区域选择
}

// 单元格位置信息
export interface CellPosition {
  row: number;
  col: number;
  rowData?: any;
  columnData?: TableColumn;
}

// 区域选择范围
export interface SelectionRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

// 表格选择 Hook 配置
export interface UseTableSelectionOptions {
  data: any[];
  rowKey: string | ((row: any) => string | number);
  defaultSelectedRows?: any[];
  emit: (event: keyof SelectionEmits, ...args: any[]) => void;
}

// 表格事件 Hook 配置
export interface UseTableEventsOptions {
  data: any[];
  columns: TableColumn[];
  emit: (event: keyof TableEventEmits, ...args: any[]) => void;
  tableSelector?: string;
}

// 区域选择 Hook 配置
export interface UseAreaSelectionOptions {
  data: any[];
  columns: TableColumn[];
  enabled: boolean;
  emit: (event: keyof AreaSelectionEmits, ...args: any[]) => void;
  tableSelector?: string;
}

// 复选框组件 Props
export interface CheckboxCellProps {
  checked?: boolean;
  indeterminate?: boolean;
}

// 序号组件 Props
export interface IndexCellProps {
  index: number;
  startIndex?: number;
}

// Toolbar 工具栏组件的 Props
export interface TableToolbarProps {
  // 基本信息
  title?: string;
  description?: string;
  totalRows?: number;

  // 功能开关
  showAreaSelectionToggle?: boolean;
  showTableInfo?: boolean;
  showSelectionInfo?: boolean;
  showRefresh?: boolean;
  showSettings?: boolean;

  // 状态数据
  enableAreaSelection?: boolean;
  selectedCount?: number;
  selectedAreaCount?: number;
  refreshLoading?: boolean;

  // 样式配置
  activeColor?: string;
  inactiveColor?: string;
}

// Toolbar 工具栏组件的事件
export interface TableToolbarEmits {
  (e: 'update:enableAreaSelection', value: boolean): void;
  (e: 'refresh'): void;
  (e: 'settings'): void;
}

// 主表格组件的 Props
export interface CustomTableProps {
  data: any[];
  columns: TableColumn[];
  rowKey?: string;
  height?: string | number;
  maxHeight?: string | number;
  enableAreaSelection?: boolean;
  showOverflow?: 'tooltip' | 'hidden' | 'visible';

  // 新增 Toolbar 相关配置
  showToolbar?: boolean;
  toolbarConfig?: Partial<TableToolbarProps>;
}
