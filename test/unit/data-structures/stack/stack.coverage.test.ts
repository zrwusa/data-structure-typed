import { Stack } from '../../../../src';

describe('Stack coverage', () => {
  it('fromArray + basic ops cover isEmpty/peek/pop on empty', () => {
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

    const ctx = { inc: 10 };
    const mapped = s.map(function (v) {
      return v + (this as any).inc;
    }, undefined, ctx);
    expect([...mapped]).toEqual([11, 12, 13]);

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
