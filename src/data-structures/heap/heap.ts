/**
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import type {CompareFunction} from '../../types';

export class Heap<T> {
  private nodes: T[] = [];
  private readonly comparator: CompareFunction<T>;

  constructor(comparator: CompareFunction<T>) {
    this.comparator = comparator;
  }

  /**
   * Insert an element into the heap and maintain the heap properties.
   * @param value - The element to be inserted.
   */
  add(value: T): Heap<T> {
    this.nodes.push(value);
    this.bubbleUp(this.nodes.length - 1);
    return this;
  }

  /**
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or null if the heap is empty.
   */
  poll(): T | null {
    if (this.nodes.length === 0) {
      return null;
    }
    if (this.nodes.length === 1) {
      return this.nodes.pop() as T;
    }

    const topValue = this.nodes[0];
    this.nodes[0] = this.nodes.pop() as T;
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
  peek(): T | null {
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
  leaf(): T | null {
    return this.nodes[this.size - 1] ?? null;
  }

  /**
   * Check if the heap is empty.
   * @returns True if the heap is empty, otherwise false.
   */
  isEmpty() {
    return this.size === 0;
  }

  clear() {
    this.nodes = [];
  }

  refill(nodes: T[]) {
    this.nodes = nodes;
    this.fix();
  }

  /**
   * Use a comparison function to check whether a binary heap contains a specific element.
   * @param value - the element to check.
   * @returns Returns true if the specified element is contained; otherwise, returns false.
   */
  has(value: T): boolean {
    return this.nodes.includes(value);
  }

  /**
   * Use a comparison function to find the index of an element in the heap.
   * @param value - the element to find.
   * @param index - the index currently being searched.
   * @returns The index of the element, or -1 if not found.
   */
  private findIndex(value: T, index: number): number {
    if (index >= this.size) {
      return -1;
    }

    const compareResult = this.comparator(value, this.nodes[index]);

    if (compareResult === 0) {
      return index; // Element found
    } else if (compareResult < 0) {
      // The element should be in the left subtree
      return this.findIndex(value, 2 * index + 1);
    } else {
      // The element should be in the right subtree
      return this.findIndex(value, 2 * index + 2);
    }
  }

  /**
   * Depth-first search (DFS) method, different traversal orders can be selected。
   * @param order - Traversal order parameter: 'in' (in-order), 'pre' (pre-order) or 'post' (post-order).
   * @returns An array containing elements traversed in the specified order.
   */
  dfs(order: 'in' | 'pre' | 'post'): T[] {
    const result: T[] = [];

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
  toArray(): T[] {
    return [...this.nodes];
  }

  getNodes(): T[] {
    return this.nodes;
  }

  /**
   * Clone the heap, creating a new heap with the same elements.
   * @returns A new Heap instance containing the same elements.
   */
  clone(): Heap<T> {
    const clonedHeap = new Heap<T>(this.comparator);
    clonedHeap.nodes = [...this.nodes];
    return clonedHeap;
  }

  /**
   * Sort the elements in the heap and return them as an array.
   * @returns An array containing the elements sorted in ascending order.
   */
  sort(): T[] {
    const visitedNode: T[] = [];
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
  static heapify<T>(nodes: T[], comparator: CompareFunction<T>): Heap<T> {
    const binaryHeap = new Heap<T>(comparator);
    binaryHeap.nodes = [...nodes];
    binaryHeap.fix(); // Fix heap properties
    return binaryHeap;
  }
}
