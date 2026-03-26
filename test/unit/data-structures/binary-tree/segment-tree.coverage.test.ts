import { SegmentTree } from '../../../../src';

describe('SegmentTree remaining branch coverage', () => {
  it('build(start>end) returns a zero-sum node (covers start>end guard)', () => {
    const st = new SegmentTree([1, 2, 3]);
    const n = st.build(2, 1);
    expect(n.start).toBe(2);
    expect(n.end).toBe(1);
    expect(n.sum).toBe(0);
  });

  it('querySumByRange returns NaN when descending into missing left subtree (j<=mid && !cur.left)', () => {
    const st = new SegmentTree([10, 20]);
    const root = st.root!;

    // Corrupt to remove left child.
    root.left = undefined;

    expect(Number.isNaN(st.querySumByRange(0, 0))).toBe(true);
  });

  it('querySumByRange returns NaN when descending into missing right subtree (i>mid && !cur.right)', () => {
    const st = new SegmentTree([10, 20]);
    const root = st.root!;

    // Corrupt to remove right child.
    root.right = undefined;

    expect(Number.isNaN(st.querySumByRange(1, 1))).toBe(true);
  });
});
