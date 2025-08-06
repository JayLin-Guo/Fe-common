# Playground

> Jr UI组件库测试环境

## 🎯 目的

这个playground项目用于测试 `@jr/ui-components` 组件库，提供一个可视化的测试环境来验证组件的功能。

## 🚀 启动

### 方式一：使用根目录命令（推荐）

```bash
# 在根目录安装依赖
yarn install

# 构建组件库并启动playground
yarn playground
```

### 方式二：分步执行

```bash
# 安装依赖
yarn install

# 构建组件库
yarn build:ui

# 启动playground
yarn dev:playground
```

### 方式三：开发模式

```bash
# 同时启动组件库开发模式和playground
yarn dev:ui & yarn dev:playground
```

## 🧪 测试内容

### 全量引入测试
测试通过 `app.use(JrUI)` 全量引入组件库的方式：

```typescript
import JrUI from '@jr/ui-components';
app.use(JrUI);
```

### 按需引入测试  
测试通过具名导入的方式按需引入组件：

```typescript
import { BizMessage, BaseTable } from '@jr/ui-components';
```

## 📋 支持的组件

- **BizMessage** - 业务消息组件
- **BizMainForm** - 主表单组件  
- **BizArea** - 业务区域组件
- **BaseTable** - 基础表格组件

## 🔧 添加新组件测试

1. 在 `src/App.vue` 的 `components` 数组中添加新组件信息
2. 在模板中添加对应的测试区域
3. 根据需要导入组件进行测试

## 📝 注意事项

- 这个项目仅用于开发测试，不会被发布
- 使用 `workspace:*` 依赖本地的 `@jr/ui-components` 包
- 通过yarn workspace管理依赖关系
- 组件库修改后需要重新构建才能在playground中看到效果
- 支持热重载，修改playground代码会实时更新

## 🛠 常用命令

```bash
# 安装所有workspace依赖
yarn install

# 构建所有包
yarn build

# 只构建UI组件库
yarn build:ui

# 启动playground
yarn dev:playground

# 构建并启动playground
yarn playground

# 运行所有测试
yarn test

# 代码检查
yarn lint
``` 