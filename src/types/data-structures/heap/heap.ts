import { Comparator } from '../../common';
import { IterableElementBaseOptions } from '../base';

export type HeapOptions<E, R> = IterableElementBaseOptions<E, R> & {
  comparator?: Comparator<E>;
};
