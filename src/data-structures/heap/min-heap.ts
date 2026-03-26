/**
 * @remarks Time O(n log n), Space O(n).
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { HeapOptions } from '../../types';
import { Heap } from './heap';

/**
 * @template E
 * @template R
 * Min-oriented binary heap.
 * Notes and typical use-cases are documented in {@link Heap}.
 *
 * 1. Complete Binary Tree: Heaps are typically complete binary trees, meaning every level is fully filled except possibly for the last level, which has nodes as far left as possible.
 * 2. MinHeap Properties:  The value of each parent node is less than or equal to the value of its children.
 * 3. Root Node Access: In a heap, the largest element (in a max heap) or the smallest element (in a min heap) is always at the root of the tree.
 * 4. Efficient Insertion and Deletion: Due to its structure, a heap allows for insertion and deletion operations in logarithmic time (O(log n)).
 * 5. Managing Dynamic Data Sets: Heaps effectively manage dynamic data sets, especially when frequent access to the largest or smallest elements is required.
 * 6. Non-linear Search: While a heap allows rapid access to its largest or smallest element, it is less efficient for other operations, such as searching for a specific element, as it is not designed for these tasks.
 * 7. Efficient Sorting Algorithms: For example, heap sort. MinHeap sort uses the properties of a heap to sort elements.
 * 8. Graph Algorithms: Such as Dijkstra's shortest path algorithm and Prim's minimum spanning tree algorithm, which use heaps to improve performance.
 * @example
 * // Merge K sorted arrays
 *  const arrays = [
 *       [1, 4, 7],
 *       [2, 5, 8],
 *       [3, 6, 9]
 *     ];
 *
 *     // Use min heap to merge: track (value, arrayIndex, elementIndex)
 *     const heap = new MinHeap<[number, number, number]>([], {
 *       comparator: (a, b) => a[0] - b[0]
 *     });
 *
 *     // Initialize with first element of each array
 *     arrays.forEach((arr, i) => heap.add([arr[0], i, 0]));
 *
 *     const merged: number[] = [];
 *     while (heap.size > 0) {
 *       const [val, arrIdx, elemIdx] = heap.poll()!;
 *       merged.push(val);
 *       if (elemIdx + 1 < arrays[arrIdx].length) {
 *         heap.add([arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1]);
 *       }
 *     }
 *
 *     console.log(merged); // [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * @example
 * // Dijkstra-style shortest distance tracking
 *  // Simulating distance updates: (distance, nodeId)
 *     const heap = new MinHeap<[number, string]>([], {
 *       comparator: (a, b) => a[0] - b[0]
 *     });
 *
 *     heap.add([0, 'start']);
 *     heap.add([10, 'A']);
 *     heap.add([5, 'B']);
 *     heap.add([3, 'C']);
 *
 *     // Process nearest node first
 *     console.log(heap.poll()); // [0, 'start'];
 *     console.log(heap.poll()); // [3, 'C'];
 *     console.log(heap.poll()); // [5, 'B'];
 *     console.log(heap.poll()); // [10, 'A'];
 * @example
 * // Running median with min heap (upper half)
 *  const upperHalf = new MinHeap<number>();
 *
 *     // Add larger numbers to min heap
 *     for (const n of [5, 8, 3, 9, 1]) {
 *       upperHalf.add(n);
 *     }
 *
 *     // Smallest of the upper half is always accessible
 *     console.log(upperHalf.peek()); // 1;
 *     console.log(upperHalf.size); // 5;
 *
 *     // Remove smallest repeatedly
 *     console.log(upperHalf.poll()); // 1;
 *     console.log(upperHalf.poll()); // 3;
 *     console.log(upperHalf.peek()); // 5;
 */
export class MinHeap<E = any, R = any> extends Heap<E, R> {
  /**
   * Create a min-heap.
   * @param elements Optional initial elements.
   * @param options Optional configuration.
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: HeapOptions<E, R>) {
    super(elements, options);
  }
}
