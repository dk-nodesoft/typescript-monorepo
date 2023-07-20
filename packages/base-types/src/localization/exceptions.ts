export class InvalidLocaleStringException extends Error {
  constructor(locale: string) {
    super(`${InvalidLocaleStringException.name}: locale(${locale})`);
  }
}
