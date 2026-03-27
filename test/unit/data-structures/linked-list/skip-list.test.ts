import { SkipList } from '../../../../src';

describe('classic use', () => {
  it('@example [SkipList.set] In-memory sorted key-value store', () => {
    const store = new SkipList<number, string>();

    store.set(3, 'three');
    store.set(1, 'one');
    store.set(5, 'five');
    store.set(2, 'two');

    expect(store.get(3)).toBe('three');
    expect(store.get(1)).toBe('one');
    expect(store.get(5)).toBe('five');

    // Update existing key
    store.set(3, 'THREE');
    expect(store.get(3)).toBe('THREE');
  });

  it('@example [SkipList.delete] Fast lookup with deletion', () => {
    const cache = new SkipList<string, number>();

    cache.set('alpha', 1);
    cache.set('beta', 2);
    cache.set('gamma', 3);

    expect(cache.has('beta')).toBe(true);
    cache.delete('beta');
    expect(cache.has('beta')).toBe(false);
    expect(cache.size).toBe(2);
  });

  it('@example [SkipList.get] Building a sorted index', () => {
    type Product = { id: number; name: string; price: number };
    const products: Product[] = [
      { id: 1, name: 'Widget', price: 25 },
      { id: 2, name: 'Gadget', price: 50 },
      { id: 3, name: 'Doohickey', price: 15 }
    ];

    const index = new SkipList<number, Product>(products as any, {
      toEntryFn: (p: any) => [p.price, p]
    });

    // Iterate in sorted order by price
    const names = [...index.values()].map(p => p!.name);
    expect(names).toEqual(['Doohickey', 'Widget', 'Gadget']);

    // Range search: products between $20 and $60
    const range = index.rangeSearch([20, 60]);
    expect(range.map(([, p]) => p!.name)).toEqual(['Widget', 'Gadget']);
  });

  it('@example [SkipList.has] Check key existence', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [3, 'c'], [5, 'e']]);
    expect(sl.has(3)).toBe(true);
    expect(sl.has(4)).toBe(false);
  });

  it('@example [SkipList.first] Access the minimum entry', () => {
    const sl = new SkipList<number, string>([[5, 'e'], [1, 'a'], [3, 'c']]);
    expect(sl.first()).toEqual([1, 'a']);
  });

  it('@example [SkipList.last] Access the maximum entry', () => {
    const sl = new SkipList<number, string>([[5, 'e'], [1, 'a'], [3, 'c']]);
    expect(sl.last()).toEqual([5, 'e']);
  });

  it('@example [SkipList.ceiling] Least entry ≥ key', () => {
    const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
    expect(sl.ceiling(15)).toEqual([20, 'b']);
    expect(sl.ceiling(20)).toEqual([20, 'b']);
  });

  it('@example [SkipList.floor] Greatest entry ≤ key', () => {
    const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
    expect(sl.floor(25)).toEqual([20, 'b']);
    expect(sl.floor(5)).toBeUndefined();
  });

  it('@example [SkipList.rangeSearch] Find entries in a range', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
    const result = sl.rangeSearch([2, 4]);
    expect(result).toEqual([[2, 'b'], [3, 'c'], [4, 'd']]);
  });
});

describe('SkipList core CRUD', () => {
  let sl: SkipList<number, string>;

  beforeEach(() => {
    sl = new SkipList<number, string>();
    sl.set(10, 'ten');
    sl.set(20, 'twenty');
    sl.set(30, 'thirty');
    sl.set(40, 'forty');
    sl.set(50, 'fifty');
  });

  it('should set and get values', () => {
    expect(sl.get(10)).toBe('ten');
    expect(sl.get(30)).toBe('thirty');
    expect(sl.get(50)).toBe('fifty');
  });

  it('should return undefined for non-existent keys', () => {
    expect(sl.get(15)).toBeUndefined();
    expect(sl.get(0)).toBeUndefined();
    expect(sl.get(100)).toBeUndefined();
  });

  it('should update value for existing key', () => {
    sl.set(20, 'TWENTY');
    expect(sl.get(20)).toBe('TWENTY');
    expect(sl.size).toBe(5); // no duplicate
  });

  it('should report has correctly', () => {
    expect(sl.has(10)).toBe(true);
    expect(sl.has(15)).toBe(false);
  });

  it('should delete existing keys', () => {
    expect(sl.delete(30)).toBe(true);
    expect(sl.get(30)).toBeUndefined();
    expect(sl.size).toBe(4);
  });

  it('should return false when deleting non-existent key', () => {
    expect(sl.delete(99)).toBe(false);
    expect(sl.size).toBe(5);
  });

  it('should track size correctly', () => {
    expect(sl.size).toBe(5);
    sl.set(60, 'sixty');
    expect(sl.size).toBe(6);
    sl.set(60, 'SIXTY'); // update, not insert
    expect(sl.size).toBe(6);
    sl.delete(10);
    expect(sl.size).toBe(5);
  });

  it('should support chaining via set', () => {
    const result = sl.set(100, 'hundred').set(200, 'two hundred');
    expect(result).toBe(sl);
    expect(sl.size).toBe(7);
  });
});

describe('SkipList size & lifecycle', () => {
  it('isEmpty should work', () => {
    const sl = new SkipList<number, string>();
    expect(sl.isEmpty()).toBe(true);
    sl.set(1, 'a');
    expect(sl.isEmpty()).toBe(false);
  });

  it('clear should reset everything', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    expect(sl.size).toBe(3);
    sl.clear();
    expect(sl.size).toBe(0);
    expect(sl.isEmpty()).toBe(true);
    expect(sl.get(1)).toBeUndefined();
  });

  it('clone should create independent copy', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    const copy = sl.clone();

    expect(copy.size).toBe(3);
    expect(copy.get(2)).toBe('b');

    // Modify clone, original unchanged
    copy.set(4, 'd');
    copy.delete(1);
    expect(copy.size).toBe(3);
    expect(sl.size).toBe(3);
    expect(sl.has(1)).toBe(true);
    expect(sl.has(4)).toBe(false);
  });
});

describe('SkipList navigation', () => {
  let sl: SkipList<number, string>;

  beforeEach(() => {
    sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c'], [40, 'd'], [50, 'e']]);
  });

  it('first and last', () => {
    expect(sl.first()).toEqual([10, 'a']);
    expect(sl.last()).toEqual([50, 'e']);
  });

  it('first and last on empty', () => {
    const empty = new SkipList<number, string>();
    expect(empty.first()).toBeUndefined();
    expect(empty.last()).toBeUndefined();
  });

  it('pollFirst removes and returns first', () => {
    const entry = sl.pollFirst();
    expect(entry).toEqual([10, 'a']);
    expect(sl.size).toBe(4);
    expect(sl.first()).toEqual([20, 'b']);
  });

  it('pollLast removes and returns last', () => {
    const entry = sl.pollLast();
    expect(entry).toEqual([50, 'e']);
    expect(sl.size).toBe(4);
    expect(sl.last()).toEqual([40, 'd']);
  });

  it('pollFirst on empty returns undefined', () => {
    const empty = new SkipList<number, string>();
    expect(empty.pollFirst()).toBeUndefined();
  });

  it('pollLast on empty returns undefined', () => {
    const empty = new SkipList<number, string>();
    expect(empty.pollLast()).toBeUndefined();
  });

  it('ceiling', () => {
    expect(sl.ceiling(20)).toEqual([20, 'b']); // exact match
    expect(sl.ceiling(25)).toEqual([30, 'c']); // next higher
    expect(sl.ceiling(5)).toEqual([10, 'a']);   // before first
    expect(sl.ceiling(55)).toBeUndefined();     // beyond last
  });

  it('floor', () => {
    expect(sl.floor(20)).toEqual([20, 'b']); // exact match
    expect(sl.floor(25)).toEqual([20, 'b']); // next lower
    expect(sl.floor(50)).toEqual([50, 'e']); // exact last
    expect(sl.floor(5)).toBeUndefined();     // before first
  });

  it('higher', () => {
    expect(sl.higher(20)).toEqual([30, 'c']); // strictly greater
    expect(sl.higher(25)).toEqual([30, 'c']); // between keys
    expect(sl.higher(50)).toBeUndefined();    // nothing higher
    expect(sl.higher(5)).toEqual([10, 'a']);   // before first
  });

  it('lower', () => {
    expect(sl.lower(20)).toEqual([10, 'a']); // strictly less
    expect(sl.lower(25)).toEqual([20, 'b']); // between keys
    expect(sl.lower(10)).toBeUndefined();    // nothing lower
    expect(sl.lower(55)).toEqual([50, 'e']); // beyond last
  });

  it('rangeSearch with defaults (inclusive)', () => {
    const result = sl.rangeSearch([20, 40]);
    expect(result).toEqual([[20, 'b'], [30, 'c'], [40, 'd']]);
  });

  it('rangeSearch with exclusive bounds', () => {
    const result = sl.rangeSearch([20, 40], { lowInclusive: false, highInclusive: false });
    expect(result).toEqual([[30, 'c']]);
  });

  it('rangeSearch with mixed bounds', () => {
    expect(sl.rangeSearch([20, 40], { lowInclusive: false })).toEqual([[30, 'c'], [40, 'd']]);
    expect(sl.rangeSearch([20, 40], { highInclusive: false })).toEqual([[20, 'b'], [30, 'c']]);
  });

  it('rangeSearch empty result', () => {
    expect(sl.rangeSearch([22, 28])).toEqual([]);
  });
});

describe('SkipList iteration', () => {
  let sl: SkipList<number, string>;

  beforeEach(() => {
    sl = new SkipList<number, string>([[3, 'c'], [1, 'a'], [5, 'e'], [2, 'b'], [4, 'd']]);
  });

  it('should iterate in sorted order with for...of', () => {
    const entries: [number, string | undefined][] = [];
    for (const entry of sl) entries.push(entry);
    expect(entries).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
  });

  it('should spread into array', () => {
    const arr = [...sl];
    expect(arr).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
  });

  it('should work with Array.from', () => {
    const arr = Array.from(sl);
    expect(arr).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
  });

  it('keys should return keys in sorted order', () => {
    expect([...sl.keys()]).toEqual([1, 2, 3, 4, 5]);
  });

  it('values should return values in sorted order', () => {
    expect([...sl.values()]).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('entries should return entries in sorted order', () => {
    const entries = [...sl.entries()];
    expect(entries).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
  });

  it('forEach should visit entries in sorted order', () => {
    const visited: [number, string | undefined][] = [];
    sl.forEach((v, k) => visited.push([k, v]));
    expect(visited).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
  });

  it('toArray should return sorted entries', () => {
    expect(sl.toArray()).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
  });
});

describe('SkipList functional', () => {
  let sl: SkipList<number, number>;

  beforeEach(() => {
    sl = new SkipList<number, number>([[1, 10], [2, 20], [3, 30], [4, 40], [5, 50]]);
  });

  it('map should transform entries', () => {
    const mapped = sl.map((v, k) => [k * 10, (v ?? 0) * 2]);
    expect(mapped.toArray()).toEqual([[10, 20], [20, 40], [30, 60], [40, 80], [50, 100]]);
  });

  it('filter should select entries', () => {
    const filtered = sl.filter((v) => (v ?? 0) > 20);
    expect(filtered.toArray()).toEqual([[3, 30], [4, 40], [5, 50]]);
    expect(filtered.size).toBe(3);
  });

  it('reduce should accumulate', () => {
    const sum = sl.reduce((acc, v) => acc + (v ?? 0), 0);
    expect(sum).toBe(150);
  });

  it('every should check all entries', () => {
    expect(sl.every((v) => (v ?? 0) > 0)).toBe(true);
    expect(sl.every((v) => (v ?? 0) > 20)).toBe(false);
  });

  it('some should check at least one', () => {
    expect(sl.some((v) => (v ?? 0) === 30)).toBe(true);
    expect(sl.some((v) => (v ?? 0) === 99)).toBe(false);
  });

  it('find should return first matching entry', () => {
    expect(sl.find((v) => (v ?? 0) > 20)).toEqual([3, 30]);
    expect(sl.find((v) => (v ?? 0) > 100)).toBeUndefined();
  });
});

describe('SkipList constructor options', () => {
  it('should accept custom comparator', () => {
    // Reverse order
    const sl = new SkipList<number, string>([[1, 'a'], [3, 'c'], [2, 'b']], {
      comparator: (a, b) => b - a
    });
    expect([...sl.keys()]).toEqual([3, 2, 1]);
  });

  it('should accept toEntryFn', () => {
    type User = { id: number; name: string };
    const users: User[] = [
      { id: 3, name: 'Charlie' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
    const sl = new SkipList<number, User, User>(users, {
      toEntryFn: u => [u.id, u]
    });
    expect(sl.size).toBe(3);
    expect(sl.get(1)?.name).toBe('Alice');
    expect([...sl.keys()]).toEqual([1, 2, 3]);
  });

  it('should accept maxLevel and probability', () => {
    const sl = new SkipList<number, string>([], { maxLevel: 8, probability: 0.25 });
    expect(sl.maxLevel).toBe(8);
    expect(sl.probability).toBe(0.25);
  });

  it('should throw on invalid entries', () => {
    expect(() => new SkipList([42 as any])).toThrow();
  });

  it('should support string keys with default comparator', () => {
    const sl = new SkipList<string, number>([['banana', 2], ['apple', 1], ['cherry', 3]]);
    expect([...sl.keys()]).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should support Date keys with default comparator', () => {
    const d1 = new Date('2020-01-01');
    const d2 = new Date('2021-01-01');
    const d3 = new Date('2019-01-01');
    const sl = new SkipList<Date, string>([[d1, 'a'], [d2, 'b'], [d3, 'c']]);
    expect([...sl.keys()]).toEqual([d3, d1, d2]);
  });
});

describe('SkipList edge cases', () => {
  it('should handle single element', () => {
    const sl = new SkipList<number, string>([[1, 'a']]);
    expect(sl.first()).toEqual([1, 'a']);
    expect(sl.last()).toEqual([1, 'a']);
    expect(sl.size).toBe(1);
    sl.delete(1);
    expect(sl.isEmpty()).toBe(true);
  });

  it('should handle large number of insertions', () => {
    const sl = new SkipList<number, number>();
    for (let i = 0; i < 1000; i++) {
      sl.set(i, i * 10);
    }
    expect(sl.size).toBe(1000);
    expect(sl.get(500)).toBe(5000);
    expect(sl.first()).toEqual([0, 0]);
    expect(sl.last()).toEqual([999, 9990]);
  });

  it('should handle delete all elements', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    sl.delete(1);
    sl.delete(2);
    sl.delete(3);
    expect(sl.isEmpty()).toBe(true);
    expect(sl.first()).toBeUndefined();
    expect(sl.last()).toBeUndefined();
  });

  it('clone preserves custom comparator', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']], {
      comparator: (a, b) => b - a // reverse
    });
    const cloned = sl.clone();
    cloned.set(3, 'c');
    expect([...cloned.keys()]).toEqual([3, 2, 1]); // still reverse
  });

  it('@example [SkipList.clone] Create independent copy', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    const copy = sl.clone();
    copy.delete(1);
    expect(sl.has(1)).toBe(true);
  });

  it('@example [SkipList.clear] Remove all entries', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    sl.clear();
    expect(sl.isEmpty()).toBe(true);
  });

  it('@example [SkipList.isEmpty] Check if empty', () => {
    const sl = new SkipList<number, string>();
    expect(sl.isEmpty()).toBe(true);
  });

  it('@example [SkipList.entries] Iterate key-value pairs', () => {
    const sl = new SkipList<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
    expect([...sl.entries()]).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('@example [SkipList.keys] Get all keys sorted', () => {
    const sl = new SkipList<number, string>([[3, 'c'], [1, 'a']]);
    expect([...sl.keys()]).toEqual([1, 3]);
  });

  it('@example [SkipList.values] Get all values', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    expect([...sl.values()]).toEqual(['a', 'b']);
  });

  it('@example [SkipList.every] Test all entries', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    expect(sl.every((v, k) => k > 0)).toBe(true);
  });

  it('@example [SkipList.some] Test any entry', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    expect(sl.some((v, k) => k === 2)).toBe(true);
  });

  it('@example [SkipList.find] Find matching entry', () => {
    const sl = new SkipList<number, string>([[1, 'alpha'], [2, 'beta']]);
    const found = sl.find(v => v === 'beta');
    expect(found?.[0]).toBe(2);
    expect(found?.[1]).toBe('beta');
  });

  it('@example [SkipList.forEach] Iterate entries', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    const keys: number[] = [];
    sl.forEach((v, k) => keys.push(k));
    expect(keys).toEqual([1, 2]);
  });

  it('@example [SkipList.filter] Filter entries', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    const result = sl.filter((v, k) => k > 1);
    expect(result.size).toBe(2);
  });

  it('@example [SkipList.map] Transform entries', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    const mapped = sl.map((v, k) => [k, v?.toUpperCase()] as [number, string]);
    expect([...mapped.values()]).toEqual(['A', 'B']);
  });

  it('@example [SkipList.reduce] Aggregate entries', () => {
    const sl = new SkipList<number, number>([[1, 10], [2, 20]]);
    const sum = sl.reduce((acc, v) => acc + (v ?? 0), 0);
    expect(sum).toBe(30);
  });

  it('@example [SkipList.toArray] Convert to array', () => {
    const sl = new SkipList<number, string>([[2, 'b'], [1, 'a']]);
    expect(sl.toArray()).toEqual([[1, 'a'], [2, 'b']]);
  });

  it('@example [SkipList.higher] Strictly greater entry', () => {
    const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
    expect(sl.higher(15)).toEqual([20, 'b']);
    expect(sl.higher(30)).toBeUndefined();
  });

  it('@example [SkipList.lower] Strictly less entry', () => {
    const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
    expect(sl.lower(25)).toEqual([20, 'b']);
    expect(sl.lower(10)).toBeUndefined();
  });

  it('@example [SkipList.pollFirst] Remove and return smallest', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    expect(sl.pollFirst()).toEqual([1, 'a']);
    expect(sl.size).toBe(2);
  });

  it('@example [SkipList.pollLast] Remove and return largest', () => {
    const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    expect(sl.pollLast()).toEqual([3, 'c']);
    expect(sl.size).toBe(2);
  });

  it('@example [SkipList.print] Display skip list', () => {
    const sl = new SkipList<number, string>([[1, 'a']]);
    expect(() => sl.print()).not.toThrow();
  });
});
