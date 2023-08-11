import {PriorityQueue} from './priority-queue';
import type {PriorityQueueOptions} from '../types';

export class MaxPriorityQueue<T = number> extends PriorityQueue<T> {
    constructor(options?: PriorityQueueOptions<T>) {
        super({
            nodes: options?.nodes, comparator: options?.comparator ? options.comparator : (a: T, b: T) => {
                const aKey = a as unknown as number, bKey = b as unknown as number;
                return bKey - aKey;
            }
        });
    }
}