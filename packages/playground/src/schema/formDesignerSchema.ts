// 表单设计器的Schema配置
export const formDesignerSchema = {
  // 自定义模板配置
  customTemplate: [
    {
      name: '招投标项目模板',
      json: {
        fields: [
          {
            type: 'input',
            icon: 'input',
            label: '项目名称',
            control: {
              modelValue: ''
            },
            name: 'projectName',
            formItem: {
              label: '项目名称'
            },
            config: {}
          },
          {
            type: 'input',
            icon: 'input',
            label: '项目编号',
            control: {
              modelValue: ''
            },
            name: 'projectCode',
            formItem: {
              label: '项目编号'
            },
            config: {}
          },
          {
            type: 'radio',
            icon: 'radio',
            label: '项目类型',
            control: {
              modelValue: ''
            },
            name: 'projectType',
            formItem: {
              label: '项目类型'
            },
            options: [
              {
                label: '工程',
                value: '1'
              },
              {
                label: '货物',
                value: '2'
              },
              {
                label: '服务',
                value: '3'
              }
            ],
            config: {}
          }
        ]
      }
    },
    {
      name: '基础信息模板',
      json: {
        fields: [
          {
            type: 'input',
            icon: 'input',
            label: '姓名',
            control: {
              modelValue: ''
            },
            name: 'name',
            formItem: {
              label: '姓名'
            },
            config: {}
          },
          {
            type: 'input',
            icon: 'input',
            label: '手机号',
            control: {
              modelValue: ''
            },
            name: 'phone',
            formItem: {
              label: '手机号'
            },
            config: {}
          }
        ]
      }
    }
  ],
  
  // 自定义字段配置（对应agentProject.js的结构）
  customField: [
    {
      title: '项目标准字段',
      children: [
        {
          type: 'input',
          icon: 'input',
          label: '项目名称',
          control: {
            modelValue: ''
          },
          name: 'projectName',
          formItem: {
            label: '项目名称'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '项目编号',
          control: {
            modelValue: ''
          },
          name: 'projectCode',
          formItem: {
            label: '项目编号'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标人/采购人',
          control: {
            modelValue: ''
          },
          name: 'agencyName',
          formItem: {
            label: '招标人/采购人'
          },
          config: {}
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '是否为进场项目',
          control: {
            modelValue: ''
          },
          name: 'isAdmission',
          formItem: {
            label: '是否为进场项目'
          },
          options: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ],
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标人/采购人本项目负责人',
          control: {
            modelValue: ''
          },
          name: 'agencyLeader',
          formItem: {
            label: '招标人/采购人本项目负责人'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标人/采购人本项目负责人手机',
          control: {
            modelValue: ''
          },
          name: 'agencyLeaderPhone',
          formItem: {
            label: '招标人/采购人本项目负责人手机'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标代理机构本项目负责人',
          control: {
            modelValue: ''
          },
          name: 'agentLeader',
          formItem: {
            label: '招标代理机构本项目负责人'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '招标代理机构本项目负责人手机',
          control: {
            modelValue: ''
          },
          name: 'agentLeaderPhone',
          formItem: {
            label: '招标代理机构本项目负责人手机'
          },
          config: {}
        },

        {
          type: 'input',
          icon: 'input',
          label: '招标/采购方式',
          control: {
            modelValue: ''
          },
          name: 'purchaserMethod',
          formItem: {
            label: '招标/采购方式'
          },
          config: {}
        },
        {
          type: 'cityArea',
          icon: 'area',
          label: '项目所在区域',
          control: {
            modelValue: ['120000', '120100', '120102']
          },
          name: 'areaCode',
          formItem: {
            label: '项目所在区域',
            rules: [
              {
                required: true,
                message: '必填项',
                trigger: 'change'
              }
            ]
          },
          config: {}
        }
      ]
    },
    {
      title: '项目备用字段',
      children: [
        {
          type: 'input',
          icon: 'input',
          label: '项目地址',
          control: {
            modelValue: ''
          },
          name: 'projectAddress',
          formItem: {
            label: '项目地址'
          },
          config: {}
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '招标组织形式',
          control: {
            modelValue: '1'
          },
          name: 'organizationType',
          options: [
            {
              label: '委托招标',
              value: '1'
            },
            {
              label: '自行招标',
              value: '2'
            }
          ],
          formItem: {
            label: '招标组织形式'
          },
          config: {}
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '评审方式',
          control: {
            modelValue: '1'
          },
          name: 'transactionType',
          options: [
            {
              label: '电子标',
              value: '1'
            },
            {
              label: '传统纸质标',
              value: '2'
            },
            {
              label: '智能纸质标',
              value: '3'
            }
          ],
          formItem: {
            label: '评审方式'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '资金来源-输入框',
          control: {
            modelValue: ''
          },
          name: 'fundSource',
          formItem: {
            label: '资金来源'
          },
          config: {}
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '资金来源-单选',
          control: {
            modelValue: '5'
          },
          name: 'fundType',
          options: [
            {
              label: '财政资金',
              value: '5'
            },
            {
              label: '其他',
              value: '9'
            }
          ],
          formItem: {
            label: '资金来源'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '项目控制价(元)',
          control: {
            modelValue: ''
          },
          name: 'projectControlPrice',
          formItem: {
            label: '项目控制价(元)'
          },
          config: {}
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '项目类别',
          control: {
            modelValue: '1'
          },
          name: 'projectCategory',
          options: [
            {
              label: '重点',
              value: '1'
            },
            {
              label: '民生',
              value: '2'
            },
            {
              label: '一般',
              value: '3'
            },
            {
              label: '扶贫',
              value: '4'
            },
            {
              label: '涉农',
              value: '5'
            },
            {
              label: '其他',
              value: '6'
            }
          ],
          formItem: {
            label: '项目类别'
          },
          config: {}
        },
        {
          type: 'select',
          icon: 'select',
          label: '项目监督部门',
          control: {
            modelValue: ''
          },
          name: 'supervisoryDepartment',
          options: [
            {
              label: '商丘市财政局',
              value: '1'
            },
            {
              label: '商丘市住房和城乡建设局',
              value: '2'
            }
          ],
          formItem: {
            label: '项目监督部门'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '项目审批文号',
          control: {
            modelValue: ''
          },
          name: 'approvalNumber',
          formItem: {
            label: '项目审批文号'
          },
          config: {}
        },
        {
          type: 'textarea',
          icon: 'textarea',
          label: '项目简介',
          control: {
            modelValue: ''
          },
          name: 'synopsis',
          formItem: {
            label: '项目简介'
          },
          config: {}
        },
        {
          type: 'radio',
          icon: 'radio',
          label: '产品类型',
          control: {
            modelValue: '1'
          },
          name: 'productType',
          options: [
            {
              label: '变压器',
              value: '1'
            },
            {
              label: '高低压成套设备',
              value: '2'
            }
          ],
          formItem: {
            label: '产品类型'
          },
          config: {}
        },
        {
          type: 'datePicker',
          icon: 'date',
          label: '采购截止时间',
          control: {
            modelValue: ''
          },
          name: 'deadlineTime',
          formItem: {
            label: '采购截止时间'
          },
          config: {}
        }
      ]
    },
    {
      title: '标段/包标准字段',
      children: [
        {
          type: 'input',
          icon: 'input',
          label: '标段/包名称',
          control: {
            modelValue: ''
          },
          name: 'sectionName',
          formItem: {
            label: '包名称'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '预算金额(元)',
          control: {
            modelValue: ''
          },
          name: 'budgetPrice',
          formItem: {
            label: '预算金额(元)'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '投标保证金金额(元)',
          control: {
            modelValue: ''
          },
          name: 'bailPrice',
          formItem: {
            label: '投标保证金金额(元)'
          },
          config: {}
        }
      ]
    },
    {
      title: '标段/包备用字段',
      children: [
        {
          type: 'select',
          icon: 'select',
          label: '评标办法',
          control: {
            modelValue: ''
          },
          name: 'evaluationMethod',
          formItem: {
            label: '评标办法'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '平台使用费金额(元)',
          control: {
            modelValue: ''
          },
          name: 'platformUsagePrice',
          formItem: {
            label: '平台使用费金额(元)'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '代理服务费金额(元)',
          control: {
            modelValue: ''
          },
          name: 'serviceChargePrice',
          formItem: {
            label: '代理服务费金额(元)'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '投标有效期(天)',
          control: {
            modelValue: ''
          },
          name: 'lifespanDay',
          formItem: {
            label: '投标有效期(天)'
          },
          config: {}
        },
        {
          type: 'input',
          icon: 'input',
          label: '工期/服务期/供货期',
          control: {
            modelValue: ''
          },
          name: 'durationUnit',
          formItem: {
            label: '工期/服务期/供货期'
          },
          config: {}
        }
      ]
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
                field: 'index'
              }
            ]
          },
          list: []
        }
      ]
    },
    {
      title: '布局字段',
      children: [
        {
          type: 'title',
          icon: 'input',
          label: '标题',
          control: {
            modelValue: '标题'
          },
          config: {}
        },
        {
          type: 'grid',
          label: '格栅布局',
          icon: 'grid',
          columns: [
            {
              attr: { span: 12 },
              list: []
            },
            {
              attr: { span: 12 },
              list: []
            }
          ],
          control: {},
          config: {}
        },
        {
          type: 'tabs',
          label: '标签页',
          icon: 'tabs',
          columns: [
            {
              label: 'Tab1',
              list: []
            }
          ],
          control: {},
          config: {}
        },
        {
          type: 'card',
          label: '卡片布局',
          icon: 'card',
          list: [],
          control: {},
          config: {}
        },
        {
          type: 'flex',
          label: '弹性字段',
          icon: 'flex',
          list: [],
          tableData: [],
          control: {},
          config: {
            addBtnText: '添加一行'
          }
        },
        {
          type: 'divider',
          label: '分割线',
          icon: 'divider',
          control: {},
          config: {}
        },
        {
          type: 'div',
          label: 'div容器',
          icon: 'div',
          control: {},
          config: {},
          list: []
        }
      ]
    }
  ],
  
  // 是否启用基础字段组件
  enableBaseFields: true
} 