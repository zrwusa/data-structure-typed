import { RedBlackTree } from '../../../../src';

describe('RedBlackTree cache edge coverage', () => {
  it('boundary min attach updates max cache when header._right is stale NIL', () => {
    const t = new RedBlackTree<number, number>();
    t.set(10, 10);

    // Simulate stale max cache.
    const NIL = (t as any).NIL;
    (t as any)._header._right = NIL;

    // Insert smaller than current min; min has no left -> boundary min attach path.
    t.set(5, 5);

    // After insertion, max cache should not remain NIL.
    expect((t as any)._header._right).not.toBe(NIL);
    expect((t as any)._maxNode).toBeDefined();
    expect((t as any)._header._right).toBe((t as any)._maxNode);
  });

  it('boundary max attach updates min cache when header._left is stale NIL', () => {
    const t = new RedBlackTree<number, number>();
    t.set(10, 10);

    // Simulate stale min cache.
    const NIL = (t as any).NIL;
    (t as any)._header._left = NIL;

    // Insert greater than current max; max has no right -> boundary max attach path.
    t.set(15, 15);

    // After insertion, min cache should not remain NIL.
    expect((t as any)._header._left).not.toBe(NIL);
    expect((t as any)._minNode).toBeDefined();
    expect((t as any)._header._left).toBe((t as any)._minNode);
  });
});
