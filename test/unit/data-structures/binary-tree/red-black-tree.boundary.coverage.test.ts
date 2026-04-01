import { RedBlackTree } from '../../../../src';

describe('RedBlackTree boundary coverage', () => {
  describe('boundary corruption repair', () => {
    it('min-attach: when header._right is corrupted to NIL, branch mirrors max cache to new min', () => {
      let tree: RedBlackTree<number, number> = new RedBlackTree<number>();
      let active = false;
      let flipped = false;
      const comparator = (a: number, b: number) => {
        // Flip once during the boundary pre-check, before the attach happens.
        if (active && !flipped && tree) {
          flipped = true;
          (tree as any)._header._right = tree.NIL;
        }
        return a - b;
      };

      tree = new RedBlackTree<number, number>([], { isMapMode: false, comparator });
      tree.set(10, 10);
      tree.set(5, 5);
      tree.set(15, 15);

      // Boundary insert smaller than current min.
      active = true;
      tree.set(1, 1);
      active = false;

      // Repair branch should have mirrored max cache when header._right was NIL.
      expect((tree as any)._header._right.key).toBe(1);

      // Restore correct max cache so subsequent tests/users aren't affected.
      const root = (tree as any)._root;
      (tree as any)._setMaxCache(tree.isRealNode(root) ? tree.getRightMost((n: any) => n, root) : undefined);
      expect((tree as any)._header._right.key).toBe(15);
    });

    it('max-attach: when header._left is corrupted to NIL, branch initializes min cache during max attach', () => {
      let tree: RedBlackTree<number, number> = new RedBlackTree<number>();
      let active = false;
      let flipped = false;
      const comparator = (a: number, b: number) => {
        if (active && !flipped && tree) {
          flipped = true;
          (tree as any)._header._left = tree.NIL;
        }
        return a - b;
      };

      tree = new RedBlackTree<number, number>([], { isMapMode: false, comparator });
      tree.set(10, 10);
      tree.set(5, 5);
      tree.set(15, 15);

      // Boundary insert larger than current max.
      active = true;
      tree.set(100, 100);
      active = false;

      // Observe the branch effect before repairing (min cache got initialized).
      expect((tree as any)._header._left.key).toBe(100);

      // Restore correct min cache.
      const root = (tree as any)._root;
      (tree as any)._setMinCache(tree.isRealNode(root) ? tree.getLeftMost((n: any) => n, root) : undefined);
      expect((tree as any)._header._left.key).toBe(5);
    });
  });

  describe('boundary max update', () => {
    it('mapMode: updating existing max key with defined value hits store.set branch in cMax===0 fast-path', () => {
      const t = new RedBlackTree<number, string>(); // mapMode default

      t.set(10, 'mid');
      t.set(5, 'min');
      t.set(15, 'max');

      // Update existing max key with a defined value.
      t.set(15, 'max2');

      expect(t.get(15)).toBe('max2');
      // Assert store updated (fast-path uses store.set).
      expect((t as any)._store.get(15)?.value).toBe('max2');
    });
  });

  describe('boundary attach null/undefined', () => {
    it('min boundary attach works when min.left is null', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);
      t.set(5, 5);

      const minNode = t.getNode(5)!;
      // Force the boundary condition to treat left as empty via null.
      (minNode as any)._left = null;

      t.set(1, 1);

      expect(t.getNode(1)?.parent?.key).toBe(5);
      expect((t as any)._header._left.key).toBe(1);
    });

    it('min boundary attach works when min.left is undefined', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);
      t.set(5, 5);

      const minNode = t.getNode(5)!;
      // Force the boundary condition to treat left as empty via undefined.
      (minNode as any)._left = undefined;

      t.set(1, 1);

      expect(t.getNode(1)?.parent?.key).toBe(5);
      expect((t as any)._header._left.key).toBe(1);
    });

    it('max boundary attach works when max.right is null/undefined', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);
      t.set(15, 15);

      const maxNode = t.getNode(15)!;
      // First cover null.
      (maxNode as any)._right = null;
      t.set(20, 20);
      expect(t.getNode(20)?.parent?.key).toBe(15);
      expect((t as any)._header._right.key).toBe(20);

      // Now cover undefined on the new max.
      const maxNode2 = t.getNode(20)!;
      (maxNode2 as any)._right = undefined;
      t.set(25, 25);
      expect(t.getNode(25)?.parent?.key).toBe(20);
      expect((t as any)._header._right.key).toBe(25);
    });
  });

  describe('boundary attach stale cache', () => {
    it('boundary max attach repairs stale min cache when header._left === NIL', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);
      t.set(5, 5);

      const NIL = (t as any).NIL;

      // Stale min cache: header._left is NIL, but tree is non-empty.
      (t as any)._header._left = NIL;

      // Insert new maximum; should take boundary max attach path and hit:
      // if (header._left === NIL) this._setMinCache(newNode)
      t.set(20, 20);

      expect((t as any)._header._right.key).toBe(20);
      expect((t as any)._header._left).not.toBe(NIL);

      // Under stale/corrupted cache conditions, the boundary fast path mirrors min to the inserted node.
      // (In normal operation header._left would not be NIL when the tree is non-empty.)
      expect((t as any)._header._left.key).toBe(20);
    });
  });

  describe('boundary update', () => {
    it('updating existing min/max via boundary cache fast paths does not change size', () => {
      const t = new RedBlackTree<number, string>([], { isMapMode: false });

      t.set(10, 'a');
      t.set(5, 'min');
      t.set(15, 'max');

      const size0 = t.size;

      // Update existing min key: should hit cMin===0 fast-path.
      expect(t.set(5, 'min2')).toBe(true);
      expect(t.size).toBe(size0);
      expect(t.getNode(5)?.value).toBe('min2');

      // Update existing max key: should hit cMax===0 fast-path.
      expect(t.set(15, 'max2')).toBe(true);
      expect(t.size).toBe(size0);
      expect(t.getNode(15)?.value).toBe('max2');
    });
  });
});
