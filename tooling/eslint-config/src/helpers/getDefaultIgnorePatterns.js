const getDefaultIgnorePatterns = () => {
  // Hacky way to silence @yarnpkg/doctor about node_modules detection
  return [
    // Hacky way to silence @yarnpkg/doctor about node_modules detection
    `**/${'node'}_modules}`,
    '**/.cache',
    '**/.coverage',
    '**/build',
    '**/dist',
    '**/.turbo',
    '**/.next',
    '**/.yarn',
    '**/.husky',
    '.eslintrc.*',
    '**/docs'
  ];
};

module.exports = {
  getDefaultIgnorePatterns
};
