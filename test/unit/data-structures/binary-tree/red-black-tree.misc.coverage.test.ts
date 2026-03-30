import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

// --- from remaining-branches ---
class RBTTransplantCorruptRoot extends RedBlackTree<number, number> {
  protected override _transplant(u: any, v: any): void {
    super._transplant(u, v);
    // Corrupt _root only (header.parent remains canonical), so delete() fallback cond-expr
    // `this.isRealNode(this._root) ? ... : undefined` can take the false branch.
    (this as any)._root = this.NIL;
  }
}

describe('RedBlackTree misc coverage', () => {

  describe('internal factory', () => {
  it('_createLike default iterable branch returns empty like-kind', () => {
      const t = new RedBlackTree<number, number>();
      t.set(1, 1);

      const like = (t as any)._createLike();
      expect(like).toBeInstanceOf(RedBlackTree);
      expect(like.size).toBe(0);
    });

    it('_createInstance and _setRoot keep header.parent in sync', () => {
      const t = new RedBlackTree<number, number>();

      const inst = (t as any)._createInstance();
      const NIL = (inst as any).NIL;

      // new instance should have header.parent pointing at NIL
      expect((inst as any)._header.parent).toBe(NIL);

      // For coverage: explicitly set root to undefined and ensure header.parent remains NIL.
      (inst as any)._setRoot(undefined);
      expect((inst as any)._header.parent).toBe(NIL);
    });
  });

  describe('internal walk', () => {
  it('_findNodeByKey covers header.parent ?? NIL and child ?? NIL branches', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);

      // header.parent ?? NIL (set to undefined)
      (t as any)._header.parent = undefined;
      expect((t as any)._findNodeByKey(10)).toBeUndefined();

      // Restore canonical root pointer.
      (t as any)._header.parent = (t as any)._root;

      // Force missing children to exercise `cur.left ?? NIL` and `cur.right ?? NIL`.
      const root = (t as any)._header.parent;
      root._left = undefined;
      root._right = undefined;

      expect((t as any)._findNodeByKey(5)).toBeUndefined();
      expect((t as any)._findNodeByKey(15)).toBeUndefined();
    });

    it('_insert covers current.left/right ?? NIL branches when root child pointers are undefined', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);

      const root = (t as any)._header.parent;

      // Insert left with root._left undefined
      root._left = undefined;
      const n5 = new RedBlackTreeNode<number, number>(5, 5, 'BLACK');
      expect(t.set(n5)).toBe(true);

      // Reset to single root
      t.clear();
      t.set(10, 10);

      const root2 = (t as any)._header.parent;
      // Insert right with root._right undefined
      root2._right = undefined;
      const n15 = new RedBlackTreeNode<number, number>(15, 15, 'BLACK');
      expect(t.set(n15)).toBe(true);
    });

    it('_setKVNode covers header._left ?? NIL when header._left is undefined (no boundary fast path)', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);

      // Corrupt cache pointer so `header._left ?? NIL` uses NIL.
      (t as any)._header._left = undefined;

      // Should still insert normally.
      expect(t.set(5, 5)).toBe(true);
      expect(t.getNode(5)).toBeTruthy();
    });
  });

  describe('misc input', () => {
  it('delete(null) returns false and does not throw', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(1, 1);
      expect(t.delete(null as any)).toBe(false);
      expect(t.size).toBe(1);
    });

    it('delete(undefined) returns false and does not throw', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(1, 1);
      expect(t.delete(undefined as any)).toBe(false);
      expect(t.size).toBe(1);
    });
  });

  describe('predecessor/successor', () => {
  it('covers predecessor/successor: subtree-walk, parent-climb, and undefined edges', () => {
      const t = new RedBlackTree<number, string>([], { isMapMode: false });

      // Build a tree with nodes that have (and do not have) left/right subtrees.
      //            20
      //         /      \
      //       10        30
      //     /   \     /   \
      //    5    15   25   35
      //        /
      //       13
      for (const k of [20, 10, 30, 5, 15, 25, 35, 13]) t.set(k, String(k));

      const n20 = t.getNode(20)!;
      const n15 = t.getNode(15)!;
      const n5 = t.getNode(5)!;
      const n35 = t.getNode(35)!;

      // predecessor: has left subtree -> walk to right-most of left.
      expect((t as any)._predecessorOf(n15)?.key).toBe(13);

      // predecessor: no left subtree -> climb parents.
      expect((t as any)._predecessorOf(n20)?.key).toBe(15);

      // predecessor of min -> undefined.
      expect((t as any)._predecessorOf(n5)).toBeUndefined();

      // successor: has right subtree -> walk to left-most of right.
      expect((t as any)._successorOf(n20)?.key).toBe(25);

      // successor: no right subtree -> climb parents.
      expect((t as any)._successorOf(n15)?.key).toBe(20);

      // successor of max -> undefined.
      expect((t as any)._successorOf(n35)).toBeUndefined();
    });
  });

  describe('reachable branches (coverage)', () => {
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

  describe('reachable branch (batch 3)', () => {
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

  describe('reachable branch (batch 4)', () => {
  it('setWithHintNode: covers header._left/_right nullish-coalescing RHS (?? NIL) in all 4 ultra-fast attach variants', () => {
      const t = new RedBlackTree<number, number>();

      t.setMany([
        [10, 10],
        [20, 20],
        [30, 30]
      ]);

      const n10 = t.getNode(10)!;
      const n20 = t.getNode(20)!;
      const n30 = t.getNode(30)!;

      const clearHeaderMinMaxToUndefined = () => {
        // Simulate a stale/partial cache state. This is a realistic “repair” scenario:
        // the code uses `?? NIL` to tolerate undefined here.
        (t as any)._header._left = undefined;
        (t as any)._header._right = undefined;
      };

      // 1) direct attach as left of hint
      clearHeaderMinMaxToUndefined();
      expect(t.setWithHintNode(5, 5, n10)?.key).toBe(5);

      // 2) attach as right of predecessor
      clearHeaderMinMaxToUndefined();
      expect(t.setWithHintNode(15, 15, n20)?.key).toBe(15);

      // 3) direct attach as right of hint
      clearHeaderMinMaxToUndefined();
      expect(t.setWithHintNode(40, 40, n30)?.key).toBe(40);

      // 4) attach as left of successor
      clearHeaderMinMaxToUndefined();
      expect(t.setWithHintNode(25, 25, n20)?.key).toBe(25);

      // Sanity: tree still orders correctly.
      expect(t.getLeftMost(n => n)?.key).toBe(5);
      expect(t.getRightMost(n => n)?.key).toBe(40);
    });
  });

  describe('remaining-branch', () => {
  it('covers hint cache-maintenance binary-expr false paths (no cache update)', () => {
      // direct attach left: hint.left empty, but extremes exist elsewhere.
      const t1 = new RedBlackTree<number, number>([], { isMapMode: false });
      for (const k of [50, 1, 100, 60]) t1.set(k, k);
      const h60 = t1.getNode(60)!;

      // Force hint.left to be empty (but keep global min/max as real).
      h60._left = t1.NIL as any;

      const min1 = (t1 as any)._header._left.key;
      const max1 = (t1 as any)._header._right.key;

      t1.setWithHintNode(55, 55, h60);
      expect((t1 as any)._header._left.key).toBe(min1);
      expect((t1 as any)._header._right.key).toBe(max1);

      // direct attach right: hint.right empty.
      const t2 = new RedBlackTree<number, number>([], { isMapMode: false });
      for (const k of [50, 1, 100, 40]) t2.set(k, k);
      const h40 = t2.getNode(40)!;

      h40._right = t2.NIL as any;

      const min2 = (t2 as any)._header._left.key;
      const max2 = (t2 as any)._header._right.key;

      t2.setWithHintNode(45, 45, h40);
      expect((t2 as any)._header._left.key).toBe(min2);
      expect((t2 as any)._header._right.key).toBe(max2);

      // pred.right attach: force hint.left to be a predecessor whose right slot is empty.
      const t3 = new RedBlackTree<number, number>([], { isMapMode: false });
      for (const k of [50, 1, 100, 60]) t3.set(k, k);
      const h60b = t3.getNode(60)!;
      const pred40 = t3.getNode(50)!; // reuse an existing real node as predecessor anchor

      pred40.parent = h60b as any;
      pred40._right = t3.NIL as any;
      h60b._left = pred40 as any;

      const min3 = (t3 as any)._header._left.key;
      const max3 = (t3 as any)._header._right.key;

      t3.setWithHintNode(55, 55, h60b);
      expect((t3 as any)._header._left.key).toBe(min3);
      expect((t3 as any)._header._right.key).toBe(max3);

      // succ.left attach: force hint.right to be a successor whose left slot is empty.
      const t4 = new RedBlackTree<number, number>([], { isMapMode: false });
      for (const k of [50, 1, 100, 40]) t4.set(k, k);
      const h40b = t4.getNode(40)!;
      const succ60 = t4.getNode(50)!; // reuse an existing real node as successor anchor

      succ60.parent = h40b as any;
      succ60._left = t4.NIL as any;
      h40b._right = succ60 as any;

      const min4 = (t4 as any)._header._left.key;
      const max4 = (t4 as any)._header._right.key;

      t4.setWithHintNode(45, 45, h40b);
      expect((t4 as any)._header._left.key).toBe(min4);
      expect((t4 as any)._header._right.key).toBe(max4);
    });

    it('covers _setKVNode boundary max update mapMode branches (defined + undefined)', () => {
      const t = new RedBlackTree<number, string>(); // mapMode default
      t.set(10, 'mid');
      t.set(5, 'min');
      t.set(15, 'max');

      // defined: should store.set
      t.set(15, 'max2');
      expect(t.get(15)).toBe('max2');

      // undefined overwrites value in node-index mapMode
      t.set(15, undefined as any);
      expect(t.get(15)).toBe(undefined);
    });

    it('covers delete(predicate) path and delete(node) ternary branch', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      // delete(predicate)
      const r1 = t.delete((node) => node?.key === 5);
      expect(r1).toBe(true);
      expect(t.has(5)).toBe(false);

      // delete(node)
      const n15 = t.getNode(15)!;
      const r2 = t.delete(n15);
      expect(r2).toBe(true);
      expect(t.has(15)).toBe(false);
    });

    it('covers delete cache fallback cond-expr false branch when _root is corrupted to NIL', () => {
      const t = new RBTTransplantCorruptRoot([], { isMapMode: false });
      for (const k of [10, 5, 15, 1, 20]) t.set(k, k);

      // Force fallback recompute block by corrupting min/max nodes.
      (t as any)._minNode = undefined;
      (t as any)._maxNode = undefined;

      // Delete a node so size remains >0.
      t.delete(1);

      // Restore root so subsequent operations/tests aren't affected.
      (t as any)._root = (t as any)._header.parent;
    });
  });
});
