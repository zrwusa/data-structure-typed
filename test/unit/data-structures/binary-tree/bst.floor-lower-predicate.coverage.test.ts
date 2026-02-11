import { BST } from '../../../../src';

describe('BST floor()/lower() predicate + callback-shape coverage', () => {
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
