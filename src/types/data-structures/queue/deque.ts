import { IterableElementBaseOptions } from '../base';

export type DequeOptions<E, R> = { bucketSize?: number } & IterableElementBaseOptions<E, R>;
