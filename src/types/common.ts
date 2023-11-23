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

export type IterableEntriesOrKeys<T> = Iterable<[BTNKey, T | undefined] | BTNKey>