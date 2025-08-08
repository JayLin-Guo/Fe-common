#!/bin/bash

# Jr Private NPM Registry 部署脚本
# 使用方法: ./scripts/npm-setup.sh

set -e

echo "🚀 开始部署 Jr Private NPM Registry..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建目录结构..."
mkdir -p verdaccio/storage/data
mkdir -p verdaccio/plugins
mkdir -p nginx/ssl

# 设置权限
echo "🔐 设置目录权限..."
sudo chown -R 10001:65533 verdaccio/storage
sudo chown -R 10001:65533 verdaccio/plugins

# 启动服务
echo "🐳 启动 Docker 服务..."
docker-compose up -d verdaccio

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
if docker-compose ps | grep -q "verdaccio.*Up"; then
    echo "✅ Verdaccio 启动成功!"
    echo "🌐 访问地址: http://localhost:4873"
    echo ""
    echo "📝 接下来的步骤:"
    echo "1. 打开浏览器访问 http://localhost:4873"
    echo "2. 创建用户账号"
    echo "3. 配置 npm registry"
    echo "4. 发布您的包"
    echo ""
    echo "💡 快速配置命令:"
    echo "npm set registry http://localhost:4873"
    echo "npm adduser --registry http://localhost:4873"
else
    echo "❌ 服务启动失败，请检查日志:"
    docker-compose logs verdaccio
    exit 1
fi
