export const designformSchema = {
  templateList: [],
  filedSchema: [
    {
      title: '项目标准字段',
      children: [
        {
          type: 'input',
          icon: 'input',
          label: '项目名称',
          control: {
            // 组件所有属性
            modelValue: '',
          },
          name: 'projectName',
          formItem: {
            label: '项目名称',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '项目编号',
          control: {
            // 组件所有属性
            modelValue: '',
          },
          name: 'projectCode',
          formItem: {
            label: '项目编号',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标人/采购人',
          control: {
            modelValue: '',
          },
          name: 'agencyName',
          formItem: {
            label: '招标人/采购人',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标人/采购人本项目负责人 ',
          control: {
            // 组件所有属性
            modelValue: '',
          },
          name: 'agencyLeader',
          formItem: {
            label: '招标人/采购人本项目负责人',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标人/采购人本项目负责人手机 ',
          control: {
            modelValue: '',
          },
          name: 'agencyLeaderPhone',
          formItem: {
            label: '招标人/采购人本项目负责人手机',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标代理机构本项目负责人 ',
          control: {
            modelValue: '',
          },
          name: 'agentLeader',
          formItem: {
            label: '招标代理机构本项目负责人',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标代理机构本项目负责人手机 ',
          control: {
            modelValue: '',
          },
          name: 'agentLeaderPhone',
          formItem: {
            label: '招标代理机构本项目负责人手机',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '是否为进场项目 ',
          control: {
            modelValue: '',
          },
          name: 'isAdmission',
          formItem: {
            label: '是否为进场项目',
          },
          options: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
          config: {}, // 其他配置信息
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '项目类型 ',
          control: {
            modelValue: '',
          },
          name: 'projectType',
          formItem: {
            label: '项目类型',
          },
          options: [
            {
              label: '工程',
              value: '1',
            },
            {
              label: '货物',
              value: '2',
            },
            {
              label: '服务',
              value: '3',
            },
          ],
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标/采购方式',
          control: {
            modelValue: '',
          },
          name: 'purchaserMethod',
          formItem: {
            label: '招标/采购方式',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'cityArea', // 需在项目外单独处理数据返回
          icon: 'area',
          label: '项目所在区域',
          control: {
            modelValue: ['120000', '120100', '120102'],
          },
          name: 'areaCode',
          formItem: {
            label: '项目所在区域',
            rules: [
              {
                required: true,
                message: '必填项',
                trigger: 'change',
              },
            ],
          },
          config: {}, // 其他配置信息
        },
        // {
        //   type: 'radio',
        //   icon: 'radio',
        //   label: '采购方式/单选',
        //   control: {
        //     modelValue: ''
        //   },
        //   name: 'purchaserMethodRadio',
        //   formItem: {
        //     label: '采购方式'
        //   },
        //   options: [
        //     {
        //       label: '公开',
        //       value: '1'
        //     },
        //     {
        //       label: '邀请',
        //       value: '2'
        //     }
        //   ],
        //   config: {} // 其他配置信息
        // }
        // {
        //   type: "radio",
        //   icon: "radio",
        //   label: "资格审查方式",
        //   control: {
        //     modelValue: "1",
        //   },
        //   name: "reviewType",
        //   options: [
        //     {
        //       label: "资格预审",
        //       value: "1",
        //     },
        //     {
        //       label: "资格后审",
        //       value: "2",
        //     },
        //   ],
        //   formItem: {
        //     label: "资格审查方式",
        //   },
        //   config: {}, // 其他配置信息
        // },
      ],
    },
    {
      title: '项目备用字段',
      children: [
        {
          type: 'input',
          icon: 'input',
          label: '项目地址',
          control: {
            modelValue: '',
          },
          name: 'projectAddress',
          formItem: {
            label: '项目地址',
          },
          config: {}, // 其他配置信息
        },

        {
          type: 'radio',
          icon: 'radio',
          label: '招标组织形式',
          control: {
            modelValue: '1',
          },
          name: 'organizationType',
          options: [
            {
              label: '委托招标',
              value: '1',
            },
            {
              label: '自行招标',
              value: '2',
            },
          ],
          formItem: {
            label: '招标组织形式',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '评审方式',
          control: {
            modelValue: '1',
          },
          name: 'transactionType',
          options: [
            {
              label: '电子标',
              value: '1',
            },
            {
              label: '传统纸质标',
              value: '2',
            },
            {
              label: '智能纸质标',
              value: '3',
            },
          ],
          formItem: {
            label: '评审方式',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '资金来源-输入框',
          name: 'fundSource',
          control: {
            modelValue: '',
          },
          formItem: {
            label: '资金来源',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '资金来源-单选',
          control: {
            modelValue: '1',
          },
          name: 'fundType',
          options: [
            {
              label: '财政资金',
              value: '5',
            },
            {
              label: '其他',
              value: '9',
            },
          ],
          formItem: {
            label: '资金来源',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '项目控制价(元)',
          control: {
            modelValue: '',
          },
          name: 'projectControlPrice',
          formItem: {
            label: '项目控制价(元)',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '项目类别',
          control: {
            modelValue: '1',
          },
          name: 'projectCategory',
          options: [
            {
              label: '重点',
              value: '1',
            },
            {
              label: '民生',
              value: '2',
            },
            {
              label: '一般',
              value: '3',
            },
            {
              label: '扶贫',
              value: '4',
            },
            {
              label: '涉农',
              value: '5',
            },
            {
              label: '其他',
              value: '6',
            },
          ],
          formItem: {
            label: '项目类别',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'select',
          icon: 'select',
          label: '项目监督部门',
          control: {
            modelValue: '',
          },
          name: 'supervisoryDepartment',
          options: [
            {
              label: '商丘市财政局',
              value: '1',
            },
            {
              label: '商丘市住房和城乡建设局',
              value: '2',
            },
          ],
          formItem: {
            label: '项目监督部门',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '项目审批文号',
          control: {
            modelValue: '',
          },
          name: 'approvalNumber',
          formItem: {
            label: '项目审批文号',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'textarea',
          icon: 'textarea',
          label: '项目简介',
          control: {
            modelValue: '',
          },
          name: 'synopsis',
          formItem: {
            label: '项目简介',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '产品类型',
          control: {
            modelValue: '1',
          },
          name: 'productType',
          options: [
            {
              label: '变压器',
              value: '1',
            },
            {
              label: '高低压成套设备',
              value: '2',
            },
          ],
          formItem: {
            label: '产品类型',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'datePicker',
          icon: 'date',
          label: '采购截止时间',
          control: {
            modelValue: '',
          },
          name: 'deadlineTime',
          formItem: {
            label: '采购截止时间',
          },
          config: {}, // 其他配置信息
        },
      ],
    },
    {
      title: '标段/包标准字段',
      children: [
        {
          type: 'input',
          icon: 'input',
          label: '标段/包名称',
          control: {
            modelValue: '',
          },
          name: 'SectionName',
          formItem: {
            label: '包名称',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '预算金额(元)',
          control: {
            modelValue: '',
          },
          name: 'BudgetPrice',
          formItem: {
            label: '预算金额(元)',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '投标保证金金额(元)',
          control: {
            modelValue: '',
          },
          name: 'BailPrice',
          formItem: {
            label: '投标保证金金额(元)',
          },
          config: {}, // 其他配置信息
        },
      ],
    },
    {
      title: '标段/包备用字段',
      children: [
        {
          type: 'select',
          icon: 'select',
          label: '评标办法',
          control: {
            modelValue: '',
          },
          name: 'LifespanDay',
          formItem: {
            label: '评标办法',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '平台使用费金额(元)',
          control: {
            modelValue: '',
          },
          name: 'PlatformUsagePrice',
          formItem: {
            label: '平台使用费金额(元)',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '代理服务费金额(元)',
          control: {
            modelValue: '',
          },
          name: 'ServiceChargePrice',
          formItem: {
            label: '代理服务费金额(元)',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '投标有效期(元)',
          control: {
            modelValue: '',
          },
          name: 'LifespanDay',
          formItem: {
            label: '投标有效期(天)',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'input',
          icon: 'input',
          label: '工期/服务期/供货期',
          control: {
            modelValue: '',
          },
          name: 'DurationUnit',
          formItem: {
            label: '工期/服务期/供货期',
          },
          config: {}, // 其他配置信息
        },
      ],
    },
    {
      title: '表格字段',
      children: [
        {
          type: 'table',
          label: '表格',
          icon: 'table',
          control: {},
          config: {
            columns: [
              {
                label: '序号',
                field: 'index',
              },
            ],
          },
          list: [],
        },
      ],
    },
    {
      title: '布局字段',
      children: [
        {
          type: 'title',
          icon: 'input',
          label: '标题',
          control: {
            modelValue: '标题',
          },
          config: {}, // 其他配置信息
        },
        {
          type: 'grid',
          label: '格栅布局',
          icon: 'grid',
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
          list: [],
          control: {},
          config: {},
        },
        {
          type: 'flex',
          label: '弹性字段',
          icon: 'flex',
          list: [],
          tableData: [], // 值集合
          control: {},
          config: {
            addBtnText: '添加一行',
          },
        },
        {
          type: 'divider',
          label: '分割线',
          icon: 'divider',
          control: {},
          config: {},
        },
        {
          type: 'div',
          label: 'div容器',
          icon: 'div',
          control: {},
          config: {},
          list: [],
        },
      ],
    },
    // {
    //   title: '基础字段',
    //   children: [
    //     {
    //       type: 'input',
    //       label: '单行文本',
    //       icon: 'input',
    //       control: {
    //         // 组件所有属性
    //         modelValue: '',
    //       },
    //       config: {}, // 其他配置信息
    //     },
    //     {
    //       type: 'textarea',
    //       label: '多行文本',
    //       icon: 'textarea',
    //       control: {
    //         modelValue: '',
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'radio',
    //       label: '单选框组',
    //       icon: 'radio',
    //       control: {
    //         modelValue: '',
    //       },
    //       options: selectOption, // 下拉选项数据集合
    //       config: config,
    //     },
    //     {
    //       type: 'checkbox',
    //       label: '多选框组',
    //       icon: 'checkbox',
    //       control: {
    //         modelValue: [],
    //       },
    //       options: selectOption,
    //       config: config,
    //     },
    //     {
    //       type: 'select',
    //       label: '下拉选择框',
    //       icon: 'select',
    //       control: {
    //         modelValue: '',
    //         appendToBody: true,
    //       },
    //       options: selectOption,
    //       config: config,
    //     },
    //     {
    //       type: 'datePicker',
    //       label: '日期选择器',
    //       icon: 'date',
    //       control: {
    //         modelValue: '',
    //         type: 'date',
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'timePicker',
    //       label: '时间选择器',
    //       icon: 'time',
    //       control: {
    //         modelValue: '',
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'colorPicker',
    //       label: '取色器',
    //       icon: 'color',
    //       control: {
    //         modelValue: '',
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'switch',
    //       label: '开关',
    //       icon: 'switch',
    //       control: {
    //         modelValue: false,
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'inputNumber',
    //       label: '计数器',
    //       icon: 'number',
    //       control: {
    //         modelValue: 0,
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'cascader',
    //       label: '级联选择器',
    //       icon: 'cascader',
    //       control: {
    //         modelValue: [],
    //       },
    //       options: [],
    //       config: config,
    //     },
    //     {
    //       type: 'rate',
    //       label: '评分',
    //       icon: 'rate',
    //       control: {
    //         modelValue: 0,
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'slider',
    //       label: '滑块',
    //       icon: 'slider',
    //       control: {
    //         modelValue: 0,
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'treeSelect',
    //       label: '树形控件',
    //       icon: 'tree2',
    //       control: {
    //         modelValue: '',
    //         data: [],
    //         renderAfterExpand: false,
    //       },
    //       config: {
    //         optionsType: 0,
    //       },
    //     },
    //     {
    //       type: 'txt',
    //       label: '文字',
    //       icon: 'text',
    //       control: {
    //         modelValue: '',
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'title',
    //       label: '标题',
    //       icon: 'title',
    //       control: {
    //         modelValue: '标题',
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'button',
    //       label: '按钮',
    //       icon: 'button',
    //       control: {
    //         label: '保存',
    //       },
    //       config: {},
    //     },
    //   ],
    // },
    // {
    //   title: '高级字段',
    //   children: [
    //     {
    //       type: 'table',
    //       label: '子表',
    //       icon: 'table',
    //       list: [],
    //       tableData: [], // 子表表格列表数据集合
    //       control: {
    //         border: true,
    //       },
    //       config: {
    //         addBtnText: '添加一行',
    //       },
    //     },
    //     {
    //       type: 'component',
    //       label: '自定义组件',
    //       icon: 'component',
    //       control: {
    //         modelValue: '',
    //       },
    //       config: {},
    //       /*template: '', // 组件模板名称
    //               component: '' // 根据template注入的组件*/
    //     },
    //     {
    //       type: 'upload',
    //       label: '图片/文件',
    //       icon: 'image',
    //       control: {
    //         modelValue: '', // 也可以是[{name:'',url:''}]形式
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'chunkUpload',
    //       label: '选择上传',
    //       icon: 'upload',
    //       control: {
    //         modelValue: '',
    //       },
    //       config: {},
    //     },
    //     {
    //       type: 'tinymce',
    //       label: 'tinymce富文本',
    //       icon: 'tinymce',
    //       control: {
    //         modelValue: '',
    //       },
    //       config: {},
    //     },
    //   ],
    // },

    // {
    //   title: '扩展组件',
    //   children: [
    //     {
    //       type: 'expand-user',
    //       label: '选择用户',
    //       icon: 'user',
    //       control: {
    //         // 组件所有属性
    //         modelValue: '',
    //       },
    //       config: {}, // 其他配置信息
    //     },
    //   ],
    // },
  ],
};
