import { RedBlackTree } from '../../../../src';

describe('RedBlackTree delete() successor/transplant branch coverage', () => {
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
