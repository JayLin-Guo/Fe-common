// 属性配置管理器
// 定义每种组件的默认属性配置

// 由于是 JS 文件，直接定义组件类型常量
const FormComponentType = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  INPUT_NUMBER: 'inputNumber',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  SWITCH: 'switch',
  CASCADER: 'cascader',
  TREE_SELECT: 'treeSelect',
  DATE_PICKER: 'datePicker',
  TIME_PICKER: 'timePicker',
  SLIDER: 'slider',
  RATE: 'rate',
  COLOR_PICKER: 'colorPicker',
  BUTTON: 'button',
  TEXT: 'txt',
  TITLE: 'title',
  TABLE: 'table',
  GRID: 'grid',
  DIV: 'div',
  CARD: 'card',
  TABS: 'tabs',
  FLEX: 'flex',
  DIVIDER: 'divider',
};

// 属性控件类型枚举
export const ATTR_TYPES = {
  INPUT: 'input', // 文本输入
  TEXTAREA: 'textarea', // 多行文本
  SELECT: 'select', // 下拉选择
  CHECKBOX: 'checkbox', // 复选框
  RADIO: 'radio', // 单选框
  NUMBER: 'number', // 数字输入
  SWITCH: 'switch', // 开关
  COLOR: 'color', // 颜色选择器
  OPTIONS: 'options', // 选项配置器
};

// 基础属性配置
const BASE_ATTRS = [
  {
    key: 'formItem.label',
    label: '标签',
    type: ATTR_TYPES.INPUT,
    defaultValue: '',
    placeholder: '请输入标签',
  },
];

// 表单控件通用属性
const FORM_CONTROL_ATTRS = [
  {
    key: 'name',
    label: '字段名',
    type: ATTR_TYPES.INPUT,
    defaultValue: '',
    placeholder: '请输入字段名',
  },
  {
    key: 'formItem.required',
    label: '必填',
    type: ATTR_TYPES.CHECKBOX,
    defaultValue: false,
  },
];

// 输入类控件通用属性
const INPUT_ATTRS = [
  {
    key: 'control.placeholder',
    label: '占位符',
    type: ATTR_TYPES.INPUT,
    defaultValue: '',
    placeholder: '请输入占位符',
  },
  {
    key: 'control.disabled',
    label: '禁用',
    type: ATTR_TYPES.CHECKBOX,
    defaultValue: false,
  },
];

// 各组件类型的默认属性配置
const DEFAULT_ATTR_CONFIGS = {
  // 输入框
  input: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '输入限制',
        attrs: [
          {
            key: 'control.maxlength',
            label: '最大长度',
            type: ATTR_TYPES.NUMBER,
            defaultValue: '',
            placeholder: '请输入最大长度',
          },
        ],
      },
    ],
  },

  // 多行文本
  textarea: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '文本区设置',
        attrs: [
          {
            key: 'control.rows',
            label: '行数',
            type: ATTR_TYPES.NUMBER,
            defaultValue: 3,
            placeholder: '请输入行数',
          },
        ],
      },
    ],
  },

  // 下拉选择
  select: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '选项配置',
        attrs: [
          {
            key: 'control.options',
            label: '选项列表',
            type: ATTR_TYPES.OPTIONS,
            defaultValue: [
              { label: '选项1', value: 'option1' },
              { label: '选项2', value: 'option2' },
            ],
          },
        ],
      },
    ],
  },

  // 单选框
  radio: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS],
      },
      {
        title: '选项配置',
        attrs: [
          {
            key: 'control.options',
            label: '选项列表',
            type: ATTR_TYPES.OPTIONS,
            defaultValue: [
              { label: '选项1', value: 'option1' },
              { label: '选项2', value: 'option2' },
            ],
          },
        ],
      },
    ],
  },

  // 复选框
  checkbox: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS],
      },
      {
        title: '选项配置',
        attrs: [
          {
            key: 'control.options',
            label: '选项列表',
            type: ATTR_TYPES.OPTIONS,
            defaultValue: [
              { label: '选项1', value: 'option1' },
              { label: '选项2', value: 'option2' },
            ],
          },
        ],
      },
    ],
  },

  // 数字输入
  number: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '数值限制',
        attrs: [
          {
            key: 'control.min',
            label: '最小值',
            type: ATTR_TYPES.NUMBER,
            defaultValue: '',
            placeholder: '请输入最小值',
          },
          {
            key: 'control.max',
            label: '最大值',
            type: ATTR_TYPES.NUMBER,
            defaultValue: '',
            placeholder: '请输入最大值',
          },
        ],
      },
    ],
  },

  // 按钮
  button: {
    groups: [
      {
        title: '基础属性',
        attrs: [
          {
            key: 'control.text',
            label: '按钮文字',
            type: ATTR_TYPES.INPUT,
            defaultValue: '按钮',
            placeholder: '请输入按钮文字',
          },
          {
            key: 'control.type',
            label: '按钮类型',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'default',
            options: [
              { label: '默认', value: 'default' },
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'danger' },
            ],
          },
        ],
      },
    ],
  },

  // 标题
  title: {
    groups: [
      {
        title: '文本属性',
        attrs: [
          {
            key: 'control.text',
            label: '标题内容',
            type: ATTR_TYPES.INPUT,
            defaultValue: '标题',
            placeholder: '请输入标题内容',
          },
          {
            key: 'control.level',
            label: '标题级别',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'h3',
            options: [
              { label: 'H1', value: 'h1' },
              { label: 'H2', value: 'h2' },
              { label: 'H3', value: 'h3' },
              { label: 'H4', value: 'h4' },
              { label: 'H5', value: 'h5' },
              { label: 'H6', value: 'h6' },
            ],
          },
        ],
      },
    ],
  },

  // 文本
  txt: {
    groups: [
      {
        title: '文本属性',
        attrs: [
          {
            key: 'control.text',
            label: '文本内容',
            type: ATTR_TYPES.TEXTAREA,
            defaultValue: '这是一段文本',
            placeholder: '请输入文本内容',
          },
        ],
      },
    ],
  },

  // 栅格
  grid: {
    groups: [
      {
        title: '布局属性',
        attrs: [
          {
            key: 'config.gutter',
            label: '栅格间距',
            type: ATTR_TYPES.NUMBER,
            defaultValue: 0,
            placeholder: '请输入间距',
          },
        ],
      },
    ],
  },

  // 分割线
  divider: {
    groups: [
      {
        title: '分割线属性',
        attrs: [
          {
            key: 'control.text',
            label: '分割线文字',
            type: ATTR_TYPES.INPUT,
            defaultValue: '',
            placeholder: '请输入分割线文字（可选）',
          },
          {
            key: 'control.position',
            label: '文字位置',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'center',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
          },
        ],
      },
    ],
  },

  // 卡片
  card: {
    groups: [
      {
        title: '卡片属性',
        attrs: [
          {
            key: 'config.title',
            label: '卡片标题',
            type: ATTR_TYPES.INPUT,
            defaultValue: '卡片标题',
            placeholder: '请输入卡片标题',
          },
          {
            key: 'config.shadow',
            label: '阴影显示',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'always',
            options: [
              { label: '总是显示', value: 'always' },
              { label: '悬停显示', value: 'hover' },
              { label: '从不显示', value: 'never' },
            ],
          },
        ],
      },
    ],
  },

  // 标签页
  tabs: {
    groups: [
      {
        title: '标签页属性',
        attrs: [
          {
            key: 'config.type',
            label: '标签页类型',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'line',
            options: [
              { label: '线条', value: 'line' },
              { label: '卡片', value: 'card' },
              { label: '边框卡片', value: 'border-card' },
            ],
          },
        ],
      },
    ],
  },

  // 弹性字段
  flex: {
    groups: [
      {
        title: '弹性字段属性',
        attrs: [
          {
            key: 'config.addBtnText',
            label: '添加按钮文字',
            type: ATTR_TYPES.INPUT,
            defaultValue: '添加一行',
            placeholder: '请输入添加按钮文字',
          },
          {
            key: 'config.maxRows',
            label: '最大行数',
            type: ATTR_TYPES.NUMBER,
            defaultValue: '',
            placeholder: '请输入最大行数（可选）',
          },
        ],
      },
    ],
  },

  // ===== Element Plus 组件配置 =====

  // 数字输入框
  [FormComponentType.INPUT_NUMBER]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '数值设置',
        attrs: [
          {
            key: 'control.min',
            label: '最小值',
            type: ATTR_TYPES.NUMBER,
            defaultValue: '',
            placeholder: '请输入最小值',
          },
          {
            key: 'control.max',
            label: '最大值',
            type: ATTR_TYPES.NUMBER,
            defaultValue: '',
            placeholder: '请输入最大值',
          },
          {
            key: 'control.step',
            label: '步长',
            type: ATTR_TYPES.NUMBER,
            defaultValue: 1,
            placeholder: '请输入步长',
          },
          {
            key: 'control.precision',
            label: '精度',
            type: ATTR_TYPES.NUMBER,
            defaultValue: '',
            placeholder: '请输入精度',
          },
        ],
      },
    ],
  },

  // 开关
  [FormComponentType.SWITCH]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS],
      },
      {
        title: '开关设置',
        attrs: [
          {
            key: 'control.activeText',
            label: '打开时文字',
            type: ATTR_TYPES.INPUT,
            defaultValue: '',
            placeholder: '请输入打开时显示的文字',
          },
          {
            key: 'control.inactiveText',
            label: '关闭时文字',
            type: ATTR_TYPES.INPUT,
            defaultValue: '',
            placeholder: '请输入关闭时显示的文字',
          },
          {
            key: 'control.activeValue',
            label: '打开时的值',
            type: ATTR_TYPES.INPUT,
            defaultValue: true,
            placeholder: '请输入打开时的值',
          },
          {
            key: 'control.inactiveValue',
            label: '关闭时的值',
            type: ATTR_TYPES.INPUT,
            defaultValue: false,
            placeholder: '请输入关闭时的值',
          },
        ],
      },
    ],
  },

  // 滑块
  [FormComponentType.SLIDER]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS],
      },
      {
        title: '滑块设置',
        attrs: [
          {
            key: 'control.min',
            label: '最小值',
            type: ATTR_TYPES.NUMBER,
            defaultValue: 0,
            placeholder: '请输入最小值',
          },
          {
            key: 'control.max',
            label: '最大值',
            type: ATTR_TYPES.NUMBER,
            defaultValue: 100,
            placeholder: '请输入最大值',
          },
          {
            key: 'control.step',
            label: '步长',
            type: ATTR_TYPES.NUMBER,
            defaultValue: 1,
            placeholder: '请输入步长',
          },
          {
            key: 'control.showStops',
            label: '显示间断点',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.range',
            label: '范围选择',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
        ],
      },
    ],
  },

  // 评分
  [FormComponentType.RATE]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS],
      },
      {
        title: '评分设置',
        attrs: [
          {
            key: 'control.max',
            label: '最大分值',
            type: ATTR_TYPES.NUMBER,
            defaultValue: 5,
            placeholder: '请输入最大分值',
          },
          {
            key: 'control.allowHalf',
            label: '允许半选',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.showText',
            label: '显示辅助文字',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.showScore',
            label: '显示当前分数',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
        ],
      },
    ],
  },

  // 颜色选择器
  [FormComponentType.COLOR_PICKER]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS],
      },
      {
        title: '颜色设置',
        attrs: [
          {
            key: 'control.showAlpha',
            label: '支持透明度',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.colorFormat',
            label: '颜色格式',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'hex',
            options: [
              { label: 'HEX', value: 'hex' },
              { label: 'RGB', value: 'rgb' },
              { label: 'HSL', value: 'hsl' },
              { label: 'HSV', value: 'hsv' },
            ],
          },
          {
            key: 'control.predefine',
            label: '预定义颜色',
            type: ATTR_TYPES.OPTIONS,
            defaultValue: [],
          },
        ],
      },
    ],
  },

  // 日期选择器
  [FormComponentType.DATE_PICKER]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '日期设置',
        attrs: [
          {
            key: 'control.type',
            label: '选择器类型',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'date',
            options: [
              { label: '日期', value: 'date' },
              { label: '日期时间', value: 'datetime' },
              { label: '日期范围', value: 'daterange' },
              { label: '日期时间范围', value: 'datetimerange' },
              { label: '年', value: 'year' },
              { label: '月', value: 'month' },
              { label: '周', value: 'week' },
            ],
          },
          {
            key: 'control.format',
            label: '显示格式',
            type: ATTR_TYPES.INPUT,
            defaultValue: 'YYYY-MM-DD',
            placeholder: '请输入日期格式',
          },
          {
            key: 'control.valueFormat',
            label: '值格式',
            type: ATTR_TYPES.INPUT,
            defaultValue: 'YYYY-MM-DD',
            placeholder: '请输入值格式',
          },
        ],
      },
    ],
  },

  // 时间选择器
  [FormComponentType.TIME_PICKER]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '时间设置',
        attrs: [
          {
            key: 'control.isRange',
            label: '范围选择',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.format',
            label: '显示格式',
            type: ATTR_TYPES.INPUT,
            defaultValue: 'HH:mm:ss',
            placeholder: '请输入时间格式',
          },
          {
            key: 'control.valueFormat',
            label: '值格式',
            type: ATTR_TYPES.INPUT,
            defaultValue: 'HH:mm:ss',
            placeholder: '请输入值格式',
          },
        ],
      },
    ],
  },

  // 级联选择器
  [FormComponentType.CASCADER]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '级联设置',
        attrs: [
          {
            key: 'control.options',
            label: '数据选项',
            type: ATTR_TYPES.OPTIONS,
            defaultValue: [
              {
                label: '选项1',
                value: 'option1',
                children: [
                  { label: '子选项1-1', value: 'option1-1' },
                  { label: '子选项1-2', value: 'option1-2' },
                ],
              },
            ],
          },
          {
            key: 'control.multiple',
            label: '多选',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.checkStrictly',
            label: '任意级别可选',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.showAllLevels',
            label: '显示完整路径',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: true,
          },
        ],
      },
    ],
  },

  // 树形选择器
  [FormComponentType.TREE_SELECT]: {
    groups: [
      {
        title: '基础属性',
        attrs: [...BASE_ATTRS, ...FORM_CONTROL_ATTRS, ...INPUT_ATTRS],
      },
      {
        title: '树形设置',
        attrs: [
          {
            key: 'control.data',
            label: '数据选项',
            type: ATTR_TYPES.OPTIONS,
            defaultValue: [
              {
                label: '选项1',
                value: 'option1',
                children: [
                  { label: '子选项1-1', value: 'option1-1' },
                  { label: '子选项1-2', value: 'option1-2' },
                ],
              },
            ],
          },
          {
            key: 'control.multiple',
            label: '多选',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.checkStrictly',
            label: '严格模式',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.checkOnClickNode',
            label: '点击节点选中',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
        ],
      },
    ],
  },

  // 按钮
  [FormComponentType.BUTTON]: {
    groups: [
      {
        title: '基础属性',
        attrs: [
          {
            key: 'control.label',
            label: '按钮文字',
            type: ATTR_TYPES.INPUT,
            defaultValue: '按钮',
            placeholder: '请输入按钮文字',
          },
        ],
      },
      {
        title: '按钮样式',
        attrs: [
          {
            key: 'control.type',
            label: '按钮类型',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'default',
            options: [
              { label: '默认', value: 'default' },
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '信息', value: 'info' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'danger' },
            ],
          },
          {
            key: 'control.size',
            label: '按钮大小',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'default',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
          },
          {
            key: 'control.plain',
            label: '朴素按钮',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.round',
            label: '圆角按钮',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
          {
            key: 'control.circle',
            label: '圆形按钮',
            type: ATTR_TYPES.CHECKBOX,
            defaultValue: false,
          },
        ],
      },
    ],
  },

  // 文本
  [FormComponentType.TEXT]: {
    groups: [
      {
        title: '基础属性',
        attrs: [
          {
            key: 'control.modelValue',
            label: '文本内容',
            type: ATTR_TYPES.TEXTAREA,
            defaultValue: '文本内容',
            placeholder: '请输入文本内容',
          },
        ],
      },
      {
        title: '样式设置',
        attrs: [
          {
            key: 'control.color',
            label: '文字颜色',
            type: ATTR_TYPES.COLOR,
            defaultValue: '',
            placeholder: '请选择文字颜色',
          },
          {
            key: 'control.fontSize',
            label: '字体大小',
            type: ATTR_TYPES.INPUT,
            defaultValue: '',
            placeholder: '如：14px, 1.2em',
          },
          {
            key: 'control.fontWeight',
            label: '字体粗细',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'normal',
            options: [
              { label: '正常', value: 'normal' },
              { label: '粗体', value: 'bold' },
              { label: '细体', value: 'lighter' },
            ],
          },
        ],
      },
    ],
  },

  // 标题
  [FormComponentType.TITLE]: {
    groups: [
      {
        title: '基础属性',
        attrs: [
          {
            key: 'control.modelValue',
            label: '标题内容',
            type: ATTR_TYPES.INPUT,
            defaultValue: '标题',
            placeholder: '请输入标题内容',
          },
        ],
      },
      {
        title: '样式设置',
        attrs: [
          {
            key: 'control.level',
            label: '标题级别',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'h3',
            options: [
              { label: 'H1', value: 'h1' },
              { label: 'H2', value: 'h2' },
              { label: 'H3', value: 'h3' },
              { label: 'H4', value: 'h4' },
              { label: 'H5', value: 'h5' },
              { label: 'H6', value: 'h6' },
            ],
          },
          {
            key: 'control.color',
            label: '文字颜色',
            type: ATTR_TYPES.COLOR,
            defaultValue: '',
            placeholder: '请选择文字颜色',
          },
          {
            key: 'control.textAlign',
            label: '文字对齐',
            type: ATTR_TYPES.SELECT,
            defaultValue: 'left',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * 获取组件的属性配置
 * @param {string} componentType - 组件类型
 * @param {Object} customConfig - 自定义配置
 * @returns {Object} 合并后的属性配置
 */
export function getAttrConfig(componentType, customConfig = {}) {
  const defaultConfig = DEFAULT_ATTR_CONFIGS[componentType] || {
    groups: [
      {
        title: '基础属性',
        attrs: BASE_ATTRS,
      },
    ],
  };

  // 如果没有自定义配置，直接返回默认配置
  if (!customConfig || Object.keys(customConfig).length === 0) {
    return defaultConfig;
  }

  // 深度合并配置
  return mergeAttrConfig(defaultConfig, customConfig);
}

/**
 * 深度合并属性配置
 * @param {Object} defaultConfig - 默认配置
 * @param {Object} customConfig - 自定义配置
 * @returns {Object} 合并后的配置
 */
function mergeAttrConfig(defaultConfig, customConfig) {
  const merged = { ...defaultConfig };

  if (customConfig.groups) {
    // 合并分组
    const groupMap = new Map();

    // 先添加默认分组
    merged.groups.forEach(group => {
      groupMap.set(group.title, { ...group });
    });

    // 合并自定义分组
    customConfig.groups.forEach(customGroup => {
      if (groupMap.has(customGroup.title)) {
        // 如果分组存在，合并属性
        const existingGroup = groupMap.get(customGroup.title);
        const attrMap = new Map();

        // 先添加现有属性
        existingGroup.attrs.forEach(attr => {
          attrMap.set(attr.key, attr);
        });

        // 合并自定义属性
        customGroup.attrs.forEach(customAttr => {
          attrMap.set(customAttr.key, {
            ...attrMap.get(customAttr.key),
            ...customAttr,
          });
        });

        existingGroup.attrs = Array.from(attrMap.values());
      } else {
        // 新分组，直接添加
        groupMap.set(customGroup.title, { ...customGroup });
      }
    });

    merged.groups = Array.from(groupMap.values());
  }

  return merged;
}

/**
 * 获取属性值（支持嵌套路径）
 * @param {Object} obj - 目标对象
 * @param {string} path - 属性路径，如 'formItem.label'
 * @returns {any} 属性值
 */
export function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * 设置属性值（支持嵌套路径）
 * @param {Object} obj - 目标对象
 * @param {string} path - 属性路径，如 'formItem.label'
 * @param {any} value - 要设置的值
 */
export function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();

  let current = obj;
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * 初始化组件的默认属性值
 * @param {Object} element - 组件元素
 * @param {string} componentType - 组件类型
 * @param {Object} customConfig - 自定义配置
 */
export function initElementAttrs(element, componentType, customConfig = {}) {
  const config = getAttrConfig(componentType, customConfig);

  config.groups.forEach(group => {
    group.attrs.forEach(attr => {
      if (attr.defaultValue !== undefined) {
        const currentValue = getNestedValue(element, attr.key);
        if (currentValue === undefined) {
          setNestedValue(element, attr.key, attr.defaultValue);
        }
      }
    });
  });
}

// 表格组件属性配置
const TABLE_ATTRS = [
  {
    key: 'config.showBorder',
    label: '显示边框',
    type: ATTR_TYPES.CHECKBOX,
    defaultValue: true,
    placeholder: '是否显示表格边框',
  },
  {
    key: 'config.showStripe',
    label: '斑马纹',
    type: ATTR_TYPES.CHECKBOX,
    defaultValue: true,
    placeholder: '是否显示斑马纹',
  },
  {
    key: 'config.showPagination',
    label: '显示分页',
    type: ATTR_TYPES.CHECKBOX,
    defaultValue: true,
    placeholder: '是否显示分页组件',
  },
  {
    key: 'control.total',
    label: '数据总数',
    type: ATTR_TYPES.NUMBER,
    defaultValue: 100,
    placeholder: '表格数据总数',
  },
  {
    key: 'control.modelValue.limit',
    label: '每页条数',
    type: ATTR_TYPES.SELECT,
    defaultValue: 10,
    options: [
      { label: '10条/页', value: 10 },
      { label: '20条/页', value: 20 },
      { label: '30条/页', value: 30 },
      { label: '50条/页', value: 50 },
      { label: '100条/页', value: 100 },
    ],
  },
];

// 添加到组件配置映射中
if (typeof COMPONENT_ATTR_CONFIG !== 'undefined') {
  COMPONENT_ATTR_CONFIG[FormComponentType.TABLE] = {
    groups: [
      {
        title: '表格设置',
        attrs: TABLE_ATTRS,
      },
      {
        title: '提示',
        attrs: [
          {
            key: '_info',
            label: '列管理',
            type: 'info',
            value: '点击表格上的"管理列"按钮来配置表格列',
          },
        ],
      },
    ],
  };
} else {
  // 如果 COMPONENT_ATTR_CONFIG 不存在，创建它
  window.COMPONENT_ATTR_CONFIG = window.COMPONENT_ATTR_CONFIG || {};
  window.COMPONENT_ATTR_CONFIG[FormComponentType.TABLE] = {
    groups: [
      {
        title: '表格设置',
        attrs: TABLE_ATTRS,
      },
      {
        title: '列管理',
        attrs: [
          {
            key: '_info',
            label: '说明',
            type: 'info',
            value: '点击表格组件上的"管理列"按钮来配置表格的列结构',
          },
        ],
      },
    ],
  };
}
