# Jr Frontend Common

> Jr前端通用代码仓库 - 基于Lerna的Monorepo架构，Vue3技术栈

## 📦 包含的packages

- **@jr/ui-components** - Vue3 UI组件库
- **@jr/utils** - 通用工具库  
- **@jr/assets-server** - 静态资源文件服务
- **@jr/code-generator** - 代码自动生成工具
- **playground** - 组件库测试环境

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- Yarn >= 1.22.0

### 安装依赖

```bash
# 安装所有workspace依赖
yarn install

# 初始化项目（首次运行）
yarn setup
```

### 开发

```bash
# 启动所有包的开发模式
yarn dev

# 构建所有包
yarn build

# 运行测试
yarn test

# 代码检查
yarn lint
```

### 测试组件库

```bash
# 启动playground测试环境
yarn playground

# 或分步执行
yarn build:ui
yarn dev:playground
```

### 发布

```bash
# 发布到私有npm仓库
yarn publish

# 发布beta版本
yarn publish:beta
```

## 📁 项目结构

```
jr-fe-common/
├── packages/
│   ├── ui-components/        # Vue3 UI组件库
│   ├── utils/               # 工具库
│   ├── assets-server/       # 静态资源服务
│   ├── code-generator/      # 代码生成工具
│   └── playground/          # 测试环境
├── lerna.json              # Lerna 配置
├── package.json            # 根包配置
└── README.md              # 项目说明
```

## 🔧 配置私有NPM

在发布前，请确保已配置私有NPM仓库：

```bash
# 设置私有仓库地址
yarn config set registry http://your-private-npm-registry.com

# 或在项目中配置
# 修改 package.json 和 lerna.json 中的 registry 字段
```

## 📖 packages说明

### Vue3 UI组件库 (@jr/ui-components)

提供统一的Vue3 UI组件，基于Vue3 + TypeScript + SCSS开发。

#### 使用方式

```bash
# 安装
yarn add @jr/ui-components

# 全局注册
import { createApp } from 'vue';
import JrUI from '@jr/ui-components';
import App from './App.vue';

const app = createApp(App);
app.use(JrUI);

# 按需引入
import { BizMessage, BaseTable } from '@jr/ui-components';
```

#### 组件示例

```vue
<template>
  <div>
    <BizMessage type="success" message="操作成功" />
    
    <BaseTable :data="tableData" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BizMessage, BaseTable } from '@jr/ui-components';

const tableData = ref([
  { id: 1, name: '张三', age: 25 }
]);
</script>
```

### 工具库 (@jr/utils)

提供常用的工具函数，包括格式化、验证、存储等功能。

### 静态资源服务 (@jr/assets-server)

提供静态资源文件的HTTP服务，支持缓存、压缩等功能。

### 代码生成工具 (@jr/code-generator)

基于模板的代码自动生成工具，支持自定义Vue3组件模板和交互式配置。

#### 使用方式

```bash
# 全局安装
yarn global add @jr/code-generator

# 生成Vue3组件
jr-generate component MyComponent
```

## 🛠 技术栈

- **Vue3** - 渐进式JavaScript框架
- **TypeScript** - JavaScript超集
- **Vite** - 现代化构建工具
- **SCSS** - CSS预处理器
- **Vitest** - 单元测试框架
- **ESLint + Prettier** - 代码规范
- **Yarn Workspaces** - 包管理
- **Lerna** - Monorepo管理

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 