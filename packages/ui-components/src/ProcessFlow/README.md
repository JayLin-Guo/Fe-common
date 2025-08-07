# ProcessFlow 流程组件

一个美观的横向流程展示组件，支持鱼尾箭头样式连接，适用于展示工作流程、订单状态等场景。

## ✨ 特性

- 🎨 **美观的鱼尾箭头设计** - 每个步骤都有精美的箭头连接
- 🌈 **多种状态支持** - 支持活跃、完成、错误、禁用等状态
- 📱 **响应式设计** - 自动适配移动端和桌面端
- 🎯 **可交互** - 支持点击事件和自定义图标
- 🔄 **垂直布局** - 支持水平和垂直两种布局方式
- 🎭 **自定义图标** - 支持 Iconify 图标库

## 📦 基础用法

```vue
<template>
  <ProcessFlow :steps="steps" @step-click="handleStepClick" />
</template>

<script setup>
import { ref } from 'vue';
import ProcessFlow from '@/components/ProcessFlow';

const steps = ref([
  {
    id: 1,
    title: '提交订单',
    description: '用户提交订单信息',
    status: 'completed',
  },
  {
    id: 2,
    title: '支付确认',
    description: '等待支付确认',
    status: 'active',
  },
  {
    id: 3,
    title: '商品发货',
    description: '商家准备发货',
    status: 'pending',
  },
  {
    id: 4,
    title: '确认收货',
    description: '用户确认收货',
    status: 'disabled',
  },
]);

const handleStepClick = (step, index) => {
  console.log('点击步骤:', step.title, index);
};
</script>
```

## 🎭 自定义图标

```vue
<template>
  <ProcessFlow :steps="stepsWithIcons" />
</template>

<script setup>
const stepsWithIcons = ref([
  {
    title: '创建订单',
    icon: 'carbon:shopping-cart',
    status: 'completed',
  },
  {
    title: '支付',
    icon: 'carbon:payment',
    status: 'active',
  },
  {
    title: '发货',
    icon: 'carbon:delivery-truck',
    status: 'pending',
  },
  {
    title: '完成',
    icon: 'carbon:checkmark-filled',
    status: 'disabled',
  },
]);
</script>
```

## 📐 垂直布局

```vue
<template>
  <ProcessFlow :steps="steps" vertical />
</template>
```

## 🎨 状态类型

| 状态        | 说明         | 样式                       |
| ----------- | ------------ | -------------------------- |
| `active`    | 当前活跃步骤 | 蓝色渐变背景               |
| `completed` | 已完成步骤   | 绿色渐变背景，显示勾选图标 |
| `error`     | 错误步骤     | 红色渐变背景，显示错误图标 |
| `pending`   | 待处理步骤   | 默认灰色样式               |
| `disabled`  | 禁用步骤     | 灰色样式，不可点击         |

## 📋 Props

| 参数        | 说明         | 类型            | 默认值  |
| ----------- | ------------ | --------------- | ------- |
| steps       | 流程步骤数据 | `ProcessStep[]` | `[]`    |
| vertical    | 是否垂直布局 | `boolean`       | `false` |
| clickable   | 是否可点击   | `boolean`       | `true`  |
| fieldConfig | 字段配置     | `FieldConfig`   | `{}`    |

## 📊 ProcessStep 接口

```typescript
interface ProcessStep {
  id?: string | number; // 步骤唯一标识
  title: string; // 步骤标题
  description?: string; // 步骤描述
  status: 'active' | 'completed' | 'error' | 'disabled' | 'pending';
  icon?: string; // 自定义图标（Iconify）
  clickable?: boolean; // 是否可点击
  data?: any; // 自定义数据
}
```

## 🎪 Events

| 事件名     | 说明         | 参数                                 |
| ---------- | ------------ | ------------------------------------ |
| step-click | 步骤点击事件 | `(step: ProcessStep, index: number)` |

## 🎨 自定义样式

组件使用 CSS 变量，可以轻松自定义颜色：

```css
.process-flow {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --error-color: #dc2626;
  --border-color: #e5e7eb;
}
```

## 📱 响应式支持

组件在移动端会自动调整：

- 减小步骤宽度和内边距
- 调整字体大小
- 优化图标尺寸

## 🌟 使用场景

- **订单流程** - 展示订单从创建到完成的各个阶段
- **审批流程** - 显示文档或申请的审批进度
- **项目进度** - 展示项目开发的各个里程碑
- **用户引导** - 新用户注册或设置的步骤指引
- **工作流程** - 业务流程的可视化展示

## 💡 最佳实践

1. **步骤数量控制** - 建议不超过 6 个步骤，保持界面简洁
2. **描述文字** - 使用简短明了的描述，避免过长文本
3. **状态管理** - 合理使用不同状态，让用户清楚当前进度
4. **交互反馈** - 为可点击步骤提供适当的交互反馈
5. **移动端适配** - 在小屏幕上考虑使用垂直布局
