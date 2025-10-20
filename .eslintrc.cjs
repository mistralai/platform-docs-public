const { dirname } = require('path');
const { fileURLToPath } = require('url');
const { FlatCompat } = require('@eslint/eslintrc');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

/** @type {import('eslint').Linter.Config} */
const config = {
  ...eslintConfig,
  ignores: ['**/static/**'],
};

module.exports = config;
