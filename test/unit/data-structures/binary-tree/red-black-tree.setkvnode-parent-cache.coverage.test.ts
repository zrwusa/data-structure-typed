import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

class RBTBadKeyValue extends RedBlackTree<number, number> {
  // Force set(node) to hit `if (!this.isRealNode(newNode)) return false;`
  protected override _keyValueNodeOrEntryToNodeAndValue(
    _keyNodeOrEntry: any,
    _value?: any
  ): [RedBlackTreeNode<number, number> | null | undefined, number | undefined] {
    return [undefined, undefined];
  }
}

describe('RedBlackTree _setKVNode parent==hMin/hMax cache maintenance coverage', () => {
  it('post-insert cache maintenance: parent===hMax && lastCompared>0 updates max cache when header._right is corrupted to an interior node', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15, 1, 20]) t.set(k, k);

    const n10 = t.getNode(10)!;

    // Corrupt header max cache to an interior node that already has a right subtree,
    // so boundary max attach fast-path is skipped.
    (t as any)._header._right = n10;

    // Insert a key that will attach as the right child of 10 in the normal path.
    // (10.right exists (15), so it will descend; but 13 will attach as left of 15, not 10.
    // So ensure 10.right is empty for parent===hMax; but that would re-enable boundary.
    // Instead, force shape: make 10.right NIL temporarily (only for this coverage test).
    n10._right = t.NIL as any;

    // With corrupted hMax=10 and 10.right NIL, boundary block would try to attach as right of maxN;
    // but boundary block only runs when cMin>0 with minN=header._left. Keep minN such that cMin<=0 by corrupting min to a larger key.
    (t as any)._header._left = n10;

    t.set(12, 12);

    // Should have updated max cache to the newly inserted node via parent===hMax branch.
    expect((t as any)._header._right.key).toBe(12);

    // Repair caches (best-effort).
    const root = (t as any)._header.parent;
    (t as any)._root = root;
    (t as any)._setMinCache(t.getLeftMost((x: any) => x, root));
    (t as any)._setMaxCache(t.getRightMost((x: any) => x, root));
  });

  it('post-insert cache maintenance: parent===hMin && lastCompared<0 updates min cache when header._left is corrupted to an interior node', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15, 1, 20]) t.set(k, k);

    const n10 = t.getNode(10)!;

    // Corrupt header min cache to an interior node.
    (t as any)._header._left = n10;
    // Ensure boundary min attach is skipped: 10.left is real by default (5), so ok.

    // Insert a key that will attach as the left child of 10 (normal path):
    // force 10.left to be NIL temporarily to make parent===10.
    n10._left = t.NIL as any;

    // Also corrupt max so we don't enter max boundary block.
    (t as any)._header._right = n10;

    t.set(7, 7);

    expect((t as any)._header._left.key).toBe(7);

    // Repair caches.
    const root = (t as any)._header.parent;
    (t as any)._root = root;
    (t as any)._setMinCache(t.getLeftMost((x: any) => x, root));
    (t as any)._setMaxCache(t.getRightMost((x: any) => x, root));
  });

  it('set(node) early-return branch: _keyValueNodeOrEntryToNodeAndValue returns undefined node', () => {
    const t = new RBTBadKeyValue([], { isMapMode: false });
    const n = new RedBlackTreeNode<number, number>(1, 1, 'BLACK');
    expect(t.set(n, 1)).toBe(false);
  });
});
