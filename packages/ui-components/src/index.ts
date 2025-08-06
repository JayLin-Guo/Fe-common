// Vue3 UI组件库入口文件
import type { App, Plugin } from 'vue';

// 导出组件 - 支持按需引入
export { default as BizMessage } from './BizMessage/index.vue';
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
import BizMessage from './BizMessage/index.vue';
// import BizMainForm from './BizMainForm/index.vue';
// import BizArea from './BizArea/index.vue';
import BaseTable from './baseTable/index.vue';
import BizSvgIcon from './BizSvgIcon/index.vue';
import DesignForm from './DesignFrom/index.vue';

// 组件列表
const components = [
  BizMessage,
  // BizMainForm,
  // BizArea,
  BaseTable,
  BizSvgIcon,
  DesignForm,
];

// 安装函数 - 支持全量引入
const install: Plugin = {
  install(app: App) {
    components.forEach(component => {
      if (component.name || component.__name) {
        const name = (component.name || component.__name) as string;
        app.component(name, component);
      }
    });
  },
};

// 默认导出 - 全量引入
export default { install };

// 版本信息
export const version = '1.0.0';
