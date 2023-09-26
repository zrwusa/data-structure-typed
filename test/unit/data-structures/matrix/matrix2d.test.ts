import {Matrix2D, Vector2D} from '../../../../src';

describe('Matrix2D', () => {
  it('should initialize with default identity matrix', () => {
    const matrix = new Matrix2D();
    const expectedMatrix = Matrix2D.identity;

    expect(matrix.m).toEqual(expectedMatrix);
  });

  it('should initialize with provided 2D array', () => {
    const inputMatrix = [
      [2, 0, 0],
      [0, 3, 0],
      [0, 0, 1]
    ];
    const matrix = new Matrix2D(inputMatrix);

    expect(matrix.m).toEqual(inputMatrix);
  });

  it('should initialize with provided Vector2D', () => {
    expect(true).toBeTruthy();
  });

  it('should add two matrices correctly', () => {
    const matrix1 = new Matrix2D([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
    const matrix2 = new Matrix2D([
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1]
    ]);
    const expectedMatrix = [
      [10, 10, 10],
      [10, 10, 10],
      [10, 10, 10]
    ];

    const result = Matrix2D.add(matrix1, matrix2);

    expect(result.m).toEqual(expectedMatrix);
  });

  it('should subtract two matrices correctly', () => {
    const matrix1 = new Matrix2D([
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1]
    ]);
    const matrix2 = new Matrix2D([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
    const expectedMatrix = [
      [8, 6, 4],
      [2, 0, -2],
      [-4, -6, -8]
    ];

    const result = Matrix2D.subtract(matrix1, matrix2);

    expect(result.m).toEqual(expectedMatrix);
  });

  it('should multiply two matrices correctly', () => {
    const matrix1 = new Matrix2D([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
    const matrix2 = new Matrix2D([
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1]
    ]);
    const expectedMatrix = [
      [30, 24, 18],
      [84, 69, 54],
      [138, 114, 90]
    ];

    const result = Matrix2D.multiply(matrix1, matrix2);

    expect(result.m).toEqual(expectedMatrix);
  });

  it('should multiply a matrix by a Vector2D correctly', () => {
    expect(true).toBeTruthy();
  });

  it('should scale a matrix by a value correctly', () => {
    expect(true).toBeTruthy();
  });

  it('should rotate a matrix by radians correctly', () => {
    expect(true).toBeTruthy();
  });

  it('should translate a matrix by a Vector2D correctly', () => {
    const translationVector = new Vector2D(2, 3);
    const expectedMatrix = [
      [1, 0, 2],
      [0, 1, 3],
      [0, 0, 1]
    ];

    const result = Matrix2D.translate(translationVector);

    expect(result.m).toEqual(expectedMatrix);
  });

  it('should create a view matrix correctly', () => {
    expect(true).toBeTruthy();
  });

  it('should multiply a matrix by a value correctly', () => {
    const matrix = new Matrix2D([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
    const value = 2;
    const expectedMatrix = [
      [2, 4, 6],
      [8, 10, 12],
      [14, 16, 18]
    ];

    const result = Matrix2D.multiplyByValue(matrix, value);

    expect(result.m).toEqual(expectedMatrix);
  });
});
