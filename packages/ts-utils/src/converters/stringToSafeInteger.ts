import { isParsableSafeInteger } from '../validators';

export function stringToSafeInteger(value: string | unknown): number | null {
  if (!isParsableSafeInteger(value)) {
    return null;
  }
  return typeof value === 'string' ? Number.parseInt(value, 10) : value;
}
