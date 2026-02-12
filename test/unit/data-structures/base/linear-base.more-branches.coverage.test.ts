import { LinearBase, LinearLinkedBase, LinkedListNode,  } from '../../../../src/data-structures/base/linear-base';
import {
  DoublyLinkedListNode,
  DoublyLinkedListOptions,
  ElementCallback,
  IterableElementBase,
  IterableElementBaseOptions
} from '../../../../src';

class ArrayLinear extends LinearBase<number, any> {
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

  filter(predicate: ElementCallback<number, any, boolean>, thisArg?: any): this {
    const out = this._createInstance();

    return out;
  }

  // @ts-ignore
  map(callback: ElementCallback<number, any, number>, options: IterableElementBaseOptions<number, any> | undefined, thisArg: unknown | undefined): ArrayLinear {
    const out = this._createLike([], { ...(options ?? {}) });
    return out;
  }

  mapSame(callback: ElementCallback<number, any, number>, thisArg: unknown | undefined): this {
    const out = this._createInstance();

    return out;
  }

  protected _createLike(
    elements: Iterable<number> | Iterable<any>  = [],
    options?: IterableElementBaseOptions<number, any>
  ): ArrayLinear {
    const Ctor = this.constructor as new (
      elements?: Iterable<number> | Iterable<any> ,
      options?: IterableElementBaseOptions<number, any>
    ) => ArrayLinear;
    return new Ctor(elements, options);
  }
}

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
    // simple rebuild
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

    if ( elementNodeOrPredicate instanceof LinkedListNode) {
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



  filter(predicate: ElementCallback<number, any, boolean>, thisArg?: any): this {
    const out = this._createInstance();

    return out;
  }

  // @ts-ignore
  map(callback: ElementCallback<number, any, number>, options: IterableElementBaseOptions<number, any> | undefined, thisArg: unknown | undefined): ArrayLinear {
    const out = this._createLike([], { ...(options ?? {}) });
    return out;
  }

  mapSame(callback: ElementCallback<number, any, number>, thisArg: unknown | undefined): this {
    const out = this._createInstance();

    return out;
  }

  protected _createLike(
    elements: Iterable<number> | Iterable<any>  = [],
    options?: IterableElementBaseOptions<number, any>
  ): ArrayLinear {
    const Ctor = this.constructor as new (
      elements?: Iterable<number> | Iterable<any> ,
      options?: IterableElementBaseOptions<number, any>
    ) => ArrayLinear;
    return new Ctor(elements, options);
  }
}

describe('LinearBase additional branch coverage', () => {
  it('splice() covers default deleteCount and start<0 false arm; reduceRight covers initialValue ?? fallback', () => {
    const l = new ArrayLinear();
    l.pushMany([1, 2, 3]);

    // default deleteCount=0 + start>=0 (false arm of start<0 ? ...)
    const removed = l.splice(1);
    expect([...removed]).toEqual([]);

    // reduceRight: initialValue undefined => uses 0; and defined path
    const sum0 = (l as any).reduceRight((acc: number, v: number) => acc + v, undefined);
    expect(sum0).toBe(6);
    const sum10 = l.reduceRight((acc, v) => acc + v, 10);
    expect(sum10).toBe(16);
  });

  it('slice() covers default args start=0,end=length; concat covers non-LinearBase else arm', () => {
    const l = new ArrayLinear();
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
