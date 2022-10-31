import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    svgr()
  ],
  esbuild: {
    // We use function names for generating readable error messages, so we want
    // them to be preserved when building and minifying.
    keepNames: true
  },
  build: {
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: 'src/export.js',
      fileName: format => `${format}/index.js`,
      name: 'mercuriusExplain',
      formats: ['umd', 'cjs', 'es']
    },
    rollupOptions: {
      external: [
        'react'
      ],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  }
})
