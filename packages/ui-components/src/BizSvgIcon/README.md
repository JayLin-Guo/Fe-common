# SvgIcon SVG 图标

BizSvgIcon 是一个轻量级的 SVG 图标组件，支持自定义颜色、大小和旋转动画。

## 概述

BizSvgIcon 基于 SVG Symbol 技术，提供高性能的图标显示方案。支持自定义颜色、大小和旋转动画，适用于各种业务场景。

## 特性

- 🎨 **自定义样式** - 支持自定义颜色和大小
- 🔄 **旋转动画** - 内置旋转动画效果
- ⚡ **轻量高效** - 基于 SVG Symbol 技术
- 🎯 **易于使用** - 简单的 API 设计

## 基础用法

```vue
<template>
  <div>
    <!-- 基础使用 -->
    <BizSvgIcon name="home" />

    <!-- 自定义大小 -->
    <BizSvgIcon name="user" size="24" />

    <!-- 自定义颜色 -->
    <BizSvgIcon name="heart" color="#ff4757" />

    <!-- 旋转动画 -->
    <BizSvgIcon name="loading" :spin="true" />
  </div>
</template>
```

## API

### Props

| 属性名 | 说明                           | 类型             | 默认值         | 必填 |
| ------ | ------------------------------ | ---------------- | -------------- | ---- |
| name   | 图标名称，对应 SVG 文件名      | string           | -              | 是   |
| color  | 图标颜色                       | string           | 'currentColor' | 否   |
| size   | 图标大小，支持数字(px)或字符串 | number \| string | '1em'          | 否   |
| spin   | 是否启用旋转动画               | boolean          | false          | 否   |

## 使用说明

1. **图标资源**：确保对应的 SVG 图标已添加到项目的图标库中
2. **Symbol ID**：组件会自动将 `name` 转换为 `#icon-${name}` 格式
3. **颜色继承**：默认继承父元素的文字颜色
4. **响应式**：支持 em、rem 等相对单位实现响应式
