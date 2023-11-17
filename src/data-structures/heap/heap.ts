/**
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import type { Comparator, DFSOrderPattern } from '../../types';

export class Heap<E = any> {
  constructor(options: { comparator: Comparator<E>; elements?: E[] }) {
    this._comparator = options.comparator;
    if (options.elements && options.elements.length > 0) {
      this._elements = options.elements;
      this.fix();
    }
  }

  protected _elements: E[] = [];

  get elements(): E[] {
    return this._elements;
  }

  protected _comparator: Comparator<E>;

  get comparator(): Comparator<E> {
    return this._comparator;
  }

  /**
   * Get the size (number of elements) of the heap.
   */
  get size(): number {
    return this.elements.length;
  }

  /**
   * Get the last element in the heap, which is not necessarily a leaf node.
   * @returns The last element or undefined if the heap is empty.
   */
  get leaf(): E | undefined {
    return this.elements[this.size - 1] ?? undefined;
  }

  /**
   * Static method that creates a binary heap from an array of elements and a comparison function.
   * @returns A new Heap instance.
   * @param options
   */
  static heapify<E>(options: { elements: E[]; comparator: Comparator<E> }): Heap<E> {
    return new Heap<E>(options);
  }

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   *
   * Insert an element into the heap and maintain the heap properties.
   * @param element - The element to be inserted.
   */
  add(element: E): Heap<E> {
    return this.push(element);
  }

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   *
   * Insert an element into the heap and maintain the heap properties.
   * @param element - The element to be inserted.
   */
  push(element: E): Heap<E> {
    this._elements.push(element);
    this._bubbleUp(this.elements.length - 1);
    return this;
  }

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   *
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  poll(): E | undefined {
    if (this.elements.length === 0) return;
    const value = this.elements[0];
    const last = this.elements.pop()!;
    if (this.elements.length) {
      this.elements[0] = last;
      this._sinkDown(0, this.elements.length >> 1);
    }
    return value;
  }

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   *
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
    return this.elements[0];
  }

  /**
   * Check if the heap is empty.
   * @returns True if the heap is empty, otherwise false.
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Reset the elements of the heap. Make the elements empty.
   */
  clear() {
    this._elements = [];
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the elements array.
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the elements array.
   * Space Complexity: O(n)
   *
   * Clear and add elements of the heap
   * @param elements
   */
  refill(elements: E[]) {
    this._elements = elements;
    this.fix();
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   *
   * Use a comparison function to check whether a binary heap contains a specific element.
   * @param element - the element to check.
   * @returns Returns true if the specified element is contained; otherwise, returns false.
   */
  has(element: E): boolean {
    return this.elements.includes(element);
  }

  /**
   * Time Complexity:  O(n). The worst-case  O(n), where n is the number of elements in the heap. This is because, in the worst case, the element to be deleted is located at the end of the heap (not the root), and after deletion, we may need to reorganize the elements by performing a sinkDown operation.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity:  O(n). The worst-case  O(n), where n is the number of elements in the heap. This is because, in the worst case, the element to be deleted is located at the end of the heap (not the root), and after deletion, we may need to reorganize the elements by performing a sinkDown operation.
   * Space Complexity: O(1)
   *
   * The `delete` function removes an element from an array-like data structure, maintaining the order
   * and structure of the remaining elements.
   * @param {E} element - The `element` parameter represents the element that you want to delete from
   * the array `this.elements`.
   * @returns The `delete` function is returning a boolean value. It returns `true` if the element was
   * successfully deleted from the array, and `false` if the element was not found in the array.
   */
  delete(element: E) {
    const index = this.elements.indexOf(element);
    if (index < 0) return false;
    if (index === 0) {
      this.pop();
    } else if (index === this.elements.length - 1) {
      this.elements.pop();
    } else {
      this.elements.splice(index, 1, this.elements.pop()!);
      this._bubbleUp(index);
      this._sinkDown(index, this.elements.length >> 1);
    }
    return true;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the heap.
   * Space Complexity: O(h), where h is the height of the heap.
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the heap.
   * Space Complexity: O(h), where h is the height of the heap.
   *
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
          result.push(this.elements[index]);
          dfsHelper(2 * index + 2);
        } else if (order === 'pre') {
          result.push(this.elements[index]);
          dfsHelper(2 * index + 1);
          dfsHelper(2 * index + 2);
        } else if (order === 'post') {
          dfsHelper(2 * index + 1);
          dfsHelper(2 * index + 2);
          result.push(this.elements[index]);
        }
      }
    };

    dfsHelper(0); // Traverse starting from the root node

    return result;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * Convert the heap to an array.
   * @returns An array containing the elements of the heap.
   */
  toArray(): E[] {
    return [...this.elements];
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * Clone the heap, creating a new heap with the same elements.
   * @returns A new Heap instance containing the same elements.
   */
  clone(): Heap<E> {
    const clonedHeap = new Heap<E>({ comparator: this.comparator });
    clonedHeap._elements = [...this.elements];
    return clonedHeap;
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
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
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * Fix the entire heap to maintain heap properties.
   */
  fix() {
    for (let i = Math.floor(this.size / 2); i >= 0; i--) this._sinkDown(i, this.elements.length >> 1);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Float operation to maintain heap properties after adding an element.
   * @param index - The index of the newly added element.
   */
  protected _bubbleUp(index: number) {
    const element = this.elements[index];
    while (index > 0) {
      const parent = (index - 1) >> 1;
      const parentItem = this.elements[parent];
      if (this._comparator(parentItem, element) <= 0) break;
      this.elements[index] = parentItem;
      index = parent;
    }
    this.elements[index] = element;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Sinking operation to maintain heap properties after removing the top element.
   * @param index - The index from which to start sinking.
   * @param halfLength
   */
  protected _sinkDown(index: number, halfLength: number) {
    const element = this.elements[index];
    while (index < halfLength) {
      let left = index << 1 | 1;
      const right = left + 1;
      let minItem = this.elements[left];
      if (
        right < this.elements.length &&
        this._comparator(minItem, this.elements[right]) > 0
      ) {
        left = right;
        minItem = this.elements[right];
      }
      if (this._comparator(minItem, element) >= 0) break;
      this.elements[index] = minItem;
      index = left;
    }
    this.elements[index] = element;
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
  constructor(comparator?: Comparator<E>) {
    this.clear();
    this._comparator = comparator || this.defaultComparator;

    if (typeof this.comparator !== 'function') {
      throw new Error('FibonacciHeap constructor: given comparator should be a function.');
    }
  }

  protected _root?: FibonacciHeapNode<E>;

  get root(): FibonacciHeapNode<E> | undefined {
    return this._root;
  }

  protected _size = 0;

  get size(): number {
    return this._size;
  }

  protected _min?: FibonacciHeapNode<E>;

  get min(): FibonacciHeapNode<E> | undefined {
    return this._min;
  }

  protected _comparator: Comparator<E>;

  get comparator(): Comparator<E> {
    return this._comparator;
  }

  /**
   * Get the size (number of elements) of the heap.
   * @returns {number} The size of the heap.  Returns 0 if the heap is empty. Returns -1 if the heap is invalid.
   */
  clear(): void {
    this._root = undefined;
    this._min = undefined;
    this._size = 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Insert an element into the heap and maintain the heap properties.
   * @param element
   * @returns {FibonacciHeap<E>} FibonacciHeap<E> - The heap itself.
   */
  add(element: E): FibonacciHeap<E> {
    return this.push(element);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
      this._min = node;
    }

    this._size++;
    return this;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Peek at the top element of the heap without removing it.
   * @returns The top element or undefined if the heap is empty.
   * @protected
   */
  peek(): E | undefined {
    return this.min ? this.min.element : undefined;
  }

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * Get the size (number of elements) of the heap.
   * @param {FibonacciHeapNode<E>} head - The head of the linked list.
   * @protected
   * @returns FibonacciHeapNode<E>[] - An array containing the elements of the linked list.
   */
  consumeLinkedList(head?: FibonacciHeapNode<E>): FibonacciHeapNode<E>[] {
    const elements: FibonacciHeapNode<E>[] = [];
    if (!head) return elements;

    let node: FibonacciHeapNode<E> | undefined = head;
    let flag = false;

    while (true) {
      if (node === head && flag) break;
      else if (node === head) flag = true;

      if (node) {
        elements.push(node);
        node = node.right;
      }
    }

    return elements;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   *
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  poll(): E | undefined {
    return this.pop();
  }

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n), where n is the number of elements in the heap.
   * Space Complexity: O(1)
   *
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  pop(): E | undefined {
    if (this.size === 0) return undefined;

    const z = this.min!;
    if (z.child) {
      const elements = this.consumeLinkedList(z.child);
      for (const node of elements) {
        this.mergeWithRoot(node);
        node.parent = undefined;
      }
    }

    this.removeFromRoot(z);

    if (z === z.right) {
      this._min = undefined;
      this._root = undefined;
    } else {
      this._min = z.right;
      this.consolidate();
    }

    this._size--;

    return z.element;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
      this._min = heapToMerge.min;
    }

    // Update the size
    this._size += heapToMerge.size;

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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Merge the given node with the root list.
   * @param node - The node to be merged.
   */
  protected mergeWithRoot(node: FibonacciHeapNode<E>): void {
    if (!this.root) {
      this._root = node;
    } else {
      node.right = this.root.right;
      node.left = this.root;
      this.root.right!.left = node;
      this.root.right = node;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *.
   * Remove and return the top element (smallest or largest element) from the heap.
   * @param node - The node to be removed.
   * @protected
   */
  protected removeFromRoot(node: FibonacciHeapNode<E>): void {
    if (this.root === node) this._root = node.right;
    if (node.left) node.left.right = node.right;
    if (node.right) node.right.left = node.left;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
   * Time Complexity: O(n log n), where n is the number of elements in the heap.
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n log n), where n is the number of elements in the heap.
   * Space Complexity: O(n)
   *
   * Remove and return the top element (smallest or largest element) from the heap.
   * @protected
   */
  protected consolidate(): void {
    const A: (FibonacciHeapNode<E> | undefined)[] = new Array(this.size);
    const elements = this.consumeLinkedList(this.root);
    let x: FibonacciHeapNode<E> | undefined,
      y: FibonacciHeapNode<E> | undefined,
      d: number,
      t: FibonacciHeapNode<E> | undefined;

    for (const node of elements) {
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
        this._min = A[i]!;
      }
    }
  }
}
