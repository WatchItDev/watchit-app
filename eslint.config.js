import js from '@eslint/js'
import globals from 'globals'
import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      "build/*",
      "dist/*",
      "public/*",
      "node_modules/*",
      "vite.config.js",
      "src/renderer/*",
      "src/setupTests.js",
      "src/serviceWorkerRegistration.js",
      "src/service-worker.js",
      "src/reportWebVitals.js",
      "coverage/*",
      "**/__test__/**",
      "**/__mocks__/**",
      'src/graphql/**',
    ]
  },
  {
    extends: [
      js.configs.recommended,
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      ...tseslint.configs.recommended
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    }
  },
)
