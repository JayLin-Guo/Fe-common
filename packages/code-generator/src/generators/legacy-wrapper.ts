import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { GeneratorBase } from '../core/generator-base';

const execAsync = promisify(exec);

/**
 * 现有脚本包装器
 * 用于调用已有的生成脚本
 */
export class LegacyScriptWrapper extends GeneratorBase {
  private scriptPath: string;

  constructor(name: string, description: string, scriptPath: string) {
    super(name, description);
    this.scriptPath = scriptPath;
  }

  async generate(options: any): Promise<void> {
    try {
      console.log(`🚀 执行脚本: ${this.scriptPath}`);
      
      // 构建命令参数
      const args = this.buildArgs(options);
      const command = `node "${this.scriptPath}" ${args}`;
      
      console.log(`执行命令: ${command}`);
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stdout) {
        console.log(stdout);
      }
      
      if (stderr) {
        console.error(stderr);
      }
      
      console.log('✅ 脚本执行完成！');
    } catch (error) {
      console.error('❌ 脚本执行失败:', error);
      throw error;
    }
  }

  private buildArgs(options: any): string {
    // 将选项转换为命令行参数
    const args: string[] = [];
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        args.push(`--${key}`, String(value));
      }
    });
    
    return args.join(' ');
  }
}

// 使用示例：集成你的 generateBaseStyle.js
export class GenerateBaseStyleWrapper extends LegacyScriptWrapper {
  constructor() {
    super(
      'generate-base-style',
      '生成基础样式文件 (使用现有脚本)',
      // 这里放你的脚本路径
      path.resolve(__dirname, '../../../scripts/generateBaseStyle.js')
    );
  }
} 