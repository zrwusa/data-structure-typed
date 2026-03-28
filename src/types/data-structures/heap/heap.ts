import { Comparator } from '../../common';
import { IterableElementBaseOptions } from '../base';

/** Configuration options for Heap and PriorityQueue. */
export type HeapOptions<E, R> = IterableElementBaseOptions<E, R> & {
  comparator?: Comparator<E>;
};
