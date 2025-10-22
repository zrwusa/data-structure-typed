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
