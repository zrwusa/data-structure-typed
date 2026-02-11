import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

function validateRedBlackTree<K, V>(tree: RedBlackTree<K, V>) {
  const NIL = tree.NIL as unknown as RedBlackTreeNode<K, V>;
  const root = tree.root as unknown as RedBlackTreeNode<K, V> | undefined;

  // Empty tree is valid.
  if (!root || root === NIL) return;

  // Root must be black.
  expect(root.color).toBe('BLACK');

  const seen = new Set<RedBlackTreeNode<K, V>>();

  const check = (
    node: RedBlackTreeNode<K, V>,
    parent: RedBlackTreeNode<K, V> | undefined,
    min: any,
    max: any
  ) => {
    if (node === NIL) return;

    // Basic structural sanity
    expect(node).toBeInstanceOf(RedBlackTreeNode);
    // Some implementations keep root.parent as undefined; tolerate that.
    if (parent !== undefined) {
      expect(node.parent === parent || node.parent === undefined).toBe(true);
    }

    // No cycles
    expect(seen.has(node)).toBe(false);
    seen.add(node);

    // BST ordering (strict)
    if (min !== undefined) expect((node.key as any) > min).toBe(true);
    if (max !== undefined) expect((node.key as any) < max).toBe(true);

    const left = (node.left ?? NIL) as RedBlackTreeNode<K, V>;
    const right = (node.right ?? NIL) as RedBlackTreeNode<K, V>;

    // Red property
    if (node.color === 'RED') {
      expect(left.color).toBe('BLACK');
      expect(right.color).toBe('BLACK');
    }

    check(left, node, min, node.key as any);
    check(right, node, node.key as any, max);
  };

  check(root, root.parent, undefined, undefined);
}

describe('RedBlackTree coverage push (keep @example tests intact)', () => {
  it('random mixed insert/delete sequences keep invariants (exercise fixups/rotations)', () => {
    // Deterministic pseudo-random generator (LCG) for reproducibility
    let seed = 123456789;
    const rand = () => {
      seed = (1103515245 * seed + 12345) % 0x80000000;
      return seed;
    };

    for (let round = 0; round < 20; round++) {
      const tree = new RedBlackTree<number, number>();
      const present = new Set<number>();

      // Insert some keys
      for (let i = 0; i < 200; i++) {
        const k = rand() % 500;
        tree.set(k, k);
        present.add(k);
      }
      validateRedBlackTree(tree);

      // Random deletes + reinserts
      for (let i = 0; i < 400; i++) {
        const op = rand() % 3;
        const k = rand() % 500;
        if (op === 0) {
          tree.set(k, k);
          present.add(k);
        } else {
          tree.delete(k);
          present.delete(k);
        }
        if (i % 25 === 0) validateRedBlackTree(tree);
      }

      // Spot-check final contents agree with Set
      for (let k = 0; k < 500; k++) {
        const has = tree.has(k);
        expect(has).toBe(present.has(k));
      }
      validateRedBlackTree(tree);
    }
  });

  it('deletes exercise mirror fixup sides (left/right) with deterministic shape', () => {
    // Build a tree with enough structure to trigger both sides of _deleteFixup
    const t = new RedBlackTree<number, number>();
    const keys = [11, 2, 14, 1, 7, 15, 5, 8, 4, 6, 3, 13, 12, 10, 9];
    for (const k of keys) t.set(k, k);

    validateRedBlackTree(t);

    // Delete sequence designed to hit different sibling/child color cases.
    // (The exact rotations may vary, but this tends to traverse many fixup branches.)
    for (const k of [1, 14, 2, 15, 7, 11, 8, 6, 5]) {
      t.delete(k);
      validateRedBlackTree(t);
    }

    // Remaining keys should still be searchable and ordered
    const remaining = [...t].map(([k]) => k);
    const sorted = [...remaining].sort((a, b) => a - b);
    expect(remaining).toEqual(sorted);
  });
});
