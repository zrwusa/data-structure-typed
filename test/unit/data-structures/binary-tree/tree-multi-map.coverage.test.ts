import { TreeMultiMap, TreeMultiMapNode } from '../../../../src';

/**
 * Coverage-focused tests for TreeMultiMap branches.
 * Keep existing @example tests intact.
 */
describe('TreeMultiMap coverage', () => {
  it('TreeMultiMapNode.familyPosition covers ROOT/LEFT/RIGHT/ISOLATED cases', () => {
    const isolated = new TreeMultiMapNode<number, number>(1);
    expect(isolated.familyPosition).toBe('ISOLATED');

    const root = new TreeMultiMapNode<number, number>(10);
    const left = new TreeMultiMapNode<number, number>(5);
    root.left = left;
    expect(root.familyPosition).toBe('ROOT');
    expect(left.familyPosition).toBe('LEFT');

    left.left = new TreeMultiMapNode<number, number>(2);
    expect(left.familyPosition).toBe('ROOT_LEFT');

    const right = new TreeMultiMapNode<number, number>(15);
    root.right = right;
    expect(right.familyPosition).toBe('RIGHT');

    right.right = new TreeMultiMapNode<number, number>(20);
    expect(right.familyPosition).toBe('ROOT_RIGHT');
  });

  it('set branches: mapMode true uses _setByNode before _setToValues', () => {
    const tmm = new TreeMultiMap<number, string>();

    // Create key with empty bucket via bare key insert
    tmm.set(2 as any);
    expect(tmm.get(2)).toEqual([]);

    // Now set a value: hits existingNode real + values append
    tmm.set(2, 'a');
    expect(tmm.get(2)).toEqual(['a']);

    // Append single value (existingValues defined)
    tmm.set(2, 'b');
    expect(tmm.get(2)).toEqual(['a', 'b']);

    // Entry form with explicit values array
    tmm.set([2, ['c', 'd']]);
    expect(tmm.get(2)).toEqual(['a', 'b', 'c', 'd']);

    // // Entry form + value param should wrap into [value]
    // tmm.set([2, ['ignored']], 'e');
    // expect(tmm.get(2)).toEqual(['a', 'b', 'c', 'd', 'e']);

    // null key ignored
    expect(tmm.set([null as any, ['x']] as any)).toBe(false);
  });

  it('set branches: mapMode false prefers _setToValues before _setByNode', () => {
    const tmm = new TreeMultiMap<number, string>([], { isMapMode: false });

    // When bucket exists, it should append without changing tree structure.
    tmm.set(1, 'a');
    tmm.set(1, 'b');
    expect(tmm.get(1)).toEqual(['a', 'b']);

    // When bucket missing, it should create via super.set
    tmm.set(3 as any); // insert key-only => bucket may be created as empty array
    expect(tmm.get(3)).toEqual([]);
    tmm.set(3, 'x');
    expect(tmm.get(3)).toEqual(['x']);
  });

  it('deleteValue branches: not found, found, and delete-when-empty', () => {
    const tmm = new TreeMultiMap<number, number>();

    // not found bucket
    expect(tmm.deleteValue(1, 1)).toBe(false);

    tmm.set(1, 1);
    tmm.set(1, 2);

    // value not present
    expect(tmm.deleteValue(1, 999)).toBe(false);

    // delete present
    expect(tmm.deleteValue(1, 1)).toBe(true);
    expect(tmm.get(1)).toEqual([2]);

    // delete last -> removes key
    expect(tmm.deleteValue(1, 2)).toBe(true);
    expect(tmm.get(1)).toBeUndefined();
  });

  it('_createInstance/_createLike are exercised via clone/map', () => {
    const tmm = new TreeMultiMap<number, number>();
    tmm.set(1, 10);
    tmm.set(1, 11);

    const cloned = tmm.clone();
    expect(cloned.get(1)).toEqual([10, 11]);

    const mapped = tmm.map((values, key) => [key + 1, values ?? []]);
    // map returns TreeMultiMap when mapping to array values
    expect((mapped as any).get(2)).toEqual([10, 11]);
  });
});
