import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

// --- from delete-fixup ---
function validateRedBlackTree<K, V>(tree: RedBlackTree<K, V>) {
  const NIL = tree.NIL as unknown as RedBlackTreeNode<K, V>;
  const root = tree.root as unknown as RedBlackTreeNode<K, V> | undefined;
  if (!root || root === NIL) return;
  expect(root.color).toBe('BLACK');
  const seen = new Set<RedBlackTreeNode<K, V>>();
  const check = (node: RedBlackTreeNode<K, V>, min: any, max: any) => {
    if (node === NIL) return;
    expect(seen.has(node)).toBe(false);
    seen.add(node);
    if (min !== undefined) expect((node.key as any) > min).toBe(true);
    if (max !== undefined) expect((node.key as any) < max).toBe(true);
    const left = (node.left ?? NIL) as RedBlackTreeNode<K, V>;
    const right = (node.right ?? NIL) as RedBlackTreeNode<K, V>;
    if (node.color === 'RED') {
      expect(left.color).toBe('BLACK');
      expect(right.color).toBe('BLACK');
    }
    check(left, min, node.key as any);
    check(right, node.key as any, max);
  };
  check(root, undefined, undefined);
}

describe('RedBlackTree delete coverage', () => {

  describe('delete-fixup', () => {
  it('CLRS-style delete sequence exercises multiple fixup branches', () => {
      // Classic CLRS insertion set.
      const t = new RedBlackTree<number, number>();
      for (const k of [7, 3, 18, 10, 22, 8, 11, 26]) t.set(k, k);
      validateRedBlackTree(t);

      // Deletes from CLRS examples / common RB delete discussions.
      for (const k of [18, 11, 3, 10, 22, 26, 8, 7]) {
        t.delete(k);
        validateRedBlackTree(t);
      }

      expect(t.size).toBe(0);
    });

    it('deleting many black leaves triggers fixup in both left/right sibling orientations', () => {
      const t = new RedBlackTree<number, number>();
      // Build a reasonably balanced tree.
      for (let i = 1; i <= 31; i++) t.set(i, i);
      validateRedBlackTree(t);

      // Delete odds then evens.
      for (let i = 1; i <= 31; i += 2) {
        t.delete(i);
        validateRedBlackTree(t);
      }
      for (let i = 2; i <= 30; i += 2) {
        t.delete(i);
        validateRedBlackTree(t);
      }

      expect(t.size).toBe(0);
    });
  });

  describe('delete() successor/transplant branch', () => {
  it('covers successor.parent === nodeToDelete with real replacementNode (sets replacement.parent = successor)', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });

      // Build:
      //      10
      //     /  \
      //    5   15
      //          \
      //          20
      for (const k of [10, 5, 15, 20]) t.set(k, k);

      const n20 = t.getNode(20)!;
      expect(n20.parent?.key).toBe(15);

      t.delete(10);

      // successor should be 15; replacement should be 20 (real), and its parent should be set to successor.
      expect(t.has(10)).toBe(false);
      expect(t.has(5)).toBe(true);
      expect(t.has(15)).toBe(true);
      expect(t.has(20)).toBe(true);

      expect(t.getNode(20)?.parent?.key).toBe(15);
    });

    it('covers successor.parent === nodeToDelete with non-real replacementNode (skips replacement.parent assignment)', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });

      // Build:
      //      10
      //     /  \
      //    5   15
      // Successor is 15; successor.right is NIL (replacement non-real).
      for (const k of [10, 5, 15]) t.set(k, k);

      const s15 = t.getNode(15)!;
      // Ensure right is NIL (not null), so replacementNode will be non-real and guard is exercised.
      s15._right = t.NIL as any;

      t.delete(10);

      expect(t.has(10)).toBe(false);
      expect(t.has(5)).toBe(true);
      expect(t.has(15)).toBe(true);
    });

    it('covers successor.parent !== nodeToDelete branch (transplant successor, then rewire successor.right)', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });

      // Build right subtree where left-most successor is deeper:
      //        10
      //       /  \
      //      5    20
      //          /  \
      //         15  25
      //        /
      //       13   (successor of 10)
      for (const k of [10, 5, 20, 15, 25, 13]) t.set(k, k);

      const s13 = t.getNode(13)!;
      expect(s13.parent?.key).toBe(15);

      t.delete(10);

      expect(t.has(10)).toBe(false);
      // successor (13) should now be in the deleted node's position and have right subtree attached.
      const newRoot = (t as any)._root;
      expect(newRoot?.key).toBe(13);
      expect(t.has(20)).toBe(true);
      expect(t.getNode(20)?.parent?.key).toBe(13);
    });
  });

  describe('_deleteFixup right-child (mirror) branches', () => {
    it('should trigger right-child fixup path when deleting causes right-side double-black', () => {
      // Insert sequence designed to create a tree where right-child deletion
      // requires the mirror-side fixup path
      const t = new RedBlackTree<number, number>();
      // Build a specific tree shape
      for (const k of [20, 10, 30, 5, 15, 25, 35, 3, 7]) {
        t.add(k, k);
      }
      // Delete right-leaning nodes to trigger right-child fixup
      t.delete(35);
      t.delete(30);
      t.delete(25);
      expect(t.has(35)).toBe(false);
      expect(t.has(30)).toBe(false);
      expect(t.has(25)).toBe(false);
      // Tree should still be valid
      expect(t.size).toBe(6);
    });

    it('should handle right-child red sibling case in fixup', () => {
      const t = new RedBlackTree<number, number>();
      // Create tree that forces right-child with red left sibling
      for (const k of [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85]) {
        t.add(k, k);
      }
      // Delete several right-side nodes
      t.delete(85);
      t.delete(80);
      t.delete(75);
      t.delete(70);
      expect(t.size).toBe(11);
      // Verify tree integrity by checking all remaining keys exist
      for (const k of [50, 30, 20, 40, 10, 25, 35, 45, 60, 55, 65]) {
        expect(t.has(k)).toBe(true);
      }
    });

    it('should handle successive right-child deletions', () => {
      const t = new RedBlackTree<number, number>();
      for (const k of [10, 20, 30, 40, 50, 60, 70, 80]) {
        t.add(k, k);
      }
      t.delete(80);
      t.delete(70);
      t.delete(60);
      t.delete(50);
      expect(t.size).toBe(4);
      for (const k of [10, 20, 30, 40]) {
        expect(t.has(k)).toBe(true);
      }
    });

    it('should trigger right-child double-black fixup (mirror of left-child case)', () => {
      // Specifically designed: delete left-side nodes so the fixup
      // replacement node is a right child of its parent
      const t = new RedBlackTree<number, number>();
      for (const k of [40, 20, 60, 10, 30, 50, 70, 5, 15, 25, 35]) {
        t.add(k, k);
      }
      // Delete left-side leaves first
      t.delete(5);
      t.delete(10);
      t.delete(15);
      t.delete(20);
      expect(t.size).toBe(7);

      // Now delete more to trigger deeper rebalancing on left side
      t.delete(25);
      t.delete(30);
      expect(t.size).toBe(5);
    });

    it('should trigger mirror fixup via deterministic sequence', () => {
      // This specific insertion+deletion sequence is designed to produce
      // a right-child double-black node that needs the mirror fixup path
      const t = new RedBlackTree<number, number>();
      // Insert to create specific structure
      for (const k of [7, 3, 18, 10, 22, 8, 11, 26]) {
        t.add(k, k);
      }
      // Delete sequence that forces right-child fixup
      t.delete(3);
      t.delete(8);
      t.delete(7);
      expect(t.size).toBe(5);
    });

    it('should exercise all fixup branches with many deletions', () => {
      const t = new RedBlackTree<number, number>();
      const keys = Array.from({ length: 31 }, (_, i) => i + 1);
      for (const k of keys) t.add(k, k);
      for (let i = 1; i <= 15; i++) t.delete(i);
      expect(t.size).toBe(16);
      t.delete(31);
      t.delete(16);
      t.delete(30);
      t.delete(17);
      expect(t.size).toBe(12);
      for (let i = 18; i <= 29; i++) expect(t.has(i)).toBe(true);
    });

    it('should exercise right-child fixup via seeded pseudo-random deletions', () => {
      // Use multiple specific sequences known to trigger both fixup directions
      const sequences = [
        // Sequence 1: insert ascending, delete middle-out
        { insert: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], delete: [8,4,12,2,6,10,14,1,3,5,7] },
        // Sequence 2: insert descending, delete from left
        { insert: [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1], delete: [1,2,3,4,5,6,7,8,9,10] },
        // Sequence 3: insert random-like, delete ascending
        { insert: [8,4,12,2,6,10,14,1,3,5,7,9,11,13,15], delete: [1,2,3,4,5,6,7,8,9,10,11,12] },
        // Sequence 4: designed for right-child black node fixup
        { insert: [20,10,30,5,15,25,35,2,7,13,17,23,27,33,37], delete: [37,35,33,30,27,25,23,20] },
      ];

      for (const seq of sequences) {
        const t = new RedBlackTree<number, number>();
        for (const k of seq.insert) t.add(k, k);
        for (const k of seq.delete) {
          t.delete(k);
          // Verify tree integrity after each deletion
          const remaining = seq.insert.filter(x => !seq.delete.slice(0, seq.delete.indexOf(k) + 1).includes(x));
          for (const r of remaining) expect(t.has(r)).toBe(true);
        }
      }
    });
  });
});
