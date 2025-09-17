import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@jr/ui-components': fileURLToPath(
        new URL('../ui-components/src', import.meta.url)
      ),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
  },
  optimizeDeps: {
    exclude: ['@jr/ui-components'],
  },
});
