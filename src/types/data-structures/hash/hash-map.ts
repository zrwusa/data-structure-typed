export type HashMapLinkedNode<K, V> = {
  key: K;
  value: V;
  next: HashMapLinkedNode<K, V>;
  prev: HashMapLinkedNode<K, V>;
};
