import { BST, Range } from '../../../../src';

describe('BST delete coverage', () => {

  describe('_deleteByKey', () => {
  it('returns false when key not found', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      expect((t as any)._deleteByKey(999)).toBe(false);
      expect(t.size).toBe(3);
    });

    it('deletes node with no left child (node.left === undefined)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 15]) t.set(k, k);

      expect((t as any)._deleteByKey(10)).toBe(true);
      expect(t.has(10)).toBe(false);
      expect(t.has(15)).toBe(true);
    });

    it('deletes node with no right child (node.right === undefined)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5]) t.set(k, k);

      expect((t as any)._deleteByKey(10)).toBe(true);
      expect(t.has(10)).toBe(false);
      expect(t.has(5)).toBe(true);
    });

    it('deletes node with two children where successor is direct right child (succ.parent === node)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      //      10
      //     /  \
      //    5   15
      for (const k of [10, 5, 15]) t.set(k, k);

      expect((t as any)._deleteByKey(10)).toBe(true);
      expect(t.has(10)).toBe(false);
      expect(t.has(5)).toBe(true);
      expect(t.has(15)).toBe(true);

      // Root should now be 15.
      expect((t as any)._root?.key).toBe(15);
      expect((t as any)._root?.left?.key).toBe(5);
    });

    it('deletes node with two children where successor is deeper (succ.parent !== node) and minNode loop handles null left', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      //        10
      //       /  \
      //      5    20
      //          /  \
      //         15  25
      //        /
      //       13   (successor)
      for (const k of [10, 5, 20, 15, 25, 13]) t.set(k, k);

      // Make successor.left explicitly null to cover `x.left !== null` check in minNode loop.
      const n13 = t.getNode(13)!;
      n13._left = null as any;

      expect((t as any)._deleteByKey(10)).toBe(true);
      expect(t.has(10)).toBe(false);

      // New root should be successor (13).
      expect((t as any)._root?.key).toBe(13);
      expect(t.has(20)).toBe(true);
      expect(t.getNode(20)?.parent?.key).toBe(13);
    });
  });

  describe('deleteWhere', () => {
  it('deleteWhere(predicate) uses default args (onlyOne/startNode/iterationType)', () => {
      const bst = new BST<number, number>();
      for (const k of [4, 2, 6, 1, 3, 5, 7]) bst.set(k, k);

      // delete evens (should remove 2,4,6)
      const res = bst.deleteWhere(node => node.key % 2 === 0);
      expect(res.length).toBe(3);
      expect(bst.has(2)).toBe(false);
      expect(bst.has(4)).toBe(false);
      expect(bst.has(6)).toBe(false);

      // odd keys remain
      expect([...bst].map(([k]) => k).sort((a, b) => a - b)).toEqual([1, 3, 5, 7]);
    });

    it('deleteWhere(range, onlyOne=true) deletes a single match', () => {
      const bst = new BST<number, number>();
      for (const k of [10, 5, 15, 3, 7, 12, 18]) bst.set(k, k);

      const r = new Range<number>(7, 15, true, true);
      const before = bst.size;

      const res = bst.deleteWhere(r, true);
      expect(res.length).toBe(1);
      expect(bst.size).toBe(before - 1);
    });

    it('protected _createLike default iterable branch', () => {
      const bst = new BST<number, number>([2, 1, 3]);
      const like = (bst as any)._createLike();
      expect(like).toBeInstanceOf(BST);
      expect(like.size).toBe(0);
    });
  });
});
