export const sanitizePackageName = (packageName: string): string => {
  return packageName.replace('/', '_').replace(/[^\w.@-]+/g, '-');
};
