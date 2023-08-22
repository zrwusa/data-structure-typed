/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {PriorityQueue} from './priority-queue';
import type {PriorityQueueOptions} from '../types';
import {SpecifyOptional} from '../../utils';

export class MinPriorityQueue<T = number> extends PriorityQueue<T> {
    constructor(options?: Omit<PriorityQueueOptions<number>, 'comparator'>)
    constructor(options: PriorityQueueOptions<T>)
    /**
     * The constructor initializes a priority queue with an optional comparator function.
     * @param [options] - The `options` parameter is an optional object that can contain various configuration options for
     * the `PriorityQueue` constructor.
     */
    constructor(options?: SpecifyOptional<PriorityQueueOptions<T>, 'comparator'>) {
        super({
            ...options,
            comparator: options?.comparator ? options.comparator : (a: T, b: T) => {
                const aKey = a as unknown as number, bKey = b as unknown as number;
                return aKey - bKey;
            }
        });
    }

    static override heapify<T extends number>(options?: Omit<PriorityQueueOptions<T>, 'comparator'>): MinPriorityQueue<T>
    static override heapify<T>(options: PriorityQueueOptions<T>): MinPriorityQueue<T>
    /**
     * The function `heapify` creates a new MinPriorityQueue instance and sets the comparator function based on the options
     * provided, and then fixes the heap structure of the queue.
     * @param options - The `options` parameter is an object that contains configuration options for creating a priority
     * queue. It can have the following properties:
     * @returns a MinPriorityQueue object.
     */
    static override heapify<T>(options: PriorityQueueOptions<T>): MinPriorityQueue<T> {
        const minPQ = new MinPriorityQueue<T>({
            ...options,
            comparator: options?.comparator ? options.comparator : (a: T, b: T) => {
                const aKey = a as unknown as number, bKey = b as unknown as number;
                return aKey - bKey;
            }
        });
        minPQ._fix();
        return minPQ;
    }
}