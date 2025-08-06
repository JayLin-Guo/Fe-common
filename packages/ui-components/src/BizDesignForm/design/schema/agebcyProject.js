const selectOption = [];
const config = {
  optionsType: 0, // 0固定 1数据源 2 接口字典
};
export default [
  {
    title: "标准字段",
    children: [
      {
        type: "radio",
        icon: "radio",
        label: "公告类型",
        control: {
          modelValue: "",
        },
        name: "NoticeType",
        formItem: {
          label: "公告类型",
        },
        options: [
          {
            label: "招标公告",
            value: "0",
          },
          {
            label: "变更公告",
            value: "1",
          },
          {
            label: "延期公告",
            value: "2",
          },
          {
            label: "其他公告",
            value: "3",
          },
        ],
        config: {}, // 其他配置信息
      },
      {
        type: "input",
        icon: "input",
        label: "公告标题",
        control: {
          modelValue: "",
        },
        name: "NoticeTitle",
        formItem: {
          label: "公告标题",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "datePicker",
        icon: "datePicker",
        label: "开标时间",
        control: {
          // 组件所有属性
          modelValue: "",
        },
        name: "OpeningTime",
        formItem: {
          label: "开标时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "input",
        icon: "input",
        label: "招标文件售价(元)",
        control: {
          modelValue: "",
        },
        name: "FilePrice",
        formItem: {
          label: "招标文件售价(元)",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "datePicker",
        icon: "datePicker",
        label: "报名开始时间",
        control: {
          // 组件所有属性
          modelValue: "",
        },
        name: "ApplyStartTime",
        formItem: {
          label: "报名开始时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "datePicker",
        icon: "datePicker",
        label: "报名截止时间",
        control: {
          // 组件所有属性
          modelValue: "",
        },
        name: "ApplyEndTime",
        formItem: {
          label: "报名截止时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "datePicker",
        icon: "datePicker",
        label: "提问开始时间",
        control: {
          // 组件所有属性
          modelValue: "",
        },
        name: "QuestionStartTime",
        formItem: {
          label: "提问开始时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "datePicker",
        icon: "datePicker",
        label: "提问截止时间",
        control: {
          // 组件所有属性
          modelValue: "",
        },
        name: " QuestionEndTime",
        formItem: {
          label: "提问截止时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "textarea",
        icon: "textarea",
        label: "公告内容",
        control: {
          modelValue: "",
        },
        name: "NoticeContent",
        formItem: {
          label: "公告内容",
        },
        config: {}, // 其他配置信息
      },
    ],
  },
  {
    title: "备用字段",
    children: [
      {
        type: "datePicker",
        icon: "datePicker",
        label: "投标文件解密截止时间",
        control: {
          modelValue: "",
        },
        name: "SupervisoryDepartmentID",
        formItem: {
          label: "投标文件递交开始时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "radio",
        icon: "radio",
        label: "投标文件递交方法",
        control: {
          modelValue: "1",
        },
        name: "ProjectCategory",
        options: [
          {
            label: "网上递交",
            value: "1",
          },
          {
            label: "现场递交",
            value: "2",
          },
        ],
        formItem: {
          label: "投标文件递交方法",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "datePicker",
        icon: "datePicker",
        label: "投标文件递交开始时间",
        control: {
          modelValue: "",
        },
        name: "SupervisoryDepartmentID",
        formItem: {
          label: "投标文件递交开始时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "datePicker",
        icon: "datePicker",
        label: "投标文件递交截止时间",
        control: {
          modelValue: "",
        },
        name: "SupervisoryDepartmentID",
        formItem: {
          label: "投标文件递交截止时间",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "input",
        icon: "input",
        label: "公告发布媒介",
        control: {
          modelValue: "",
        },
        name: "input",
        formItem: {
          label: "公告发布媒介",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "input",
        icon: "input",
        label: "评委会成员人数",
        control: {
          modelValue: "",
        },
        name: "input",
        formItem: {
          label: "评委会成员人数",
        },
        config: {}, // 其他配置信息
      },
      // {
      //   type: "select",
      //   icon: "input",
      //   label: "项目监督部门",
      //   control: {
      //     modelValue: "",
      //   },
      //   name: "SupervisoryDepartmentID",
      //   options: [
      //     {
      //       label: "测试1",
      //       value: "1",
      //     },
      //     {
      //       label: "测试2",
      //       value: "2",
      //     },
      //   ],
      //   formItem: {
      //     label: "项目监督部门",
      //   },
      //   config: {}, // 其他配置信息
      // },
    ],
  },

  {
    title: "布局字段",
    children: [
      {
        type: "title",
        icon: "input",
        label: "标题",
        control: {
          modelValue: "标题",
        },
        config: {}, // 其他配置信息
      },
      {
        type: "grid",
        label: "格栅布局",
        icon: "grid",
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
        type: "tabs",
        label: "标签页",
        icon: "tabs",
        columns: [
          {
            label: "Tab1",
            list: [],
          },
        ],
        control: {},
        config: {},
      },
      {
        type: "card",
        label: "卡片布局",
        icon: "card",
        list: [],
        control: {},
        config: {},
      },
      {
        type: "flex",
        label: "弹性字段",
        icon: "flex",
        list: [],
        tableData: [], // 值集合
        control: {},
        config: {
          addBtnText: "添加一行",
        },
      },
      {
        type: "divider",
        label: "分割线",
        icon: "divider",
        control: {},
        config: {},
      },
      {
        type: "div",
        label: "div容器",
        icon: "div",
        control: {},
        config: {},
        list: [],
      },
    ],
  },
];
