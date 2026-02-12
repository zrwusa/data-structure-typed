import { RedBlackTree } from '../../../../src';

describe('RedBlackTree boundary corruption repair coverage', () => {
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
    let tree: RedBlackTree<number, number> = new RedBlackTree<number>();;
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
