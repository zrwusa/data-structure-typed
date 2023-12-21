import { IterableElementBase, IterableEntryBase } from '../../../data-structures';

export type EntryCallback<K, V, R> = (value: V, key: K, index: number, container: IterableEntryBase<K, V>) => R;
export type ElementCallback<V, R> = (element: V, index: number, container: IterableElementBase<V>) => R;
export type ReduceEntryCallback<K, V, R> = (
  accumulator: R,
  value: V,
  key: K,
  index: number,
  container: IterableEntryBase<K, V>
) => R;
export type ReduceElementCallback<V, R> = (
  accumulator: R,
  element: V,
  index: number,
  container: IterableElementBase<V>
) => R;
