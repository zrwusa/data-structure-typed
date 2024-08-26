import { IterableElementBaseOptions } from '../base';

export type DequeOptions<E, R> = {
  bucketSize?: number;
  maxLen?: number;
} & IterableElementBaseOptions<E, R>;
