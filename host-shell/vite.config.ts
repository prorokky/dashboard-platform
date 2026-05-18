import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    federation({
      name: 'host-app',
      exposes: {
        './NavBar': './src/widgets/NavBar.vue',
      },
      remotes: {
        dashboard: 'http://localhost:8001/assets/remoteEntry.js',
      },
      shared: ['vue', 'vue-router'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: true,
    cssCodeSplit: true,
  },
  server: {
    host: '127.0.0.1',
    port: 8000,
  },
  preview: {
    host: '127.0.0.1',
    port: 8000,
    strictPort: true,
  },
})
