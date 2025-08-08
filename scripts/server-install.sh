#!/bin/bash

# Jr NPM 私有仓库服务器一键安装脚本
# 适用于 Ubuntu/Debian/CentOS 系统

set -e

echo "🚀 Jr NPM 私有仓库服务器安装脚本"
echo "========================================"

# 获取系统信息
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo "❌ 无法检测操作系统版本"
    exit 1
fi

echo "📱 检测到系统: $OS $VER"

# 更新系统包
echo "📦 更新系统包..."
if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
    sudo apt update && sudo apt upgrade -y
    PACKAGE_MANAGER="apt"
elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
    sudo yum update -y
    PACKAGE_MANAGER="yum"
else
    echo "⚠️ 未识别的操作系统，请手动安装依赖"
fi

# 安装基础工具
echo "🛠️ 安装基础工具..."
if [ "$PACKAGE_MANAGER" == "apt" ]; then
    sudo apt install -y curl wget git unzip
elif [ "$PACKAGE_MANAGER" == "yum" ]; then
    sudo yum install -y curl wget git unzip
fi

# 安装Docker
echo "🐳 安装Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh

    # 启动Docker服务
    sudo systemctl start docker
    sudo systemctl enable docker

    # 添加当前用户到docker组
    sudo usermod -aG docker $USER

    echo "✅ Docker 安装完成"
else
    echo "✅ Docker 已安装"
fi

# 安装Docker Compose
echo "🐋 安装Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose 安装完成"
else
    echo "✅ Docker Compose 已安装"
fi

# 创建项目目录
echo "📁 创建项目目录..."
PROJECT_DIR="/opt/jr-npm-registry"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR

# 创建配置目录
mkdir -p verdaccio/storage/data
mkdir -p verdaccio/config
mkdir -p verdaccio/plugins
mkdir -p nginx/ssl

# 下载配置文件（如果在Git仓库中）
echo "⬇️ 创建配置文件..."

# 创建docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  verdaccio:
    image: verdaccio/verdaccio:5
    container_name: verdaccio-npm
    restart: unless-stopped
    ports:
      - "4873:4873"
    volumes:
      - ./verdaccio/storage:/verdaccio/storage
      - ./verdaccio/config:/verdaccio/conf
      - ./verdaccio/plugins:/verdaccio/plugins
    environment:
      - VERDACCIO_USER_UID=10001
      - VERDACCIO_USER_GID=65533
    networks:
      - npm-network

  nginx:
    image: nginx:alpine
    container_name: verdaccio-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - verdaccio
    networks:
      - npm-network

networks:
  npm-network:
    driver: bridge
EOF

# 创建Verdaccio配置
cat > verdaccio/config/config.yaml << 'EOF'
storage: /verdaccio/storage/data
plugins: /verdaccio/plugins

web:
  title: Jr Private NPM Registry

auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
    max_users: -1
    algorithm: bcrypt
    rounds: 10

uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    timeout: 30s

packages:
  '@jr/*':
    access: $authenticated
    publish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs

server:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

logs: { type: stdout, format: pretty, level: http }

listen:
  - 0.0.0.0:4873

publish:
  allow_offline: false

security:
  api:
    jwt:
      sign:
        expiresIn: 7d
      verify:
        someProp: [value]
  web:
    sign:
      expiresIn: 1h
    verify:
      someProp: [value]
EOF

# 创建Nginx配置
cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream verdaccio {
        server verdaccio:4873;
    }

    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://verdaccio;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300;
            proxy_connect_timeout 300;
            proxy_send_timeout 300;
        }
    }
}
EOF

# 设置权限
echo "🔐 设置目录权限..."
sudo chown -R 10001:65533 verdaccio/storage
sudo chown -R 10001:65533 verdaccio/plugins

# 配置防火墙
echo "🛡️ 配置防火墙..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22    # SSH
    sudo ufw allow 80    # HTTP
    sudo ufw allow 443   # HTTPS
    sudo ufw allow 4873  # Verdaccio
    sudo ufw --force enable
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=22/tcp
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --permanent --add-port=443/tcp
    sudo firewall-cmd --permanent --add-port=4873/tcp
    sudo firewall-cmd --reload
fi

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 检查服务状态
if docker-compose ps | grep -q "verdaccio.*Up"; then
    echo ""
    echo "🎉 Jr NPM 私有仓库部署成功！"
    echo "========================================"
    echo "🌐 访问地址: http://$(curl -s ifconfig.me):4873"
    echo "🌐 本地访问: http://localhost:4873"
    echo ""
    echo "📝 下一步操作:"
    echo "1. 打开浏览器访问上述地址"
    echo "2. 创建用户账号:"
    echo "   npm adduser --registry http://$(curl -s ifconfig.me):4873"
    echo "3. 发布您的包"
    echo ""
    echo "📁 项目目录: $PROJECT_DIR"
    echo "📊 查看日志: cd $PROJECT_DIR && docker-compose logs -f"
    echo "🔄 重启服务: cd $PROJECT_DIR && docker-compose restart"
    echo "🛑 停止服务: cd $PROJECT_DIR && docker-compose down"
else
    echo "❌ 服务启动失败，请检查日志:"
    docker-compose logs
fi
