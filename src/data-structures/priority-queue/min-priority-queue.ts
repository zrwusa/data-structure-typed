/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {PriorityQueue} from './priority-queue';
import type {PriorityQueueOptions, SpecifyOptional} from '../../types';

export class MinPriorityQueue<E = any> extends PriorityQueue<E> {
  constructor(options?: Omit<PriorityQueueOptions<number>, 'comparator'>);
  constructor(options: PriorityQueueOptions<E>);

  /**
   * The constructor initializes a priority queue with an optional comparator function.
   * @param [options] - The `options` parameter is an optional object that can contain various configuration options for
   * the `PriorityQueue` constructor.
   */
  constructor(options?: SpecifyOptional<PriorityQueueOptions<E>, 'comparator'>) {
    super({
      ...options,
      comparator: options?.comparator
        ? options.comparator
        : (a: E, b: E) => {
            const aKey = a as unknown as number,
              bKey = b as unknown as number;
            return aKey - bKey;
          }
    });
  }

  static override heapify<E extends number>(options?: Omit<PriorityQueueOptions<E>, 'comparator'>): MinPriorityQueue<E>;
  static override heapify<E>(options: PriorityQueueOptions<E>): MinPriorityQueue<E>;

  /**
   * The function `heapify` creates a new MinPriorityQueue instance and sets the comparator function based on the options
   * provided, and then fixes the heap structure of the queue.
   * @param options - The `options` parameter is an object that contains configuration options for creating a priority
   * queue. It can have the following properties:
   * @returns a MinPriorityQueue object.
   */
  static override heapify<E>(options: PriorityQueueOptions<E>): MinPriorityQueue<E> {
    const minPQ = new MinPriorityQueue<E>({
      ...options,
      comparator: options?.comparator
        ? options.comparator
        : (a: E, b: E) => {
            const aKey = a as unknown as number,
              bKey = b as unknown as number;
            return aKey - bKey;
          }
    });
    minPQ._fix();
    return minPQ;
  }
}
