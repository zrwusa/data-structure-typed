import { TreeMultiSet } from '../../../../src';

describe('TreeMultiSet', () => {
  describe('Core API (existing)', () => {
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

  describe('clear()', () => {
    it('should remove all elements', () => {
      const ms = new TreeMultiSet([1, 2, 2, 3, 3, 3]);
      expect(ms.size).toBe(6);
      expect(ms.distinctSize).toBe(3);

      ms.clear();

      expect(ms.size).toBe(0);
      expect(ms.distinctSize).toBe(0);
      expect(ms.isEmpty()).toBe(true);
      expect([...ms]).toEqual([]);
    });

    it('should work on empty set', () => {
      const ms = new TreeMultiSet<number>();
      ms.clear();
      expect(ms.size).toBe(0);
    });
  });

  describe('Navigable methods', () => {
    /**
     * @example
     * const ms = new TreeMultiSet([3, 1, 4, 1, 5]);
     * ms.first();  // 1
     * ms.last();   // 5
     */
    it('first(): returns smallest key', () => {
      const ms = new TreeMultiSet([3, 1, 4, 1, 5]);
      expect(ms.first()).toBe(1);
    });

    it('first(): returns undefined on empty set', () => {
      const ms = new TreeMultiSet<number>();
      expect(ms.first()).toBeUndefined();
    });

    it('last(): returns largest key', () => {
      const ms = new TreeMultiSet([3, 1, 4, 1, 5]);
      expect(ms.last()).toBe(5);
    });

    it('last(): returns undefined on empty set', () => {
      const ms = new TreeMultiSet<number>();
      expect(ms.last()).toBeUndefined();
    });

    /**
     * @example
     * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
     * ms.pollFirst();  // 1 (removes all occurrences of 1)
     * ms.size;         // 4
     */
    it('pollFirst(): removes all occurrences of smallest key and returns it', () => {
      const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
      expect(ms.pollFirst()).toBe(1);
      expect(ms.has(1)).toBe(false);
      expect(ms.size).toBe(4);
      expect(ms.distinctSize).toBe(2);
    });

    it('pollFirst(): returns undefined on empty set', () => {
      const ms = new TreeMultiSet<number>();
      expect(ms.pollFirst()).toBeUndefined();
    });

    it('pollLast(): removes all occurrences of largest key and returns it', () => {
      const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
      expect(ms.pollLast()).toBe(3);
      expect(ms.has(3)).toBe(false);
      expect(ms.size).toBe(3);
      expect(ms.distinctSize).toBe(2);
    });

    it('pollLast(): returns undefined on empty set', () => {
      const ms = new TreeMultiSet<number>();
      expect(ms.pollLast()).toBeUndefined();
    });

    /**
     * @example
     * const ms = new TreeMultiSet([10, 20, 30]);
     * ms.ceiling(15);  // 20 (smallest >= 15)
     * ms.ceiling(20);  // 20 (exact match)
     * ms.ceiling(35);  // undefined
     */
    it('ceiling(): returns smallest key >= given key', () => {
      const ms = new TreeMultiSet([10, 20, 30]);
      expect(ms.ceiling(15)).toBe(20);
      expect(ms.ceiling(20)).toBe(20);
      expect(ms.ceiling(10)).toBe(10);
      expect(ms.ceiling(5)).toBe(10);
      expect(ms.ceiling(35)).toBeUndefined();
    });

    /**
     * @example
     * const ms = new TreeMultiSet([10, 20, 30]);
     * ms.floor(25);  // 20 (largest <= 25)
     * ms.floor(20);  // 20 (exact match)
     * ms.floor(5);   // undefined
     */
    it('floor(): returns largest key <= given key', () => {
      const ms = new TreeMultiSet([10, 20, 30]);
      expect(ms.floor(25)).toBe(20);
      expect(ms.floor(20)).toBe(20);
      expect(ms.floor(30)).toBe(30);
      expect(ms.floor(35)).toBe(30);
      expect(ms.floor(5)).toBeUndefined();
    });

    /**
     * @example
     * const ms = new TreeMultiSet([10, 20, 30]);
     * ms.higher(10);  // 20 (smallest > 10)
     * ms.higher(15);  // 20
     * ms.higher(30);  // undefined
     */
    it('higher(): returns smallest key > given key', () => {
      const ms = new TreeMultiSet([10, 20, 30]);
      expect(ms.higher(10)).toBe(20);
      expect(ms.higher(15)).toBe(20);
      expect(ms.higher(5)).toBe(10);
      expect(ms.higher(30)).toBeUndefined();
      expect(ms.higher(20)).toBe(30);
    });

    /**
     * @example
     * const ms = new TreeMultiSet([10, 20, 30]);
     * ms.lower(20);  // 10 (largest < 20)
     * ms.lower(15);  // 10
     * ms.lower(10);  // undefined
     */
    it('lower(): returns largest key < given key', () => {
      const ms = new TreeMultiSet([10, 20, 30]);
      expect(ms.lower(20)).toBe(10);
      expect(ms.lower(15)).toBe(10);
      expect(ms.lower(35)).toBe(30);
      expect(ms.lower(10)).toBeUndefined();
      expect(ms.lower(30)).toBe(20);
    });

    it('navigable methods on empty set', () => {
      const ms = new TreeMultiSet<number>();
      expect(ms.ceiling(10)).toBeUndefined();
      expect(ms.floor(10)).toBeUndefined();
      expect(ms.higher(10)).toBeUndefined();
      expect(ms.lower(10)).toBeUndefined();
    });
  });

  describe('Functional methods', () => {
    /**
     * @example
     * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
     * ms.forEach((key, count) => console.log(`${key}: ${count}`));
     * // 1: 2, 2: 1, 3: 3
     */
    it('forEach(): iterates over distinct keys with counts', () => {
      const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
      const result: Array<[number, number]> = [];
      ms.forEach((key, count) => result.push([key, count]));
      expect(result).toEqual([[1, 2], [2, 1], [3, 3]]);
    });

    /**
     * @example
     * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
     * const filtered = ms.filter((key, count) => count >= 2);
     * // TreeMultiSet { 1: 2, 3: 3 }
     */
    it('filter(): creates new set with matching entries', () => {
      const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
      const filtered = ms.filter((key, count) => count >= 2);
      expect(filtered.distinctSize).toBe(2);
      expect(filtered.count(1)).toBe(2);
      expect(filtered.count(2)).toBe(0);
      expect(filtered.count(3)).toBe(3);
      expect(filtered.size).toBe(5);
    });

    it('filter(): returns empty set when nothing matches', () => {
      const ms = new TreeMultiSet([1, 2, 3]);
      const filtered = ms.filter((key, count) => count > 10);
      expect(filtered.isEmpty()).toBe(true);
    });

    /**
     * @example
     * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
     * const total = ms.reduce((acc, key, count) => acc + count, 0);
     * // 6
     */
    it('reduce(): accumulates over distinct keys with counts', () => {
      const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
      const total = ms.reduce((acc, key, count) => acc + count, 0);
      expect(total).toBe(6);

      const sum = ms.reduce((acc, key, count) => acc + key * count, 0);
      expect(sum).toBe(1*2 + 2*1 + 3*3);  // 2 + 2 + 9 = 13
    });

    /**
     * @example
     * const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
     * const mapped = ms.map((key, count) => [key * 10, count]);
     * // TreeMultiSet { 10: 2, 20: 1, 30: 3 }
     */
    it('map(): transforms keys and counts', () => {
      const ms = new TreeMultiSet([1, 1, 2, 3, 3, 3]);
      const mapped = ms.map((key, count) => [key * 10, count]);
      expect(mapped.count(10)).toBe(2);
      expect(mapped.count(20)).toBe(1);
      expect(mapped.count(30)).toBe(3);
      expect(mapped.size).toBe(6);
    });

    /**
     * @example
     * const ms = new TreeMultiSet([1, 2, 3]);  // each count=1
     * const merged = ms.map((key, count) => [key % 2, count]);
     * // 1%2=1, 2%2=0, 3%2=1 → { 0: 1, 1: 2 } (counts merged)
     */
    it('map(): merges counts when keys collide', () => {
      const ms = new TreeMultiSet([1, 2, 3]);
      const merged = ms.map((key, count) => [key % 2, count]);
      expect(merged.count(0)).toBe(1);  // from 2
      expect(merged.count(1)).toBe(2);  // from 1 + 3
      expect(merged.size).toBe(3);
    });

    it('map(): transforms counts too', () => {
      const ms = new TreeMultiSet([1, 1, 2]);  // { 1: 2, 2: 1 }
      const doubled = ms.map((key, count) => [key, count * 2]);
      expect(doubled.count(1)).toBe(4);
      expect(doubled.count(2)).toBe(2);
      expect(doubled.size).toBe(6);
    });

    it('map(): with custom comparator for new type', () => {
      const ms = new TreeMultiSet([1, 2, 3]);
      const mapped = ms.map(
        (key, count) => [String(key), count],
        { comparator: (a, b) => a.localeCompare(b) }
      );
      expect(mapped.count('1')).toBe(1);
      expect(mapped.count('2')).toBe(1);
      expect(mapped.count('3')).toBe(1);
      expect([...mapped.keysDistinct()]).toEqual(['1', '2', '3']);
    });

    /**
     * @example
     * const ms = new TreeMultiSet([1, 1, 2]);
     * const copy = ms.clone();
     * copy.add(3);
     * ms.has(3);  // false (original unchanged)
     */
    it('clone(): creates independent copy', () => {
      const ms = new TreeMultiSet([1, 1, 2]);
      const copy = ms.clone();

      expect(copy.size).toBe(3);
      expect(copy.count(1)).toBe(2);
      expect(copy.count(2)).toBe(1);

      copy.add(3);
      expect(copy.has(3)).toBe(true);
      expect(ms.has(3)).toBe(false);  // original unchanged
    });
  });

  describe('Tree utilities', () => {
    /**
     * @example
     * const ms = new TreeMultiSet([10, 20, 30, 40, 50]);
     * const range = ms.rangeSearch([20, 40]);
     * // [20, 30, 40]
     */
    it('rangeSearch(): returns keys in range', () => {
      const ms = new TreeMultiSet([10, 20, 30, 40, 50]);
      const range = ms.rangeSearch([15, 45]);
      expect(range).toEqual([20, 30, 40]);
    });

    it('rangeSearch(): with callback', () => {
      const ms = new TreeMultiSet([10, 20, 30, 40, 50]);
      const range = ms.rangeSearch([15, 45], key => key * 2);
      expect(range).toEqual([40, 60, 80]);
    });

    it('rangeSearch(): empty result', () => {
      const ms = new TreeMultiSet([10, 20, 30]);
      const range = ms.rangeSearch([100, 200]);
      expect(range).toEqual([]);
    });

    it('print(): does not throw', () => {
      const ms = new TreeMultiSet([1, 2, 3]);
      expect(() => ms.print()).not.toThrow();
    });

    it('print(): works on empty set', () => {
      const ms = new TreeMultiSet<number>();
      expect(() => ms.print()).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('add with n=0 returns false and does not change set', () => {
      const ms = new TreeMultiSet<number>();
      expect(ms.add(1, 0)).toBe(false);
      expect(ms.size).toBe(0);
    });

    it('delete with n=0 returns false', () => {
      const ms = new TreeMultiSet([1, 1]);
      expect(ms.delete(1, 0)).toBe(false);
      expect(ms.count(1)).toBe(2);
    });

    it('delete more than count removes all', () => {
      const ms = new TreeMultiSet([1, 1]);
      expect(ms.delete(1, 10)).toBe(true);
      expect(ms.count(1)).toBe(0);
      expect(ms.has(1)).toBe(false);
    });

    it('deleteAll on non-existent key returns false', () => {
      const ms = new TreeMultiSet([1]);
      expect(ms.deleteAll(999)).toBe(false);
    });

    it('delete on non-existent key returns false', () => {
      const ms = new TreeMultiSet([1]);
      expect(ms.delete(999)).toBe(false);
    });

    it('isEmpty() reflects state correctly', () => {
      const ms = new TreeMultiSet<number>();
      expect(ms.isEmpty()).toBe(true);
      ms.add(1);
      expect(ms.isEmpty()).toBe(false);
      ms.delete(1);
      expect(ms.isEmpty()).toBe(true);
    });

    it('works with string keys', () => {
      const ms = new TreeMultiSet(['b', 'a', 'b', 'c']);
      expect([...ms.keysDistinct()]).toEqual(['a', 'b', 'c']);
      expect(ms.count('b')).toBe(2);
      expect(ms.first()).toBe('a');
      expect(ms.last()).toBe('c');
    });

    it('works with Date keys', () => {
      const d1 = new Date('2020-01-01');
      const d2 = new Date('2021-01-01');
      const d3 = new Date('2022-01-01');
      const ms = new TreeMultiSet([d2, d1, d3, d1]);
      expect(ms.count(d1)).toBe(2);
      expect(ms.first()).toEqual(d1);
      expect(ms.last()).toEqual(d3);
    });

    it('rejects NaN', () => {
      const ms = new TreeMultiSet<number>();
      expect(() => ms.add(NaN)).toThrow(TypeError);
    });

    it('rejects invalid Date', () => {
      const ms = new TreeMultiSet<Date>();
      expect(() => ms.add(new Date('invalid'))).toThrow(TypeError);
    });

    it('custom comparator bypasses type validation', () => {
      const ms = new TreeMultiSet<{ id: number }>([], {
        comparator: (a, b) => a.id - b.id
      });
      ms.add({ id: 1 });
      ms.add({ id: 2 });
      ms.add({ id: 1 });
      expect(ms.distinctSize).toBe(2);
      expect(ms.size).toBe(3);
    });

    it('rejects non-primitive types without comparator', () => {
      const ms = new TreeMultiSet<{ id: number }>();
      expect(() => ms.add({ id: 1 })).toThrow(TypeError);
      expect(() => ms.add({ id: 1 })).toThrow('comparator is required');
    });

    it('comparator getter returns the comparator', () => {
      const customComparator = (a: number, b: number) => b - a;
      const ms = new TreeMultiSet<number>([], { comparator: customComparator });
      expect(ms.comparator).toBe(customComparator);
    });

    it('filter() with custom comparator preserves it', () => {
      const customComparator = (a: number, b: number) => b - a;  // descending
      const ms = new TreeMultiSet<number>([3, 1, 2], { comparator: customComparator });
      expect([...ms.keysDistinct()]).toEqual([3, 2, 1]);  // descending order

      const filtered = ms.filter((k, _c) => k >= 2);
      expect([...filtered.keysDistinct()]).toEqual([3, 2]);  // still descending
    });

    it('clone() with custom comparator preserves it', () => {
      const customComparator = (a: number, b: number) => b - a;  // descending
      const ms = new TreeMultiSet<number>([3, 1, 2], { comparator: customComparator });
      const copy = ms.clone();
      expect([...copy.keysDistinct()]).toEqual([3, 2, 1]);  // still descending
    });

    it('map() with custom comparator on source', () => {
      const customComparator = (a: number, b: number) => b - a;  // descending
      const ms = new TreeMultiSet<number>([3, 1, 2], { comparator: customComparator });
      const mapped = ms.map((k, c) => [k * 10, c]);  // default comparator for result
      expect([...mapped.keysDistinct()]).toEqual([10, 20, 30]);  // ascending (default)
    });

    it('constructor with iterable initializes correctly', () => {
      const ms = new TreeMultiSet([5, 3, 5, 1, 3, 5]);
      expect(ms.size).toBe(6);
      expect(ms.distinctSize).toBe(3);
      expect(ms.count(5)).toBe(3);
      expect(ms.count(3)).toBe(2);
      expect(ms.count(1)).toBe(1);
    });
  });
});
