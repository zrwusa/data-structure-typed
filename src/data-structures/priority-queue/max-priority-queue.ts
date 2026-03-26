/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { PriorityQueueOptions } from '../../types';
import { PriorityQueue } from './priority-queue';
import { ERR } from '../../common';

/**
 * Max-oriented priority queue (max-heap) built on {@link PriorityQueue}.
 * The default comparator orders primitive values in descending order. If you store objects,
 * you must provide a custom comparator via {@link PriorityQueueOptions}.
 * @template E Element type stored in the queue.
 * @template R Extra record/metadata associated with each element.
 * @example
 * // Job scheduling by priority
 *  const jobs = new MaxPriorityQueue<number>();
 *
 *     jobs.add(3); // low priority
 *     jobs.add(7); // high priority
 *     jobs.add(5); // medium priority
 *     jobs.add(10); // critical
 *
 *     // Highest priority job first
 *     console.log(jobs.poll()); // 10;
 *     console.log(jobs.poll()); // 7;
 *     console.log(jobs.poll()); // 5;
 *     console.log(jobs.poll()); // 3;
 * @example
 * // Auction system with highest bid tracking
 *  interface Bid {
 *       bidder: string;
 *       amount: number;
 *     }
 *
 *     const auction = new MaxPriorityQueue<Bid>([], {
 *       comparator: (a, b) => b.amount - a.amount
 *     });
 *
 *     auction.add({ bidder: 'Alice', amount: 100 });
 *     auction.add({ bidder: 'Bob', amount: 250 });
 *     auction.add({ bidder: 'Charlie', amount: 175 });
 *
 *     // Current highest bid
 *     console.log(auction.peek()?.bidder); // 'Bob';
 *     console.log(auction.peek()?.amount); // 250;
 *
 *     // Process winning bid
 *     const winner = auction.poll()!;
 *     console.log(winner.bidder); // 'Bob';
 *     console.log(auction.peek()?.bidder); // 'Charlie';
 * @example
 * // CPU process scheduling
 *  const cpuQueue = new MaxPriorityQueue<[number, string]>([], {
 *       comparator: (a, b) => b[0] - a[0]
 *     });
 *
 *     cpuQueue.add([5, 'System process']);
 *     cpuQueue.add([1, 'Background task']);
 *     cpuQueue.add([8, 'User interaction']);
 *     cpuQueue.add([3, 'Network sync']);
 *
 *     const order = [];
 *     while (cpuQueue.size > 0) {
 *       order.push(cpuQueue.poll()![1]);
 *     }
 *     console.log(order); // [
 *  //      'User interaction',
 *  //      'System process',
 *  //      'Network sync',
 *  //      'Background task'
 *  //    ];
 */
export class MaxPriorityQueue<E = any, R = any> extends PriorityQueue<E, R> {
  /**
   * Creates a max-priority queue.
   * @param elements Optional initial elements to insert.
   * @param options Optional configuration (e.g., `comparator`, `toElementFn`).
   * @throws {TypeError} Thrown when using the default comparator with object elements (provide a custom comparator).
   * @remarks Complexity — Time: O(n log n) when inserting n elements incrementally; Space: O(n).
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, {
      comparator: (a: E, b: E): number => {
        if (typeof a === 'object' || typeof b === 'object') {
          throw new TypeError(ERR.comparatorRequired('MaxPriorityQueue'));
        }
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      },
      ...options
    });
  }
}
