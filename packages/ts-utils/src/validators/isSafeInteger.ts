export const isSafeInteger = (v: unknown): v is number => {
  return typeof v === 'number' && Number.isSafeInteger(v);
};
