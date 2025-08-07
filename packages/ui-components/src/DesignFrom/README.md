# 表单设计器 - 嵌套组件属性更新修复

## 问题描述

之前的版本中，当组件被嵌套在容器组件（如栅格、标签页、卡片等）中时，修改这些嵌套组件的属性无法正确更新到表单JSON数据中。

## 问题原因

原有的 `handleUpdateElement` 方法只在顶层 `formData.list` 中查找元素：

```javascript
// 旧版本的问题代码
const handleUpdateElement = updatedElement => {
  const index = state.formData.list.findIndex(
    item => item === state.selectedElement
  );
  if (index !== -1) {
    state.formData.list.splice(index, 1, updatedElement);
  }
};
```

这种方式无法处理嵌套在以下容器中的组件：

- 栅格布局 (grid) - `columns[].list`
- 标签页 (tabs) - `columns[].list`
- 卡片容器 (card) - `list`
- 弹性容器 (flex) - `list`
- DIV容器 (div) - `list`

## 解决方案

### 1. 添加路径追踪机制

为选中的元素添加路径信息：

```typescript
interface State {
  selectedElementPath: (string | number)[] | null; // 元素路径
}
```

### 2. 深度递归查找算法

实现 `findElementPath` 函数，能够递归查找元素在整个表单结构中的位置：

```javascript
const findElementPath = (list, targetElement, currentPath = []) => {
  // 递归查找逻辑，支持所有容器类型
  // 返回路径数组，如: [0, 'columns', 1, 'list', 2]
};
```

### 3. 路径更新算法

实现 `updateElementByPath` 函数，根据路径精确更新嵌套元素：

```javascript
const updateElementByPath = (formData, path, updatedElement) => {
  // 根据路径导航到目标位置并更新
};
```

### 4. 增强的更新处理

重写 `handleUpdateElement` 方法：

```javascript
const handleUpdateElement = updatedElement => {
  // 1. 优先使用路径更新
  if (state.selectedElementPath) {
    const success = updateElementByPath(
      state.formData,
      state.selectedElementPath,
      updatedElement
    );
    if (success) return;
  }

  // 2. 回退到原有逻辑（兼容性）
  // 3. 如果都失败，重新查找路径
};
```

## 支持的嵌套结构

修复后支持以下所有嵌套结构的属性更新：

1. **栅格布局嵌套**：`formData.list[0].columns[0].list[0]`
2. **标签页嵌套**：`formData.list[1].columns[1].list[2]`
3. **卡片容器嵌套**：`formData.list[2].list[0]`
4. **多层嵌套**：`formData.list[0].columns[0].list[1].list[0]`

## 使用示例

```javascript
// 现在可以正确更新嵌套组件的属性
// 1. 在栅格中添加输入框
// 2. 选中该输入框
// 3. 在右侧属性面板修改标签名称
// 4. 属性修改会正确反映到JSON数据中
```

## 向后兼容性

此修复完全向后兼容，不会影响现有的顶层组件属性更新功能。

## 测试建议

1. 创建栅格布局，在不同列中添加输入框
2. 选中嵌套的输入框，修改其属性
3. 查看JSON数据，确认属性正确更新
4. 测试多层嵌套场景
5. 验证原有功能不受影响
