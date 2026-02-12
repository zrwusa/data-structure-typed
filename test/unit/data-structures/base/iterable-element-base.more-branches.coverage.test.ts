import { ElementCallback, IterableElementBaseOptions } from 'src';
import { IterableElementBase } from '../../../../src/data-structures/base/iterable-element-base';

class NumIter extends IterableElementBase<number, number> {
  override isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }
  override clear(): void {
    throw new Error('Method not implemented.');
  }
  override clone(): this {
    throw new Error('Method not implemented.');
  }
  override map<EM, RM>(
    callback: ElementCallback<number, number, EM>,
    options?: IterableElementBaseOptions<EM, RM> | undefined,
    thisArg?: unknown
  ): IterableElementBase<EM, RM> {
    throw new Error('Method not implemented.');
  }
  override mapSame(callback: ElementCallback<number, number, number>, thisArg?: unknown): this {
    throw new Error('Method not implemented.');
  }
  override filter(predicate: ElementCallback<number, number, boolean>, thisArg?: unknown): this {
    throw new Error('Method not implemented.');
  }
  protected override _getIterator(...args: unknown[]): IterableIterator<number> {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly data: number[]) {
    super();
  }

  override *[Symbol.iterator](): IterableIterator<number> {
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
