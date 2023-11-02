import {Matrix2D, Vector2D} from '../../../../src';
import {isDebugTest} from '../../../config';

const isDebug = isDebugTest;
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

describe('Vector2D', () => {
  it('should create a vector with default values', () => {
    const vector = new Vector2D();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
    expect(vector.w).toBe(1);
  });

  it('should correctly calculate vector length', () => {
    const vector = new Vector2D(3, 4);
    expect(vector.length).toBe(5);
  });

  it('should correctly add two vectors', () => {
    const vector1 = new Vector2D(2, 3);
    const vector2 = new Vector2D(1, 2);
    const result = Vector2D.add(vector1, vector2);
    expect(result.x).toBe(3);
    expect(result.y).toBe(5);
  });

  // Add more test cases for Vector2D methods
});

describe('Matrix2D', () => {
  it('should create an identity matrix by default', () => {
    const matrix = new Matrix2D();
    expect(matrix.m).toEqual(Matrix2D.identity);
  });

  it('should correctly add two matrices', () => {
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
    const result = Matrix2D.add(matrix1, matrix2);
    expect(result.m).toEqual([
      [10, 10, 10],
      [10, 10, 10],
      [10, 10, 10]
    ]);
  });

  // Add more test cases for Matrix2D methods
});

describe('Matrix2D', () => {
  it('should create a matrix with default identity values', () => {
    const matrix = new Matrix2D();
    expect(matrix.m).toEqual(Matrix2D.identity);
  });

  it('should create a matrix from a Vector2D', () => {
    const vector = new Vector2D(2, 3);
    const matrix = new Matrix2D(vector);
    expect(matrix.m).toEqual([
      [2, 0, 0],
      [3, 1, 0],
      [1, 0, 1]
    ]);
  });

  it('should correctly add two matrices', () => {
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
    const result = Matrix2D.add(matrix1, matrix2);
    expect(result.m).toEqual([
      [10, 10, 10],
      [10, 10, 10],
      [10, 10, 10]
    ]);
  });

  it('should correctly subtract two matrices', () => {
    const matrix1 = new Matrix2D([
      [5, 4, 3],
      [2, 1, 0],
      [0, 1, 2]
    ]);
    const matrix2 = new Matrix2D([
      [4, 3, 2],
      [1, 0, 1],
      [2, 1, 0]
    ]);
    const result = Matrix2D.subtract(matrix1, matrix2);
    expect(result.m).toEqual([
      [1, 1, 1],
      [1, 1, -1],
      [-2, 0, 2]
    ]);
  });

  it('should correctly multiply two matrices', () => {
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
    const result = Matrix2D.multiply(matrix1, matrix2);
    expect(result.m).toEqual([
      [30, 24, 18],
      [84, 69, 54],
      [138, 114, 90]
    ]);
  });

  it('should correctly multiply a matrix by a value', () => {
    const matrix = new Matrix2D([
      [2, 3, 4],
      [5, 6, 7],
      [8, 9, 10]
    ]);
    const value = 2;
    const result = Matrix2D.multiplyByValue(matrix, value);
    expect(result.m).toEqual([
      [4, 6, 8],
      [10, 12, 14],
      [16, 18, 20]
    ]);
  });

  it('should correctly multiply a matrix by a vector', () => {
    const matrix = new Matrix2D([
      [2, 3, 4],
      [5, 6, 7],
      [8, 9, 10]
    ]);
    const vector = new Vector2D(2, 3);
    const result = Matrix2D.multiplyByVector(matrix, vector);
    isDebug && console.log(JSON.stringify(result));
    expect(result).toEqual({x: 17, y: 35, w: 1});
  });

  it('should correctly create a view matrix', () => {
    const width = 800;
    const height = 600;
    const viewMatrix = Matrix2D.view(width, height);
    expect(viewMatrix.m).toEqual([
      [1, 0, 400],
      [0, -1, 300],
      [0, 0, 1]
    ]);
  });

  it('should correctly scale a matrix', () => {
    const factor = 3;
    const scaledMatrix = Matrix2D.scale(factor);
    expect(scaledMatrix.m).toEqual([
      [3, 0, 0],
      [0, 3, 0],
      [0, 0, 3]
    ]);
  });

  it('should correctly rotate a matrix', () => {
    const radians = Math.PI / 4; // 45 degrees
    const rotationMatrix = Matrix2D.rotate(radians);
    isDebug && console.log(JSON.stringify(rotationMatrix.m));
    expect(rotationMatrix.m).toEqual([
      [0.7071067811865476, -0.7071067811865475, 0],
      [0.7071067811865475, 0.7071067811865476, 0],
      [0, 0, 1]
    ]);
  });

  it('should correctly translate a matrix', () => {
    const translationVector = new Vector2D(2, 3);
    const translationMatrix = Matrix2D.translate(translationVector);
    expect(translationMatrix.m).toEqual([
      [1, 0, 2],
      [0, 1, 3],
      [0, 0, 1]
    ]);
  });

  it('should correctly convert a matrix to a vector', () => {
    const matrix = new Matrix2D([
      [2, 3, 4],
      [5, 6, 7],
      [8, 9, 10]
    ]);
    const vector = matrix.toVector();
    expect(vector).toEqual(new Vector2D(2, 5));
  });
});
