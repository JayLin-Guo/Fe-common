import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
const ComponentsView = () => import('../views/ComponentsView.vue');

const routes = [
  {
    path: '/',
    redirect: '/components',
  },
  {
    path: '/components',
    name: 'Components',
    component: ComponentsView,
    meta: {
      title: '组件库',
    },
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
