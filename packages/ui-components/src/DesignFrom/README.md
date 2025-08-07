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

## 新增表格组件

### 📊 表格设计器功能

新增了完整的表格设计器组件，支持：

#### 🎨 可视化设计

- 拖拽表格组件到画布
- 实时预览表格效果
- 设计模式下的简化表格展示

#### 🔧 列管理功能

- 点击"管理列"按钮打开列配置弹窗
- 支持拖拽调整列顺序
- 动态添加/删除列
- 配置列属性：
  - 列类型（普通列、选择框、序号、展开行）
  - 字段名和标题
  - 宽度设置（固定宽度、最小宽度）
  - 对齐方式
  - 显示提示框、可排序等选项

#### ⚙️ 表格属性配置

- 显示边框开关
- 斑马纹显示控制
- 分页组件显示设置
- 数据总数配置
- 每页条数选择

#### 🔄 与 BaseTable 组件完全兼容

表格设计器生成的配置与现有的 `BaseTable` 组件完全兼容：

```javascript
// 设计器生成的配置可直接用于 BaseTable
<base-table
  :data="tableData"
  :config="designerGeneratedConfig"
  :total="total"
  v-model="pagination"
/>
```

#### 📋 配置格式

生成的表格配置遵循 BaseTable 的标准格式：

```typescript
interface TableConfig {
  tableColumn: TableColumn[]; // 表格列配置
  pagingColumn?: PagingColumn; // 分页配置
}

interface TableColumn {
  type?: 'selection' | 'index' | 'expand'; // 列类型
  prop?: string; // 数据字段名
  label?: string; // 列标题
  width?: string | number; // 列宽度
  minWidth?: string | number; // 最小列宽
  align?: 'left' | 'center' | 'right'; // 对齐方式
  showOverflowTooltip?: boolean; // 是否显示提示框
  slotName?: string; // 插槽名称
  sortable?: boolean; // 是否可排序
}
```

## 使用示例

```javascript
// 现在可以正确更新嵌套组件的属性
// 1. 在栅格中添加输入框
// 2. 选中该输入框
// 3. 在右侧属性面板修改标签名称
// 4. 属性修改会正确反映到JSON数据中

// 表格组件使用示例
// 1. 拖拽表格组件到设计器
// 2. 点击"管理列"配置表格结构
// 3. 在右侧面板设置表格属性
// 4. 生成的配置可直接用于 BaseTable 渲染
```

## 向后兼容性

此修复完全向后兼容，不会影响现有的顶层组件属性更新功能。

## 测试建议

1. 创建栅格布局，在不同列中添加输入框
2. 选中嵌套的输入框，修改其属性
3. 查看JSON数据，确认属性正确更新
4. 测试多层嵌套场景
5. 验证原有功能不受影响
6. 测试表格组件的列管理功能
7. 验证表格配置与 BaseTable 组件的兼容性
