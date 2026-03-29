import {
  AVLTree,
  BST,
  RedBlackTree,
  TreeMap,
  TreeMultiMap,
  TreeMultiSet,
  TreeSet
} from '../../../../src';

describe('Order Statistic Tree', () => {
  // ─── select ───────────────────────────────────────────

  describe('getByRank', () => {
    it('@example [RedBlackTree.select] Select element by position in tree order', () => {
      const tree = new RedBlackTree<number>(
        [50, 30, 70, 20, 40, 60, 80],
        { enableOrderStatistic: true }
      );
      expect(tree.getByRank(0)).toBe(20);  // smallest
      expect(tree.getByRank(3)).toBe(50);  // median
      expect(tree.getByRank(6)).toBe(80);  // largest
    });

    it('should return undefined for out-of-bounds k', () => {
      const tree = new RedBlackTree<number>([10, 20, 30], { enableOrderStatistic: true });
      expect(tree.getByRank(-1)).toBeUndefined();
      expect(tree.getByRank(3)).toBeUndefined();
      expect(tree.getByRank(100)).toBeUndefined();
    });

    it('should return undefined on empty tree', () => {
      const tree = new RedBlackTree<number>([], { enableOrderStatistic: true });
      expect(tree.getByRank(0)).toBeUndefined();
    });

    it('should work with callback', () => {
      const tree = new RedBlackTree<number, string>(
        [[10, 'a'], [20, 'b'], [30, 'c']],
        { enableOrderStatistic: true }
      );
      const node = tree.getByRank(1, n => n);
      expect(node?.key).toBe(20);
      expect(node?.value).toBe('b');
    });

    it('should work with callback returning entry', () => {
      const tree = new RedBlackTree<number, string>(
        [[10, 'a'], [20, 'b'], [30, 'c']],
        { enableOrderStatistic: true }
      );
      const entry = tree.getByRank(2, n => [n.key, n.value]);
      expect(entry).toEqual([30, 'c']);
    });

    it('should work with single element', () => {
      const tree = new RedBlackTree<number>([42], { enableOrderStatistic: true });
      expect(tree.getByRank(0)).toBe(42);
      expect(tree.getByRank(1)).toBeUndefined();
    });

    it('should support IterationType RECURSIVE', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50],
        { enableOrderStatistic: true }
      );
      expect(tree.getByRank(2, n => n.key, 'RECURSIVE')).toBe(30);
    });

    it('should support IterationType ITERATIVE', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50],
        { enableOrderStatistic: true }
      );
      expect(tree.getByRank(2, n => n.key, 'ITERATIVE')).toBe(30);
    });
  });

  // ─── rank ─────────────────────────────────────────────

  describe('getRank', () => {
    it('@example [RedBlackTree.rank] Get the rank of a key in tree order', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50],
        { enableOrderStatistic: true }
      );
      expect(tree.getRank(10)).toBe(0);  // smallest → rank 0
      expect(tree.getRank(30)).toBe(2);  // 2 elements less than 30
      expect(tree.getRank(50)).toBe(4);  // largest → rank 4
      expect(tree.getRank(25)).toBe(2);  // non-existing: insertion position
    });

    it('should return insertion position for non-existing keys', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50],
        { enableOrderStatistic: true }
      );
      expect(tree.getRank(5)).toBe(0);   // before all
      expect(tree.getRank(15)).toBe(1);  // between 10 and 20
      expect(tree.getRank(25)).toBe(2);  // between 20 and 30
      expect(tree.getRank(100)).toBe(5); // after all
    });

    it('should return -1 on empty tree', () => {
      const tree = new RedBlackTree<number>([], { enableOrderStatistic: true });
      expect(tree.getRank(10)).toBe(-1);
    });

    it('should return -1 for null/undefined', () => {
      const tree = new RedBlackTree<number>([10, 20], { enableOrderStatistic: true });
      expect(tree.getRank(null as any)).toBe(-1);
      expect(tree.getRank(undefined as any)).toBe(-1);
    });

    it('should support IterationType', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30],
        { enableOrderStatistic: true }
      );
      expect(tree.getRank(20, 'RECURSIVE')).toBe(1);
      expect(tree.getRank(20, 'ITERATIVE')).toBe(1);
    });
  });

  // ─── rangeByRank ──────────────────────────────────────

  describe('rangeByRank', () => {
    it('@example [RedBlackTree.rangeByRank] Get elements by position range in tree order', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50, 60, 70],
        { enableOrderStatistic: true }
      );
      expect(tree.rangeByRank(0, 2)).toEqual([10, 20, 30]);   // first 3
      expect(tree.rangeByRank(2, 4)).toEqual([30, 40, 50]);   // middle 3
      expect(tree.rangeByRank(5, 6)).toEqual([60, 70]);        // last 2
    });

    it('should clamp out-of-bounds range', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30],
        { enableOrderStatistic: true }
      );
      expect(tree.rangeByRank(-5, 1)).toEqual([10, 20]);
      expect(tree.rangeByRank(0, 100)).toEqual([10, 20, 30]);
    });

    it('should return empty array for invalid range', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30],
        { enableOrderStatistic: true }
      );
      expect(tree.rangeByRank(5, 3)).toEqual([]);
    });

    it('should return empty array on empty tree', () => {
      const tree = new RedBlackTree<number>([], { enableOrderStatistic: true });
      expect(tree.rangeByRank(0, 5)).toEqual([]);
    });

    it('should work with callback', () => {
      const tree = new RedBlackTree<number, string>(
        [[10, 'a'], [20, 'b'], [30, 'c']],
        { enableOrderStatistic: true }
      );
      const entries = tree.rangeByRank(0, 1, n => [n.key, n.value]);
      expect(entries).toEqual([[10, 'a'], [20, 'b']]);
    });

    it('@example [RedBlackTree.rangeByRank] Pagination by position in tree order', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50, 60, 70, 80, 90],
        { enableOrderStatistic: true }
      );
      const pageSize = 3;

      // Page 1
      expect(tree.rangeByRank(0, pageSize - 1)).toEqual([10, 20, 30]);
      // Page 2
      expect(tree.rangeByRank(pageSize, 2 * pageSize - 1)).toEqual([40, 50, 60]);
      // Page 3
      expect(tree.rangeByRank(2 * pageSize, 3 * pageSize - 1)).toEqual([70, 80, 90]);
    });

    it('should support IterationType', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50],
        { enableOrderStatistic: true }
      );
      expect(tree.rangeByRank(1, 3, n => n.key, 'RECURSIVE')).toEqual([20, 30, 40]);
      expect(tree.rangeByRank(1, 3, n => n.key, 'ITERATIVE')).toEqual([20, 30, 40]);
    });
  });

  // ─── Inverse relationship ─────────────────────────────

  describe('inverse relationship', () => {
    it('@example [RedBlackTree.select] Inverse property: getByRank(getRank(key)) === key', () => {
      const keys = [15, 25, 35, 45, 55, 65, 75];
      const tree = new RedBlackTree<number>(keys, { enableOrderStatistic: true });
      for (const key of keys) {
        expect(tree.getByRank(tree.getRank(key))).toBe(key);
      }
    });

    it('rank(getByRank(k)) === k for all valid k', () => {
      const tree = new RedBlackTree<number>(
        [15, 25, 35, 45, 55, 65, 75],
        { enableOrderStatistic: true }
      );
      for (let k = 0; k < tree.size; k++) {
        expect(tree.getRank(tree.getByRank(k)!)).toBe(k);
      }
    });
  });

  // ─── Count maintenance ────────────────────────────────

  describe('count maintenance', () => {
    it('root count should equal tree size after insertions', () => {
      const tree = new RedBlackTree<number>([], { enableOrderStatistic: true });
      for (let i = 0; i < 100; i++) {
        tree.add([i, undefined]);
      }
      expect((tree.root as any)?._count).toBe(tree.size);
    });

    it('root count should equal tree size after deletions', () => {
      const keys = Array.from({ length: 50 }, (_, i) => i);
      const tree = new RedBlackTree<number>(keys, { enableOrderStatistic: true });

      // Delete half
      for (let i = 0; i < 25; i++) {
        tree.delete(i);
      }
      expect((tree.root as any)?._count).toBe(tree.size);
      expect(tree.size).toBe(25);
    });

    it('count integrity after mixed insert/delete', () => {
      const tree = new RedBlackTree<number>([], { enableOrderStatistic: true });

      tree.add([10, undefined]);
      tree.add([20, undefined]);
      tree.add([30, undefined]);
      expect((tree.root as any)?._count).toBe(3);

      tree.delete(20);
      expect((tree.root as any)?._count).toBe(2);

      tree.add([25, undefined]);
      tree.add([15, undefined]);
      expect((tree.root as any)?._count).toBe(4);
    });

    it('select/rank remain consistent after deletions', () => {
      const tree = new RedBlackTree<number>(
        [10, 20, 30, 40, 50],
        { enableOrderStatistic: true }
      );

      tree.delete(30);
      // Remaining: [10, 20, 40, 50]
      expect(tree.getByRank(0)).toBe(10);
      expect(tree.getByRank(1)).toBe(20);
      expect(tree.getByRank(2)).toBe(40);
      expect(tree.getByRank(3)).toBe(50);
      expect(tree.getRank(10)).toBe(0);
      expect(tree.getRank(20)).toBe(1);
      expect(tree.getRank(40)).toBe(2);
      expect(tree.getRank(50)).toBe(3);
    });
  });

  // ─── All subclasses ───────────────────────────────────

  describe('BST', () => {
    it('@example [BST.select] Select by position in BST', () => {
      const tree = new BST<number>([30, 10, 50, 20, 40], { enableOrderStatistic: true });
      expect(tree.getByRank(0)).toBe(10);
      expect(tree.getByRank(4)).toBe(50);
      expect(tree.getRank(30)).toBe(2);
    });
  });

  describe('AVLTree', () => {
    it('@example [AVLTree.select] Select by position survives AVL rotations', () => {
      const tree = new AVLTree<number>([], { enableOrderStatistic: true });
      // Insert in order to trigger rotations
      for (let i = 1; i <= 10; i++) {
        tree.add([i, undefined]);
      }
      expect(tree.getByRank(0)).toBe(1);
      expect(tree.getByRank(9)).toBe(10);
      expect(tree.getRank(5)).toBe(4);
      expect((tree.root as any)?._count).toBe(10);
    });

    it('should maintain count through AVL rotations', () => {
      const tree = new AVLTree<number>([], { enableOrderStatistic: true });
      // Sequential insert causes multiple rotations
      for (let i = 1; i <= 20; i++) {
        tree.add([i, undefined]);
        expect((tree.root as any)?._count).toBe(i);
      }
    });
  });

  describe('TreeMap', () => {
    it('@example [TreeMap.select] Select entry by position in TreeMap', () => {
      const map = new TreeMap<string, number>(
        [['alice', 95], ['bob', 87], ['charlie', 92]],
        { enableOrderStatistic: true }
      );
      expect(map.getByRank(0)).toEqual(['alice', 95]);
      expect(map.getByRank(1)).toEqual(['bob', 87]);
      expect(map.getByRank(2)).toEqual(['charlie', 92]);
      expect(map.getByRank(3)).toBeUndefined();
    });

    it('should support rank', () => {
      const map = new TreeMap<string, number>(
        [['alice', 95], ['bob', 87], ['charlie', 92]],
        { enableOrderStatistic: true }
      );
      expect(map.getRank('alice')).toBe(0);
      expect(map.getRank('bob')).toBe(1);
      expect(map.getRank('charlie')).toBe(2);
      expect(map.getRank('aaa')).toBe(0);  // before alice
      expect(map.getRank('bbb')).toBe(1);  // between alice and bob
    });

    it('rangeByRank should return entries [key, value]', () => {
      const map = new TreeMap<string, number>(
        [['alice', 95], ['bob', 87], ['charlie', 92]],
        { enableOrderStatistic: true }
      );
      const result = map.rangeByRank(0, 1);
      expect(result).toEqual([['alice', 95], ['bob', 87]]);
    });
  });

  describe('TreeSet', () => {
    it('@example [TreeSet.select] Select element by position in TreeSet', () => {
      const set = new TreeSet<number>([30, 10, 50, 20, 40], { enableOrderStatistic: true });
      expect(set.getByRank(0)).toBe(10);
      expect(set.getByRank(2)).toBe(30);
      expect(set.getRank(30)).toBe(2);
    });

    it('should support rangeByRank', () => {
      const set = new TreeSet<number>([10, 20, 30, 40, 50], { enableOrderStatistic: true });
      expect(set.rangeByRank(1, 3)).toEqual([20, 30, 40]);
    });
  });

  describe('TreeMultiMap', () => {
    it('should support select/rank with duplicates', () => {
      const tree = new TreeMultiMap<number, string>(
        [[10, 'a'], [20, 'b'], [20, 'c'], [30, 'd']],
        { enableOrderStatistic: true }
      );
      // select returns [key, values[]]
      const first = tree.getByRank(0);
      expect(first).toBeDefined();
      expect(first![0]).toBe(10);
      expect(Array.isArray(first![1])).toBe(true);
      expect(tree.getByRank(1)![0]).toBe(20);
      expect(tree.getByRank(2)![0]).toBe(30);
      expect(tree.getRank(20)).toBe(1);
    });

    it('rangeByRank should return entries [key, values[]]', () => {
      const tree = new TreeMultiMap<number, string>();
      tree.setMany([[10, 'a'], [10, 'b'], [20, 'c'], [30, 'd']]);
      // enableOrderStatistic not set — need to create with option
      const tree2 = new TreeMultiMap<number, string>(
        [[10, 'a'], [20, 'b'], [30, 'c']],
        { enableOrderStatistic: true }
      );
      const result = tree2.rangeByRank(0, 1);
      expect(result.length).toBe(2);
      expect(result[0][0]).toBe(10);
      expect(result[1][0]).toBe(20);
      expect(Array.isArray(result[0][1])).toBe(true);
    });
  });

  describe('TreeMultiSet', () => {
    it('should support select/rank', () => {
      const set = new TreeMultiSet<number>([10, 20, 30], { enableOrderStatistic: true });
      expect(set.getByRank(0)).toBe(10);
      expect(set.getRank(20)).toBe(1);
    });

    it('rangeByRank should return keys K[]', () => {
      const set = new TreeMultiSet<number>([10, 20, 30, 40, 50], { enableOrderStatistic: true });
      const result = set.rangeByRank(1, 3);
      expect(result).toEqual([20, 30, 40]);
    });
  });

  // ─── enableOrderStatistic: false ──────────────────────

  describe('when enableOrderStatistic is false (default)', () => {
    it('select should throw', () => {
      const tree = new RedBlackTree<number>([10, 20, 30]);
      expect(() => tree.getByRank(0)).toThrow('enableOrderStatistic');
    });

    it('rank should throw', () => {
      const tree = new RedBlackTree<number>([10, 20, 30]);
      expect(() => tree.getRank(10)).toThrow('enableOrderStatistic');
    });

    it('rangeByRank should throw', () => {
      const tree = new RedBlackTree<number>([10, 20, 30]);
      expect(() => tree.rangeByRank(0, 2)).toThrow('enableOrderStatistic');
    });

    it('count should NOT be maintained', () => {
      const tree = new RedBlackTree<number>([10, 20, 30]);
      // count stays at default 1, not maintained
      expect((tree.root as any)?._count).toBe(1);
    });
  });



  // ─── Stress test ──────────────────────────────────────

  describe('stress test', () => {
    it('10K elements: select/rank consistency', () => {
      const n = 10_000;
      const keys = Array.from({ length: n }, (_, i) => i);
      // Shuffle
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }

      const tree = new RedBlackTree<number>(keys, { enableOrderStatistic: true });

      expect(tree.size).toBe(n);
      expect((tree.root as any)?._count).toBe(n);

      // Spot check select
      expect(tree.getByRank(0)).toBe(0);
      expect(tree.getByRank(n - 1)).toBe(n - 1);
      expect(tree.getByRank(5000)).toBe(5000);

      // Spot check rank
      expect(tree.getRank(0)).toBe(0);
      expect(tree.getRank(n - 1)).toBe(n - 1);
      expect(tree.getRank(5000)).toBe(5000);

      // Inverse for random samples
      for (let i = 0; i < 100; i++) {
        const k = Math.floor(Math.random() * n);
        expect(tree.getByRank(tree.getRank(k))).toBe(k);
        expect(tree.getRank(tree.getByRank(k)!)).toBe(k);
      }
    });

    it('random insert/delete: count integrity', () => {
      const tree = new RedBlackTree<number>([], { enableOrderStatistic: true });
      const present = new Set<number>();

      for (let i = 0; i < 1000; i++) {
        const val = Math.floor(Math.random() * 500);
        if (present.has(val)) {
          tree.delete(val);
          present.delete(val);
        } else {
          tree.add([val, undefined]);
          present.add(val);
        }
        expect((tree.root as any)?._count ?? 0).toBe(tree.size);
      }

      // Verify select/rank for all remaining
      const sorted = [...present].sort((a, b) => a - b);
      for (let k = 0; k < sorted.length; k++) {
        expect(tree.getByRank(k)).toBe(sorted[k]);
        expect(tree.getRank(sorted[k])).toBe(k);
      }
    });
  });
});

describe('Order Statistic Tree — coverage supplement', () => {
  it('rank with predicate input', () => {
    const tree = new RedBlackTree<number>([10, 20, 30], { enableOrderStatistic: true });
    expect(tree.getRank(node => node.key === 20)).toBe(1);
  });

  it('rank with node input', () => {
    const tree = new RedBlackTree<number>([10, 20, 30], { enableOrderStatistic: true });
    const node = tree.getNode(20);
    if (node) expect(tree.getRank(node)).toBe(1);
  });

  it('rank with entry input', () => {
    const tree = new RedBlackTree<number, string>([[10, 'a'], [20, 'b'], [30, 'c']], { enableOrderStatistic: true });
    expect(tree.getRank([20, 'b'])).toBe(1);
  });

  it('rank with entry [null, v] returns -1', () => {
    const tree = new RedBlackTree<number>([10, 20], { enableOrderStatistic: true });
    expect(tree.getRank([null, undefined])).toBe(-1);
  });

  it('rank with predicate that finds nothing returns -1', () => {
    const tree = new RedBlackTree<number>([10, 20], { enableOrderStatistic: true });
    expect(tree.getRank(node => node.key === 999)).toBe(-1);
  });

  it('select with IterationType as second arg (string overload)', () => {
    const tree = new RedBlackTree<number>([10, 20, 30], { enableOrderStatistic: true });
    // Pass iterationType as callback position (string)
    expect(tree.getByRank(1, 'RECURSIVE' as any)).toBe(20);
    expect(tree.getByRank(1, 'ITERATIVE' as any)).toBe(20);
  });

  it('rangeByRank with IterationType as third arg (string overload)', () => {
    const tree = new RedBlackTree<number>([10, 20, 30], { enableOrderStatistic: true });
    expect(tree.rangeByRank(0, 1, 'RECURSIVE' as any)).toEqual([10, 20]);
  });

  it('_next traverses up from rightmost child', () => {
    const tree = new RedBlackTree<number>([10, 20, 30, 40, 50], { enableOrderStatistic: true });
    // rangeByRank exercises _next internally
    expect(tree.rangeByRank(0, 4)).toEqual([10, 20, 30, 40, 50]);
  });

  it('rank RECURSIVE mode', () => {
    const tree = new RedBlackTree<number>([10, 20, 30, 40, 50], { enableOrderStatistic: true });
    expect(tree.getRank(30, 'RECURSIVE')).toBe(2);
    expect(tree.getRank(5, 'RECURSIVE')).toBe(0);
    expect(tree.getRank(100, 'RECURSIVE')).toBe(5);
  });
});
