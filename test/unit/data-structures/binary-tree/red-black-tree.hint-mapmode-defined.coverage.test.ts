import { RedBlackTree } from '../../../../src';

describe('RedBlackTree setWithHintNode mapMode defined-value branches', () => {
  it('direct attach left/right with defined values uses store.set branches', () => {
    const t = new RedBlackTree<number, number>(); // mapMode default
    t.set(10, 10);
    const h10 = t.getNode(10)!;

    const n5 = t.setWithHintNode(5, 5, h10);
    expect(n5?.key).toBe(5);
    expect((t as any)._store.get(5)?.value).toBe(5);

    const n15 = t.setWithHintNode(15, 15, h10);
    expect(n15?.key).toBe(15);
    expect((t as any)._store.get(15)?.value).toBe(15);
  });

  it('pred.right and succ.left attach with defined values uses store.set branches', () => {
    const t = new RedBlackTree<number, number>();
    t.set(10, 10);
    const h10 = t.getNode(10)!;

    // Ensure left is real so we take pred path.
    t.setWithHintNode(5, 5, h10);
    const n7 = t.setWithHintNode(7, 7, h10);
    expect(n7?.key).toBe(7);
    expect((t as any)._store.get(7)?.value).toBe(7);

    // Ensure right is real so we take succ path.
    t.setWithHintNode(15, 15, h10);
    const n12 = t.setWithHintNode(12, 12, h10);
    expect(n12?.key).toBe(12);
    expect((t as any)._store.get(12)?.value).toBe(12);
  });
});
