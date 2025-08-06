// 控件工厂 - 解决 formGroup 和 groupControl 的循环依赖
import { defineAsyncComponent, Component } from 'vue';
import {
  FormComponentType,
  CONTAINER_COMPONENTS,
  FORM_ITEM_COMPONENTS,
} from '../types/componentTypes';

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
  return CONTAINER_COMPONENTS.includes(type as FormComponentType);
}

// 批量注册控件
export function registerWidgets(widgets: Record<string, WidgetConfig>) {
  Object.entries(widgets).forEach(([type, config]) => {
    registerWidget(type, config);
  });
}

// 创建 Element Plus 组件配置的辅助函数
const createElementPlusWidget = (
  needFormItem: boolean = true
): WidgetConfig => ({
  component: defineAsyncComponent(
    () => import('./widgets/ElementPlusWidget.vue')
  ),
  needFormItem,
  canNested: false,
});

// 默认控件注册 - 使用枚举和辅助函数
const defaultWidgets: Record<string, WidgetConfig> = {
  // 基础控件 - 使用通用的 Element Plus 组件渲染器
  [FormComponentType.INPUT]: createElementPlusWidget(true),
  [FormComponentType.TEXTAREA]: createElementPlusWidget(true),
  [FormComponentType.INPUT_NUMBER]: createElementPlusWidget(true),
  [FormComponentType.SELECT]: createElementPlusWidget(true),
  [FormComponentType.RADIO]: createElementPlusWidget(true),
  [FormComponentType.CHECKBOX]: createElementPlusWidget(true),
  [FormComponentType.SWITCH]: createElementPlusWidget(true),
  [FormComponentType.CASCADER]: createElementPlusWidget(true),
  [FormComponentType.TREE_SELECT]: createElementPlusWidget(true),
  [FormComponentType.DATE_PICKER]: createElementPlusWidget(true),
  [FormComponentType.TIME_PICKER]: createElementPlusWidget(true),
  [FormComponentType.SLIDER]: createElementPlusWidget(true),
  [FormComponentType.RATE]: createElementPlusWidget(true),
  [FormComponentType.COLOR_PICKER]: createElementPlusWidget(true),
  [FormComponentType.BUTTON]: createElementPlusWidget(false),
  [FormComponentType.TEXT]: createElementPlusWidget(false),
  [FormComponentType.TITLE]: createElementPlusWidget(false),

  // 容器控件
  [FormComponentType.GRID]: {
    component: defineAsyncComponent(() => import('./widgets/GridControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  [FormComponentType.DIV]: {
    component: defineAsyncComponent(() => import('./widgets/DivControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  [FormComponentType.CARD]: {
    component: defineAsyncComponent(() => import('./widgets/CardControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  [FormComponentType.TABS]: {
    component: defineAsyncComponent(() => import('./widgets/TabsControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  [FormComponentType.FLEX]: {
    component: defineAsyncComponent(() => import('./widgets/FlexControl.vue')),
    needFormItem: false,
    canNested: true,
  },
  [FormComponentType.DIVIDER]: {
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
