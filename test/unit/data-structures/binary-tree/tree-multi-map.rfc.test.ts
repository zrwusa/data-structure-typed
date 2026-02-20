import { TreeMultiMap } from '../../../../src';

describe('TreeMultiMap (RFC additions)', () => {
  it('get() returns a live bucket reference (mutating it mutates the container); empty bucket does not auto-delete key', () => {
    const mm = new TreeMultiMap<number, string>();
    mm.set(1, 'a');
    mm.set(1, 'b');

    const bucket = mm.get(1)!;
    expect(bucket).toEqual(['a', 'b']);

    bucket.push('c');
    expect(mm.get(1)).toEqual(['a', 'b', 'c']);

    // If bucket is emptied by mutation, key remains until delete(key) is called.
    bucket.length = 0;
    expect(mm.has(1)).toBe(true);
    expect(mm.get(1)).toEqual([]);
  });

  it('totalSize is the sum of bucket lengths across all keys', () => {
    const mm = new TreeMultiMap<number, string>();
    mm.set(1, 'a');
    mm.set(1, 'b');
    mm.set(2, 'x');
    expect(mm.totalSize).toBe(3);

    // live bucket mutation reflected
    mm.get(2)!.push('y', 'z');
    expect(mm.totalSize).toBe(5);
  });

  it('hasEntry/deleteValue/deleteValues default Object.is and optional eq', () => {
    const mm = new TreeMultiMap<number, { id: number }>();
    const a1 = { id: 1 };
    const a1b = { id: 1 };

    mm.set(1, a1);
    mm.set(1, a1b);

    // Object.is uses reference equality for objects
    expect(mm.hasEntry(1, { id: 1 })).toBe(false);
    expect(mm.hasEntry(1, a1)).toBe(true);

    const eq = (x: { id: number }, y: { id: number }) => x.id === y.id;
    expect(mm.hasEntry(1, { id: 1 }, eq)).toBe(true);

    // deleteValue deletes one match
    expect(mm.deleteValue(1, { id: 1 }, eq)).toBe(true);
    expect(mm.get(1)!.length).toBe(1);

    // deleteValues deletes all matches
    mm.set(1, { id: 1 });
    mm.set(1, { id: 2 });
    expect(mm.deleteValues(1, { id: 1 }, eq)).toBe(2);
    expect(mm.get(1)).toEqual([{ id: 2 }]);
  });

  it('navigable methods return entry tuples [K, V[]]; pollFirst/pollLast delete whole buckets', () => {
    const mm = new TreeMultiMap<number, string>();
    mm.set(2, 'b');
    mm.set(1, 'a');
    mm.set(3, 'c');

    expect(mm.first()).toEqual([1, ['a']]);
    expect(mm.last()).toEqual([3, ['c']]);
    expect(mm.ceiling(2)).toEqual([2, ['b']]);
    expect(mm.floor(2)).toEqual([2, ['b']]);
    expect(mm.higher(2)).toEqual([3, ['c']]);
    expect(mm.lower(2)).toEqual([1, ['a']]);

    const pf = mm.pollFirst();
    expect(pf).toEqual([1, ['a']]);
    expect(mm.has(1)).toBe(false);

    const pl = mm.pollLast();
    expect(pl).toEqual([3, ['c']]);
    expect(mm.has(3)).toBe(false);
  });

  it('flatEntries()/entriesOf()/valuesOf() provide entry-flat views', () => {
    const mm = new TreeMultiMap<number, string>();
    mm.set(1, 'a');
    mm.set(1, 'b');
    mm.set(2, 'x');

    expect([...mm.entriesOf(1)]).toEqual([
      [1, 'a'],
      [1, 'b']
    ]);
    expect([...mm.valuesOf(1)]).toEqual(['a', 'b']);

    expect([...mm.flatEntries()]).toEqual([
      [1, 'a'],
      [1, 'b'],
      [2, 'x']
    ]);
  });
});
