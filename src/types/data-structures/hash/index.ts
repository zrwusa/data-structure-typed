export * from './coordinate-map';
export * from './coordinate-set';
export * from './hash-map';
export * from './hash-table';
export * from './tree-map';
export * from './tree-set';

export type HashFunction<K> = (key: K) => number;
