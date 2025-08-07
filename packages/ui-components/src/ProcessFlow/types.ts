export interface ProcessStep {
  /** 步骤唯一标识 */
  id?: string | number;
  /** 步骤标题 */
  title?: string;
  /** 步骤描述 */
  description?: string;
  /** 步骤状态 */
  status?: 'active' | 'completed' | 'error' | 'disabled' | 'pending';
  /** 自定义图标 */
  icon?: string;
  /** 是否可点击 */
  clickable?: boolean;
  /** 自定义数据 */
  data?: any;
  /** 允许任意字段 */
  [key: string]: any;
}

export interface FieldConfig {
  /** 标题字段名，默认 'title' */
  titleField?: string;
  /** 描述字段名，默认 'description' */
  descriptionField?: string;
  /** 状态字段名，默认 'status' */
  statusField?: string;
  /** 图标字段名，默认 'icon' */
  iconField?: string;
  /** ID字段名，默认 'id' */
  idField?: string;
}

export interface ProcessFlowProps {
  /** 流程步骤数据 */
  steps: ProcessStep[];
  /** 是否垂直布局 */
  vertical?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
  /** 字段配置 */
  fieldConfig?: FieldConfig;
  /** 自定义主题颜色 */
  primaryColor?: string;
  /** 成功状态颜色 */
  successColor?: string;
  /** 错误状态颜色 */
  errorColor?: string;
}

export interface ProcessFlowEmits {
  /** 步骤点击事件 */
  stepClick: [step: ProcessStep, index: number];
  /** 步骤状态改变事件 */
  statusChange: [step: ProcessStep, index: number, oldStatus: string];
}
