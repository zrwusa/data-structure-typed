import { RedBlackTree } from '../../../../src';

describe('RedBlackTree setWithHintNode cache-maintenance no-update branches', () => {
  it('direct attach does not update min/max caches when inserting within existing extremes', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    // Establish extremes.
    for (const k of [50, 1, 100]) t.set(k, k);

    const hint = t.getNode(50)!;
    expect((t as any)._header._left.key).toBe(1);
    expect((t as any)._header._right.key).toBe(100);

    // direct attach left of hint, but key is not new min/max
    const n40 = t.setWithHintNode(40, 40, hint);
    expect(n40?.key).toBe(40);
    expect((t as any)._header._left.key).toBe(1);
    expect((t as any)._header._right.key).toBe(100);

    // direct attach right of hint, but still within extremes
    const n60 = t.setWithHintNode(60, 60, hint);
    expect(n60?.key).toBe(60);
    expect((t as any)._header._left.key).toBe(1);
    expect((t as any)._header._right.key).toBe(100);
  });

  it('pred.right / succ.left attach does not update min/max caches when inserting within existing extremes', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 1, 100, 40, 60]) t.set(k, k);
    const hint = t.getNode(50)!;

    // pred.right attach: ensure hint.left is real so we take pred path.
    expect(t.getNode(40)).toBeTruthy();
    const n45 = t.setWithHintNode(45, 45, hint);
    expect(n45?.key).toBe(45);

    // succ.left attach: ensure hint.right is real so we take succ path.
    expect(t.getNode(60)).toBeTruthy();
    const n55 = t.setWithHintNode(55, 55, hint);
    expect(n55?.key).toBe(55);

    expect((t as any)._header._left.key).toBe(1);
    expect((t as any)._header._right.key).toBe(100);
  });
});
