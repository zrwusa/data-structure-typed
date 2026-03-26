import { BST } from '../../../../src';

describe('BST floor-lower coverage', () => {

  describe('floor()/lower() predicate + callback-shape', () => {
  it('floor(predicate, iterationTypeString) returns node.key (actualCallback undefined branch)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15, 3, 7]) t.set(k, k);

      // callback is a string => treated as iterationType; actualCallback stays undefined.
      const out = t.floor((node: any) => node.key <= 7, 'ITERATIVE' as any);
      // floor-by-predicate returns the last node satisfying the predicate.
      expect(out).toBe(7);
    });

    it('lower(predicate, iterationTypeString) returns node.key (actualCallback undefined branch)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15, 3, 7]) t.set(k, k);

      const out = t.lower((node: any) => node.key < 7, 'RECURSIVE' as any);
      // lower-by-predicate returns the last node satisfying the predicate.
      expect(out).toBe(5);
    });

    it('_floorByPredicate hits early return when root is not real (covers dfs guard)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      // empty tree
      const out = (t as any)._floorByPredicate((n: any) => !!n, 'RECURSIVE');
      expect(out).toBeUndefined();
    });
  });

  describe('floor() and setMany() extra', () => {
  it('floor: nullish input returns undefined (callback string and callback function cases)', () => {
      const t = new BST<number, number>([], { isMapMode: false });

      expect(t.floor(null as any, 'RECURSIVE' as any)).toBeUndefined();
      expect(t.floor(undefined as any, 'ITERATIVE' as any)).toBeUndefined();

      // also with callback function
      expect(t.floor(null as any, (n: any) => n.key)).toBeUndefined();
    });

    it('floor: entry with null/undefined key returns undefined (covers key-null guard)', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      expect(t.floor([null as any, 1] as any, (n: any) => n.key)).toBeUndefined();
      expect(t.floor([undefined as any, 1] as any, (n: any) => n.key)).toBeUndefined();
    });

    it('floor: predicate path returns callback(node) when found and undefined when not found', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15, 3, 7]) t.set(k, k);

      const found = t.floor((node: any) => node.key >= 7, (node: any) => node.key, 'ITERATIVE' as any);
      // floor-by-predicate returns the first node that satisfies the predicate in the chosen traversal.
      expect(found).toBe(15);

      const notFound = t.floor((node: any) => node.key === 999, (node: any) => node.key, 'RECURSIVE' as any);
      expect(notFound).toBeUndefined();
    });

    it('setMany: non-balanced insertion converts raw items via _toEntryFn and passes values iterator', () => {
      type Raw = { k: number | null; v: number };
      const t = new BST<number, number, Raw>([], { isMapMode: false } as any);

      // Enable raw conversion.
      (t as any)._toEntryFn = (r: Raw) => [r.k as any, r.v];

      const raws: Raw[] = [
        { k: 3, v: 30 },
        { k: 1, v: 10 },
        { k: null, v: 999 } // should become a [null, v] entry; set should fail
      ];

      const out = t.setMany(raws as any, [undefined, undefined, undefined], false);
      expect(out.length).toBe(3);

      expect(t.has(1)).toBe(true);
      expect(t.has(3)).toBe(true);
    });

    it('setMany: balanced insertion sort comparator covers (keyA==null || keyB==null) fallback', () => {
      type Raw = { k: number | null; v: number };
      const t = new BST<number, number, Raw>([], { isMapMode: false } as any);
      (t as any)._toEntryFn = (r: Raw) => [r.k as any, r.v];

      // Use only raw objects (arrays are also typeof 'object' and would be treated as raw when _toEntryFn is set).
      // Include a null key so the sort comparator hits the `return 0` fallback.
      const items: Raw[] = [
        { k: null, v: 0 },
        { k: 2, v: 20 },
        { k: 1, v: 10 }
      ];
      const out = t.setMany(items as any, undefined, true, 'ITERATIVE' as any);
      expect(out.length).toBe(3);

      expect(t.has(1)).toBe(true);
      expect(t.has(2)).toBe(true);
    });
  });

  describe('_boundByPredicate', () => {
  it('recursive traversal: returns first in-order match and short-circuits once found', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15, 3, 7, 12, 18]) t.set(k, k);

      const pred = (node: any) => node.key >= 7;
      const out = (t as any)._boundByPredicate(pred, 'RECURSIVE');
      expect(out?.key).toBe(7);
    });

    it('recursive traversal: returns undefined when no match', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = (t as any)._boundByPredicate((node: any) => node.key === 999, 'RECURSIVE');
      expect(out).toBeUndefined();
    });

    it('iterative traversal: returns first match and breaks when stack pop is not real', () => {
      const t = new BST<number, number>([], { isMapMode: false });
      for (const k of [10, 5, 15]) t.set(k, k);

      const out = (t as any)._boundByPredicate((node: any) => node.key === 10, 'ITERATIVE');
      expect(out?.key).toBe(10);

      // Force the internal stack-pop guard branch by clearing the tree and calling again.
      t.clear();
      const out2 = (t as any)._boundByPredicate((node: any) => node.key === 1, 'ITERATIVE');
      expect(out2).toBeUndefined();
    });
  });
});
