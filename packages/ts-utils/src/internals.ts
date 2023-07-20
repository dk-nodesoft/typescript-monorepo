const toString = Object.prototype.toString;

export enum TypeTags {
  Undefined = '[object Undefined]',
  Null = '[object Null]',
  Map = '[object Map]',
  Set = '[object Set]',
  String = '[object String]',
  Object = '[object Object]',
  Array = '[object Array]',
  Number = '[object Number]',
  Boolean = '[object Boolean]'
}

export const getTag = (v: unknown): TypeTags => {
  return toString.call(v) as TypeTags;
};
