// 表格列配置接口
export interface TableColumn {
  type?: 'selection' | 'index' | 'expand'
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  slotName?: string
  children?: TableColumn[]
  columnProps?: Record<any, any>
}

// 分页配置接口
export interface PagingColumn {
  layout?: string
  pageSizes?: number[]
}

// 表格配置接口
export interface TableConfig {
  tableColumn: TableColumn[]
  pagingColumn?: PagingColumn
}

// 分页参数接口
export interface PaginationParams {
  page?: number
  limit?: number
}

// Props 接口
export interface BaseTableProps {
  data: any[]
  config: TableConfig
  modelValue?: PaginationParams
  total?: number
}
