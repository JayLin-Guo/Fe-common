# 现有工具迁移指南

## 📋 概述

本指南帮助你将现有的代码生成工具（如 `generateBaseStyle.js`）集成到新的 `@jr/code-generator` 架构中。

## 🔧 集成方式

### 方式1：脚本包装（推荐，快速集成）

适合暂时不想重写现有脚本的情况，直接包装调用。

#### 步骤1：复制现有脚本

```bash
# 将你的现有脚本复制到 code-generator 包中
mkdir -p packages/code-generator/scripts
cp D:/FE-PROJECT/AgentPlatFront/scripts/generateBaseStyle.js packages/code-generator/scripts/
```

#### 步骤2：创建包装器

```typescript
// packages/code-generator/src/generators/generate-base-style-wrapper.ts
import { LegacyScriptWrapper } from './legacy-wrapper';
import path from 'path';

export class GenerateBaseStyleWrapper extends LegacyScriptWrapper {
  constructor() {
    super(
      'base-style-legacy',
      '生成基础样式文件 (现有脚本)',
      path.resolve(__dirname, '../../scripts/generateBaseStyle.js')
    );
  }
}
```

#### 步骤3：注册到CLI

```typescript
// packages/code-generator/src/cli.ts
program
  .command('base-style-legacy')
  .description('生成基础样式文件 (使用现有脚本)')
  .action(async () => {
    const wrapper = new GenerateBaseStyleWrapper();
    await wrapper.generate({});
  });
```

### 方式2：代码重构（长期推荐）

将现有脚本的逻辑迁移到TypeScript类中，获得更好的类型安全和维护性。

#### 示例：迁移 generateBaseStyle.js

假设你的 `generateBaseStyle.js` 是这样的：

```javascript
// 原有的 generateBaseStyle.js
const fs = require('fs');
const path = require('path');

function generateBaseStyle(options = {}) {
  const { outputDir = './src/styles', prefix = 'app' } = options;
  
  // 你的具体逻辑
  const cssContent = generateCSS(prefix);
  
  fs.writeFileSync(path.join(outputDir, 'base.css'), cssContent);
  console.log('CSS generated successfully!');
}

function generateCSS(prefix) {
  return \`
    .\${prefix}-container { max-width: 1200px; margin: 0 auto; }
    .\${prefix}-btn { padding: 8px 16px; border-radius: 4px; }
  \`;
}

module.exports = { generateBaseStyle };
```

迁移到TypeScript：

```typescript
// packages/code-generator/src/generators/base-style-generator.ts
import fs from 'fs-extra';
import path from 'path';
import { GeneratorBase } from '../core/generator-base';

export interface BaseStyleOptions {
  outputDir?: string;
  prefix?: string;
  // 添加更多配置选项
}

export class BaseStyleGenerator extends GeneratorBase {
  constructor() {
    super('base-style', '生成基础样式文件');
  }

  async generate(options: BaseStyleOptions): Promise<void> {
    const { outputDir = './src/styles', prefix = 'app' } = options;
    
    console.log('🎨 开始生成基础样式...');
    
    // 迁移你的原有逻辑
    const cssContent = this.generateCSS(prefix);
    
    await fs.ensureDir(outputDir);
    await fs.writeFile(path.join(outputDir, 'base.css'), cssContent);
    
    console.log('✅ CSS生成完成!');
  }

  private generateCSS(prefix: string): string {
    return \`
      .\${prefix}-container { max-width: 1200px; margin: 0 auto; }
      .\${prefix}-btn { padding: 8px 16px; border-radius: 4px; }
    \`;
  }
}
```

## 📂 建议的目录结构

```
packages/code-generator/
├── scripts/                     # 现有脚本存放
│   ├── generateBaseStyle.js     # 你的原有脚本
│   ├── generateAPI.js           # 其他现有脚本
│   └── ...
├── src/
│   ├── generators/              # 生成器
│   │   ├── base-style-generator.ts      # 重构版本
│   │   ├── base-style-wrapper.ts        # 包装版本
│   │   ├── api-generator.ts             # API生成器
│   │   └── legacy-wrapper.ts            # 通用包装器
│   └── cli.ts                   # CLI入口
└── templates/                   # 模板文件
```

## 🚀 使用示例

### 现有脚本包装版本

```bash
# 直接调用现有脚本
jr-generate base-style-legacy

# 带参数调用
jr-generate base-style-legacy --outputDir ./dist/styles --prefix my-app
```

### 重构版本

```bash
# 使用新的TypeScript版本
jr-generate base-style

# 交互式配置
jr-generate base-style
? 输出目录: ./src/styles
? CSS前缀: jr
? 是否生成响应式样式: Yes
```

## 🔧 逐步迁移策略

### 阶段1：快速集成（1天）
- 使用脚本包装方式
- 保持现有工具正常工作
- 统一CLI入口

### 阶段2：增强功能（1周）
- 添加交互式配置
- 改进错误处理
- 添加更多选项

### 阶段3：重构优化（2-3周）
- 逐个重构为TypeScript
- 添加类型安全
- 优化代码结构

## 💡 最佳实践

1. **保持向后兼容**：新旧版本并存，逐步迁移
2. **统一配置格式**：使用JSON或YAML配置文件
3. **完善文档**：为每个生成器编写使用文档
4. **单元测试**：为重构的代码添加测试
5. **版本控制**：使用语义化版本管理

## 🤔 常见问题

### Q: 现有脚本依赖特定的Node模块怎么办？

A: 在 `code-generator` 的 `package.json` 中添加这些依赖：

```json
{
  "dependencies": {
    "your-existing-dependency": "^1.0.0"
  }
}
```

### Q: 脚本需要访问其他项目文件怎么办？

A: 使用相对路径或配置项来指定文件位置：

```typescript
const configPath = path.resolve(process.cwd(), './config/app.config.js');
```

### Q: 如何处理不同环境的配置？

A: 使用环境变量或配置文件：

```typescript
const isProduction = process.env.NODE_ENV === 'production';
const config = require(isProduction ? './prod.config' : './dev.config');
```

## 📞 需要帮助？

如果在迁移过程中遇到问题，请提供：
1. 现有脚本的功能描述
2. 脚本的关键代码片段
3. 期望的使用方式
4. 遇到的具体错误

我们可以一起制定最适合的迁移方案！ 