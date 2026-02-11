import { BST } from '../../../../src';

describe('BST _deleteByKey coverage', () => {
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
