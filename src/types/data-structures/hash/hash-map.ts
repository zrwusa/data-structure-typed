export const enum IterateDirection {
  DEFAULT = 0,
  REVERSE = 1
}

export type HashMapOptions<T> = {
  sizeFunction?: number | (() => number);
  fixedLength?: number;
  forEach: (callback: (el: T) => void) => void;
};

export type HashMapLinkedNode<K, V> = {
  key: K;
  value: V;
  next: HashMapLinkedNode<K, V>;
  prev: HashMapLinkedNode<K, V>;
};
