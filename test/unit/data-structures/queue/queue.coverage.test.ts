import { Queue } from '../../../../src';

describe('Queue coverage', () => {
  it('constructor options set autoCompactRatio and push respects maxLen via shift', () => {
    const q = new Queue<number>([], { maxLen: 2, autoCompactRatio: 1 });
    expect(q.autoCompactRatio).toBe(1);

    q.push(1);
    q.push(2);
    q.push(3); // maxLen overflow triggers shift()

    expect([...q]).toEqual([2, 3]);
    expect(q.length).toBe(2);
    expect(q.first).toBe(2);
    expect(q.last).toBe(3);
  });

  it('pushMany uses toElementFn branch', () => {
    const q = new Queue<number, { v: number }>([], { toElementFn: r => r.v });
    expect(q.pushMany([{ v: 1 }, { v: 2 }])).toEqual([true, true]);
    expect([...q]).toEqual([1, 2]);
  });

  it('shift covers empty branch and compaction trigger', () => {
    const q = new Queue<number>();
    expect(q.shift()).toBeUndefined();

    // Force compaction quickly.
    q.autoCompactRatio = 0.25;
    q.pushMany([1, 2, 3, 4]);

    expect(q.shift()).toBe(1);
    // offset=1, elements.length=4 => 0.25, not strictly greater
    expect(q.offset).toBe(1);

    expect(q.shift()).toBe(2);
    // offset=2, elements.length=4 => 0.5 > 0.25 => compact()
    expect(q.offset).toBe(0);
    expect(q.elements).toEqual([3, 4]);
  });

  it('delete/deleteAt/addAt/setAt cover bounds and success', () => {
    const q = new Queue<number>([1, 2, 3, 4]);
    // consume one to introduce offset
    expect(q.shift()).toBe(1);

    expect(q.delete(999)).toBe(false);
    expect(q.delete(3)).toBe(true);
    expect([...q]).toEqual([2, 4]);

    expect(q.at(-1)).toBeUndefined();
    expect(q.at(999)).toBeUndefined();
    expect(q.at(0)).toBe(2);

    expect(q.deleteAt(-1)).toBeUndefined();
    expect(q.deleteAt(999)).toBeUndefined();
    expect(q.deleteAt(0)).toBe(2);
    expect([...q]).toEqual([4]);

    expect(q.addAt(-1, 0)).toBe(false);
    expect(q.addAt(999, 0)).toBe(false);
    expect(q.addAt(0, 3)).toBe(true);
    expect([...q]).toEqual([3, 4]);

    expect(q.setAt(-1, 0)).toBe(false);
    expect(q.setAt(999, 0)).toBe(false);
    expect(q.setAt(1, 40)).toBe(true);
    expect([...q]).toEqual([3, 40]);
  });

  it('reverse/clear/compact basic behaviors', () => {
    const q = new Queue<number>([1, 2, 3]);
    q.shift();
    expect(q.offset).toBe(1);

    q.reverse();
    expect(q.offset).toBe(0);
    expect([...q]).toEqual([3, 2]);

    q.clear();
    expect(q.length).toBe(0);
    expect(q.offset).toBe(0);

    q.pushMany([1, 2]);
    q.shift();
    expect(q.compact()).toBe(true);
    expect(q.offset).toBe(0);
  });

  it('splice triggers optional compaction and returns removed queue with copied ratio', () => {
    const q = new Queue<number>([1, 2, 3, 4, 5], { autoCompactRatio: 0.2 });
    q.shift();
    q.shift(); // offset=2, len=5 => 0.4 > 0.2 would compact on next splice

    const removed = q.splice(1, 2, 9, 8);
    expect([...removed]).toEqual([4, 5]);
    expect(removed.autoCompactRatio).toBe(q.autoCompactRatio);

    expect([...q]).toEqual([3, 9, 8]);
    expect(q.offset).toBe(0);
  });

  it('map/mapSame cover thisArg and default branches, and _createLike default elements branch', () => {
    const q = new Queue<number>([1, 2, 3], { autoCompactRatio: 0.9 });

    const mapped1 = q.map(v => v + 1);
    expect([...mapped1]).toEqual([2, 3, 4]);

    const ctx = { mul: 2 };
    const mapped2 = q.map(function (v) {
      // @ts-ignore
      return v * this.mul;
    }, undefined, ctx);
    expect([...mapped2]).toEqual([2, 4, 6]);

    const same1 = q.mapSame(v => v * 10);
    expect([...same1]).toEqual([10, 20, 30]);

    const same2 = q.mapSame(function (v) {
      // @ts-ignore
      return v + this.inc;
    }, { inc: 5 });
    expect([...same2]).toEqual([6, 7, 8]);

    const like = (q as any)._createLike();
    expect(like.length).toBe(0);
  });

  it('_getReverseIterator skips undefined items', () => {
    const q = new Queue<number | undefined>([1, undefined, 2]);
    expect([...q.toReversedArray()]).toEqual([2, undefined, 1]);

    const rev: (number | undefined)[] = [];
    for (const v of (q as any)._getReverseIterator()) rev.push(v);
    // undefined is skipped by implementation
    expect(rev).toEqual([2, 1]);
  });
});
