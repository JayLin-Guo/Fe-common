#!/bin/bash

# 服务器环境检查脚本
echo "🔍 检查服务器环境..."

# 检查操作系统
echo "📱 操作系统信息:"
uname -a
echo ""

# 检查CPU和内存
echo "💻 硬件信息:"
echo "CPU: $(nproc) 核心"
echo "内存: $(free -h | awk '/^Mem:/ {print $2}')"
echo "磁盘空间: $(df -h / | awk 'NR==2 {print $4}' | head -1) 可用"
echo ""

# 检查Docker
echo "🐳 检查Docker状态:"
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装: $(docker --version)"
    if systemctl is-active --quiet docker; then
        echo "✅ Docker 服务运行中"
    else
        echo "⚠️ Docker 服务未运行"
    fi
else
    echo "❌ Docker 未安装"
fi

# 检查Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose 已安装: $(docker-compose --version)"
else
    echo "❌ Docker Compose 未安装"
fi
echo ""

# 检查端口占用
echo "🔗 检查端口占用:"
for port in 4873 80 443; do
    if netstat -tuln | grep -q ":$port "; then
        echo "⚠️ 端口 $port 已被占用"
    else
        echo "✅ 端口 $port 可用"
    fi
done
echo ""

# 检查防火墙
echo "🛡️ 防火墙状态:"
if command -v ufw &> /dev/null; then
    ufw status
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --state
else
    echo "未检测到常见防火墙工具"
fi
