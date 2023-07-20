import { isParsableNumeric } from '../validators';

export function stringToFloat(value: string | unknown): number | null {
  if (!isParsableNumeric(typeof value === 'number' ? value.toString(10) : value ?? '')) {
    return null;
  }
  const v = Number.parseFloat(typeof value === 'string' ? value : (value as number).toString(10));
  return Number.isNaN(v) ? null : v;
}
