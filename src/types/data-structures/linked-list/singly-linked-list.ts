import { IterableElementBaseOptions } from '../base';

export type SinglyLinkedListOptions<E, R> = IterableElementBaseOptions<E, R> & {
  maxLen?: number;
};
