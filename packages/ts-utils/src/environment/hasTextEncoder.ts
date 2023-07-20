/**
 * If TextEncoder is not present ( web-browser ), som packages will fail
 *
 * this util function can be used when making dynamic imports, to determine which package to use
 */
export const hasTextEncoder = (): boolean => {
  return typeof TextEncoder !== 'undefined';
};
