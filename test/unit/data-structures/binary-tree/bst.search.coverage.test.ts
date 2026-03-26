import { BST, Range } from '../../../../src';
import { Range } from '../../../../src/common';

describe('BST search coverage', () => {

  describe('search() fast-path', () => {
  it('search(node) uses node.key extraction branch and returns callback result', () => {
      const t = new BST<number, string>([], { isMapMode: false });
      t.set(10, 'a');
      t.set(5, 'b');
      t.set(15, 'c');

      const n5 = t.getNode(5)!;
      const out = t.search(n5, false, (n: any) => n.value);
      expect(out).toEqual(['b']);
    });

    it('search(entry) with null key returns [] (covers entry null-key guard in fast path)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = t.search([null as any, 1] as any);
      expect(out).toEqual([]);
    });

    it('search by key returns [] when startNode ensureNode fails', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = t.search(10 as any, false, (n: any) => n.key, null as any);
      expect(out).toEqual([]);
    });
  });

  describe('range/pruning', () => {
  it('getNodes(range) covers includeLow/includeHigh pruning branches', () => {
      const bst = new BST<number, number>();
      for (const k of [10, 5, 15, 3, 7, 12, 18]) bst.set(k, k);

      // includeLow/includeHigh true
      const r1 = new Range<number>(7, 12, true, true);
      expect(bst.getNodes(r1 as any).map(n => n.key)).toEqual([7, 10, 12]);

      // includeLow false (exclude 7)
      const r2 = new Range<number>(7, 12, false, true);
      expect(bst.getNodes(r2 as any).map(n => n.key)).toEqual([10, 12]);

      // includeHigh false (exclude 12)
      const r3 = new Range<number>(7, 12, true, false);
      expect(bst.getNodes(r3 as any).map(n => n.key)).toEqual([7, 10]);

      // exclude both ends
      const r4 = new Range<number>(7, 12, false, false);
      expect(bst.getNodes(r4 as any).map(n => n.key)).toEqual([10]);
    });

    it('getNodes(predicate) exercises predicate-search shouldVisitLeft/Right fallthrough', () => {
      const bst = new BST<number, number>();
      for (const k of [4, 2, 6, 1, 3, 5, 7]) bst.set(k, k);

      // Predicate that matches only leaf nodes, to force traversal and filtering.
      const nodes = bst.getNodes(node => !bst.isRealNode(node.left) && !bst.isRealNode(node.right));
      expect(nodes.map(n => n.key).sort((a, b) => a - b)).toEqual([1, 3, 5, 7]);

      // onlyOne=true should early-exit after first match (in-order => 1)
      const one = bst.getNodes(node => !bst.isRealNode(node.left) && !bst.isRealNode(node.right), true);
      expect(one).toHaveLength(1);
      expect(one[0].key).toBe(1);
    });

    it('rangeSearch overload [low, high] is accepted', () => {
      const bst = new BST<number, number>([10, 5, 15, 3, 7, 12, 18]);
      expect(bst.rangeSearch([7, 12])).toEqual([7, 10, 12]);
    });
  });

  describe('getNode() extra', () => {
  it('treats runtime Range input by forwarding to getNodes and returning first result', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15, 3, 7, 12, 18]) t.set(k, k);

      const range = new Range(6, 13, true, true);
      const n = t.getNode(range as any);
      expect(n?.key).toBe(7);
    });

    it('returns undefined when ensureNode(startNode) fails (startNode is null)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      // bypass type and pass null startNode
      const out = t.getNode(10 as any, null as any);
      expect(out).toBeUndefined();
    });
  });
});
