import { RedBlackTree } from '../../../../src';

describe('RedBlackTree _setKVNode remaining branch coverage', () => {
  it('normal search loop takes `current.right ?? NIL` with a real right child (covers binary-expr branch)', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    // Build a tree where root has a real right child.
    t.set(10, 10);
    t.set(15, 15);
    t.set(20, 20);

    // Skip boundary fast paths so we go through the normal search loop.
    (t as any)._header._left = undefined;

    // Insert a key greater than root so traversal takes the right-child branch with a real node.
    expect(t.set(25, 25)).toBe(true);
    expect(t.has(25)).toBe(true);
  });

  it('normal update path (mapMode) hits `_setValue` when nextValue is undefined (covers if/else at update)', () => {
    const t = new RedBlackTree<number, string>(); // mapMode default
    t.set(10, 'a');
    t.set(5, 'b');
    t.set(15, 'c');

    // Ensure we do NOT take boundary min/max update fast paths.
    (t as any)._header._left = undefined;
    (t as any)._header._right = undefined;

    // Update an existing key with undefined => mapMode uses _setValue branch and preserves existing value.
    t.set(10, undefined as any);
    expect(t.get(10)).toBe('a');
  });

  it('boundary max-key update (mapMode) hits `_setValue` branch when nextValue is undefined', () => {
    const t = new RedBlackTree<number, string>(); // mapMode default
    t.set(10, 'mid');
    t.set(5, 'min');
    t.set(15, 'max');

    // Update existing max key with undefined should take boundary cMax===0 fast-path and go through _setValue.
    t.set(15, undefined as any);
    expect(t.get(15)).toBe('max');
  });
});
