import { Deque } from '../../../../src';

describe('Deque coverage', () => {
  it('constructor handles iterable-like length()/size() branches and bucketSize option', () => {
    const arr = [1, 2, 3, 4, 5];

    const withLengthFn = {
      length: () => arr.length,
      [Symbol.iterator]: function* () {
        yield* arr;
      }
    } as any;

    const d1 = new Deque<number>(withLengthFn, { bucketSize: 4 });
    expect(d1.bucketSize).toBe(4);
    expect([...d1]).toEqual(arr);

    const withSizeFn = {
      size: () => arr.length,
      [Symbol.iterator]: function* () {
        yield* arr;
      }
    } as any;

    const d2 = new Deque<number>(withSizeFn, { bucketSize: 4 });
    expect([...d2]).toEqual(arr);
  });

  it('push/unshift respect maxLen (trigger shift/pop) and cover wrap-around + reallocate', () => {
    // small bucket to make wrap/reallocate reachable with few ops
    const d = new Deque<number>([], { bucketSize: 4, maxLen: 5 });

    // Fill and force internal pointers to wrap a couple times
    for (let i = 0; i < 20; i++) d.push(i);
    expect(d.length).toBe(5);
    expect([...d]).toEqual([15, 16, 17, 18, 19]);

    for (let i = 100; i < 110; i++) d.unshift(i);
    expect(d.length).toBe(5);
    // unshift beyond maxLen pops from end
    expect([...d]).toEqual([109, 108, 107, 106, 105]);
  });

  it('pop/shift on empty and singleton cases', () => {
    const empty = new Deque<number>([], { bucketSize: 4 });
    expect(empty.pop()).toBeUndefined();
    expect(empty.shift()).toBeUndefined();
    expect(empty.first).toBeUndefined();
    expect(empty.last).toBeUndefined();

    const one = new Deque<number>([1], { bucketSize: 4 });
    expect(one.first).toBe(1);
    expect(one.last).toBe(1);
    expect(one.pop()).toBe(1);
    expect(one.length).toBe(0);

    one.push(2);
    expect(one.shift()).toBe(2);
    expect(one.length).toBe(0);
  });

  it('at/setAt/addAt/deleteAt/splice rangeCheck throwing + success paths', () => {
    const d = new Deque<number>([1, 2, 3], { bucketSize: 4 });

    expect(d.at(-1)).toBeUndefined();
    expect(d.at(999)).toBeUndefined();

    expect(() => d.setAt(-1 as any, 0)).toThrow();
    expect(() => d.setAt(999 as any, 0)).toThrow();
    expect(d.setAt(1, 20)).toBe(true);
    expect([...d]).toEqual([1, 20, 3]);

    expect(() => d.addAt(-1 as any, 0)).toThrow();
    expect(() => d.deleteAt(-1 as any)).toThrow();
    expect(() => d.splice(999 as any, 0)).toThrow();

    // addAt: pos=0 and pos=length branches
    d.addAt(0, 9, 2);
    d.addAt(d.length, 7, 1);
    expect(d.first).toBe(9);
    expect(d.last).toBe(7);

    // deleteAt: middle shift loop branch
    const mid = d.deleteAt(2);
    expect(mid).toBeDefined();
  });

  it('cut/cutRest cover in-place and copy branches', () => {
    const d = new Deque<number>([1, 2, 3, 4, 5], { bucketSize: 4 });

    const prefix = d.cut(2, false);
    expect([...prefix]).toEqual([1, 2, 3]);

    const suffix = d.cutRest(3, false);
    expect([...suffix]).toEqual([4, 5]);

    // in-place cut with pos<0 clears
    d.cut(-1, true);
    expect(d.length).toBe(0);

    const d2 = new Deque<number>([1, 2, 3, 4, 5], { bucketSize: 4 });
    d2.cutRest(-1, true);
    expect([...d2]).toEqual([1, 2, 3, 4, 5]);
  });

  it('delete/deleteWhere/setEquality/unique/reverse/shrinkToFit cover branches', () => {
    type Obj = { id: number };
    const a: Obj = { id: 1 };
    const b: Obj = { id: 1 };
    const c: Obj = { id: 2 };

    const d = new Deque<Obj>([a, c], { bucketSize: 4 });

    // default Object.is: b not found
    expect(d.delete(b)).toBe(true); // returns true even when not found? it compacts all != element
    expect(d.length).toBe(2);

    d.setEquality((x, y) => x.id === y.id);
    expect(d.delete(b)).toBe(true);
    expect([...d].map(x => x.id)).toEqual([2]);

    d.push({ id: 2 });
    d.push({ id: 3 });

    expect(d.deleteWhere(v => v.id === 2)).toBe(true);
    expect(d.deleteWhere(v => v.id === 999)).toBe(false);

    // unique
    const nums = new Deque<number>([1, 1, 2, 2, 2, 3], { bucketSize: 4 });
    nums.unique();
    expect([...nums]).toEqual([1, 2, 3]);

    // unique early return
    expect(new Deque<number>([1], { bucketSize: 4 }).unique().length).toBe(1);

    // reverse
    nums.reverse();
    expect([...nums]).toEqual([3, 2, 1]);

    // shrinkToFit branches
    const s0 = new Deque<number>([], { bucketSize: 4 });
    s0.shrinkToFit();

    const s1 = new Deque<number>([1, 2, 3, 4, 5, 6, 7, 8], { bucketSize: 2 });
    s1.shift();
    s1.shift();
    s1.pop();
    s1.pop();
    // now likely spans multiple buckets; just ensure no throw
    s1.shrinkToFit();
    expect(s1.length).toBeGreaterThan(0);
  });

  it('filter/mapSame/map cover thisArg and toElementFn branches', () => {
    const d = new Deque<number, { v: number }>([{ v: 1 }, { v: 2 }, { v: 3 }] as any, {
      bucketSize: 4,
      toElementFn: r => r.v
    });

    const filtered = d.filter(v => v % 2 === 1);
    expect([...filtered]).toEqual([1, 3]);

    const ctx = { mul: 3 };
    const mappedSame = d.mapSame(function (v) {
      // @ts-ignore
      return v * this.mul;
    }, ctx);
    expect([...mappedSame]).toEqual([3, 6, 9]);

    const mapped = d.map(v => String(v));
    expect([...mapped]).toEqual(['1', '2', '3']);
  });
});
