import { BinaryTree } from '../../../../src';

describe('BinaryTree remaining branch coverage', () => {
  it('set() BFS loop hits `if (!cur) continue` when queue contains undefined', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    t.set(1, 1);

    // Corrupt root.left so the BFS loop enqueues an explicit undefined.
    const root: any = (t as any)._root;
    root.left = undefined;

    // Next insertion will push `cur.left` (undefined) into the queue, hitting the `if (!cur) continue` branch.
    expect(t.set(2, 2)).toBe(true);
  });

  it('isBST(ITERATIVE) executes checkBST() default-arg branch (checkMax default false)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    t.set(2, 2);
    t.set(1, 1);
    t.set(3, 3);

    expect(t.isBST(t.root as any, 'ITERATIVE' as any)).toBe(true);
  });

  it('getPathToRoot returns reversed path when isReverse=true', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const root = t.createNode(1, 1);
    const child = t.createNode(2, 2);
    root.left = child;
    child.parent = root;
    (t as any)._setRoot(root);

    const out = t.getPathToRoot(child as any, (n: any) => n?.key, true);
    expect(out).toEqual([1, 2]);
  });

  it('_dfs(ITERATIVE) hits onlyOne early-return branch when onlyOne=true', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    t.set(1, 1);
    t.set(2, 2);
    const out = (t as any)._dfs((n: any) => n?.key, 'IN', true, t.root, 'ITERATIVE', false);
    expect(out.length).toBe(1);
  });

  it('_dfs startNode ensureNode fails returns []', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    t.set(1, 1);
    const out = (t as any)._dfs((n: any) => n?.key, 'IN', false, null, 'ITERATIVE', false);
    expect(out).toEqual([]);
  });

  it('_getIterator default-arg path returns without yielding when root is undefined', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    // direct call to generator
    const iter = (t as any)._getIterator();
    const first = iter.next();
    expect(first.done).toBe(true);
  });

  it('_getIterator recursive branch visits left and right and yields mapMode values when mapMode=true', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: true });
    // Build a small tree manually to avoid BFS quirks.
    const root: any = t.createNode(2, 200);
    const left: any = t.createNode(1, 100);
    const right: any = t.createNode(3, 300);
    root.left = left;
    root.right = right;
    left.parent = root;
    right.parent = root;
    (t as any)._setRoot(root);

    // Ensure store has values.
    (t as any)._store.set(1, 1000);
    (t as any)._store.set(2, 2000);
    (t as any)._store.set(3, 3000);

    // Force recursive iterator branch.
    (t as any).iterationType = 'RECURSIVE';

    const got: any[] = [];
    for (const kv of t) got.push(kv);
    expect(got).toEqual([
      [1, 1000],
      [2, 2000],
      [3, 3000]
    ]);
  });

  it('_displayAux: node is undefined and isShowUndefined=true uses "U" leaf rendering (covers U branch)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const layout = (t as any)._displayAux(undefined, { isShowNull: true, isShowUndefined: true, isShowRedBlackNIL: true });
    expect(layout[0][0]).toContain('U');
  });

  it('_displayAux: node is null and isShowNull=true uses "N" leaf rendering (covers N branch)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const layout = (t as any)._displayAux(null, { isShowNull: true, isShowUndefined: true, isShowRedBlackNIL: true });
    expect(layout[0][0]).toContain('N');
  });

  it('_displayAux: isNIL(node) shows "S" when isShowRedBlackNIL=true', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false } as any);
    const NIL = (t as any)._NIL;
    const layout = (t as any)._displayAux(NIL, { isShowNull: true, isShowUndefined: true, isShowRedBlackNIL: true });
    expect(layout[0][0]).toContain('S');
  });

  it('_swapProperties updates value when mapMode=false (covers !this._isMapMode assignments)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const a: any = t.createNode(1, 10);
    const b: any = t.createNode(2, 20);
    (t as any)._swapProperties(a, b);
    expect(a.key).toBe(2);
    expect(a.value).toBe(20);
    expect(b.key).toBe(1);
    expect(b.value).toBe(10);
  });

  it('_ensurePredicate for nullish input returns a predicate (covers nullish early return)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const p = (t as any)._ensurePredicate(undefined);
    expect(p(null)).toBe(false);
  });

  it('_ensurePredicate for entry and for key returns false on null node (covers `if (!node) return false`)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false });
    const pEntry = (t as any)._ensurePredicate([1, 1]);
    const pKey = (t as any)._ensurePredicate(1);
    expect(pEntry(null)).toBe(false);
    expect(pKey(null)).toBe(false);
  });

  it('_extractKey returns undefined when passing _NIL', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: false } as any);
    expect((t as any)._extractKey((t as any)._NIL)).toBeUndefined();
  });

  it('_setValue returns false when value is undefined (covers value===undefined guard)', () => {
    const t = new BinaryTree<number, number>([], { isMapMode: true });
    expect((t as any)._setValue(1, undefined)).toBe(false);
  });
});
