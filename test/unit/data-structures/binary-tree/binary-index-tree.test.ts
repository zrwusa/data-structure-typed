import { BinaryIndexedTree } from '../../../../src';
// import {isDebugTest} from '../../../config';

// const isDebug = isDebugTest;

describe('BinaryIndexedTree simple', () => {
  let bit: BinaryIndexedTree;

  beforeEach(() => {
    //Create a new BinaryIndexedTree instance before each test case
    bit = new BinaryIndexedTree({ frequency: 0, max: 10 }); // Modify the value of max as needed
  });

  it('should initialize correctly', () => {
    expect(bit.freq).toBe(0);
    expect(bit.max).toBe(10);
    expect(bit.freqMap).toEqual({ 0: 0 }); // Modify the initialized record value according to the actual situation
    // More initialization checks can be added
  });

  it('should read a single value correctly', () => {
    // Test the function of reading a single value
    bit.writeSingle(5, 5); //Write test data
    expect(bit.readSingle(5)).toBe(5); // Read and verify
  });

  it('should update a value correctly', () => {
    // Test the ability to update a single value
    bit.writeSingle(5, 5); //Write test data
    bit.update(5, 2); // update value
    expect(bit.readSingle(5)).toBe(7); // Verify the updated value
  });

  it('should find lower bound correctly', () => {
    //Test the function of finding the lower bound
    bit.writeSingle(2, 10);
    bit.writeSingle(5, 20);
    bit.writeSingle(8, 30);
    expect(bit.lowerBound(15)).toBe(5); // Find and verify the lower bound
  });

  it('should find upper bound correctly', () => {
    //Test the function of finding the upper bound
    bit.writeSingle(2, 10);
    bit.writeSingle(5, 20);
    bit.writeSingle(8, 30);
    expect(bit.upperBound(25)).toBe(5); // Find and verify the upper bound
  });
});

describe('BinaryIndexedTree', () => {
  const frequency = 999;
  const max = 10;
  let bit: BinaryIndexedTree;

  beforeEach(function () {
    bit = new BinaryIndexedTree({ frequency, max });
  });
  it('should validate the index', function () {
    expect(() => bit.readSingle(-1)).toThrow('Index out of range');
    expect(() => bit.readSingle(10)).toThrow('Index out of range');
  });

  it('should read a single frequency correctly', function () {
    for (let i = 0; i < max; i++) {
      expect(bit.readSingle(i)).toBe(frequency);
    }
  });
  it('should validate the index', function () {
    expect(() => bit.update(-1, 100)).toThrow('Index out of range');
    expect(() => bit.update(10, 100)).toThrow('Index out of range');
  });
  it('should frequency and max', function () {
    const frequency = 200;
    const max = 1000;
    const bit = new BinaryIndexedTree({ frequency, max });

    expect(bit.freq).toBe(frequency);
    expect(bit.max).toBe(max);
  });

  it('should update the frequency with the given delta', function () {
    for (let i = 0; i < max; i++) {
      bit.update(i, i * 2);
    }
    for (let i = 0; i < max; i++) {
      expect(bit.readSingle(i)).toBe(i * 2 + frequency);
    }
  });
  it('should validate the index', function () {
    expect(() => bit.writeSingle(-1, 100)).toThrow('Index out of range');
    expect(() => bit.writeSingle(10, 100)).toThrow('Index out of range');
  });

  it('should writeSingle to be correctly invoked', function () {
    for (let i = 0; i < max; i++) {
      bit.writeSingle(i, i * 2);
    }
    for (let i = 0; i < max; i++) {
      expect(bit.readSingle(i)).toBe(i * 2);
    }
  });

  it('should read the frequency', function () {
    for (let c = 0; c <= max; c++) {
      expect(bit.read(c)).toBe(c * frequency);
    }
  });

  const values = [-5, 0, 5, 10, 95, 100, 1000];
  it('should find the upper-bound index', function () {
    loopUpperBoundTests(bit, values);
  });

  it('should find the lower-bound index', function () {
    loopLowerBoundTests(bit, values);
  });
});

describe('designated values', function () {
  const array = [1, 8, 6, 10, 7, 9, 0, 2, 6, 3];
  const sumArray = (sum => array.map(value => (sum += value)))(0);
  let bit: BinaryIndexedTree;

  beforeEach(function () {
    bit = new BinaryIndexedTree({ max: array.length });
    array.forEach((value, i) => bit.writeSingle(i, value));
  });

  describe('readSingle', function () {
    it('should read a single frequency correctly', function () {
      array.forEach((value, i) => {
        expect(bit.readSingle(i)).toBe(array[i]);
      });
    });
  });

  describe('update', function () {
    it('should update the frequency with the given delta', function () {
      array.forEach((value, i) => bit.update(i, value + i));
      array.forEach((value, i) => {
        expect(bit.readSingle(i)).toBe(array[i] * 2 + i);
      });
    });
  });

  describe('writeSingle', function () {
    it('should write a single frequency correctly', function () {
      array.forEach((value, i) => bit.writeSingle(i, value + i));
      array.forEach((value, i) => {
        expect(bit.readSingle(i)).toBe(array[i] + i);
      });
    });
  });

  describe('read', function () {
    it('should read the cumulative frequency correctly', function () {
      expect(bit.read(0)).toBe(0);
      sumArray.forEach((sum, i) => {
        expect(bit.read(i + 1)).toBe(sum);
      });
    });
  });

  const values = [-5, 0, 15, 25, 43, 53, 100];

  describe('upperBound', function () {
    it('should find the upper-bound index', function () {
      loopUpperBoundTests(bit, values);
    });
  });

  describe('lowerBound', function () {
    it('should find the lower-bound index', function () {
      loopLowerBoundTests(bit, values);
    });
  });
});

describe('descending sequence', function () {
  const array = [1, 8, -6, 10, 7, 9, 0, -2, 6, 3];
  let bit: BinaryIndexedTree;

  beforeEach(function () {
    bit = new BinaryIndexedTree({ max: array.length });
    array.forEach((value, i) => bit.writeSingle(i, value));
  });

  it('should have a correct negativeCount property', function () {
    expect(bit.negativeCount).toBe(2);
    bit.update(2, 6);
    expect(bit.negativeCount).toBe(1);
    bit.update(7, 3);
    expect(bit.negativeCount).toBe(0);
    bit.update(8, -7);
    expect(bit.negativeCount).toBe(1);
  });

  const values = [-5, 0, 15, 25, 43, 53, 100];

  describe('upperBound', function () {
    it('should validate the non-descending', function () {
      expect(() => bit.upperBound(20)).toThrow('Must not be descending');
      bit.update(2, 12);
      bit.update(7, 4);
      loopUpperBoundTests(bit, values);
    });
  });

  describe('BinaryIndexedTree lowerBound', function () {
    it('should validate the non-descending', function () {
      expect(() => bit.lowerBound(20)).toThrow('Sequence is not non-descending');
      bit.update(2, 12);
      bit.update(7, 4);
      loopLowerBoundTests(bit, values);
    });
  });
});

describe('BinaryIndexedTree additional tests', () => {
  it('should handle read method correctly', () => {
    const bit = new BinaryIndexedTree({ max: 10 });
    bit.writeSingle(2, 10);
    bit.writeSingle(5, 20);
    bit.writeSingle(8, 30);
    expect(bit.read(5)).toBe(10); // Ensure read method accumulates correctly
  });

  it('should handle consecutive operations', () => {
    const bit = new BinaryIndexedTree({ max: 10 });
    bit.writeSingle(2, 10);
    bit.update(2, 5);
    expect(bit.readSingle(2)).toBe(15);
    bit.writeSingle(5, 20);
    expect(bit.readSingle(5)).toBe(20);
    expect(bit.lowerBound(15)).toBe(2);
  });

  it('should handle frequent increment updates', () => {
    const bit = new BinaryIndexedTree({ max: 10 });
    for (let i = 0; i < 10; i++) {
      bit.update(2, 5);
    }
    expect(bit.readSingle(2)).toBe(50);
  });

  it('should handle edge cases', () => {
    const bit = new BinaryIndexedTree({ max: 10 });
    bit.writeSingle(9, 100);
    expect(bit.readSingle(9)).toBe(100);
    expect(bit.lowerBound(200)).toBe(10);
  });
});

function loopUpperBoundTests(bit: BinaryIndexedTree, values: number[]) {
  for (const value of values) {
    const index = bit.upperBound(value);
    if (index > 0) {
      expect(bit.read(index)).toBeLessThanOrEqual(value);
    } else {
      expect(index).toBe(0);
    }
    if (index < bit.max) {
      expect(bit.read(index + 1)).toBeGreaterThan(value);
    } else {
      expect(index).toBe(bit.max);
    }
  }
}

function loopLowerBoundTests(bit: BinaryIndexedTree, values: number[]) {
  for (const value of values) {
    const index = bit.lowerBound(value);
    if (index > 0) {
      expect(bit.read(index)).toBeLessThan(value);
    } else {
      expect(index).toBe(0);
    }
    if (index < bit.max) {
      expect(bit.read(index + 1)).toBeGreaterThanOrEqual(value);
    } else {
      expect(index).toBe(bit.max);
    }
  }
}

describe('', () => {
  class NumArrayDC {
    protected _tree: BinaryIndexedTree;
    protected readonly _nums: number[];

    constructor(nums: number[]) {
      this._nums = nums;
      this._tree = new BinaryIndexedTree({ max: nums.length + 1 });
      for (let i = 0; i < nums.length; i++) {
        this._tree.update(i + 1, nums[i]);
      }
    }

    update(index: number, value: number): void {
      this._tree.update(index + 1, value - this._nums[index]);
      this._nums[index] = value;
    }

    sumRange(left: number, right: number): number {
      return this._tree.getPrefixSum(right + 1) - this._tree.getPrefixSum(left);
    }
  }

  it('', () => {
    const numArray = new NumArrayDC([1, 3, 5, 8, 2, 9, 4, 5, 8, 1, 3, 2]);
    expect(numArray.sumRange(0, 8)).toBe(45);
    expect(numArray.sumRange(0, 2)).toBe(9);
    numArray.update(1, 2);
    expect(numArray.sumRange(0, 2)).toBe(8);
    expect(numArray.sumRange(3, 4)).toBe(10);
    numArray.update(3, 2);
    expect(numArray.sumRange(3, 4)).toBe(4);
  });
});
