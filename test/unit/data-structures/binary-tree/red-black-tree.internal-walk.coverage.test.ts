import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

describe('RedBlackTree internal walk coverage', () => {
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
