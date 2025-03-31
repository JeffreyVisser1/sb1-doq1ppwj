import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['lucide-vue-next']
  }
});