import { build } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

build({
  bundle: true,
  entryPoints: ['./src/index.ts'],
  external: [
    'react',
    'react-dom',
    'uuid',
    'nedb',
  ],
  format: 'cjs',
  outfile: './dist/index.js',
  platform: 'node',
  plugins: [
    sassPlugin({
      type: 'style'
    }),
  ],
})
