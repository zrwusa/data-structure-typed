import { Deque } from '../../../../src';

describe('Deque remaining branch coverage (batch 2)', () => {
  it('unshiftMany covers toElementFn branch (and is executed at all)', () => {
    const d = new Deque<number, { v: number }>([], {
      toElementFn: (r: { v: number }) => r.v
    });

    expect(d.unshiftMany([{ v: 1 }, { v: 2 }])).toEqual([true, true]);
    expect(d.toArray()).toEqual([2, 1]);
  });

  it('splice(start) uses default deleteCount = length - start', () => {
    const d = new Deque<number>();
    d.pushMany([1, 2, 3, 4]);

    // omit deleteCount to hit the default-arg branch
    const removed = d.splice(1);

    expect(removed.toArray()).toEqual([2, 3, 4]);
    expect(d.toArray()).toEqual([1]);
  });

  it('shrinkToFit covers wrap-around bucketFirst > bucketLast branch', () => {
    const d = new Deque<number>();

    // Force an internal wrap-around layout (reachable-only: test-side corruption).
    (d as any)._length = 1;
    (d as any)._bucketFirst = 2;
    (d as any)._bucketLast = 1;
    (d as any)._bucketCount = 4;
    (d as any)._buckets = [[0], [1], [2], [3]];

    expect(() => d.shrinkToFit()).not.toThrow();
    expect((d as any)._bucketFirst).toBe(0);
    expect((d as any)._bucketLast).toBe(3);
    expect((d as any)._buckets.length).toBe(4);
  });
});
