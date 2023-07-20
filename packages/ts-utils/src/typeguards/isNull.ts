export const isNull = <T>(v: T | null): v is null => {
  return v === null;
};
