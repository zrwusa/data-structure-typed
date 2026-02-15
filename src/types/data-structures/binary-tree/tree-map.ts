import type { Comparator } from '../../common';

export interface TreeMapOptions<K> {
  comparator?: Comparator<K>;
}

export type TreeMapRangeOptions = {
  lowInclusive?: boolean;
  highInclusive?: boolean;
};

export type TreeMapEntryCallback<K, V, R> = (value: V | undefined, key: K, index: number, map: unknown) => R;
export type TreeMapReduceCallback<K, V, A> = (acc: A, value: V | undefined, key: K, index: number, map: unknown) => A;
