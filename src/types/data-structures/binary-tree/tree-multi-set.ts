import type { Comparator } from '../../common';

export interface TreeMultiSetOptions<K> {
  comparator?: Comparator<K>;

  /**
   * Pass-through to the underlying RedBlackTree/BST `isMapMode` option.
   *
   * - `true`  (recommended): MapMode store uses key→node index for fast lookups.
   * - `false`: Node Mode.
   */
  isMapMode?: boolean;
}
