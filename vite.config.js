import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vuetify')) {
            return 'vuetify';
          }
          if (id.includes('node_modules/vue') || id.includes('node_modules/pinia')) {
            return 'vue-vendor';
          }
        }
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
