import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from '@rollup/plugin-terser';

export default [
  // UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      file: 'dist/ghostkey.js',
      format: 'umd',
      name: 'GhostKey',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/ghostkey.min.js',
      format: 'umd',
      name: 'GhostKey',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  },
  // ES module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/ghostkey.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // CommonJS build for Node.js
  {
    input: 'src/index.js',
    output: {
      file: 'dist/ghostkey.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];
