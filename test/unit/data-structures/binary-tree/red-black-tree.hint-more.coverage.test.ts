import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

class RBTWithBadCreate extends RedBlackTree<number, number> {
  override createNode(key: number, value?: number): any {
    // Simulate unexpected internal failure so setWithHintNode guard branches are covered.
    // Keys chosen to avoid falling back to _setKVNode boundary attach (which assumes createNode always succeeds).
    if (key === 7 || key === 6 || key === 17 || key === 14) return undefined;
    return super.createNode(key, value);
  }
}

describe('RedBlackTree setWithHintNode more branch coverage', () => {
  it('covers c0===0 update (set mode + mapMode undefined/value)', () => {
    // set mode
    const s = new RedBlackTree<number, number>([], { isMapMode: false });
    s.set(10, 1);
    const h10 = s.getNode(10)!;
    s.setWithHintNode(10, 2, h10);
    expect(s.getNode(10)?.value).toBe(2);

    // mapMode: value !== undefined uses store.set; value === undefined uses _setValue path.
    const m = new RedBlackTree<number, number>();
    m.set(10, 1);
    const mh10 = m.getNode(10)!;
    m.setWithHintNode(10, 3, mh10);
    expect(m.get(10)).toBe(3);

    // undefined update overwrites value in node-index mapMode.
    m.setWithHintNode(10, undefined as any, mh10);
    expect(m.get(10)).toBe(undefined);
  });

  it('covers c0<0: direct attach to hint.left, pred fallback, and pred.right attach', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    // direct attach: hint.left is empty
    t.set(10, 10);
    const h10 = t.getNode(10)!;
    const n5 = t.setWithHintNode(5, 5, h10)!;
    expect(n5.key).toBe(5);

    // pred fallback: key equals predecessor (cmp(pred.key,key) >= 0)
    t.setWithHintNode(5, 55, h10);
    expect(t.getNode(5)?.value).toBe(55);

    // pred.right attach: insert between pred(5) and hint(10)
    const n7 = t.setWithHintNode(7, 7, h10)!;
    expect(n7.key).toBe(7);
    expect(t.getNode(7)?.value).toBe(7);
  });

  it('covers c0>0: direct attach to hint.right, succ fallback, and succ.left attach', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    // direct attach: hint.right is empty
    t.set(10, 10);
    const h10 = t.getNode(10)!;
    const n15 = t.setWithHintNode(15, 15, h10)!;
    expect(n15.key).toBe(15);

    // succ fallback: key equals successor (cmp(succ.key,key) <= 0)
    t.setWithHintNode(15, 155, h10);
    expect(t.getNode(15)?.value).toBe(155);

    // succ.left attach: insert between hint(10) and succ(15)
    const n12 = t.setWithHintNode(12, 12, h10)!;
    expect(n12.key).toBe(12);
    expect(t.getNode(12)?.value).toBe(12);
  });

  it('covers guard branches where createNode unexpectedly fails (returns undefined)', () => {
    const t = new RBTWithBadCreate([], { isMapMode: false });
    t.set(10, 10);
    const h10 = t.getNode(10)!;

    // c0<0 direct attach guard (newNode not real)
    expect(t.setWithHintNode(7, 7, h10)).toBeUndefined();

    // ensure left is real so we go pred-right attach guard
    t.setWithHintNode(5, 5, h10);
    expect(t.setWithHintNode(6, 6, h10)).toBeUndefined();

    // c0>0 direct attach guard (hint.right is empty)
    expect(t.setWithHintNode(17, 17, h10)).toBeUndefined();

    // ensure right is real so we go succ-left attach guard (key between hint and succ)
    t.setWithHintNode(15, 15, h10);
    expect(t.setWithHintNode(14, 14, h10)).toBeUndefined();
  });

  it('covers setWithHintNode fallback when hint is not real', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(1, 1);

    // Passing NIL should be treated as not-real and fallback to normal set.
    const out = t.setWithHintNode(2, 2, t.NIL as any);
    expect(out?.key).toBe(2);
  });
});
