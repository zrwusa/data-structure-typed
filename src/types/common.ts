export type Comparator<K> = (a: K, b: K) => number;

export enum BSTVariant {
  MIN = 'MIN',
  MAX = 'MAX',
}

export type DFSOrderPattern = 'pre' | 'in' | 'post';

export type BTNCallback<N, D = any> = (node: N) => D;

export enum CP {
  lt = 'lt',
  eq = 'eq',
  gt = 'gt'
}

export interface IterableWithSize<T> extends Iterable<T> {
  size: number | ((...args: any[]) => number);
}

export interface IterableWithLength<T> extends Iterable<T> {
  length: number | ((...args: any[]) => number);
}

export type IterableWithSizeOrLength<T> = IterableWithSize<T> | IterableWithLength<T>

export type BinaryTreePrintOptions = { isShowUndefined?: boolean, isShowNull?: boolean, isShowRedBlackNIL?: boolean }

export type BTNEntry<K, V> = [K | null | undefined, V | undefined];

export type BTNKeyOrNode<K, N> = K | null | undefined | N;

export type BTNExemplar<K, V, N> = BTNEntry<K, V> | BTNKeyOrNode<K, N>

export type BTNodePureExemplar<K, V, N> = [K, V | undefined] | BTNodePureKeyOrNode<K, N>

export type BTNodePureKeyOrNode<K, N> = K | N;

export type BSTNodeKeyOrNode<K, N> = K | undefined | N;