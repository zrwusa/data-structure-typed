export type Comparator<T> = (a: T, b: T) => number;

export type DFSOrderPattern = 'pre' | 'in' | 'post';

export type BTNCallback<N, D = any> = (node: N) => D;

export enum CP {
  lt = 'lt',
  eq = 'eq',
  gt = 'gt'
}

export const enum IterateDirection {
  DEFAULT = 0,
  REVERSE = 1
}

export interface IterableWithSize<T> extends Iterable<T> {
  size: number;
}

export interface IterableWithLength<T> extends Iterable<T> {
  length: number;
}

export type IterableWithSizeOrLength<T> = IterableWithSize<T> | IterableWithLength<T>
