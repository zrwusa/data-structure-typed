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
export class PriorityQueue<E = any> extends Heap<E> {
  constructor(elements: Iterable<E> = [], options?: PriorityQueueOptions<E>) {
    super(elements, options);
  }
}
