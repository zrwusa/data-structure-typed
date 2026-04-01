import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

// --- from setkvnode-parent-cache ---
class RBTBadKeyValue extends RedBlackTree<number, number> {
  // Force set(node) to hit `if (!this.isRealNode(newNode)) return false;`
  protected override _keyValueNodeOrEntryToNodeAndValue(
    __keyNodeOrEntry: any,
    _value?: any
  ): [RedBlackTreeNode<number, number> | undefined, number | undefined] {
    return [undefined, undefined];
  }
}

// --- from setkvnode-uncovered ---
class RBTBadFixup extends RedBlackTree<number, number> {
  // Simulate an unexpected internal failure so `_setKVNode` hits the defensive `else return undefined`.
  protected override _insertFixup(__node: any): void {
    // Blow away root after "fixup".
    (this as any)._setRoot(undefined);
  }
}

// --- from set-inputs ---
class RBTWithBadInsert extends RedBlackTree<number, number> {
  // Simulate an internal failure where _insert reports CREATED but does not establish a real root.
  // This is purely to cover the defensive branch in set(node).
  protected override _insert(__node: RedBlackTreeNode<number, number>): any {
    // Ensure root stays NIL/undefined
    (this as any)._setRoot(undefined);
    return 'CREATED';
  }
}

describe('RedBlackTree setkvnode coverage', () => {
  describe('_setKVNode parent==hMin/hMax cache maintenance', () => {
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

  describe('_setKVNode branch', () => {
    it('normal search loop takes `current.right ?? NIL` with a real right child (covers binary-expr branch)', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      // Build a tree where root has a real right child.
      t.set(10, 10);
      t.set(15, 15);
      t.set(20, 20);

      // Skip boundary fast paths so we go through the normal search loop.
      (t as any)._header._left = undefined;

      // Insert a key greater than root so traversal takes the right-child branch with a real node.
      expect(t.set(25, 25)).toBe(true);
      expect(t.has(25)).toBe(true);
    });

    it('normal update path (mapMode) hits `_setValue` when nextValue is undefined (covers if/else at update)', () => {
      const t = new RedBlackTree<number, string>(); // mapMode default
      t.set(10, 'a');
      t.set(5, 'b');
      t.set(15, 'c');

      // Ensure we do NOT take boundary min/max update fast paths.
      (t as any)._header._left = undefined;
      (t as any)._header._right = undefined;

      // Update an existing key with undefined overwrites value in node-index mapMode.
      t.set(10, undefined as any);
      expect(t.get(10)).toBe(undefined);
    });

    it('boundary max-key update (mapMode) hits `_setValue` branch when nextValue is undefined', () => {
      const t = new RedBlackTree<number, string>(); // mapMode default
      t.set(10, 'mid');
      t.set(5, 'min');
      t.set(15, 'max');

      // Update existing max key with undefined overwrites value in node-index mapMode.
      t.set(15, undefined as any);
      expect(t.get(15)).toBe(undefined);
    });
  });

  describe('_setKVNode uncovered-branch', () => {
    it('covers normal-path current=header.parent ?? NIL when header.parent is undefined (starts at NIL)', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });

      // Force normal path (minN becomes NIL via ??) and start walk from NIL.
      (t as any)._header._left = undefined;
      (t as any)._header.parent = undefined;

      expect(t.set(1, 1)).toBe(true);
      expect(t.getNode(1)?.key).toBe(1);
    });

    it('covers normal-path `current.left ?? NIL` / `current.right ?? NIL` in the search loop', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);

      // Skip boundary fast paths so we go through the normal search loop.
      (t as any)._header._left = undefined;

      // Force missing children so `?? NIL` branches are taken.
      const root = (t as any)._header.parent;
      root._left = undefined;
      root._right = undefined;

      expect(t.set(5, 5)).toBe(true);
      expect(t.set(15, 15)).toBe(true);

      expect(t.has(5)).toBe(true);
      expect(t.has(15)).toBe(true);
    });

    it('covers boundary max-path reading `header._right ?? NIL` when header._right is undefined (safe comparator)', () => {
      // Comparator that tolerates undefined keys from NIL.
      const comparator = (a: number, b: any) => {
        if (b === undefined || b === null) return -1; // ensures cMax < 0 so we do not attach/update under NIL
        return a - b;
      };

      const t = new RedBlackTree<number, number>([], { isMapMode: false, comparator });
      t.set(10, 10);
      t.set(5, 5); // establish min

      // Corrupt max cache only; boundary block should read `header._right ?? NIL`.
      (t as any)._header._right = undefined;

      // Key > min so we enter the max boundary block, but safe comparator prevents NIL-attach.
      expect(t.set(8, 8)).toBe(true);
      expect(t.has(8)).toBe(true);

      // Repair max cache so we don't leak corruption.
      const root = (t as any)._root;
      (t as any)._setMaxCache(t.isRealNode(root) ? t.getRightMost((n: any) => n, root) : undefined);
    });

    it('covers defensive `return undefined` after fixup when root is not real (set returns false)', () => {
      const t = new RBTBadFixup([], { isMapMode: false });

      // Force normal path (avoid boundary attach) so we reach the fixup block.
      (t as any)._header._left = undefined;

      expect(t.set(1, 1)).toBe(false);
      expect(t.size).toBe(0);
    });
  });

  describe('set() input/defensive branches', () => {
    it('returns false for nullish key inputs in key/entry paths', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });

      expect(t.set(null as any)).toBe(false);
      expect(t.set(undefined as any)).toBe(false);

      // entry with null/undefined key
      expect(t.set([null as any, 1] as any)).toBe(false);
      expect(t.set([undefined as any, 1] as any)).toBe(false);
    });

    it('key-only path delegates to _setKV and supports mapMode fast path', () => {
      const t = new RedBlackTree<number, number>(); // mapMode default

      // insert
      expect(t.set(1, 10)).toBe(true);
      expect(t.get(1)).toBe(10);

      // update should hit _setKV fast-path (store.has)
      expect(t.set(1, 20)).toBe(true);
      expect(t.get(1)).toBe(20);

      // update for missing key must fall through to _setKVNode
      expect(t.set(2, 200)).toBe(true);
      expect(t.get(2)).toBe(200);
    });

    it('node insertion path: defensive branch returns false when root is not real after CREATED', () => {
      const t = new RBTWithBadInsert([], { isMapMode: false });
      const n = new RedBlackTreeNode<number, number>(1, 1, 'BLACK');

      expect(t.set(n)).toBe(false);
      expect(t.size).toBe(0);
    });

    it('node insertion path: UPDATED branch returns true and updates mapMode store via _setValue', () => {
      const t = new RedBlackTree<number, number>();

      // First insert via node
      const n1 = new RedBlackTreeNode<number, number>(1, 0 as any, 'BLACK');
      expect(t.set(n1, 10)).toBe(true);
      expect(t.get(1)).toBe(10);

      // Second node with same key should trigger UPDATED in _insert -> set() UPDATED branch.
      const n1b = new RedBlackTreeNode<number, number>(1, 0 as any, 'BLACK');
      expect(t.set(n1b, 99)).toBe(true);

      // mapMode uses _setValue, so value should reflect newValue.
      expect(t.get(1)).toBe(99);
    });
  });

  describe('update-branch', () => {
    it('mapMode: updating existing min/max with undefined value overwrites values (node-index store)', () => {
      const t = new RedBlackTree<number, string>(); // mapMode default

      t.set(10, 'mid');
      t.set(5, 'min');
      t.set(15, 'max');

      // Update min/max keys with undefined (bypasses store-fast-path, uses _setValue branch).
      t.set(5, undefined as any);
      t.set(15, undefined as any);

      // In node-index mapMode, node.value is the source of truth, so undefined overwrites.
      expect(t.get(5)).toBe(undefined);
      expect(t.get(15)).toBe(undefined);
    });

    it('set mode: updating an existing interior key uses current.value assignment branch', () => {
      const t = new RedBlackTree<number, string>([], { isMapMode: false });
      for (const k of [10, 5, 15, 12]) t.set(k, String(k));

      // key=12 is interior (not min/max)
      const size0 = t.size;
      t.set(12, 'twelve');
      expect(t.size).toBe(size0);
      expect(t.getNode(12)?.value).toBe('twelve');
    });
  });
});
