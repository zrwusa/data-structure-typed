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

  it('print does not throw', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    const spy = jest.spyOn(console, 'log').mockImplementation();
    bit.print();
    expect(spy).toHaveBeenCalledWith([1, 2, 3]);
    spy.mockRestore();
  });

  it('iterator [Symbol.iterator] returns itself', () => {
    const bit = new BinaryIndexedTree([1, 2]);
    const iter = bit[Symbol.iterator]();
    expect(iter[Symbol.iterator]()).toBe(iter);
  });

  it('@example [BinaryIndexedTree.update] Add delta at index', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4, 5]);
    bit.update(2, 7);
    expect(bit.get(2)).toBe(10);
  });

  it('@example [BinaryIndexedTree.get] Get value at index', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    expect(bit.get(0)).toBe(1);
    expect(bit.get(2)).toBe(3);
  });

  it('@example [BinaryIndexedTree.query] Prefix sum', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4]);
    expect(bit.query(2)).toBe(6);
  });

  it('@example [BinaryIndexedTree.queryRange] Range sum', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4]);
    expect(bit.queryRange(1, 2)).toBe(5);
  });

  it('@example [BinaryIndexedTree.set] Set value at index', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    bit.set(1, 10);
    expect(bit.get(1)).toBe(10);
  });

  it('@example [BinaryIndexedTree.toArray] Convert to array', () => {
    const bit = new BinaryIndexedTree([1, 2, 3]);
    expect(bit.toArray()).toEqual([1, 2, 3]);
  });

  it('@example [BinaryIndexedTree.lowerBound] Find index with prefix sum ≥ target', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4]);
    const idx = bit.lowerBound(4);
    expect(idx).toBeGreaterThanOrEqual(0);
  });

  it('@example [BinaryIndexedTree.upperBound] Find index with prefix sum > target', () => {
    const bit = new BinaryIndexedTree([1, 2, 3, 4]);
    const idx = bit.upperBound(4);
    expect(idx).toBeGreaterThanOrEqual(0);
  });
});
