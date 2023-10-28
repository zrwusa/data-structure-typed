/**
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import type {Comparator, DFSOrderPattern} from '../../types';

export class Heap<E = any> {
  protected nodes: E[] = [];
  protected readonly comparator: Comparator<E>;

  constructor(options: {comparator: Comparator<E>; nodes?: E[]}) {
    this.comparator = options.comparator;
    if (options.nodes && options.nodes.length > 0) {
      this.nodes = options.nodes;
      this.fix();
    }
  }

  /**
   * Get the size (number of elements) of the heap.
   */
  get size(): number {
    return this.nodes.length;
  }

  /**
   * Get the last element in the heap, which is not necessarily a leaf node.
   * @returns The last element or undefined if the heap is empty.
   */
  get leaf(): E | undefined {
    return this.nodes[this.size - 1] ?? undefined;
  }

  /**
   * Static method that creates a binary heap from an array of nodes and a comparison function.
   * @returns A new Heap instance.
   * @param options
   */
  static heapify<E>(options: {nodes: E[]; comparator: Comparator<E>}): Heap<E> {
    return new Heap<E>(options);
  }

  /**
   * Insert an element into the heap and maintain the heap properties.
   * @param element - The element to be inserted.
   */
  add(element: E): Heap<E> {
    return this.push(element);
  }

  /**
   * Insert an element into the heap and maintain the heap properties.
   * @param element - The element to be inserted.
   */
  push(element: E): Heap<E> {
    this.nodes.push(element);
    this.bubbleUp(this.nodes.length - 1);
    return this;
  }

  /**
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  poll(): E | undefined {
    if (this.nodes.length === 0) {
      return undefined;
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
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  pop(): E | undefined {
    return this.poll();
  }

  /**
   * Peek at the top element of the heap without removing it.
   * @returns The top element or undefined if the heap is empty.
   */
  peek(): E | undefined {
    if (this.nodes.length === 0) {
      return undefined;
    }
    return this.nodes[0];
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
   * @param element - the element to check.
   * @returns Returns true if the specified element is contained; otherwise, returns false.
   */
  has(element: E): boolean {
    return this.nodes.includes(element);
  }

  /**
   * Depth-first search (DFS) method, different traversal orders can be selected。
   * @param order - Traverse order parameter: 'in' (in-order), 'pre' (pre-order) or 'post' (post-order).
   * @returns An array containing elements traversed in the specified order.
   */
  dfs(order: DFSOrderPattern): E[] {
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
    const clonedHeap = new Heap<E>({comparator: this.comparator});
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
}

export class FibonacciHeapNode<E> {
  element: E;
  degree: number;
  left?: FibonacciHeapNode<E>;
  right?: FibonacciHeapNode<E>;
  child?: FibonacciHeapNode<E>;
  parent?: FibonacciHeapNode<E>;
  marked: boolean;

  constructor(element: E, degree = 0) {
    this.element = element;
    this.degree = degree;
    this.marked = false;
  }
}

export class FibonacciHeap<E> {
  root?: FibonacciHeapNode<E>;
  size = 0;
  protected min?: FibonacciHeapNode<E>;
  protected readonly comparator: Comparator<E>;

  constructor(comparator?: Comparator<E>) {
    this.clear();
    this.comparator = comparator || this.defaultComparator;

    if (typeof this.comparator !== 'function') {
      throw new Error('FibonacciHeap constructor: given comparator should be a function.');
    }
  }

  /**
   * Get the size (number of elements) of the heap.
   * @returns {number} The size of the heap.  Returns 0 if the heap is empty. Returns -1 if the heap is invalid.
   */
  clear(): void {
    this.root = undefined;
    this.min = undefined;
    this.size = 0;
  }

  /**
   * O(1) time operation.
   * Insert an element into the heap and maintain the heap properties.
   * @param element
   * @returns {FibonacciHeap<E>} FibonacciHeap<E> - The heap itself.
   */
  add(element: E): FibonacciHeap<E> {
    return this.push(element);
  }

  /**
   * O(1) time operation.
   * Insert an element into the heap and maintain the heap properties.
   * @param element
   * @returns {FibonacciHeap<E>} FibonacciHeap<E> - The heap itself.
   */
  push(element: E): FibonacciHeap<E> {
    const node = this.createNode(element);
    node.left = node;
    node.right = node;
    this.mergeWithRoot(node);

    if (!this.min || this.comparator(node.element, this.min.element) <= 0) {
      this.min = node;
    }

    this.size++;
    return this;
  }

  /**
   * O(1) time operation.
   * Peek at the top element of the heap without removing it.
   * @returns The top element or undefined if the heap is empty.
   * @protected
   */
  peek(): E | undefined {
    return this.min ? this.min.element : undefined;
  }

  /**
   * O(1) time operation.
   * Get the size (number of elements) of the heap.
   * @param {FibonacciHeapNode<E>} head - The head of the linked list.
   * @protected
   * @returns FibonacciHeapNode<E>[] - An array containing the nodes of the linked list.
   */
  consumeLinkedList(head?: FibonacciHeapNode<E>): FibonacciHeapNode<E>[] {
    const nodes: FibonacciHeapNode<E>[] = [];
    if (!head) return nodes;

    let node: FibonacciHeapNode<E> | undefined = head;
    let flag = false;

    while (true) {
      if (node === head && flag) break;
      else if (node === head) flag = true;

      if (node) {
        nodes.push(node);
        node = node.right;
      }
    }

    return nodes;
  }

  /**
   * O(log n) time operation.
   * Remove and return the top element (smallest or largest element) from the heap.
   * @param parent
   * @param node
   */
  mergeWithChild(parent: FibonacciHeapNode<E>, node: FibonacciHeapNode<E>): void {
    if (!parent.child) {
      parent.child = node;
    } else {
      node.right = parent.child.right;
      node.left = parent.child;
      parent.child.right!.left = node;
      parent.child.right = node;
    }
  }

  /**
   * O(log n) time operation.
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  poll(): E | undefined {
    return this.pop();
  }

  /**
   * O(log n) time operation.
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  pop(): E | undefined {
    if (this.size === 0) return undefined;

    const z = this.min!;
    if (z.child) {
      const nodes = this.consumeLinkedList(z.child);
      for (const node of nodes) {
        this.mergeWithRoot(node);
        node.parent = undefined;
      }
    }

    this.removeFromRoot(z);

    if (z === z.right) {
      this.min = undefined;
      this.root = undefined;
    } else {
      this.min = z.right;
      this.consolidate();
    }

    this.size--;

    return z.element;
  }

  /**
   * O(log n) time operation.
   * merge two heaps. The heap that is merged will be cleared. The heap that is merged into will remain.
   * @param heapToMerge
   */
  merge(heapToMerge: FibonacciHeap<E>): void {
    if (heapToMerge.size === 0) {
      return; // Nothing to merge
    }

    // Merge the root lists of the two heaps
    if (this.root && heapToMerge.root) {
      const thisRoot = this.root;
      const otherRoot = heapToMerge.root;

      const thisRootRight = thisRoot.right!;
      const otherRootLeft = otherRoot.left!;

      thisRoot.right = otherRoot;
      otherRoot.left = thisRoot;

      thisRootRight.left = otherRootLeft;
      otherRootLeft.right = thisRootRight;
    }

    // Update the minimum node
    if (!this.min || (heapToMerge.min && this.comparator(heapToMerge.min.element, this.min.element) < 0)) {
      this.min = heapToMerge.min;
    }

    // Update the size
    this.size += heapToMerge.size;

    // Clear the heap that was merged
    heapToMerge.clear();
  }

  /**
   * Default comparator function used by the heap.
   * @param {E} a
   * @param {E} b
   * @protected
   */
  protected defaultComparator(a: E, b: E): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  /**
   * Create a new node.
   * @param element
   * @protected
   */
  protected createNode(element: E): FibonacciHeapNode<E> {
    return new FibonacciHeapNode<E>(element);
  }

  /**
   * Merge the given node with the root list.
   * @param node - The node to be merged.
   */
  protected mergeWithRoot(node: FibonacciHeapNode<E>): void {
    if (!this.root) {
      this.root = node;
    } else {
      node.right = this.root.right;
      node.left = this.root;
      this.root.right!.left = node;
      this.root.right = node;
    }
  }

  /**
   * O(log n) time operation.
   * Remove and return the top element (smallest or largest element) from the heap.
   * @param node - The node to be removed.
   * @protected
   */
  protected removeFromRoot(node: FibonacciHeapNode<E>): void {
    if (this.root === node) this.root = node.right;
    if (node.left) node.left.right = node.right;
    if (node.right) node.right.left = node.left;
  }

  /**
   * O(log n) time operation.
   * Remove and return the top element (smallest or largest element) from the heap.
   * @param y
   * @param x
   * @protected
   */
  protected link(y: FibonacciHeapNode<E>, x: FibonacciHeapNode<E>): void {
    this.removeFromRoot(y);
    y.left = y;
    y.right = y;
    this.mergeWithChild(x, y);
    x.degree++;
    y.parent = x;
  }

  /**
   * O(log n) time operation.
   * Remove and return the top element (smallest or largest element) from the heap.
   * @protected
   */
  protected consolidate(): void {
    const A: (FibonacciHeapNode<E> | undefined)[] = new Array(this.size);
    const nodes = this.consumeLinkedList(this.root);
    let x: FibonacciHeapNode<E> | undefined,
      y: FibonacciHeapNode<E> | undefined,
      d: number,
      t: FibonacciHeapNode<E> | undefined;

    for (const node of nodes) {
      x = node;
      d = x.degree;

      while (A[d]) {
        y = A[d] as FibonacciHeapNode<E>;

        if (this.comparator(x.element, y.element) > 0) {
          t = x;
          x = y;
          y = t;
        }

        this.link(y, x);
        A[d] = undefined;
        d++;
      }

      A[d] = x;
    }

    for (let i = 0; i < this.size; i++) {
      if (A[i] && this.comparator(A[i]!.element, this.min!.element) <= 0) {
        this.min = A[i]!;
      }
    }
  }
}
