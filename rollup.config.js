import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import svgr from '@svgr/rollup'
import jsx from 'rollup-plugin-jsx'
import postcss from 'rollup-plugin-postcss'
// import dts from 'rollup-plugin-dts'

const packageJson = require('./package.json')

const rollup = [
  {
    input: 'src/export.js',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      },
      {
        file: packageJson.umd,
        format: 'umd',
        sourcemap: true,
        name: 'mercuriusExplain'
      }
    ],
    external: ['react', '@graphiql/toolkit'],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx']
      }),
      svgr({ exportType: 'named', jsxRuntime: 'classic' }),
      postcss({ modules: true }),
      commonjs(),
      jsx({ factory: 'React.createElement' })
    ]
  }
  //This is for typescript in the future
  // {
  //   input: 'dist/esm/types/index.d.ts',
  //   output: [{ file: 'dist/index.d.ts', format: 'esm' }],
  //   plugins: [dts()]
  // }
]

export default rollup
