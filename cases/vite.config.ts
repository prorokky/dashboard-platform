import { defineConfig, type Plugin } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vueJsx from '@vitejs/plugin-vue-jsx'

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
      name: 'cases',
      filename: 'remoteEntry.js',
      exposes: {
        './Cases': './src/app/CasesRemote.vue',
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
    port: 8002,
  },
  preview: {
    host: '127.0.0.1',
    port: 8002,
    strictPort: true,
    cors: {
      origin: [/^http:\/\/(localhost|127\.0\.0\.1):8000$/],
    },
  },
})
