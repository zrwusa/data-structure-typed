export type HashMapLinkedNode<K, V> = {
  key: K;
  value: V;
  next: HashMapLinkedNode<K, V>;
  prev: HashMapLinkedNode<K, V>;
};

export type HashMapOptions<K, V> = {
  elements: Iterable<[K, V]>;
  hashFn: (key: K) => string;
  objHashFn: (key: K) => object
}
