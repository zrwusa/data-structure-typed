import type { Comparator } from '../../common';

export interface TreeSetOptions<K, R = K> {
  comparator?: Comparator<K>;

  /**
   * Pass-through to the underlying RedBlackTree/BST `isMapMode` option.
   *
   * - `true`  (default in core): store values in an internal key→value store.
   * - `false`: store values on tree nodes (Node Mode).
   */
  isMapMode?: boolean;

  /**
   * Enable order-statistic operations (select, rank, rangeByRank).
   */
  enableOrderStatistic?: boolean;

  /**
   * Transform raw elements into keys.
   * When provided, the constructor accepts `Iterable<R>` instead of `Iterable<K>`.
   */
  toElementFn?: (rawElement: R) => K;
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
