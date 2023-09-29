import {SegmentTree} from '../../../../src';

describe('SegmentTree', () => {
  let segmentTree: SegmentTree;

  beforeEach(() => {
    // Create an example SegmentTree for testing
    const values = [1, 2, 3, 4, 5];
    segmentTree = new SegmentTree(values);
  });

  it('should build a valid segment tree', () => {
    // Check if the root node's sum is correct
    expect(segmentTree.root?.sum).toBe(15);
  });

  it('should update a node in the segment tree', () => {
    // Update a node value
    segmentTree.updateNode(2, 10);

    // Check if the sum of the root node is correct after the update
    expect(segmentTree.root?.sum).toBe(22);
  });

  it('should query sum by range correctly', () => {
    // Check if the sum within a specific range is correct
    expect(segmentTree.querySumByRange(1, 3)).toBe(9); // 2 + 3 + 4 = 9
  });

  it('should handle edge cases for querySumByRange', () => {
    // Check behavior when the range goes beyond boundaries
    expect(segmentTree.querySumByRange(0, 4)).toBe(15); // Valid range, should return sum of the specified range
    expect(segmentTree.querySumByRange(3, 2)).toBe(NaN); // End index is less than start index, should return NaN
    expect(segmentTree.querySumByRange(0, 10)).toBe(NaN); // Beyond upper bound, should return NaN
  });

  it('should handle an empty input array', () => {
    // Check behavior when dealing with an empty input array
    const emptySegmentTree = new SegmentTree([]);
    expect(emptySegmentTree.root).toBe(null);
    expect(emptySegmentTree.querySumByRange(0, 2)).toBe(0); // Sum of an empty array should be 0
  });

  it('should handle a single-element input array', () => {
    // Check behavior when the input array contains a single element
    const singleElementSegmentTree = new SegmentTree([42]);
    expect(singleElementSegmentTree.root?.sum).toBe(42);
    expect(singleElementSegmentTree.querySumByRange(0, 0)).toBe(42); // Range covering the only element should return that element's value
  });
});
