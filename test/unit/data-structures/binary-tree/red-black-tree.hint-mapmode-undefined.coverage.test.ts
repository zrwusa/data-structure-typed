import { RedBlackTree } from '../../../../src';

describe('RedBlackTree setWithHintNode mapMode undefined-value branches', () => {
  it('direct attach left/right with undefined value stores nodes (node-index store)', () => {
    const t = new RedBlackTree<number, number>(); // mapMode default
    t.set(10, 10);
    const h10 = t.getNode(10)!;

    const n5 = t.setWithHintNode(5, undefined as any, h10);
    expect(n5?.key).toBe(5);
    expect(t.getNode(5)).toBeTruthy();
    expect((t as any)._store.has(5)).toBe(true);

    const n15 = t.setWithHintNode(15, undefined as any, h10);
    expect(n15?.key).toBe(15);
    expect(t.getNode(15)).toBeTruthy();
    expect((t as any)._store.has(15)).toBe(true);
  });

  it('pred.right and succ.left attach with undefined value hit _setValue branches', () => {
    const t = new RedBlackTree<number, number>();
    t.set(10, 10);
    const h10 = t.getNode(10)!;

    // Ensure left is real so we take the pred path.
    t.setWithHintNode(5, 5, h10);

    // Insert between pred(5) and hint(10): attaches as pred.right.
    const n7 = t.setWithHintNode(7, undefined as any, h10);
    expect(n7?.key).toBe(7);
    expect(t.getNode(7)).toBeTruthy();
    expect((t as any)._store.has(7)).toBe(true);

    // Ensure right is real so we take the succ path.
    t.setWithHintNode(15, 15, h10);

    // Insert between hint(10) and succ(15): attaches as succ.left.
    const n12 = t.setWithHintNode(12, undefined as any, h10);
    expect(n12?.key).toBe(12);
    expect(t.getNode(12)).toBeTruthy();
    expect((t as any)._store.has(12)).toBe(true);
  });
});
