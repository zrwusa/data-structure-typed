import type { Comparator } from '../../common';

export interface TreeSetOptions<K> {
  comparator?: Comparator<K>;
}

export type TreeSetRangeOptions = {
  lowInclusive?: boolean;
  highInclusive?: boolean;
};

/**
 * Callback used by TreeSet element-wise utilities.
 *
 * `SELF` is intentionally generic to avoid type-layer circular imports.
 * Implementations (e.g. `TreeSet<K>`) should bind `SELF` at use sites.
 */
export type TreeSetElementCallback<K, R, SELF> = (value: K, index: number, set: SELF) => R;

/**
 * Reducer callback used by TreeSet.
 *
 * `SELF` is intentionally generic to avoid type-layer circular imports.
 */
export type TreeSetReduceCallback<K, A, SELF> = (acc: A, value: K, index: number, set: SELF) => A;
