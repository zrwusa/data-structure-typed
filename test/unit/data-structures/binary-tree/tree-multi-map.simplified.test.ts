import { TreeMultiMap } from '../../../../src';

describe('classic use', () => {
  it('@example [TreeMultiMap.set] Multi-value dictionary for tag grouping', () => {
    const tags = new TreeMultiMap<string, string>([
      ['frontend', ['react', 'vue']],
      ['backend', ['node', 'python']]
    ]);

    expect(tags.get('frontend')).toEqual(['react', 'vue']);
    expect(tags.size).toBe(2);
    expect([...tags.keys()]).toEqual(['backend', 'frontend']); // sorted
  });

  it('@example [TreeMultiMap.get] Retrieve grouped values by key', () => {
    const scores = new TreeMultiMap<string, number>([
      ['Alice', [95, 88, 92]],
      ['Bob', [80, 85]]
    ]);

    expect(scores.get('Alice')).toEqual([95, 88, 92]);
    expect(scores.get('Unknown')).toBeUndefined();
  });

  it('@example [TreeMultiMap.has] Check key existence', () => {
    const mm = new TreeMultiMap<number, string>([
      [1, ['a']],
      [3, ['c']]
    ]);

    expect(mm.has(1)).toBe(true);
    expect(mm.has(2)).toBe(false);
  });

  it('@example [TreeMultiMap.delete] Remove a key and all its values', () => {
    const mm = new TreeMultiMap<number, string>([
      [1, ['a', 'b']],
      [2, ['c']],
      [3, ['d']]
    ]);

    mm.delete(2);
    expect(mm.has(2)).toBe(false);
    expect(mm.size).toBe(2);
  });

  it('@example [TreeMultiMap.first] Access the minimum entry', () => {
    const mm = new TreeMultiMap<number, string>([
      [5, ['e']],
      [1, ['a']],
      [3, ['c']]
    ]);

    expect(mm.first()).toEqual([1, ['a']]);
  });

  it('@example [TreeMultiMap.last] Access the maximum entry', () => {
    const mm = new TreeMultiMap<number, string>([
      [5, ['e']],
      [1, ['a']],
      [3, ['c']]
    ]);

    expect(mm.last()).toEqual([5, ['e']]);
  });

  it('@example [TreeMultiMap.ceiling] Least entry ≥ key', () => {
    const mm = new TreeMultiMap<number, string>([
      [10, ['a']],
      [20, ['b']],
      [30, ['c']]
    ]);

    expect(mm.ceiling(15)).toEqual([20, ['b']]);
    expect(mm.ceiling(20)).toEqual([20, ['b']]);
  });

  it('@example [TreeMultiMap.floor] Greatest entry ≤ key', () => {
    const mm = new TreeMultiMap<number, string>([
      [10, ['a']],
      [20, ['b']],
      [30, ['c']]
    ]);

    expect(mm.floor(25)).toEqual([20, ['b']]);
    expect(mm.floor(5)).toBeUndefined();
  });
});

describe('TreeMultiMap (Simplified API)', () => {
  describe('Core methods', () => {
    it('constructor initializes empty map', () => {
      const mm = new TreeMultiMap<number, string>();
      expect(mm.size).toBe(0);
      expect(mm.totalSize).toBe(0);
      expect(mm.isEmpty()).toBe(true);
    });

    it('constructor with entries', () => {
      const mm = new TreeMultiMap<number, string>([
        [1, ['a', 'b']],
        [2, ['c']]
      ]);
      expect(mm.size).toBe(2);
      expect(mm.totalSize).toBe(3);
      expect(mm.get(1)).toEqual(['a', 'b']);
      expect(mm.get(2)).toEqual(['c']);
    });

    it('add() appends value to bucket', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
      expect(mm.get(1)).toEqual(['a', 'b']);
      expect(mm.get(2)).toEqual(['c']);
    });

    it('set() works like add() for single values', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.set(1, 'a');
      mm.set(1, 'b');
      expect(mm.get(1)).toEqual(['a', 'b']);
    });

    it('set() with entry tuple', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.set([1, ['a', 'b']]);
      expect(mm.get(1)).toEqual(['a', 'b']);
    });

    it('has() checks if key exists', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      expect(mm.has(1)).toBe(true);
      expect(mm.has(2)).toBe(false);
    });

    it('count() returns bucket length', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect(mm.count(1)).toBe(2);
      expect(mm.count(2)).toBe(0);
    });

    it('delete() removes key and bucket', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect(mm.delete(1)).toBe(true);
      expect(mm.has(1)).toBe(false);
      expect(mm.delete(1)).toBe(false);
    });

    it('clear() removes all entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      mm.clear();
      expect(mm.size).toBe(0);
      expect(mm.isEmpty()).toBe(true);
    });

    it('get() returns live bucket reference', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      const bucket = mm.get(1)!;
      bucket.push('b');
      expect(mm.get(1)).toEqual(['a', 'b']);
    });
  });

  describe('Value-level operations', () => {
    it('hasEntry() checks if value exists in bucket', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect(mm.hasEntry(1, 'a')).toBe(true);
      expect(mm.hasEntry(1, 'c')).toBe(false);
    });

    it('deleteValue() removes first matching value', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(1, 'a');
      expect(mm.deleteValue(1, 'a')).toBe(true);
      expect(mm.get(1)).toEqual(['b', 'a']);
    });

    it('deleteValues() removes all matching values', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(1, 'a');
      expect(mm.deleteValues(1, 'a')).toBe(2);
      expect(mm.get(1)).toEqual(['b']);
    });

    it('deleteValue() auto-deletes key when bucket empty', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.deleteValue(1, 'a');
      expect(mm.has(1)).toBe(false);
    });
  });

  describe('Iteration', () => {
    it('[Symbol.iterator] yields bucket entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      expect([...mm]).toEqual([
        [1, ['a']],
        [2, ['b']]
      ]);
    });

    it('keys() yields keys in order', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(3, 'c');
      mm.add(1, 'a');
      mm.add(2, 'b');
      expect([...mm.keys()]).toEqual([1, 2, 3]);
    });

    it('values() yields buckets', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      expect([...mm.values()]).toEqual([['a'], ['b']]);
    });

    it('flatEntries() yields flat [K, V] pairs', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
      expect([...mm.flatEntries()]).toEqual([
        [1, 'a'],
        [1, 'b'],
        [2, 'c']
      ]);
    });

    it('entriesOf() yields entries for single key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
      expect([...mm.entriesOf(1)]).toEqual([
        [1, 'a'],
        [1, 'b']
      ]);
    });

    it('valuesOf() yields values for single key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect([...mm.valuesOf(1)]).toEqual(['a', 'b']);
    });
  });

  describe('Navigable methods (return [K, V[]])', () => {
    let mm: TreeMultiMap<number, string>;

    beforeEach(() => {
      mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
    });

    it('first() returns entry with smallest key', () => {
      expect(mm.first()).toEqual([10, ['a']]);
    });

    it('first() returns undefined on empty map', () => {
      expect(new TreeMultiMap<number, string>().first()).toBeUndefined();
    });

    it('last() returns entry with largest key', () => {
      expect(mm.last()).toEqual([30, ['c']]);
    });

    it('last() returns undefined on empty map', () => {
      expect(new TreeMultiMap<number, string>().last()).toBeUndefined();
    });

    it('pollFirst() removes and returns smallest entry', () => {
      expect(mm.pollFirst()).toEqual([10, ['a']]);
      expect(mm.has(10)).toBe(false);
      expect(mm.size).toBe(2);
    });

    it('pollFirst() returns undefined on empty map', () => {
      expect(new TreeMultiMap<number, string>().pollFirst()).toBeUndefined();
    });

    it('pollLast() removes and returns largest entry', () => {
      expect(mm.pollLast()).toEqual([30, ['c']]);
      expect(mm.has(30)).toBe(false);
      expect(mm.size).toBe(2);
    });

    it('pollLast() returns undefined on empty map', () => {
      expect(new TreeMultiMap<number, string>().pollLast()).toBeUndefined();
    });

    it('ceiling() returns smallest entry >= key', () => {
      expect(mm.ceiling(15)).toEqual([20, ['b']]);
      expect(mm.ceiling(20)).toEqual([20, ['b']]);
      expect(mm.ceiling(10)).toEqual([10, ['a']]);
      expect(mm.ceiling(35)).toBeUndefined();
    });

    it('floor() returns largest entry <= key', () => {
      expect(mm.floor(25)).toEqual([20, ['b']]);
      expect(mm.floor(20)).toEqual([20, ['b']]);
      expect(mm.floor(30)).toEqual([30, ['c']]);
      expect(mm.floor(5)).toBeUndefined();
    });

    it('higher() returns smallest entry > key', () => {
      expect(mm.higher(10)).toEqual([20, ['b']]);
      expect(mm.higher(15)).toEqual([20, ['b']]);
      expect(mm.higher(30)).toBeUndefined();
    });

    it('lower() returns largest entry < key', () => {
      expect(mm.lower(20)).toEqual([10, ['a']]);
      expect(mm.lower(15)).toEqual([10, ['a']]);
      expect(mm.lower(10)).toBeUndefined();
    });
  });

  describe('Functional methods', () => {
    it('forEach() iterates with bucket, key, map', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      const result: Array<[number, string[]]> = [];
      mm.forEach((bucket, key) => result.push([key, bucket]));
      expect(result).toEqual([
        [1, ['a']],
        [2, ['b']]
      ]);
    });

    it('filter() creates filtered map', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      mm.add(3, 'c');
      const filtered = mm.filter((bucket, key) => key >= 2);
      expect(filtered.size).toBe(2);
      expect(filtered.has(1)).toBe(false);
      expect(filtered.has(2)).toBe(true);
    });

    it('reduce() accumulates values', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
      const total = mm.reduce((acc, bucket) => acc + bucket.length, 0);
      expect(total).toBe(3);
    });

    it('map() transforms entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      const mapped = mm.map((bucket, key) => [key * 10, bucket.map(v => v.toUpperCase())]);
      expect(mapped.get(10)).toEqual(['A']);
      expect(mapped.get(20)).toEqual(['B']);
    });

    it('clone() creates independent copy', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      const copy = mm.clone();
      copy.add(2, 'b');
      expect(mm.has(2)).toBe(false);
      expect(copy.has(2)).toBe(true);
    });
  });

  describe('Tree utilities', () => {
    it('rangeSearch() returns entries in range', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
      mm.add(40, 'd');
      const result = mm.rangeSearch([15, 35], node => node.key);
      expect(result).toEqual([20, 30]);
    });

    it('print() does not throw', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      expect(() => mm.print()).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('works with string keys', () => {
      const mm = new TreeMultiMap<string, number>();
      mm.add('b', 2);
      mm.add('a', 1);
      mm.add('c', 3);
      expect([...mm.keys()]).toEqual(['a', 'b', 'c']);
    });

    it('works with Date keys', () => {
      const d1 = new Date('2020-01-01');
      const d2 = new Date('2021-01-01');
      const mm = new TreeMultiMap<Date, string>();
      mm.add(d2, 'later');
      mm.add(d1, 'earlier');
      expect(mm.first()?.[0]).toEqual(d1);
    });

    it('rejects NaN keys', () => {
      const mm = new TreeMultiMap<number, string>();
      expect(() => mm.add(NaN, 'x')).toThrow(TypeError);
    });

    it('custom comparator', () => {
      const mm = new TreeMultiMap<number, string>([], {
        comparator: (a, b) => b - a // descending
      });
      mm.add(1, 'a');
      mm.add(2, 'b');
      mm.add(3, 'c');
      expect([...mm.keys()]).toEqual([3, 2, 1]);
    });

    it('setMany() adds multiple entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.setMany([
        [1, ['a']],
        [2, ['b']]
      ]);
      expect(mm.size).toBe(2);
    });

    it('comparator getter', () => {
      const cmp = (a: number, b: number) => a - b;
      const mm = new TreeMultiMap<number, string>([], { comparator: cmp });
      expect(mm.comparator).toBe(cmp);
    });

    it('constructor with key-only entries', () => {
      const mm = new TreeMultiMap<number, string>([
        [1, undefined],
        [2, undefined]
      ] as any);
      expect(mm.has(1)).toBe(true);
      expect(mm.has(2)).toBe(true);
      expect(mm.get(1)).toEqual([]);
    });

    it('constructor with null/undefined entries skipped', () => {
      const mm = new TreeMultiMap<number, string>([null, undefined, [1, ['a']]] as any);
      expect(mm.size).toBe(1);
      expect(mm.has(1)).toBe(true);
    });

    it('constructor with key having null key in tuple skipped', () => {
      const mm = new TreeMultiMap<number, string>([
        [null, ['a']],
        [1, ['b']]
      ] as any);
      expect(mm.size).toBe(1);
    });

    it('rejects invalid Date keys', () => {
      const mm = new TreeMultiMap<Date, string>();
      expect(() => mm.add(new Date('invalid'), 'x')).toThrow(TypeError);
    });

    it('rejects non-primitive keys without comparator', () => {
      const mm = new TreeMultiMap<{ id: number }, string>();
      expect(() => mm.add({ id: 1 }, 'x')).toThrow(TypeError);
    });

    it('set() with null entry returns false', () => {
      const mm = new TreeMultiMap<number, string>();
      expect(mm.set(null as any)).toBe(false);
      expect(mm.set(undefined as any)).toBe(false);
    });

    it('set() entry with null key returns false', () => {
      const mm = new TreeMultiMap<number, string>();
      expect(mm.set([null, ['a']] as any)).toBe(false);
      expect(mm.set([undefined, ['a']] as any)).toBe(false);
    });

    it('set() entry with value appends to existing bucket', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.set([1, ['b', 'c']]);
      expect(mm.get(1)).toEqual(['a', 'b', 'c']);
    });

    it('set() entry tuple with undefined bucket creates empty bucket', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.set([1, undefined] as any);
      expect(mm.has(1)).toBe(true);
      expect(mm.get(1)).toEqual([]);
    });

    it('set() key-only creates empty bucket', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.set(1);
      expect(mm.has(1)).toBe(true);
      expect(mm.get(1)).toEqual([]);
    });

    it('entriesOf() on non-existent key yields nothing', () => {
      const mm = new TreeMultiMap<number, string>();
      expect([...mm.entriesOf(999)]).toEqual([]);
    });

    it('valuesOf() on non-existent key yields nothing', () => {
      const mm = new TreeMultiMap<number, string>();
      expect([...mm.valuesOf(999)]).toEqual([]);
    });

    it('hasEntry() returns false for non-existent key', () => {
      const mm = new TreeMultiMap<number, string>();
      expect(mm.hasEntry(999, 'x')).toBe(false);
    });

    it('deleteValue() returns false for non-existent key', () => {
      const mm = new TreeMultiMap<number, string>();
      expect(mm.deleteValue(999, 'x')).toBe(false);
    });

    it('deleteValue() returns false when value not found', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      expect(mm.deleteValue(1, 'x')).toBe(false);
    });

    it('deleteValues() returns 0 for non-existent key', () => {
      const mm = new TreeMultiMap<number, string>();
      expect(mm.deleteValues(999, 'x')).toBe(0);
    });

    it('filter() with custom comparator preserves it', () => {
      const cmp = (a: number, b: number) => b - a;
      const mm = new TreeMultiMap<number, string>([], { comparator: cmp });
      mm.add(1, 'a');
      mm.add(2, 'b');
      const filtered = mm.filter(() => true);
      expect([...filtered.keys()]).toEqual([2, 1]); // descending
    });

    it('constructor with plain key entries (not array)', () => {
      const mm = new TreeMultiMap<number, string>([1, 2, 3] as any);
      expect(mm.has(1)).toBe(true);
      expect(mm.has(2)).toBe(true);
      expect(mm.has(3)).toBe(true);
      expect(mm.get(1)).toEqual([]);
    });

    it('@example [TreeMultiMap.add] Add key-value pair', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
      expect(mm.get(1)).toEqual(['a', 'b']);
    });

    it('@example [TreeMultiMap.delete] Remove key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      mm.delete(1);
      expect(mm.has(1)).toBe(false);
    });

    it('@example [TreeMultiMap.get] Get values for key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect(mm.get(1)).toEqual(['a', 'b']);
    });

    it('@example [TreeMultiMap.has] Check key existence', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      expect(mm.has(1)).toBe(true);
      expect(mm.has(2)).toBe(false);
    });

    it('@example [TreeMultiMap.set] Set values for key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.set(1, 'a');
      mm.set(1, 'b');
      expect(mm.get(1)).toEqual(['a', 'b']);
    });

    it('@example [TreeMultiMap.setMany] Set multiple entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.setMany([
        [1, ['a']],
        [2, ['b']]
      ]);
      expect(mm.size).toBe(2);
    });

    it('@example [TreeMultiMap.clear] Remove all entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.clear();
      expect(mm.isEmpty()).toBe(true);
    });

    it('@example [TreeMultiMap.clone] Deep clone', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      const copy = mm.clone();
      copy.delete(1);
      expect(mm.has(1)).toBe(true);
    });

    it('@example [TreeMultiMap.isEmpty] Check if empty', () => {
      expect(new TreeMultiMap().isEmpty()).toBe(true);
    });

    it('@example [TreeMultiMap.count] Count values for key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect(mm.count(1)).toBe(2);
    });

    it('@example [TreeMultiMap.totalSize] Total number of values', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
      expect(mm.totalSize).toBe(3);
    });

    it('@example [TreeMultiMap.first] First entry', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(3, 'c');
      mm.add(1, 'a');
      expect(mm.first()?.[0]).toBe(1);
    });

    it('@example [TreeMultiMap.last] Last entry', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(3, 'c');
      expect(mm.last()?.[0]).toBe(3);
    });

    it('@example [TreeMultiMap.pollFirst] Remove and return first', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(2, 'b');
      mm.add(1, 'a');
      const first = mm.pollFirst();
      expect(first?.[0]).toBe(1);
      expect(mm.has(1)).toBe(false);
    });

    it('@example [TreeMultiMap.pollLast] Remove and return last', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(3, 'c');
      const last = mm.pollLast();
      expect(last?.[0]).toBe(3);
    });

    it('@example [TreeMultiMap.ceiling] Least key ≥ target', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
      expect(mm.ceiling(15)?.[0]).toBe(20);
    });

    it('@example [TreeMultiMap.floor] Greatest key ≤ target', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
      expect(mm.floor(25)?.[0]).toBe(20);
    });

    it('@example [TreeMultiMap.higher] Least key > target', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      expect(mm.higher(10)?.[0]).toBe(20);
    });

    it('@example [TreeMultiMap.lower] Greatest key < target', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      expect(mm.lower(20)?.[0]).toBe(10);
    });

    it('@example [TreeMultiMap.keys] Iterate keys', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(3, 'c');
      mm.add(1, 'a');
      expect([...mm.keys()]).toEqual([1, 3]);
    });

    it('@example [TreeMultiMap.values] Iterate value arrays', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect([...mm.values()]).toEqual([['a', 'b']]);
    });

    it('@example [TreeMultiMap.entriesOf] Get entries for key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect([...mm.entriesOf(1)]).toEqual([
        [1, 'a'],
        [1, 'b']
      ]);
    });

    it('@example [TreeMultiMap.valuesOf] Get flat values for key', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      expect([...mm.valuesOf(1)]).toEqual(['a', 'b']);
    });

    it('@example [TreeMultiMap.flatEntries] All key-value pairs flattened', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
      expect([...mm.flatEntries()]).toEqual([
        [1, 'a'],
        [1, 'b'],
        [2, 'c']
      ]);
    });

    it('@example [TreeMultiMap.hasEntry] Check specific key-value', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      expect(mm.hasEntry(1, 'a')).toBe(true);
      expect(mm.hasEntry(1, 'z')).toBe(false);
    });

    it('@example [TreeMultiMap.deleteValue] Delete specific value', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.deleteValue(1, 'a');
      expect(mm.get(1)).toEqual(['b']);
    });

    it('@example [TreeMultiMap.deleteValues] Delete all matching values', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'a');
      mm.add(1, 'b');
      const count = mm.deleteValues(1, 'a');
      expect(count).toBe(2);
    });

    it('@example [TreeMultiMap.forEach] Iterate entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      const keys: number[] = [];
      mm.forEach((v, k) => keys.push(k));
      expect(keys).toEqual([1, 2]);
    });

    it('@example [TreeMultiMap.filter] Filter entries', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      mm.add(3, 'c');
      const filtered = mm.filter((v, k) => k > 1);
      expect([...filtered.keys()]).toEqual([2, 3]);
    });

    it('@example [TreeMultiMap.map] Transform values', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      const mapped = mm.map((v, k) => [k, v.map(s => s.toUpperCase())] as [number, string[]]);
      expect(mapped.get(1)).toEqual(['A']);
    });

    it('@example [TreeMultiMap.reduce] Aggregate', () => {
      const mm = new TreeMultiMap<number, number>();
      mm.add(1, 10);
      mm.add(2, 20);
      const sum = mm.reduce((acc, v) => acc + v.reduce((a, b) => a + b, 0), 0);
      expect(sum).toBe(30);
    });

    it('@example [TreeMultiMap.rangeSearch] Find keys in range', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
      const result = mm.rangeSearch([15, 25]);
      expect(result.length).toBe(1);
    });

    it('@example [TreeMultiMap.print] Display tree', () => {
      const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      expect(() => mm.print()).not.toThrow();
    });
  });
});
