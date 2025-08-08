@echo off
REM Jr UI Components 发布脚本 (Windows)
REM 使用方法: scripts\publish-packages.bat [registry-url]

setlocal enabledelayedexpansion

REM 默认私有仓库地址
set REGISTRY_URL=%1
if "%REGISTRY_URL%"=="" set REGISTRY_URL=http://localhost:4873

echo 📦 开始发布 Jr UI Components 到私有仓库...
echo 🔗 目标仓库: %REGISTRY_URL%

REM 检查是否已登录
echo 🔐 检查登录状态...
npm whoami --registry %REGISTRY_URL% >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请先登录到私有仓库:
    echo npm adduser --registry %REGISTRY_URL%
    pause
    exit /b 1
)

REM 构建所有包
echo 🏗️  构建所有包...
npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

echo.
echo 🚀 开始发布各个包...

REM 发布各个包
call :publish_package "packages\utils"
call :publish_package "packages\ui-components"
call :publish_package "packages\code-generator"
call :publish_package "packages\assets-server"

echo.
echo 🎉 所有包发布完成!
echo.
echo 📖 使用方法:
echo # 安装包
echo npm install @jr/ui-components --registry %REGISTRY_URL%
echo.
echo # 或者设置默认仓库
echo npm config set registry %REGISTRY_URL%
echo npm install @jr/ui-components

pause
exit /b 0

:publish_package
set package_path=%~1
if not exist "%package_path%" (
    echo ⚠️  目录 %package_path% 不存在，跳过
    exit /b 0
)

REM 获取包名和版本
for /f "delims=" %%i in ('node -p "require('./%package_path%/package.json').name" 2^>nul') do set package_name=%%i
for /f "delims=" %%i in ('node -p "require('./%package_path%/package.json').version" 2^>nul') do set package_version=%%i

if "%package_name%"=="" (
    echo ⚠️  无法获取 %package_path% 的包信息，跳过
    exit /b 0
)

echo 📤 发布 %package_name%@%package_version%...

pushd %package_path%

REM 检查包是否已存在该版本
npm view %package_name%@%package_version% --registry %REGISTRY_URL% >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  %package_name%@%package_version% 已存在，跳过发布
) else (
    REM 发布包
    npm publish --registry %REGISTRY_URL%
    if %errorlevel% equ 0 (
        echo ✅ %package_name%@%package_version% 发布成功!
    ) else (
        echo ❌ %package_name%@%package_version% 发布失败!
    )
)

popd
exit /b 0
