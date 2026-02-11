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
  it('RedBlackTreeNode.familyPosition covers ROOT/LEFT/RIGHT/ISOLATED cases', () => {
    const isolated = new RedBlackTreeNode<number, number>(1);
    expect(isolated.familyPosition).toBe('ISOLATED');

    // Root without parent but with a child
    const root = new RedBlackTreeNode<number, number>(10);
    const left = new RedBlackTreeNode<number, number>(5);
    root.left = left;
    left.parent = root;
    expect(root.familyPosition).toBe('ROOT');

    // Left child leaf
    expect(left.familyPosition).toBe('LEFT');

    // Left child that itself has a child -> ROOT_LEFT
    left.left = new RedBlackTreeNode<number, number>(2);
    left.left.parent = left;
    expect(left.familyPosition).toBe('ROOT_LEFT');

    // Right child leaf
    const right = new RedBlackTreeNode<number, number>(15);
    root.right = right;
    right.parent = root;
    expect(right.familyPosition).toBe('RIGHT');

    // Right child with its own child -> ROOT_RIGHT
    right.right = new RedBlackTreeNode<number, number>(20);
    right.right.parent = right;
    expect(right.familyPosition).toBe('ROOT_RIGHT');
  });

  it('clear() resets root/header caches and keeps tree usable', () => {
    const t = new RedBlackTree<number, number>();
    t.set(2, 2);
    t.set(1, 1);
    t.set(3, 3);

    expect(t.size).toBe(3);
    expect(t.get(2)).toBe(2);

    t.clear();

    expect(t.size).toBe(0);
    // Internal root is reset to NIL.
    expect(t.root).toBe(t.NIL);
    expect(t.get(2)).toBe(undefined);

    // Can insert again after clear
    t.set(4, 4);
    expect(t.size).toBe(1);
    expect(t.get(4)).toBe(4);
  });
  const expectContentsMatch = (tree: RedBlackTree<number, number>, present: Set<number>) => {
    for (let k = 0; k < 500; k++) {
      expect(tree.has(k)).toBe(present.has(k));
    }
  };

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
      expectContentsMatch(tree, present);
      validateRedBlackTree(tree);
    }
  });

  it('targeted delete sequences (both sides) keep invariants and contents', () => {
    const run = (keys: number[], deletes: number[]) => {
      const t = new RedBlackTree<number, number>();
      const present = new Set<number>();
      for (const k of keys) {
        t.set(k, k);
        present.add(k);
      }
      validateRedBlackTree(t);
      expectContentsMatch(t, present);

      for (const d of deletes) {
        t.delete(d);
        present.delete(d);
        validateRedBlackTree(t);
        expectContentsMatch(t, present);
      }

      // Iteration yields sorted keys
      const remaining = [...t].map(([k]) => k);
      const sorted = [...remaining].sort((a, b) => a - b);
      expect(remaining).toEqual(sorted);
    };

    // A fairly dense keyset; deletes include leaves, internal nodes, and root-ish nodes.
    const keysA = [20, 10, 30, 5, 15, 25, 40, 1, 7, 12, 17, 22, 27, 35, 50, 6, 8, 11, 13, 16, 18];
    run(keysA, [1, 7, 8, 10, 12, 15, 16, 17, 20, 22, 25]);

    // Mirror-ish construction (different insertion order), tends to hit opposite-side fixups.
    const keysB = [30, 20, 40, 10, 25, 35, 50, 5, 15, 22, 27, 33, 37, 45, 55, 1, 7, 12, 17];
    run(keysB, [55, 50, 45, 40, 37, 35, 33, 30, 27, 25, 22]);
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
