import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';

export interface GenerateOptions {
  templatePath: string;
  outputPath: string;
  data: Record<string, any>;
  overwrite?: boolean;
}

export interface TemplateConfig {
  name: string;
  description: string;
  files: Array<{
    template: string;
    output: string;
  }>;
  prompts?: Array<{
    name: string;
    type: 'input' | 'select' | 'confirm';
    message: string;
    choices?: string[];
    default?: any;
  }>;
}

export class CodeGenerator {
  private templatesDir: string;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || path.join(__dirname, '../templates');
  }

  /**
   * 获取可用模板列表
   */
  public async getTemplates(): Promise<TemplateConfig[]> {
    const templates: TemplateConfig[] = [];
    const templateDirs = await fs.readdir(this.templatesDir);

    for (const dir of templateDirs) {
      const templatePath = path.join(this.templatesDir, dir);
      const configPath = path.join(templatePath, 'template.json');
      
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJson(configPath);
        templates.push(config);
      }
    }

    return templates;
  }

  /**
   * 生成代码
   */
  public async generate(options: GenerateOptions): Promise<void> {
    const { templatePath, outputPath, data, overwrite = false } = options;

    // 检查输出路径是否存在
    if (!overwrite && await fs.pathExists(outputPath)) {
      throw new Error(`Output path already exists: ${outputPath}`);
    }

    // 确保输出目录存在
    await fs.ensureDir(path.dirname(outputPath));

    // 读取模板内容
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    
    // 编译模板
    const template = Handlebars.compile(templateContent);
    
    // 生成内容
    const result = template(data);
    
    // 写入文件
    await fs.writeFile(outputPath, result, 'utf-8');
  }

  /**
   * 批量生成代码
   */
  public async generateFromTemplate(
    templateName: string, 
    outputDir: string, 
    data: Record<string, any>
  ): Promise<void> {
    const templates = await this.getTemplates();
    const template = templates.find(t => t.name === templateName);
    
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    const templateDir = path.join(this.templatesDir, templateName);
    
    for (const file of template.files) {
      const templatePath = path.join(templateDir, file.template);
      const outputPath = path.join(outputDir, this.renderPath(file.output, data));
      
      await this.generate({
        templatePath,
        outputPath,
        data,
      });
    }
  }

  private renderPath(pathTemplate: string, data: Record<string, any>): string {
    const template = Handlebars.compile(pathTemplate);
    return template(data);
  }
}

export default CodeGenerator; 