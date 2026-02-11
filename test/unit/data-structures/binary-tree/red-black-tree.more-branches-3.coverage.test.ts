import { RedBlackTree } from '../../../../src';

describe('RedBlackTree additional reachable branch coverage (batch 3)', () => {
  it('insertion cache: hits parent===hMax and parent===hMin else-if branches', () => {
    const t = new RedBlackTree<number, number>();

    t.set(2, 2);
    // new max: parent should be current max
    t.set(3, 3);

    t.clear();

    t.set(2, 2);
    // new min: parent should be current min
    t.set(1, 1);

    // Sanity: min/max nodes exist and are ordered.
    expect(t.getLeftMost((n: any) => n)?.key).toBe(1);
    expect(t.getRightMost((n: any) => n)?.key).toBe(2);
  });

  it('setWithHintNode: executes min/max cache logical-expr second operands across all 4 ultra-fast attach variants', () => {
    const t = new RedBlackTree<number, number>();

    // Seed non-empty tree so hMin/hMax are real and `hMin===NIL || compare(...)` evaluates RHS.
    t.setMany([
      [10, 10],
      [20, 20],
      [30, 30]
    ]);

    const n10 = t.getNode(10)!;
    const n20 = t.getNode(20)!;
    const n30 = t.getNode(30)!;

    // 1) direct attach as left of hint (new global min)
    const n5 = t.setWithHintNode(5, 5, n10);
    expect(n5?.key).toBe(5);

    // 2) attach as right of predecessor
    const n15 = t.setWithHintNode(15, 15, n20);
    expect(n15?.key).toBe(15);

    // 3) direct attach as right of hint (new global max)
    const n40 = t.setWithHintNode(40, 40, n30);
    expect(n40?.key).toBe(40);

    // 4) attach as left of successor
    const n25 = t.setWithHintNode(25, 25, n20);
    expect(n25?.key).toBe(25);

    expect(t.getLeftMost((n: any) => n)?.key).toBe(5);
    expect(t.getRightMost((n: any) => n)?.key).toBe(40);
  });
});
