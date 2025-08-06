import type {
  TableColumnCtx,
  TableProps,
  PaginationProps,
  SortState,
} from 'element-plus';

// 基于 Element Plus 的表格列配置接口
export interface TableColumn<
  T extends Record<string, any> = Record<string, any>,
> {
  /** 列类型 */
  type?: 'selection' | 'index' | 'expand';
  /** 字段名，对应列内容的字段名 */
  prop?: keyof T | string;
  /** 显示的标题 */
  label?: string;
  /** 列宽度 */
  width?: string | number;
  /** 列最小宽度 */
  minWidth?: string | number;
  /** 列最大宽度 */
  maxWidth?: string | number;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 当内容过长被隐藏时显示 tooltip */
  showOverflowTooltip?: boolean;
  /** 是否可排序 */
  sortable?: boolean | 'custom';
  /** 排序方法 */
  sortMethod?: (a: any, b: any) => number;
  /** 指定数据按照哪个属性进行排序 */
  sortBy?: string | ((row: T, index: number) => string);
  /** 数据在排序时所使用排序策略的轮转顺序 */
  sortOrders?: ('ascending' | 'descending' | null)[];
  /** 是否可筛选 */
  filterable?: boolean;
  /** 筛选选项 */
  filters?: Array<{ text: string; value: any }>;
  /** 筛选方法 */
  filterMethod?: (value: any, row: T, column: TableColumnCtx<T>) => boolean;
  /** 筛选弹出框的定位 */
  filterPlacement?: string;
  /** 是否多选 */
  filterMultiple?: boolean;
  /** 是否固定列 */
  fixed?: boolean | 'left' | 'right';
  /** 对应列是否可以通过拖拽改变宽度 */
  resizable?: boolean;
  /** 列标题 Label 区域渲染使用的 Function */
  renderHeader?: (data: { column: TableColumnCtx<T>; $index: number }) => any;
  /** 自定义插槽名称 */
  slotName?: string;
  /** 子列配置（多级表头） */
  children?: TableColumn<T>[];
  /** 额外的列属性 */
  columnProps?: Record<string, any>;
  /** 列是否可见 */
  visible?: boolean;
  /** 自定义渲染函数 */
  formatter?: (
    row: T,
    column: TableColumn<T>,
    cellValue: any,
    index: number
  ) => string | number;
}

// 分页布局选项
export type PaginationLayout =
  | 'sizes'
  | 'prev'
  | 'pager'
  | 'next'
  | 'jumper'
  | 'total'
  | 'slot';

// 基于 Element Plus 的分页配置接口
export interface PagingColumn extends Partial<PaginationProps> {
  /** 分页组件布局，子组件名用逗号分隔 */
  layout?: string;
  /** 每页显示个数选择器的选项设置 */
  pageSizes?: number[];
  /** 每页显示条目个数 */
  pageSize?: number;
  /** 页码按钮的数量，当总页数超过该值时会折叠 */
  pagerCount?: number;
  /** 是否为分页按钮添加背景色 */
  background?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 只有一页时是否隐藏 */
  hideOnSinglePage?: boolean;
}

// 表格配置接口
export interface TableConfig<
  T extends Record<string, any> = Record<string, any>,
> {
  /** 表格列配置 */
  tableColumn: TableColumn<T>[];
  /** 分页配置 */
  pagingColumn?: PagingColumn;
}

// 分页参数接口
export interface PaginationParams {
  /** 当前页码 */
  page?: number;
  /** 每页显示条目个数 */
  limit?: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc';
  /** 其他查询参数 */
  [key: string]: any;
}

// 表格事件接口
export interface BaseTableEmits {
  /** 分页参数更新 */
  'update:modelValue': [value: PaginationParams];
  /** 搜索事件 */
  search: [params: PaginationParams];
  changePage: [params: PaginationParams];
  /** 行点击事件 */
  'row-click': [row: any, column: TableColumn, event: Event];
  /** 行双击事件 */
  'row-dblclick': [row: any, column: TableColumn, event: Event];
  /** 选择项发生变化 */
  'selection-change': [selection: any[]];
  /** 排序发生变化 */
  'sort-change': [{ column: TableColumn; prop: string; order: string | null }];
}

// 基于 Element Plus 的 Props 接口
export interface BaseTableProps<
  T extends Record<string, any> = Record<string, any>,
> extends Partial<TableProps<T>> {
  /** 表格数据 */
  data: T[];
  /** 表格配置 */
  config: TableConfig<T>;
  /** 分页参数（双向绑定） */
  modelValue?: PaginationParams;
  /** 总条目数 */
  total?: number;
  /** 是否显示加载中 */
  loading?: boolean;
  /** 表格高度 */
  height?: string | number;
  /** 表格最大高度 */
  maxHeight?: string | number;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 空数据时显示的文本内容 */
  emptyText?: string;
}
