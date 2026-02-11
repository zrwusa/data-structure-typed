import { Deque } from '../../../../src';

describe('Deque additional branch coverage', () => {
  it('unshiftMany() default-arg empty iterable returns []', () => {
    const d = new Deque<number>();
    expect(d.unshiftMany()).toEqual([]);
  });

  it('splice clamps deleteCount when negative / too large (covers both clamp branches)', () => {
    const d = new Deque<number>();
    d.pushMany([1, 2, 3, 4]);

    // deleteCount < 0 => clamp to 0
    const r0 = d.splice(1, -1, 99);
    expect(r0.toArray()).toEqual([]);

    // deleteCount too large => clamp to length-start
    const r1 = d.splice(1, 999);
    expect(r1.toArray()).toEqual([99, 2, 3, 4]);
    expect(d.toArray()).toEqual([1]);
  });

  it('shrinkToFit returns early when bucketFirst===bucketLast (covers that return branch)', () => {
    const d = new Deque<number>();
    d.push(1);
    // Force bucketFirst===bucketLast and length>0
    (d as any)._bucketFirst = 0;
    (d as any)._bucketLast = 0;
    d.shrinkToFit();
    expect(d.length).toBe(1);
  });

  it('mapSame uses the thisArg===undefined branch', () => {
    const d = new Deque<number>();
    d.pushMany([1, 2, 3]);
    const out = d.mapSame(v => v * 2);
    expect(out.toArray()).toEqual([2, 4, 6]);
  });

  it('map() uses thisArg branch and also covers options??{} merge path', () => {
    const d = new Deque<number>();
    d.pushMany([1, 2]);
    const ctx = { add: 10 };

    const out = d.map(
      function (this: any, v: number) {
        return v + this.add;
      },
      undefined,
      ctx
    );

    expect(out.toArray()).toEqual([11, 12]);
  });

  it('_setBucketSize does not reinit buckets when length>0 (covers length===0 false branch)', () => {
    const d = new Deque<number>();
    d.pushMany([1, 2, 3]);
    const before = (d as any)._buckets;
    (d as any)._setBucketSize((d as any)._bucketSize);
    expect((d as any)._buckets).toBe(before);
  });

  it('_getIterator yields only defined values (covers v!==undefined true branch)', () => {
    const d = new Deque<number>();
    d.pushMany([1, 2, 3]);
    // Corrupt one slot to undefined; _getIterator should skip it.
    const loc = (d as any)._getBucketAndPosition(1);
    (d as any)._buckets[loc.bucketIndex][loc.indexInBucket] = undefined;

    const got: number[] = [];
    for (const v of d) got.push(v);
    expect(got).toEqual([1, 3]);
  });

  it('_createLike default-arg path can be called with no args', () => {
    const d = new Deque<number>();
    const like = (d as any)._createLike();
    expect(like.length).toBe(0);
  });

  it('_getReverseIterator handles v===undefined by not yielding it', () => {
    const d = new Deque<number>();
    d.pushMany([1, 2, 3]);

    // Make last element undefined
    const loc = (d as any)._getBucketAndPosition(2);
    (d as any)._buckets[loc.bucketIndex][loc.indexInBucket] = undefined;

    const it = (d as any)._getReverseIterator();
    const got: number[] = [];
    for (const v of it) got.push(v);
    expect(got).toEqual([2, 1]);
  });
});
