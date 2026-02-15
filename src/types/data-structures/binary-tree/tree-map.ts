import type { Comparator } from '../../common';

export interface TreeMapOptions<K> {
  comparator?: Comparator<K>;
  /**
   * Pass-through to the underlying RedBlackTree/BST `isMapMode` option.
   *
   * - `true`  (default in core): store values in an internal key→value store.
   * - `false`: store values on tree nodes (Node Mode).
   */
  isMapMode?: boolean;
}

export type TreeMapRangeOptions = {
  lowInclusive?: boolean;
  highInclusive?: boolean;
};

/**
 * Callback used by TreeMap entry-wise utilities.
 *
 * `SELF` is intentionally generic to avoid type-layer circular imports.
 * Implementations (e.g. `TreeMap<K, V>`) should bind `SELF` at use sites.
 */
export type TreeMapEntryCallback<K, V, R, SELF> = (value: V | undefined, key: K, index: number, map: SELF) => R;

/**
 * Reducer callback used by TreeMap.
 *
 * `SELF` is intentionally generic to avoid type-layer circular imports.
 */
export type TreeMapReduceCallback<K, V, A, SELF> = (
  acc: A,
  value: V | undefined,
  key: K,
  index: number,
  map: SELF
) => A;
