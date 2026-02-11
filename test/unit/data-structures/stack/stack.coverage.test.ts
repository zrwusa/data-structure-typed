import { Stack } from '../../../../src';

describe('Stack coverage', () => {
  it('fromArray + basic ops cover isEmpty/peek/pop on empty', () => {
    // constructor default params branch
    const empty = new Stack<number>();
    expect(empty.size).toBe(0);

    const s = Stack.fromArray([1, 2, 3]);
    expect([...s]).toEqual([1, 2, 3]);

    expect(s.peek()).toBe(3);
    expect(s.pop()).toBe(3);
    expect(s.pop()).toBe(2);
    expect(s.pop()).toBe(1);

    expect(s.isEmpty()).toBe(true);
    expect(s.peek()).toBeUndefined();
    expect(s.pop()).toBeUndefined();
  });

  it('pushMany uses toElementFn conversion branch', () => {
    const s = new Stack<number, { v: number }>([], { toElementFn: r => r.v });
    const res = s.pushMany([{ v: 1 }, { v: 2 }]);
    expect(res).toEqual([true, true]);
    expect([...s]).toEqual([1, 2]);
  });

  it('delete/deleteAt cover not-found and bounds', () => {
    const s = new Stack<number>([1, 2, 3, 2]);

    // not found => _indexOfByEquals returns -1 => deleteAt(-1) false
    expect(s.delete(999)).toBe(false);

    // bounds
    expect(s.deleteAt(-1)).toBe(false);
    expect(s.deleteAt(999)).toBe(false);

    // delete first matching occurrence (bottom-up)
    expect(s.delete(2)).toBe(true);
    expect([...s]).toEqual([1, 3, 2]);

    // deleteAt valid
    expect(s.deleteAt(1)).toBe(true);
    expect([...s]).toEqual([1, 2]);
  });

  it('deleteWhere covers both match and no-match branches', () => {
    const s = new Stack<number>([1, 2, 3]);
    expect(s.deleteWhere(v => v === 2)).toBe(true);
    expect([...s]).toEqual([1, 3]);

    expect(s.deleteWhere(v => v === 999)).toBe(false);
    expect([...s]).toEqual([1, 3]);
  });

  it('clear/clone/filter/mapSame/map cover instance factories and thisArg call path', () => {
    const raw = [{ v: 1 }, { v: 2 }, { v: 3 }];
    const s = new Stack<number, { v: number }>(raw, { toElementFn: r => r.v });

    const cloned = s.clone();
    expect([...cloned]).toEqual([1, 2, 3]);

    const filtered = s.filter(v => v % 2 === 1);
    expect([...filtered]).toEqual([1, 3]);

    const mappedSame = s.mapSame(v => v * 2);
    expect([...mappedSame]).toEqual([2, 4, 6]);

    // mapSame with thisArg branch
    const ctx2 = { mul: 3 };
    const mappedSame2 = s.mapSame(function (v) {
      return v * (this as any).mul;
    }, ctx2);
    expect([...mappedSame2]).toEqual([3, 6, 9]);

    // map with thisArg branch
    const ctx = { inc: 10 };
    const mapped = s.map(function (v) {
      return v + (this as any).inc;
    }, undefined, ctx);
    expect([...mapped]).toEqual([11, 12, 13]);

    // map with undefined thisArg branch
    const mapped2 = s.map(v => v + 1);
    expect([...mapped2]).toEqual([2, 3, 4]);

    // _createLike default elements branch (protected)
    const like = (s as any)._createLike();
    expect(like.size).toBe(0);

    s.clear();
    expect(s.size).toBe(0);
  });

  it('setEquality affects delete/search semantics', () => {
    type Obj = { id: number };
    const a = { id: 1 };
    const b = { id: 2 };
    const s = new Stack<Obj>([a, b]);

    // default Object.is: new object not found
    expect(s.delete({ id: 1 } as any)).toBe(false);

    s.setEquality((x, y) => x.id === y.id);
    expect(s.delete({ id: 1 } as any)).toBe(true);
    expect([...s].map(x => x.id)).toEqual([2]);
  });
});
