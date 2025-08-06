# DesignForm 设计表单

BizDesignForm 是一个可视化表单设计器组件，支持拖拽式表单构建和动态表单渲染。

## 概述

BizDesignForm 提供了一个完整的表单设计解决方案，包括表单设计器和表单渲染器，支持多种表单控件和复杂的表单逻辑。

## 特性

- 🎨 **可视化设计** - 拖拽式表单设计界面
- 🧩 **丰富控件** - 支持多种表单控件类型
- 📋 **动态渲染** - 根据配置动态生成表单
- ✅ **表单验证** - 完整的表单验证机制
- 💾 **数据持久化** - 支持表单配置的保存和加载
- 📱 **响应式** - 适配不同屏幕尺寸
- 🔧 **高度可配置** - 灵活的配置选项

## 基础用法

### 表单设计器

```vue
<template>
  <div>
    <BizDesignForm mode="design" v-model:config="formConfig" @save="handleSave" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formConfig = ref({
  fields: [],
  layout: 'vertical',
  labelWidth: '100px'
})

const handleSave = config => {
  console.log('保存表单配置:', config)
  // 保存到服务器或本地存储
}
</script>
```

### 表单渲染器

```vue
<template>
  <div>
    <BizDesignForm mode="render" :config="formConfig" v-model:data="formData" @submit="handleSubmit" @validate="handleValidate" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formConfig = ref({
  fields: [
    {
      type: 'input',
      name: 'username',
      label: '用户名',
      required: true,
      placeholder: '请输入用户名'
    },
    {
      type: 'select',
      name: 'role',
      label: '角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' }
      ]
    }
  ]
})

const formData = ref({})

const handleSubmit = data => {
  console.log('提交表单数据:', data)
}

const handleValidate = (valid, errors) => {
  console.log('表单验证结果:', valid, errors)
}
</script>
```

## 支持的控件类型

### 基础控件

- **input** - 文本输入框
- **textarea** - 多行文本
- **number** - 数字输入
- **password** - 密码输入
- **email** - 邮箱输入
- **url** - URL 输入
- **tel** - 电话输入

### 选择控件

- **select** - 下拉选择
- **radio** - 单选按钮
- **checkbox** - 复选框
- **switch** - 开关

### 日期时间

- **date** - 日期选择
- **datetime** - 日期时间选择
- **time** - 时间选择
- **daterange** - 日期范围

### 高级控件

- **upload** - 文件上传
- **editor** - 富文本编辑器
- **cascader** - 级联选择
- **tree** - 树形选择

## API

### Props

| 属性名   | 说明                  | 类型                 | 默认值   | 必填 |
| -------- | --------------------- | -------------------- | -------- | ---- |
| mode     | 模式                  | 'design' \| 'render' | 'render' | 否   |
| config   | 表单配置              | FormConfig           | {}       | 是   |
| data     | 表单数据 (仅渲染模式) | object               | {}       | 否   |
| readonly | 是否只读 (仅渲染模式) | boolean              | false    | 否   |
| disabled | 是否禁用 (仅渲染模式) | boolean              | false    | 否   |

### Events

| 事件名        | 说明                        | 参数             |
| ------------- | --------------------------- | ---------------- |
| update:config | 配置更新时触发              | config           |
| update:data   | 数据更新时触发              | data             |
| save          | 保存配置时触发 (仅设计模式) | config           |
| submit        | 提交表单时触发 (仅渲染模式) | data             |
| validate      | 表单验证时触发 (仅渲染模式) | valid, errors    |
| field-change  | 字段值改变时触发            | fieldName, value |

### FormConfig 类型定义

```typescript
interface FormConfig {
  fields: FormField[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: string
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  readonly?: boolean
}

interface FormField {
  type: string
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  rules?: ValidationRule[]
  options?: Option[]
  props?: Record<string, any>
  style?: Record<string, any>
  className?: string
}
```

## 高级用法

### 自定义控件

```vue
<template>
  <BizDesignForm mode="design" v-model:config="formConfig" :custom-components="customComponents" />
</template>

<script setup>
import CustomComponent from './CustomComponent.vue'

const customComponents = {
  'custom-input': {
    component: CustomComponent,
    label: '自定义输入框',
    icon: 'custom-icon',
    props: {
      placeholder: '自定义占位符'
    }
  }
}
</script>
```

### 条件显示

```javascript
const formConfig = {
  fields: [
    {
      type: 'select',
      name: 'type',
      label: '类型',
      options: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' }
      ]
    },
    {
      type: 'input',
      name: 'companyName',
      label: '公司名称',
      visibleWhen: {
        field: 'type',
        value: 'company'
      }
    }
  ]
}
```

### 表单验证

```javascript
const formConfig = {
  fields: [
    {
      type: 'input',
      name: 'email',
      label: '邮箱',
      rules: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入正确的邮箱格式' }
      ]
    },
    {
      type: 'password',
      name: 'password',
      label: '密码',
      rules: [
        { required: true, message: '请输入密码' },
        { min: 6, message: '密码长度不能少于6位' }
      ]
    }
  ]
}
```

## 样式定制

```scss
// 自定义设计器样式
.biz-design-form {
  --designer-primary-color: #409eff;
  --designer-border-color: #dcdfe6;
  --designer-background-color: #f5f7fa;
}

// 自定义表单样式
.biz-form-render {
  --form-label-color: #606266;
  --form-border-color: #dcdfe6;
  --form-focus-color: #409eff;
}
```

## 使用说明

1. **设计模式**：用于创建和编辑表单配置
2. **渲染模式**：用于显示和填写表单
3. **数据绑定**：支持双向数据绑定
4. **表单验证**：内置完整的验证机制
5. **扩展性**：支持自定义控件和验证规则
