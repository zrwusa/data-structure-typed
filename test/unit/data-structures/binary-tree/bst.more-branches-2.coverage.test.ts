import { BST, BSTNode } from '../../../../src';

describe('BST additional branch coverage (batch 2)', () => {
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
    const insertedR = t.setMany(raws as any, undefined as any, 'RECURSIVE');
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

      const insertedI = t.setMany(raws as any, undefined as any, 'ITERATIVE');
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
      expect(() => (t as any)._floorByPredicate((n: BSTNode<number, number>) => n.key <= 2, 'ITERATIVE')).not.toThrow();
      did = false;
      expect(() => (t as any)._lowerByPredicate((n: BSTNode<number, number>) => n.key < 2, 'ITERATIVE')).not.toThrow();
      did = false;
      expect(() => (t as any)._boundByPredicate((n: BSTNode<number, number>) => n.key >= 2, true, 'ITERATIVE')).not.toThrow();
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
