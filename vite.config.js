import {defineConfig} from 'vite';
import checker from 'vite-plugin-checker';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'sfxr': resolve(__dirname, 'src/lib/sfxr.js'),
      'riffwave': resolve(__dirname, 'src/lib/riffwave.js'),
    },
  },
  plugins: [
    checker({
      typescript: true,
    }),
  ],
});
