export type HashMapLinkedNode<K, V> = {
  key: K;
  value: V;
  next: HashMapLinkedNode<K, V>;
  prev: HashMapLinkedNode<K, V>;
};

export type LinkedHashMapOptions<K, V, R> = {
  hashFn?: (key: K) => string;
  objHashFn?: (key: K) => object;
  toEntryFn?: (rawElement: R) => [K, V];
};

export type HashMapOptions<K, V, R> = {
  hashFn?: (key: K) => string;
  toEntryFn?: (rawElement: R) => [K, V];
};

export type HashMapStoreItem<K, V> = { key: K; value: V };
