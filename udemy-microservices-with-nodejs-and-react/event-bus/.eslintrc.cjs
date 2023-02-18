/**
 * Specific eslint rules for this workspace, learn how to compose
 * @link https://github.com/belgattitude/nextjs-monorepo-example/tree/main/packages/eslint-config-bases
 */

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
