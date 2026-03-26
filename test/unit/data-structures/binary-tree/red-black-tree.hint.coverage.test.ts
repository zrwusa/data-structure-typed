import { RedBlackTree } from '../../../../src';

// --- from hint-more ---
class RBTWithBadCreate extends RedBlackTree<number, number> {
  override createNode(key: number, value?: number): any {
    // Simulate unexpected internal failure so setWithHintNode guard branches are covered.
    // Keys chosen to avoid falling back to _setKVNode boundary attach (which assumes createNode always succeeds).
    if (key === 7 || key === 6 || key === 17 || key === 14) return undefined;
    return super.createNode(key, value);
  }
}

describe('RedBlackTree hint coverage', () => {

  describe('hint/update', () => {
  it('mapMode update fast-path keeps size and node reference stable', () => {
      const t = new RedBlackTree<number, string>([], { isMapMode: true });
      t.set(1, 'a');
      const n1 = t.getNode(1);
      expect(n1).toBeTruthy();

      t.set(1, 'b');
      const n2 = t.getNode(1);

      expect(t.size).toBe(1);
      expect(t.get(1)).toBe('b');
      expect(n2).toBe(n1);
    });

    it('setWithHintNode covers: no hint -> fallback, c0==0 update, and left/right attach branches', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      // no hint -> fallback
      const n20 = t.setWithHintNode(20, 20, undefined);
      expect(n20?.key).toBe(20);

      // c0 == 0 update
      const hint10 = t.getNode(10)!;
      const updated10 = t.setWithHintNode(10, 999, hint10);
      expect(updated10).toBe(hint10);
      expect(t.get(10)).toBe(999);

      // left attach (hint.left is empty)
      const hint5 = t.getNode(5)!;
      const n2 = t.setWithHintNode(2, 2, hint5);
      expect(n2?.parent?.key).toBe(5);
      expect(n2?.key).toBe(2);

      // predecessor-right attach (hint.left exists)
      // key=7 is <10, pred(10)=5 and pred.right is empty -> attach there.
      const n7 = t.setWithHintNode(7, 7, hint10);
      expect(n7?.key).toBe(7);
      expect(n7?.parent?.key).toBe(5);

      // successor-left attach (hint.right exists)
      // key=13 is >10, succ(10)=15 and succ.left is empty -> attach there.
      const n13 = t.setWithHintNode(13, 13, hint10);
      expect(n13?.key).toBe(13);
      expect(n13?.parent?.key).toBe(15);

      // succ.key <= key fallback branch
      const n30 = t.setWithHintNode(30, 30, hint10);
      expect(n30?.key).toBe(30);
      expect(t.getNode(30)).toBeTruthy();

      // pred.key >= key fallback branch
      const n4 = t.setWithHintNode(4, 4, hint10);
      expect(n4?.key).toBe(4);
      expect(t.getNode(4)).toBeTruthy();
    });
  });

  describe('hint cache maintenance compare-update branches', () => {
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
      pred.parent = hint as any;
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

      succ.parent = hint as any;
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

  describe('setWithHintNode cache-maintenance no-update branches', () => {
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

  describe('hint cache maintenance with nullish/NIL header caches', () => {
  it('direct attach left/right: when header caches are NIL, hMin/hMax short-circuit branches initialize caches', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);
      const hint = t.getNode(10)!;

      // Corrupt caches to NIL so (hMin===NIL || ...) short-circuits true.
      (t as any)._header._left = t.NIL;
      (t as any)._header._right = t.NIL;

      const n5 = t.setWithHintNode(5, 5, hint)!;
      expect((t as any)._header._left).toBe(n5);
      expect((t as any)._header._right).toBe(n5);

      // Corrupt again and attach on the other side.
      (t as any)._header._left = t.NIL;
      (t as any)._header._right = t.NIL;

      const n15 = t.setWithHintNode(15, 15, hint)!;
      expect((t as any)._header._left).toBe(n15);
      expect((t as any)._header._right).toBe(n15);

      // Repair to real extremes to avoid leakage.
      const root = (t as any)._root;
      (t as any)._setMinCache(t.isRealNode(root) ? t.getLeftMost((n: any) => n, root) : undefined);
      (t as any)._setMaxCache(t.isRealNode(root) ? t.getRightMost((n: any) => n, root) : undefined);
    });

    it('pred.right / succ.left attach: when header caches are NIL, hMin/hMax short-circuit branches initialize caches', () => {
      const t = new RedBlackTree<number, number>([], { isMapMode: false });
      t.set(10, 10);
      const hint = t.getNode(10)!;

      // Create real left/right so we take pred/succ attach paths.
      t.setWithHintNode(5, 5, hint);
      t.setWithHintNode(15, 15, hint);

      // pred.right attach, with caches NIL.
      (t as any)._header._left = t.NIL;
      (t as any)._header._right = t.NIL;

      const n7 = t.setWithHintNode(7, 7, hint)!;
      expect((t as any)._header._left).toBe(n7);
      expect((t as any)._header._right).toBe(n7);

      // succ.left attach, with caches NIL.
      (t as any)._header._left = t.NIL;
      (t as any)._header._right = t.NIL;

      const n12 = t.setWithHintNode(12, 12, hint)!;
      expect((t as any)._header._left).toBe(n12);
      expect((t as any)._header._right).toBe(n12);

      // Repair to real extremes.
      const root = (t as any)._root;
      (t as any)._setMinCache(t.isRealNode(root) ? t.getLeftMost((n: any) => n, root) : undefined);
      (t as any)._setMaxCache(t.isRealNode(root) ? t.getRightMost((n: any) => n, root) : undefined);
    });
  });

  describe('setWithHintNode mapMode defined-value branches', () => {
  it('direct attach left/right with defined values uses store.set branches', () => {
      const t = new RedBlackTree<number, number>(); // mapMode default
      t.set(10, 10);
      const h10 = t.getNode(10)!;

      const n5 = t.setWithHintNode(5, 5, h10);
      expect(n5?.key).toBe(5);
      expect((t as any)._store.get(5)?.value).toBe(5);

      const n15 = t.setWithHintNode(15, 15, h10);
      expect(n15?.key).toBe(15);
      expect((t as any)._store.get(15)?.value).toBe(15);
    });

    it('pred.right and succ.left attach with defined values uses store.set branches', () => {
      const t = new RedBlackTree<number, number>();
      t.set(10, 10);
      const h10 = t.getNode(10)!;

      // Ensure left is real so we take pred path.
      t.setWithHintNode(5, 5, h10);
      const n7 = t.setWithHintNode(7, 7, h10);
      expect(n7?.key).toBe(7);
      expect((t as any)._store.get(7)?.value).toBe(7);

      // Ensure right is real so we take succ path.
      t.setWithHintNode(15, 15, h10);
      const n12 = t.setWithHintNode(12, 12, h10);
      expect(n12?.key).toBe(12);
      expect((t as any)._store.get(12)?.value).toBe(12);
    });
  });

  describe('setWithHintNode mapMode undefined-value branches', () => {
  it('direct attach left/right with undefined value stores nodes (node-index store)', () => {
      const t = new RedBlackTree<number, number>(); // mapMode default
      t.set(10, 10);
      const h10 = t.getNode(10)!;

      const n5 = t.setWithHintNode(5, undefined as any, h10);
      expect(n5?.key).toBe(5);
      expect(t.getNode(5)).toBeTruthy();
      expect((t as any)._store.has(5)).toBe(true);

      const n15 = t.setWithHintNode(15, undefined as any, h10);
      expect(n15?.key).toBe(15);
      expect(t.getNode(15)).toBeTruthy();
      expect((t as any)._store.has(15)).toBe(true);
    });

    it('pred.right and succ.left attach with undefined value hit _setValue branches', () => {
      const t = new RedBlackTree<number, number>();
      t.set(10, 10);
      const h10 = t.getNode(10)!;

      // Ensure left is real so we take the pred path.
      t.setWithHintNode(5, 5, h10);

      // Insert between pred(5) and hint(10): attaches as pred.right.
      const n7 = t.setWithHintNode(7, undefined as any, h10);
      expect(n7?.key).toBe(7);
      expect(t.getNode(7)).toBeTruthy();
      expect((t as any)._store.has(7)).toBe(true);

      // Ensure right is real so we take the succ path.
      t.setWithHintNode(15, 15, h10);

      // Insert between hint(10) and succ(15): attaches as succ.left.
      const n12 = t.setWithHintNode(12, undefined as any, h10);
      expect(n12?.key).toBe(12);
      expect(t.getNode(12)).toBeTruthy();
      expect((t as any)._store.has(12)).toBe(true);
    });
  });

  describe('setWithHintNode more branch', () => {
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
});
