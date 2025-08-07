// 表单组件类型枚举
export enum FormComponentType {
  // 基础输入组件
  INPUT = 'input',
  TEXTAREA = 'textarea',
  INPUT_NUMBER = 'inputNumber',

  // 选择组件
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  CASCADER = 'cascader',
  TREE_SELECT = 'treeSelect',

  // 日期时间组件
  DATE_PICKER = 'datePicker',
  TIME_PICKER = 'timePicker',

  // 其他输入组件
  SLIDER = 'slider',
  RATE = 'rate',
  COLOR_PICKER = 'colorPicker',

  // 展示组件
  TEXT = 'txt',
  TITLE = 'title',
  BUTTON = 'button',
  TABLE = 'table',

  // 容器组件
  GRID = 'grid',
  DIV = 'div',
  CARD = 'card',
  TABS = 'tabs',
  FLEX = 'flex',
  DIVIDER = 'divider',
}

// Element Plus 组件映射
export const ELEMENT_COMPONENT_MAP: Record<string, string> = {
  [FormComponentType.INPUT]: 'el-input',
  [FormComponentType.TEXTAREA]: 'el-input',
  [FormComponentType.INPUT_NUMBER]: 'el-input-number',
  [FormComponentType.SELECT]: 'el-select',
  [FormComponentType.RADIO]: 'el-radio-group',
  [FormComponentType.CHECKBOX]: 'el-checkbox-group',
  [FormComponentType.SWITCH]: 'el-switch',
  [FormComponentType.CASCADER]: 'el-cascader',
  [FormComponentType.TREE_SELECT]: 'el-tree-select',
  [FormComponentType.DATE_PICKER]: 'el-date-picker',
  [FormComponentType.TIME_PICKER]: 'el-time-picker',
  [FormComponentType.SLIDER]: 'el-slider',
  [FormComponentType.RATE]: 'el-rate',
  [FormComponentType.COLOR_PICKER]: 'el-color-picker',
  [FormComponentType.BUTTON]: 'el-button',
  [FormComponentType.TEXT]: 'span',
  [FormComponentType.TITLE]: 'h3',
  [FormComponentType.TABLE]: 'base-table',
};

// 选项组件映射
export const OPTION_COMPONENT_MAP: Record<string, string> = {
  'el-select': 'el-option',
  'el-radio-group': 'el-radio',
  'el-checkbox-group': 'el-checkbox',
};

// 需要选项的组件类型
export const OPTION_COMPONENTS = [
  FormComponentType.SELECT,
  FormComponentType.RADIO,
  FormComponentType.CHECKBOX,
];

// 容器类型组件
export const CONTAINER_COMPONENTS = [
  FormComponentType.GRID,
  FormComponentType.DIV,
  FormComponentType.CARD,
  FormComponentType.TABS,
  FormComponentType.FLEX,
];

// 需要 FormItem 包装的组件
export const FORM_ITEM_COMPONENTS = [
  FormComponentType.INPUT,
  FormComponentType.TEXTAREA,
  FormComponentType.INPUT_NUMBER,
  FormComponentType.SELECT,
  FormComponentType.RADIO,
  FormComponentType.CHECKBOX,
  FormComponentType.SWITCH,
  FormComponentType.CASCADER,
  FormComponentType.TREE_SELECT,
  FormComponentType.DATE_PICKER,
  FormComponentType.TIME_PICKER,
  FormComponentType.SLIDER,
  FormComponentType.RATE,
  FormComponentType.COLOR_PICKER,
];

// 组件特殊属性处理配置
export const COMPONENT_PROPS_CONFIG: Record<string, (baseProps: any) => any> = {
  [FormComponentType.TEXTAREA]: baseProps => ({
    ...baseProps,
    type: 'textarea',
    rows: 4,
  }),
  [FormComponentType.DATE_PICKER]: baseProps => ({
    ...baseProps,
    type: baseProps.type || 'date',
  }),
  [FormComponentType.TEXT]: baseProps => ({
    innerHTML: baseProps.modelValue || '文本内容',
  }),
  [FormComponentType.TITLE]: baseProps => ({
    innerHTML: baseProps.modelValue || '标题',
  }),
};

// 默认选项配置
export const DEFAULT_OPTIONS: Record<
  string,
  Array<{ label: string; value: any }>
> = {
  [FormComponentType.SELECT]: [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ],
  [FormComponentType.RADIO]: [
    { label: '单选1', value: '1' },
    { label: '单选2', value: '2' },
  ],
  [FormComponentType.CHECKBOX]: [
    { label: '多选1', value: '1' },
    { label: '多选2', value: '2' },
    { label: '多选3', value: '3' },
  ],
};
