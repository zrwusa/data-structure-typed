import { Matrix } from '../../../../src';

describe('Matrix', () => {
  let matrix: Matrix;

  beforeEach(() => {
    // Initialize a 3x3 matrix with zeros
    matrix = new Matrix([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]);
  });

  it('should create a matrix with the correct dimensions and initial values', () => {
    expect(matrix.rows).toBe(3);
    expect(matrix.cols).toBe(3);
    expect(matrix.data).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]);
  });

  it('should get a value at a specific position', () => {
    expect(matrix.get(1, 1)).toBe(0);
    expect(matrix.get(2, 2)).toBe(0);
  });

  it('should set a value at a specific position', () => {
    matrix.set(1, 1, 42);
    expect(matrix.get(1, 1)).toBe(42);
  });

  it('should not allow getting or setting values at invalid positions', () => {
    expect(matrix.get(-1, 0)).toBeUndefined();
    expect(matrix.get(0, 10)).toBeUndefined();

    const originalValue = matrix.get(1, 1);
    matrix.set(-1, 1, 42);
    matrix.set(1, 10, 42);
    expect(matrix.get(1, 1)).toBe(originalValue);
  });

  describe('add', () => {
    it('should add two matrices correctly', () => {
      const matrixA = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrixB = new Matrix([
        [5, 6],
        [7, 8]
      ]);
      const expectedResult = new Matrix([
        [6, 8],
        [10, 12]
      ]);

      const result = matrixA.add(matrixB);

      expect(result?.data).toEqual(expectedResult.data);
    });

    it('should throw an error for matrices with mismatched dimensions', () => {
      const matrixA = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrixB = new Matrix([
        [5, 6, 7],
        [8, 9, 10]
      ]);

      expect(() => matrixA.add(matrixB)).toThrowError('Matrix dimensions must match for addition.');
    });

    it('should throw an error for matrices with mismatched dimensions', () => {
      const matrixA = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrixB = new Matrix([
        [5, 6, 7],
        [8, 9, 10]
      ]);

      expect(() => matrixA.add(matrixB)).toThrowError('Matrix dimensions must match for addition.');
    });
  });

  describe('subtract', () => {
    it('should subtract two matrices with numbers correctly', () => {
      const matrixA = new Matrix([
        [5, 6],
        [7, 8]
      ]);
      const matrixB = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const expectedResult = new Matrix([
        [4, 4],
        [4, 4]
      ]);

      const result = matrixA.subtract(matrixB);

      expect(result?.data).toEqual(expectedResult.data);
    });

    it('should subtract two matrices with custom subtract function correctly', () => {
      const customSubtractFn = (a: number, b: number) => a * 10 - b; // Custom subtraction for arrays
      const matrixA = new Matrix(
        [
          [5, 6],
          [7, 8]
        ],
        { subtractFn: customSubtractFn }
      );
      const matrixB = new Matrix(
        [
          [1, 2],
          [3, 4]
        ],
        { subtractFn: customSubtractFn }
      );
      const expectedResult = new Matrix(
        [
          [49, 58],
          [67, 76]
        ],
        { subtractFn: customSubtractFn }
      );

      const result = matrixA.subtract(matrixB);

      expect(result?.data).toEqual(expectedResult.data);
    });

    it('should throw an error for matrices with mismatched dimensions', () => {
      const matrixA = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrixB = new Matrix([
        [5, 6, 7],
        [8, 9, 10]
      ]);

      expect(() => matrixA.subtract(matrixB)).toThrowError('Matrix dimensions must match for subtraction.');
    });
  });

  describe('multiply', () => {
    it('should multiply two matrices with numbers correctly', () => {
      const matrixA = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrixB = new Matrix([
        [5, 6],
        [7, 8]
      ]);
      const expectedResult = new Matrix([
        [19, 22],
        [43, 50]
      ]);

      const result = matrixA.multiply(matrixB);

      expect(result?.data).toEqual(expectedResult.data);
    });

    it('should multiply two matrices with custom multiply function correctly', () => {
      const customMultiplyFn = (a: number, b: number) => a * 10 * b; // Custom multiplication for arrays
      const matrixA = new Matrix(
        [
          [1, 2],
          [3, 4]
        ],
        { multiplyFn: customMultiplyFn }
      );
      const matrixB = new Matrix(
        [
          [5, 6],
          [7, 8]
        ],
        { multiplyFn: customMultiplyFn }
      );
      const result = matrixA.multiply(matrixB);

      expect(result?.data).toEqual([
        [190, 220],
        [430, 500]
      ]);
    });

    it('should throw an error for matrices with mismatched dimensions', () => {
      const matrixA = new Matrix([
        [1, 2, 3],
        [3, 4, 5]
      ]);
      const matrixB = new Matrix([
        [5, 6, 7],
        [8, 9, 1]
      ]);

      expect(() => matrixA.multiply(matrixB)).toThrowError(
        'Matrix dimensions must be compatible for multiplication (A.cols = B.rows).'
      );
    });
  });

  describe('transpose', () => {
    test('should transpose a matrix with numeric values correctly', () => {
      const originalMatrix = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]);

      const transposedMatrix = originalMatrix.transpose();

      expect(transposedMatrix.rows).toBe(originalMatrix.cols);
      expect(transposedMatrix.cols).toBe(originalMatrix.rows);
      expect(transposedMatrix.data).toEqual([
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
      ]);
    });

    test('should transpose an empty matrix correctly', () => {
      const originalMatrix = new Matrix([]);

      const transposedMatrix = originalMatrix.transpose();

      expect(transposedMatrix.rows).toBe(0);
      expect(transposedMatrix.cols).toBe(0);
      expect(transposedMatrix.data).toEqual([]);
    });

    test('should throw an error when transposing a non-rectangular matrix', () => {
      const originalMatrix = new Matrix([
        [1, 2, 3],
        [4, 5]
      ]);

      // Using a lambda to call transpose because Jest expects the error to be thrown within a function
      expect(() => originalMatrix.transpose()).toThrowError('Matrix must be rectangular for transposition.');
    });
  });

  describe('inverse', () => {
    it('should calculate the inverse of a 2x2 matrix', () => {
      const data: number[][] = [
        [1, 2],
        [3, 4]
      ];

      const matrix = new Matrix(data);
      const inverseMatrix = matrix.inverse();

      const expectedInverse: number[][] = [
        [-2, 1],
        [1.5, -0.5]
      ];

      expect(inverseMatrix?.data).toEqual(expectedInverse);
    });

    it('should calculate the inverse of a 3x3 matrix', () => {
      const data: number[][] = [
        [4, 7, 2],
        [2, 6, 3],
        [1, 2, 5]
      ];

      const matrix = new Matrix(data);
      const inverseMatrix = matrix.inverse();

      // const expectedInverse: number[][] = [
      //   [24 / 43, -31 / 43, 9 / 43],
      //   [-7 / 43, 18 / 43, -8 / 43],
      //   [-2 / 43, -1 / 43, 10 / 43],
      // ];

      expect(inverseMatrix?.data).toEqual([
        [0.558139534883721, -0.7209302325581396, 0.2093023255813954],
        [-0.16279069767441862, 0.4186046511627907, -0.18604651162790697],
        [-0.046511627906976744, -0.023255813953488372, 0.23255813953488372]
      ]);
    });
  });

  describe('dot', () => {
    test('should calculate the dot product of two matrices', () => {
      const matrix1 = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrix2 = new Matrix([
        [5, 6],
        [7, 8]
      ]);

      const resultMatrix = matrix1.dot(matrix2);

      expect(resultMatrix?.data).toEqual([
        [19, 22],
        [43, 50]
      ]);
    });

    test('should throw an error for incompatible matrices', () => {
      const matrix1 = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrix2 = new Matrix([
        [5, 6, 7],
        [8, 9, 10],
        [18, 19, 110]
      ]);
      expect(() => matrix1.dot(matrix2)).toThrowError(
        'Number of columns in the first matrix must be equal to the number of rows in the second matrix for dot product.'
      );
    });

    it('should throw an error for incompatible matrices', () => {
      const matrixA = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrixB = new Matrix([
        [5, 6],
        [7, 8],
        [9, 10]
      ]);

      expect(() => matrixA.dot(matrixB)).toThrowError(
        'Number of columns in the first matrix must be equal to the number of rows in the second matrix for dot product.'
      );
    });
  });
});
