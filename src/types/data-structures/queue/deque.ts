import { LinearBaseOptions } from '../base';

export type DequeOptions<E, R> = {
  bucketSize?: number;
} & LinearBaseOptions<E, R>;
