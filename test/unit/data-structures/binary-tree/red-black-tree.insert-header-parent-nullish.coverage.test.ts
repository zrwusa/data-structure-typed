import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

describe('RedBlackTree _insert header.parent ?? NIL coverage', () => {
  it('covers _insert with header.parent undefined (current starts at NIL)', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    // Force the _insert walk to start from NIL.
    (t as any)._header.parent = undefined;
    (t as any)._root = t.NIL;

    const n = new RedBlackTreeNode<number, number>(10, 10, 'BLACK');
    expect(t.set(n, 10)).toBe(true);

    // Should have established a real root via _setRoot.
    expect(t.getNode(10)?.key).toBe(10);
  });
});
