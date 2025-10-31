import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore common build and vendor directories globally
  globalIgnores(['dist', 'node_modules', 'vendor']),

  // Frontend/browser JS
  {
    files: ['Frontend/**/*.{js,jsx}', '**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // Node/Tooling JS (overrides for matching files)
  {
    files: [
      'eslint.config.js',
      '**/*.config.js',
      'Backend/**/*.js',
    ],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Allow console in Node context
      'no-console': 'off',
    },
  },
])
