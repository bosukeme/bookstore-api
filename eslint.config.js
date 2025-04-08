// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/build/**', '**/*.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'off',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
];
