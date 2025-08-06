// enums.ts

// 定义弹出框类型的枚举
export const  DrawerType  = {
  EditCss: 'editCss', // 编辑 CSS
  EditDict: 'editDict', // 编辑字典
  BeforeFetch: 'beforeFetch', // 提交前处理
  BeforeSubmit: 'beforeSubmit', // 提交前处理
  AfterFetch: 'afterFetch', // 获取后处理
  AfterSubmit: 'afterSubmit', // 提交后处理
  Change: 'change', // 变更事件
  OptionsParams: 'optionsParams', // 选项参数
  OptionsResult: 'optionsResult', // 选项结果
  CreateJson: 'creatJson', // 创建 JSON
}

// 定义弹出框方向的枚举
export const DrawerDirection =  {
  LTR: 'ltr', // 从左到右
  RTL: 'rtl', // 从右到左
}

// 定义表单操作的枚举
export const HeadToolAction  = {
  Delete: 'del', // 删除操作
  Preview: 'eye', // 预览操作
  GenerateJson: 'json', // 生成 JSON
  Save: 'save', // 保存操作
  Vue: 'vue', // Vue 文件操作
}
