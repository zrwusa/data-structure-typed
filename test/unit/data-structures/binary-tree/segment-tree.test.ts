import { SegmentTree, SegmentTreeNode } from '../../../../src';

describe('classic use', () => {
  it('@example Range sum query on an array', () => {
    const tree = SegmentTree.sum([1, 3, 5, 7, 9, 11]);

    // Query sum of range [1, 3] → 3 + 5 + 7 = 15
    expect(tree.query(1, 3)).toBe(15);

    // Query entire range
    expect(tree.query(0, 5)).toBe(36);

    // Query single element
    expect(tree.query(2, 2)).toBe(5);
  });

  it('@example Dynamic range sum with updates', () => {
    // Monthly revenue data (in thousands)
    const revenue = [120, 95, 140, 110, 85, 130, 150, 100, 160, 125, 90, 175];
    const tree = SegmentTree.sum(revenue);

    // Q1 revenue (Jan-Mar)
    expect(tree.query(0, 2)).toBe(355);

    // Update March revenue from 140 to 200
    tree.update(2, 200);

    // Q1 revenue after update
    expect(tree.query(0, 2)).toBe(415);

    // H1 revenue (Jan-Jun)
    expect(tree.query(0, 5)).toBe(740);
  });

  it('@example Temperature monitoring with range queries', () => {
    // Hourly temperatures for a day (24 readings)
    const temps = [18, 17, 16, 15, 16, 18, 21, 24, 27, 29, 31, 32, 33, 32, 31, 29, 27, 25, 23, 21, 20, 19, 18, 17];
    const tree = SegmentTree.sum(temps);

    // Average temperature during work hours (9-17)
    const workSum = tree.query(9, 17);
    expect(workSum / 9).toBeCloseTo(29.89, 1);

    // Sum of morning temps (6-11)
    expect(tree.query(6, 11)).toBe(164);
  });
});

describe('SegmentTreeNode (deprecated, backward compat)', () => {
  it('should initialize with correct start, end, sum, and optional value', () => {
    const node = new SegmentTreeNode(0, 1, 10, 2);
    expect(node.start).toBe(0);
    expect(node.end).toBe(1);
    expect(node.sum).toBe(10);
    expect(node.value).toBe(2);
  });

  it('should allow setting left and right', () => {
    const node = new SegmentTreeNode(0, 3, 15);
    const leftNode = new SegmentTreeNode(0, 1, 5);
    const rightNode = new SegmentTreeNode(2, 3, 10);
    node.left = leftNode;
    node.right = rightNode;
    expect(node.left).toBe(leftNode);
    expect(node.right).toBe(rightNode);
  });
});

describe('SegmentTree sum', () => {
  it('should build from array and query correctly', () => {
    const tree = SegmentTree.sum([1, 2, 3, 4]);
    expect(tree.query(0, 3)).toBe(10);
    expect(tree.query(0, 0)).toBe(1);
    expect(tree.query(3, 3)).toBe(4);
    expect(tree.query(1, 2)).toBe(5);
  });

  it('should update and reflect in queries', () => {
    const tree = SegmentTree.sum([1, 2, 3, 4]);
    tree.update(1, 10);
    expect(tree.query(0, 3)).toBe(18); // 1 + 10 + 3 + 4
    expect(tree.query(1, 1)).toBe(10);
    expect(tree.get(1)).toBe(10);
  });

  it('should handle single element', () => {
    const tree = SegmentTree.sum([42]);
    expect(tree.query(0, 0)).toBe(42);
    expect(tree.size).toBe(1);
    tree.update(0, 100);
    expect(tree.query(0, 0)).toBe(100);
  });

  it('should handle empty array', () => {
    const tree = SegmentTree.sum([]);
    expect(tree.size).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.query(0, 0)).toBe(0); // identity
  });

  it('should clamp out-of-range queries', () => {
    const tree = SegmentTree.sum([1, 2, 3]);
    expect(tree.query(-5, 10)).toBe(6); // clamped to [0, 2]
    expect(tree.query(5, 10)).toBe(0);  // start > end after clamp → identity
  });

  it('should ignore out-of-range updates', () => {
    const tree = SegmentTree.sum([1, 2, 3]);
    tree.update(-1, 100);
    tree.update(5, 100);
    expect(tree.query(0, 2)).toBe(6); // unchanged
  });
});

describe('SegmentTree min', () => {
  it('should find minimum in range', () => {
    const tree = SegmentTree.min([5, 2, 8, 1, 9, 3]);
    expect(tree.query(0, 5)).toBe(1);
    expect(tree.query(0, 2)).toBe(2);
    expect(tree.query(3, 5)).toBe(1);
    expect(tree.query(4, 5)).toBe(3);
  });

  it('should update and recompute min', () => {
    const tree = SegmentTree.min([5, 2, 8, 1, 9]);
    tree.update(3, 10); // replace 1 with 10
    expect(tree.query(0, 4)).toBe(2);
    expect(tree.query(3, 4)).toBe(9);
  });
});

describe('SegmentTree max', () => {
  it('should find maximum in range', () => {
    const tree = SegmentTree.max([5, 2, 8, 1, 9, 3]);
    expect(tree.query(0, 5)).toBe(9);
    expect(tree.query(0, 2)).toBe(8);
    expect(tree.query(3, 5)).toBe(9);
  });
});

describe('SegmentTree custom merger', () => {
  it('should support GCD', () => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const tree = new SegmentTree([12, 8, 6, 18], {
      merger: gcd,
      identity: 0
    });
    expect(tree.query(0, 3)).toBe(2); // gcd(12,8,6,18) = 2
    expect(tree.query(0, 1)).toBe(4); // gcd(12,8) = 4
    expect(tree.query(2, 3)).toBe(6); // gcd(6,18) = 6
  });

  it('should support product', () => {
    const tree = new SegmentTree([2, 3, 4, 5], {
      merger: (a, b) => a * b,
      identity: 1
    });
    expect(tree.query(0, 3)).toBe(120); // 2*3*4*5
    expect(tree.query(1, 2)).toBe(12);  // 3*4
  });
});

describe('SegmentTree standard interface', () => {
  it('size and isEmpty', () => {
    const tree = SegmentTree.sum([1, 2, 3]);
    expect(tree.size).toBe(3);
    expect(tree.isEmpty()).toBe(false);

    const empty = SegmentTree.sum([]);
    expect(empty.size).toBe(0);
    expect(empty.isEmpty()).toBe(true);
  });

  it('get returns element at index', () => {
    const tree = SegmentTree.sum([10, 20, 30, 40]);
    expect(tree.get(0)).toBe(10);
    expect(tree.get(3)).toBe(40);
    expect(tree.get(-1)).toBe(0); // identity for out-of-range
    expect(tree.get(10)).toBe(0);
  });

  it('toArray returns leaf values', () => {
    const tree = SegmentTree.sum([1, 2, 3, 4]);
    expect(tree.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('clone creates independent copy', () => {
    const tree = SegmentTree.sum([1, 2, 3]);
    const copy = tree.clone();
    copy.update(0, 100);
    expect(copy.query(0, 2)).toBe(105);
    expect(tree.query(0, 2)).toBe(6); // original unchanged
  });

  it('Iterable — for...of and spread', () => {
    const tree = SegmentTree.sum([10, 20, 30]);
    expect([...tree]).toEqual([10, 20, 30]);

    const values: number[] = [];
    for (const v of tree) values.push(v);
    expect(values).toEqual([10, 20, 30]);
  });

  it('forEach iterates leaf values', () => {
    const tree = SegmentTree.sum([1, 2, 3]);
    const pairs: [number, number][] = [];
    tree.forEach((v, i) => pairs.push([i, v]));
    expect(pairs).toEqual([[0, 1], [1, 2], [2, 3]]);
  });
});

describe('SegmentTree maxRight', () => {
  it('should find rightmost index where prefix sum <= threshold', () => {
    const tree = SegmentTree.sum([1, 2, 3, 4, 5]);
    // Find max r where sum(0..r) <= 6 → sum(0..2) = 6, sum(0..3) = 10 → r = 2
    const r = tree.maxRight(0, s => s <= 6);
    expect(r).toBe(2);
  });

  it('should return n-1 when predicate always holds', () => {
    const tree = SegmentTree.sum([1, 1, 1]);
    const r = tree.maxRight(0, s => s <= 100);
    expect(r).toBe(2);
  });

  it('should return left-1 when predicate fails on identity', () => {
    const tree = SegmentTree.sum([1, 2, 3]);
    const r = tree.maxRight(0, () => false);
    expect(r).toBe(-1);
  });
});

describe('SegmentTree minLeft', () => {
  it('should find leftmost index where suffix sum <= threshold', () => {
    const tree = SegmentTree.sum([1, 2, 3, 4, 5]);
    // Find min l where sum(l..4) <= 9 → sum(3..4) = 9, sum(2..4) = 12 → l = 3
    const l = tree.minLeft(4, s => s <= 9);
    expect(l).toBe(3);
  });

  it('should return 0 when predicate always holds', () => {
    const tree = SegmentTree.sum([1, 1, 1]);
    const l = tree.minLeft(2, s => s <= 100);
    expect(l).toBe(0);
  });

  it('should return right+1 when predicate fails on identity', () => {
    const tree = SegmentTree.sum([1, 2, 3]);
    const l = tree.minLeft(2, () => false);
    expect(l).toBe(3);
  });
});

describe('SegmentTree power-of-2 edge cases', () => {
  it('should work with non-power-of-2 sizes', () => {
    const tree = SegmentTree.sum([1, 2, 3, 4, 5]); // 5 elements, padded to 8
    expect(tree.query(0, 4)).toBe(15);
    expect(tree.size).toBe(5);
  });

  it('should work with exact power-of-2 sizes', () => {
    const tree = SegmentTree.sum([1, 2, 3, 4]); // 4 elements, no padding
    expect(tree.query(0, 3)).toBe(10);
  });

  it('should work with size 2', () => {
    const tree = SegmentTree.sum([3, 7]);
    expect(tree.query(0, 1)).toBe(10);
    expect(tree.query(0, 0)).toBe(3);
    expect(tree.query(1, 1)).toBe(7);
  });
});
