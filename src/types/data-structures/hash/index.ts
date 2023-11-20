export * from './hash-map';
export * from './hash-table';

export type HashFunction<K> = (key: K) => number;
