import type { Component } from 'vue';

// 表单元素基础接口
export interface FormElement {
  id: string;
  type: string;
  name?: string;
  label?: string;
  control?: Record<string, any>;
  formItem?: Record<string, any>;
  config?: Record<string, any>;
  children?: FormElement[];
  columns?: GridColumn[];
  options?: OptionItem[];
}

// 网格列配置
export interface GridColumn {
  list: FormElement[];
  attr?: Record<string, any>;
  className?: string;
}

// 选项配置
export interface OptionItem {
  label: string;
  value: any;
  disabled?: boolean;
}

// 表单渲染器属性
export interface FormRendererProps {
  formItems: FormElement[];
  depth?: number;
  maxDepth?: number;
  designMode?: boolean;
  activeElement?: FormElement | null;
}

// 渲染上下文
export interface RenderContext {
  depth: number;
  maxDepth: number;
  designMode: boolean;
}

// 组件注册表类型
export type ComponentRegistry = Record<string, Component>;

// 控件基础属性
export interface WidgetProps {
  element: FormElement;
  index: number;
  depth: number;
  designMode: boolean;
  active: boolean;
}
