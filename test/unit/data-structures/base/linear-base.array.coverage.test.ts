import { IterableElementBase } from 'src';
import { LinearBase } from '../../../../src/data-structures/base/linear-base';
import type { ElementCallback, IterableElementBaseOptions, LinearBaseOptions } from '../../../../src/types';

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

describe('LinearBase coverage (array-backed subclass)', () => {
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

    // fromIndex < 0 => length + fromIndex (may still be negative) -> returns -1
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

    // slice negative end/start
    expect(list.slice(1, -1).toArray()).toEqual([2, 3]);
    expect(list.slice(-1, -1).toArray()).toEqual([]);

    // splice clamps start/deleteCount
    const removed = list.splice(-2, 999, 8, 9);
    expect(removed.toArray()).toEqual([3, 4]);
    expect(list.toArray()).toEqual([1, 2, 8, 9]);

    // fill clamps and early return when start>=end
    list.fill(0, 3, 2);
    expect(list.toArray()).toEqual([1, 2, 8, 9]);

    list.fill(5, -999, 999);
    expect(list.toArray()).toEqual([5, 5, 5, 5]);
  });
});
