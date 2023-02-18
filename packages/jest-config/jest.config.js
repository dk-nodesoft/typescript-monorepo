const { getTsConfigBasePaths, sanitizePackageName } = require('@dk-nodesoft/jest-config');
const base = require('@dk-nodesoft/jest-config/jest-ts');
const { resolve } = require('path');

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
  }
};
