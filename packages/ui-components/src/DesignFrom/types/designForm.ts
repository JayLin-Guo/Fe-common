/**
 * @description 表单字段配置
 * @param title 标题
 * @param children 子元素
 * @param type 类型
 * @param icon 图标
 * @param label 标签
 * @param control 控制
 * @param name 名称
 */
export interface SchemaJson {
  title: string;
  children: SchemaJson[];
  type: string;
  icon: string;
  label: string;
  control: any;
  name: string;
  formItem: any;
  config: any;
}
