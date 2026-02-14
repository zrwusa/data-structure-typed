import { TreeSet } from '../../../../src';

describe('TreeSet (RedBlackTree-backed, no node exposure)', () => {
  test('basic operations: add/has/delete/size/isEmpty/clear', () => {
    const s = new TreeSet<number>();
    expect(s.isEmpty()).toBe(true);
    expect(s.size).toBe(0);

    expect(s.add(2)).toBe(s);
    expect(s.add(1)).toBe(s);
    expect(s.add(3)).toBe(s);
    expect(s.size).toBe(3);
    expect(s.isEmpty()).toBe(false);

    expect(s.has(2)).toBe(true);
    expect(s.has(999)).toBe(false);

    expect(s.delete(2)).toBe(true);
    expect(s.delete(2)).toBe(false);
    expect(s.size).toBe(2);

    s.clear();
    expect(s.size).toBe(0);
    expect(s.isEmpty()).toBe(true);
  });

  test('iteration: keys/values/entries and ordering', () => {
    const s = new TreeSet<number>([3, 1, 2, 2]);
    expect([...s]).toEqual([1, 2, 3]);
    expect([...s.keys()]).toEqual([1, 2, 3]);
    expect([...s.values()]).toEqual([1, 2, 3]);
    expect([...s.entries()]).toEqual([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);
  });

  test('default comparator: NaN throws (even on empty tree)', () => {
    const s = new TreeSet<number>();
    expect(() => s.add(Number.NaN)).toThrow(TypeError);
    expect(() => s.has(Number.NaN)).toThrow(TypeError);
    expect(() => s.delete(Number.NaN)).toThrow(TypeError);
    expect(() => s.ceiling(Number.NaN)).toThrow(TypeError);
  });

  test('default comparator: -0 and 0 are the same key', () => {
    const s = new TreeSet<number>();
    s.add(-0);
    expect(s.size).toBe(1);
    expect(s.has(0)).toBe(true);
    expect(s.has(-0)).toBe(true);

    s.add(0);
    expect(s.size).toBe(1);
  });

  test('default comparator: Date supported; invalid Date throws', () => {
    const d1 = new Date('2020-01-01T00:00:00.000Z');
    const d2 = new Date('2021-01-01T00:00:00.000Z');
    const s = new TreeSet<Date>([d2, d1]);
    expect([...s]).toEqual([d1, d2]);

    const bad = new Date('not-a-date');
    const s2 = new TreeSet<Date>();
    expect(() => s2.add(bad)).toThrow(TypeError);
  });

  test('default comparator: non-primitive/non-Date requires custom comparator', () => {
    type Obj = { n: number };
    const o1: Obj = { n: 1 };

    expect(() => new TreeSet<Obj>([o1])).toThrow(TypeError);

    const byN = (a: Obj, b: Obj) => a.n - b.n;
    const s = new TreeSet<Obj>([o1, { n: 2 }], { comparator: byN });
    expect(s.size).toBe(2);
  });

  test('navigable operations: first/last/pollFirst/pollLast', () => {
    const s = new TreeSet<number>();
    expect(s.first()).toBe(undefined);
    expect(s.last()).toBe(undefined);
    expect(s.pollFirst()).toBe(undefined);
    expect(s.pollLast()).toBe(undefined);

    s.add(2).add(1).add(3);
    expect(s.first()).toBe(1);
    expect(s.last()).toBe(3);

    expect(s.pollFirst()).toBe(1);
    expect([...s]).toEqual([2, 3]);

    expect(s.pollLast()).toBe(3);
    expect([...s]).toEqual([2]);
  });

  test('navigable operations: ceiling/floor/higher/lower', () => {
    const s = new TreeSet<number>([1, 3, 5]);

    expect(s.ceiling(0)).toBe(1);
    expect(s.ceiling(1)).toBe(1);
    expect(s.ceiling(2)).toBe(3);
    expect(s.ceiling(6)).toBe(undefined);

    expect(s.floor(0)).toBe(undefined);
    expect(s.floor(1)).toBe(1);
    expect(s.floor(2)).toBe(1);
    expect(s.floor(6)).toBe(5);

    expect(s.higher(1)).toBe(3);
    expect(s.higher(5)).toBe(undefined);

    expect(s.lower(1)).toBe(undefined);
    expect(s.lower(5)).toBe(3);
  });

  test('rangeSearch supports inclusive/exclusive bounds', () => {
    const s = new TreeSet<number>([1, 2, 3, 4, 5]);

    expect(s.rangeSearch([2, 4])).toEqual([2, 3, 4]);
    expect(s.rangeSearch([2, 4], { lowInclusive: true, highInclusive: false })).toEqual([2, 3]);
    expect(s.rangeSearch([2, 4], { lowInclusive: false, highInclusive: true })).toEqual([3, 4]);
    expect(s.rangeSearch([2, 4], { lowInclusive: false, highInclusive: false })).toEqual([3]);
  });
});
