import { DoublyLinkedList, ElementCallback, IterableElementBase, IterableElementBaseOptions } from '../../../../src';
import { LinearBase, LinearLinkedBase, LinkedListNode } from '../../../../src/data-structures/base/linear-base';
import type { LinearBaseOptions } from '../../../../src/types';

// --- Helper: array-backed LinearBase (used by "array" tests) ---
class TestArrayLinear extends LinearBase<number, number> {
  override isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }
  override map<EM, RM>(
    _callback: ElementCallback<number, number, EM>,
    _options?: IterableElementBaseOptions<EM, RM> | undefined,
    _thisArg?: unknown
  ): IterableElementBase<EM, RM> {
    throw new Error('Method not implemented.');
  }
  override mapSame(_callback: ElementCallback<number, number, number>, _thisArg?: unknown): this {
    throw new Error('Method not implemented.');
  }
  override filter(_predicate: ElementCallback<number, number, boolean>, _thisArg?: unknown): this {
    throw new Error('Method not implemented.');
  }
  private _arr: number[];

  constructor(values: number[] = [], options?: LinearBaseOptions<number, number>) {
    super(options);
    this._arr = values.slice();
  }

  get length(): number {
    return this._arr.length;
  }

  clear(): void {
    this._arr.length = 0;
  }

  setAt(index: number, value: number): boolean {
    if (index < 0 || index >= this._arr.length) return false;
    this._arr[index] = value;
    return true;
  }

  clone(): this {
    const out = this._createInstance();
    out.pushMany(this._arr);
    return out;
  }

  reverse(): this {
    this._arr.reverse();
    return this;
  }

  push(elementOrNode: number): boolean {
    if (this.maxLen > 0 && this._arr.length >= this.maxLen) return false;
    this._arr.push(elementOrNode);
    return true;
  }

  pushMany(elements: Iterable<number>): boolean[] {
    const out: boolean[] = [];
    for (const e of elements) out.push(this.push(e));
    return out;
  }

  delete(elementOrNode: number | undefined): boolean {
    if (elementOrNode === undefined) return false;
    const idx = this._arr.indexOf(elementOrNode);
    if (idx === -1) return false;
    this._arr.splice(idx, 1);
    return true;
  }

  at(index: number): number | undefined {
    return this._arr[index];
  }

  deleteAt(pos: number): number | undefined {
    if (pos < 0 || pos >= this._arr.length) return undefined;
    return this._arr.splice(pos, 1)[0];
  }

  addAt(index: number, newElementOrNode: number): boolean {
    if (this.maxLen > 0 && this._arr.length >= this.maxLen) return false;
    if (index < 0) index = 0;
    if (index > this._arr.length) index = this._arr.length;
    this._arr.splice(index, 0, newElementOrNode);
    return true;
  }

  override toArray(): number[] {
    return this._arr.slice();
  }

  protected _createInstance(options?: LinearBaseOptions<number, number>): this {
    return new TestArrayLinear([], options) as unknown as this;
  }

  protected *_getIterator(): IterableIterator<number> {
    for (const v of this._arr) yield v;
  }

  protected *_getReverseIterator(): IterableIterator<number> {
    for (let i = this._arr.length - 1; i >= 0; i--) yield this._arr[i];
  }
}

// --- Helper: concat-else minimal stub ---
type R = number;

class ConcatLinear extends LinearBase<number, R> {
  override setAt(_index: number, _value: number): boolean {
    throw new Error('Method not implemented.');
  }
  override reverse(): this {
    throw new Error('Method not implemented.');
  }
  override delete(_elementOrNode: number | LinkedListNode<number> | undefined): boolean {
    throw new Error('Method not implemented.');
  }
  override deleteAt(_pos: number): number | undefined {
    throw new Error('Method not implemented.');
  }
  override addAt(_index: number, _newElementOrNode: number | LinkedListNode<number>): boolean {
    throw new Error('Method not implemented.');
  }
  protected override _getReverseIterator(..._args: any[]): IterableIterator<number> {
    throw new Error('Method not implemented.');
  }
  override isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }
  override clear(): void {
    throw new Error('Method not implemented.');
  }
  override map<EM, RM>(
    _callback: ElementCallback<number, number, EM>,
    _options?: IterableElementBaseOptions<EM, RM> | undefined,
    _thisArg?: unknown
  ): IterableElementBase<EM, RM> {
    throw new Error('Method not implemented.');
  }
  override mapSame(_callback: ElementCallback<number, number, number>, _thisArg?: unknown): this {
    throw new Error('Method not implemented.');
  }
  override filter(_predicate: ElementCallback<number, number, boolean>, _thisArg?: unknown): this {
    throw new Error('Method not implemented.');
  }
  protected _data: number[];
  constructor(iter: Iterable<number> = []) {
    super();
    this._data = Array.from(iter);
  }
  override get length(): number {
    return this._data.length;
  }
  protected _getIterator(): IterableIterator<number> {
    return this._data[Symbol.iterator]();
  }
  protected _createInstance(): this {
    return new ConcatLinear() as any;
  }
  override clone(): this {
    return new ConcatLinear(this._data) as any;
  }
  override push(element: number): boolean {
    this._data.push(element);
    return true;
  }
  override pushMany(elements: Iterable<number>): boolean[] {
    const ans: boolean[] = [];
    for (const e of elements) ans.push(this.push(e));
    return ans;
  }
  override at(index: number): number | undefined {
    return this._data[index];
  }
}

// --- Helper: more-branches array-backed ---
class MoreBranchesArrayLinear extends LinearBase<number, any> {
  private _arr: number[] = [];

  get length(): number {
    return this._arr.length;
  }

  override clone(): this {
    const out = this._createInstance();
    for (const v of this._arr) out.push(v);
    return out;
  }

  reverse(): this {
    this._arr.reverse();
    return this;
  }

  push(elementOrNode: number | LinkedListNode<number>): boolean {
    const v = elementOrNode instanceof LinkedListNode ? elementOrNode.value : elementOrNode;
    this._arr.push(v);
    return true;
  }

  pushMany(elements: Iterable<number> | Iterable<any> | Iterable<LinkedListNode<number>>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements as any) ans.push(this.push(el));
    return ans;
  }

  delete(elementOrNode: number | LinkedListNode<number> | undefined): boolean {
    if (elementOrNode === undefined) return false;
    const v = elementOrNode instanceof LinkedListNode ? elementOrNode.value : elementOrNode;
    const i = this._arr.indexOf(v);
    if (i < 0) return false;
    this._arr.splice(i, 1);
    return true;
  }

  at(index: number): number | undefined {
    return this._arr[index];
  }

  deleteAt(pos: number): number | undefined {
    if (pos < 0 || pos >= this._arr.length) return undefined;
    return this._arr.splice(pos, 1)[0];
  }

  addAt(index: number, newElementOrNode: number | LinkedListNode<number>): boolean {
    const v = newElementOrNode instanceof LinkedListNode ? newElementOrNode.value : newElementOrNode;
    this._arr.splice(index, 0, v);
    return true;
  }

  setAt(index: number, value: number): boolean {
    if (index < 0 || index >= this._arr.length) return false;
    this._arr[index] = value;
    return true;
  }

  clear(): void {
    this._arr = [];
  }

  protected _createInstance(): this {
    return new (this.constructor as any)();
  }

  protected *_getIterator(): IterableIterator<number> {
    yield* this._arr;
  }

  protected *_getReverseIterator(): IterableIterator<number> {
    for (let i = this._arr.length - 1; i >= 0; i--) yield this._arr[i];
  }

  isEmpty(): boolean {
    return false;
  }

  filter(_predicate: ElementCallback<number, any, boolean>, _thisArg?: any): this {
    const out = this._createInstance();
    return out;
  }

  // @ts-ignore
  map(_callback: ElementCallback<number, any, number>, options: IterableElementBaseOptions<number, any> | undefined, _thisArg: unknown | undefined): MoreBranchesArrayLinear {
    const out = this._createLike([], { ...(options ?? {}) });
    return out;
  }

  mapSame(_callback: ElementCallback<number, any, number>, _thisArg: unknown | undefined): this {
    const out = this._createInstance();
    return out;
  }

  protected _createLike(
    elements: Iterable<number> | Iterable<any> = [],
    options?: IterableElementBaseOptions<number, any>
  ): MoreBranchesArrayLinear {
    const Ctor = this.constructor as new (
      elements?: Iterable<number> | Iterable<any>,
      options?: IterableElementBaseOptions<number, any>
    ) => MoreBranchesArrayLinear;
    return new Ctor(elements, options);
  }
}

// --- Helper: more-branches node-backed ---
class NodeLinear extends LinearLinkedBase<number, any, LinkedListNode<number>> {
  private _head: LinkedListNode<number> | undefined;
  private _tail: LinkedListNode<number> | undefined;
  private _len = 0;

  get length(): number {
    return this._len;
  }

  override clone(): this {
    const out = this._createInstance();
    for (const v of this) out.push(v);
    return out;
  }

  reverse(): this {
    const arr = [...this].reverse();
    this.clear();
    for (const v of arr) this.push(v);
    return this;
  }

  push(elementOrNode: number | LinkedListNode<number>): boolean {
    const n = elementOrNode instanceof LinkedListNode ? elementOrNode : new LinkedListNode(elementOrNode);
    n.next = undefined;
    if (!this._head) {
      this._head = this._tail = n;
    } else {
      (this._tail as any).next = n;
      this._tail = n;
    }
    this._len++;
    return true;
  }

  pushMany(elements: Iterable<number> | Iterable<any> | Iterable<LinkedListNode<number>>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements as any) ans.push(this.push(el));
    return ans;
  }

  delete(elementOrNode: number | LinkedListNode<number> | undefined): boolean {
    if (elementOrNode === undefined) return false;
    const target = elementOrNode instanceof LinkedListNode ? elementOrNode : undefined;
    const value = elementOrNode instanceof LinkedListNode ? elementOrNode.value : elementOrNode;

    let prev: LinkedListNode<number> | undefined;
    let cur = this._head;
    while (cur) {
      const match = target ? cur === target : cur.value === value;
      if (match) {
        if (!prev) {
          this._head = cur.next;
          if (this._tail === cur) this._tail = this._head;
        } else {
          prev.next = cur.next;
          if (this._tail === cur) this._tail = prev;
        }
        this._len--;
        return true;
      }
      prev = cur;
      cur = cur.next;
    }
    return false;
  }

  at(index: number): number | undefined {
    return this.getNodeAt(index)?.value;
  }

  deleteAt(pos: number): number | undefined {
    const n = this.getNodeAt(pos);
    if (!n) return undefined;
    const v = n.value;
    this.delete(n);
    return v;
  }

  addAt(index: number, newElementOrNode: number | LinkedListNode<number>): boolean {
    const node = newElementOrNode instanceof LinkedListNode ? newElementOrNode : new LinkedListNode(newElementOrNode);
    if (index <= 0 || !this._head) {
      node.next = this._head;
      this._head = node;
      if (!this._tail) this._tail = node;
      this._len++;
      return true;
    }
    const prev = this.getNodeAt(index - 1);
    if (!prev) return false;
    node.next = prev.next;
    prev.next = node;
    if (this._tail === prev) this._tail = node;
    this._len++;
    return true;
  }

  setAt(index: number, value: number): boolean {
    const n = this.getNodeAt(index);
    if (!n) return false;
    n.value = value;
    return true;
  }

  protected _ensurePredicate(
    elementNodeOrPredicate: number | LinkedListNode<number> | ((node: LinkedListNode<number>) => boolean)
  ): (node: LinkedListNode<number>) => boolean {
    if (elementNodeOrPredicate instanceof LinkedListNode) {
      const target = elementNodeOrPredicate;
      return (node: LinkedListNode<number>) => node === target;
    }
    if (typeof elementNodeOrPredicate === 'function') {
      return elementNodeOrPredicate as (node: LinkedListNode<number>) => boolean;
    }
    const value = elementNodeOrPredicate as number;
    return (node: LinkedListNode<number>) => node.value === value;
  }

  getNode(
    elementNodeOrPredicate: number | LinkedListNode<number> | ((node: LinkedListNode<number>) => boolean) | undefined
  ): LinkedListNode<number> | undefined {
    if (elementNodeOrPredicate === undefined) return;

    if (elementNodeOrPredicate instanceof LinkedListNode) {
      const target = elementNodeOrPredicate;

      let cur = this._head;
      while (cur) {
        if (cur === target) return target;
        cur = cur.next;
      }

      const isMatch = (node: LinkedListNode<number>) => node.value === target.value;
      cur = this._head;
      while (cur) {
        if (isMatch(cur)) return cur;
        cur = cur.next;
      }
      return undefined;
    }

    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this._head;
    while (current) {
      if (predicate(current)) return current;
      current = current.next;
    }
    return undefined;
  }

  addBefore(existing: number | LinkedListNode<number>, neu: number | LinkedListNode<number>): boolean {
    const node = this.getNode(existing);
    if (!node) return false;
    const prev = this._getPrevNode(node);
    const nn = neu instanceof LinkedListNode ? neu : new LinkedListNode(neu);
    if (!prev) {
      nn.next = this._head;
      this._head = nn;
      if (!this._tail) this._tail = nn;
    } else {
      prev.next = nn;
      nn.next = node;
    }
    this._len++;
    return true;
  }

  addAfter(existing: number | LinkedListNode<number>, neu: number | LinkedListNode<number>): boolean {
    const node = this.getNode(existing);
    if (!node) return false;
    const nn = neu instanceof LinkedListNode ? neu : new LinkedListNode(neu);
    nn.next = node.next;
    node.next = nn;
    if (this._tail === node) this._tail = nn;
    this._len++;
    return true;
  }

  getNodeAt(index: number): LinkedListNode<number> | undefined {
    if (index < 0 || index >= this._len) return undefined;
    let cur = this._head;
    let i = 0;
    while (cur && i < index) {
      cur = cur.next;
      i++;
    }
    return cur;
  }

  clear(): void {
    this._head = this._tail = undefined;
    this._len = 0;
  }

  protected _createInstance(): this {
    return new (this.constructor as any)();
  }

  protected *_getIterator(): IterableIterator<number> {
    let cur = this._head;
    while (cur) {
      yield cur.value;
      cur = cur.next;
    }
  }

  protected *_getReverseIterator(): IterableIterator<number> {
    const arr = [...this].reverse();
    for (const v of arr) yield v;
  }

  protected *_getNodeIterator(): IterableIterator<LinkedListNode<number>> {
    let cur = this._head;
    while (cur) {
      yield cur;
      cur = cur.next;
    }
  }

  protected _getPrevNode(node: LinkedListNode<number>): LinkedListNode<number> | undefined {
    if (!this._head || this._head === node) return undefined;
    let cur = this._head;
    while (cur.next && cur.next !== node) cur = cur.next;
    return cur.next === node ? cur : undefined;
  }

  isEmpty(): boolean {
    return false;
  }

  filter(_predicate: ElementCallback<number, any, boolean>, _thisArg?: any): this {
    const out = this._createInstance();
    return out;
  }

  // @ts-ignore
  map(callback: ElementCallback<number, any, number>, options: IterableElementBaseOptions<number, any> | undefined, _thisArg: unknown | undefined): MoreBranchesArrayLinear {
    const out = this._createLike([], { ...(options ?? {}) });
    return out;
  }

  mapSame(_callback: ElementCallback<number, any, number>, _thisArg: unknown | undefined): this {
    const out = this._createInstance();
    return out;
  }

  protected _createLike(
    elements: Iterable<number> | Iterable<any> = [],
    options?: IterableElementBaseOptions<number, any>
  ): MoreBranchesArrayLinear {
    const Ctor = this.constructor as new (
      elements?: Iterable<number> | Iterable<any>,
      options?: IterableElementBaseOptions<number, any>
    ) => MoreBranchesArrayLinear;
    return new Ctor(elements, options);
  }
}

describe('LinearBase coverage', () => {
  describe('array-backed subclass', () => {
    it('constructor maxLen branch: accept positive int and ignore non-int/invalid', () => {
      const a = new TestArrayLinear([], { maxLen: 3 });
      expect(a.maxLen).toBe(3);

      const b = new TestArrayLinear([], { maxLen: 2.2 } as any);
      expect(b.maxLen).toBe(-1);

      const c = new TestArrayLinear([], { maxLen: -5 } as any);
      expect(c.maxLen).toBe(-1);
    });

    it('indexOf/lastIndexOf cover empty and fromIndex normalization', () => {
      const empty = new TestArrayLinear();
      expect(empty.indexOf(1)).toBe(-1);
      expect(empty.lastIndexOf(1)).toBe(-1);

      const list = new TestArrayLinear([1, 2, 3, 2, 1]);

      expect(list.indexOf(2, -2)).toBe(3); // length + (-2) => 3
      expect(list.indexOf(1, -999)).toBe(0); // clamp to 0
      expect(list.lastIndexOf(2, 999)).toBe(3); // clamp to length-1

      expect(list.lastIndexOf(2, -999)).toBe(-1);
    });

    it('concat/sort/join/toReversedArray exercise LinearBase helpers', () => {
      const a = new TestArrayLinear([3, 1, 2]);
      const b = new TestArrayLinear([9]);

      const c = a.concat(b, 7);
      expect(c.toArray()).toEqual([3, 1, 2, 9, 7]);

      expect(c.join('-')).toBe('3-1-2-9-7');
      expect(c.toReversedArray()).toEqual([7, 9, 2, 1, 3]);

      c.sort((x, y) => x - y);
      expect(c.toArray()).toEqual([1, 2, 3, 7, 9]);
    });

    it('slice/splice/fill cover negative indices and early-return branches', () => {
      const list = new TestArrayLinear([1, 2, 3, 4]);

      expect(list.slice(1, -1).toArray()).toEqual([2, 3]);
      expect(list.slice(-1, -1).toArray()).toEqual([]);

      const removed = list.splice(-2, 999, 8, 9);
      expect(removed.toArray()).toEqual([3, 4]);
      expect(list.toArray()).toEqual([1, 2, 8, 9]);

      list.fill(0, 3, 2);
      expect(list.toArray()).toEqual([1, 2, 8, 9]);

      list.fill(5, -999, 999);
      expect(list.toArray()).toEqual([5, 5, 5, 5]);
    });
  });

  describe('concat else-branch', () => {
    it('concat(item) uses else-branch when item is not a LinearBase', () => {
      const l = new ConcatLinear([1, 2]);
      const out = (l as any).concat(3);
      expect(out.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('via DoublyLinkedList', () => {
    it('indexOf/lastIndexOf handle fromIndex bounds and negatives', () => {
      const list = new DoublyLinkedList<number | undefined>();
      list.pushMany([1, 2, 3, 2, 1]);

      expect(list.indexOf(2)).toBe(1);
      expect(list.indexOf(2, 2)).toBe(3);

      expect(list.indexOf(1, -999)).toBe(0);

      expect(list.lastIndexOf(2)).toBe(3);
      expect(list.lastIndexOf(1, 999)).toBe(4);
      expect(list.lastIndexOf(2, -1)).toBe(-1);
    });

    it('findIndex skips undefined elements', () => {
      const list = new DoublyLinkedList<number | undefined>();
      list.pushMany([undefined, 1, undefined, 2]);

      const spy = jest.fn((x: number) => x === 2);
      expect(list.findIndex(spy as any)).toBe(3);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('slice/splice cover defaults and head-insert path', () => {
      const list = new DoublyLinkedList<number>();
      list.pushMany([1, 2, 3, 4]);

      expect(list.slice().toArray()).toEqual([1, 2, 3, 4]);
      expect(list.slice(1, -1).toArray()).toEqual([2, 3]);

      const removed0 = list.splice(0, 0, 9, 8);
      expect(removed0.toArray()).toEqual([]);
      expect(list.toArray()).toEqual([9, 8, 1, 2, 3, 4]);

      const removed = list.splice(2, 2, 7);
      expect(removed.toArray()).toEqual([1, 2]);
      expect(list.toArray()).toEqual([9, 8, 7, 3, 4]);

      const removed2 = list.splice(-1, 1);
      expect(removed2.toArray()).toEqual([4]);
      expect(list.toArray()).toEqual([9, 8, 7, 3]);
    });

    it('reduceRight covers initialValue defaulting', () => {
      const list = new DoublyLinkedList<number>();
      list.pushMany([1, 2, 3]);

      const sum = list.reduceRight((acc: number, x: number) => acc + x);
      expect(sum).toBe(6);

      const sum2 = list.reduceRight((acc: number, x: number) => acc + x, 10);
      expect(sum2).toBe(16);
    });
  });

  describe('more branches', () => {
    it('splice() covers default deleteCount and start<0 false arm; reduceRight covers initialValue ?? fallback', () => {
      const l = new MoreBranchesArrayLinear();
      l.pushMany([1, 2, 3]);

      const removed = l.splice(1);
      expect([...removed]).toEqual([]);

      const sum0 = (l as any).reduceRight((acc: number, v: number) => acc + v, undefined);
      expect(sum0).toBe(6);
      const sum10 = l.reduceRight((acc, v) => acc + v, 10);
      expect(sum10).toBe(16);
    });

    it('slice() covers default args start=0,end=length; concat covers non-LinearBase else arm', () => {
      const l = new MoreBranchesArrayLinear();
      l.pushMany([1, 2, 3]);

      expect([...l.slice()]).toEqual([1, 2, 3]);

      const c = l.concat(4 as any);
      expect([...c]).toEqual([1, 2, 3, 4]);
    });

    it('LinearLinkedBase slice uses negative start arm; splice uses default deleteCount', () => {
      const l = new NodeLinear();
      l.pushMany([1, 2, 3, 4]);

      expect([...l.slice(-2)]).toEqual([3, 4]);

      const removed = l.splice(2);
      expect([...removed]).toEqual([]);
    });
  });
});
