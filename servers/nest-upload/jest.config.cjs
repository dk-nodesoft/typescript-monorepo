const { getTsConfigBasePaths, sanitizePackageName } = require('@dk-nodesoft/jest-config');
const { resolve } = require('path');
const base = require('@dk-nodesoft/jest-config/jest-nest');

const { name } = require('./package.json');

const tsConfigFile = resolve('./tsconfig.json');
const tsConfigBasePaths = getTsConfigBasePaths(tsConfigFile);

process.env.JEST_JUNIT_OUTPUT_NAME = `report-${sanitizePackageName(name)}.xml`;
process.env.JEST_SUITE_NAME = name;

module.exports = {
  ...base,
  rootDir: './src',

  displayName: `${name}:unit`,
  moduleNameMapper: {
    ...tsConfigBasePaths
  },

  testTimeout: 240000,
  // globalSetup: '<rootDir>/specs/globalSetup.ts',
  // globalTeardown: '<rootDir>/specs/globalTeardown.ts',
  maxConcurrency: 1,
  maxWorkers: 1
};
