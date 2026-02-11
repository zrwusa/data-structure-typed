import { LinearBase } from '../../../../src/data-structures/base/linear-base';

type R = number;
class ArrayLinear extends LinearBase<number, R> {
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
    const out = l.concat(3 as any);
    expect(out.toArray()).toEqual([1, 2, 3]);
  });
});
