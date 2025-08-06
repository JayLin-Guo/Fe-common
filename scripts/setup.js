#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始初始化 Jr Frontend Common 项目...\n');

// 检查Node版本
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js 版本需要 >= 16.0.0，当前版本:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js 版本检查通过:', nodeVersion);

try {
  // 安装根依赖
  console.log('📦 安装根依赖...');
  execSync('npm install', { stdio: 'inherit' });

  // 初始化husky
  console.log('🐺 设置 Git hooks...');
  execSync('npx husky install', { stdio: 'inherit' });

  // 创建必要的目录
  console.log('📁 创建必要的目录...');
  const directories = [
    'packages/assets-server/assets',
    'packages/code-generator/templates/component',
    'packages/code-generator/templates/utils',
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  创建目录: ${dir}`);
    }
  });

  // 初始化 lerna
  console.log('🔧 初始化 Lerna...');
  execSync('npx lerna bootstrap', { stdio: 'inherit' });

  console.log('\n🎉 项目初始化完成！');
  console.log('\n📋 下一步操作:');
  console.log('1. 修改 package.json 和 lerna.json 中的私有npm仓库地址');
  console.log('2. 运行 npm run dev 启动开发模式');
  console.log('3. 运行 npm run build 构建所有包');
  console.log('4. 运行 npm run publish 发布到私有npm');

} catch (error) {
  console.error('❌ 初始化失败:', error.message);
  process.exit(1);
} 