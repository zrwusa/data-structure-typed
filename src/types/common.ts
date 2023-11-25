import { BTNKey } from "./data-structures";

export type Comparator<T> = (a: T, b: T) => number;

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

export type BTNodeEntry<T> = [BTNKey | null | undefined, T | undefined];

export type BTNodeKeyOrNode<N> = BTNKey | null | undefined | N;

export type BTNodeExemplar<T, N> = BTNodeEntry<T> | BTNodeKeyOrNode<N>

export type BTNodePureExemplar<T, N> = [BTNKey, T | undefined] | BTNodePureKeyOrNode<N>

export type BTNodePureKeyOrNode<N> = BTNKey | N;

export type BSTNodeKeyOrNode<N> = BTNKey | undefined | N;