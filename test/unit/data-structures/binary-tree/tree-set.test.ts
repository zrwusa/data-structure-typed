import { TreeSet } from '../../../../src';

describe('classic use', () => {
  it('@example [TreeSet.add] Unique tags with sorted order', () => {
    const tags = new TreeSet<string>(['javascript', 'typescript', 'react', 'typescript', 'node']);

    // Duplicates removed, sorted alphabetically
    expect([...tags]).toEqual(['javascript', 'node', 'react', 'typescript']);
    expect(tags.size).toBe(4);

    tags.add('angular');
    expect(tags.first()).toBe('angular');
    expect(tags.last()).toBe('typescript');
  });

  it('@example [TreeSet.ceiling] Finding nearest available time slot', () => {
    // Available appointment times (minutes from midnight)
    const slots = new TreeSet<number>([540, 600, 660, 720, 840, 900]);

    // Customer wants something around 10:30 (630 min)
    const nearest = slots.ceiling(630);
    expect(nearest).toBe(660); // 11:00 AM

    // What's the latest slot before 2:00 PM (840)?
    const before2pm = slots.lower(840);
    expect(before2pm).toBe(720); // 12:00 PM

    // Book the 11:00 slot
    slots.delete(660);
    expect(slots.ceiling(630)).toBe(720); // Next available is 12:00
  });

  it('@example [TreeSet.first] Student grade ranking with custom comparator', () => {
    interface Student {
      name: string;
      gpa: number;
    }

    const ranking = new TreeSet<Student>(
      [
        { name: 'Alice', gpa: 3.8 },
        { name: 'Bob', gpa: 3.5 },
        { name: 'Charlie', gpa: 3.9 },
        { name: 'Diana', gpa: 3.5 }
      ],
      { comparator: (a, b) => b.gpa - a.gpa || a.name.localeCompare(b.name) }
    );

    // Sorted by GPA descending, then name ascending
    const names = [...ranking].map(s => s.name);
    expect(names).toEqual(['Charlie', 'Alice', 'Bob', 'Diana']);

    // Top student
    expect(ranking.first()?.name).toBe('Charlie');

    // Filter students with GPA >= 3.8
    const honors = ranking.filter(s => s.gpa >= 3.8);
    expect(honors.toArray().map(s => s.name)).toEqual(['Charlie', 'Alice']);
  });

  it('@example [TreeSet.rangeSearch] IP address blocklist with range checking', () => {
    // Simplified: use numeric IP representation
    const blocklist = new TreeSet<number>([
      167772160, // 10.0.0.0
      167772416, // 10.0.1.0
      167772672, // 10.0.2.0
      167773184  // 10.0.4.0
    ]);

    // Check if any blocked IP is in range 10.0.1.0 - 10.0.3.0
    const inRange = blocklist.rangeSearch([167772416, 167772928]);
    expect(inRange).toEqual([167772416, 167772672]);

    // Quick membership check
    expect(blocklist.has(167772416)).toBe(true);
    expect(blocklist.has(167772800)).toBe(false);
  });

  it('@example [TreeSet.has] Checking membership in a sorted collection', () => {
    const allowed = new TreeSet<string>(['admin', 'editor', 'viewer']);

    expect(allowed.has('admin')).toBe(true);
    expect(allowed.has('guest')).toBe(false);
  });

  it('@example [TreeSet.delete] Removing elements while maintaining order', () => {
    const nums = new TreeSet<number>([1, 3, 5, 7, 9]);

    expect(nums.delete(5)).toBe(true);
    expect(nums.delete(5)).toBe(false); // already gone
    expect([...nums]).toEqual([1, 3, 7, 9]);
  });

  it('@example [TreeSet.last] Get the maximum element', () => {
    const temps = new TreeSet<number>([18, 22, 15, 30, 25]);
    expect(temps.last()).toBe(30);
    expect(temps.first()).toBe(15);
  });

  it('@example [TreeSet.floor] Largest element ≤ target', () => {
    const breakpoints = new TreeSet<number>([320, 768, 1024, 1280, 1920]);

    // Current width is 800 → which breakpoint applies?
    expect(breakpoints.floor(800)).toBe(768);
    expect(breakpoints.floor(1024)).toBe(1024); // exact match
    expect(breakpoints.floor(100)).toBeUndefined(); // below all
  });

  it('@example [TreeSet.higher] Smallest element strictly > target', () => {
    const levels = new TreeSet<number>([1, 5, 10, 25, 50, 100]);

    expect(levels.higher(10)).toBe(25);
    expect(levels.higher(100)).toBeUndefined();
  });

  it('@example [TreeSet.lower] Largest element strictly < target', () => {
    const tiers = new TreeSet<number>([100, 200, 500, 1000]);

    expect(tiers.lower(500)).toBe(200);
    expect(tiers.lower(100)).toBeUndefined();
  });

  it('@example [TreeSet.pollFirst] Remove and return minimum', () => {
    const queue = new TreeSet<number>([5, 1, 8, 3]);

    expect(queue.pollFirst()).toBe(1);
    expect(queue.pollFirst()).toBe(3);
    expect(queue.size).toBe(2);
  });

  it('@example [TreeSet.pollLast] Remove and return maximum', () => {
    const stack = new TreeSet<number>([10, 20, 30]);

    expect(stack.pollLast()).toBe(30);
    expect(stack.size).toBe(2);
  });
});

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

    const seen: number[] = [];
    const ctx = { ok: true };
    s.forEach(function (this: typeof ctx, v) {
      expect(this).toBe(ctx);
      seen.push(v);
    }, ctx);
    expect(seen).toEqual([1, 2, 3]);
  });

  test('default comparator: NaN throws (even on empty tree)', () => {
    const s = new TreeSet<number>();
    expect(() => s.add(Number.NaN)).toThrow(TypeError);
    expect(() => s.has(Number.NaN)).toThrow(TypeError);
    expect(() => s.delete(Number.NaN)).toThrow(TypeError);
    expect(() => s.ceiling(Number.NaN)).toThrow(TypeError);
  });

  test('constructor throws when encountering invalid keys under default comparator', () => {
    expect(() => new TreeSet<number>([1, Number.NaN, 2])).toThrow(TypeError);

    const bad = new Date('not-a-date');
    expect(() => new TreeSet<Date>([bad])).toThrow(TypeError);

    type Obj = { n: number };
    expect(() => new TreeSet<Obj>([{ n: 1 }])).toThrow(TypeError);
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

  test('default comparator: string key ordering is supported', () => {
    const s = new TreeSet<string>(['b', 'a', 'c']);
    expect([...s]).toEqual(['a', 'b', 'c']);
    expect(s.higher('b')).toBe('c');
  });

  test('default comparator: non-primitive/non-Date requires custom comparator', () => {
    type Obj = { n: number };
    const o1: Obj = { n: 1 };

    expect(() => new TreeSet<Obj>([o1])).toThrow(TypeError);

    const byN = (a: Obj, b: Obj) => a.n - b.n;
    const s = new TreeSet<Obj>([o1, { n: 2 }], { comparator: byN });
    expect(s.size).toBe(2);
  });

  test('createDefaultComparator throws for unsupported key types', () => {
    const cmp = TreeSet.createDefaultComparator<object>();
    expect(() => cmp({} as any as object, {} as any as object)).toThrow(TypeError);
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

  test('map/filter/reduce/every/some/find/toArray/print', () => {
    const s = new TreeSet<number>([3, 1, 2]);

    expect(s.map(v => v * 2).toArray()).toEqual([2, 4, 6]);

    const ctx = { mul: 3 };
    expect(
      s.map(function (this: typeof ctx, v) {
        return v * this.mul;
      }, {}, ctx).toArray()
    ).toEqual([3, 6, 9]);

    expect(s.filter(v => v % 2 === 1).toArray()).toEqual([1, 3]);
    expect(s.reduce((acc, v) => acc + v, 0)).toBe(6);

    expect(s.every(v => v > 0)).toBe(true);
    expect(s.every(v => v > 2)).toBe(false);

    expect(s.some(v => v === 2)).toBe(true);
    expect(s.some(v => v === 999)).toBe(false);

    expect(s.find(v => v >= 2)).toBe(2);
    expect(s.find(v => v >= 999)).toBe(undefined);

    expect(s.toArray()).toEqual([1, 2, 3]);

    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    s.print();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('map/filter/reduce with TreeSet objects stays expressive', () => {
    const users = new TreeSet([
      { id: 1, name: 'Alice', age: 24 },
      { id: 2, name: 'Bob', age: 31 },
      { id: 3, name: 'Charlie', age: 29 },
      { id: 4, name: 'David', age: 22 },
    ], {
      comparator: (a, b) => a.age - b.age
    });

    expect(users.toArray()).toEqual([
      { id: 4, name: 'David', age: 22 },
      { id: 1, name: 'Alice', age: 24 },
      { id: 3, name: 'Charlie', age: 29 },
      { id: 2, name: 'Bob', age: 31 },
    ]);

    const filtered = users.filter(user => user.age > 26);
    expect(filtered.toArray()).toEqual([
      { id: 3, name: 'Charlie', age: 29 },
      { id: 2, name: 'Bob', age: 31 },
    ]);

    const mapped = filtered.map(user => ({
      ...user,
      senior: user.age >= 30
    }), { comparator: (a, b) => a.age - b.age });
    expect(mapped.toArray()).toEqual([
      { id: 3, name: 'Charlie', age: 29, senior: false },
      { id: 2, name: 'Bob', age: 31, senior: true },
    ]);

    const totalAge = mapped.reduce((sum, user) => sum + user.age, 0);
    expect(totalAge).toBe(60);
  });

  test('toElementFn: construct from raw objects', () => {
    interface User {
      id: number;
      name: string;
    }

    const users: User[] = [
      { id: 3, name: 'Charlie' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];

    const s = new TreeSet<number, User>(users, {
      toElementFn: u => u.id
    });

    expect(s.size).toBe(3);
    expect([...s]).toEqual([1, 2, 3]); // sorted
    expect(s.has(1)).toBe(true);
    expect(s.has(2)).toBe(true);
    expect(s.has(3)).toBe(true);
    expect(s.has(4)).toBe(false);
  });

  test('toElementFn: with duplicates (deduplication)', () => {
    interface Item {
      category: string;
      name: string;
    }

    const items: Item[] = [
      { category: 'fruit', name: 'apple' },
      { category: 'vegetable', name: 'carrot' },
      { category: 'fruit', name: 'banana' } // duplicate category
    ];

    const s = new TreeSet<string, Item>(items, {
      toElementFn: item => item.category
    });

    expect(s.size).toBe(2); // deduplicated
    expect([...s]).toEqual(['fruit', 'vegetable']);
  });

  describe('clone', () => {
    test('clone creates independent copy', () => {
      const original = new TreeSet<number>([3, 1, 2]);
      const copy = original.clone();

      expect(copy.size).toBe(3);
      expect([...copy]).toEqual([...original]);

      // Modify copy, original unchanged
      copy.add(4);
      expect(copy.has(4)).toBe(true);
      expect(original.has(4)).toBe(false);

      // Modify original, copy unchanged
      original.delete(1);
      expect(original.has(1)).toBe(false);
      expect(copy.has(1)).toBe(true);
    });

    test('clone preserves custom comparator', () => {
      const original = new TreeSet<string>(['B', 'A', 'C'], {
        comparator: (a, b) => b.localeCompare(a) // reverse order
      });
      const copy = original.clone();

      expect([...copy]).toEqual(['C', 'B', 'A']); // reverse order preserved
      copy.add('D');
      expect([...copy]).toEqual(['D', 'C', 'B', 'A']);
    });

    test('clone with string keys', () => {
      const original = new TreeSet<string>(['banana', 'apple', 'cherry']);
      const copy = original.clone();

      expect([...copy]).toEqual(['apple', 'banana', 'cherry']);
      expect(copy.has('banana')).toBe(true);
    });

    it('@example [TreeSet.entries] Iterate entries', () => {
      const ts = new TreeSet<number>([3, 1, 2]);
      expect([...ts.entries()].map(([k]) => k)).toEqual([1, 2, 3]);
    });

    it('@example [TreeSet.keys] Get sorted keys', () => {
      const ts = new TreeSet<number>([30, 10, 20]);
      expect([...ts.keys()]).toEqual([10, 20, 30]);
    });

    it('@example [TreeSet.values] Get values (same as keys for Set)', () => {
      const ts = new TreeSet<number>([2, 1, 3]);
      expect([...ts.values()]).toEqual([1, 2, 3]);
    });

    it('@example [TreeSet.forEach] Execute for each', () => {
      const ts = new TreeSet<number>([3, 1, 2]);
      const keys: number[] = [];
      ts.forEach(k => keys.push(k));
      expect(keys).toEqual([1, 2, 3]);
    });

    it('@example [TreeSet.every] Test all', () => {
      const ts = new TreeSet<number>([2, 4, 6]);
      expect(ts.every(k => k > 0)).toBe(true);
    });

    it('@example [TreeSet.some] Test any', () => {
      const ts = new TreeSet<number>([1, 3, 5]);
      expect(ts.some(k => k === 3)).toBe(true);
    });

    it('@example [TreeSet.find] Find entry', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      const found = ts.find(k => k === 2);
      expect(found).toBe(2);
    });

    it('@example [TreeSet.filter] Filter', () => {
      const ts = new TreeSet<number>([1, 2, 3, 4, 5]);
      const evens = ts.filter(k => k % 2 === 0);
      expect([...evens]).toEqual([2, 4]);
    });

    it('@example [TreeSet.map] Transform', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      const doubled = ts.map(k => k * 2);
      expect([...doubled]).toEqual([2, 4, 6]);
    });

    it('@example [TreeSet.reduce] Aggregate', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      const sum = ts.reduce((acc, k) => acc + k, 0);
      expect(sum).toBe(6);
    });

    it('@example [TreeSet.toArray] Convert to array', () => {
      const ts = new TreeSet<number>([3, 1, 2]);
      expect(ts.toArray()).toEqual([1, 2, 3]);
    });

    it('@example [TreeSet.clone] Deep clone', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      const copy = ts.clone();
      copy.delete(1);
      expect(ts.has(1)).toBe(true);
    });

    it('@example [TreeSet.clear] Remove all', () => {
      const ts = new TreeSet<number>([1, 2]);
      ts.clear();
      expect(ts.isEmpty()).toBe(true);
    });

    it('@example [TreeSet.isEmpty] Check empty', () => {
      expect(new TreeSet().isEmpty()).toBe(true);
    });

    it('@example [TreeSet.print] Display tree', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      expect(() => ts.print()).not.toThrow();
    });
  });
});
