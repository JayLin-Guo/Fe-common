import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';

// 引入Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 引入组件库样式 (因为使用了alias，暂时跳过样式导入，让vite处理)
// import '@jr/ui-components/style' // 等UI组件库构建完成后再启用

const app = createApp(App);

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(router);

app.mount('#app');
