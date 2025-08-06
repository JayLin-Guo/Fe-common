# 设计器主题系统 (Design Theme System)

## 概述

这是一个统一的主题系统，为设计器组件提供一致的视觉风格和可定制的主题支持。

## 文件结构

```
styles/
├── theme.scss              # 主题系统核心文件
├── theme-example.scss      # 主题定制示例
└── README.md              # 使用说明
```

## 核心特性

### 1. 统一的设计规范

- **颜色系统**: 主题色、中性色、语义色
- **尺寸系统**: 间距、圆角、字体大小
- **动画系统**: 过渡效果、动画时长
- **阴影系统**: 不同层级的阴影效果

### 2. 丰富的Mixins

- `@mixin form-item-wrapper`: 表单项容器样式
- `@mixin widget-base`: 基础组件样式
- `@mixin widget-hover`: 悬停效果
- `@mixin widget-active`: 激活状态
- `@mixin drag-control-base`: 拖拽控制基础样式
- `@mixin button-base`: 按钮基础样式
- `@mixin form-control-base`: 表单控件基础样式
- `@mixin toolbar-base`: 工具栏基础样式
- `@mixin panel-base`: 面板基础样式

### 3. 可定制的变量

所有变量都使用 `!default` 标记，支持外部覆盖。

## 使用方法

### 基础使用

```scss
// 在Vue组件中导入主题
<style lang="scss" scoped>
@import '../styles/theme.scss';

.my-component {
  @include form-item-wrapper;

  .my-button {
    @include button-base;
  }
}
</style>
```

### 主题定制

#### 方法1：覆盖变量

```scss
// 在导入主题之前定义变量
$primary-color: #3b82f6; // 蓝色主题
$border-radius: 8px; // 更大的圆角

@import '../styles/theme.scss';
```

#### 方法2：创建定制主题文件

```scss
// custom-theme.scss
$primary-color: #10b981;
$primary-dark: #059669;
// ... 其他自定义变量

@import './theme.scss';
```

然后在组件中使用：

```scss
@import '../styles/custom-theme.scss';
```

### 变量参考

#### 主题色彩

- `$primary-color`: 主题色 (#ff6700)
- `$primary-light`: 主题色浅色版本
- `$primary-dark`: 主题色深色版本
- `$success-color`: 成功色 (#10b981)
- `$warning-color`: 警告色 (#f59e0b)
- `$danger-color`: 危险色 (#dc2626)
- `$info-color`: 信息色 (#3b82f6)

#### 中性色彩

- `$white`: 白色 (#ffffff)
- `$gray-50` ~ `$gray-900`: 灰色色阶

#### 尺寸变量

- `$spacing-xs` ~ `$spacing-xxl`: 间距系列 (4px ~ 24px)
- `$border-radius-sm` ~ `$border-radius-lg`: 圆角系列 (4px ~ 12px)
- `$font-size-xs` ~ `$font-size-xl`: 字体大小系列 (10px ~ 18px)

#### 动画变量

- `$transition-fast`: 快速过渡 (0.15s ease)
- `$transition-normal`: 正常过渡 (0.2s ease)
- `$transition-slow`: 慢速过渡 (0.3s ease)

#### 阴影变量

- `$shadow-sm` ~ `$shadow-xl`: 阴影系列
- `$shadow-primary`: 主题色阴影
- `$shadow-drag`: 拖拽阴影

## 主题预设示例

### 蓝色主题

```scss
$primary-color: #3b82f6;
$primary-light: rgba(59, 130, 246, 0.1);
$primary-dark: #2563eb;
```

### 绿色主题

```scss
$primary-color: #10b981;
$primary-light: rgba(16, 185, 129, 0.1);
$primary-dark: #059669;
```

### 紫色主题

```scss
$primary-color: #8b5cf6;
$primary-light: rgba(139, 92, 246, 0.1);
$primary-dark: #7c3aed;
```

## 最佳实践

### 1. 组件开发

- 使用mixins而不是重复的CSS代码
- 使用变量而不是硬编码的值
- 保持样式的一致性

### 2. 主题定制

- 在导入主题之前定义变量
- 使用语义化的变量名
- 保持颜色对比度的可访问性

### 3. 性能优化

- 只导入需要的mixins
- 避免重复导入主题文件
- 使用CSS变量进行运行时主题切换

## 动态主题切换

如果需要运行时主题切换，可以结合CSS变量：

```scss
// 在主题文件中导出CSS变量
:root {
  --primary-color: #{$primary-color};
  --primary-dark: #{$primary-dark};
  --border-radius: #{$border-radius};
}

// 在组件中使用CSS变量
.dynamic-component {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
}
```

然后通过JavaScript动态修改CSS变量：

```javascript
// 切换主题
document.documentElement.style.setProperty('--primary-color', '#3b82f6');
```

## 扩展主题系统

如果需要添加新的设计规范：

1. 在 `theme.scss` 中添加新的变量
2. 创建对应的mixin
3. 在组件中使用新的mixin
4. 更新文档

## 支持的组件

当前主题系统已应用于：

- ✅ formGroup.vue (核心拖拽组件)
- ✅ InputControl.vue (输入框组件)
- ✅ GridControl.vue (栅格组件)
- ✅ index.vue (主设计器界面)
- ✅ headTools.vue (头部工具栏)
- ✅ formControlAttr.vue (属性面板)

## 贡献指南

1. 添加新变量时使用 `!default`
2. 创建语义化的mixin名称
3. 保持向后兼容性
4. 更新相关文档

---

通过这个主题系统，你可以轻松地创建一致、美观且可定制的用户界面！
