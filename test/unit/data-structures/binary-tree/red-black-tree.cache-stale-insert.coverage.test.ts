import { RedBlackTree } from '../../../../src';

describe('RedBlackTree stale cache insert coverage', () => {
  it('stale header min/max caches trigger comparison-based cache repair on insertion', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(10, 10);
    t.set(5, 5);
    t.set(15, 15);

    const n10 = t.getNode(10)!;

    // Corrupt caches to point at an interior node.
    (t as any)._header._left = n10;
    (t as any)._header._right = n10;

    // Insert a new min (not a boundary attach, because min cache is stale and minN.left is real).
    t.set(1, 1);
    expect((t as any)._header._left.key).toBe(1);

    // Re-corrupt and insert a new max.
    (t as any)._header._left = n10;
    (t as any)._header._right = n10;

    t.set(20, 20);
    expect((t as any)._header._right.key).toBe(20);
  });

  it('mapMode update with undefined value does not take store-fast-path (no throw)', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: true });
    t.set(1, 'a');
    expect(t.get(1)).toBe('a');

    // nextValue is undefined => should bypass map-mode store.has fast-path
    // and go through normal set logic.
    t.set(1, undefined as any);
    // node-index mapMode: undefined overwrites.
    expect(t.get(1)).toBe(undefined);
  });
});
