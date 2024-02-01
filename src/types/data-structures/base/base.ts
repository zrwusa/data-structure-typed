import { IterableElementBase, IterableEntryBase } from '../../../data-structures';

export type EntryCallback<K, V, R> = (value: V, key: K, index: number, container: IterableEntryBase<K, V>) => R;
export type ElementCallback<E, R, RT, C> = (element: E, index: number, container: IterableElementBase<E, R, C>) => RT;
export type ReduceEntryCallback<K, V, R> = (
  accumulator: R,
  value: V,
  key: K,
  index: number,
  container: IterableEntryBase<K, V>
) => R;
export type ReduceElementCallback<E, R, RT, C> = (
  accumulator: RT,
  element: E,
  index: number,
  container: IterableElementBase<E, R, C>
) => RT;

// export type IterableEntryBaseOptions<K, V, R> = {
//   toEntryFn?: (rawElement: R) => BTNEntry<K, V>;
// };

export type IterableElementBaseOptions<E, R> = {
  toElementFn?: (rawElement: R) => E;
};
