#!/bin/bash

# Jr UI Components 发布脚本
# 使用方法: ./scripts/publish-packages.sh [registry-url]

set -e

# 默认私有仓库地址
REGISTRY_URL=${1:-"http://localhost:4873"}

echo "📦 开始发布 Jr UI Components 到私有仓库..."
echo "🔗 目标仓库: $REGISTRY_URL"

# 检查是否已登录
echo "🔐 检查登录状态..."
if ! npm whoami --registry $REGISTRY_URL &> /dev/null; then
    echo "❌ 请先登录到私有仓库:"
    echo "npm adduser --registry $REGISTRY_URL"
    exit 1
fi

# 构建所有包
echo "🏗️  构建所有包..."
npm run build

# 发布函数
publish_package() {
    local package_path=$1
    local package_name=$(node -p "require('$package_path/package.json').name")
    local package_version=$(node -p "require('$package_path/package.json').version")

    echo "📤 发布 $package_name@$package_version..."

    cd $package_path

    # 检查包是否已存在该版本
    if npm view $package_name@$package_version --registry $REGISTRY_URL &> /dev/null; then
        echo "⚠️  $package_name@$package_version 已存在，跳过发布"
    else
        # 发布包
        npm publish --registry $REGISTRY_URL
        echo "✅ $package_name@$package_version 发布成功!"
    fi

    cd - > /dev/null
}

# 发布各个包
echo ""
echo "🚀 开始发布各个包..."

# 发布 utils 包
if [ -d "packages/utils" ]; then
    publish_package "packages/utils"
fi

# 发布 ui-components 包
if [ -d "packages/ui-components" ]; then
    publish_package "packages/ui-components"
fi

# 发布 code-generator 包
if [ -d "packages/code-generator" ]; then
    publish_package "packages/code-generator"
fi

# 发布 assets-server 包
if [ -d "packages/assets-server" ]; then
    publish_package "packages/assets-server"
fi

echo ""
echo "🎉 所有包发布完成!"
echo ""
echo "📖 使用方法:"
echo "# 安装包"
echo "npm install @jr/ui-components --registry $REGISTRY_URL"
echo ""
echo "# 或者设置默认仓库"
echo "npm config set registry $REGISTRY_URL"
echo "npm install @jr/ui-components"
