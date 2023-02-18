/**
 * Specific eslint rules for this app/package, extends the base rules
 * @see https://github.com/belgattitude/nextjs-monorepo-example/blob/main/docs/about-linters.md
 */

module.exports = {
  extends: [
    '../bases/typescript',
    '../bases/sonar',
    '../bases/regexp',
    '../bases/jest',
    '../bases/tsdoc',

    // Apply prettier and disable incompatible rules
    '../bases/prettier'
  ],
  rules: {
    // optional overrides per project
  },
  overrides: [
    // optional overrides per project file match
  ]
};
