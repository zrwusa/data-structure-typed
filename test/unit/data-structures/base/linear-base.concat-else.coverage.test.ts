import { ElementCallback, IterableElementBaseOptions, IterableElementBase } from 'src';
import { LinearBase, LinkedListNode } from '../../../../src/data-structures/base/linear-base';

type R = number;

class ArrayLinear extends LinearBase<number, R> {
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
    return new ArrayLinear() as any;
  }
  override clone(): this {
    return new ArrayLinear(this._data) as any;
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

describe('LinearBase concat else-branch coverage', () => {
  it('concat(item) uses else-branch when item is not a LinearBase', () => {
    const l = new ArrayLinear([1, 2]);
    // Use any-call to avoid TS overload narrowing affecting runtime call site.
    const out = (l as any).concat(3);
    expect(out.toArray()).toEqual([1, 2, 3]);
  });
});
