import { BST } from '../../../../src';
import { Range } from '../../../../src/common';

describe('BST remaining misc branch coverage', () => {
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

    const out = t.lower((n: any) => n.key === 999, (n: any) => n.key, 'ITERATIVE' as any);
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
