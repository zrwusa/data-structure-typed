export type CP = 1 | -1 | 0;

export type IterationType = 'ITERATIVE' | 'RECURSIVE';

export type FamilyPosition = 'ROOT' | 'LEFT' | 'RIGHT' | 'ROOT_LEFT' | 'ROOT_RIGHT' | 'ISOLATED' | 'MAL_NODE';

export type Comparator<K> = (a: K, b: K) => number;

export type DFSOrderPattern = 'PRE' | 'IN' | 'POST';

export type NodeDisplayLayout = [string[], number, number, number];

export interface IterableWithSize<T> extends Iterable<T> {
  size: number | ((...args: any[]) => number);
}

export interface IterableWithLength<T> extends Iterable<T> {
  length: number | ((...args: any[]) => number);
}

export type OptValue<V> = V | undefined;

export type IterableWithSizeOrLength<T> = IterableWithSize<T> | IterableWithLength<T>;

export type CRUD = 'CREATED' | 'READ' | 'UPDATED' | 'DELETED';
