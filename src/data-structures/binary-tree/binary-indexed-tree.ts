/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import { getMSB } from '../../utils';

export class BinaryIndexedTree {
  protected readonly _freq: number;
  protected readonly _max: number;

  /**
   * The constructor initializes the properties of an object, including default frequency, maximum
   * value, a freqMap data structure, the most significant bit, and the count of negative frequencies.
   * @param  - - `frequency`: The default frequency value. It is optional and has a default
   * value of 0.
   */
  constructor({ frequency = 0, max }: { frequency?: number; max: number }) {
    this._freq = frequency;
    this._max = max;
    this._freqMap = { 0: 0 };
    this._msb = getMSB(max);
    this._negativeCount = frequency < 0 ? max : 0;
  }

  protected _freqMap: Record<number, number>;

  /**
   * The function returns the frequency map of numbers.
   * @returns The `_freqMap` property, which is a record with number keys and number values, is being
   * returned.
   */
  get freqMap(): Record<number, number> {
    return this._freqMap;
  }

  protected _msb: number;

  /**
   * The function returns the value of the _msb property.
   * @returns The `_msb` property of the object.
   */
  get msb(): number {
    return this._msb;
  }

  protected _negativeCount: number;

  /**
   * The function returns the value of the _negativeCount property.
   * @returns The method is returning the value of the variable `_negativeCount`, which is of type
   * `number`.
   */
  get negativeCount(): number {
    return this._negativeCount;
  }

  /**
   * The above function returns the value of the protected variable `_freq`.
   * @returns The frequency value stored in the protected variable `_freq`.
   */
  get freq(): number {
    return this._freq;
  }

  /**
   * The above function returns the maximum value.
   * @returns The maximum value stored in the variable `_max`.
   */
  get max(): number {
    return this._max;
  }

  /**
   * The function "readSingle" reads a single number from a specified index.
   * @param {number} index - The `index` parameter is a number that represents the index of an element in a
   * collection or array.
   * @returns a number.
   */
  readSingle(index: number): number {
    this._checkIndex(index);
    return this._readSingle(index);
  }

  /**
   * The "update" function updates the value at a given index by adding a delta and triggers a callback
   * to notify of the change.
   * @param {number} position - The `index` parameter represents the index of the element that needs to be
   * updated in the data structure.
   * @param {number} change - The "delta" parameter represents the change in value that needs to be
   * applied to the frequency at the specified index.
   */
  update(position: number, change: number): void {
    this._checkIndex(position);
    const freqCur = this._readSingle(position);

    this._update(position, change);
    this._updateNegativeCount(freqCur, freqCur + change);
  }

  /**
   * The function "writeSingle" checks the index and writes a single value with a given frequency.
   * @param {number} index - The `index` parameter is a number that represents the index of an element. It
   * is used to identify the specific element that needs to be written.
   * @param {number} freq - The `freq` parameter represents the frequency value that needs to be
   * written.
   */
  writeSingle(index: number, freq: number): void {
    this._checkIndex(index);
    this._writeSingle(index, freq);
  }

  /**
   * The read function takes a count parameter, checks if it is an integer, and returns the result of
   * calling the _read function with the count parameter clamped between 0 and the maximum value.
   * @param {number} count - The `count` parameter is a number that represents the number of items to
   * read.
   * @returns a number.
   */
  read(count: number): number {
    if (!Number.isInteger(count)) {
      throw new Error('Invalid count');
    }
    return this._read(Math.max(Math.min(count, this.max), 0));
  }

  /**
   * The function returns the lower bound of a non-descending sequence that sums up to a given number.
   * @param {number} sum - The `sum` parameter is a number that represents the target sum that we want
   * to find in the sequence.
   * @returns The lowerBound function is returning a number.
   */
  lowerBound(sum: number): number {
    if (this.negativeCount > 0) {
      throw new Error('Sequence is not non-descending');
    }
    return this._binarySearch(sum, (x, y) => x < y);
  }

  /**
   * The upperBound function returns the index of the first element in a sequence that is greater than
   * or equal to a given sum.
   * @param {number} sum - The "sum" parameter is a number that represents the target sum that we want
   * to find in the sequence.
   * @returns The upperBound function is returning a number.
   */
  upperBound(sum: number): number {
    if (this.negativeCount > 0) {
      throw new Error('Must not be descending');
    }
    return this._binarySearch(sum, (x, y) => x <= y);
  }

  /**
   * The function calculates the prefix sum of an array using a binary indexed tree.
   * @param {number} i - The parameter "i" in the function "getPrefixSum" represents the index of the element in the
   * array for which we want to calculate the prefix sum.
   * @returns The function `getPrefixSum` returns the prefix sum of the elements in the binary indexed tree up to index
   * `i`.
   */
  getPrefixSum(i: number): number {
    this._checkIndex(i);
    i++; // Convert to 1-based index

    let sum = 0;
    while (i > 0) {
      sum += this._getFrequency(i);
      i -= i & -i;
    }

    return sum;
  }

  /**
   * The function returns the value of a specific index in a freqMap data structure, or a default value if
   * the index is not found.
   * @param {number} index - The `index` parameter is a number that represents the index of a node in a
   * freqMap data structure.
   * @returns a number.
   */
  protected _getFrequency(index: number): number {
    if (index in this.freqMap) {
      return this.freqMap[index];
    }

    return this.freq * (index & -index);
  }

  /**
   * The function _updateFrequency adds a delta value to the element at the specified index in the freqMap array.
   * @param {number} index - The index parameter is a number that represents the index of the freqMap
   * element that needs to be updated.
   * @param {number} delta - The `delta` parameter represents the change in value that needs to be
   * added to the freqMap at the specified `index`.
   */
  protected _updateFrequency(index: number, delta: number): void {
    this.freqMap[index] = this._getFrequency(index) + delta;
  }

  /**
   * The function checks if the given index is valid and within the range.
   * @param {number} index - The parameter "index" is of type number and represents the index value
   * that needs to be checked.
   */
  protected _checkIndex(index: number): void {
    if (!Number.isInteger(index)) {
      throw new Error('Invalid index: Index must be an integer.');
    }
    if (index < 0 || index >= this.max) {
      throw new Error('Index out of range: Index must be within the range [0, this.max).');
    }
  }

  /**
   * The function calculates the sum of elements in an array up to a given index using a binary indexed
   * freqMap.
   * @param {number} index - The `index` parameter is a number that represents the index of an element in a
   * data structure.
   * @returns a number.
   */
  protected _readSingle(index: number): number {
    index = index + 1;
    let sum = this._getFrequency(index);
    const z = index - (index & -index);

    index--;

    while (index !== z) {
      sum -= this._getFrequency(index);
      index -= index & -index;
    }

    return sum;
  }

  /**
   * The function `_updateNegativeCount` updates a counter based on changes in frequency values.
   * @param {number} freqCur - The current frequency value.
   * @param {number} freqNew - The freqNew parameter represents the new frequency value.
   */
  protected _updateNegativeCount(freqCur: number, freqNew: number): void {
    if (freqCur < 0 && freqNew >= 0) {
      this._negativeCount--;
    } else if (freqCur >= 0 && freqNew < 0) {
      this._negativeCount++;
    }
  }

  /**
   * The `_update` function updates the values in a binary indexed freqMap starting from a given index and
   * propagating the changes to its parent nodes.
   * @param {number} index - The `index` parameter is a number that represents the index of the element in
   * the data structure that needs to be updated.
   * @param {number} delta - The `delta` parameter represents the change in value that needs to be
   * applied to the elements in the data structure.
   */
  protected _update(index: number, delta: number): void {
    index = index + 1;

    while (index <= this.max) {
      this._updateFrequency(index, delta);
      index += index & -index;
    }
  }

  /**
   * The `_writeSingle` function updates the frequency at a specific index and triggers a callback if
   * the frequency has changed.
   * @param {number} index - The `index` parameter is a number that represents the index of the element
   * being modified or accessed.
   * @param {number} freq - The `freq` parameter represents the new frequency value that needs to be
   * written to the specified index `index`.
   */
  protected _writeSingle(index: number, freq: number): void {
    const freqCur = this._readSingle(index);

    this._update(index, freq - freqCur);
    this._updateNegativeCount(freqCur, freq);
  }

  /**
   * The `_read` function calculates the sum of values in a binary freqMap up to a given count.
   * @param {number} count - The `count` parameter is a number that represents the number of elements
   * to read from the freqMap.
   * @returns the sum of the values obtained from calling the `_getFrequency` method for each index in the
   * range from `count` to 1.
   */
  protected _read(count: number): number {
    let index = count;
    let sum = 0;
    while (index) {
      sum += this._getFrequency(index);
      index -= index & -index;
    }

    return sum;
  }

  /**
   * The function `_binarySearch` performs a binary search to find the largest number that satisfies a given
   * condition.
   * @param {number} sum - The sum parameter is a number that represents the target sum value.
   * @param before - The `before` parameter is a function that takes two numbers `x` and `y` as
   * arguments and returns a boolean value. It is used to determine if `x` is less than or equal to
   * `y`. The purpose of this function is to compare two numbers and determine their order.
   * @returns the value of the variable "left".
   */
  protected _binarySearch(sum: number, before: (x: number, y: number) => boolean): number {
    let left = 0;
    let right = this.msb << 1;
    let sumT = sum;

    while (right > left + 1) {
      const middle = (left + right) >> 1;
      const sumM = this._getFrequency(middle);

      if (middle <= this.max && before(sumM, sumT)) {
        sumT -= sumM;
        left = middle;
      } else {
        right = middle;
      }
    }
    return left;
  }
}
