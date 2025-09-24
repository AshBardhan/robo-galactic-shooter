import js from '@eslint/js';
import globals from 'globals';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  {
    files: ['src/**/*.{js,mjs,cjs}'],
    ignores: ['src/lib/**'],
    plugins: {js},
    extends: ['js/recommended'],
    languageOptions: {globals: globals.browser},
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  }
]);
