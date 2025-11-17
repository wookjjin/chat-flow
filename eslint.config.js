import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import eslintReact from '@eslint-react/eslint-plugin';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true},
      },
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      '@tanstack/query': tanstackQuery,
      prettier: prettierPlugin
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintReact.configs['recommended-typescript'],
    ],
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'no-console': 'error',
      'no-unused-vars': 'error',
      'react/jsx-no-target-blank': 'off',
    },
  },
  prettierConfig
])
