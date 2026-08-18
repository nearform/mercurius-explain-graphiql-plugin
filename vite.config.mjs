import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
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
    // vite 7 changed the default `build.target` from 'modules' to
    // 'baseline-widely-available' (chrome107/edge107/firefox104/safari16), which
    // stops downlevelling ES2020 syntax such as optional chaining. This is a
    // published library, so the previous floor is pinned explicitly rather than
    // raised as a side effect of the vite major. The list below is the value
    // vite 4's 'modules' expanded to.
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: 'src/export.js',
      fileName: format => `${format}/index.js`,
      name: 'mercuriusExplain',
      formats: ['umd', 'cjs', 'es']
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  }
})
