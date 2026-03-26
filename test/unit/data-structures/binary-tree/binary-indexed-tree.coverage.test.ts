import { BinaryIndexedTree } from '../../../../src';

describe('BinaryIndexedTree remaining branch coverage', () => {
  it('constructor throws for non-integer size', () => {
    expect(() => new BinaryIndexedTree(3.5)).toThrow();
  });

  it('constructor throws for negative size', () => {
    expect(() => new BinaryIndexedTree(-1)).toThrow();
  });

  it('get/set/update throw when index is not an integer', () => {
    const bit = new BinaryIndexedTree(5);
    expect(() => bit.get(1.5 as any)).toThrow('Index must be an integer');
    expect(() => bit.set(1.5 as any, 10)).toThrow('Index must be an integer');
    expect(() => bit.update(1.5 as any, 1)).toThrow('Index must be an integer');
  });

  it('queryRange start > end returns 0', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    expect(bit.queryRange(2, 1)).toBe(0);
  });

  it('lowerBound returns size when sum exceeds total', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    expect(bit.lowerBound(1000)).toBe(3);
  });

  it('upperBound returns size when sum equals or exceeds total', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    expect(bit.upperBound(6)).toBe(3); // total = 6, nothing > 6
    expect(bit.upperBound(1000)).toBe(3);
  });

  it('clear resets all tree values', () => {
    const bit = new BinaryIndexedTree([5, 10, 15]);
    bit.clear();
    expect(bit.toArray()).toEqual([0, 0, 0]);
    expect(bit.query(2)).toBe(0);
  });

  it('size 1 edge case', () => {
    const bit = new BinaryIndexedTree(1);
    bit.update(0, 42);
    expect(bit.get(0)).toBe(42);
    expect(bit.query(0)).toBe(42);
    expect(bit.lowerBound(42)).toBe(0);
    expect(bit.upperBound(42)).toBe(1);
  });
});
