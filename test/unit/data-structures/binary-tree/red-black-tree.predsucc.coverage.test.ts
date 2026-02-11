import { RedBlackTree } from '../../../../src';

describe('RedBlackTree predecessor/successor coverage', () => {
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
