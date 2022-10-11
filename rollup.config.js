import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import jsx from 'rollup-plugin-jsx'
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
      }
    ],
    external: ['react', '@graphiql/toolkit'],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx']
      }),
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
