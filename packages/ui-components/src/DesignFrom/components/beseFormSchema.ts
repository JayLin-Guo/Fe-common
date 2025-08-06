import type { SchemaJson } from '../types/designForm';

const layoutComponentsConf: SchemaJson[] = [
  {
    title: '布局字段',
    children: [
      {
        type: 'title',
        icon: 'input',
        label: '标题',
        name: 'title',
        control: {
          modelValue: '标题',
        },
        formItem: {},
        config: {}, // 其他配置信息
      },
      {
        type: 'grid',
        label: '格栅布局',
        icon: 'grid',
        name: 'grid',
        columns: [
          // 格栅列数据
          {
            attr: { span: 12 },
            list: [],
          },
          {
            attr: { span: 12 },
            list: [],
          },
        ],
        control: {},
        config: {},
      },
      {
        type: 'tabs',
        label: '标签页',
        icon: 'tabs',
        name: 'tabs',
        columns: [
          {
            label: 'Tab1',
            list: [],
          },
        ],
        control: {},
        config: {},
      },
      {
        type: 'card',
        label: '卡片布局',
        icon: 'card',
        name: 'card',
        control: {},
        config: {},
      },
      {
        type: 'flex',
        label: '弹性字段',
        icon: 'flex',
        name: 'flex',
        control: {},
        config: {
          addBtnText: '添加一行',
        },
      },
      {
        type: 'divider',
        label: '分割线',
        icon: 'divider',
        name: 'divider',
        control: {},
        config: {},
      },
      {
        type: 'div',
        label: 'div容器',
        icon: 'div',
        name: 'div',
        control: {},
        config: {},
      },
    ],
  },
];
const defaultComponentsConf: SchemaJson[] = [
  {
    title: '基础字段',
    children: [
      {
        type: 'input',
        label: '单行文本',
        icon: 'input',
        name: 'input',
        control: {
          // 组件所有属性
          modelValue: '',
        },
        config: {}, // 其他配置信息
      },
      {
        type: 'textarea',
        label: '多行文本',
        icon: 'textarea',
        name: 'textarea',
        control: {
          modelValue: '',
        },
        config: {},
      },
      {
        type: 'radio',
        label: '单选框组',
        icon: 'radio',
        name: 'radio',
        control: {
          modelValue: '',
        },
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
        config: {},
      },
      {
        type: 'checkbox',
        label: '多选框组',
        icon: 'checkbox',
        name: 'checkbox',
        control: {
          modelValue: [],
        },
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ],
        config: {},
      },
      {
        type: 'select',
        label: '下拉选择框',
        name: 'select',
        icon: 'select',
        control: {
          modelValue: '',
          appendToBody: true,
        },
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ],
        config: {},
      },
      {
        type: 'datePicker',
        label: '日期选择器',
        name: 'datePicker',
        icon: 'date',
        control: {
          modelValue: '',
          type: 'date',
        },
        config: {},
      },
      {
        type: 'timePicker',
        label: '时间选择器',
        icon: 'time',
        name: 'timePicker',
        control: {
          modelValue: '',
        },
        config: {},
      },
      {
        type: 'colorPicker',
        label: '取色器',
        name: 'colorPicker',
        icon: 'color',
        control: {
          modelValue: '',
        },
        config: {},
      },
      {
        type: 'switch',
        label: '开关',
        name: 'switch',
        icon: 'switch',
        control: {
          modelValue: false,
        },
        config: {},
      },
      {
        type: 'inputNumber',
        label: '计数器',
        name: 'inputNumber',
        icon: 'number',
        control: {
          modelValue: 0,
        },
        config: {},
      },
      {
        type: 'cascader',
        label: '级联选择器',
        name: 'cascader',
        icon: 'cascader',
        control: {
          modelValue: [],
        },
        config: {},
      },
      {
        type: 'rate',
        label: '评分',
        name: 'rate',
        icon: 'rate',
        control: {
          modelValue: 0,
        },
        config: {},
      },
      {
        type: 'slider',
        label: '滑块',
        name: 'slider',
        icon: 'slider',
        control: {
          modelValue: 0,
        },
        config: {},
      },
      {
        type: 'treeSelect',
        label: '树形控件',
        name: 'treeSelect',
        icon: 'tree2',
        control: {
          modelValue: '',
          data: [],
          renderAfterExpand: false,
        },
        config: {
          optionsType: 0,
        },
      },
      {
        type: 'txt',
        label: '文字',
        name: 'txt',
        icon: 'text',
        control: {
          modelValue: '',
        },
        config: {},
      },
      {
        type: 'title',
        label: '标题',
        name: 'title',
        icon: 'title',
        control: {
          modelValue: '标题',
        },
        config: {},
      },
      {
        type: 'button',
        label: '按钮',
        name: 'button',
        icon: 'button',
        control: {
          label: '保存',
        },
        config: {},
      },
    ],
  },
  ...layoutComponentsConf,
];
export { defaultComponentsConf, layoutComponentsConf };
