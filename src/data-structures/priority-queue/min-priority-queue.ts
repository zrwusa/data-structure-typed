/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { PriorityQueueOptions } from '../../types';
import { PriorityQueue } from './priority-queue';

/**
 * Min-oriented priority queue (min-heap) built on {@link PriorityQueue}.
 * The queue removes the smallest element first under the provided comparator.
 * Provide a custom comparator if you store non-primitive objects.
 * @template E Element type stored in the queue.
 * @template R Extra record/metadata associated with each element.
 * @example
 * // Shortest job first scheduling
 *  const jobs = new MinPriorityQueue<number>();
 *
 *     jobs.add(8);  // 8 seconds
 *     jobs.add(2);  // 2 seconds
 *     jobs.add(5);  // 5 seconds
 *     jobs.add(1);  // 1 second
 *
 *     // Shortest job first
 *     console.log(jobs.poll()); // 1;
 *     console.log(jobs.poll()); // 2;
 *     console.log(jobs.poll()); // 5;
 *     console.log(jobs.poll()); // 8;
 * @example
 * // Event-driven simulation with timestamps
 *  interface Event {
 *       time: number;
 *       action: string;
 *     }
 *
 *     const timeline = new MinPriorityQueue<Event>([], {
 *       comparator: (a, b) => a.time - b.time
 *     });
 *
 *     timeline.add({ time: 300, action: 'Timeout' });
 *     timeline.add({ time: 100, action: 'Request received' });
 *     timeline.add({ time: 200, action: 'Processing done' });
 *     timeline.add({ time: 150, action: 'Cache hit' });
 *
 *     const order = [];
 *     while (timeline.size > 0) {
 *       order.push(timeline.poll()!.action);
 *     }
 *     console.log(order); // [
 *  //      'Request received',
 *  //      'Cache hit',
 *  //      'Processing done',
 *  //      'Timeout'
 *  //    ];
 * @example
 * // Huffman coding frequency selection
 *  // Character frequencies for Huffman tree building
 *     const freq = new MinPriorityQueue<[number, string]>([], {
 *       comparator: (a, b) => a[0] - b[0]
 *     });
 *
 *     freq.add([5, 'a']);
 *     freq.add([9, 'b']);
 *     freq.add([12, 'c']);
 *     freq.add([2, 'd']);
 *
 *     // Always pick two lowest frequencies
 *     const first = freq.poll()!;
 *     const second = freq.poll()!;
 *     console.log(first[1]); // 'd';  // freq 2
 *     console.log(second[1]); // 'a'; // freq 5
 *
 *     // Combined node goes back
 *     freq.add([first[0] + second[0], first[1] + second[1]]);
 *     console.log(freq.peek()![0]); // 7;
 */
export class MinPriorityQueue<E = any, R = any> extends PriorityQueue<E, R> {

  /**
   * Creates a min-priority queue.
   * @param elements Optional initial elements to insert.
   * @param options Optional configuration (e.g., `comparator`, `toElementFn`).
   * @remarks Complexity — Time: O(n log n) when inserting n elements incrementally; Space: O(n).
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, options);
  }
}
