// 控件工厂 - 解决 formGroup 和 groupControl 的循环依赖
import { defineAsyncComponent, Component } from 'vue';

// 控件类型映射
export interface WidgetConfig {
  component: Component;
  props?: Record<string, any>;
  needFormItem?: boolean;
  canNested?: boolean;
}

// 控件注册表
const widgetRegistry = new Map<string, WidgetConfig>();

// 注册基础控件
export function registerWidget(type: string, config: WidgetConfig) {
  widgetRegistry.set(type, config);
}

// 获取控件配置
export function getWidgetConfig(type: string): WidgetConfig | null {
  return widgetRegistry.get(type) || null;
}

// 检查控件是否存在
export function hasWidget(type: string): boolean {
  return widgetRegistry.has(type);
}

// 检查是否为容器类型
export function isContainerWidget(type: string): boolean {
  const config = getWidgetConfig(type);
  return config?.canNested || false;
}

// 批量注册控件
export function registerWidgets(widgets: Record<string, WidgetConfig>) {
  Object.entries(widgets).forEach(([type, config]) => {
    registerWidget(type, config);
  });
}

// 默认控件注册 - 注册已实现的组件
const defaultWidgets: Record<string, WidgetConfig> = {
  // 基础控件
  input: {
    component: defineAsyncComponent(() => import('./widgets/InputControl.vue')),
    needFormItem: true,
    canNested: false,
  },

  // 容器控件
  grid: {
    component: defineAsyncComponent(() => import('./widgets/GridControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  div: {
    component: defineAsyncComponent(() => import('./widgets/DivControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  card: {
    component: defineAsyncComponent(() => import('./widgets/CardControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  tabs: {
    component: defineAsyncComponent(() => import('./widgets/TabsControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  flex: {
    component: defineAsyncComponent(() => import('./widgets/FlexControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  divider: {
    component: defineAsyncComponent(
      () => import('./widgets/DividerControl.vue')
    ),
    needFormItem: false,
    canNested: false,
  },

  // TODO: 待实现的控件 - 暂时注释掉避免导入错误
  /*
  textarea: {
    component: defineAsyncComponent(() => import('./widgets/TextareaControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  select: {
    component: defineAsyncComponent(() => import('./widgets/SelectControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  radio: {
    component: defineAsyncComponent(() => import('./widgets/RadioControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  checkbox: {
    component: defineAsyncComponent(() => import('./widgets/CheckboxControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  number: {
    component: defineAsyncComponent(() => import('./widgets/NumberControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  date: {
    component: defineAsyncComponent(() => import('./widgets/DateControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  time: {
    component: defineAsyncComponent(() => import('./widgets/TimeControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  file: {
    component: defineAsyncComponent(() => import('./widgets/FileControl.vue')),
    needFormItem: true,
    canNested: false,
  },
  button: {
    component: defineAsyncComponent(() => import('./widgets/ButtonControl.vue')),
    needFormItem: false,
    canNested: false,
  },
  title: {
    component: defineAsyncComponent(() => import('./widgets/TitleControl.vue')),
    needFormItem: false,
    canNested: false,
  },
  txt: {
    component: defineAsyncComponent(() => import('./widgets/TextControl.vue')),
    needFormItem: false,
    canNested: false,
  },
  */
};

// 自动注册默认控件
registerWidgets(defaultWidgets);

// 导出控件列表（用于调试）
export function getRegisteredWidgets(): string[] {
  return Array.from(widgetRegistry.keys());
}
