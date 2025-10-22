import { IterableElementBase, IterableEntryBase } from '../../../data-structures';
import { LinearBase } from '../../../data-structures/base/linear-base';

export type EntryCallback<K, V, R> = (key: K, value: V, index: number, original: IterableEntryBase<K, V>) => R;
export type ElementCallback<E, R, RT> = (element: E, index: number, original: IterableElementBase<E, R>) => RT;
export type ReduceEntryCallback<K, V, R> = (
  accumulator: R,
  value: V,
  key: K,
  index: number,
  original: IterableEntryBase<K, V>
) => R;

export type ReduceElementCallback<E, R, U = E> = (
  accumulator: U,
  value: E,
  index: number,
  self: IterableElementBase<E, R>
) => U;

export type ReduceLinearCallback<E, RT = E> = (
  accumulator: RT,
  element: E,
  index: number,
  original: LinearBase<E>
) => RT;

export type IterableElementBaseOptions<E, R> = {
  toElementFn?: (rawElement: R) => E;
};

export type LinearBaseOptions<E, R> = IterableElementBaseOptions<E, R> & {
  maxLen?: number;
};
