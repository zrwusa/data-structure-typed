/**
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import type { Comparator, DFSOrderPattern, ElementCallback, HeapOptions } from '../../types';
import { IterableElementBase } from '../base';

/**
 * 1. Complete Binary Tree: Heaps are typically complete binary trees, meaning every level is fully filled except possibly for the last level, which has nodes as far left as possible.
 * 2. Heap Properties: Each node in a heap follows a specific order property, which varies depending on the type of heap:
 * Max Heap: The value of each parent node is greater than or equal to the value of its children.
 * Min Heap: The value of each parent node is less than or equal to the value of its children.
 * 3. Root Node Access: In a heap, the largest element (in a max heap) or the smallest element (in a min heap) is always at the root of the tree.
 * 4. Efficient Insertion and Deletion: Due to its structure, a heap allows for insertion and deletion operations in logarithmic time (O(log n)).
 * 5. Managing Dynamic Data Sets: Heaps effectively manage dynamic data sets, especially when frequent access to the largest or smallest elements is required.
 * 6. Non-linear Search: While a heap allows rapid access to its largest or smallest element, it is less efficient for other operations, such as searching for a specific element, as it is not designed for these tasks.
 * 7. Efficient Sorting Algorithms: For example, heap sort. Heap sort uses the properties of a heap to sort elements.
 * 8. Graph Algorithms: Such as Dijkstra's shortest path algorithm and Prim's minimum spanning tree algorithm, which use heaps to improve performance.
 */
export class Heap<E = any> extends IterableElementBase<E> {
  /**
   * The constructor initializes a heap data structure with optional elements and options.
   * @param elements - The `elements` parameter is an iterable object that contains the initial
   * elements to be added to the heap. It is an optional parameter and if not provided, the heap will
   * be initialized as empty.
   * @param [options] - The `options` parameter is an optional object that can contain additional
   * configuration options for the heap. In this case, it is used to specify a custom comparator
   * function for comparing elements in the heap. The comparator function is used to determine the
   * order of elements in the heap.
   */
  constructor(elements: Iterable<E> = [], options?: HeapOptions<E>) {
    super();

    if (options) {
      const { comparator } = options;
      if (comparator) this._comparator = comparator;
    }

    if (elements) {
      for (const el of elements) {
        this.add(el);
      }
    }
  }

  protected _comparator = (a: E, b: E) => {
    if (!(typeof a === 'number' && typeof b === 'number')) {
      throw new Error('The a, b params of compare function must be number');
    } else {
      return a - b;
    }
  };

  /**
   * The function returns the value of the _comparator property.
   * @returns The `_comparator` property is being returned.
   */
  get comparator() {
    return this._comparator;
  }

  protected _elements: E[] = [];

  /**
   * The function returns an array of elements.
   * @returns The elements array is being returned.
   */
  get elements(): E[] {
    return this._elements;
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
   * @param elements
   * @param options
   */
  static heapify<E>(elements: Iterable<E>, options: { comparator: Comparator<E> }): Heap<E> {
    return new Heap<E>(elements, options);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   * where n is the number of elements in the heap.
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Insert an element into the heap and maintain the heap properties.
   * @param element - The element to be inserted.
   */
  add(element: E): boolean {
    this._elements.push(element);
    return this._bubbleUp(this.elements.length - 1);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   * where n is the number of elements in the heap.
   */

  /**
   * Time Complexity: O(log n)
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
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
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Reset the elements of the heap. Make the elements empty.
   */
  clear(): void {
    this._elements = [];
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * Clear and add elements of the heap
   * @param elements
   */
  refill(elements: E[]): boolean[] {
    this._elements = elements;
    return this.fix();
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * Use a comparison function to check whether a binary heap contains a specific element.
   * @param element - the element to check.
   * @returns Returns true if the specified element is contained; otherwise, returns false.
   */
  override has(element: E): boolean {
    return this.elements.includes(element);
  }

  /**
   * Time Complexity:  O(n)
   * Space Complexity: O(1)
   * The worst-case  O(n) This is because, in the worst case, the element to be deleted is located at the end of the heap (not the root), and after deletion, we may need to reorganize the elements by performing a sinkDown operation.
   */

  /**
   * Time Complexity:  O(n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes an element from an array-like data structure, maintaining the order
   * and structure of the remaining elements.
   * @param {E} element - The `element` parameter represents the element that you want to delete from
   * the array `this.elements`.
   * @returns The `delete` function is returning a boolean value. It returns `true` if the element was
   * successfully deleted from the array, and `false` if the element was not found in the array.
   */
  delete(element: E): boolean {
    const index = this.elements.indexOf(element);
    if (index < 0) return false;
    if (index === 0) {
      this.poll();
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
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   * where log n is the height of the heap.
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * Depth-first search (DFS) method, different traversal orders can be selected。
   * @param order - Traverse order parameter: 'IN' (in-order), 'PRE' (pre-order) or 'POST' (post-order).
   * @returns An array containing elements traversed in the specified order.
   */
  dfs(order: DFSOrderPattern = 'PRE'): E[] {
    const result: E[] = [];

    // Auxiliary recursive function, traverses the binary heap according to the traversal order
    const _dfs = (index: number) => {
      const left = 2 * index + 1,
        right = left + 1;
      if (index < this.size) {
        if (order === 'IN') {
          _dfs(left);
          result.push(this.elements[index]);
          _dfs(right);
        } else if (order === 'PRE') {
          result.push(this.elements[index]);
          _dfs(left);
          _dfs(right);
        } else if (order === 'POST') {
          _dfs(left);
          _dfs(right);
          result.push(this.elements[index]);
        }
      }
    };

    _dfs(0); // Traverse starting from the root node

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
    const clonedHeap = new Heap<E>([], { comparator: this.comparator });
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
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * Fix the entire heap to maintain heap properties.
   */
  fix(): boolean[] {
    const results: boolean[] = [];
    for (let i = Math.floor(this.size / 2); i >= 0; i--) results.push(this._sinkDown(i, this.elements.length >> 1));
    return results;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new Heap object containing elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: the current element, the index of the current element, and the
   * heap itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `Heap` object that contains the elements that pass
   * the filter condition specified by the `callback` function.
   */
  filter(callback: ElementCallback<E, boolean>, thisArg?: any): Heap<E> {
    const filteredList = new Heap<E>();
    let index = 0;
    for (const current of this) {
      if (callback.call(thisArg, current, index, this)) {
        filteredList.add(current);
      }
      index++;
    }
    return filteredList;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new heap by applying a callback function to each element of the
   * original heap.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * original heap. It takes three arguments: the current element, the index of the current element,
   * and the original heap itself. The callback function should return a value of type T, which will be
   * added to the mapped heap.
   * @param comparator - The `comparator` parameter is a function that is used to compare elements in
   * the heap. It takes two arguments, `a` and `b`, and returns a negative number if `a` is less than
   * `b`, a positive number if `a` is greater than `b`, or
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used when you want to bind a
   * specific object as the context for the callback function. If `thisArg` is not provided,
   * `undefined` is used as
   * @returns a new instance of the Heap class, which is created using the mapped elements from the
   * original Heap.
   */
  map<T>(callback: ElementCallback<E, T>, comparator: Comparator<T>, thisArg?: any): Heap<T> {
    const mappedHeap: Heap<T> = new Heap<T>([], { comparator: comparator });
    let index = 0;
    for (const el of this) {
      mappedHeap.add(callback.call(thisArg, el, index, this));
      index++;
    }
    return mappedHeap;
  }

  /**
   * The function `_getIterator` returns an iterable iterator for the elements in the class.
   */
  protected* _getIterator(): IterableIterator<E> {
    for (const element of this.elements) {
      yield element;
    }
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
  protected _bubbleUp(index: number): boolean {
    const element = this.elements[index];
    while (index > 0) {
      const parent = (index - 1) >> 1;
      const parentItem = this.elements[parent];
      if (this.comparator(parentItem, element) <= 0) break;
      this.elements[index] = parentItem;
      index = parent;
    }
    this.elements[index] = element;
    return true;
  }

  /**
   * Time Complexity: O(log n)
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
  protected _sinkDown(index: number, halfLength: number): boolean {
    const element = this.elements[index];
    while (index < halfLength) {
      let left = (index << 1) | 1;
      const right = left + 1;
      let minItem = this.elements[left];
      if (right < this.elements.length && this.comparator(minItem, this.elements[right]) > 0) {
        left = right;
        minItem = this.elements[right];
      }
      if (this.comparator(minItem, element) >= 0) break;
      this.elements[index] = minItem;
      index = left;
    }
    this.elements[index] = element;
    return true;
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

  /**
   * The constructor function initializes an object with an element and a degree, and sets the marked
   * property to false.
   * @param {E} element - The "element" parameter represents the value or data that will be stored in
   * the node of a data structure. It can be any type of data, such as a number, string, object, or
   * even another data structure.
   * @param [degree=0] - The degree parameter represents the degree of the element in a data structure
   * called a Fibonacci heap. The degree of a node is the number of children it has. By default, the
   * degree is set to 0 when a new node is created.
   */
  constructor(element: E, degree = 0) {
    this.element = element;
    this.degree = degree;
    this.marked = false;
  }
}

export class FibonacciHeap<E> {
  /**
   * The constructor function initializes a FibonacciHeap object with an optional comparator function.
   * @param [comparator] - The `comparator` parameter is an optional argument that represents a
   * function used to compare elements in the FibonacciHeap. If a comparator function is provided, it
   * will be used to determine the order of elements in the heap. If no comparator function is
   * provided, a default comparator function will be used.
   */
  constructor(comparator?: Comparator<E>) {
    this.clear();
    this._comparator = comparator || this._defaultComparator;

    if (typeof this.comparator !== 'function') {
      throw new Error('FibonacciHeap constructor: given comparator should be a function.');
    }
  }

  protected _root?: FibonacciHeapNode<E>;

  /**
   * The function returns the root node of a Fibonacci heap.
   * @returns The method is returning either a FibonacciHeapNode object or undefined.
   */
  get root(): FibonacciHeapNode<E> | undefined {
    return this._root;
  }

  protected _size = 0;

  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size(): number {
    return this._size;
  }

  protected _min?: FibonacciHeapNode<E>;

  /**
   * The function returns the minimum node in a Fibonacci heap.
   * @returns The method is returning the minimum node of the Fibonacci heap, which is of type
   * `FibonacciHeapNode<E>`. If there is no minimum node, it will return `undefined`.
   */
  get min(): FibonacciHeapNode<E> | undefined {
    return this._min;
  }

  protected _comparator: Comparator<E>;

  /**
   * The function returns the comparator used for comparing elements.
   * @returns The `_comparator` property of the object.
   */
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
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Remove and return the top element (smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  poll(): E | undefined {
    return this.pop();
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(log n)
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
      this._consolidate();
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
   * Create a new node.
   * @param element
   * @protected
   */
  createNode(element: E): FibonacciHeapNode<E> {
    return new FibonacciHeapNode<E>(element);
  }

  /**
   * Default comparator function used by the heap.
   * @param {E} a
   * @param {E} b
   * @protected
   */
  protected _defaultComparator(a: E, b: E): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
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
  protected _link(y: FibonacciHeapNode<E>, x: FibonacciHeapNode<E>): void {
    this.removeFromRoot(y);
    y.left = y;
    y.right = y;
    this.mergeWithChild(x, y);
    x.degree++;
    y.parent = x;
  }

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * Remove and return the top element (smallest or largest element) from the heap.
   * @protected
   */
  protected _consolidate(): void {
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

        this._link(y, x);
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
