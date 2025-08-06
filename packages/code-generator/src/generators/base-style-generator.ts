import fs from 'fs-extra';
import path from 'path';
import { GeneratorBase, GenerateOptions } from '../core/generator-base';

export interface BaseStyleOptions {
  outputDir: string;
  prefix?: string;
  colors?: Record<string, string>;
  breakpoints?: Record<string, string>;
  spacing?: Record<string, string>;
}

/**
 * 基础样式生成器
 * 用于生成项目通用的CSS样式文件
 */
export class BaseStyleGenerator extends GeneratorBase {
  constructor() {
    super('base-style', '生成基础CSS样式文件');
  }

  async generate(options: BaseStyleOptions): Promise<void> {
    const { outputDir, prefix = 'jr', colors, breakpoints, spacing } = options;

    console.log('🎨 开始生成基础样式文件...');

    // 确保输出目录存在
    await fs.ensureDir(outputDir);

    // 生成变量文件
    await this.generateVariables(outputDir, { prefix, colors, breakpoints, spacing });
    
    // 生成基础样式
    await this.generateBaseStyles(outputDir, prefix);
    
    // 生成工具类
    await this.generateUtilities(outputDir, prefix);

    console.log('✅ 基础样式文件生成完成！');
    console.log(`📁 输出目录: ${outputDir}`);
  }

  private async generateVariables(
    outputDir: string, 
    config: { prefix: string; colors?: Record<string, string>; breakpoints?: Record<string, string>; spacing?: Record<string, string>; }
  ): Promise<void> {
    const { prefix, colors, breakpoints, spacing } = config;

    const variables = `
// CSS 变量定义
:root {
  // 颜色变量
${this.generateColorVariables(colors || this.getDefaultColors())}

  // 断点变量
${this.generateBreakpointVariables(breakpoints || this.getDefaultBreakpoints())}

  // 间距变量
${this.generateSpacingVariables(spacing || this.getDefaultSpacing())}

  // 其他通用变量
  --${prefix}-border-radius: 4px;
  --${prefix}-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --${prefix}-transition: all 0.2s ease-in-out;
}
`;

    await fs.writeFile(path.join(outputDir, '_variables.scss'), variables);
  }

  private async generateBaseStyles(outputDir: string, prefix: string): Promise<void> {
    const baseStyles = `
// 基础样式重置
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--${prefix}-text-color);
  background-color: var(--${prefix}-bg-color);
}

// 通用容器
.${prefix}-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

// 响应式容器
@media (min-width: var(--${prefix}-breakpoint-sm)) {
  .${prefix}-container {
    padding: 0 24px;
  }
}

@media (min-width: var(--${prefix}-breakpoint-lg)) {
  .${prefix}-container {
    padding: 0 32px;
  }
}
`;

    await fs.writeFile(path.join(outputDir, '_base.scss'), baseStyles);
  }

  private async generateUtilities(outputDir: string, prefix: string): Promise<void> {
    const utilities = `
// 工具类
// 文本对齐
.${prefix}-text-left { text-align: left; }
.${prefix}-text-center { text-align: center; }
.${prefix}-text-right { text-align: right; }

// 显示/隐藏
.${prefix}-show { display: block !important; }
.${prefix}-hide { display: none !important; }

// Flex布局
.${prefix}-flex { display: flex; }
.${prefix}-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.${prefix}-flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 间距工具类
${this.generateSpacingUtilities(prefix)}

// 颜色工具类  
${this.generateColorUtilities(prefix)}
`;

    await fs.writeFile(path.join(outputDir, '_utilities.scss'), utilities);

    // 生成主入口文件
    const mainEntry = `
@import './variables';
@import './base';
@import './utilities';
`;

    await fs.writeFile(path.join(outputDir, 'index.scss'), mainEntry);
  }

  private generateColorVariables(colors: Record<string, string>): string {
    return Object.entries(colors)
      .map(([name, value]) => `  --jr-${name}: ${value};`)
      .join('\n');
  }

  private generateBreakpointVariables(breakpoints: Record<string, string>): string {
    return Object.entries(breakpoints)
      .map(([name, value]) => `  --jr-breakpoint-${name}: ${value};`)
      .join('\n');
  }

  private generateSpacingVariables(spacing: Record<string, string>): string {
    return Object.entries(spacing)
      .map(([name, value]) => `  --jr-spacing-${name}: ${value};`)
      .join('\n');
  }

  private generateSpacingUtilities(prefix: string): string {
    const spacings = ['xs', 'sm', 'md', 'lg', 'xl'];
    const properties = ['margin', 'padding'];
    const directions = ['', '-top', '-right', '-bottom', '-left', '-x', '-y'];

    let utilities = '';

    properties.forEach(prop => {
      const shorthand = prop === 'margin' ? 'm' : 'p';
      
      spacings.forEach(size => {
        directions.forEach(dir => {
          const className = `.${prefix}-${shorthand}${dir}-${size}`;
          const cssProps = this.getSpacingProperties(prop, dir, `var(--jr-spacing-${size})`);
          utilities += `${className} { ${cssProps} }\n`;
        });
      });
    });

    return utilities;
  }

  private generateColorUtilities(prefix: string): string {
    const colors = ['primary', 'secondary', 'success', 'warning', 'danger'];
    let utilities = '';

    colors.forEach(color => {
      utilities += `.${prefix}-text-${color} { color: var(--jr-${color}); }\n`;
      utilities += `.${prefix}-bg-${color} { background-color: var(--jr-${color}); }\n`;
      utilities += `.${prefix}-border-${color} { border-color: var(--jr-${color}); }\n`;
    });

    return utilities;
  }

  private getSpacingProperties(property: string, direction: string, value: string): string {
    const prop = property;
    
    switch (direction) {
      case '': return `${prop}: ${value};`;
      case '-top': return `${prop}-top: ${value};`;
      case '-right': return `${prop}-right: ${value};`;
      case '-bottom': return `${prop}-bottom: ${value};`;
      case '-left': return `${prop}-left: ${value};`;
      case '-x': return `${prop}-left: ${value}; ${prop}-right: ${value};`;
      case '-y': return `${prop}-top: ${value}; ${prop}-bottom: ${value};`;
      default: return `${prop}: ${value};`;
    }
  }

  private getDefaultColors(): Record<string, string> {
    return {
      'primary': '#1890ff',
      'secondary': '#6c757d',
      'success': '#52c41a',
      'warning': '#faad14',
      'danger': '#ff4d4f',
      'text-color': '#333333',
      'text-secondary': '#666666',
      'text-disabled': '#999999',
      'bg-color': '#ffffff',
      'bg-secondary': '#f5f5f5',
      'border-color': '#d9d9d9',
    };
  }

  private getDefaultBreakpoints(): Record<string, string> {
    return {
      'xs': '480px',
      'sm': '768px',
      'md': '992px',
      'lg': '1200px',
      'xl': '1600px',
    };
  }

  private getDefaultSpacing(): Record<string, string> {
    return {
      'xs': '4px',
      'sm': '8px',
      'md': '16px',
      'lg': '24px',
      'xl': '32px',
    };
  }
} 