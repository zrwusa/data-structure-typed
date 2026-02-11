import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

function validateRedBlackTree<K, V>(tree: RedBlackTree<K, V>) {
  const NIL = tree.NIL as unknown as RedBlackTreeNode<K, V>;
  const root = tree.root as unknown as RedBlackTreeNode<K, V> | undefined;
  if (!root || root === NIL) return;
  expect(root.color).toBe('BLACK');

  const seen = new Set<RedBlackTreeNode<K, V>>();

  const check = (node: RedBlackTreeNode<K, V>, min: any, max: any) => {
    if (node === NIL) return;
    expect(seen.has(node)).toBe(false);
    seen.add(node);

    if (min !== undefined) expect((node.key as any) > min).toBe(true);
    if (max !== undefined) expect((node.key as any) < max).toBe(true);

    const left = (node.left ?? NIL) as RedBlackTreeNode<K, V>;
    const right = (node.right ?? NIL) as RedBlackTreeNode<K, V>;

    if (node.color === 'RED') {
      expect(left.color).toBe('BLACK');
      expect(right.color).toBe('BLACK');
    }

    check(left, min, node.key as any);
    check(right, node.key as any, max);
  };

  check(root, undefined, undefined);
}

describe('RedBlackTree delete-fixup coverage', () => {
  it('CLRS-style delete sequence exercises multiple fixup branches', () => {
    // Classic CLRS insertion set.
    const t = new RedBlackTree<number, number>();
    for (const k of [7, 3, 18, 10, 22, 8, 11, 26]) t.set(k, k);
    validateRedBlackTree(t);

    // Deletes from CLRS examples / common RB delete discussions.
    for (const k of [18, 11, 3, 10, 22, 26, 8, 7]) {
      t.delete(k);
      validateRedBlackTree(t);
    }

    expect(t.size).toBe(0);
  });

  it('deleting many black leaves triggers fixup in both left/right sibling orientations', () => {
    const t = new RedBlackTree<number, number>();
    // Build a reasonably balanced tree.
    for (let i = 1; i <= 31; i++) t.set(i, i);
    validateRedBlackTree(t);

    // Delete odds then evens.
    for (let i = 1; i <= 31; i += 2) {
      t.delete(i);
      validateRedBlackTree(t);
    }
    for (let i = 2; i <= 30; i += 2) {
      t.delete(i);
      validateRedBlackTree(t);
    }

    expect(t.size).toBe(0);
  });
});
