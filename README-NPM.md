# Jr Private NPM Registry 使用指南

## 🎯 概述

本项目配置了基于 Verdaccio 的私有 NPM 仓库，用于发布和管理 Jr UI Components 相关的包。

## 🛠️ 环境要求

- Docker & Docker Compose
- Node.js 16+
- npm 或 yarn

## 🚀 快速开始

### 1. 部署私有仓库

```bash
# 给脚本执行权限
chmod +x scripts/npm-setup.sh

# 运行部署脚本
./scripts/npm-setup.sh
```

### 2. 访问管理界面

打开浏览器访问：`http://localhost:4873`

### 3. 创建用户账号

```bash
npm adduser --registry http://localhost:4873
```

### 4. 配置 npm registry

```bash
# 临时使用私有仓库
npm install @jr/ui-components --registry http://localhost:4873

# 或者设置为默认仓库
npm config set registry http://localhost:4873
```

## 📦 发布包

### 自动发布（推荐）

```bash
# 给脚本执行权限
chmod +x scripts/publish-packages.sh

# 发布所有包到私有仓库
./scripts/publish-packages.sh

# 发布到指定仓库
./scripts/publish-packages.sh https://npm.yourcompany.com
```

### 手动发布

```bash
# 进入要发布的包目录
cd packages/ui-components

# 构建包
npm run build

# 发布到私有仓库
npm publish --registry http://localhost:4873
```

## 🔧 配置说明

### Verdaccio 配置

配置文件：`verdaccio/config/config.yaml`

主要配置项：

- **存储路径**：`/verdaccio/storage/data`
- **用户认证**：基于 htpasswd
- **包权限**：`@jr/*` 包需要认证，其他包公开访问
- **上游仓库**：代理到 npmjs.org

### 访问控制

```yaml
packages:
  # 私有包（@jr 命名空间）
  '@jr/*':
    access: $authenticated # 需要登录才能访问
    publish: $authenticated # 需要登录才能发布
    proxy: npmjs # 代理到公共仓库

  # 公共包
  '**':
    access: $all # 所有人可访问
    publish: $authenticated # 需要登录才能发布
    proxy: npmjs # 代理到公共仓库
```

## 🌐 生产环境部署

### 1. 域名配置

修改 `nginx/nginx.conf` 中的域名：

```nginx
server_name npm.yourcompany.com;  # 替换为您的域名
```

### 2. SSL 证书

将 SSL 证书放到 `nginx/ssl/` 目录：

- `cert.pem` - 证书文件
- `key.pem` - 私钥文件

然后取消 nginx 配置中 HTTPS 部分的注释。

### 3. 启动完整服务

```bash
docker-compose up -d
```

## 📋 常用命令

### 仓库管理

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs verdaccio

# 重启服务
docker-compose restart verdaccio

# 停止服务
docker-compose down
```

### 用户管理

```bash
# 创建用户
npm adduser --registry http://localhost:4873

# 查看当前用户
npm whoami --registry http://localhost:4873

# 登录
npm login --registry http://localhost:4873
```

### 包管理

```bash
# 搜索包
npm search @jr --registry http://localhost:4873

# 查看包信息
npm view @jr/ui-components --registry http://localhost:4873

# 安装包
npm install @jr/ui-components --registry http://localhost:4873
```

## 🔍 故障排除

### 1. 权限问题

如果遇到权限错误：

```bash
sudo chown -R 10001:65533 verdaccio/storage
sudo chown -R 10001:65533 verdaccio/plugins
```

### 2. 端口占用

如果 4873 端口被占用，修改 `docker-compose.yml`：

```yaml
ports:
  - '5000:4873' # 使用其他端口
```

### 3. 网络问题

如果无法访问上游仓库，可以配置国内镜像：

```yaml
uplinks:
  taobao:
    url: https://registry.npmmirror.com/
```

## 🎯 最佳实践

### 1. 版本管理

- 使用语义化版本（Semantic Versioning）
- 发布前确保测试通过
- 使用 `npm version` 命令更新版本

### 2. 包命名

- 使用 `@jr` 命名空间
- 包名使用小写字母和连字符
- 避免与公共包重名

### 3. 安全考虑

- 定期更新 Verdaccio 版本
- 使用 HTTPS（生产环境）
- 定期备份存储数据
- 限制发布权限

## 📚 相关链接

- [Verdaccio 官方文档](https://verdaccio.org/docs/what-is-verdaccio)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [npm 官方文档](https://docs.npmjs.com/)
