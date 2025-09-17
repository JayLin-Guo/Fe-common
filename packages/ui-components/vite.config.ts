import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

export default defineConfig({
  plugins: [
    vue(),
    // 暂时注释掉有兼容性问题的插件，专注于 iconify
    // Icons(),
    // dts({
    //   insertTypesEntry: true,
    //   include: ['src/**/*'],
    //   exclude: ['src/**/*.md', 'src/**/*.stories.*'],
    // }),
  ],
  // 优化依赖预构建，包含 iconify
  optimizeDeps: {
    include: ['@iconify/vue'],
  },
  server: {
    host: '0.0.0.0',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JrUIComponents',
      formats: ['es', 'cjs'],
      fileName: format => {
        switch (format) {
          case 'es':
            return 'index.js';
          case 'cjs':
            return 'index.cjs';
          case 'umd':
            return 'index.umd.js';
          default:
            return `index.${format}.js`;
        }
      },
    },
    rollupOptions: {
      // 不要将 iconify 作为外部依赖，确保正确打包
      external: ['vue', 'element-plus', 'vuedraggable-es'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          'vuedraggable-es': 'Vuedraggable',
        },
        // 保留样式文件
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'style.css';
          }
          return assetInfo.name || 'assets/[name][extname]';
        },
      },
    },
    cssCodeSplit: false, // 将所有CSS打包到一个文件中
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: '@import "./src/styles/variables.scss";',
        charset: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
