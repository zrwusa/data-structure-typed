import { SegmentTree, SegmentTreeNode } from '../../../../src';

describe('SegmentTreeNode', () => {
  it('should initialize with correct start, end, sum, and optional value', () => {
    const node = new SegmentTreeNode(0, 1, 10, 2);
    expect(node.start).toBe(0);
    expect(node.end).toBe(1);
    expect(node.sum).toBe(10);
    expect(node.value).toBe(2);
  });

  it('should allow setting start, end, sum, value, left, and right', () => {
    const node = new SegmentTreeNode(0, 1, 10);
    node.start = 2;
    node.end = 3;
    node.sum = 15;
    node.value = 2;

    const leftNode = new SegmentTreeNode(0, 1, 5);
    const rightNode = new SegmentTreeNode(2, 3, 10);

    node.left = leftNode;
    node.right = rightNode;

    expect(node.start).toBe(2);
    expect(node.end).toBe(3);
    expect(node.sum).toBe(15);
    expect(node.value).toBe(2);
    expect(node.left).toBe(leftNode);
    expect(node.right).toBe(rightNode);
  });
});

describe('SegmentTree', () => {
  it('should initialize with correct values, start, end, and root', () => {
    const values = [1, 2, 3, 4];
    const tree = new SegmentTree(values);

    expect(tree.values).toEqual(values);
    expect(tree.start).toBe(0);
    expect(tree.end).toBe(3);
    expect(tree.root).toBeDefined();
  });

  it('should correctly build segment tree with sum of values', () => {
    const values = [1, 2, 3, 4];
    const tree = new SegmentTree(values);

    expect(tree.root?.sum).toBe(10); // 1 + 2 + 3 + 4
  });

  it('should handle empty values array gracefully', () => {
    const tree = new SegmentTree([]);
    expect(tree.values).toEqual([]);
    expect(tree.root).toBeUndefined();
  });

  describe('updateNode', () => {
    it('should update node value and sum correctly', () => {
      const values = [1, 2, 3, 4];
      const tree = new SegmentTree(values);
      tree.updateNode(1, 5, 2);

      expect(tree.root?.sum).toBe(13); // 1 + 5 + 3 + 4
      expect(tree.root?.left?.right?.sum).toBe(5);
      expect(tree.root?.left?.right?.value).toBe(2);
    });

    it('should do nothing if root is undefined', () => {
      const tree = new SegmentTree([]);
      tree.updateNode(0, 10);
      expect(tree.root).toBeUndefined();
    });
  });

  describe('querySumByRange', () => {
    it('should return sum for a given range', () => {
      const values = [1, 2, 3, 4, 5];
      const tree = new SegmentTree(values);
      const result = tree.querySumByRange(1, 3); // 2 + 3 + 4 = 9
      expect(result).toBe(9);
    });

    it('should return NaN for an invalid range', () => {
      const values = [1, 2, 3, 4, 5];
      const tree = new SegmentTree(values);
      const result = tree.querySumByRange(3, 1); // Invalid range
      expect(result).toBeNaN();
    });

    it('should return 0 if root is undefined', () => {
      const tree = new SegmentTree([]);
      const result = tree.querySumByRange(0, 1);
      expect(result).toBe(0);
    });

    it('should return NaN if range is out of bounds', () => {
      const values = [1, 2, 3, 4];
      const tree = new SegmentTree(values);
      const result = tree.querySumByRange(-1, 10);
      expect(result).toBeNaN();
    });
  });
});
