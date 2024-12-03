import { IterableElementBaseOptions } from '../base';

export type QueueOptions<E, R> = IterableElementBaseOptions<E, R> & {
  autoCompactRatio?: number;
  maxLen?: number;
};
