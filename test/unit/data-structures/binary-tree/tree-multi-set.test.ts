import { TreeMultiSet } from '../../../../src';

describe('TreeMultiSet (RFC)', () => {
  it('add/count/has: basic counts and size/distinctSize', () => {
    const ms = new TreeMultiSet<number>();

    expect(ms.size).toBe(0);
    expect(ms.distinctSize).toBe(0);

    ms.add(2);
    ms.add(2);
    ms.add(1, 3);

    expect(ms.count(2)).toBe(2);
    expect(ms.count(1)).toBe(3);
    expect(ms.count(999)).toBe(0);

    expect(ms.has(2)).toBe(true);
    expect(ms.has(999)).toBe(false);

    // size is sumCounts
    expect(ms.size).toBe(5);
    expect(ms.distinctSize).toBe(2);
  });

  it('delete(): removes one occurrence by default; delete(n) removes n; deleteAll removes all', () => {
    const ms = new TreeMultiSet<number>();
    ms.add(10, 3);

    expect(ms.delete(10)).toBe(true);
    expect(ms.count(10)).toBe(2);
    expect(ms.size).toBe(2);

    expect(ms.delete(10, 2)).toBe(true);
    expect(ms.count(10)).toBe(0);
    expect(ms.has(10)).toBe(false);
    expect(ms.size).toBe(0);
    expect(ms.distinctSize).toBe(0);

    ms.add(5, 4);
    expect(ms.deleteAll(5)).toBe(true);
    expect(ms.count(5)).toBe(0);
    expect(ms.size).toBe(0);
  });

  it('setCount(): sets exact count and updates size/distinctSize', () => {
    const ms = new TreeMultiSet<number>();

    expect(ms.setCount(1, 2)).toBe(true);
    expect(ms.count(1)).toBe(2);
    expect(ms.size).toBe(2);
    expect(ms.distinctSize).toBe(1);

    // no change
    expect(ms.setCount(1, 2)).toBe(false);

    // decrease
    expect(ms.setCount(1, 1)).toBe(true);
    expect(ms.size).toBe(1);

    // set to 0 removes key
    expect(ms.setCount(1, 0)).toBe(true);
    expect(ms.has(1)).toBe(false);
    expect(ms.distinctSize).toBe(0);
    expect(ms.size).toBe(0);
  });

  it('[Symbol.iterator] is expanded by default', () => {
    const ms = new TreeMultiSet<number>();
    ms.add(2, 2);
    ms.add(1, 1);

    // expanded iteration, ordered by key
    expect([...ms]).toEqual([1, 2, 2]);
  });

  it('entries()/keysDistinct(): distinct views', () => {
    const ms = new TreeMultiSet<number>();
    ms.add(2, 2);
    ms.add(1, 1);

    expect([...ms.keysDistinct()]).toEqual([1, 2]);
    expect([...ms.entries()]).toEqual([
      [1, 1],
      [2, 2]
    ]);
  });

  it('toArray()/toDistinctArray()/toEntries()', () => {
    const ms = new TreeMultiSet<number>();
    ms.add(2, 2);
    ms.add(1, 1);

    expect(ms.toArray()).toEqual([1, 2, 2]);
    expect(ms.toDistinctArray()).toEqual([1, 2]);
    expect(ms.toEntries()).toEqual([
      [1, 1],
      [2, 2]
    ]);
  });

  it('count validation: n must be safe integer and >=0', () => {
    const ms = new TreeMultiSet<number>();

    expect(() => ms.add(1, -1 as any)).toThrow(RangeError);
    expect(() => ms.add(1, 1.2 as any)).toThrow(RangeError);
    expect(() => ms.setCount(1, -1 as any)).toThrow(RangeError);
    expect(() => ms.delete(1, -1 as any)).toThrow(RangeError);
  });
});
