/**
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { HeapOptions } from '../../types';
import { Heap } from './heap';
import { ERR, raise } from '../../common';

/**
 * @template E
 * @template R
 * Max-oriented binary heap.
 * Notes and typical use-cases are documented in {@link Heap}.
 *
 * 1. Complete Binary Tree: Heaps are typically complete binary trees, meaning every level is fully filled except possibly for the last level, which has nodes as far left as possible.
 * 2. Heap Properties: The value of each parent node is greater than or equal to the value of its children.
 * 3. Root Node Access: In a heap, the largest element (in a max heap) or the smallest element (in a min heap) is always at the root of the tree.
 * 4. Efficient Insertion and Deletion: Due to its structure, a heap allows for insertion and deletion operations in logarithmic time (O(log n)).
 * 5. Managing Dynamic Data Sets: Heaps effectively manage dynamic data sets, especially when frequent access to the largest or smallest elements is required.
 * 6. Non-linear Search: While a heap allows rapid access to its largest or smallest element, it is less efficient for other operations, such as searching for a specific element, as it is not designed for these tasks.
 * 7. Efficient Sorting Algorithms: For example, heap sort. Heap sort uses the properties of a heap to sort elements.
 * 8. Graph Algorithms: Such as Dijkstra's shortest path algorithm and Prim's minimum-spanning tree algorithm, which use heaps to improve performance.
 * @example
 * // Find the K largest elements
 *  const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
 *     const heap = new MaxHeap(data);
 *
 *     // Extract top 3 elements
 *     const top3 = [];
 *     for (let i = 0; i < 3; i++) {
 *       top3.push(heap.poll());
 *     }
 *     console.log(top3); // [9, 6, 5];
 * @example
 * // Priority-based task processing
 *  interface Task {
 *       name: string;
 *       priority: number;
 *     }
 *
 *     const heap = new MaxHeap<Task>([], {
 *       comparator: (a, b) => b.priority - a.priority
 *     });
 *
 *     heap.add({ name: 'Low priority', priority: 1 });
 *     heap.add({ name: 'Critical fix', priority: 10 });
 *     heap.add({ name: 'Medium task', priority: 5 });
 *
 *     // Highest priority first
 *     console.log(heap.poll()?.name); // 'Critical fix';
 *     console.log(heap.poll()?.name); // 'Medium task';
 *     console.log(heap.poll()?.name); // 'Low priority';
 * @example
 * // Real-time top score tracking
 *  const scores = new MaxHeap<number>();
 *
 *     // Stream of scores coming in
 *     for (const score of [72, 85, 91, 68, 95, 78, 88]) {
 *       scores.add(score);
 *     }
 *
 *     // Current highest score without removing
 *     console.log(scores.peek()); // 95;
 *     console.log(scores.size); // 7;
 *
 *     // Remove top 2 scores
 *     console.log(scores.poll()); // 95;
 *     console.log(scores.poll()); // 91;
 *     console.log(scores.peek()); // 88;
 */
export class MaxHeap<E = any, R = any> extends Heap<E, R> {

  /**
   * Create a max-heap. For objects, supply a custom comparator.
   * @param elements Optional initial elements.
   * @param options Optional configuration.
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: HeapOptions<E, R>) {
    super(elements, {
      comparator: (a: E, b: E): number => {
        if (typeof a === 'object' || typeof b === 'object') {
          raise(TypeError, ERR.comparatorRequired('MaxHeap'));
        }
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      },
      ...options
    });
  }
}
