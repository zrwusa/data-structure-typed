import { IterableElementBase } from '../../../../src/data-structures/base/iterable-element-base';

class TestIterable extends IterableElementBase<number, number> {
  private _arr: number[];

  constructor(arr: number[] = [], opts?: any) {
    super(opts);
    this._arr = [...arr];
  }

  protected *_getIterator(): IterableIterator<number> {
    yield* this._arr;
  }

  isEmpty(): boolean {
    return this._arr.length === 0;
  }

  clear(): void {
    this._arr.length = 0;
  }

  clone(): this {
    return new TestIterable(this._arr, { toElementFn: this.toElementFn }) as unknown as this;
  }

  map<EM, RM>(cb: any, options?: any, thisArg?: unknown): IterableElementBase<EM, RM> {
    const out = this._arr.map((v, i) => cb.call(thisArg, v, i, this));
    // For tests we keep it minimal; toElementFn unused.
    return new TestIterable(out as any, options) as any;
  }

  mapSame(cb: any, thisArg?: unknown): this {
    return new TestIterable(this._arr.map((v, i) => cb.call(thisArg, v, i, this))) as unknown as this;
  }

  filter(pred: any, thisArg?: unknown): this {
    const out: number[] = [];
    let i = 0;
    for (const v of this) {
      if (pred.call(thisArg, v, i++, this)) out.push(v);
    }
    return new TestIterable(out) as unknown as this;
  }
}

/**
 * Coverage-focused tests for IterableElementBase.
 * Keep existing @example tests intact.
 */
describe('IterableElementBase coverage', () => {
  it('constructor rejects non-function toElementFn when truthy', () => {
    expect(() => new TestIterable([], { toElementFn: 123 as any })).toThrow(TypeError);
  });

  it('every/some/forEach/find cover thisArg and non-thisArg paths', () => {
    const t = new TestIterable([1, 2, 3]);

    // thisArg === undefined path
    expect(t.every(v => v > 0)).toBe(true);
    expect(t.some(v => v === 2)).toBe(true);

    // thisArg path
    const ctx = { mul: 2, seen: [] as number[] };
    expect(
      t.every(function (this: any, v: number) {
        return v * this.mul > 0;
      }, ctx)
    ).toBe(true);

    t.forEach(function (this: any, v: number) {
      this.seen.push(v);
    }, ctx);
    expect(ctx.seen).toEqual([1, 2, 3]);

    const found = t.find(function (this: any, v: number) {
      return v === 3;
    }, ctx);
    expect(found).toBe(3);
  });

  it('reduce throws on empty without initialValue, works with/without initialValue', () => {
    const empty = new TestIterable([]);
    expect(() => empty.reduce((acc: number, v: number) => acc + v)).toThrow(TypeError);

    const t = new TestIterable([1, 2, 3]);
    expect(t.reduce((acc: number, v: number) => acc + v, 0)).toBe(6);

    // no initialValue uses first element
    expect(t.reduce((acc: number, v: number) => acc + v)).toBe(6);
  });

  it('values/toArray/toVisual/print/has basics', () => {
    const t = new TestIterable([1, 2]);
    expect([...t.values()]).toEqual([1, 2]);
    expect(t.toArray()).toEqual([1, 2]);
    expect(t.toVisual()).toEqual([1, 2]);
    expect(t.has(2)).toBe(true);
    expect(t.has(3)).toBe(false);

    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    t.print();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
