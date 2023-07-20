export const isMap = <K, V, U>(term: Map<K, V> | U): term is Map<K, V> => {
  return term instanceof Map;
};
