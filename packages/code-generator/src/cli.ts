#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { BaseStyleGenerator } from './generators/base-style-generator';
import { CodeGenerator } from './index';

const program = new Command();

program
  .name('jr-generate')
  .description('Jr代码生成工具集')
  .version('1.0.0');

// 基础样式生成命令
program
  .command('base-style')
  .description('生成基础CSS样式文件')
  .option('-o, --output <dir>', '输出目录', './src/styles')
  .option('-p, --prefix <prefix>', 'CSS类名前缀', 'jr')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🚀 Jr基础样式生成工具'));
      
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'outputDir',
          message: '输出目录:',
          default: options.output,
        },
        {
          type: 'input',
          name: 'prefix',
          message: 'CSS类名前缀:',
          default: options.prefix,
        },
        {
          type: 'confirm',
          name: 'customColors',
          message: '是否自定义颜色配置?',
          default: false,
        },
      ]);

      let colors;
      if (answers.customColors) {
        // 可以添加更详细的颜色配置询问
        colors = await getCustomColors();
      }

      const generator = new BaseStyleGenerator();
      await generator.generate({
        outputDir: answers.outputDir,
        prefix: answers.prefix,
        colors,
      });

      console.log(chalk.green('✅ 基础样式生成完成！'));
    } catch (error) {
      console.error(chalk.red('❌ 生成失败:'), error);
    }
  });

// Vue组件生成命令
program
  .command('component [name]')
  .description('生成Vue3组件')
  .option('-o, --output <dir>', '输出目录', './src/components')
  .action(async (name, options) => {
    try {
      console.log(chalk.blue('🚀 Jr Vue3组件生成工具'));
      
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '组件名称 (PascalCase):',
          default: name || 'MyComponent',
          validate: (input) => {
            if (!input || !/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
              return '请输入有效的组件名称 (PascalCase格式)';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'description',
          message: '组件描述:',
          default: '新组件',
        },
        {
          type: 'input',
          name: 'outputDir',
          message: '输出目录:',
          default: options.output,
        },
      ]);

      const generator = new CodeGenerator();
      await generator.generateFromTemplate('component', answers.outputDir, {
        name: answers.name,
        description: answers.description,
      });

      console.log(chalk.green('✅ Vue3组件生成完成！'));
    } catch (error) {
      console.error(chalk.red('❌ 生成失败:'), error);
    }
  });

// 列出所有可用的生成器
program
  .command('list')
  .description('列出所有可用的生成器')
  .action(() => {
    console.log(chalk.blue('📋 可用的生成器:'));
    console.log('');
    console.log(chalk.green('  base-style') + '    生成基础CSS样式文件');
    console.log(chalk.green('  component') + '     生成Vue3组件');
    console.log('');
    console.log(chalk.gray('使用 jr-generate <generator> --help 查看详细帮助'));
  });

async function getCustomColors(): Promise<Record<string, string>> {
  const colorAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'primary',
      message: '主色调:',
      default: '#1890ff',
    },
    {
      type: 'input',
      name: 'success',
      message: '成功色:',
      default: '#52c41a',
    },
    {
      type: 'input',
      name: 'warning',
      message: '警告色:',
      default: '#faad14',
    },
    {
      type: 'input',
      name: 'danger',
      message: '危险色:',
      default: '#ff4d4f',
    },
  ]);

  return colorAnswers;
}

program.parse();

export default program; 