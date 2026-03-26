import { Matrix } from '../../../../src';

describe('classic use', () => {
  it('@example [Matrix.add] Basic matrix arithmetic', () => {
    const a = new Matrix([
      [1, 2],
      [3, 4]
    ]);
    const b = new Matrix([
      [5, 6],
      [7, 8]
    ]);

    const sum = a.add(b);
    expect(sum?.data).toEqual([
      [6, 8],
      [10, 12]
    ]);

    const diff = b.subtract(a);
    expect(diff?.data).toEqual([
      [4, 4],
      [4, 4]
    ]);
  });

  it('@example [Matrix.multiply] Matrix multiplication for transformations', () => {
    // 2x3 matrix * 3x2 matrix = 2x2 matrix
    const a = new Matrix([
      [1, 2, 3],
      [4, 5, 6]
    ]);
    const b = new Matrix([
      [7, 8],
      [9, 10],
      [11, 12]
    ]);

    const product = a.multiply(b);
    expect(product?.rows).toBe(2);
    expect(product?.cols).toBe(2);
    // Row 0: 1*7+2*9+3*11=58, 1*8+2*10+3*12=64
    // Row 1: 4*7+5*9+6*11=139, 4*8+5*10+6*12=154
    expect(product?.data).toEqual([
      [58, 64],
      [139, 154]
    ]);
  });

  it('@example [Matrix.transpose] Matrix transpose (square matrix)', () => {
    const m = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);

    const transposed = m.transpose();
    expect(transposed.rows).toBe(3);
    expect(transposed.cols).toBe(3);
    expect(transposed.data).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ]);

    // Transpose of transpose = original
    expect(transposed.transpose().data).toEqual(m.data);
  });

  it('@example [Matrix.get] Get and set individual cells', () => {
    const m = new Matrix([
      [0, 0, 0],
      [0, 0, 0]
    ]);

    m.set(0, 1, 42);
    m.set(1, 2, 99);

    expect(m.get(0, 1)).toBe(42);
    expect(m.get(1, 2)).toBe(99);
    expect(m.get(0, 0)).toBe(0);

    // Out of bounds returns undefined
    expect(m.get(5, 5)).toBeUndefined();
  });

  it('@example [Matrix.set] Modify individual cells', () => {
    const m = Matrix.zeros(2, 2);
    expect(m.set(0, 0, 5)).toBe(true);
    expect(m.set(1, 1, 10)).toBe(true);
    expect(m.get(0, 0)).toBe(5);
    expect(m.get(1, 1)).toBe(10);
  });

  it('@example [Matrix.subtract] Element-wise subtraction', () => {
    const a = Matrix.from([[5, 6], [7, 8]]);
    const b = Matrix.from([[1, 2], [3, 4]]);
    const result = a.subtract(b);
    expect(result?.toArray()).toEqual([[4, 4], [4, 4]]);
  });

  it('@example [Matrix.dot] Dot product of two matrices', () => {
    const a = Matrix.from([[1, 2], [3, 4]]);
    const b = Matrix.from([[5, 6], [7, 8]]);
    const result = a.dot(b);
    expect(result?.toArray()).toEqual([[19, 22], [43, 50]]);
  });

  it('@example [Matrix.inverse] Compute the inverse of a 2x2 matrix', () => {
    const m = Matrix.from([[4, 7], [2, 6]]);
    const inv = m.inverse();
    expect(inv).toBeDefined();
    // A * A^-1 should ≈ Identity
    const product = m.multiply(inv!);
    expect(product?.get(0, 0)).toBeCloseTo(1, 5);
    expect(product?.get(0, 1)).toBeCloseTo(0, 5);
    expect(product?.get(1, 0)).toBeCloseTo(0, 5);
    expect(product?.get(1, 1)).toBeCloseTo(1, 5);
  });
});

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

  it('should initiate with empty', () => {
    matrix = new Matrix([], { rows: 2, cols: 2 });
    expect(matrix.data).toEqual([
      [0, 0],
      [0, 0]
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

      expect(() => matrixA.add(matrixB)).toThrow('Dimensions must be compatible for addition');
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

      expect(() => matrixA.add(matrixB)).toThrow('Dimensions must be compatible for addition');
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

      expect(() => matrixA.subtract(matrixB)).toThrow('Dimensions must be compatible for subtraction');
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

      expect(() => matrixA.multiply(matrixB)).toThrow(
        'Dimensions must be compatible for multiplication'
      );
    });
  });

  describe('transpose', () => {
    it('should transpose a matrix with numeric values correctly', () => {
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

    it('should transpose an empty matrix correctly', () => {
      const originalMatrix = new Matrix([]);

      const transposedMatrix = originalMatrix.transpose();

      expect(transposedMatrix.rows).toBe(0);
      expect(transposedMatrix.cols).toBe(0);
      expect(transposedMatrix.data).toEqual([]);
    });

    it('should throw an error when transposing a non-rectangular matrix', () => {
      const originalMatrix = new Matrix([
        [1, 2, 3],
        [4, 5]
      ]);

      // Using a lambda to call transpose because Jest expects the error to be thrown within a function
      expect(() => originalMatrix.transpose()).toThrow('Must be rectangular for transposition');
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

    it('should throw error when cols does not equal to rows', () => {
      const data: number[][] = [
        [4, 7, 2],
        [2, 6, 3]
      ];

      const matrix = new Matrix(data);
      expect(() => matrix.inverse()).toThrow('Must be square for inversion');
    });

    it('should clone', () => {
      const data: number[][] = [
        [4, 7, 2],
        [2, 6, 3]
      ];

      const matrix = new Matrix(data);
      const cloned = matrix.clone();
      expect(cloned instanceof Matrix).toBe(true);
      expect(cloned.data).toEqual(data);
    });
  });

  describe('dot', () => {
    it('should calculate the dot product of two matrices', () => {
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

    it('should throw an error for incompatible matrices', () => {
      const matrix1 = new Matrix([
        [1, 2],
        [3, 4]
      ]);
      const matrix2 = new Matrix([
        [5, 6, 7],
        [8, 9, 10],
        [18, 19, 110]
      ]);
      expect(() => matrix1.dot(matrix2)).toThrow(
        'Dimensions must be compatible for dot product'
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

      expect(() => matrixA.dot(matrixB)).toThrow(
        'Dimensions must be compatible for dot product'
      );
    });
  });

  describe('standard interface', () => {
    it('size returns [rows, cols]', () => {
      const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
      expect(m.size).toEqual([2, 3]);
    });

    it('isEmpty returns false for non-empty matrix', () => {
      const m = new Matrix([[1, 2]]);
      expect(m.isEmpty()).toBe(false);
    });

    it('isEmpty returns true for 0-row matrix', () => {
      const m = new Matrix([]);
      expect(m.isEmpty()).toBe(true);
    });

    it('toArray returns deep copy', () => {
      const data = [[1, 2], [3, 4]];
      const m = new Matrix(data);
      const arr = m.toArray();
      expect(arr).toEqual([[1, 2], [3, 4]]);
      arr[0][0] = 999;
      expect(m.get(0, 0)).toBe(1); // original unchanged
    });

    it('flatten returns row-major flat array', () => {
      const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
      expect(m.flatten()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('Iterable iterates rows', () => {
      const m = new Matrix([[1, 2], [3, 4], [5, 6]]);
      const rows = [...m];
      expect(rows).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    it('Iterable rows are independent copies', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      const rows = [...m];
      rows[0][0] = 999;
      expect(m.get(0, 0)).toBe(1); // original unchanged
    });

    it('forEach visits all elements with row/col', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      const visited: [number, number, number][] = [];
      m.forEach((v, r, c) => visited.push([r, c, v]));
      expect(visited).toEqual([[0, 0, 1], [0, 1, 2], [1, 0, 3], [1, 1, 4]]);
    });

    it('map transforms elements', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      const doubled = m.map(v => v * 2);
      expect(doubled.data).toEqual([[2, 4], [6, 8]]);
      expect(m.data).toEqual([[1, 2], [3, 4]]); // original unchanged
    });

    it('map receives row/col indices', () => {
      const m = new Matrix([[0, 0], [0, 0]]);
      const withCoords = m.map((_, r, c) => r * 10 + c);
      expect(withCoords.data).toEqual([[0, 1], [10, 11]]);
    });

    it('clone is a deep copy', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      const copy = m.clone();
      copy.set(0, 0, 99);
      expect(m.get(0, 0)).toBe(1); // original unchanged
    });
  });

  describe('factory methods', () => {
    it('zeros creates all-zero matrix', () => {
      const m = Matrix.zeros(3, 4);
      expect(m.rows).toBe(3);
      expect(m.cols).toBe(4);
      m.forEach(v => expect(v).toBe(0));
    });

    it('identity creates identity matrix', () => {
      const m = Matrix.identity(3);
      expect(m.rows).toBe(3);
      expect(m.cols).toBe(3);
      expect(m.get(0, 0)).toBe(1);
      expect(m.get(1, 1)).toBe(1);
      expect(m.get(2, 2)).toBe(1);
      expect(m.get(0, 1)).toBe(0);
      expect(m.get(1, 0)).toBe(0);
    });

    it('identity matrix multiplied with any matrix = original', () => {
      const a = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const id = Matrix.identity(3);
      const result = a.multiply(id);
      expect(result?.data).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    it('from creates matrix from data', () => {
      const data = [[1, 2], [3, 4]];
      const m = Matrix.from(data);
      expect(m.data).toEqual(data);
      // Should be a copy
      data[0][0] = 99;
      expect(m.get(0, 0)).toBe(1);
    });
  });

  describe('bug fixes', () => {
    it('should handle zero values correctly in add', () => {
      const a = new Matrix([
        [1, -1],
        [0, 3]
      ]);
      const b = new Matrix([
        [-1, 1],
        [0, -3]
      ]);
      const result = a.add(b);
      expect(result?.data).toEqual([
        [0, 0],
        [0, 0]
      ]);
    });

    it('should handle zero values correctly in subtract', () => {
      const a = new Matrix([
        [5, 3],
        [0, 7]
      ]);
      const b = new Matrix([
        [5, 3],
        [0, 7]
      ]);
      const result = a.subtract(b);
      expect(result?.data).toEqual([
        [0, 0],
        [0, 0]
      ]);
    });

    it('should transpose rectangular (non-square) matrices', () => {
      const m = new Matrix([
        [1, 2, 3],
        [4, 5, 6]
      ]);
      const t = m.transpose();
      expect(t.rows).toBe(3);
      expect(t.cols).toBe(2);
      expect(t.data).toEqual([
        [1, 4],
        [2, 5],
        [3, 6]
      ]);
    });

    it('should transpose a single-row matrix', () => {
      const m = new Matrix([[1, 2, 3, 4]]);
      const t = m.transpose();
      expect(t.rows).toBe(4);
      expect(t.cols).toBe(1);
      expect(t.data).toEqual([[1], [2], [3], [4]]);
    });

    it('should transpose a single-column matrix', () => {
      const m = new Matrix([[1], [2], [3]]);
      const t = m.transpose();
      expect(t.rows).toBe(1);
      expect(t.cols).toBe(3);
      expect(t.data).toEqual([[1, 2, 3]]);
    });
  });
});
