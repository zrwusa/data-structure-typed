import { LinearBaseOptions } from '../base';

export type QueueOptions<E, R> = LinearBaseOptions<E, R> & {
  autoCompactRatio?: number;
};
