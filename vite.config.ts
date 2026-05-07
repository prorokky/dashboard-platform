import { fileURLToPath, URL } from 'node:url'

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
      name: "host-app",
      filename: "remoteEntry.js",
      exposes: {
        "./Navbar": "./src/components/layouts/Navbar.vue",
      },
      remotes: {
        dashboard: "http://localhost:8001/remoteEntry.js",
      },
      shared: ["vue", "vue-router", "pinia"],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: "esnext",
    minify: true,
    cssCodeSplit: true,
  },
  server: {
    port: 8000,
  },
})
