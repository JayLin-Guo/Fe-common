@echo off
REM Jr Private NPM Registry 部署脚本 (Windows)
REM 使用方法: scripts\npm-setup.bat

echo 🚀 开始部署 Jr Private NPM Registry...

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose 未安装，请先安装 Docker Compose
    pause
    exit /b 1
)

REM 创建必要的目录
echo 📁 创建目录结构...
if not exist "verdaccio\storage\data" mkdir verdaccio\storage\data
if not exist "verdaccio\plugins" mkdir verdaccio\plugins
if not exist "nginx\ssl" mkdir nginx\ssl

REM 启动服务
echo 🐳 启动 Docker 服务...
docker-compose up -d verdaccio

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
docker-compose ps | findstr "verdaccio.*Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Verdaccio 启动成功!
    echo 🌐 访问地址: http://localhost:4873
    echo.
    echo 📝 接下来的步骤:
    echo 1. 打开浏览器访问 http://localhost:4873
    echo 2. 创建用户账号
    echo 3. 配置 npm registry
    echo 4. 发布您的包
    echo.
    echo 💡 快速配置命令:
    echo npm config set registry http://localhost:4873
    echo npm adduser --registry http://localhost:4873
) else (
    echo ❌ 服务启动失败，请检查日志:
    docker-compose logs verdaccio
    pause
    exit /b 1
)

pause
