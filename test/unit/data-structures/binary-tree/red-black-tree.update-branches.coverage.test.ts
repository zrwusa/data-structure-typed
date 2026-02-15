import { RedBlackTree } from '../../../../src';

describe('RedBlackTree update-branch coverage', () => {
  it('mapMode: updating existing min/max with undefined value overwrites values (node-index store)', () => {
    const t = new RedBlackTree<number, string>(); // mapMode default

    t.set(10, 'mid');
    t.set(5, 'min');
    t.set(15, 'max');

    // Update min/max keys with undefined (bypasses store-fast-path, uses _setValue branch).
    t.set(5, undefined as any);
    t.set(15, undefined as any);

    // In node-index mapMode, node.value is the source of truth, so undefined overwrites.
    expect(t.get(5)).toBe(undefined);
    expect(t.get(15)).toBe(undefined);
  });

  it('set mode: updating an existing interior key uses current.value assignment branch', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: false });
    for (const k of [10, 5, 15, 12]) t.set(k, String(k));

    // key=12 is interior (not min/max)
    const size0 = t.size;
    t.set(12, 'twelve');
    expect(t.size).toBe(size0);
    expect(t.getNode(12)?.value).toBe('twelve');
  });
});
