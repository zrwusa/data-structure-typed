import { RedBlackTree } from '../../../../src';

describe('RedBlackTree insert cache nullish coverage', () => {
  it('normal insert repairs nullish header._left/_right via (hMin===NIL || hMax===NIL) fast-path', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    // Build a non-empty tree so header.parent/root is real.
    for (const k of [10, 20, 30]) t.set(k, k);

    // Corrupt caches so boundary fast-path is skipped (minN becomes NIL via ??) and
    // post-insert cache maintenance sees hMin/hMax as NIL.
    (t as any)._header._left = undefined;
    (t as any)._header._right = undefined;

    t.set(25, 25);

    // After insertion, cache maintenance should have initialized both caches.
    expect((t as any)._header._left.key).toBe(25);
    expect((t as any)._header._right.key).toBe(25);

    // Repair caches to avoid polluting subsequent tests/users.
    const root = (t as any)._root;
    (t as any)._setMinCache(t.isRealNode(root) ? t.getLeftMost((n: any) => n, root) : undefined);
    (t as any)._setMaxCache(t.isRealNode(root) ? t.getRightMost((n: any) => n, root) : undefined);

    expect((t as any)._header._left.key).toBe(10);
    expect((t as any)._header._right.key).toBe(30);
  });
});
