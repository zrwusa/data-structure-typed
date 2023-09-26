import {MatrixNTI2D} from '../../../../src';

describe('MatrixNTI2D', () => {
  it('should initialize a matrix with rows and columns', () => {
    const numRows = 3;
    const numCols = 4;
    const matrix = new MatrixNTI2D({row: numRows, col: numCols});

    expect(matrix.toArray().length).toBe(numRows);
    expect(matrix.toArray()[0].length).toBe(numCols);
  });

  it('should initialize all elements with the provided initial value', () => {
    const numRows = 3;
    const numCols = 4;
    const initialValue = 42;
    const matrix = new MatrixNTI2D({row: numRows, col: numCols, initialVal: initialValue});

    const matrixArray = matrix.toArray();
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        expect(matrixArray[i][j]).toBe(initialValue);
      }
    }
  });

  it('should initialize all elements with 0 if no initial value is provided', () => {
    const numRows = 3;
    const numCols = 4;
    const matrix = new MatrixNTI2D({row: numRows, col: numCols});

    const matrixArray = matrix.toArray();
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        expect(matrixArray[i][j]).toBe(0);
      }
    }
  });

  it('should convert the matrix to a two-dimensional array', () => {
    const numRows = 2;
    const numCols = 3;
    const matrix = new MatrixNTI2D({row: numRows, col: numCols, initialVal: 1});

    const matrixArray = matrix.toArray();
    expect(matrixArray.length).toBe(numRows);
    for (let i = 0; i < numRows; i++) {
      expect(matrixArray[i].length).toBe(numCols);
      for (let j = 0; j < numCols; j++) {
        expect(matrixArray[i][j]).toBe(1);
      }
    }
  });
});
