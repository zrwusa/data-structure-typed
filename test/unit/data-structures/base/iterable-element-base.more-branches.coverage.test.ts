import { IterableElementBase } from '../../../../src/data-structures/base/iterable-element-base';

class NumIter extends IterableElementBase<number, number> {
  constructor(private readonly data: number[]) {
    super();
  }

  *[Symbol.iterator](): IterableIterator<number> {
    for (const n of this.data) yield n;
  }
}

describe('IterableElementBase remaining branch coverage', () => {
  it('every() uses thisArg branch (fn.call) and can early-return false', () => {
    const it = new NumIter([1, 2, 3]);

    const ctx = { limit: 2 };
    const res = it.every(function (this: any, v: number) {
      return v <= this.limit;
    }, ctx);

    expect(res).toBe(false);
  });

  it('some() uses thisArg branch (fn.call) and can early-return true', () => {
    const it = new NumIter([1, 2, 3]);

    const ctx = { pick: 2 };
    const res = it.some(function (this: any, v: number) {
      return v === this.pick;
    }, ctx);

    expect(res).toBe(true);
  });
});
