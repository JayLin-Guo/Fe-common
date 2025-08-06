# @jr/code-generator

> Jr代码自动生成工具集 - 集成现有脚本，统一管理代码生成

## 🎯 功能特性

- ✅ **统一CLI入口**：`jr-generate` 命令管理所有生成工具
- ✅ **现有脚本集成**：无缝集成你的 `generateBaseStyle.js` 等现有工具
- ✅ **交互式界面**：友好的命令行交互体验
- ✅ **插件化架构**：轻松扩展新的生成器
- ✅ **TypeScript支持**：完整的类型安全

## 📦 安装

```bash
# 全局安装
npm install -g @jr/code-generator

# 或项目内使用
npx @jr/code-generator
```

## 🚀 快速开始

### 列出所有可用的生成器

```bash
jr-generate list
```

### 生成基础样式文件

```bash
# 使用交互式界面
jr-generate base-style

# 直接指定参数
jr-generate base-style --output ./src/styles --prefix jr
```

### 生成Vue3组件

```bash
# 生成组件
jr-generate component MyButton

# 指定输出目录
jr-generate component MyCard --output ./src/components
```

## 🔧 现有工具集成

如果你有现有的生成脚本（如 `generateBaseStyle.js`），可以通过以下方式快速集成：

### 方式1：脚本包装（推荐）

```bash
# 1. 复制现有脚本
mkdir -p packages/code-generator/scripts
cp your-script.js packages/code-generator/scripts/

# 2. 使用包装器
jr-generate your-script-name
```

### 方式2：代码重构

将现有JavaScript脚本重构为TypeScript类，获得更好的类型安全和维护性。

详细步骤请参考：[迁移指南](./MIGRATION_GUIDE.md)

## 📋 可用生成器

| 生成器 | 命令 | 描述 |
|--------|------|------|
| 基础样式 | `base-style` | 生成项目基础CSS样式文件 |
| Vue3组件 | `component [name]` | 生成标准Vue3组件结构 |
| 现有脚本 | `base-style-legacy` | 调用现有的generateBaseStyle.js |

## 🏗️ 扩展新生成器

### 1. 创建生成器类

```typescript
// src/generators/my-generator.ts
import { GeneratorBase } from '../core/generator-base';

export class MyGenerator extends GeneratorBase {
  constructor() {
    super('my-tool', '我的生成工具');
  }

  async generate(options: any): Promise<void> {
    // 你的生成逻辑
  }
}
```

### 2. 注册到CLI

```typescript
// src/cli.ts
program
  .command('my-tool')
  .description('我的生成工具')
  .action(async () => {
    const generator = new MyGenerator();
    await generator.generate({});
  });
```

## 📁 项目结构

```
packages/code-generator/
├── src/
│   ├── core/                    # 核心基类
│   ├── generators/              # 生成器集合
│   ├── registry/                # 生成器注册表
│   ├── cli.ts                   # CLI入口
│   └── index.ts                 # 主入口
├── scripts/                     # 现有脚本存放
├── templates/                   # 模板文件
├── MIGRATION_GUIDE.md           # 迁移指南
└── README.md
```

## 🔄 迁移现有工具

我们提供了完整的迁移指南来帮助你集成现有的生成工具：

1. **快速集成**：使用脚本包装器，1天内完成
2. **逐步重构**：转换为TypeScript，获得更好的维护性
3. **统一管理**：所有生成工具使用同一个CLI入口

详细步骤：[查看迁移指南](./MIGRATION_GUIDE.md)

## 💡 使用场景

- **基础样式生成**：生成项目通用CSS、SCSS文件
- **Vue3组件模板**：快速创建标准组件结构
- **API接口生成**：根据接口文档生成请求代码
- **Mock数据生成**：生成测试用的模拟数据
- **表单配置生成**：生成动态表单配置
- **路由配置生成**：自动生成路由文件

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📞 支持

如果在使用过程中遇到问题：

1. 查看 [迁移指南](./MIGRATION_GUIDE.md)
2. 提交 Issue 描述问题
3. 提供现有脚本的代码片段

我们会帮助你找到最适合的集成方案！ 