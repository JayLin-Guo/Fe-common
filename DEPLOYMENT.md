# 部署指南

## 🔧 私有NPM配置

### 1. 设置私有NPM仓库

#### 使用Verdaccio搭建私有NPM（推荐）

```bash
# 全局安装verdaccio
npm install -g verdaccio

# 启动服务
verdaccio

# 默认运行在 http://localhost:4873
```

#### 配置客户端

```bash
# 设置registry
npm config set registry http://your-private-npm-registry.com

# 或者使用nrm管理多个registry
npm install -g nrm
nrm add private http://your-private-npm-registry.com
nrm use private
```

### 2. 配置认证

```bash
# 添加用户（首次使用）
npm adduser --registry=http://your-private-npm-registry.com

# 或登录已有用户
npm login --registry=http://your-private-npm-registry.com
```

### 3. 发布包

```bash
# 发布所有包
npm run publish

# 发布指定包
lerna publish from-package --registry=http://your-private-npm-registry.com

# 发布beta版本
npm run publish:beta
```

## 🚀 CI/CD配置

### GitHub Actions示例

创建`.github/workflows/publish.yml`:

```yaml
name: Publish to Private NPM

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'http://your-private-npm-registry.com'

      - name: Install dependencies
        run: npm ci

      - name: Build packages
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Publish packages
        run: npm run publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Jenkins Pipeline示例

```groovy
pipeline {
    agent any
    
    tools {
        nodejs '18'
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Publish') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run publish'
            }
        }
    }
}
```

## 📋 发布流程

### 1. 开发阶段

```bash
# 克隆项目
git clone <repository-url>
cd jr-fe-common

# 初始化项目
npm run setup

# 开发
npm run dev
```

### 2. 测试阶段

```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 构建验证
npm run build
```

### 3. 发布阶段

```bash
# 创建版本
npm run version

# 推送到仓库
git push --follow-tags

# 发布到私有NPM
npm run publish
```

## 🔍 版本管理策略

### Independent模式（推荐）

- 每个包独立版本号
- 适合功能相对独立的包
- 更灵活的发布策略

### Fixed模式

- 所有包共享版本号
- 适合紧密耦合的包
- 更简单的版本管理

配置在`lerna.json`中的`version`字段：
- `"independent"` - 独立模式
- `"1.0.0"` - 固定模式

## 🛠 维护建议

1. **定期更新依赖**: 使用`npm audit`检查安全漏洞
2. **代码质量**: 保持测试覆盖率 > 80%
3. **文档维护**: 及时更新README和CHANGELOG
4. **版本规范**: 遵循语义化版本(SemVer)
5. **安全性**: 定期轮换NPM token 