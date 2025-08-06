/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@jr/ui-components' {
  import type { Plugin } from 'vue';

  export const BizMessage: any;
  export const BizMainForm: any;
  export const BaseTable: any;
  export const DesignForm: any;

  const JrUI: Plugin;
  export default JrUI;
}
