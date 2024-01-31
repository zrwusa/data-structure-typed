import { Comparator } from '../../common';

export type HeapOptions<E, R> = {
  comparator?: Comparator<E>;
  toElementFn?: (rawElement: R) => E;
};
