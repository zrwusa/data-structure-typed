import { BST, BSTNode, Range } from '../../../../src';

describe('BST misc coverage', () => {
  describe('misc branch', () => {
    it('getNode(range) returns undefined when getNodes(range) is empty (covers ?? fallback)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const range = new Range(100, 200);
      const out = t.getNode(range as any);
      expect(out).toBeUndefined();
    });

    it('search(entry) with undefined key covers the second operand of (k !== null && k !== undefined)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = t.search([undefined as any, 1] as any);
      expect(out).toEqual([]);
    });

    it('floor(entry null key, callback as string) hits the typeof-callback guard branch', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      expect(t.floor([null as any, 1] as any, 'RECURSIVE' as any)).toBeUndefined();
    });

    it('lower(predicate, callback fn) returns undefined when predicate matches none (covers cond-expr false branch)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = t.lower(
        (n: any) => n.key === 999,
        (n: any) => n.key,
        'ITERATIVE' as any
      );
      expect(out).toBeUndefined();
    });

    it('lower(key, callback fn) returns undefined when no lower key exists (covers key-path cond-expr false branch)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = t.lower(1 as any, (n: any) => n.key, 'ITERATIVE' as any);
      expect(out).toBeUndefined();
    });

    it('default comparator throws when comparing object keys (covers typeof b === object arm)', () => {
      const t = new BST<any, any>([], { isMapMode: false } as any);
      const cmp = (t as any)._createDefaultComparator();
      expect(() => cmp(1, {})).toThrow(TypeError);
    });

    it('_floorByPredicate(RECURSIVE) updates result when predicate becomes true (covers predicate(cur) true branch)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15, 3, 7]) t.set(k, k);

      const node = (t as any)._floorByPredicate((n: any) => n.key <= 7, 'RECURSIVE');
      expect(node?.key).toBe(7);
    });

    it('_lowerByPredicate(RECURSIVE) early-returns on empty tree (covers !isRealNode(cur) guard)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      const node = (t as any)._lowerByPredicate((n: any) => !!n, 'RECURSIVE');
      expect(node).toBeUndefined();
    });

    it('_bound(entry null key) returns undefined (covers key-null guard in _bound)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = (t as any)._bound([null as any, 1] as any, true, 'ITERATIVE');
      expect(out).toBeUndefined();
    });

    it('_boundByPredicate(RECURSIVE) early-returns on empty tree (covers !isRealNode(cur) guard)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      const out = (t as any)._boundByPredicate((n: any) => !!n, 'RECURSIVE');
      expect(out).toBeUndefined();
    });

    it('_deleteByKey takes the cmp>0 left-walk branch and transplant(p.left===u) branch', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      // Ensure root has a left child so delete walks left and transplant sees p.left===u.
      for (const k of [10, 5, 15]) t.set(k, k);

      expect((t as any)._deleteByKey(1)).toBe(false); // walk left, not found
      expect((t as any)._deleteByKey(5)).toBe(true); // delete left child
      expect(t.has(5)).toBe(false);
    });

    it('setMany balanced sort comparator hits isRealNode(b) branch when inputs include nodes', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [2, 1, 3]) t.set(k, k);

      const n1 = t.getNode(1)!;
      const n2 = t.getNode(2)!;
      const n3 = t.getNode(3)!;

      const out = t.setMany([n3, n1, n2] as any, undefined, true, 'ITERATIVE' as any);
      expect(out.length).toBe(3);
    });
  });

  describe('coverage', () => {
    it('BSTNode.familyPosition covers MAL_NODE branch', () => {
      const root = new BSTNode<number, number>(10);
      const mal = new BSTNode<number, number>(5);
      mal.parent = root;
      // parent does not point to mal via left/right
      expect(mal.familyPosition).toBe('MAL_NODE');
    });

    it('getNode returns undefined for null/undefined, and handles runtime Range input', () => {
      const bst = new BST<number, number>();
      bst.set(2, 2);

      expect(bst.getNode(undefined as any)).toBeUndefined();
      expect(bst.getNode(null as any)).toBeUndefined();

      const r = new Range<number>(2, 2, true, true);
      expect(bst.getNode(r as any)?.key).toBe(2);
    });

    it('getNodes returns [] for null/undefined and ignores entry with null key', () => {
      const bst = new BST<number, number>([2, 1, 3]);

      expect(bst.getNodes(undefined as any)).toEqual([]);
      expect(bst.getNodes(null as any)).toEqual([]);

      // entry with null key => targetKey undefined => []
      expect(bst.getNodes([null as any, 123] as any)).toEqual([]);
    });

    it('getNodes returns [] when startNode is not a real node', () => {
      const bst = new BST<number, number>([2, 1, 3]);

      // ensureNode(null) => undefined => []
      expect(bst.getNodes(2, false, null as any)).toEqual([]);
    });
  });

  describe('BSTNode familyPosition', () => {
    it('covers ISOLATED/ROOT/LEFT/RIGHT/ROOT_LEFT/ROOT_RIGHT and MAL_NODE', () => {
      const isolated = new BSTNode<number, number>(1);
      expect(isolated.familyPosition).toBe('ISOLATED');

      const root = new BSTNode<number, number>(10);
      const left = new BSTNode<number, number>(5);
      const right = new BSTNode<number, number>(15);

      root.left = left;
      root.right = right;

      expect(root.familyPosition).toBe('ROOT');
      expect(left.familyPosition).toBe('LEFT');
      expect(right.familyPosition).toBe('RIGHT');

      left.left = new BSTNode<number, number>(2);
      right.right = new BSTNode<number, number>(20);

      expect(left.familyPosition).toBe('ROOT_LEFT');
      expect(right.familyPosition).toBe('ROOT_RIGHT');

      const mal = new BSTNode<number, number>(999);
      mal.parent = root;
      expect(mal.familyPosition).toBe('MAL_NODE');
    });
  });

  describe('branch (batch 2)', () => {
    it('search(): forces pruning key-branches by toggling _isPredicate (covers shouldVisitLeft/Right key-path guards)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      t.set(10, 10);

      // Make the first _isPredicate check return true (to skip the key fast-path),
      // but subsequent calls return false (so pruning takes the key-search branches).
      const origIsPredicate = (t as any)._isPredicate;
      let first = true;
      (t as any)._isPredicate = () => {
        if (first) {
          first = false;
          return true;
        }
        return false;
      };
      try {
        // Root has no real children => shouldVisitLeft/Right hits `!isRealNode(cur.left/right)` early returns.
        expect(t.search(7 as any, false, n => n.key)).toEqual([]);

        // Add children and try again so the compare-based pruning expressions execute too.
        t.set(5, 5);
        t.set(15, 15);

        expect(t.search(7 as any, false, n => n.key)).toEqual([]);
        expect(t.search(12 as any, false, n => n.key)).toEqual([]);
      } finally {
        (t as any)._isPredicate = origIsPredicate;
      }
    });

    it('setMany(): covers raw-key path in both recursive and iterative builders, and hits !popped continue via pop monkeypatch', () => {
      type Raw = { k: number; v: string };
      const t = new BST<number, string, Raw>([], {
        isMapMode: false,
        toEntryFn: (r: Raw) => [r.k, r.v]
      });

      const raws: Raw[] = [
        { k: 3, v: 'c' },
        { k: 1, v: 'a' },
        { k: 2, v: 'b' }
      ];

      // Recursive path hits `if (this.isRaw(key)) ... this.set(entry)`.
      const insertedR = t.setMany(raws as any, undefined as any, false, 'RECURSIVE');
      expect(insertedR.length).toBe(3);
      expect(t.get(1)).toBe('a');

      // Iterative path: monkeypatch pop once to return undefined so `if (!popped) continue` executes.
      const origPop = Array.prototype.pop;
      let did = false;
      try {
        // reset tree
        t.clear();
        Array.prototype.pop = function () {
          if (!did) {
            did = true;
            return undefined as any;
          }
          return origPop.call(this);
        };

        const insertedI = t.setMany(raws as any, undefined as any, false, 'ITERATIVE');
        expect(insertedI.length).toBe(3);
        expect(t.get(2)).toBe('b');
      } finally {
        Array.prototype.pop = origPop;
      }
    });

    it('floor/lower: covers nullish key entry guards and callback-string/empty branches', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      t.setMany([1, 2, 3] as any);

      // entry with nullish key => should return undefined through guard branches
      expect(t.floor([undefined, 1] as any)).toBeUndefined();
      expect(t.lower([undefined, 1] as any)).toBeUndefined();

      // null input with callback string => also returns undefined (guard branch)
      expect(t.lower(undefined as any, 'RECURSIVE' as any)).toBeUndefined();
    });

    it('_floorByPredicate/_lowerByPredicate/_boundByPredicate iterative: hits break when stack.pop returns non-real (Array.pop monkeypatch)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      t.set(2, 2);
      t.set(1, 1);
      t.set(3, 3);

      const origPop = Array.prototype.pop;
      let did = false;
      try {
        Array.prototype.pop = function () {
          if (!did) {
            did = true;
            return undefined as any;
          }
          return origPop.call(this);
        };

        // Access protected helpers via any and force ITERATIVE.
        // With pop monkeypatch, these may return undefined due to early-break; we only care about executing the branch.
        expect(() =>
          (t as any)._floorByPredicate((n: BSTNode<number, number>) => n.key <= 2, 'ITERATIVE')
        ).not.toThrow();
        did = false;
        expect(() =>
          (t as any)._lowerByPredicate((n: BSTNode<number, number>) => n.key < 2, 'ITERATIVE')
        ).not.toThrow();
        did = false;
        expect(() =>
          (t as any)._boundByPredicate((n: BSTNode<number, number>) => n.key >= 2, true, 'ITERATIVE')
        ).not.toThrow();
      } finally {
        Array.prototype.pop = origPop;
      }
    });

    it('_deleteByKey: covers transplant else-branch (u is right child) and minNode(!x) early return via null corruption', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      // Build: 2 with children 1 and 3
      t.set(2, 2);
      t.set(1, 1);
      t.set(3, 3);

      // delete right child => transplant sees p.left!==u and takes p.right=v branch
      expect((t as any)._deleteByKey(3)).toBe(true);
      expect(t.get(3)).toBeUndefined();

      // Corrupt: make node.right null so two-children branch is taken but minNode receives null
      // and hits `if (!x) return undefined;`.
      const n2 = t.getNode(2)!;
      (n2 as any).right = null;

      expect(() => (t as any)._deleteByKey(2)).toThrow();
    });
  });

  describe('reachable branch (batch 3)', () => {
    it('search(): entry with nullish key does not set targetKey (covers entry[0] nullish guard)', () => {
      const t = new BST<number, number>();
      t.set(1, 1);

      // Should not throw; should return empty due to targetKey undefined.
      const res = (t as any).search([null, 1], (n: any) => n.key);
      expect(res).toEqual([]);
    });

    it('search(): forces key-pruning branches to evaluate inside shouldVisitLeft/Right by toggling _isPredicate', () => {
      const t = new BST<number, number>();
      t.setMany([
        [2, 2],
        [1, 1],
        [3, 3]
      ]);

      const pred = (node: any) => node.key === 2;

      const origIsPred = (t as any)._isPredicate;
      let calls = 0;
      (t as any)._isPredicate = (_x: any) => {
        calls++;
        // search() calls _isPredicate multiple times (isPred calc + ensurePredicate + pruning closures).
        // Keep it true for the initial plumbing, then flip to false so pruning takes the key-pruning branch.
        if (calls <= 3) return true;
        return false;
      };

      try {
        const out = (t as any).search(pred, (n: any) => n.key);
        expect(out).toEqual([2]);
      } finally {
        (t as any)._isPredicate = origIsPred;
      }
    });

    it('lower(): nullish input + nullish callback hits `|| !callback` branch', () => {
      const t = new BST<number, number>();
      expect((t as any).lower(undefined, undefined)).toBeUndefined();
    });
  });

  describe('reachable branch (batch 4)', () => {
    it('search(): entry with defined key sets targetKey (covers entry[0] non-nullish branch)', () => {
      const t = new BST<number, number>();
      t.setMany([
        [1, 1],
        [2, 2],
        [3, 3]
      ]);

      const res = (t as any).search([2, undefined], (n: any) => n.key);
      expect(res).toEqual([2]);
    });

    it('setMany(): recursive balanced build hits isRaw(key) branch', () => {
      type Raw = { k: number; v: number };
      const t = new BST<number, number, Raw>([], {
        toEntryFn: (r: Raw) => [r.k, r.v]
      });

      const inserted = t.setMany(
        [
          { k: 2, v: 20 },
          { k: 1, v: 10 },
          { k: 3, v: 30 }
        ],
        undefined,
        true,
        'RECURSIVE'
      );

      expect(inserted).toHaveLength(3);
      expect(t.get(2)).toBe(20);
    });
  });

  describe('reachable branch (batch 5)', () => {
    it('search(): forces shouldVisitRight key-pruning branch + covers && chain short-circuit variants', () => {
      const t = new BST<number, number>();
      t.setMany([
        [10, 10],
        [20, 20]
      ]);

      const originalIsPredicate = (t as any)._isPredicate.bind(t);

      const run = (keyNodeOrEntry: any) => {
        let calls = 0;
        (t as any)._isPredicate = (p: any) => {
          // 1st call (isPred computation) => true, to bypass the fast-path.
          // After that, behave like the real implementation so _ensurePredicate works
          // and shouldVisitRight sees "not predicate".
          calls++;
          if (calls === 1) return true;
          return originalIsPredicate(p);
        };

        try {
          t.search(keyNodeOrEntry);
        } finally {
          (t as any)._isPredicate = originalIsPredicate;
        }
      };

      // 1) benchmarkKey === null => hits first short-circuit (benchmarkKey !== null)
      run([null, 0]);

      // 2) benchmarkKey === undefined => passes first check, fails second
      run([undefined, 0]);

      // 3) compare(...) < 0 is false => passes both nullish checks
      run([5, 0]);
    });
  });
});

describe('BST Date key comparator', () => {
  it('compares valid Date keys via isComparable path', () => {
    const bst = new BST<Date, string>();
    const d1 = new Date('2024-01-01');
    const d2 = new Date('2024-06-01');
    const d3 = new Date('2023-01-01');
    bst.add([d1, 'jan']);
    bst.add([d2, 'jun']);
    bst.add([d3, 'old']);
    expect(bst.has(d2)).toBe(true);
    expect(bst.getLeftMost()).toEqual(d3);
    expect(bst.getRightMost()).toEqual(d2);
  });
});

describe('BST floor/lower with predicate (targetKey undefined path)', () => {
  const bst = new BST<number, number>([5, 10, 15, 20].map(k => [k, k]));

  it('floor with predicate', () => {
    expect(bst.floor(n => n.key <= 12)).toBe(10);
  });

  it('floor with null input returns undefined', () => {
    expect(bst.floor(null as any)).toBeUndefined();
  });

  it('lower with predicate', () => {
    expect(bst.lower(n => n.key < 15)).toBe(10);
  });

  it('lower with null input returns undefined', () => {
    expect(bst.lower(null as any)).toBeUndefined();
  });

  it('ceiling with null input returns undefined', () => {
    expect(bst.ceiling(null as any)).toBeUndefined();
  });

  it('higher with null input returns undefined', () => {
    expect(bst.higher(null as any)).toBeUndefined();
  });

  it('floor with entry [null, val] returns undefined', () => {
    expect(bst.floor([null, 10] as any)).toBeUndefined();
  });

  it('lower with entry [null, val] returns undefined', () => {
    expect(bst.lower([null, 10] as any)).toBeUndefined();
  });

  it('floor with node callback', () => {
    const result = bst.floor(12, n => n.key * 2);
    expect(result).toBe(20);
  });

  it('lower with node callback', () => {
    const result = bst.lower(15, n => n.key * 2);
    expect(result).toBe(20);
  });

  it('floor with callback + iterationType', () => {
    expect(bst.floor(12, n => n.key * 2, 'ITERATIVE')).toBe(20);
  });

  it('lower with callback + iterationType', () => {
    expect(bst.lower(15, n => n.key * 2, 'ITERATIVE')).toBe(20);
  });
});
