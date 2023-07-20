export class InvalidCuidException extends Error {
  constructor(input: unknown) {
    super(`${InvalidCuidException.name}: cuid:"${input}"`);
  }
}
