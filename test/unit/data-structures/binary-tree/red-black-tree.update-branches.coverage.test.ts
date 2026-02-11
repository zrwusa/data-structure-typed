import { RedBlackTree } from '../../../../src';

describe('RedBlackTree update-branch coverage', () => {
  it('mapMode: updating existing min/max with undefined value hits _setValue branches (value unchanged)', () => {
    const t = new RedBlackTree<number, string>(); // mapMode default

    t.set(10, 'mid');
    t.set(5, 'min');
    t.set(15, 'max');

    // Update min/max keys with undefined (bypasses store-fast-path, uses _setValue branch).
    t.set(5, undefined as any);
    t.set(15, undefined as any);

    // Existing semantics: undefined does not overwrite stored values.
    expect(t.get(5)).toBe('min');
    expect(t.get(15)).toBe('max');
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
