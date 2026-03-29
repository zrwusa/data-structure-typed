import type { Comparator } from '../../common';

export interface TreeMultiSetOptions<K, R = K> {
  comparator?: Comparator<K>;

  /**
   * Pass-through to the underlying RedBlackTree/BST `isMapMode` option.
   *
   * - `true`  (recommended): MapMode store uses key→node index for fast lookups.
   * - `false`: Node Mode.
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
