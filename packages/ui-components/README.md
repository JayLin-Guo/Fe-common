# @jr/ui-components

> Jr Vue3 业务组件库

## 📦 安装

```bash
npm install @jr/ui-components
# or
yarn add @jr/ui-components
```

## 🚀 使用方式

### 全量引入

```typescript
// main.ts
import { createApp } from 'vue';
import JrUI from '@jr/ui-components';
import '@jr/ui-components/dist/style.css';
import App from './App.vue';

const app = createApp(App);
app.use(JrUI);
app.mount('#app');
```

```vue
<!-- 在组件中使用 -->
<template>
  <div>
    <BizMessage type="success" message="操作成功" />
    <BaseTable :data="tableData" :config="tableConfig" />
  </div>
</template>
```

### 按需引入

```typescript
// 按需引入组件
import { BizMessage, BaseTable } from '@jr/ui-components';
import '@jr/ui-components/dist/style.css';

export default {
  components: {
    BizMessage,
    BaseTable,
  },
};
```

## 📋 组件列表

| 组件名 | 说明 | 状态 |
|--------|------|------|
| BizMessage | 业务消息提示组件 | ✅ 可用 |
| BizMainForm | 业务主表单容器 | ✅ 可用 |
| BizArea | 省市区级联选择器 | ✅ 可用 |
| BaseTable | 基础表格组件(带分页) | ✅ 可用 |
| BizSvgIcon | SVG图标组件 | ✅ 可用 |

## 🔧 组件说明

### BizMessage - 业务消息

业务消息提示组件，支持多种类型和自定义配置。

```vue
<template>
  <BizMessage 
    type="success" 
    title="操作提示"
    message="数据保存成功" 
    :show-close="true"
    :show-confirm="true"
    @confirm="handleConfirm"
  />
</template>
```

**Props:**
- `type`: 消息类型 ('success' | 'error' | 'warning' | 'info')
- `title`: 消息标题
- `message`: 消息内容
- `showClose`: 是否显示关闭按钮
- `showConfirm`: 是否显示确认按钮
- `onConfirm`: 确认回调
- `onCancel`: 取消回调

### BaseTable - 基础表格

基于Element Plus封装的表格组件，内置分页功能。

```vue
<template>
  <BaseTable 
    :data="tableData"
    :config="tableConfig"
    :total="total"
    v-model="paginationParams"
    @search="handleSearch"
  />
</template>

<script setup>
const tableConfig = {
  tableColumn: [
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄', width: 80 },
    { prop: 'city', label: '城市' },
  ],
  pagingColumn: {
    layout: 'total,prev, pager, next, sizes,jumper',
    pageSizes: [10, 20, 30, 40]
  }
}
</script>
```

### BizArea - 省市区选择器

支持搜索的省市区级联选择组件。

```vue
<template>
  <BizArea 
    v-model="selectedArea"
    placeholder="请选择省市区"
    :clearable="true"
    :filterable="true"
    @change="handleAreaChange"
  />
</template>
```

### BizSvgIcon - SVG图标

SVG图标组件，支持自定义大小和颜色。

```vue
<template>
  <BizSvgIcon 
    name="success"
    :size="24"
    color="#52c41a"
  />
</template>
```

## ⚠️ 注意事项

- 组件库依赖 Element Plus，请确保项目中已安装
- 某些组件需要配合SVG图标资源使用
- 建议在项目中全局引入组件库样式

## 🛠 开发

```bash
# 克隆项目
git clone your-repo-url
cd jr-fe-common/packages/ui-components

# 安装依赖
yarn install

# 开发模式
yarn dev

# 构建
yarn build

# 测试
yarn test
```

## 📄 许可证

MIT 