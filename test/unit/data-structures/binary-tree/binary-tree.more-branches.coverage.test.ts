import { BinaryTree } from '../../../../src';

describe('BinaryTree extra branch coverage', () => {
  it('isBST(RECURSIVE) evaluates both standard and inverse checks when standard fails (covers isStandardBST || isInverseBST second operand)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });

    // Manually wire an inverse BST (left > root > right)
    const root = t.createNode(10, 10);
    const left = t.createNode(15, 15);
    const right = t.createNode(5, 5);
    root.left = left;
    root.right = right;
    left.parent = root;
    right.parent = root;

    // Force as root (avoid BFS insertion semantics)
    (t as any)._setRoot(root);

    // This shape violates standard BST ordering, so the first check is false, forcing evaluation of the inverse check.
    expect(t.isBST(root as any, 'RECURSIVE' as any)).toBe(false);
  });

  it('getPathToRoot with isReverse=false takes the non-reverse branch', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const root = t.createNode(1, 1);
    const child = t.createNode(2, 2);
    root.left = child;
    child.parent = root;
    (t as any)._setRoot(root);

    const out = t.getPathToRoot(child as any, (n: any) => n?.key, false);
    expect(out).toEqual([2, 1]);
  });

  it('getSuccessor returns undefined when x is not a real node (covers !isRealNode guard)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    expect(t.getSuccessor(null as any)).toBeUndefined();
  });

  it('_dfs uses default parameters (default args) and returns in-order keys', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    // BinaryTree.set is BFS: insert 2 as left child of 1.
    t.set(1, 1);
    t.set(2, 2);

    const out = (t as any)._dfs();
    // default pattern is IN; with BFS-built tree (1 with left=2), IN traversal is [2, 1]
    expect(out).toEqual([2, 1]);
  });

  it('_keyValueNodeOrEntryToNodeAndValue([undefined, v]) returns [undefined, undefined] (covers entry-undefined guard)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const out = (t as any)._keyValueNodeOrEntryToNodeAndValue([undefined as any, 1] as any);
    expect(out).toEqual([undefined, undefined]);
  });
});
