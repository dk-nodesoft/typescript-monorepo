const jestCommon = require('./jest-common');

const jsDomEnvironment = __dirname + '/../js-dom-environment-override';

module.exports = {
  ...jestCommon,
  rootDir: 'src',

  testEnvironment: jsDomEnvironment,
  setupFilesAfterEnv: ['@testing-library/jest-dom'],

  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',

  transform: {
    // '^.+\\.m?[tj]sx?$': 'ts-jest'
    '^.+\\.m?[t]sx?$': 'ts-jest'
    // '.+\\.(t)s$': 'ts-jest'
  },

  // false by default, overrides in cli, ie: yarn test:unit --collect-coverage=true
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/**/*.{ts,tsx,js,jsx}', '!**/*.test.{js,ts}', '!**/*.spec.{js,ts}', '!**/__mock__/*'],
  coverageDirectory: '<rootDir>/../.reports/coverage'
};
