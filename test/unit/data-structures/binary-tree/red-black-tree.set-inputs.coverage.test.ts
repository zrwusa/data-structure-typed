import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

class RBTWithBadInsert extends RedBlackTree<number, number> {
  // Simulate an internal failure where _insert reports CREATED but does not establish a real root.
  // This is purely to cover the defensive branch in set(node).
  protected override _insert(__node: RedBlackTreeNode<number, number>): any {
    // Ensure root stays NIL/undefined
    (this as any)._setRoot(undefined);
    return 'CREATED';
  }
}

describe('RedBlackTree set() input/defensive branches coverage', () => {
  it('returns false for nullish key inputs in key/entry paths', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    expect(t.set(null as any)).toBe(false);
    expect(t.set(undefined as any)).toBe(false);

    // entry with null/undefined key
    expect(t.set([null as any, 1] as any)).toBe(false);
    expect(t.set([undefined as any, 1] as any)).toBe(false);
  });

  it('key-only path delegates to _setKV and supports mapMode fast path', () => {
    const t = new RedBlackTree<number, number>(); // mapMode default

    // insert
    expect(t.set(1, 10)).toBe(true);
    expect(t.get(1)).toBe(10);

    // update should hit _setKV fast-path (store.has)
    expect(t.set(1, 20)).toBe(true);
    expect(t.get(1)).toBe(20);

    // update for missing key must fall through to _setKVNode
    expect(t.set(2, 200)).toBe(true);
    expect(t.get(2)).toBe(200);
  });

  it('node insertion path: defensive branch returns false when root is not real after CREATED', () => {
    const t = new RBTWithBadInsert([], { isMapMode: false });
    const n = new RedBlackTreeNode<number, number>(1, 1, 'BLACK');

    expect(t.set(n)).toBe(false);
    expect(t.size).toBe(0);
  });

  it('node insertion path: UPDATED branch returns true and updates mapMode store via _setValue', () => {
    const t = new RedBlackTree<number, number>();

    // First insert via node
    const n1 = new RedBlackTreeNode<number, number>(1, 0 as any, 'BLACK');
    expect(t.set(n1, 10)).toBe(true);
    expect(t.get(1)).toBe(10);

    // Second node with same key should trigger UPDATED in _insert -> set() UPDATED branch.
    const n1b = new RedBlackTreeNode<number, number>(1, 0 as any, 'BLACK');
    expect(t.set(n1b, 99)).toBe(true);

    // mapMode uses _setValue, so value should reflect newValue.
    expect(t.get(1)).toBe(99);
  });
});
