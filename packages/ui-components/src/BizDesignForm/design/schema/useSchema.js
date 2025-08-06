import { formatNumber } from '@/components/BizDesignForm/utils/design'

export function useSchema() {
  const getTempSchema = (name, config, state, control, formItem, type, attr, columnIndex) => {
    const temp = [
      // {
      //   label: '自定义Class',
      //   value: config.className,
      //   placeholder: '样式类名',
      //   path: 'config.className',
      // },
      {
        label: '字段标识',
        value: name,
        type: state.dataSourceFiledList?.length ? 'select' : 'text',
        placeholder: '字段唯一标识，对应数据库',
        dict: state.dataSourceFiledList,
        path: 'name',
        vHide: ['grid', 'tabs', 'card', 'title', 'gridChild', 'tableColumn', 'divider', 'txt', 'div', 'button'],
        eventName: 'filedNameKey'
      },
      {
        label: '占位内容',
        value: control.placeholder,
        placeholder: 'placeholder',
        path: 'control.placeholder',
        vShow: ['password', 'input', 'textarea', 'select', 'date', 'number', 'datePicker', 'tinymce', 'timePicker', 'treeSelect']
      },
      {
        label: '栅格占位数',
        value: attr.span,
        placeholder: '栅格占位数',
        type: 'select',
        path: 'control.span',
        dict: [
          {
            label: '单行一个',
            value: 24
          },
          {
            label: '单行两个',
            value: 12
          },
          {
            label: '单行三个',
            value: 8
          }
        ],
        vShow: ['grid'],
        isNum: true
      },
      // {
      //   label: '按钮类型',
      //   value: control.type,
      //   path: 'control.type',
      //   type: 'select',
      //   dict: {
      //     primary: 'primary',
      //     success: 'success',
      //     info: 'info',
      //     warning: 'warning',
      //     danger: 'danger',
      //   },
      //   vShow: ['button'],
      //   clearable: true,
      // },
      // {
      //   label: '按钮名称',
      //   value: control.label,
      //   path: 'control.label',
      //   vShow: ['button'],
      // },
      // {
      //   label: '按钮事件',
      //   value: control.key,
      //   path: 'control.key',
      //   type: 'select',
      //   dict: {
      //     submit: '提交表单',
      //     reset: '重置表单',
      //     cancel: '取消返回',
      //     none: '无动作(自定义)',
      //   },
      //   vShow: ['button'],
      // },
      {
        label: 'label值',
        value: formItem.label,
        path: 'formItem.label',
        vHide: ['table', 'grid', 'tabs', 'title', 'gridChild', 'div', 'inputSlot', 'flex', 'button', 'txt']
      },
      {
        label: '可清空',
        value: control.clearable,
        path: 'control.clearable',
        type: 'switch',
        vShow: ['select', 'input']
      },
      {
        label: '表格预置项',
        path: 'config.columns',
        type: 'select',
        clearable: true,
        dict: [
          {
            label: '标段标准字段',
            options: [
              {
                label: '标段/包名称',
                value: 'sectionName'
              },
              {
                label: '预算金额(元)',
                value: 'budgetPrice'
              },
              {
                label: '平台使用费金额(元)',
                value: 'platformUsagePrice'
              },
              {
                label: '投标保证金金额(元)',
                value: 'bailPrice'
              },
              {
                label: '标段/包编号',
                value: 'sectionCode'
              },
              {
                label: '备注',
                value: 'remark'
              }
            ]
          },
          {
            label: '标段备用字段',
            options: [
              {
                label: '评标办法',
                value: 'bidEvaluationWay'
              },
              {
                label: '代理服务费金额(元)',
                value: 'serviceChargePrice'
              },
              {
                label: '投标有效期(天)',
                value: 'lifespanDay'
              },
              {
                label: '工期/供货期/服务期',
                value: 'duration'
              }
            ]
          }
        ],
        // key: 'source',
        vShow: ['table']
      },
      // {
      //   label: '隐藏label',
      //   value: formItem.hideLabel,
      //   path: 'formItem.hideLabel',
      //   type: 'switch',
      //   vHide: [
      //     'table',
      //     'grid',
      //     'tabs',
      //     'title',
      //     'gridChild',
      //     'divider',
      //     'card',
      //     'div',
      //     'inputSlot',
      //     'flex',
      //     'button',
      //     'txt',
      //   ],
      // },
      // {
      //   label: '显示类型',
      //   value: config.showType,
      //   path: 'config.showType',
      //   type: 'select',
      //   dict: {
      //     input: '文本选择框',
      //     img: '图片',
      //     btn: '上传按钮',
      //   },
      //   vShow: ['chunkUpload'],
      // },
      // {
      //   label: '按钮文本',
      //   value: config.btnText,
      //   placeholder: '按钮文本，默认为选择文件',
      //   path: 'config.btnText',
      //   vShow: ['chunkUpload'],
      //   vIf: config.showType === 'img',
      // },
      // {
      //   label: '可选数量',
      //   value: config.limit,
      //   placeholder: '可选择的个数，默认1个',
      //   path: 'config.limit',
      //   vShow: ['chunkUpload'],
      // },
      // {
      //   label: '接受的文件类型',
      //   value: config.accept,
      //   placeholder: '接受的文件类型，input原生属性',
      //   path: 'config.accept',
      //   vShow: ['chunkUpload'],
      // },
      // {
      //   label: '是否自动上传',
      //   value: config.auto,
      //   path: 'config.auto',
      //   type: 'switch',
      //   vShow: ['chunkUpload'],
      // },
      // {
      //   label: '帮助信息',
      //   value: config.help,
      //   path: 'config.help',
      //   vHide: [
      //     'table',
      //     'grid',
      //     'tabs',
      //     'gridChild',
      //     'divider',
      //     'div',
      //     'inputSlot',
      //     'flex',
      //     'button',
      //     'txt',
      //   ],
      // },
      // {
      //   label: '表单栅格',
      //   value: config.span,
      //   placeholder: '表单区域栅格宽，0为自动宽',
      //   path: 'config.span',
      //   vHide: ['gridChild'],
      //   isNum: true,
      // },
      // {
      //   label: '文本值',
      //   value: control.modelValue,
      //   placeholder: '支持html',
      //   path: 'control.modelValue',
      //   vShow: ['txt'],
      //   inputStyle: 'textarea',
      // },
      // {
      //   label: '设为密码',
      //   value: type,
      //   type: 'select',
      //   dict: { input: '文本', password: '密码' },
      //   path: 'type',
      //   vShow: ['input', 'password'],
      //   vIf: state.isSearch, // 搜索模式下隐藏 为true
      // },
      // {
      //   label: '文本域高度',
      //   value: control.rows,
      //   placeholder: '输入框行数',
      //   path: 'control.rows',
      //   vShow: ['textarea'],
      //   isNum: true,
      // },
      // {
      //   label: '前缀',
      //   value: config.prepend,
      //   placeholder: '文本前缀',
      //   path: 'config.prepend',
      //   vShow: ['input', 'password'],
      // },
      // {
      //   label: '后缀',
      //   value: config.append,
      //   placeholder: '文本后缀',
      //   path: 'config.append',
      //   vShow: ['input', 'password'],
      // },
      // {
      //   label: '状态打开时的值',
      //   value: control.activeValue,
      //   placeholder: '状态打开时的值',
      //   path: 'control.activeValue',
      //   vShow: ['switch'],
      //   isNum: true,
      // },
      // {
      //   label: '状态关闭时的值',
      //   value: control.inactiveValue,
      //   placeholder: '状态关闭时的值',
      //   path: 'control.inactiveValue',
      //   vShow: ['switch'],
      //   isNum: true,
      // },
      // {
      //   label: '增加按钮文案',
      //   value: config.addBtnText,
      //   path: 'config.addBtnText',
      //   type: 'text',
      //   vShow: ['flex', 'table'],
      // },
      // {
      //   label: '删除按钮文案',
      //   value: config.delBtnText,
      //   path: 'config.delBtnText',
      //   type: 'text',
      //   vShow: ['flex', 'table'],
      // },
      // {
      //   label: '是否多选',
      //   value: control.multiple,
      //   path: 'control.multiple',
      //   type: 'switch',
      //   vShow: ['select', 'treeSelect'],
      //   eventName: 'selectMultiple',
      // },

      // {
      //   label: '是否禁用',
      //   value: control.disabled,
      //   path: 'control.disabled',
      //   type: 'switch',
      //   vShow: [
      //     'input',
      //     'password',
      //     'textarea',
      //     'radio',
      //     'checkbox',
      //     'select',
      //     'date',
      //     'switch',
      //     'number',
      //     'cascader',
      //     'upload',
      //     'rate',
      //     'tinymce',
      //     'treeSelect',
      //     'datePicker',
      //     'timePicker',
      //   ],
      //   vIf: state.isSearch,
      // },
      // {
      //   label: '是否禁用编辑',
      //   value: config.disabledEdit,
      //   path: 'config.disabledEdit',
      //   type: 'switch',
      //   vShow: [
      //     'input',
      //     'password',
      //     'textarea',
      //     'radio',
      //     'checkbox',
      //     'select',
      //     'date',
      //     'switch',
      //     'number',
      //     'cascader',
      //     'upload',
      //     'treeSelect',
      //     'table',
      //     'flex',
      //     'datePicker',
      //     'timePicker',
      //   ],
      //   vIf: state.isSearch,
      // },
      // {
      //   label: '添加页隐藏',
      //   value: config.displayAdd,
      //   path: 'config.displayAdd',
      //   type: 'switch',
      //   vIf: state.isSearch,
      //   vHide: ['inputSlot'],
      // },
      // {
      //   label: '编辑页隐藏',
      //   value: config.displayEdit,
      //   path: 'config.displayEdit',
      //   type: 'switch',
      //   vIf: state.isSearch,
      //   vHide: ['inputSlot'],
      // },
      // {
      //   label: '详情页隐藏',
      //   value: config.displayDetail,
      //   path: 'config.displayDetail',
      //   type: 'switch',
      //   vIf: state.isSearch,
      //   vHide: ['inputSlot'],
      // },
      // {
      //   label: '设为Input输入框的前/后缀',
      //   value: type === 'inputSlot',
      //   path: '',
      //   type: 'switch',
      //   vShow: ['select', 'inputSlot'],
      //   eventName: 'setInputSlot',
      // },
      {
        label: '标题',
        value: control.modelValue,
        path: 'control.modelValue',
        vShow: ['title']
      },
      // {
      //   label: '占据的列数span',
      //   value: attr.span,
      //   path: 'attr.span',
      //   vShow: ['gridChild', 'input', 'select', 'radio', 'checkbox', 'datePicker', 'timePicker', 'inputSlot', 'area'],
      //   eventName: 'formatNumber',
      //   isNum: true,
      // },
      // {

      //   label: '左侧的间隔格数offset',
      //   value: attr.offset,
      //   path: 'attr.offset',
      //   vShow: ['gridChild'],
      //   eventName: 'formatNumber',
      //   isNum: true,
      // },
      // {
      //   label: '向右移动格数push',
      //   value: attr.push,
      //   path: 'attr.push',
      //   vShow: ['gridChild'],
      //   eventName: 'formatNumber',
      //   isNum: true,
      // },
      // {
      //   label: '向左移动格数pull',
      //   value: attr.pull,
      //   path: 'attr.pull',
      //   vShow: ['gridChild'],
      //   eventName: 'formatNumber',
      //   isNum: true,
      // },
      // {
      //   label: '组件名',
      //   value: config.componentName,
      //   placeholder: '全局注册的组件名称',
      //   path: 'config.componentName',
      //   vShow: ['component'],
      // },
      // {
      //   label: '上传地址',
      //   value: control.action,
      //   placeholder: '图片/文件上传地址,可不填有默认值',
      //   path: 'control.action',
      //   vShow: ['upload'],
      // },
      // {
      //   label: '文件字段名',
      //   value: control.name,
      //   placeholder: '上传的文件字段名,默认file',
      //   path: 'control.name',
      //   vShow: ['upload'],
      // },
      // {
      //   label: '提示文字',
      //   value: config.tip,
      //   placeholder: '提示说明文字',
      //   path: 'config.tip',
      //   vShow: ['upload'],
      // },
      // {
      //   label: '按钮文本',
      //   value: config.btnText,
      //   placeholder: '上传按钮文本',
      //   path: 'config.btnText',
      //   vShow: ['upload'],
      // },
      {
        label: 'direction',
        type: 'select',
        dict: { horizontal: 'horizontal', vertical: 'vertical' },
        placeholder: '分割线方向，默认horizontal',
        value: control.direction,
        path: 'control.direction',
        vShow: ['divider']
      },
      {
        label: 'border-style',
        placeholder: '分隔符样式，默认solid',
        value: control.borderStyle,
        path: 'control.borderStyle',
        vShow: ['divider']
      },
      {
        label: 'content-position',
        type: 'select',
        dict: { left: 'left', right: 'right', center: 'center' },
        value: control.contentPosition,
        path: 'control.contentPosition',
        vShow: ['divider']
      },
      {
        label: '最小值',
        value: control.min,
        path: 'control.min',
        vShow: ['slider'],
        eventName: 'formatNumber',
        isNum: true
      },
      {
        label: '最大值',
        value: control.max,
        path: 'control.max',
        vShow: ['rate', 'slider'],
        eventName: 'formatNumber',
        isNum: true
      },
      {
        label: '步长',
        value: control.step,
        path: 'control.step',
        vShow: ['slider'],
        eventName: 'formatNumber',
        isNum: true
      },
      // {
      //   label: 'type',
      //   value: control.type,
      //   path: 'control.type',
      //   vShow: ['datePicker'],
      //   type: 'select',
      //   placeholder: '显示类型',
      //   dict: {
      //     year: 'year',
      //     month: 'month',
      //     date: 'date',
      //     datetime: 'datetime',
      //     week: 'week',
      //     datetimerange: 'datetimerange',
      //     daterange: 'daterange',
      //     monthrange: 'monthrange',
      //   },
      // },
      {
        label: 'format',
        value: control.format,
        path: 'control.format',
        vShow: ['datePicker', 'timePicker'],
        placeholder: '显示在输入框中的格式'
      },
      {
        label: 'value-format',
        value: control.valueFormat,
        path: 'control.valueFormat',
        vShow: ['datePicker', 'timePicker'],
        placeholder: '绑定的值'
      },
      {
        label: 'color-format',
        value: control.colorFormat,
        path: 'control.colorFormat',
        type: 'select',
        placeholder: '写入 v-model 的颜色的格式',
        dict: { hsl: 'hsl', hsv: 'hsv', hex: 'hex', rgb: 'rgb' },
        vShow: ['colorPicker']
      },

      // {
      //   label: '文本高度',
      //   value: control.height,
      //   path: 'control.height',
      //   placeholder: '文本高度(预览查看效果)',
      //   vShow: ['tinymce'],
      // },
      // {
      //   label: '文本宽度',
      //   value: control.width,
      //   path: 'control.width',
      //   placeholder: '文本宽度(预览查看效果)',
      //   vShow: ['tinymce'],
      // },
      {
        label: '图片上传地址',
        value: control.imgUrl,
        path: 'control.imgUrl',
        placeholder: '图片上传地址',
        vShow: ['tinymce']
      },
      {
        label: '附件上传地址',
        value: control.blobUrl,
        path: 'control.blobUrl',
        placeholder: '附件上传地址',
        vShow: ['tinymce']
      }
      // {
      //   label: '显示模式',
      //   value: config.style,
      //   path: 'config.style',
      //   placeholder: '显示风格(预览查看效果)',
      //   type: 'select',
      //   dict: { default: 'default', simple: 'simple' },
      //   vShow: ['tinymce'],
      // },
      // {
      //   label: '隐藏显示',
      //   value: config.hidden,
      //   path: 'config.hidden',
      //   placeholder: '条件表达式，如$.name===1',
      // },
      // {
      //   label: '禁用显示',
      //   value: config.disabled,
      //   path: 'config.disabled',
      //   placeholder: '条件表达式，如$.name===1',
      //   vHide: [
      //     'txt',
      //     'title',
      //     'table',
      //     'grid',
      //     'tabs',
      //     'card',
      //     'flex',
      //     'divider',
      //     'div',
      //   ],
      // },
    ]
    return temp
  }

  const getFormSchema = (props, formData, formConfig, isSearch, dataSourceOption) => {
    return [
      {
        label: '表单名称',
        placeholder: '用于保存的表单名称',
        value: props.formOtherData.formName,
        key: 'formName',
        hide: isSearch
      },
      {
        label: '数据源',
        placeholder: '请选择数据源',
        value: formatNumber(props.formOtherData.source),
        type: 'select',
        options: dataSourceOption.value,
        key: 'source',
        hide: isSearch || !dataSourceOption.value?.length,
        clearable: true
      },
      {
        label: '表单标识',
        value: formData.value.name,
        placeholder: '表单唯一标识，可为空',
        key: 'name',
        hide: isSearch
      },
      {
        label: '表单标签宽度',
        value: formData.value.labelWidth,
        placeholder: '表单label宽，如180px',
        key: 'labelWidth'
      },
      {
        label: '表单样式名称',
        value: formData.value.class,
        placeholder: '额外添加的表单class类名',
        key: 'class',
        type: 'select',
        options: [
          { label: '无样式', value: '' },
          { label: '每行两列', value: 'form-row-2' },
          { label: '每行三列', value: 'form-row-3' },
          { label: '每行四列', value: 'form-row-4' }
        ],
        hide: isSearch,
        clearable: true
      },
      {
        label: '字段名后添加冒号',
        value: formData.value.showColon,
        key: 'showColon',
        type: 'switch'
      },
      {
        label: '组件尺寸',
        value: formData.value.size,
        type: 'select',
        key: 'size',
        options: [
          { label: 'large', value: 'large' },
          { label: 'default', value: 'default' },
          { label: 'small', value: 'small' }
        ]
      },
      {
        label: '快速添加确定取消按钮',
        value: formConfig.value.submitCancel,
        type: 'switch',
        path: 'config',
        key: 'submitCancel'
      }
    ]
  }
  return {
    getTempSchema,
    getFormSchema
  }
}
