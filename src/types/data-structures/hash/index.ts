export * from './hash-map';

export type HashFunction<K> = (key: K) => number;
