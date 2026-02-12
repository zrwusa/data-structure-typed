import { BST, Range } from '../../../../src';

describe('BST range/pruning coverage', () => {
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
