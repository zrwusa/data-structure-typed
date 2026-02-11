import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

describe('RedBlackTree remaining reachable branches (coverage)', () => {
  it('mapMode updates existing MAX key with defined value via boundary cMax===0 path inside _setKVNode (covers store.set branch)', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: true });
    t.set(1, 'a');
    t.set(2, 'b');

    // Bypass _setKV store.has fast-path by corrupting the store (node exists but store.has(key) is false).
    (t as any)._store.delete(2);

    // key==max => boundary cMax===0 update in _setKVNode
    t.set(2, 'bb');
    expect(t.get(2)).toBe('bb');
  });

  it('mapMode updates existing interior key with defined value via normal search update branch inside _setKVNode', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: true });
    t.set(10, 'x');
    t.set(5, 'a');
    t.set(15, 'z');

    // Bypass _setKV store.has fast-path for this key.
    (t as any)._store.delete(10);

    // Update a non-min/non-max key to avoid boundary min/max equality early returns.
    t.set(10, 'xx');
    expect(t.get(10)).toBe('xx');
  });

  it('normal-path search uses right ?? NIL fallback when a node child pointer is undefined', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(10, 10);
    t.set(5, 5);

    const n5 = t.getNode(5)!;

    // Corrupt: right pointer becomes undefined (instead of NIL).
    // This should exercise `current = current.right ?? NIL` fallback.
    (n5 as any).right = undefined;

    t.set(7, 7);
    expect(t.get(7)).toBe(7);
  });

  it('setWithHintNode cache maintenance evaluates compare operands in all 4 fast-attach variants', () => {
    // (1) c0 < 0, direct attach to hint.left
    {
      const t = new RedBlackTree<number, number>();
      t.set(10, 10);
      t.set(20, 20);
      // Ensure caches are real nodes (not NIL)
      (t as any)._header._left = t.getNode(10);
      (t as any)._header._right = t.getNode(20);

      const hint = t.getNode(20)!;
      const n = t.setWithHintNode(15, 15, hint)!;
      expect(n.key).toBe(15);
    }

    // (2) c0 < 0, attach as right child of predecessor
    {
      const t = new RedBlackTree<number, number>();
      t.set(10, 10);
      t.set(20, 20);
      // Make hint.left real so direct attach is skipped
      t.set(5, 5);
      (t as any)._header._left = t.getNode(5);
      (t as any)._header._right = t.getNode(20);

      const hint = t.getNode(20)!;
      const n = t.setWithHintNode(15, 15, hint)!;
      expect(n.key).toBe(15);
    }

    // (3) c0 > 0, direct attach to hint.right
    {
      const t = new RedBlackTree<number, number>();
      t.set(10, 10);
      t.set(20, 20);
      (t as any)._header._left = t.getNode(10);
      (t as any)._header._right = t.getNode(20);

      const hint = t.getNode(20)!;
      const n = t.setWithHintNode(30, 30, hint)!;
      expect(n.key).toBe(30);
    }

    // (4) c0 > 0, attach as left child of successor
    {
      const t = new RedBlackTree<number, number>();
      t.set(10, 10);
      t.set(30, 30);
      t.set(20, 20);
      // ensure hint.right is real (30) so direct attach is skipped
      (t as any)._header._left = t.getNode(10);
      (t as any)._header._right = t.getNode(30);

      const hint = t.getNode(20)!;
      const n = t.setWithHintNode(25, 25, hint)!;
      expect(n.key).toBe(25);
    }
  });

  it('_leftRotate and _rightRotate early-return when pivot or required child is missing', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    // undefined pivot
    (t as any)._leftRotate(undefined);
    (t as any)._rightRotate(undefined);

    // pivot exists but missing required child
    const x = new RedBlackTreeNode<number, number>(1);
    (x as any).right = undefined;
    const y = new RedBlackTreeNode<number, number>(2);
    (y as any).left = undefined;

    (t as any)._leftRotate(x);
    (t as any)._rightRotate(y);
  });
});
