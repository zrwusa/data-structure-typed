import type { Comparator } from '../../common';

export interface TreeSetOptions<K> {
  comparator?: Comparator<K>;
}

export type TreeSetRangeOptions = {
  lowInclusive?: boolean;
  highInclusive?: boolean;
};

export type TreeSetElementCallback<K, R> = (value: K, index: number, set: unknown) => R;
export type TreeSetReduceCallback<K, A> = (acc: A, value: K, index: number, set: unknown) => A;
