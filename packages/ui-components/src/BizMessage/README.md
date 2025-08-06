# BizMessage 组件说明文档

## 概述

BizMessage 是一个功能强大的消息提示组件，支持多种消息类型、模态框、确认取消操作等功能。组件采用函数式调用方式，使用简单便捷。

## 特性

- 🎨 支持多种消息类型（成功、错误、警告、信息）
- 🔧 支持模态框和非模态框模式
- ⚡ 支持自动关闭和手动关闭
- 🎯 支持确认/取消操作
- 📱 响应式设计，居中显示
- 🎭 支持 HTML 内容渲染
- 🔄 支持多实例管理
- 💫 优雅的动画效果

## 安装和使用

### 全局注册

组件已在 `src/plugins/globalComponents.ts` 中全局注册，可直接使用。

```javascript
import { BizMessage } from '@/components/BizMessage'
```

### 基本用法

```javascript
// 基础消息
BizMessage('这是一条基本消息')

// 成功消息
BizMessage.success('操作成功完成')

// 错误消息
BizMessage.error('操作失败')

// 警告消息
BizMessage.warning('警告：请注意此操作')

// 信息消息
BizMessage.info('这是一条信息提示')
```

### 高级用法

```javascript
// 带选项的消息
BizMessage({
  type: 'warning',
  message: '您确定要执行此操作吗？',
  modal: true,
  showCancel: true,
  showConfirm: true,
  confirmButtonText: '确认删除',
  cancelButtonText: '我再想想',
  onConfirm: () => {
    console.log('用户确认了操作')
  },
  onCancel: () => {
    console.log('用户取消了操作')
  }
})

// 确认框成功提示
BizMessage.confirmSuccess('删除成功')

// 确认框取消提示
BizMessage.confirmCancel('已取消操作')

// 确认框（新增方法）
BizMessage.confirmBox({
  message: '是否确认此操作？',
  onConfirm: () => {
    BizMessage.confirmSuccess('操作成功')
  },
  onCancel: () => {
    BizMessage.confirmCancel('操作已取消')
  }
})
```

## API 参考

### MessageOptions 接口

| 参数                     | 类型                                          | 默认值       | 说明                                   |
| ------------------------ | --------------------------------------------- | ------------ | -------------------------------------- |
| type                     | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'`     | 消息类型                               |
| message                  | `string \| HTMLElement`                       | -            | 消息内容                               |
| title                    | `string`                                      | `'系统提示'` | 消息标题                               |
| duration                 | `number`                                      | `3000`       | 自动关闭时间（毫秒），0 表示不自动关闭 |
| showClose                | `boolean`                                     | `true`       | 是否显示关闭按钮                       |
| modal                    | `boolean`                                     | `true`       | 是否显示遮罩层                         |
| showCancel               | `boolean`                                     | `false`      | 是否显示取消按钮                       |
| showConfirm              | `boolean`                                     | `true`       | 是否显示确认按钮                       |
| confirmButtonText        | `string`                                      | `'确定'`     | 确认按钮文本                           |
| cancelButtonText         | `string`                                      | `'取消'`     | 取消按钮文本                           |
| onConfirm                | `() => void`                                  | -            | 确认回调函数                           |
| onCancel                 | `() => void`                                  | -            | 取消回调函数                           |
| onClosed                 | `() => void`                                  | -            | 关闭后回调函数                         |
| dangerouslyUseHTMLString | `boolean`                                     | `false`      | 是否将 message 作为 HTML 片段处理      |
| id                       | `string`                                      | -            | 自定义 ID                              |
| allowDuplicate           | `boolean`                                     | -            | 是否允许重复消息                       |
| customClass              | `string`                                      | `''`         | 自定义 CSS 类名                        |
| zIndex                   | `number`                                      | -            | 自定义层级                             |

### MessageAPI 方法

| 方法                      | 参数                       | 返回值            | 说明             |
| ------------------------- | -------------------------- | ----------------- | ---------------- |
| BizMessage                | `MessageOptions \| string` | `MessageInstance` | 创建基础消息     |
| BizMessage.success        | `MessageOptions \| string` | `MessageInstance` | 创建成功消息     |
| BizMessage.error          | `MessageOptions \| string` | `MessageInstance` | 创建错误消息     |
| BizMessage.warning        | `MessageOptions \| string` | `MessageInstance` | 创建警告消息     |
| BizMessage.info           | `MessageOptions \| string` | `MessageInstance` | 创建信息消息     |
| BizMessage.confirmBox     | `MessageOptions \| string` | `MessageInstance` | 创建确认框       |
| BizMessage.confirmSuccess | `MessageOptions \| string` | `MessageInstance` | 创建确认成功提示 |
| BizMessage.confirmCancel  | `MessageOptions \| string` | `MessageInstance` | 创建确认取消提示 |
| BizMessage.closeAll       | `() => void`               | `void`            | 关闭所有消息     |

### MessageInstance 实例方法

| 方法      | 说明         |
| --------- | ------------ |
| close()   | 手动关闭消息 |
| confirm() | 触发确认操作 |
| cancel()  | 触发取消操作 |

## 使用示例

### 1. 基本消息提示

```javascript
// 简单文本消息
BizMessage('操作完成')

// 带类型的消息
BizMessage.success('保存成功')
BizMessage.error('网络错误，请重试')
BizMessage.warning('数据即将过期')
BizMessage.info('系统维护通知')
```

### 2. 自定义配置

```javascript
// 不自动关闭的消息
BizMessage({
  message: '重要通知：请及时处理',
  type: 'warning',
  duration: 0,
  showClose: true
})

// 无遮罩层的消息
BizMessage({
  message: '后台正在处理中...',
  modal: false,
  duration: 5000
})
```

### 3. 确认对话框

```javascript
// 删除确认
BizMessage.confirmBox({
  message: '确定要删除这条记录吗？删除后无法恢复！',
  confirmButtonText: '确认删除',
  cancelButtonText: '我再想想',
  onConfirm: async () => {
    try {
      await deleteRecord()
      BizMessage.confirmSuccess('删除成功')
    } catch (error) {
      BizMessage.error('删除失败：' + error.message)
    }
  },
  onCancel: () => {
    BizMessage.confirmCancel('已取消删除')
  }
})
```

### 4. HTML 内容渲染

```javascript
BizMessage({
  message: '<strong>重要提醒：</strong><br/>请在 <span style="color: red;">24小时内</span> 完成操作',
  dangerouslyUseHTMLString: true,
  type: 'warning'
})
```

### 5. 批量操作管理

```javascript
// 显示多条消息
const showBatchMessages = () => {
  BizMessage.info('开始批量处理...')

  setTimeout(() => {
    BizMessage.success('第1批数据处理完成')
  }, 1000)

  setTimeout(() => {
    BizMessage.success('第2批数据处理完成')
  }, 2000)

  setTimeout(() => {
    BizMessage.success('所有数据处理完成')
  }, 3000)
}

// 关闭所有消息
const closeAll = () => {
  BizMessage.closeAll()
}
```

## 样式定制

组件使用 SCSS 编写样式，支持以下 CSS 变量定制：

```scss
.cui-new-message-box {
  // 消息框宽度
  .message-box {
    min-width: 410px;
    max-width: 410px;
  }

  // 确认按钮样式
  .message-button.confirm {
    background: linear-gradient(90deg, #ff6822, #ff922b);
  }

  // 取消按钮样式
  .message-button.cancel {
    background-color: #f0f0f0;
    color: #606266;
  }
}
```

## 注意事项

1. **内存管理**：组件会自动管理实例的创建和销毁，无需手动清理
2. **层级管理**：组件使用递增的 z-index 确保新消息显示在最上层
3. **位置计算**：多个消息会自动计算位置，避免重叠
4. **HTML 安全**：使用`dangerouslyUseHTMLString`时请确保内容安全，避免 XSS 攻击
5. **性能优化**：避免在短时间内创建大量消息实例

## 更新日志

### v1.2.0

- ✨ 新增 `confirmBox` 方法，简化确认框创建
- ✨ 新增 `confirmSuccess` 和 `confirmCancel` 快捷方法
- 🐛 修复 TypeScript 类型定义问题
- 💄 优化样式和动画效果

### v1.1.0

- ✨ 支持 HTML 内容渲染
- ✨ 新增多实例位置管理
- 🐛 修复自动关闭计时器问题

### v1.0.0

- 🎉 初始版本发布
- ✨ 支持基本消息类型
- ✨ 支持模态框和确认操作
