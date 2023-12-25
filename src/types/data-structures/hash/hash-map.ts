export type HashMapLinkedNode<K, V> = {
  key: K;
  value: V;
  next: HashMapLinkedNode<K, V>;
  prev: HashMapLinkedNode<K, V>;
};

export type LinkedHashMapOptions<K> = {
  hashFn?: (key: K) => string;
  objHashFn?: (key: K) => object;
};

export type HashMapOptions<K, V, T> = {
  hashFn?: (key: K) => string;
  toEntryFn?: (rawElement: T) => [K, V];
};

export type HashMapStoreItem<K, V> = { key: K; value: V };
