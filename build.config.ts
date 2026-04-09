import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'core/index': 'src/core/index.ts',
      'gradient/index': 'src/gradient/index.ts',
      'logger/index': 'src/logger/index.ts',
      'theme/index': 'src/theme/index.ts',
      'html/index': 'src/html/index.ts',
      'object/index': 'src/object/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    treeshake: true,
  },
]);
