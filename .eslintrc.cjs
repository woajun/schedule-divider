/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
    'airbnb-typescript/base',
    '@vue/typescript/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    ecmaVersion: 2020,
  },
  rules: {
    'linebreak-style': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
  },
  ignorePatterns: ['dist/**', 'debug.js'],
};
