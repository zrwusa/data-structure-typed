import { BinaryIndexedTree } from '../../../../src';

describe('classic use', () => {
  it('@example [BinaryIndexedTree.query] Prefix sum queries and point updates', () => {
    // 6-element BIT: index 0..5
    const bit = new BinaryIndexedTree(6);

    bit.update(0, 3);
    bit.update(1, 2);
    bit.update(2, 7);
    bit.update(3, 1);
    bit.update(4, 5);
    bit.update(5, 4);

    // Prefix sum [0..2] = 3+2+7 = 12
    expect(bit.query(2)).toBe(12);
    // Range sum [1..3] = 2+7+1 = 10
    expect(bit.queryRange(1, 3)).toBe(10);
    // Point value at index 2
    expect(bit.get(2)).toBe(7);
  });

  it('@example [BinaryIndexedTree.lowerBound] Counting frequency of ratings', () => {
    // Track frequency of scores (0-4 scale, 5 possible values)
    const freq = new BinaryIndexedTree(5);

    // Record ratings: 2,0,3,0,4,1
    for (const rating of [2, 0, 3, 0, 4, 1]) {
      freq.update(rating, 1);
    }

    // How many ratings are ≤ 2? (prefix sum [0..2])
    expect(freq.query(2)).toBe(4); // two 0s, one 1, one 2

    // How many ratings are exactly 0?
    expect(freq.get(0)).toBe(2);

    // Find rating where cumulative count first reaches 3
    // freq=[2,1,1,1,1], prefix=[2,3,...] → prefix[1]=3 >= 3
    expect(freq.lowerBound(3)).toBe(1);
  });

  it('@example [BinaryIndexedTree.set] Building from array', () => {
    const bit = new BinaryIndexedTree([10, 20, 30, 40, 50]);

    expect(bit.get(2)).toBe(30);
    expect(bit.query(2)).toBe(60); // 10+20+30
    expect(bit.query(4)).toBe(150); // total

    // Increment index 1 by 5
    bit.update(1, 5);
    expect(bit.get(1)).toBe(25);
    expect(bit.query(2)).toBe(65);
  });

  it('@example [BinaryIndexedTree.update] Increment a value by delta', () => {
    const bit = new BinaryIndexedTree([0, 0, 0, 0, 0]);
    bit.update(2, 7);
    expect(bit.get(2)).toBe(7);
    bit.update(2, 3);
    expect(bit.get(2)).toBe(10);
  });

  it('@example [BinaryIndexedTree.get] Read point value at index', () => {
    const bit = new BinaryIndexedTree([5, 3, 8, 1]);
    expect(bit.get(0)).toBe(5);
    expect(bit.get(2)).toBe(8);
  });

  it('@example [BinaryIndexedTree.queryRange] Range sum query', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4, 5]);
    expect(bit.queryRange(1, 3)).toBe(9); // 2+3+4
    expect(bit.queryRange(0, 4)).toBe(15); // 1+2+3+4+5
    expect(bit.queryRange(2, 2)).toBe(3); // single element
  });
});

describe('BinaryIndexedTree constructor', () => {
  it('should construct from size', () => {
    const bit = new BinaryIndexedTree(5);
    expect(bit.size).toBe(5);
    expect(bit.isEmpty()).toBe(false);
    for (let i = 0; i < 5; i++) expect(bit.get(i)).toBe(0);
  });

  it('should construct from array', () => {
    const arr = [1, 8, 6, 10, 7];
    const bit = new BinaryIndexedTree(arr);
    expect(bit.size).toBe(5);
    arr.forEach((v, i) => expect(bit.get(i)).toBe(v));
  });

  it('should construct with size 0', () => {
    const bit = new BinaryIndexedTree(0);
    expect(bit.isEmpty()).toBe(true);
    expect(bit.size).toBe(0);
  });

  it('should construct from empty array', () => {
    const bit = new BinaryIndexedTree([]);
    expect(bit.isEmpty()).toBe(true);
  });

  it('should throw for non-integer size', () => {
    expect(() => new BinaryIndexedTree(3.5)).toThrow();
  });

  it('should throw for negative size', () => {
    expect(() => new BinaryIndexedTree(-1)).toThrow();
  });
});

describe('BinaryIndexedTree CRUD', () => {
  let bit: BinaryIndexedTree;
  const arr = [1, 8, 6, 10, 7, 9, 0, 2, 6, 3];

  beforeEach(() => {
    bit = new BinaryIndexedTree(arr);
  });

  it('get should return exact values', () => {
    arr.forEach((v, i) => expect(bit.get(i)).toBe(v));
  });

  it('update should add delta correctly', () => {
    bit.update(0, 5);
    expect(bit.get(0)).toBe(6);
    bit.update(3, -3);
    expect(bit.get(3)).toBe(7);
  });

  it('set should replace value absolutely', () => {
    bit.set(2, 100);
    expect(bit.get(2)).toBe(100);
    bit.set(2, 5);
    expect(bit.get(2)).toBe(5);
  });

  it('update and set should affect prefix sums', () => {
    const origTotal = arr.reduce((a, b) => a + b, 0);
    expect(bit.query(9)).toBe(origTotal);

    bit.update(3, 10);
    expect(bit.query(9)).toBe(origTotal + 10);

    bit.set(0, 100);
    expect(bit.get(0)).toBe(100);
    expect(bit.query(0)).toBe(100);
  });

  it('should throw for out-of-range index', () => {
    expect(() => bit.get(-1)).toThrow('out of range');
    expect(() => bit.get(10)).toThrow('out of range');
    expect(() => bit.update(-1, 1)).toThrow('out of range');
    expect(() => bit.update(10, 1)).toThrow('out of range');
    expect(() => bit.set(-1, 1)).toThrow('out of range');
    expect(() => bit.query(-1)).toThrow('out of range');
  });

  it('should throw for non-integer index', () => {
    expect(() => bit.get(1.5)).toThrow();
  });
});

describe('BinaryIndexedTree query', () => {
  let bit: BinaryIndexedTree;
  const arr = [1, 2, 3, 4, 5];

  beforeEach(() => {
    bit = new BinaryIndexedTree(arr);
  });

  it('query returns prefix sum [0..i]', () => {
    expect(bit.query(0)).toBe(1);
    expect(bit.query(1)).toBe(3);
    expect(bit.query(2)).toBe(6);
    expect(bit.query(3)).toBe(10);
    expect(bit.query(4)).toBe(15);
  });

  it('queryRange returns range sum [start..end]', () => {
    expect(bit.queryRange(0, 4)).toBe(15);
    expect(bit.queryRange(1, 3)).toBe(9);
    expect(bit.queryRange(2, 2)).toBe(3);
    expect(bit.queryRange(0, 0)).toBe(1);
  });

  it('queryRange with start === 0 uses fast path', () => {
    expect(bit.queryRange(0, 2)).toBe(6);
  });

  it('queryRange with start > end returns 0', () => {
    expect(bit.queryRange(3, 1)).toBe(0);
  });
});

describe('BinaryIndexedTree lowerBound and upperBound', () => {
  it('lowerBound finds smallest index where prefixSum >= target', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4, 5]);
    // prefix sums: [1, 3, 6, 10, 15]
    expect(bit.lowerBound(1)).toBe(0); // prefix[0]=1 >= 1
    expect(bit.lowerBound(2)).toBe(1); // prefix[1]=3 >= 2
    expect(bit.lowerBound(3)).toBe(1); // prefix[1]=3 >= 3
    expect(bit.lowerBound(4)).toBe(2); // prefix[2]=6 >= 4
    expect(bit.lowerBound(6)).toBe(2); // prefix[2]=6 >= 6
    expect(bit.lowerBound(7)).toBe(3); // prefix[3]=10 >= 7
    expect(bit.lowerBound(15)).toBe(4); // prefix[4]=15 >= 15
    expect(bit.lowerBound(16)).toBe(5); // beyond total → size
  });

  it('upperBound finds smallest index where prefixSum > target', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4, 5]);
    // prefix sums: [1, 3, 6, 10, 15]
    expect(bit.upperBound(0)).toBe(0); // prefix[0]=1 > 0
    expect(bit.upperBound(1)).toBe(1); // prefix[1]=3 > 1
    expect(bit.upperBound(3)).toBe(2); // prefix[2]=6 > 3
    expect(bit.upperBound(6)).toBe(3); // prefix[3]=10 > 6
    expect(bit.upperBound(10)).toBe(4); // prefix[4]=15 > 10
    expect(bit.upperBound(15)).toBe(5); // beyond total → size
  });

  it('lowerBound with designated values array', () => {
    const arr = [1, 8, 6, 10, 7, 9, 0, 2, 6, 3];
    const bit = new BinaryIndexedTree(arr);
    const targets = [0, 15, 25, 43, 52, 100];

    for (const target of targets) {
      const idx = bit.lowerBound(target);
      if (idx > 0) {
        expect(bit.query(idx - 1)).toBeLessThan(target);
      }
      if (idx < bit.size) {
        expect(bit.query(idx)).toBeGreaterThanOrEqual(target);
      } else {
        expect(idx).toBe(bit.size);
      }
    }
  });

  it('upperBound with designated values array', () => {
    const arr = [1, 8, 6, 10, 7, 9, 0, 2, 6, 3];
    const bit = new BinaryIndexedTree(arr);
    const targets = [0, 15, 25, 43, 52, 100];

    for (const target of targets) {
      const idx = bit.upperBound(target);
      if (idx > 0) {
        expect(bit.query(idx - 1)).toBeLessThanOrEqual(target);
      }
      if (idx < bit.size) {
        expect(bit.query(idx)).toBeGreaterThan(target);
      } else {
        expect(idx).toBe(bit.size);
      }
    }
  });
});

describe('BinaryIndexedTree standard interface', () => {
  it('clear resets all values to 0', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    bit.clear();
    expect(bit.get(0)).toBe(0);
    expect(bit.get(1)).toBe(0);
    expect(bit.query(2)).toBe(0);
  });

  it('clone creates independent copy', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4]);
    const copy = bit.clone();

    copy.update(0, 100);
    expect(copy.get(0)).toBe(101);
    expect(bit.get(0)).toBe(1); // original unchanged
  });

  it('toArray returns point values', () => {
    const arr = [3, 1, 4, 1, 5, 9];
    const bit = new BinaryIndexedTree(arr);
    expect(bit.toArray()).toEqual(arr);
  });

  it('Iterable — for...of and spread', () => {
    const arr = [1, 2, 3, 4, 5];
    const bit = new BinaryIndexedTree(arr);
    expect([...bit]).toEqual(arr);
  });

  it('forEach visits all elements', () => {
    const arr = [10, 20, 30];
    const bit = new BinaryIndexedTree(arr);
    const pairs: [number, number][] = [];
    bit.forEach((v, i) => pairs.push([i, v]));
    expect(pairs).toEqual([
      [0, 10],
      [1, 20],
      [2, 30]
    ]);
  });

  it('isEmpty works', () => {
    expect(new BinaryIndexedTree(0).isEmpty()).toBe(true);
    expect(new BinaryIndexedTree(1).isEmpty()).toBe(false);
  });
});

describe('BinaryIndexedTree LeetCode-style usage', () => {
  it('NumArray range sum query', () => {
    class NumArray {
      private bit: BinaryIndexedTree;
      private nums: number[];

      constructor(nums: number[]) {
        this.nums = [...nums];
        this.bit = new BinaryIndexedTree(nums);
      }

      update(index: number, val: number): void {
        this.bit.update(index, val - this.nums[index]);
        this.nums[index] = val;
      }

      sumRange(left: number, right: number): number {
        return this.bit.queryRange(left, right);
      }
    }

    const na = new NumArray([1, 3, 5, 8, 2, 9, 4, 5, 8, 1, 3, 2]);
    expect(na.sumRange(0, 8)).toBe(45);
    expect(na.sumRange(0, 2)).toBe(9);
    na.update(1, 2);
    expect(na.sumRange(0, 2)).toBe(8);
    expect(na.sumRange(3, 4)).toBe(10);
    na.update(3, 2);
    expect(na.sumRange(3, 4)).toBe(4);
  });
});
