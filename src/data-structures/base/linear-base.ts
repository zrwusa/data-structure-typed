import type { ElementCallback, LinearBaseOptions, ReduceLinearCallback } from '../../types';
import { IterableElementBase } from './iterable-element-base';

/**
 * Singly-linked list node.
 * @template E - Element type.
 * @remarks Time O(1), Space O(1)
 */
export class LinkedListNode<E = any> {
  /**
   * Initialize a node.
   * @param value - Element value.
   * @remarks Time O(1), Space O(1)
   */
  constructor(value: E) {
    this._value = value;
    this._next = undefined;
  }

  protected _value: E;

  /**
   * Element payload getter.
   * @returns Element value.
   * @remarks Time O(1), Space O(1)
   */
  get value(): E {
    return this._value;
  }

  /**
   * Element payload setter.
   * @param value - New value.
   * @remarks Time O(1), Space O(1)
   */
  set value(value: E) {
    this._value = value;
  }

  protected _next: LinkedListNode<E> | undefined;

  /**
   * Next node getter.
   * @returns Next node or `undefined`.
   * @remarks Time O(1), Space O(1)
   */
  get next(): LinkedListNode<E> | undefined {
    return this._next;
  }

  /**
   * Next node setter.
   * @param value - Next node or `undefined`.
   * @remarks Time O(1), Space O(1)
   */
  set next(value: LinkedListNode<E> | undefined) {
    this._next = value;
  }
}

/**
 * Abstract linear container with array-like utilities.
 * @template E - Element type.
 * @template R - Return type for mapped/derived views.
 * @template NODE - Linked node type used by some implementations.
 * @remarks Time O(1), Space O(1)
 */
export abstract class LinearBase<
  E,
  R = any,
  NODE extends LinkedListNode<E> = LinkedListNode<E>
> extends IterableElementBase<E, R> {
  /**
   * Construct a linear container with runtime options.
   * @param options - `{ maxLen?, ... }` bounds/behavior options.
   * @remarks Time O(1), Space O(1)
   */
   constructor(options?: LinearBaseOptions<E, R>) {
    super(options);
    if (options) {
      const { maxLen } = options;
      if (typeof maxLen === 'number' && maxLen > 0 && maxLen % 1 === 0) this._maxLen = maxLen;
    }
  }

  /**
   * Element count.
   * @returns Number of elements.
   * @remarks Time O(1), Space O(1)
   */
  abstract get length(): number;

  protected _maxLen: number = -1;

  /**
   * Upper bound for length (if positive), or `-1` when unbounded.
   * @returns Maximum allowed length.
   * @remarks Time O(1), Space O(1)
   */
  get maxLen() {
    return this._maxLen;
  }

  /**
   * First index of a value from the left.
   * @param searchElement - Value to match.
   * @param fromIndex - Start position (supports negative index).
   * @returns Index or `-1` if not found.
   * @remarks Time O(n), Space O(1)
   */
  indexOf(searchElement: E, fromIndex: number = 0): number {
    if (this.length === 0) return -1;
    if (fromIndex < 0) fromIndex = this.length + fromIndex;
    if (fromIndex < 0) fromIndex = 0;

    for (let i = fromIndex; i < this.length; i++) {
      const element = this.at(i);
      if (element === searchElement) return i;
    }

    return -1;
  }

  /**
   * Last index of a value from the right.
   * @param searchElement - Value to match.
   * @param fromIndex - Start position (supports negative index).
   * @returns Index or `-1` if not found.
   * @remarks Time O(n), Space O(1)
   */
  lastIndexOf(searchElement: E, fromIndex: number = this.length - 1): number {
    if (this.length === 0) return -1;
    if (fromIndex >= this.length) fromIndex = this.length - 1;
    if (fromIndex < 0) fromIndex = this.length + fromIndex;

    for (let i = fromIndex; i >= 0; i--) {
      const element = this.at(i);
      if (element === searchElement) return i;
    }

    return -1;
  }

  /**
   * Find the first index matching a predicate.
   * @param predicate - `(element, index, self) => boolean`.
   * @param thisArg - Optional `this` for callback.
   * @returns Index or `-1`.
   * @remarks Time O(n), Space O(1)
   */
  findIndex(predicate: ElementCallback<E, R, boolean>, thisArg?: any): number {
    for (let i = 0; i < this.length; i++) {
      const item = this.at(i);
      if (item !== undefined && predicate.call(thisArg, item, i, this)) return i;
    }
    return -1;
  }

  /**
   * Concatenate elements and/or containers.
   * @param items - Elements or other containers.
   * @returns New container with combined elements (`this` type).
   * @remarks Time O(sum(length)), Space O(sum(length))
   */
  concat(...items: (E | this)[]): this {
    const newList = this.clone();

    for (const item of items) {
      if (item instanceof LinearBase) {
        newList.pushMany(item);
      } else {
        newList.push(item);
      }
    }

    return newList;
  }

  /**
   * In-place stable order via array sort semantics.
   * @param compareFn - Comparator `(a, b) => number`.
   * @returns This container.
   * @remarks Time O(n log n), Space O(n) (materializes to array temporarily)
   */
  sort(compareFn?: (a: E, b: E) => number): this {
    const arr = this.toArray();
    arr.sort(compareFn);
    this.clear();
    for (const item of arr) this.push(item);
    return this;
  }

  /**
   * Remove and/or insert elements at a position (array-compatible).
   * @param start - Start index (supports negative index).
   * @param deleteCount - How many to remove.
   * @param items - Elements to insert.
   * @returns Removed elements as a new list (`this` type).
   * @remarks Time O(n + m), Space O(min(n, m)) where `m = items.length`
   */
  splice(start: number, deleteCount: number = 0, ...items: E[]): this {
    const removedList = this._createInstance();

    start = start < 0 ? this.length + start : start;
    start = Math.max(0, Math.min(start, this.length));
    deleteCount = Math.max(0, Math.min(deleteCount, this.length - start));

    for (let i = 0; i < deleteCount; i++) {
      const removed = this.deleteAt(start);
      if (removed !== undefined) {
        removedList.push(removed);
      }
    }

    for (let i = 0; i < items.length; i++) {
      this.addAt(start + i, items[i]);
    }

    return removedList;
  }

  /**
   * Join all elements into a string.
   * @param separator - Separator string.
   * @returns Concatenated string.
   * @remarks Time O(n), Space O(n)
   */
  join(separator: string = ','): string {
    return this.toArray().join(separator);
  }

  /**
   * Snapshot elements into a reversed array.
   * @returns New reversed array.
   * @remarks Time O(n), Space O(n)
   */
  toReversedArray(): E[] {
    const array: E[] = [];
    for (let i = this.length - 1; i >= 0; i--) {
      array.push(this.at(i)!);
    }
    return array;
  }

  reduceRight(callbackfn: ReduceLinearCallback<E>): E;

  reduceRight(callbackfn: ReduceLinearCallback<E>, initialValue: E): E;

  /**
   * Right-to-left reduction over elements.
   * @param callbackfn - `(acc, element, index, self) => acc`.
   * @param initialValue - Initial accumulator (optional generic overloads supported).
   * @returns Final accumulator.
   * @remarks Time O(n), Space O(1)
   */
  reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue: U): U;

  reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue?: U): U {
    let accumulator = initialValue ?? (0 as U);
    for (let i = this.length - 1; i >= 0; i--) {
      accumulator = callbackfn(accumulator, this.at(i)!, i, this);
    }
    return accumulator;
  }

  /**
   * Create a shallow copy of a subrange.
   * @param start - Inclusive start (supports negative index).
   * @param end - Exclusive end (supports negative index).
   * @returns New list with the range (`this` type).
   * @remarks Time O(n), Space O(n)
   */
  slice(start: number = 0, end: number = this.length): this {
    start = start < 0 ? this.length + start : start;
    end = end < 0 ? this.length + end : end;

    const newList = this._createInstance();
    for (let i = start; i < end; i++) {
      newList.push(this.at(i)!);
    }
    return newList;
  }

  /**
   * Fill a range with a value.
   * @param value - Value to set.
   * @param start - Inclusive start.
   * @param end - Exclusive end.
   * @returns This list.
   * @remarks Time O(n), Space O(1)
   */
  fill(value: E, start = 0, end = this.length): this {
    start = start < 0 ? this.length + start : start;
    end = end < 0 ? this.length + end : end;

    if (start < 0) start = 0;
    if (end > this.length) end = this.length;
    if (start >= end) return this;

    for (let i = start; i < end; i++) {
      this.setAt(i, value);
    }

    return this;
  }

  /**
   * Set the value at an index.
   * @param index - Position (0-based).
   * @param value - New value.
   * @returns `true` if updated.
   * @remarks Time O(1) typical, Space O(1)
   */
  abstract setAt(index: number, value: E): boolean;

  /**
   * Deep clone while preserving concrete subtype.
   * @returns New list of the same species (`this` type).
   * @remarks Time O(n), Space O(n)
   */
  abstract override clone(): this;

  /**
   * Reverse the order of elements in-place (or equivalent).
   * @returns This list.
   * @remarks Time O(n), Space O(1)
   */
  abstract reverse(): this;

  /**
   * Append one element or node to the tail.
   * @param elementOrNode - Element or node.
   * @returns `true` if appended.
   * @remarks Time O(1) amortized typical, Space O(1)
   */
  abstract push(elementOrNode: E | NODE): boolean;

  /**
   * Append many elements/nodes at once.
   * @param elements - Iterable of elements or nodes.
   * @returns Array of booleans indicating append success.
   * @remarks Time O(n), Space O(1)
   */
  abstract pushMany(elements: Iterable<E> | Iterable<R> | Iterable<NODE>): boolean[];

  /**
   * Remove one element or node if present.
   * @param elementOrNode - Element or node to delete.
   * @returns `true` if removed.
   * @remarks Time O(1)~O(n) depending on implementation, Space O(1)
   */
  abstract delete(elementOrNode: E | NODE | undefined): boolean;

  /**
   * Get element at an index.
   * @param index - Position (0-based).
   * @returns Element or `undefined`.
   * @remarks Time O(1)~O(n) depending on implementation, Space O(1)
   */
  abstract at(index: number): E | undefined;

  /**
   * Remove element at a position.
   * @param pos - Position (0-based).
   * @returns Removed element or `undefined`.
   * @remarks Time O(1)~O(n) depending on implementation, Space O(1)
   */
  abstract deleteAt(pos: number): E | undefined;

  /**
   * Insert an element/node at a position.
   * @param index - Position (0-based).
   * @param newElementOrNode - Element or node to insert.
   * @returns `true` if inserted.
   * @remarks Time O(1)~O(n) depending on implementation, Space O(1)
   */
  abstract addAt(index: number, newElementOrNode: E | NODE): boolean;

  /**
   * Create an empty list of the same species.
   * @param options - Runtime options to carry.
   * @returns Empty list (`this` type).
   * @remarks Time O(1), Space O(1)
   */
  protected abstract _createInstance(options?: LinearBaseOptions<E, R>): this;

  /**
   * Reverse-direction iterator over elements.
   * @returns Iterator of elements from tail to head.
   * @remarks Time O(n), Space O(1)
   */
  protected abstract _getReverseIterator(...args: any[]): IterableIterator<E>;
}

/**
 * Linked-list specialized linear container.
 * @template E - Element type.
 * @template R - Return type for mapped/derived views.
 * @template NODE - Linked node type.
 * @remarks Time O(1), Space O(1)
 */
export abstract class LinearLinkedBase<
  E,
  R = any,
  NODE extends LinkedListNode<E> = LinkedListNode<E>
> extends LinearBase<E, R, NODE> {
   constructor(options?: LinearBaseOptions<E, R>) {
    super(options);
    if (options) {
      const { maxLen } = options;
      if (typeof maxLen === 'number' && maxLen > 0 && maxLen % 1 === 0) this._maxLen = maxLen;
    }
  }

  /**
   * Linked-list optimized `indexOf` (forwards scan).
   * @param searchElement - Value to match.
   * @param fromIndex - Start position.
   * @returns Index or `-1`.
   * @remarks Time O(n), Space O(1)
   */
  override indexOf(searchElement: E, fromIndex: number = 0): number {
    const iterator = this._getIterator();
    let current = iterator.next();

    let index = 0;
    while (index < fromIndex) {
      current = iterator.next();
      index++;
    }

    while (!current.done) {
      if (current.value === searchElement) return index;
      current = iterator.next();
      index++;
    }

    return -1;
  }

  /**
   * Linked-list optimized `lastIndexOf` (reverse scan).
   * @param searchElement - Value to match.
   * @param fromIndex - Start position.
   * @returns Index or `-1`.
   * @remarks Time O(n), Space O(1)
   */
  override lastIndexOf(searchElement: E, fromIndex: number = this.length - 1): number {
    const iterator = this._getReverseIterator();
    let current = iterator.next();

    let index = this.length - 1;
    while (index > fromIndex) {
      current = iterator.next();
      index--;
    }

    while (!current.done) {
      if (current.value === searchElement) return index;
      current = iterator.next();
      index--;
    }

    return -1;
  }

  /**
   * Concatenate lists/elements preserving order.
   * @param items - Elements or `LinearBase` instances.
   * @returns New list with combined elements (`this` type).
   * @remarks Time O(sum(length)), Space O(sum(length))
   */
  override concat(...items: (E | LinearBase<E, R>)[]): this {
    const newList = this.clone();

    for (const item of items) {
      if (item instanceof LinearBase) {
        newList.pushMany(item);
      } else {
        newList.push(item);
      }
    }

    return newList;
  }

  /**
   * Slice via forward iteration (no random access required).
   * @param start - Inclusive start (supports negative index).
   * @param end - Exclusive end (supports negative index).
   * @returns New list (`this` type).
   * @remarks Time O(n), Space O(n)
   */
  override slice(start: number = 0, end: number = this.length): this {
    start = start < 0 ? this.length + start : start;
    end = end < 0 ? this.length + end : end;

    const newList = this._createInstance();
    const iterator = this._getIterator();
    let current = iterator.next();
    let c = 0;
    while (c < start) {
      current = iterator.next();
      c++;
    }
    for (let i = start; i < end; i++) {
      newList.push(current.value);
      current = iterator.next();
    }

    return newList;
  }

  /**
   * Splice by walking node iterators from the start index.
   * @param start - Start index.
   * @param deleteCount - How many elements to remove.
   * @param items - Elements to insert after the splice point.
   * @returns Removed elements as a new list (`this` type).
   * @remarks Time O(n + m), Space O(min(n, m)) where `m = items.length`
   */
  override splice(start: number, deleteCount: number = 0, ...items: E[]): this {
    const removedList = this._createInstance();

    start = start < 0 ? this.length + start : start;
    start = Math.max(0, Math.min(start, this.length));
    deleteCount = Math.max(0, deleteCount);

    let currentIndex = 0;
    let currentNode: NODE | undefined = undefined;
    let previousNode: NODE | undefined = undefined;

    const iterator = this._getNodeIterator();
    for (const node of iterator) {
      if (currentIndex === start) {
        currentNode = node;
        break;
      }
      previousNode = node;
      currentIndex++;
    }

    for (let i = 0; i < deleteCount && currentNode; i++) {
      removedList.push(currentNode.value);
      const nextNode = currentNode.next;
      this.delete(currentNode);
      currentNode = nextNode as NODE;
    }

    for (let i = 0; i < items.length; i++) {
      if (previousNode) {
        this.addAfter(previousNode, items[i]);
        previousNode = previousNode.next as NODE;
      } else {
        this.addAt(0, items[i]);
        previousNode = this._getNodeIterator().next().value;
      }
    }

    return removedList;
  }

  override reduceRight(callbackfn: ReduceLinearCallback<E>): E;

  override reduceRight(callbackfn: ReduceLinearCallback<E>, initialValue: E): E;

  /**
   * Right-to-left reduction using reverse iterator.
   * @param callbackfn - `(acc, element, index, self) => acc`.
   * @param initialValue - Initial accumulator.
   * @returns Final accumulator.
   * @remarks Time O(n), Space O(1)
   */
  override reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue: U): U;

  override reduceRight<U>(callbackfn: ReduceLinearCallback<E, U>, initialValue?: U): U {
    let accumulator = initialValue ?? (0 as U);
    let index = this.length - 1;
    for (const item of this._getReverseIterator()) {
      accumulator = callbackfn(accumulator, item, index--, this);
    }
    return accumulator;
  }

  /**
   * Delete by element or node in a linked list.
   * @param elementOrNode - Element or node.
   * @returns `true` if removed.
   * @remarks Time O(1)~O(n) depending on availability of links, Space O(1)
   */
  abstract override delete(elementOrNode: E | NODE | undefined): boolean;

  /**
   * Insert new element/node before an existing node.
   * @param existingElementOrNode - Reference element/node.
   * @param newElementOrNode - Element/node to insert.
   * @returns `true` if inserted.
   * @remarks Time O(1)~O(n) depending on reference access, Space O(1)
   */
  abstract addBefore(existingElementOrNode: E | NODE, newElementOrNode: E | NODE): boolean;

  /**
   * Insert new element/node after an existing node.
   * @param existingElementOrNode - Reference element/node.
   * @param newElementOrNode - Element/node to insert.
   * @returns `true` if inserted.
   * @remarks Time O(1)~O(n) depending on reference access, Space O(1)
   */
  abstract addAfter(existingElementOrNode: E | NODE, newElementOrNode: E | NODE): boolean;

  /**
   * Node at index (for random-access emulation).
   * @param index - Position (0-based).
   * @returns Node or `undefined`.
   * @remarks Time O(n), Space O(1)
   */
  abstract getNodeAt(index: number): NODE | undefined;

  /**
   * Iterate linked nodes from head to tail.
   * @returns Iterator over nodes.
   * @remarks Time O(n), Space O(1)
   */
  protected abstract _getNodeIterator(...args: any[]): IterableIterator<NODE>;

  /**
   * Get previous node of a given node.
   * @param node - Current node.
   * @returns Previous node or `undefined`.
   * @remarks Time O(1)~O(n) depending on list variant (singly vs doubly), Space O(1)
   */
  protected abstract _getPrevNode(node: NODE): NODE | undefined;
}
