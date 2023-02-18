/**
 * Specific eslint rules for this app/package, extends the base rules
 * @see https://github.com/belgattitude/nextjs-monorepo-example/blob/main/docs/about-linters.md
 */

// Workaround for https://github.com/eslint/eslint/issues/3458 (re-export of @rushstack/eslint-patch)
require('@dk-nodesoft/eslint-config/patch/modern-module-resolution');

const { getDefaultIgnorePatterns } = require('@dk-nodesoft/eslint-config/helpers');

module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: [
    '@dk-nodesoft/eslint-config/typescript-and-jest',
    '@dk-nodesoft/eslint-config/turborepo',
    // Apply prettier and disable incompatible rules
    '@dk-nodesoft/eslint-config/prettier'
  ],
  rules: {
    // optional overrides per project
  },
  overrides: [
    // optional overrides per project file match
  ]
};
