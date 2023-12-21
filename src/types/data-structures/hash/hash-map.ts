export type HashMapLinkedNode<K, V> = {
  key: K;
  value: V;
  next: HashMapLinkedNode<K, V>;
  prev: HashMapLinkedNode<K, V>;
};

export type HashMapOptions<K> = {
  hashFn: (key: K) => string;
  objHashFn: (key: K) => object;
};

export type HashMapStoreItem<K, V> = { key: K; value: V };
