/**
 * Custom config base for projects using tsdoc.
 * @see https://github.com/microsoft/tsdoc/tree/main/eslint-plugin
 */

module.exports = {
  plugins: ['eslint-plugin-tsdoc'],
  rules: {
    'tsdoc/syntax': 'warn'
  }
};
