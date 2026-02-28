/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { ElementCallback, SinglyLinkedListOptions } from '../../types';
import { LinearLinkedBase, LinkedListNode } from '../base/linear-base';

/**
 * Node of a singly linked list; stores value and the next link.
 * @remarks Time O(1), Space O(1)
 * @template E
 */
export class SinglyLinkedListNode<E = any> extends LinkedListNode<E> {
  /**
   * Create a list node.
   * @remarks Time O(1), Space O(1)
   * @param value - Element value to store.
   * @returns New node instance.
   */

  constructor(value: E) {
    super(value);
    this._value = value;
    this._next = undefined;
  }

  protected override _next: SinglyLinkedListNode<E> | undefined;

  /**
   * Get the next node.
   * @remarks Time O(1), Space O(1)
   * @returns Next node or undefined.
   */

  override get next(): SinglyLinkedListNode<E> | undefined {
    return this._next;
  }

  /**
   * Set the next node.
   * @remarks Time O(1), Space O(1)
   * @param value - Next node or undefined.
   * @returns void
   */

  override set next(value: SinglyLinkedListNode<E> | undefined) {
    this._next = value;
  }
}

/**
 * Singly linked list with O(1) push/pop-like ends operations and linear scans.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @template R
 * 1. Node Structure: Each node contains three parts: a data field, a pointer (or reference) to the previous node, and a pointer to the next node. This structure allows traversal of the linked list in both directions.
 * 2. Bidirectional Traversal: Unlike doubly linked lists, singly linked lists can be easily traversed forwards but not backwards.
 * 3. No Centralized Index: Unlike arrays, elements in a linked list are not stored contiguously, so there is no centralized index. Accessing elements in a linked list typically requires traversing from the head or tail node.
 * 4. High Efficiency in Insertion and Deletion: Adding or removing elements in a linked list does not require moving other elements, making these operations more efficient than in arrays.
 * Caution: Although our linked list classes provide methods such as at, setAt, addAt, and indexOf that are based on array indices, their time complexity, like that of the native Array.lastIndexOf, is 𝑂(𝑛). If you need to use these methods frequently, you might want to consider other data structures, such as Deque or Queue (designed for random access). Similarly, since the native Array.shift method has a time complexity of 𝑂(𝑛), using an array to simulate a queue can be inefficient. In such cases, you should use Queue or Deque, as these data structures leverage deferred array rearrangement, effectively reducing the average time complexity to 𝑂(1).
 * @example
 * // basic SinglyLinkedList creation and push operation
 *  // Create a simple SinglyLinkedList with initial values
 *     const list = new SinglyLinkedList([1, 2, 3, 4, 5]);
 *
 *     // Verify the list maintains insertion order
 *     console.log([...list]); // [1, 2, 3, 4, 5];
 *
 *     // Check length
 *     console.log(list.length); // 5;
 *
 *     // Push a new element to the end
 *     list.push(6);
 *     console.log(list.length); // 6;
 *     console.log([...list]); // [1, 2, 3, 4, 5, 6];
 * @example
 * // SinglyLinkedList pop and shift operations
 *  const list = new SinglyLinkedList<number>([10, 20, 30, 40, 50]);
 *
 *     // Pop removes from the end
 *     const last = list.pop();
 *     console.log(last); // 50;
 *
 *     // Shift removes from the beginning
 *     const first = list.shift();
 *     console.log(first); // 10;
 *
 *     // Verify remaining elements
 *     console.log([...list]); // [20, 30, 40];
 *     console.log(list.length); // 3;
 * @example
 * // SinglyLinkedList unshift and forward traversal
 *  const list = new SinglyLinkedList<number>([20, 30, 40]);
 *
 *     // Unshift adds to the beginning
 *     list.unshift(10);
 *     console.log([...list]); // [10, 20, 30, 40];
 *
 *     // Access elements (forward traversal only for singly linked)
 *     const second = list.at(1);
 *     console.log(second); // 20;
 *
 *     // SinglyLinkedList allows forward iteration only
 *     const elements: number[] = [];
 *     for (const item of list) {
 *       elements.push(item);
 *     }
 *     console.log(elements); // [10, 20, 30, 40];
 *
 *     console.log(list.length); // 4;
 * @example
 * // SinglyLinkedList filter and map operations
 *  const list = new SinglyLinkedList<number>([1, 2, 3, 4, 5]);
 *
 *     // Filter even numbers
 *     const filtered = list.filter(value => value % 2 === 0);
 *     console.log(filtered.length); // 2;
 *
 *     // Map to double values
 *     const doubled = list.map(value => value * 2);
 *     console.log(doubled.length); // 5;
 *
 *     // Use reduce to sum
 *     const sum = list.reduce((acc, value) => acc + value, 0);
 *     console.log(sum); // 15;
 * @example
 * // SinglyLinkedList for sequentially processed data stream
 *  interface LogEntry {
 *       timestamp: number;
 *       level: 'INFO' | 'WARN' | 'ERROR';
 *       message: string;
 *     }
 *
 *     // SinglyLinkedList is ideal for sequential processing where you only need forward iteration
 *     // O(1) insertion/deletion at head, O(n) for tail operations
 *     const logStream = new SinglyLinkedList<LogEntry>();
 *
 *     // Simulate incoming log entries
 *     const entries: LogEntry[] = [
 *       { timestamp: 1000, level: 'INFO', message: 'Server started' },
 *       { timestamp: 1100, level: 'WARN', message: 'Memory usage high' },
 *       { timestamp: 1200, level: 'ERROR', message: 'Connection failed' },
 *       { timestamp: 1300, level: 'INFO', message: 'Connection restored' }
 *     ];
 *
 *     // Add entries to the stream
 *     for (const entry of entries) {
 *       logStream.push(entry);
 *     }
 *
 *     console.log(logStream.length); // 4;
 *
 *     // Process logs sequentially (only forward iteration needed)
 *     const processedLogs: string[] = [];
 *     for (const log of logStream) {
 *       processedLogs.push(`[${log.level}] ${log.message}`);
 *     }
 *
 *     console.log(processedLogs); // [
 *  //      '[INFO] Server started',
 *  //      '[WARN] Memory usage high',
 *  //      '[ERROR] Connection failed',
 *  //      '[INFO] Connection restored'
 *  //    ];
 *
 *     // Get first log (O(1) - direct head access)
 *     const firstLog = logStream.at(0);
 *     console.log(firstLog?.message); // 'Server started';
 *
 *     // Remove oldest log (O(1) operation at head)
 *     const removed = logStream.shift();
 *     console.log(removed?.message); // 'Server started';
 *     console.log(logStream.length); // 3;
 *
 *     // Remaining logs still maintain order for sequential processing
 *     console.log(logStream.length); // 3;
 * @example
 * // implementation of a basic text editor
 *  class TextEditor {
 *       private content: SinglyLinkedList<string>;
 *       private cursorIndex: number;
 *       private undoStack: Stack<{ operation: string; data?: any }>;
 *
 *       constructor() {
 *         this.content = new SinglyLinkedList<string>();
 *         this.cursorIndex = 0; // Cursor starts at the beginning
 *         this.undoStack = new Stack<{ operation: string; data?: any }>(); // Stack to keep track of operations for undo
 *       }
 *
 *       insert(char: string) {
 *         this.content.addAt(this.cursorIndex, char);
 *         this.cursorIndex++;
 *         this.undoStack.push({ operation: 'insert', data: { index: this.cursorIndex - 1 } });
 *       }
 *
 *       delete() {
 *         if (this.cursorIndex === 0) return; // Nothing to delete
 *         const deleted = this.content.deleteAt(this.cursorIndex - 1);
 *         this.cursorIndex--;
 *         this.undoStack.push({ operation: 'delete', data: { index: this.cursorIndex, char: deleted } });
 *       }
 *
 *       moveCursor(index: number) {
 *         this.cursorIndex = Math.max(0, Math.min(index, this.content.length));
 *       }
 *
 *       undo() {
 *         if (this.undoStack.size === 0) return; // No operations to undo
 *         const lastAction = this.undoStack.pop();
 *
 *         if (lastAction!.operation === 'insert') {
 *           this.content.deleteAt(lastAction!.data.index);
 *           this.cursorIndex = lastAction!.data.index;
 *         } else if (lastAction!.operation === 'delete') {
 *           this.content.addAt(lastAction!.data.index, lastAction!.data.char);
 *           this.cursorIndex = lastAction!.data.index + 1;
 *         }
 *       }
 *
 *       getText(): string {
 *         return [...this.content].join('');
 *       }
 *     }
 *
 *     // Example Usage
 *     const editor = new TextEditor();
 *     editor.insert('H');
 *     editor.insert('e');
 *     editor.insert('l');
 *     editor.insert('l');
 *     editor.insert('o');
 *     console.log(editor.getText()); // 'Hello'; // Output: "Hello"
 *
 *     editor.delete();
 *     console.log(editor.getText()); // 'Hell'; // Output: "Hell"
 *
 *     editor.undo();
 *     console.log(editor.getText()); // 'Hello'; // Output: "Hello"
 *
 *     editor.moveCursor(1);
 *     editor.insert('a');
 *     console.log(editor.getText()); // 'Haello';
 */
export class SinglyLinkedList<E = any, R = any> extends LinearLinkedBase<E, R, SinglyLinkedListNode<E>> {
  protected _equals: (a: E, b: E) => boolean = Object.is as unknown as (a: E, b: E) => boolean;

  /**
   * Create a SinglyLinkedList and optionally bulk-insert elements.
   * @remarks Time O(N), Space O(N)
   * @param [elements] - Iterable of elements or nodes (or raw records if toElementFn is provided).
   * @param [options] - Options such as maxLen and toElementFn.
   * @returns New SinglyLinkedList instance.
   */

  constructor(
    elements: Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>> = [],
    options?: SinglyLinkedListOptions<E, R>
  ) {
    super(options);
    this.pushMany(elements);
  }

  protected _head: SinglyLinkedListNode<E> | undefined;

  /**
   * Get the head node.
   * @remarks Time O(1), Space O(1)
   * @returns Head node or undefined.
   */

  get head(): SinglyLinkedListNode<E> | undefined {
    return this._head;
  }

  protected _tail: SinglyLinkedListNode<E> | undefined;

  /**
   * Get the tail node.
   * @remarks Time O(1), Space O(1)
   * @returns Tail node or undefined.
   */

  get tail(): SinglyLinkedListNode<E> | undefined {
    return this._tail;
  }

  protected _length = 0;

  /**
   * Get the number of elements.
   * @remarks Time O(1), Space O(1)
   * @returns Current length.
   */

  get length(): number {
    return this._length;
  }

  /**
   * Get the first element value.
   * @remarks Time O(1), Space O(1)
   * @returns First element or undefined.
   */

  get first(): E | undefined {
    return this.head?.value;
  }

  /**
   * Get the last element value.
   * @remarks Time O(1), Space O(1)
   * @returns Last element or undefined.
   */

  get last(): E | undefined {
    return this.tail?.value;
  }

  /**
   * Create a new list from an iterable of elements.
   * @remarks Time O(N), Space O(N)
   * @template E
   * @template R
   * @template S
   * @param this - The constructor (subclass) to instantiate.
   * @param data - Iterable of elements to insert.
   * @param [options] - Options forwarded to the constructor.
   * @returns A new list populated with the iterable's elements.
   */

  static from<E, R = any, S extends SinglyLinkedList<E, R> = SinglyLinkedList<E, R>>(
    this: new (
      elements?: Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>>,
      options?: SinglyLinkedListOptions<E, R>
    ) => S,
    data: Iterable<E>,
    options?: SinglyLinkedListOptions<E, R>
  ): S {
    const list = new this([], options);
    for (const x of data) list.push(x);
    return list;
  }

  /**
   * Append an element/node to the tail.
   * @remarks Time O(1), Space O(1)
   * @param elementOrNode - Element or node to append.
   * @returns True when appended.
   */

  push(elementOrNode: E | SinglyLinkedListNode<E>): boolean {
    const newNode = this._ensureNode(elementOrNode);
    if (!this.head) {
      this._head = this._tail = newNode;
    } else {
      this.tail!.next = newNode;
      this._tail = newNode;
    }
    this._length++;
    if (this._maxLen > 0 && this.length > this._maxLen) this.shift();
    return true;
  }

  /**
   * Remove and return the tail element.
   * @remarks Time O(N), Space O(1)
   * @returns Removed element or undefined.
   */

  pop(): E | undefined {
    if (!this.head) return undefined;
    if (this.head === this.tail) {
      const value = this.head.value;
      this._head = undefined;
      this._tail = undefined;
      this._length--;
      return value;
    }
    let current = this.head;
    while (current.next !== this.tail) current = current.next!;
    const value = this.tail!.value;
    current.next = undefined;
    this._tail = current;
    this._length--;
    return value;
  }

  /**
   * Remove and return the head element.
   * @remarks Time O(1), Space O(1)
   * @returns Removed element or undefined.
   */

  shift(): E | undefined {
    if (!this.head) return undefined;
    const removed = this.head;
    this._head = this.head.next;
    if (!this._head) this._tail = undefined;
    this._length--;
    return removed.value;
  }

  /**
   * Prepend an element/node to the head.
   * @remarks Time O(1), Space O(1)
   * @param elementOrNode - Element or node to prepend.
   * @returns True when prepended.
   */

  unshift(elementOrNode: E | SinglyLinkedListNode<E>): boolean {
    const newNode = this._ensureNode(elementOrNode);
    if (!this.head) {
      this._head = this._tail = newNode;
    } else {
      newNode.next = this.head;
      this._head = newNode;
    }
    this._length++;
    return true;
  }

  /**
   * Append a sequence of elements/nodes.
   * @remarks Time O(N), Space O(1)
   * @param elements - Iterable of elements or nodes (or raw records if toElementFn is provided).
   * @returns Array of per-element success flags.
   */

  pushMany(elements: Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) ans.push(this.push(this.toElementFn(el as R)));
      else ans.push(this.push(el as E | SinglyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Prepend a sequence of elements/nodes.
   * @remarks Time O(N), Space O(1)
   * @param elements - Iterable of elements or nodes (or raw records if toElementFn is provided).
   * @returns Array of per-element success flags.
   */

  unshiftMany(elements: Iterable<E> | Iterable<R> | Iterable<SinglyLinkedListNode<E>>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) ans.push(this.unshift(this.toElementFn(el as R)));
      else ans.push(this.unshift(el as E | SinglyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Find the first value matching a predicate (by node).
   * @remarks Time O(N), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or node predicate to match.
   * @returns Matched value or undefined.
   */

  search(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ): E | undefined {
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.head;
    while (current) {
      if (predicate(current)) return current.value;
      current = current.next;
    }
    return undefined;
  }

  /**
   * Get the element at a given index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns Element or undefined.
   */

  at(index: number): E | undefined {
    if (index < 0 || index >= this._length) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) current = current!.next;
    return current!.value;
  }

  /**
   * Type guard: check whether the input is a SinglyLinkedListNode.
   * @remarks Time O(1), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or predicate.
   * @returns True if the value is a SinglyLinkedListNode.
   */

  isNode(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ): elementNodeOrPredicate is SinglyLinkedListNode<E> {
    return elementNodeOrPredicate instanceof SinglyLinkedListNode;
  }

  /**
   * Get the node reference at a given index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns Node or undefined.
   */

  getNodeAt(index: number): SinglyLinkedListNode<E> | undefined {
    if (index < 0 || index >= this._length) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) current = current!.next;
    return current;
  }

  /**
   * Delete the element at an index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns Removed element or undefined.
   */

  deleteAt(index: number): E | undefined {
    if (index < 0 || index >= this._length) return undefined;
    if (index === 0) return this.shift();
    const targetNode = this.getNodeAt(index)!;
    const prevNode = this._getPrevNode(targetNode)!;
    const value = targetNode.value;
    prevNode.next = targetNode.next;
    if (targetNode === this.tail) this._tail = prevNode;
    this._length--;
    return value;
  }

  /**
   * Delete the first match by value/node.
   * @remarks Time O(N), Space O(1)
   * @param [elementOrNode] - Element or node to remove; if omitted/undefined, nothing happens.
   * @returns True if removed.
   */

  delete(elementOrNode: E | SinglyLinkedListNode<E> | undefined): boolean {
    if (elementOrNode === undefined || !this.head) return false;
    const node = this.isNode(elementOrNode) ? elementOrNode : this.getNode(elementOrNode);
    if (!node) return false;
    const prevNode = this._getPrevNode(node);

    if (!prevNode) {
      this._head = node.next;
      if (node === this.tail) this._tail = undefined;
    } else {
      prevNode.next = node.next;
      if (node === this.tail) this._tail = prevNode;
    }
    this._length--;
    return true;
  }

  /**
   * Insert a new element/node at an index, shifting following nodes.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @param newElementOrNode - Element or node to insert.
   * @returns True if inserted.
   */

  addAt(index: number, newElementOrNode: E | SinglyLinkedListNode<E>): boolean {
    if (index < 0 || index > this._length) return false;
    if (index === 0) return this.unshift(newElementOrNode);
    if (index === this._length) return this.push(newElementOrNode);
    const newNode = this._ensureNode(newElementOrNode);
    const prevNode = this.getNodeAt(index - 1)!;
    newNode.next = prevNode.next;
    prevNode.next = newNode;
    this._length++;
    return true;
  }

  /**
   * Set the element value at an index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @param value - New value.
   * @returns True if updated.
   */

  setAt(index: number, value: E): boolean {
    const node = this.getNodeAt(index);
    if (!node) return false;
    node.value = value;
    return true;
  }

  /**
   * Check whether the list is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if length is 0.
   */

  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Remove all nodes and reset length.
   * @remarks Time O(N), Space O(1)
   * @returns void
   */

  clear(): void {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }

  /**
   * Reverse the list in place.
   * @remarks Time O(N), Space O(1)
   * @returns This list.
   */

  reverse(): this {
    if (!this.head || this.head === this.tail) return this;
    let prev: SinglyLinkedListNode<E> | undefined;
    let current: SinglyLinkedListNode<E> | undefined = this.head;
    let next: SinglyLinkedListNode<E> | undefined;
    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    [this._head, this._tail] = [this.tail!, this.head!];
    return this;
  }

  /**
   * Find a node by value, reference, or predicate.
   * @remarks Time O(N), Space O(1)
   * @param [elementNodeOrPredicate] - Element, node, or node predicate to match.
   * @returns Matching node or undefined.
   */

  getNode(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean) | undefined
  ): SinglyLinkedListNode<E> | undefined {
    if (elementNodeOrPredicate === undefined) return;
    if (this.isNode(elementNodeOrPredicate)) return elementNodeOrPredicate;
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.head;
    while (current) {
      if (predicate(current)) return current;
      current = current.next;
    }
    return undefined;
  }

  /**
   * Insert a new element/node before an existing one.
   * @remarks Time O(N), Space O(1)
   * @param existingElementOrNode - Existing element or node.
   * @param newElementOrNode - Element or node to insert.
   * @returns True if inserted.
   */

  addBefore(
    existingElementOrNode: E | SinglyLinkedListNode<E>,
    newElementOrNode: E | SinglyLinkedListNode<E>
  ): boolean {
    const existingNode = this.getNode(existingElementOrNode);
    if (!existingNode) return false;
    const prevNode = this._getPrevNode(existingNode);
    const newNode = this._ensureNode(newElementOrNode);

    if (!prevNode) {
      newNode.next = this._head;
      this._head = newNode;
      if (!this._tail) this._tail = newNode;
      this._length++;
    } else {
      prevNode.next = newNode;
      newNode.next = existingNode;
      this._length++;
    }
    return true;
  }

  /**
   * Insert a new element/node after an existing one.
   * @remarks Time O(N), Space O(1)
   * @param existingElementOrNode - Existing element or node.
   * @param newElementOrNode - Element or node to insert.
   * @returns True if inserted.
   */

  addAfter(existingElementOrNode: E | SinglyLinkedListNode<E>, newElementOrNode: E | SinglyLinkedListNode<E>): boolean {
    const existingNode = this.getNode(existingElementOrNode);
    if (!existingNode) return false;
    const newNode = this._ensureNode(newElementOrNode);
    newNode.next = existingNode.next;
    existingNode.next = newNode;
    if (existingNode === this.tail) this._tail = newNode;
    this._length++;
    return true;
  }

  /**
   * Remove and/or insert elements at a position (array-like behavior).
   * @remarks Time O(N + M), Space O(M)
   * @param start - Start index (clamped to [0, length]).
   * @param [deleteCount] - Number of elements to remove (default 0).
   * @param [items] - Elements to insert after `start`.
   * @returns A new list containing the removed elements (typed as `this`).
   */

  override splice(start: number, deleteCount = 0, ...items: E[]): this {
    start = Math.max(0, Math.min(start, this.length));
    deleteCount = Math.max(0, deleteCount);

    const removedList = this._createInstance();

    const prevNode = start === 0 ? undefined : this.getNodeAt(start - 1);
    let cur = prevNode ? prevNode.next : this.head;

    let removedCount = 0;
    while (removedCount < deleteCount && cur) {
      removedList.push(cur.value);
      cur = cur.next;
      removedCount++;
    }
    const afterNode = cur;

    if (prevNode) {
      prevNode.next = afterNode;
    } else {
      this._head = afterNode;
    }
    if (!afterNode) this._tail = prevNode;

    if (items.length > 0) {
      let firstInserted: SinglyLinkedListNode<E> | undefined;
      let lastInserted: SinglyLinkedListNode<E> | undefined;
      for (const it of items) {
        const node = this._ensureNode(it);
        if (!firstInserted) firstInserted = node;
        if (lastInserted) lastInserted.next = node;
        lastInserted = node;
      }
      if (prevNode) prevNode.next = firstInserted!;
      else this._head = firstInserted!;

      lastInserted!.next = afterNode;
      if (!afterNode) this._tail = lastInserted!;
    }

    this._length += items.length - removedCount;
    if (this._length === 0) {
      this._head = undefined;
      this._tail = undefined;
    }

    return removedList as unknown as this;
  }

  /**
   * Count how many nodes match a value/node/predicate.
   * @remarks Time O(N), Space O(1)
   * @param elementOrNode - Element, node, or node predicate to match.
   * @returns Number of matches in the list.
   */

  countOccurrences(elementOrNode: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)): number {
    const predicate = elementOrPredicate(elementOrNode, this._equals);
    let count = 0;
    let current = this.head;
    while (current) {
      if (predicate(current)) count++;
      current = current.next;
    }
    return count;
  }

  /**
   * Set the equality comparator used to compare values.
   * @remarks Time O(1), Space O(1)
   * @param equals - Equality predicate (a, b) → boolean.
   * @returns This list.
   */

  setEquality(equals: (a: E, b: E) => boolean): this {
    this._equals = equals;
    return this;
  }

  /**
   * Delete the first node whose value matches a predicate.
   * @remarks Time O(N), Space O(1)
   * @param predicate - Predicate (value, index, list) → boolean to decide deletion.
   * @returns True if a node was removed.
   */

  deleteWhere(predicate: (value: E, index: number, list: this) => boolean): boolean {
    let prev: SinglyLinkedListNode<E> | undefined;
    let current = this.head;
    let i = 0;
    while (current) {
      if (predicate(current.value, i++, this)) {
        if (!prev) {
          this._head = current.next;
          if (current === this._tail) this._tail = undefined;
        } else {
          prev.next = current.next;
          if (current === this._tail) this._tail = prev;
        }
        this._length--;
        return true;
      }
      prev = current;
      current = current.next;
    }
    return false;
  }

  /**
   * Deep clone this list (values are copied by reference).
   * @remarks Time O(N), Space O(N)
   * @returns A new list with the same element sequence.
   */

  clone(): this {
    const out = this._createInstance();
    for (const v of this) out.push(v);
    return out;
  }

  /**
   * Filter values into a new list of the same class.
   * @remarks Time O(N), Space O(N)
   * @param callback - Predicate (value, index, list) → boolean to keep value.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new list with kept values.
   */

  filter(callback: ElementCallback<E, R, boolean>, thisArg?: any): this {
    const out = this._createInstance();
    let index = 0;
    for (const value of this) if (callback.call(thisArg, value, index++, this)) out.push(value);
    return out;
  }

  /**
   * Map values into a new list of the same class.
   * @remarks Time O(N), Space O(N)
   * @param callback - Mapping function (value, index, list) → newValue.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new list with mapped values.
   */

  mapSame(callback: ElementCallback<E, R, E>, thisArg?: any): this {
    const out = this._createInstance();
    let index = 0;
    for (const value of this) {
      const mv = thisArg === undefined ? callback(value, index++, this) : callback.call(thisArg, value, index++, this);
      out.push(mv);
    }
    return out;
  }

  /**
   * Map values into a new list (possibly different element type).
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param callback - Mapping function (value, index, list) → newElement.
   * @param [options] - Options for the output list (e.g., maxLen, toElementFn).
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new SinglyLinkedList with mapped values.
   */

  map<EM, RM = any>(
    callback: ElementCallback<E, R, EM>,
    options?: SinglyLinkedListOptions<EM, RM>,
    thisArg?: any
  ): SinglyLinkedList<EM, RM> {
    const out = this._createLike<EM, RM>([], { ...(options ?? {}), maxLen: this._maxLen as number });
    let index = 0;
    for (const value of this) out.push(callback.call(thisArg, value, index++, this));
    return out;
  }

  /**
   * (Protected) Create a node from a value.
   * @remarks Time O(1), Space O(1)
   * @param value - Value to wrap in a node.
   * @returns A new SinglyLinkedListNode instance.
   */

  protected createNode(value: E): SinglyLinkedListNode<E> {
    return new SinglyLinkedListNode<E>(value);
  }

  /**
   * (Protected) Check if input is a node predicate function.
   * @remarks Time O(1), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or node predicate.
   * @returns True if input is a predicate function.
   */

  protected _isPredicate(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ): elementNodeOrPredicate is (node: SinglyLinkedListNode<E>) => boolean {
    return typeof elementNodeOrPredicate === 'function';
  }

  /**
   * (Protected) Normalize input into a node instance.
   * @remarks Time O(1), Space O(1)
   * @param elementOrNode - Element or node.
   * @returns A SinglyLinkedListNode for the provided input.
   */

  protected _ensureNode(elementOrNode: E | SinglyLinkedListNode<E>) {
    if (this.isNode(elementOrNode)) return elementOrNode;
    return this.createNode(elementOrNode);
  }

  /**
   * (Protected) Normalize input into a node predicate.
   * @remarks Time O(1), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or predicate.
   * @returns A predicate taking a node and returning true/false.
   */

  protected _ensurePredicate(
    elementNodeOrPredicate: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean)
  ) {
    if (this.isNode(elementNodeOrPredicate)) return (node: SinglyLinkedListNode<E>) => node === elementNodeOrPredicate;
    if (this._isPredicate(elementNodeOrPredicate)) return elementNodeOrPredicate;
    const value = elementNodeOrPredicate as E;
    return (node: SinglyLinkedListNode<E>) => this._equals(node.value, value);
  }

  /**
   * (Protected) Get the previous node of a given node.
   * @remarks Time O(N), Space O(1)
   * @param node - A node in the list.
   * @returns Previous node or undefined.
   */

  protected _getPrevNode(node: SinglyLinkedListNode<E>): SinglyLinkedListNode<E> | undefined {
    if (!this.head || this.head === node) return undefined;
    let current = this.head;
    while (current.next && current.next !== node) current = current.next;
    return current.next === node ? current : undefined;
  }

  /**
   * (Protected) Iterate values from head to tail.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of values (E).
   */

  protected *_getIterator(): IterableIterator<E> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  /**
   * (Protected) Iterate values from tail to head.
   * @remarks Time O(N), Space O(N)
   * @returns Iterator of values (E).
   */

  protected *_getReverseIterator(): IterableIterator<E> {
    const reversedArr = [...this].reverse();
    for (const item of reversedArr) yield item;
  }

  /**
   * (Protected) Iterate nodes from head to tail.
   * @remarks Time O(N), Space O(1)
   * @returns Iterator of nodes.
   */

  protected *_getNodeIterator(): IterableIterator<SinglyLinkedListNode<E>> {
    let current = this.head;
    while (current) {
      yield current;
      current = current.next;
    }
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind list instance.
   */

  protected _createInstance(options?: SinglyLinkedListOptions<E, R>): this {
    const Ctor: any = this.constructor;
    return new Ctor([], options);
  }

  /**
   * (Protected) Create a like-kind instance and seed it from an iterable.
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param [elements] - Iterable used to seed the new list.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind SinglyLinkedList instance.
   */

  protected _createLike<EM, RM>(
    elements: Iterable<EM> | Iterable<RM> | Iterable<SinglyLinkedListNode<EM>> = [],
    options?: SinglyLinkedListOptions<EM, RM>
  ): SinglyLinkedList<EM, RM> {
    const Ctor: any = this.constructor;
    return new Ctor(elements, options) as SinglyLinkedList<EM, RM>;
  }

  /**
   * (Protected) Spawn an empty like-kind list instance.
   * @remarks Time O(1), Space O(1)
   * @template EM
   * @template RM
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind SinglyLinkedList instance.
   */

  protected _spawnLike<EM, RM>(options?: SinglyLinkedListOptions<EM, RM>): SinglyLinkedList<EM, RM> {
    return this._createLike<EM, RM>([], options);
  }
}

function elementOrPredicate<E>(
  input: E | SinglyLinkedListNode<E> | ((node: SinglyLinkedListNode<E>) => boolean),
  equals: (a: E, b: E) => boolean
) {
  if (input instanceof SinglyLinkedListNode) return (node: SinglyLinkedListNode<E>) => node === input;
  if (typeof input === 'function') return input as (node: SinglyLinkedListNode<E>) => boolean;
  const value = input as E;
  return (node: SinglyLinkedListNode<E>) => equals(node.value, value);
}
