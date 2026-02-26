import { TreeMap } from '../../../../src';

describe('TreeMap (RedBlackTree-backed, no node exposure)', () => {
  test('basic operations: set/get/has/delete/size/isEmpty/clear', () => {
    const m = new TreeMap<number, string>();
    expect(m.isEmpty()).toBe(true);
    expect(m.size).toBe(0);

    expect(m.set(2, 'b')).toBe(m);
    expect(m.set(1, 'a')).toBe(m);
    expect(m.set(3, 'c')).toBe(m);

    expect(m.size).toBe(3);
    expect(m.isEmpty()).toBe(false);

    expect(m.get(2)).toBe('b');
    expect(m.has(2)).toBe(true);
    expect(m.has(999)).toBe(false);

    expect(m.delete(2)).toBe(true);
    expect(m.delete(2)).toBe(false);
    expect(m.get(2)).toBe(undefined);

    m.clear();
    expect(m.size).toBe(0);
    expect(m.isEmpty()).toBe(true);
  });

  test('iteration: keys/values/entries and ordering', () => {
    const m = new TreeMap<number, string>([
      [3, 'c'],
      [1, 'a'],
      [2, 'b']
    ]);

    expect([...m.keys()]).toEqual([1, 2, 3]);
    expect([...m.values()]).toEqual(['a', 'b', 'c']);
    expect([...m.entries()]).toEqual<([number, string | undefined])[]>([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);
    expect([...m]).toEqual<([number, string | undefined])[]>([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);

    const seen: Array<[number, string | undefined]> = [];
    const ctx = { tag: 'ctx' };
    m.forEach(function (this: typeof ctx, v, k) {
      // verify thisArg binding
      expect(this).toBe(ctx);
      seen.push([k, v]);
    }, ctx);
    expect(seen).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);
  });

  test('allows undefined values; has() distinguishes missing vs present-undefined', () => {
    const m = new TreeMap<number, undefined>();
    m.set(1, undefined);
    expect(m.has(1)).toBe(true);
    expect(m.get(1)).toBe(undefined);
    expect(m.has(2)).toBe(false);
  });

  test('constructor throws TypeError for invalid entries (native Map behavior)', () => {
    expect(() => new TreeMap([['a', 1], ['b'] as unknown as [string, number]])).toThrow(TypeError);
    expect(() => new TreeMap([123 as unknown as [string, number]])).toThrow(TypeError);
  });

  test('constructor throws when encountering invalid keys under default comparator', () => {
    expect(() => new TreeMap<number, number>([[Number.NaN, 1]])).toThrow(TypeError);

    const bad = new Date('not-a-date');
    expect(() => new TreeMap<Date, number>([[bad, 1]])).toThrow(TypeError);

    type Obj = { n: number };
    expect(() => new TreeMap<Obj, number>([[{ n: 1 }, 1]])).toThrow(TypeError);
  });

  test('default comparator: NaN throws (even on empty tree)', () => {
    const m = new TreeMap<number, number>();
    expect(() => m.set(Number.NaN, 1)).toThrow(TypeError);
    expect(() => m.get(Number.NaN)).toThrow(TypeError);
    expect(() => m.has(Number.NaN)).toThrow(TypeError);
    expect(() => m.delete(Number.NaN)).toThrow(TypeError);
    expect(() => m.ceiling(Number.NaN)).toThrow(TypeError);
  });

  test('default comparator: -0 and 0 are the same key', () => {
    const m = new TreeMap<number, string>();
    m.set(-0, 'z');
    expect(m.size).toBe(1);
    expect(m.has(0)).toBe(true);
    expect(m.get(0)).toBe('z');

    m.set(0, 'zz');
    expect(m.size).toBe(1);
    expect(m.get(-0)).toBe('zz');
  });

  test('default comparator: Date supported; invalid Date throws', () => {
    const d1 = new Date('2020-01-01T00:00:00.000Z');
    const d2 = new Date('2021-01-01T00:00:00.000Z');

    const m = new TreeMap<Date, number>([
      [d2, 2],
      [d1, 1]
    ]);

    expect([...m.keys()]).toEqual([d1, d2]);
    expect(m.first()).toEqual<[Date, number | undefined]>([d1, 1]);

    const bad = new Date('not-a-date');
    const m2 = new TreeMap<Date, number>();
    expect(() => m2.set(bad, 1)).toThrow(TypeError);
  });

  test('default comparator: string key ordering is supported', () => {
    const m = new TreeMap<string, number>([
      ['b', 2],
      ['a', 1],
      ['c', 3]
    ]);
    expect([...m.keys()]).toEqual(['a', 'b', 'c']);
    expect(m.ceiling('bb')).toEqual(['c', 3]);
  });

  test('default comparator: non-primitive/non-Date requires custom comparator', () => {
    type Obj = { n: number };
    const o1: Obj = { n: 1 };

    expect(() => new TreeMap<Obj, number>([[o1, 1]])).toThrow(TypeError);

    const byN = (a: Obj, b: Obj) => a.n - b.n;
    const m = new TreeMap<Obj, number>([[o1, 1]], { comparator: byN });
    expect(m.size).toBe(1);
  });

  test('createDefaultComparator throws for unsupported key types', () => {
    const cmp = TreeMap.createDefaultComparator<object>();
    expect(() => cmp({} as unknown as object, {} as unknown as object)).toThrow(TypeError);
  });

  test('navigable operations: first/last/pollFirst/pollLast', () => {
    const m = new TreeMap<number, string>();
    expect(m.first()).toBe(undefined);
    expect(m.last()).toBe(undefined);
    expect(m.pollFirst()).toBe(undefined);
    expect(m.pollLast()).toBe(undefined);

    m.set(2, 'b').set(1, 'a').set(3, 'c');
    expect(m.first()).toEqual([1, 'a']);
    expect(m.last()).toEqual([3, 'c']);

    expect(m.pollFirst()).toEqual([1, 'a']);
    expect([...m.keys()]).toEqual([2, 3]);

    expect(m.pollLast()).toEqual([3, 'c']);
    expect([...m.keys()]).toEqual([2]);
  });

  test('navigable operations: ceiling/floor/higher/lower (tuples)', () => {
    const m = new TreeMap<number, string>([
      [1, 'a'],
      [3, 'c'],
      [5, 'e']
    ]);

    expect(m.ceiling(0)).toEqual([1, 'a']);
    expect(m.ceiling(2)).toEqual([3, 'c']);
    expect(m.ceiling(6)).toBe(undefined);

    expect(m.floor(0)).toBe(undefined);
    expect(m.floor(2)).toEqual([1, 'a']);
    expect(m.floor(6)).toEqual([5, 'e']);

    expect(m.higher(1)).toEqual([3, 'c']);
    expect(m.higher(5)).toBe(undefined);

    expect(m.lower(1)).toBe(undefined);
    expect(m.lower(5)).toEqual([3, 'c']);
  });

  test('rangeSearch supports inclusive/exclusive bounds (tuples)', () => {
    const m = new TreeMap<number, string>([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
      [4, 'd'],
      [5, 'e']
    ]);

    expect(m.rangeSearch([2, 4])).toEqual([
      [2, 'b'],
      [3, 'c'],
      [4, 'd']
    ]);

    expect(m.rangeSearch([2, 4], { lowInclusive: true, highInclusive: false })).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);

    expect(m.rangeSearch([2, 4], { lowInclusive: false, highInclusive: true })).toEqual([
      [3, 'c'],
      [4, 'd']
    ]);

    expect(m.rangeSearch([2, 4], { lowInclusive: false, highInclusive: false })).toEqual([[3, 'c']]);
  });

  test('map/filter/reduce/every/some/find/toArray/print', () => {
    const m = new TreeMap<number, string>([
      [3, 'c'],
      [1, 'a'],
      [2, 'b']
    ]);

    expect(m.map((v, k) => [k, `${k}:${v ?? 'u'}`] as [number, string]).toArray()).toEqual<
      ([number, string | undefined])[]
    >([
      [1, '1:a'],
      [2, '2:b'],
      [3, '3:c']
    ]);

    const ctx = { prefix: 'x' };
    expect(
      m.map(function (this: typeof ctx, v, k) {
        return [k, `${this.prefix}${k}:${v ?? 'u'}`] as [number, string];
      }, {}, ctx).toArray()
    ).toEqual<([number, string | undefined])[]>([
      [1, 'x1:a'],
      [2, 'x2:b'],
      [3, 'x3:c']
    ]);

    expect(m.filter((v, k) => k >= 2).toArray()).toEqual<([number, string | undefined])[]>([
      [2, 'b'],
      [3, 'c']
    ]);
    expect(m.reduce((acc, v) => acc + (v ? v.length : 0), 0)).toBe(3);

    expect(m.every((v, k) => k >= 1 && v !== undefined)).toBe(true);
    expect(m.every((v, k) => k >= 2)).toBe(false);

    expect(m.some((v, k) => k === 2)).toBe(true);
    expect(m.some((v, k) => k === 999)).toBe(false);

    expect(m.find((v, k) => k >= 2)).toEqual<[number, string | undefined]>([2, 'b']);
    expect(m.find((v, k) => k >= 999)).toBe(undefined);

    expect(m.toArray()).toEqual<([number, string | undefined])[]>([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);

    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    m.print();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('toEntryFn: construct from raw objects', () => {
    interface User {
      id: number;
      name: string;
      age: number;
    }

    const users: User[] = [
      { id: 3, name: 'Charlie', age: 35 },
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 }
    ];

    const m = new TreeMap<number, User>(users, {
      toEntryFn: ((u: User) => [u.id, u]) as (raw: unknown) => [number, User]
    });

    expect(m.size).toBe(3);
    expect([...m.keys()]).toEqual([1, 2, 3]); // sorted by key
    expect(m.get(1)?.name).toBe('Alice');
    expect(m.get(2)?.name).toBe('Bob');
    expect(m.get(3)?.name).toBe('Charlie');
  });

  test('toEntryFn: with custom comparator', () => {
    interface Product {
      sku: string;
      price: number;
    }

    const products: Product[] = [
      { sku: 'B001', price: 29.99 },
      { sku: 'A001', price: 19.99 },
      { sku: 'C001', price: 39.99 }
    ];

    const m = new TreeMap<string, number>(products, {
      toEntryFn: ((p: Product) => [p.sku, p.price]) as (raw: unknown) => [string, number],
      comparator: (a, b) => a.localeCompare(b)
    });

    expect(m.size).toBe(3);
    expect([...m.keys()]).toEqual(['A001', 'B001', 'C001']);
    expect(m.get('A001')).toBe(19.99);
  });
});
