import { LinearBaseOptions } from '../base';

export type DequeOptions<E, R> = {
  bucketSize?: number;
  /**
   * When the ratio of used buckets to total buckets falls below this threshold
   * after a shift/pop, auto-compact is triggered. Set to 0 to disable.
   * Default: 0.5 (compact when less than half the buckets are in use).
   */
  autoCompactRatio?: number;
} & LinearBaseOptions<E, R>;
