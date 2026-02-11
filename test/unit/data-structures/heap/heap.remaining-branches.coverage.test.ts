import { Heap } from '../../../../src';

describe('Heap remaining branch coverage', () => {
  it('Heap.map with options undefined hits (options ?? {}) path and throws for missing comparator', () => {
    const h = new Heap<number>();
    h.add(1);
    expect(() => (h as any).map((x: number) => x, undefined)).toThrow(/requires options\.comparator/i);
  });

  it('Heap.mapSame without thisArg hits thisArg===undefined branch', () => {
    const h = new Heap<number>();
    h.add(1);
    h.add(2);
    const out = h.mapSame(x => x * 2);
    expect(out.toArray().sort((a, b) => a - b)).toEqual([2, 4]);
  });

  it('Heap default comparator throws when comparing object types', () => {
    const h = new Heap<any>();
    expect(() => (h as any)._DEFAULT_COMPARATOR({}, 1)).toThrow(TypeError);
  });
});
