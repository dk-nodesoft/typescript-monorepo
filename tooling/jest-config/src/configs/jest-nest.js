/* eslint-disable @typescript-eslint/no-var-requires */
const jestCommon = require('./jest-common');

module.exports = {
  ...jestCommon,
  rootDir: 'src',

  testEnvironment: 'node',

  moduleFileExtensions: ['js', 'json', 'ts'],

  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',

  transform: {
    '^.+\\.m?[tj]sx?$': 'ts-jest'
  },

  // false by default, overrides in cli, ie: yarn test:unit --collect-coverage=true
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/**/*.{ts,tsx,js,jsx}', '!**/*.test.{js,ts}', '!**/*.spec.{js,ts}', '!**/__mock__/*'],
  coverageDirectory: '<rootDir>/../.reports/coverage'
};
