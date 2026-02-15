import { RedBlackTree } from '../../../../src';

class RBTTransplantCorruptRoot extends RedBlackTree<number, number> {
  protected override _transplant(u: any, v: any): void {
    super._transplant(u, v);
    // Corrupt _root only (header.parent remains canonical), so delete() fallback cond-expr
    // `this.isRealNode(this._root) ? ... : undefined` can take the false branch.
    (this as any)._root = this.NIL;
  }
}

describe('RedBlackTree remaining-branch coverage', () => {
  it('covers hint cache-maintenance binary-expr false paths (no cache update)', () => {
    // direct attach left: hint.left empty, but extremes exist elsewhere.
    const t1 = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 1, 100, 60]) t1.set(k, k);
    const h60 = t1.getNode(60)!;

    // Force hint.left to be empty (but keep global min/max as real).
    h60._left = t1.NIL as any;

    const min1 = (t1 as any)._header._left.key;
    const max1 = (t1 as any)._header._right.key;

    t1.setWithHintNode(55, 55, h60);
    expect((t1 as any)._header._left.key).toBe(min1);
    expect((t1 as any)._header._right.key).toBe(max1);

    // direct attach right: hint.right empty.
    const t2 = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 1, 100, 40]) t2.set(k, k);
    const h40 = t2.getNode(40)!;

    h40._right = t2.NIL as any;

    const min2 = (t2 as any)._header._left.key;
    const max2 = (t2 as any)._header._right.key;

    t2.setWithHintNode(45, 45, h40);
    expect((t2 as any)._header._left.key).toBe(min2);
    expect((t2 as any)._header._right.key).toBe(max2);

    // pred.right attach: force hint.left to be a predecessor whose right slot is empty.
    const t3 = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 1, 100, 60]) t3.set(k, k);
    const h60b = t3.getNode(60)!;
    const pred40 = t3.getNode(50)!; // reuse an existing real node as predecessor anchor

    pred40.parent = h60b as any;
    pred40._right = t3.NIL as any;
    h60b._left = pred40 as any;

    const min3 = (t3 as any)._header._left.key;
    const max3 = (t3 as any)._header._right.key;

    t3.setWithHintNode(55, 55, h60b);
    expect((t3 as any)._header._left.key).toBe(min3);
    expect((t3 as any)._header._right.key).toBe(max3);

    // succ.left attach: force hint.right to be a successor whose left slot is empty.
    const t4 = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 1, 100, 40]) t4.set(k, k);
    const h40b = t4.getNode(40)!;
    const succ60 = t4.getNode(50)!; // reuse an existing real node as successor anchor

    succ60.parent = h40b as any;
    succ60._left = t4.NIL as any;
    h40b._right = succ60 as any;

    const min4 = (t4 as any)._header._left.key;
    const max4 = (t4 as any)._header._right.key;

    t4.setWithHintNode(45, 45, h40b);
    expect((t4 as any)._header._left.key).toBe(min4);
    expect((t4 as any)._header._right.key).toBe(max4);
  });

  it('covers _setKVNode boundary max update mapMode branches (defined + undefined)', () => {
    const t = new RedBlackTree<number, string>(); // mapMode default
    t.set(10, 'mid');
    t.set(5, 'min');
    t.set(15, 'max');

    // defined: should store.set
    t.set(15, 'max2');
    expect(t.get(15)).toBe('max2');

    // undefined overwrites value in node-index mapMode
    t.set(15, undefined as any);
    expect(t.get(15)).toBe(undefined);
  });

  it('covers delete(predicate) path and delete(node) ternary branch', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15]) t.set(k, k);

    // delete(predicate)
    const r1 = t.delete((node) => node?.key === 5);
    expect(r1.length).toBe(1);
    expect(t.has(5)).toBe(false);

    // delete(node)
    const n15 = t.getNode(15)!;
    const r2 = t.delete(n15);
    expect(r2.length).toBe(1);
    expect(t.has(15)).toBe(false);
  });

  it('covers delete cache fallback cond-expr false branch when _root is corrupted to NIL', () => {
    const t = new RBTTransplantCorruptRoot([], { isMapMode: false });
    for (const k of [10, 5, 15, 1, 20]) t.set(k, k);

    // Force fallback recompute block by corrupting min/max nodes.
    (t as any)._minNode = undefined;
    (t as any)._maxNode = undefined;

    // Delete a node so size remains >0.
    t.delete(1);

    // Restore root so subsequent operations/tests aren't affected.
    (t as any)._root = (t as any)._header.parent;
  });
});
