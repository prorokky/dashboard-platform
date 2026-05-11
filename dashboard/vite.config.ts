import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import federation from '@originjs/vite-plugin-federation'

const fixFederationCssMarkers = (): Plugin => ({
  name: 'fix-federation-css-markers',
  enforce: 'post',
  renderChunk(code, chunk) {
    if (chunk.fileName.endsWith('remoteEntry.js')) {
      return code.replace(/(["'`])__v__css__[^"'`]+\1/g, '[]')
    }
  },
})

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    federation({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/app/App.vue',
      },
      shared: ['vue', 'vue-router'],
    }),
    fixFederationCssMarkers(),
  ],
  build: {
    target: 'esnext',
    minify: true,
    cssCodeSplit: false,
  },
  server: {
    host: '127.0.0.1',
    cors: {
      origin: [/^http:\/\/(localhost|127\.0\.0\.1):8000$/],
    },
    port: 8001,
  },
  preview: {
    host: '127.0.0.1',
    port: 8001,
    strictPort: true,
    cors: {
      origin: [/^http:\/\/(localhost|127\.0\.0\.1):8000$/],
    },
  },
})
