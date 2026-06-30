import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import federation from '@originjs/vite-plugin-federation'
import { fileURLToPath, URL } from 'node:url'

const fixFederationCssMarkers = (): Plugin => ({
  name: 'fix-federation-css-markers',
  enforce: 'post',
  generateBundle(_, bundle) {
    const cssFiles = Object.values(bundle)
      .filter((output) => output.type === 'asset' && output.fileName.endsWith('.css'))
      .map((output) => output.fileName.replace(/^assets\//, ''))

    for (const output of Object.values(bundle)) {
      if (output.type === 'chunk' && output.fileName.endsWith('remoteEntry.js')) {
        const cssList = `[${cssFiles.map((fileName) => JSON.stringify(fileName)).join(',')}]`

        output.code = output.code
          .replace(/\[\s*(["'`])__v__css__[^"'`]+\1\s*\]/g, cssList)
          .replace(/(["'`])__v__css__[^"'`]+\1/g, cssList)
      }
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
    fs: {
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
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
