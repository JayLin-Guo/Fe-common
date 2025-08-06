import { createApp } from 'vue';
import App from './App.vue';

// 引入Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 引入我们的组件库（全量引入方式测试）
import JrUI from '@jr/ui-components';
// 在开发模式下，样式会自动从源代码导入，不需要手动导入dist中的样式

const app = createApp(App);

// 注册Element Plus
app.use(ElementPlus);

// 注册我们的组件库
app.use(JrUI);

app.mount('#app'); 