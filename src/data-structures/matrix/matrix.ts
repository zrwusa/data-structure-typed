/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { MatrixOptions } from '../../types';

export class Matrix {
  /**
   * The constructor function initializes a matrix object with the provided data and options, or with
   * default values if no options are provided.
   * @param {number[][]} data - A 2D array of numbers representing the data for the matrix.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   */
  constructor(data: number[][], options?: MatrixOptions) {
    if (options) {
      const { rows, cols, addFn, subtractFn, multiplyFn } = options;
      if (typeof rows === 'number' && rows > 0) this._rows = rows;
      else this._rows = data.length;
      if (typeof cols === 'number' && cols > 0) this._cols = cols;
      else this._cols = data[0]?.length || 0;
      if (addFn) this._addFn = addFn;
      if (subtractFn) this._subtractFn = subtractFn;
      if (multiplyFn) this._multiplyFn = multiplyFn;
    } else {
      this._rows = data.length;
      this._cols = data[0]?.length ?? 0;
    }

    if (data.length > 0) {
      this._data = data;
    } else {
      this._data = [];
      for (let i = 0; i < this.rows; i++) {
        this._data[i] = new Array(this.cols).fill(0);
      }
    }
  }

  protected _rows: number = 0;

  /**
   * The function returns the number of rows.
   * @returns The number of rows.
   */
  get rows(): number {
    return this._rows;
  }

  protected _cols: number = 0;

  /**
   * The function returns the value of the protected variable _cols.
   * @returns The number of columns.
   */
  get cols(): number {
    return this._cols;
  }

  protected _data: number[][];

  /**
   * The function returns a two-dimensional array of numbers.
   * @returns The data property, which is a two-dimensional array of numbers.
   */
  get data(): number[][] {
    return this._data;
  }

  /**
   * The above function returns the value of the _addFn property.
   * @returns The value of the property `_addFn` is being returned.
   */
  get addFn() {
    return this._addFn;
  }

  /**
   * The function returns the value of the _subtractFn property.
   * @returns The `_subtractFn` property is being returned.
   */
  get subtractFn() {
    return this._subtractFn;
  }

  /**
   * The function returns the value of the _multiplyFn property.
   * @returns The `_multiplyFn` property is being returned.
   */
  get multiplyFn() {
    return this._multiplyFn;
  }

  /**
   * The `get` function returns the value at the specified row and column index if it is a valid index.
   * @param {number} row - The `row` parameter represents the row index of the element you want to
   * retrieve from the data array.
   * @param {number} col - The parameter "col" represents the column number of the element you want to
   * retrieve from the data array.
   * @returns The `get` function returns a number if the provided row and column indices are valid.
   * Otherwise, it returns `undefined`.
   */
  get(row: number, col: number): number | undefined {
    if (this.isValidIndex(row, col)) {
      return this.data[row][col];
    }
  }

  /**
   * The set function updates the value at a specified row and column in a two-dimensional array.
   * @param {number} row - The "row" parameter represents the row index of the element in a
   * two-dimensional array or matrix. It specifies the row where the value will be set.
   * @param {number} col - The "col" parameter represents the column index of the element in a
   * two-dimensional array.
   * @param {number} value - The value parameter represents the number that you want to set at the
   * specified row and column in the data array.
   * @returns a boolean value. It returns true if the index (row, col) is valid and the value is
   * successfully set in the data array. It returns false if the index is invalid and the value is not
   * set.
   */
  set(row: number, col: number, value: number): boolean {
    if (this.isValidIndex(row, col)) {
      this.data[row][col] = value;
      return true;
    }
    return false;
  }

  /**
   * The function checks if the dimensions of the given matrix match the dimensions of the current
   * matrix.
   * @param {Matrix} matrix - The parameter `matrix` is of type `Matrix`.
   * @returns a boolean value.
   */
  isMatchForCalculate(matrix: Matrix): boolean {
    return this.rows === matrix.rows && this.cols === matrix.cols;
  }

  /**
   * The `add` function adds two matrices together, returning a new matrix with the result.
   * @param {Matrix} matrix - The `matrix` parameter is an instance of the `Matrix` class.
   * @returns The `add` method returns a new `Matrix` object that represents the result of adding the
   * current matrix with the provided `matrix` parameter.
   */
  add(matrix: Matrix): Matrix | undefined {
    if (!this.isMatchForCalculate(matrix)) {
      throw new Error('Matrix dimensions must match for addition.');
    }

    const resultData: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      resultData[i] = [];
      for (let j = 0; j < this.cols; j++) {
        const a = this.get(i, j),
          b = matrix.get(i, j);
        if (a !== undefined && b !== undefined) {
          const added = this._addFn(a, b);
          if (added) {
            resultData[i][j] = added;
          }
        }
      }
    }

    return new Matrix(resultData, {
      rows: this.rows,
      cols: this.cols,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });
  }

  /**
   * The `subtract` function performs element-wise subtraction between two matrices and returns a new
   * matrix with the result.
   * @param {Matrix} matrix - The `matrix` parameter is an instance of the `Matrix` class. It
   * represents the matrix that you want to subtract from the current matrix.
   * @returns a new Matrix object with the result of the subtraction operation.
   */
  subtract(matrix: Matrix): Matrix | undefined {
    if (!this.isMatchForCalculate(matrix)) {
      throw new Error('Matrix dimensions must match for subtraction.');
    }

    const resultData: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      resultData[i] = [];
      for (let j = 0; j < this.cols; j++) {
        const a = this.get(i, j),
          b = matrix.get(i, j);
        if (a !== undefined && b !== undefined) {
          const subtracted = this._subtractFn(a, b);
          if (subtracted) {
            resultData[i][j] = subtracted;
          }
        }
      }
    }

    return new Matrix(resultData, {
      rows: this.rows,
      cols: this.cols,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });
  }

  /**
   * The `multiply` function performs matrix multiplication between two matrices and returns the result
   * as a new matrix.
   * @param {Matrix} matrix - The `matrix` parameter is an instance of the `Matrix` class.
   * @returns a new Matrix object.
   */
  multiply(matrix: Matrix): Matrix | undefined {
    if (this.cols !== matrix.rows) {
      throw new Error('Matrix dimensions must be compatible for multiplication (A.cols = B.rows).');
    }

    const resultData: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      resultData[i] = [];
      for (let j = 0; j < matrix.cols; j++) {
        let sum: number | undefined;
        for (let k = 0; k < this.cols; k++) {
          const a = this.get(i, k),
            b = matrix.get(k, j);
          if (a !== undefined && b !== undefined) {
            const multiplied = this.multiplyFn(a, b);
            if (multiplied !== undefined) {
              sum = this.addFn(sum, multiplied);
            }
          }
        }
        if (sum !== undefined) resultData[i][j] = sum;
      }
    }

    return new Matrix(resultData, {
      rows: this.rows,
      cols: matrix.cols,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });
  }

  /**
   * The transpose function takes a matrix and returns a new matrix that is the transpose of the
   * original matrix.
   * @returns The transpose() function returns a new Matrix object with the transposed data.
   */
  transpose(): Matrix {
    if (this.data.some(row => row.length !== this.rows)) {
      throw new Error('Matrix must be rectangular for transposition.');
    }

    const resultData: number[][] = [];

    for (let j = 0; j < this.cols; j++) {
      resultData[j] = [];
      for (let i = 0; i < this.rows; i++) {
        const trans = this.get(i, j);
        if (trans !== undefined) resultData[j][i] = trans;
      }
    }

    return new Matrix(resultData, {
      rows: this.cols,
      cols: this.rows,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });
  }

  /**
   * The `inverse` function calculates the inverse of a square matrix using Gaussian elimination.
   * @returns a Matrix object, which represents the inverse of the original matrix.
   */
  inverse(): Matrix | undefined {
    // Check if the matrix is square
    if (this.rows !== this.cols) {
      throw new Error('Matrix must be square for inversion.');
    }

    // Create an augmented matrix [this | I]
    const augmentedMatrixData: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      augmentedMatrixData[i] = this.data[i].slice(); // Copy the original matrix
      for (let j = 0; j < this.cols; j++) {
        augmentedMatrixData[i][this.cols + j] = i === j ? 1 : 0; // Append the identity matrix
      }
    }

    const augmentedMatrix = new Matrix(augmentedMatrixData, {
      rows: this.rows,
      cols: this.cols * 2,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });

    // Apply Gaussian elimination to transform the left half into the identity matrix
    for (let i = 0; i < this.rows; i++) {
      // Find pivot
      let pivotRow = i;
      while (pivotRow < this.rows && augmentedMatrix.get(pivotRow, i) === 0) {
        pivotRow++;
      }

      if (pivotRow === this.rows) {
        // Matrix is singular, and its inverse does not exist
        throw new Error('Matrix is singular, and its inverse does not exist.');
      }

      // Swap rows to make the pivot the current row
      augmentedMatrix._swapRows(i, pivotRow);

      // Scale the pivot row to make the pivot element 1
      const pivotElement = augmentedMatrix.get(i, i) ?? 1;

      if (pivotElement === 0) {
        // Handle division by zero
        throw new Error('Matrix is singular, and its inverse does not exist (division by zero).');
      }

      augmentedMatrix._scaleRow(i, 1 / pivotElement);

      // Eliminate other rows to make elements in the current column zero
      for (let j = 0; j < this.rows; j++) {
        if (j !== i) {
          let factor = augmentedMatrix.get(j, i);
          if (factor === undefined) factor = 0;

          augmentedMatrix._addScaledRow(j, i, -factor);
        }
      }
    }

    // Extract the right half of the augmented matrix as the inverse
    const inverseData: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      inverseData[i] = augmentedMatrix.data[i].slice(this.cols);
    }

    return new Matrix(inverseData, {
      rows: this.rows,
      cols: this.cols,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });
  }

  /**
   * The dot function calculates the dot product of two matrices and returns a new matrix.
   * @param {Matrix} matrix - The `matrix` parameter is an instance of the `Matrix` class.
   * @returns a new Matrix object.
   */
  dot(matrix: Matrix): Matrix | undefined {
    if (this.cols !== matrix.rows) {
      throw new Error(
        'Number of columns in the first matrix must be equal to the number of rows in the second matrix for dot product.'
      );
    }

    const resultData: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      resultData[i] = [];
      for (let j = 0; j < matrix.cols; j++) {
        let sum: number | undefined;
        for (let k = 0; k < this.cols; k++) {
          const a = this.get(i, k),
            b = matrix.get(k, j);
          if (a !== undefined && b !== undefined) {
            const multiplied = this.multiplyFn(a, b);
            if (multiplied !== undefined) {
              sum = this.addFn(sum, multiplied);
            }
          }
        }
        if (sum !== undefined) resultData[i][j] = sum;
      }
    }

    return new Matrix(resultData, {
      rows: this.rows,
      cols: matrix.cols,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });
  }

  /**
   * The function checks if a given row and column index is valid within a specified range.
   * @param {number} row - The `row` parameter represents the row index of a two-dimensional array or
   * matrix. It is a number that indicates the specific row in the matrix.
   * @param {number} col - The "col" parameter represents the column index in a two-dimensional array
   * or grid. It is used to check if the given column index is valid within the bounds of the grid.
   * @returns A boolean value is being returned.
   */
  isValidIndex(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  /**
   * The `clone` function returns a new instance of the Matrix class with the same data and properties
   * as the original instance.
   * @returns The `clone()` method is returning a new instance of the `Matrix` class with the same data
   * and properties as the current instance.
   */
  clone(): Matrix {
    return new Matrix(this.data, {
      rows: this.rows,
      cols: this.cols,
      addFn: this.addFn,
      subtractFn: this.subtractFn,
      multiplyFn: this.multiplyFn
    });
  }

  protected _addFn(a: number | undefined, b: number): number | undefined {
    if (a === undefined) return b;
    return a + b;
  }

  protected _subtractFn(a: number, b: number) {
    return a - b;
  }

  protected _multiplyFn(a: number, b: number) {
    return a * b;
  }

  /**
   * The function `_swapRows` swaps the positions of two rows in an array.
   * @param {number} row1 - The `row1` parameter is the index of the first row that you want to swap.
   * @param {number} row2 - The `row2` parameter is the index of the second row that you want to swap
   * with the first row.
   */
  protected _swapRows(row1: number, row2: number): void {
    const temp = this.data[row1];
    this.data[row1] = this.data[row2];
    this.data[row2] = temp;
  }

  /**
   * The function scales a specific row in a matrix by a given scalar value.
   * @param {number} row - The `row` parameter represents the index of the row in the matrix that you
   * want to scale. It is a number that indicates the position of the row within the matrix.
   * @param {number} scalar - The scalar parameter is a number that is used to multiply each element in
   * a specific row of a matrix.
   */
  protected _scaleRow(row: number, scalar: number): void {
    for (let j = 0; j < this.cols; j++) {
      let multiplied = this.multiplyFn(this.data[row][j], scalar);
      if (multiplied === undefined) multiplied = 0;
      this.data[row][j] = multiplied;
    }
  }

  /**
   * The function `_addScaledRow` multiplies a row in a matrix by a scalar value and adds it to another
   * row.
   * @param {number} targetRow - The targetRow parameter represents the index of the row in which the
   * scaled values will be added.
   * @param {number} sourceRow - The sourceRow parameter represents the index of the row from which the
   * values will be scaled and added to the targetRow.
   * @param {number} scalar - The scalar parameter is a number that is used to scale the values in the
   * source row before adding them to the target row.
   */
  protected _addScaledRow(targetRow: number, sourceRow: number, scalar: number): void {
    for (let j = 0; j < this.cols; j++) {
      let multiplied = this.multiplyFn(this.data[sourceRow][j], scalar);
      if (multiplied === undefined) multiplied = 0;
      const scaledValue = multiplied;
      let added = this.addFn(this.data[targetRow][j], scaledValue);
      if (added === undefined) added = 0;
      this.data[targetRow][j] = added;
    }
  }
}
