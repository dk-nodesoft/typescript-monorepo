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
    '@dk-nodesoft/eslint-config/nestjs',
    // Apply prettier and disable incompatible rules
    '@dk-nodesoft/eslint-config/prettier'
  ],
  rules: {
    'tsdoc/syntax': 'off'
  },
  overrides: [
    // optional overrides per project file match
  ]
};
