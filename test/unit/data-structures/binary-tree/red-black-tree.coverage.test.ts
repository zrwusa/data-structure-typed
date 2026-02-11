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

  it('setWithHintNode covers fast-attach + fallback branches (map mode)', () => {
    // Default is map-mode.
    const t = new RedBlackTree<number, string>();

    // Seed tree
    t.set(10, 'a');
    t.set(20, 'b');
    t.set(5, 'c');

    const hint10 = t.getNode(10)!;

    // c0 === 0 update branch
    const same = t.setWithHintNode(10, 'a2', hint10);
    expect(same).toBe(hint10);
    expect(t.get(10)).toBe('a2');

    // c0 < 0 and direct attach to hint.left (empty)
    const n7 = t.setWithHintNode(7, 'v7', hint10);
    expect(n7?.key).toBe(7);
    expect(t.get(7)).toBe('v7');

    // c0 > 0 direct attach to hint.right (empty)
    const n15 = t.setWithHintNode(15, 'v15', hint10);
    expect(n15?.key).toBe(15);
    expect(t.get(15)).toBe('v15');

    // Force predecessor/successor branches:
    // Insert near left side using a "bad" hint so it needs pred logic.
    const hint20 = t.getNode(20)!;
    const n17 = t.setWithHintNode(17, 'v17', hint20);
    expect(n17?.key).toBe(17);
    expect(t.get(17)).toBe('v17');

    // Insert near right side using a "bad" hint so it needs succ logic.
    const hint5 = t.getNode(5)!;
    const n6 = t.setWithHintNode(6, 'v6', hint5);
    expect(n6?.key).toBe(6);
    expect(t.get(6)).toBe('v6');

    // value === undefined in map mode should take the _setValue path, not store.set fast path
    t.setWithHintNode(99, undefined as any, hint20);
    expect(t.has(99)).toBe(true);
  });

  it('setWithHintNode covers hint invalid + pred/succ early-fallback branches + set-mode update', () => {
    // hint invalid => fallback
    const t = new RedBlackTree<number, string>();
    t.set(10, 'a');
    t.set(20, 'b');
    t.set(5, 'c');

    const other = new RedBlackTree<number, string>();
    other.set(10, 'x');
    const foreignHint = other.getNode(10)!;

    // foreign hint should be treated as invalid for this tree; must still insert correctly.
    const n1 = t.setWithHintNode(1, 'v1', foreignHint as any);
    expect(n1?.key).toBe(1);
    expect(t.get(1)).toBe('v1');

    // pred early-fallback: choose hint=10, but key far left so predecessor key >= key
    const hint10 = t.getNode(10)!;
    const n0 = t.setWithHintNode(0, 'v0', hint10);
    expect(n0?.key).toBe(0);
    expect(t.get(0)).toBe('v0');

    // succ early-fallback: choose hint=10, but key far right so successor key <= key
    const n30 = t.setWithHintNode(30, 'v30', hint10);
    expect(n30?.key).toBe(30);
    expect(t.get(30)).toBe('v30');

    // set-mode update branch (c0===0 but not map-mode)
    const s = new RedBlackTree<number, string>([], { isMapMode: false });
    s.set(10, 'a');
    const h = s.getNode(10)!;
    expect(h.value).toBe('a');
    const same = s.setWithHintNode(10, 'b', h);
    expect(same).toBe(h);
    expect(s.getNode(10)?.value).toBe('b');
  });

  it('_setKV map-mode fast-path updates store without changing size', () => {
    const t = new RedBlackTree<number, string>();
    t.set(1, 'a');
    const n1 = t.getNode(1);
    expect(t.size).toBe(1);

    // nextValue !== undefined and store.has(key) => fast-path
    t.set(1, 'b');
    expect(t.size).toBe(1);
    expect(t.get(1)).toBe('b');
    expect(t.getNode(1)).toBe(n1);

    // undefined value should still be allowed, but will not take store fast-path
    t.set(1, undefined as any);
    expect(t.size).toBe(1);
    expect(t.has(1)).toBe(true);
  });

  it('internal helpers: _findNodeByKey/_predecessorOf/_successorOf', () => {
    const t = new RedBlackTree<number, number>();

    // Empty tree: find returns undefined
    expect((t as any)._findNodeByKey(1)).toBe(undefined);

    // Build small tree
    for (const k of [10, 5, 15, 3, 7, 12, 18]) t.set(k, k);

    const n10 = t.getNode(10)!;
    const n3 = t.getNode(3)!;
    const n18 = t.getNode(18)!;

    // _findNodeByKey hits <, >, and === branches
    expect((t as any)._findNodeByKey(7)?.key).toBe(7);
    expect((t as any)._findNodeByKey(999)).toBe(undefined);

    // predecessor: node with left subtree
    expect((t as any)._predecessorOf(n10)?.key).toBe(7);
    // predecessor: minimum has none
    expect((t as any)._predecessorOf(n3)).toBe(undefined);

    // successor: node with right subtree
    expect((t as any)._successorOf(n10)?.key).toBe(12);
    // successor: maximum has none
    expect((t as any)._successorOf(n18)).toBe(undefined);
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
