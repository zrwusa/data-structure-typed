import { RedBlackTree } from '../../../../src';

describe('RedBlackTree hint cache maintenance compare-update branches', () => {
  it('direct attach left: updates min cache via compare(newKey,hMin.key) < 0 when hMin is real', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 10, 100, 60]) t.set(k, k);
    const hint = t.getNode(60)!;

    // Ensure direct attach path.
    hint._left = t.NIL as any;

    const oldMin = (t as any)._header._left.key;
    expect(oldMin).toBe(10);

    t.setWithHintNode(5, 5, hint);
    expect((t as any)._header._left.key).toBe(5);
  });

  it('direct attach right: updates max cache via compare(newKey,hMax.key) > 0 when hMax is real', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 10, 100, 40]) t.set(k, k);
    const hint = t.getNode(40)!;

    // Ensure direct attach path.
    hint._right = t.NIL as any;

    const oldMax = (t as any)._header._right.key;
    expect(oldMax).toBe(100);

    t.setWithHintNode(200, 200, hint);
    expect((t as any)._header._right.key).toBe(200);
  });

  it('pred.right attach: can update min/max cache via compare checks when inserting a new extreme', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 10, 100, 60]) t.set(k, k);
    const hint = t.getNode(60)!;
    const pred = t.getNode(50)!;

    // Force pred.right attach path.
    pred._parent = hint as any;
    pred._right = t.NIL as any;
    hint._left = pred as any;

    t.setWithHintNode(5, 5, hint);
    expect((t as any)._header._left.key).toBe(5);
  });

  it('succ.left attach: can update min/max cache via compare checks when inserting a new extreme', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [50, 10, 100, 40]) t.set(k, k);
    const hint = t.getNode(40)!;
    const succ = t.getNode(50)!;

    succ._parent = hint as any;
    succ._left = t.NIL as any;
    hint._right = succ as any;

    t.setWithHintNode(200, 200, hint);
    expect((t as any)._header._right.key).toBe(200);
  });

  it('_insertFixup: breaks when parent is RED but grandparent is missing (gp undefined)', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    const z = (t as any).createNode(1, 1);
    const p = (t as any).createNode(0, 0);
    p.color = 'RED';
    p.parent = undefined;
    z.parent = p;

    // Should hit `if (!gp) break;` and return without throwing.
    expect(() => (t as any)._insertFixup(z)).not.toThrow();
  });
});
