import { RedBlackTree } from '../../../../src';

describe('RedBlackTree boundary attach null/undefined coverage', () => {
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
