import { SegmentTree } from '../../../../src';

describe('SegmentTree remaining branch coverage', () => {
  it('update ignores out-of-range indices', () => {
    const st = SegmentTree.sum([1, 2, 3]);
    st.update(-1, 99);
    st.update(5, 99);
    expect(st.query(0, 2)).toBe(6); // unchanged
  });

  it('get returns identity for out-of-range indices', () => {
    const st = SegmentTree.sum([1, 2, 3]);
    expect(st.get(-1)).toBe(0);
    expect(st.get(10)).toBe(0);
  });

  it('query handles reversed range gracefully', () => {
    const st = SegmentTree.sum([1, 2, 3]);
    expect(st.query(2, 0)).toBe(0); // start > end after no clamping → identity
  });

  it('clone preserves merger behavior', () => {
    const st = SegmentTree.min([5, 2, 8]);
    const copy = st.clone();
    expect(copy.query(0, 2)).toBe(2);
    copy.update(1, 10);
    expect(copy.query(0, 2)).toBe(5);
    expect(st.query(0, 2)).toBe(2); // original unchanged
  });

  it('Iterator protocol with Array.from', () => {
    const st = SegmentTree.sum([10, 20, 30]);
    expect(Array.from(st)).toEqual([10, 20, 30]);
  });

  it('works with large arrays', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i + 1);
    const st = SegmentTree.sum(arr);
    // Sum of 1..1000 = 500500
    expect(st.query(0, 999)).toBe(500500);
    // Sum of first 100: 100*101/2 = 5050
    expect(st.query(0, 99)).toBe(5050);
  });
});
