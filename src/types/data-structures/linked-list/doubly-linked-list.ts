import { IterableElementBaseOptions } from '../base';

export type DoublyLinkedListOptions<E, R> = IterableElementBaseOptions<E, R> & {
  maxLen?: number;
};
