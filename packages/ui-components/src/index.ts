// Vue3 UI组件库入口文件
import type { App, Plugin } from 'vue';

// 导出组件 - 支持按需引入
export { BizMessage, BizMessageVue } from './BizMessage/index';
// export { default as BizMainForm } from './BizMainForm/index.vue';
// export { default as BizArea } from './BizArea/index.vue';
export { default as BaseTable } from './baseTable/index.vue';
export { default as BizSvgIcon } from './BizSvgIcon/index.vue';
export { default as DesignForm } from './DesignFrom/index.vue';

// 导出类型定义
export * from './types';
export * from './BizMessage/type';
export * from './baseTable/type';

// 导入所有组件
import BizMessagePlugin from './BizMessage/index';
// import BizMainForm from './BizMainForm/index.vue';
// import BizArea from './BizArea/index.vue';
import BaseTable from './baseTable/index.vue';
import BizSvgIcon from './BizSvgIcon/index.vue';
import DesignForm from './DesignFrom/index.vue';

// 组件列表
const components = [
  // BizMainForm,
  // BizArea,
  BaseTable,
  BizSvgIcon,
  DesignForm,
];

// 插件列表
const plugins = [BizMessagePlugin];

// 安装函数 - 支持全量引入
const install: Plugin = {
  install(app: App) {
    // 安装普通组件
    components.forEach(component => {
      if (component.name || component.__name) {
        const name = (component.name || component.__name) as string;
        app.component(name, component);
      }
    });

    // 安装插件
    plugins.forEach(plugin => {
      if (plugin.install) {
        plugin.install(app);
      }
    });
  },
};

// 默认导出 - 全量引入
export default { install };

// 版本信息
export const version = '1.0.0';
