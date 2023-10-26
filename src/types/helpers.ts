import {BinaryTreeNodeKey} from "./data-structures";

export type Comparator<T> = (a: T, b: T) => number;

export type DFSOrderPattern = 'pre' | 'in' | 'post';

export type MapCallback<N, D = any> = (node: N) => D;

export type DefaultMapCallback<N, D = BinaryTreeNodeKey> = (node: N) => D;

export type MapCallbackReturn<N> = ReturnType<MapCallback<N>>;

export enum CP {
  lt = 'lt',
  eq = 'eq',
  gt = 'gt'
}
