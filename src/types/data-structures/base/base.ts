import { IterableElementBase, IterablePairBase } from "../../../data-structures";

export type PairCallback<K, V, R> = (value: V, key: K, index: number, container: IterablePairBase<K, V>) => R;
export type ElementCallback<V, R> = (element: V, index: number, container: IterableElementBase<V>) => R;
export type ReducePairCallback<K, V, R> = (accumulator: R, value: V, key: K, index: number, container: IterablePairBase<K, V>) => R;
export type ReduceElementCallback<V, R> = (accumulator: R, element: V, index: number, container: IterableElementBase<V>) => R;
