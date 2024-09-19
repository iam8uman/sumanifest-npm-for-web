export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
    name: 'rayoneclaw',
  },
  external: ['react', 'react-dom','localforage'],
  plugins: [
    require('@rollup/plugin-typescript')(),
    require('@rollup/plugin-babel')({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
    }),
  ],
};
