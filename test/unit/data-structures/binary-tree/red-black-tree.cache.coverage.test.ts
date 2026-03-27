import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

describe('RedBlackTree cache coverage', () => {

  describe('delete cache fallback', () => {
  it('forces min/max fallback recomputation branches after deleting min/max', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15, 3, 7, 12, 18]) t.set(k, k);

      // Delete current min and max to set willDeleteMin/Max paths.
      const NIL = (t as any).NIL;
      const minNode = (t as any)._header._left;
      const maxNode = (t as any)._header._right;
      expect(minNode).not.toBe(NIL);
      expect(maxNode).not.toBe(NIL);
      const minKey = minNode.key as number;
      const maxKey = maxNode.key as number;

      // After first delete, corrupt caches so fallback recompute branches run.
      t.delete(minKey);
      (t as any)._minNode = undefined;

      // Delete max and also corrupt max cache.
      t.delete(maxKey);
      (t as any)._maxNode = undefined;

      // Trigger an additional delete to enter the cache-update block with size>0.
      t.delete(10);

      // Should still have correct header min/max after recomputation.
      const keys = [...t].map(([k]) => k).sort((a, b) => a - b);
      if (keys.length > 0) {
        expect((t as any)._header._left.key).toBe(keys[0]);
        expect((t as any)._header._right.key).toBe(keys[keys.length - 1]);
      }
    });

    it('size<=0 branch clears min/max caches', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(1, 1);

      t.delete(1);

      expect(t.size).toBe(0);
      // expect(t.min).toBeUndefined();
      // expect(t.max).toBeUndefined();
      const NIL = (t as any).NIL;
      expect((t as any)._header._left).toBe(NIL);
      expect((t as any)._header._right).toBe(NIL);
    });
  });

  describe('cache edge', () => {
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

  describe('stale cache insert', () => {
  it('stale header min/max caches trigger comparison-based cache repair on insertion', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);
      t.set(5, 5);
      t.set(15, 15);

      const n10 = t.getNode(10)!;

      // Corrupt caches to point at an interior node.
      (t as any)._header._left = n10;
      (t as any)._header._right = n10;

      // Insert a new min (not a boundary attach, because min cache is stale and minN.left is real).
      t.set(1, 1);
      expect((t as any)._header._left.key).toBe(1);

      // Re-corrupt and insert a new max.
      (t as any)._header._left = n10;
      (t as any)._header._right = n10;

      t.set(20, 20);
      expect((t as any)._header._right.key).toBe(20);
    });

    it('mapMode update with undefined value does not take store-fast-path (no throw)', () => {
      const t = new RedBlackTree<number, string>([], { isMapMode: true });
      t.set(1, 'a');
      expect(t.get(1)).toBe('a');

      // nextValue is undefined => should bypass map-mode store.has fast-path
      // and go through normal set logic.
      t.set(1, undefined as any);
      // node-index mapMode: undefined overwrites.
      expect(t.get(1)).toBe(undefined);
    });
  });

  describe('insert cache nullish', () => {
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

  describe('_insert header.parent ?? NIL', () => {
  it('covers _insert with header.parent undefined (current starts at NIL)', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });

      // Force the _insert walk to start from NIL.
      (t as any)._header.parent = undefined;
      (t as any)._root = t.NIL;

      const n = new RedBlackTreeNode<number, number>(10, 10, 'BLACK');
      expect(t.set(n, 10)).toBe(true);

      // Should have established a real root via _setRoot.
      expect(t.getNode(10)?.key).toBe(10);
    });
  });

  describe('cache update via parent===hMax/hMin fast path', () => {
    it('line 601: parent === hMax && lastCompared > 0 (append to max)', () => {
      // Need: parent of new node IS current hMax, and new node > parent.
      // Insert ascending sequence so each new node's parent is current max.
      const t = new RedBlackTree<number, number>();
      t.add([10, 10]); // root, min=max=10
      t.add([20, 20]); // parent=10 (=hMax), lastCompared>0 → line 601
      expect(t.getRightMost()).toBe(20);
      t.add([30, 30]); // after rebalance, parent of 30 might be 20 (=hMax) → line 601
      expect(t.getRightMost()).toBe(30);
    });

    it('line 603: parent === hMin && lastCompared < 0 (prepend to min)', () => {
      const t = new RedBlackTree<number, number>();
      t.add([30, 30]); // root, min=max=30
      t.add([20, 20]); // parent=30 (=hMin), lastCompared<0 → line 603
      expect(t.getLeftMost()).toBe(20);
      t.add([10, 10]); // parent might be 20 (=hMin) → line 603
      expect(t.getLeftMost()).toBe(10);
    });

    it('else branch: new min/max but parent is neither hMin nor hMax', () => {
      const t = new RedBlackTree<number, number>();
      // Build a tree where min/max are leaves deep in the tree
      for (const k of [50, 30, 70, 20, 40, 60, 80]) t.add([k, k]);
      // Now insert 5: parent=20 (which may not be hMin after rebalancing)
      // and 90: parent=80 (which may not be hMax)
      t.add([5, 5]);
      expect(t.getLeftMost()).toBe(5);
      t.add([90, 90]);
      expect(t.getRightMost()).toBe(90);
    });
  });
});
