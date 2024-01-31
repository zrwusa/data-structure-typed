/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
import type { PriorityQueueOptions } from '../../types';
import { Heap } from '../heap';

/**
 * 1. Element Priority: In a PriorityQueue, elements are sorted according to their priority. Each dequeue (element removal) operation removes the element with the highest priority. The priority can be determined based on the natural ordering of the elements or through a provided comparator (Comparator).
 * 2. Heap-Based Implementation: PriorityQueue is typically implemented using a binary heap, allowing both insertion and removal operations to be completed in O(log n) time, where n is the number of elements in the queue.
 * 3. Task Scheduling: In systems where tasks need to be processed based on the urgency of tasks rather than the order of arrival.
 * 4. Dijkstra's Algorithm: In shortest path algorithms for graphs, used to select the next shortest edge to visit.
 * 5. Huffman Coding: Used to select the smallest node combination when constructing a Huffman tree.
 * 6. Kth Largest Element in a Data Stream: Used to maintain a min-heap of size K for quickly finding the Kth largest element in stream data
 */
export class PriorityQueue<E = any, R = any> extends Heap<E, R> {
  /**
   * The constructor initializes a priority queue with optional elements and options.
   * @param elements - The `elements` parameter is an iterable object that contains the initial
   * elements to be added to the priority queue. It is an optional parameter, and if not provided, the
   * priority queue will be initialized as empty.
   * @param [options] - The `options` parameter is an optional object that can be used to customize the
   * behavior of the priority queue. It can contain the following properties:
   */
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, options);
  }
}
