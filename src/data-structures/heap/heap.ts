/**
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import type {HeapComparator, HeapDFSOrderPattern} from '../../types';

export class Heap<E> {
  protected nodes: E[] = [];
  private readonly comparator: HeapComparator<E>;

  constructor(comparator: HeapComparator<E>) {
    this.comparator = comparator;
  }

  /**
   * Insert an element into the heap and maintain the heap properties.
   * @param value - The element to be inserted.
   */
  add(value: E): Heap<E> {
    this.nodes.push(value);
    this.bubbleUp(this.nodes.length - 1);
    return this;
  }

  /**
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or null if the heap is empty.
   */
  poll(): E | null {
    if (this.nodes.length === 0) {
      return null;
    }
    if (this.nodes.length === 1) {
      return this.nodes.pop() as E;
    }

    const topValue = this.nodes[0];
    this.nodes[0] = this.nodes.pop() as E;
    this.sinkDown(0);
    return topValue;
  }

  /**
   * Float operation to maintain heap properties after adding an element.
   * @param index - The index of the newly added element.
   */
  protected bubbleUp(index: number): void {
    const element = this.nodes[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.nodes[parentIndex];
      if (this.comparator(element, parent) < 0) {
        this.nodes[index] = parent;
        this.nodes[parentIndex] = element;
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Sinking operation to maintain heap properties after removing the top element.
   * @param index - The index from which to start sinking.
   */
  protected sinkDown(index: number): void {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    const length = this.nodes.length;
    let targetIndex = index;

    if (leftChildIndex < length && this.comparator(this.nodes[leftChildIndex], this.nodes[targetIndex]) < 0) {
      targetIndex = leftChildIndex;
    }
    if (rightChildIndex < length && this.comparator(this.nodes[rightChildIndex], this.nodes[targetIndex]) < 0) {
      targetIndex = rightChildIndex;
    }

    if (targetIndex !== index) {
      const temp = this.nodes[index];
      this.nodes[index] = this.nodes[targetIndex];
      this.nodes[targetIndex] = temp;
      this.sinkDown(targetIndex);
    }
  }

  /**
   * Fix the entire heap to maintain heap properties.
   */
  protected fix() {
    for (let i = Math.floor(this.size / 2); i >= 0; i--) this.sinkDown(i);
  }

  /**
   * Peek at the top element of the heap without removing it.
   * @returns The top element or null if the heap is empty.
   */
  peek(): E | null {
    if (this.nodes.length === 0) {
      return null;
    }
    return this.nodes[0];
  }

  /**
   * Get the size (number of elements) of the heap.
   */
  get size(): number {
    return this.nodes.length;
  }

  /**
   * Get the last element in the heap, which is not necessarily a leaf node.
   * @returns The last element or null if the heap is empty.
   */
  get leaf(): E | null {
    return this.nodes[this.size - 1] ?? null;
  }

  /**
   * Check if the heap is empty.
   * @returns True if the heap is empty, otherwise false.
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Reset the nodes of the heap. Make the nodes empty.
   */
  clear() {
    this.nodes = [];
  }

  /**
   * Clear and add nodes of the heap
   * @param nodes
   */
  refill(nodes: E[]) {
    this.nodes = nodes;
    this.fix();
  }

  /**
   * Use a comparison function to check whether a binary heap contains a specific element.
   * @param value - the element to check.
   * @returns Returns true if the specified element is contained; otherwise, returns false.
   */
  has(value: E): boolean {
    return this.nodes.includes(value);
  }

  /**
   * Depth-first search (DFS) method, different traversal orders can be selected。
   * @param order - Traversal order parameter: 'in' (in-order), 'pre' (pre-order) or 'post' (post-order).
   * @returns An array containing elements traversed in the specified order.
   */
  dfs(order: HeapDFSOrderPattern): E[] {
    const result: E[] = [];

    // Auxiliary recursive function, traverses the binary heap according to the traversal order
    const dfsHelper = (index: number) => {
      if (index < this.size) {
        if (order === 'in') {
          dfsHelper(2 * index + 1);
          result.push(this.nodes[index]);
          dfsHelper(2 * index + 2);
        } else if (order === 'pre') {
          result.push(this.nodes[index]);
          dfsHelper(2 * index + 1);
          dfsHelper(2 * index + 2);
        } else if (order === 'post') {
          dfsHelper(2 * index + 1);
          dfsHelper(2 * index + 2);
          result.push(this.nodes[index]);
        }
      }
    };

    dfsHelper(0); // Traverse starting from the root node

    return result;
  }

  /**
   * Convert the heap to an array.
   * @returns An array containing the elements of the heap.
   */
  toArray(): E[] {
    return [...this.nodes];
  }

  getNodes(): E[] {
    return this.nodes;
  }

  /**
   * Clone the heap, creating a new heap with the same elements.
   * @returns A new Heap instance containing the same elements.
   */
  clone(): Heap<E> {
    const clonedHeap = new Heap<E>(this.comparator);
    clonedHeap.nodes = [...this.nodes];
    return clonedHeap;
  }

  /**
   * Sort the elements in the heap and return them as an array.
   * @returns An array containing the elements sorted in ascending order.
   */
  sort(): E[] {
    const visitedNode: E[] = [];
    const cloned = this.clone();
    while (cloned.size !== 0) {
      const top = cloned.poll();
      if (top) visitedNode.push(top);
    }
    return visitedNode;
  }

  /**
   * Static method that creates a binary heap from an array of nodes and a comparison function.
   * @param nodes
   * @param comparator - Comparison function.
   * @returns A new Heap instance.
   */
  static heapify<E>(nodes: E[], comparator: HeapComparator<E>): Heap<E> {
    const binaryHeap = new Heap<E>(comparator);
    binaryHeap.nodes = [...nodes];
    binaryHeap.fix(); // Fix heap properties
    return binaryHeap;
  }
}
