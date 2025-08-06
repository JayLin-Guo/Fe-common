import { GeneratorBase } from '../core/generator-base';
import { BaseStyleGenerator } from '../generators/base-style-generator';
import { CodeGenerator } from '../index';
import { GenerateBaseStyleWrapper } from '../generators/legacy-wrapper';

/**
 * 生成器注册表
 * 管理所有可用的生成器
 */
export class GeneratorRegistry {
  private generators: Map<string, GeneratorBase> = new Map();

  constructor() {
    this.registerBuiltinGenerators();
  }

  /**
   * 注册内置生成器
   */
  private registerBuiltinGenerators(): void {
    // 注册新版本的生成器
    this.register(new BaseStyleGenerator());
    
    // 注册包装现有脚本的生成器
    this.register(new GenerateBaseStyleWrapper());
    
    // 可以继续添加其他生成器
    // this.register(new ApiGenerator());
    // this.register(new MockGenerator());
    // this.register(new FormGenerator());
  }

  /**
   * 注册生成器
   */
  register(generator: GeneratorBase): void {
    this.generators.set(generator.getName(), generator);
  }

  /**
   * 获取生成器
   */
  get(name: string): GeneratorBase | undefined {
    return this.generators.get(name);
  }

  /**
   * 获取所有生成器
   */
  getAll(): Map<string, GeneratorBase> {
    return new Map(this.generators);
  }

  /**
   * 列出所有生成器
   */
  list(): Array<{ name: string; description: string }> {
    return Array.from(this.generators.values()).map(generator => ({
      name: generator.getName(),
      description: generator.getDescription(),
    }));
  }
} 