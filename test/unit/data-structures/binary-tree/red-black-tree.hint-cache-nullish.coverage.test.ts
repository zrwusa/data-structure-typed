import { RedBlackTree } from '../../../../src';

describe('RedBlackTree hint cache maintenance with nullish/NIL header caches', () => {
  it('direct attach left/right: when header caches are NIL, hMin/hMax short-circuit branches initialize caches', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(10, 10);
    const hint = t.getNode(10)!;

    // Corrupt caches to NIL so (hMin===NIL || ...) short-circuits true.
    (t as any)._header._left = t.NIL;
    (t as any)._header._right = t.NIL;

    const n5 = t.setWithHintNode(5, 5, hint)!;
    expect((t as any)._header._left).toBe(n5);
    expect((t as any)._header._right).toBe(n5);

    // Corrupt again and attach on the other side.
    (t as any)._header._left = t.NIL;
    (t as any)._header._right = t.NIL;

    const n15 = t.setWithHintNode(15, 15, hint)!;
    expect((t as any)._header._left).toBe(n15);
    expect((t as any)._header._right).toBe(n15);

    // Repair to real extremes to avoid leakage.
    const root = (t as any)._root;
    (t as any)._setMinCache(t.isRealNode(root) ? t.getLeftMost((n: any) => n, root) : undefined);
    (t as any)._setMaxCache(t.isRealNode(root) ? t.getRightMost((n: any) => n, root) : undefined);
  });

  it('pred.right / succ.left attach: when header caches are NIL, hMin/hMax short-circuit branches initialize caches', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(10, 10);
    const hint = t.getNode(10)!;

    // Create real left/right so we take pred/succ attach paths.
    t.setWithHintNode(5, 5, hint);
    t.setWithHintNode(15, 15, hint);

    // pred.right attach, with caches NIL.
    (t as any)._header._left = t.NIL;
    (t as any)._header._right = t.NIL;

    const n7 = t.setWithHintNode(7, 7, hint)!;
    expect((t as any)._header._left).toBe(n7);
    expect((t as any)._header._right).toBe(n7);

    // succ.left attach, with caches NIL.
    (t as any)._header._left = t.NIL;
    (t as any)._header._right = t.NIL;

    const n12 = t.setWithHintNode(12, 12, hint)!;
    expect((t as any)._header._left).toBe(n12);
    expect((t as any)._header._right).toBe(n12);

    // Repair to real extremes.
    const root = (t as any)._root;
    (t as any)._setMinCache(t.isRealNode(root) ? t.getLeftMost((n: any) => n, root) : undefined);
    (t as any)._setMaxCache(t.isRealNode(root) ? t.getRightMost((n: any) => n, root) : undefined);
  });
});
