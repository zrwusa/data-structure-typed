/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import {PriorityQueue} from './priority-queue';
import type {PriorityQueueOptions} from '../types';

export class MaxPriorityQueue<T = number> extends PriorityQueue<T> {
    /**
     * The constructor initializes a PriorityQueue with optional nodes and a comparator function.
     * @param [options] - An optional object that contains the following properties:
     */
    constructor(options?: PriorityQueueOptions<T>) {
        super({
            nodes: options?.nodes, comparator: options?.comparator ? options.comparator : (a: T, b: T) => {
                const aKey = a as unknown as number, bKey = b as unknown as number;
                return bKey - aKey;
            }
        });
    }
}