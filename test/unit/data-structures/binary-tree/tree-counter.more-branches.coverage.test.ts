import { TreeCounter, TreeCounterNode } from '../../../../src';

describe('TreeCounter additional branch coverage', () => {
  it('getComputedCount sums 0 for null nodes (covers node ? node.count : 0 false arm)', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });

    // Force dfs callback to receive a null once, so ternary false arm is executed.
    const origDfs = (t as any).dfs;
    (t as any).dfs = (cb: any) => {
      cb(null);
      return [];
    };

    try {
      expect(t.getComputedCount()).toBe(0);
    } finally {
      (t as any).dfs = origDfs;
    }
  });

  it('createNode default color arg branch and mapMode=true forces value undefined', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: true } as any);
    const n = t.createNode(1, 123); // default color arg
    expect(n.value).toBeUndefined();
  });

  it('set() with null/undefined keyNodeOrEntry makes orgCount=0 and returns false (covers orgCount false arm)', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    expect(t.set(undefined as any)).toBe(false);
    expect(t.set(null as any)).toBe(false);
  });

  it('delete(null) returns [] (covers early return)', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    expect(t.delete(null as any)).toEqual([]);
  });

  it('delete(predicate) uses predicate branch and returns [] when predicate matches none', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    t.set(1, 1);
    expect(t.delete((n: any) => n.key === 999)).toEqual([]);
  });

  it('delete(realNode) uses the isRealNode(keyNodeOrEntry) ? keyNodeOrEntry : getNode(...) true arm', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    t.set(10, 10);
    t.set(5, 5);
    t.set(15, 15);

    const n = t.getNode(5)!;
    const res = t.delete(n as any, true);
    expect(res.length).toBe(1);
    expect(t.has(5)).toBe(false);
  });

  it('delete(decrement count) path when node.count>1 and ignoreCount=false', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    t.set(1, 1);
    t.set(1, 1);
    expect(t.count).toBe(2);

    const res = t.delete(1, false);
    expect(res.length).toBe(1);
    expect(t.count).toBe(1);
    expect(t.getNode(1)!.count).toBe(1);
  });

  it('delete(two children) else-branch with successor.parent !== nodeToDelete and ignoreCount=true', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });

    // Build a BST-shape manually to avoid balancing changing successor relationships.
    // nodeToDelete = 10, right subtree has left chain so successor.parent !== nodeToDelete
    const n10: any = t.createNode(10, 10);
    const n5: any = t.createNode(5, 5);
    const n15: any = t.createNode(15, 15);
    const n12: any = t.createNode(12, 12);
    const n11: any = t.createNode(11, 11);

    n10.left = n5;
    n10.right = n15;
    n5.parent = n10;
    n15.parent = n10;

    n15.left = n12;
    n12.parent = n15;

    n12.left = n11;
    n11.parent = n12;

    (t as any)._setRoot(n10);
    (t as any)._size = 5;
    (t as any)._count = 5;

    const out = t.delete(10, true);
    expect(out.length).toBe(1);
    expect(t.has(10)).toBe(false);
  });

  it('perfectlyBalance uses default iterationType arg and recomputes _count (also covers nd?nd.count:0 false arm via dfs monkeypatch)', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    expect(t.perfectlyBalance('ITERATIVE' as any)).toBe(false);

    t.set(3, 3);
    t.set(1, 1);
    t.set(2, 2);

    // call without arg to cover default-arg branch (iterationType = this.iterationType)
    expect(t.perfectlyBalance()).toBe(true);
    expect(t.count).toBe(3);

    // additionally, cover the nd ? nd.count : 0 false arm in the internal total recompute loop,
    // without breaking index-based access during tree rebuild.
    const origDfs = (t as any).dfs;
    (t as any).dfs = (...args: any[]) => {
      const nodes: any[] = origDfs.apply(t, args);
      const origIter = nodes[Symbol.iterator].bind(nodes);
      nodes[Symbol.iterator] = function* () {
        yield null;
        yield* origIter();
      };
      return nodes;
    };
    try {
      expect(t.perfectlyBalance()).toBe(true);
    } finally {
      (t as any).dfs = origDfs;
    }
  });

  it('map() uses thisArg + _createLike options path', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    t.set(1, 10);
    t.set(2, 20);

    const ctx = { mul: 3 };
    const out = t.map(function (this: any, v: any, k: any) {
      return [k + 10, v * this.mul];
    }, { isMapMode: false } as any, ctx);

    expect(out.has(11)).toBe(true);
    expect(out.get(11)).toBe(30);
  });

  it('clone() covers both `if (!node) continue` and outNode missing branch', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    t.set(1, 1);
    t.set(1, 1);
    t.set(2, 2);

    // Force dfs() used by clone() to yield a null once to hit `if (!node) continue`.
    const origDfs = (t as any).dfs;
    (t as any).dfs = (...args: any[]) => {
      const nodes: any[] = origDfs.apply(t, args);
      const origIter = nodes[Symbol.iterator].bind(nodes);
      nodes[Symbol.iterator] = function* () {
        yield null;
        yield* origIter();
      };
      return nodes;
    };

    const origCreateInstance = (t as any)._createInstance;
    (t as any)._createInstance = () => {
      const out = origCreateInstance.call(t);
      // Make getNode return undefined so `if (outNode)` is false.
      (out as any).getNode = () => undefined;
      return out;
    };

    try {
      const c = t.clone();
      expect((c as any)._count).toBe((t as any)._count);
    } finally {
      (t as any)._createInstance = origCreateInstance;
      (t as any).dfs = origDfs;
    }
  });

  it('_createInstance uses options merge (covers options ?? {} merge)', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false } as any);
    const inst = (t as any)._createInstance({ iterationType: 'RECURSIVE' });
    expect(inst).toBeDefined();
  });

  it('_createLike default-arg path can be called with no args', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false } as any);
    const like = (t as any)._createLike();
    expect(like).toBeDefined();
  });

  it('_keyValueNodeOrEntryToNodeAndValue entry null key returns [undefined, undefined]', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    const out = (t as any)._keyValueNodeOrEntryToNodeAndValue([null, 1] as any);
    expect(out).toEqual([undefined, undefined]);
  });

  it('_swapProperties returns undefined when ensureNode fails', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    expect((t as any)._swapProperties(null, null)).toBeUndefined();

    // src ok, dest missing
    t.set(1, 1);
    const src = t.getNode(1)!;
    expect((t as any)._swapProperties(src, 9999)).toBeUndefined();
  });

  it('_swapProperties in mapMode=true skips value-copy branches (covers !this._isMapMode false arms)', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: true } as any);
    const a: any = t.createNode(1, 10);
    const b: any = t.createNode(2, 20);
    // attach as a tiny tree so ensureNode works
    (t as any)._setRoot(a);
    a.right = b;
    b.parent = a;

    const out = (t as any)._swapProperties(a, b);
    expect(out).toBeDefined();
  });

  it('_replaceNode increments newNode.count before delegating', () => {
    const t = new TreeCounter<number, number>([], { isMapMode: false });
    const oldN = new TreeCounterNode(1, 1, 2, 'BLACK');
    const newN = new TreeCounterNode(1, 1, 3, 'BLACK');
    const out = (t as any)._replaceNode(oldN, newN);
    expect(out.count).toBe(5);
  });
});
