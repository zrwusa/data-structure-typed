import { RedBlackTree } from '../../../../src';

describe('RedBlackTree delete cache fallback coverage', () => {
  it('forces min/max fallback recomputation branches after deleting min/max', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15, 3, 7, 12, 18]) t.set(k, k);

    // Delete current min and max to set willDeleteMin/Max paths.
    const NIL = (t as any).NIL;
    const minNode = (t as any)._header._left;
    const maxNode = (t as any)._header._right;
    expect(minNode).not.toBe(NIL);
    expect(maxNode).not.toBe(NIL);
    const minKey = minNode.key as number;
    const maxKey = maxNode.key as number;

    // After first delete, corrupt caches so fallback recompute branches run.
    t.delete(minKey);
    (t as any)._minNode = undefined;

    // Delete max and also corrupt max cache.
    t.delete(maxKey);
    (t as any)._maxNode = undefined;

    // Trigger an additional delete to enter the cache-update block with size>0.
    t.delete(10);

    // Should still have correct header min/max after recomputation.
    const keys = [...t].map(([k]) => k).sort((a, b) => a - b);
    if (keys.length > 0) {
      expect((t as any)._header._left.key).toBe(keys[0]);
      expect((t as any)._header._right.key).toBe(keys[keys.length - 1]);
    }
  });

  it('size<=0 branch clears min/max caches', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(1, 1);

    t.delete(1);

    expect(t.size).toBe(0);
    // expect(t.min).toBeUndefined();
    // expect(t.max).toBeUndefined();
    const NIL = (t as any).NIL;
    expect((t as any)._header._left).toBe(NIL);
    expect((t as any)._header._right).toBe(NIL);
  });
});
