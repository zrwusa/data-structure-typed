import { RedBlackTree } from '../../../../src';

describe('RedBlackTree additional reachable branch coverage (batch 4)', () => {
  it('setWithHintNode: covers header._left/_right nullish-coalescing RHS (?? NIL) in all 4 ultra-fast attach variants', () => {
    const t = new RedBlackTree<number, number>();

    t.setMany([
      [10, 10],
      [20, 20],
      [30, 30]
    ]);

    const n10 = t.getNode(10)!;
    const n20 = t.getNode(20)!;
    const n30 = t.getNode(30)!;

    const clearHeaderMinMaxToUndefined = () => {
      // Simulate a stale/partial cache state. This is a realistic “repair” scenario:
      // the code uses `?? NIL` to tolerate undefined here.
      (t as any)._header._left = undefined;
      (t as any)._header._right = undefined;
    };

    // 1) direct attach as left of hint
    clearHeaderMinMaxToUndefined();
    expect(t.setWithHintNode(5, 5, n10)?.key).toBe(5);

    // 2) attach as right of predecessor
    clearHeaderMinMaxToUndefined();
    expect(t.setWithHintNode(15, 15, n20)?.key).toBe(15);

    // 3) direct attach as right of hint
    clearHeaderMinMaxToUndefined();
    expect(t.setWithHintNode(40, 40, n30)?.key).toBe(40);

    // 4) attach as left of successor
    clearHeaderMinMaxToUndefined();
    expect(t.setWithHintNode(25, 25, n20)?.key).toBe(25);

    // Sanity: tree still orders correctly.
    expect(t.getLeftMost(n => n)?.key).toBe(5);
    expect(t.getRightMost(n => n)?.key).toBe(40);
  });
});
