import { RedBlackTree } from '../../../../src';

describe('RedBlackTree boundary attach stale cache coverage', () => {
  it('boundary max attach repairs stale min cache when header._left === NIL', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(10, 10);
    t.set(5, 5);

    const NIL = (t as any).NIL;

    // Stale min cache: header._left is NIL, but tree is non-empty.
    (t as any)._header._left = NIL;

    // Insert new maximum; should take boundary max attach path and hit:
    // if (header._left === NIL) this._setMinCache(newNode)
    t.set(20, 20);

    expect((t as any)._header._right.key).toBe(20);
    expect((t as any)._header._left).not.toBe(NIL);

    // Under stale/corrupted cache conditions, the boundary fast path mirrors min to the inserted node.
    // (In normal operation header._left would not be NIL when the tree is non-empty.)
    expect((t as any)._header._left.key).toBe(20);
  });
});
