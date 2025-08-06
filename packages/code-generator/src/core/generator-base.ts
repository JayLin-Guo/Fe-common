/**
 * 生成器基类
 * 所有生成器都继承这个基类
 */
export abstract class GeneratorBase {
  protected name: string;
  protected description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  abstract generate(options: any): Promise<void>;
}

export interface GenerateOptions {
  templatePath?: string;
  outputPath: string;
  data: Record<string, any>;
  overwrite?: boolean;
} 