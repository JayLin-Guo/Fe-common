// 属性配置管理器
// 定义每种组件的默认属性配置

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
