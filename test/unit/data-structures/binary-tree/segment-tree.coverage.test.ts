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
    expect(st.query(0, 999)).toBe(500500);
    expect(st.query(0, 99)).toBe(5050);
  });

  it('maxRight traverses left (dig deeper) branch', () => {
    // Need a case where the left child's combined value exceeds the predicate
    // so the algorithm digs into the left subtree
    const st = SegmentTree.sum([100, 1, 1, 1, 1, 1, 1, 1]);
    // maxRight(0, s => s <= 50): first element alone (100) fails, so r = -1
    expect(st.maxRight(0, s => s <= 50)).toBe(-1);
    // maxRight(1, s => s <= 3): from index 1: sum(1)=1 ok, sum(1,2)=2 ok, sum(1,2,3)=3 ok, sum(1,2,3,4)=4 > 3
    expect(st.maxRight(1, s => s <= 3)).toBe(3);
  });

  it('minLeft traverses right (dig deeper) branch', () => {
    const st = SegmentTree.sum([1, 1, 1, 1, 1, 1, 1, 100]);
    // minLeft(7, s => s <= 50): last element alone (100) fails, so l = 8
    expect(st.minLeft(7, s => s <= 50)).toBe(8);
    // minLeft(6, s => s <= 3): from index 6 going left: sum(6)=1, sum(5,6)=2, sum(4,5,6)=3, sum(3..6)=4 > 3
    expect(st.minLeft(6, s => s <= 3)).toBe(4);
  });

  it('maxRight with left >= n', () => {
    const st = SegmentTree.sum([1, 2, 3]);
    expect(st.maxRight(10, s => s <= 100)).toBe(2); // clamped
  });

  it('minLeft with right < 0', () => {
    const st = SegmentTree.sum([1, 2, 3]);
    expect(st.minLeft(-1, s => s <= 100)).toBe(0);
  });

  it('print does not throw', () => {
    const st = SegmentTree.sum([1, 2, 3]);
    const spy = jest.spyOn(console, 'log').mockImplementation();
    st.print();
    expect(spy).toHaveBeenCalledWith([1, 2, 3]);
    spy.mockRestore();
  });

  it('iterator [Symbol.iterator] returns itself', () => {
    const st = SegmentTree.sum([1, 2]);
    const iter = st[Symbol.iterator]();
    expect(iter[Symbol.iterator]()).toBe(iter);
  });
});
