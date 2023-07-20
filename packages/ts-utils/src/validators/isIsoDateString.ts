export type IsoDateString = string;
export const isIsoDateString = (dateStr: unknown): dateStr is IsoDateString => {
  if (typeof dateStr !== 'string' || !/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateStr)) {
    return false;
  }
  try {
    const d = new Date(dateStr);
    return d.toISOString() === dateStr;
  } catch (e: unknown) {
    return false;
  }
};
