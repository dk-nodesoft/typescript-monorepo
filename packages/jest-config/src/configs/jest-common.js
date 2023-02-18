module.exports = {
  resetMocks: false,
  moduleDirectories: ['node_modules'],
  verbose: true,

  reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/../.reports', outputName: 'report.xml' }]]
};
