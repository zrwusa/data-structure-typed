/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import Vector2D from './vector2d'

export class Matrix2D {
    private readonly _matrix: number[][];

    /**
     * The constructor function initializes a Matrix2D object with either a default identity matrix, or a provided matrix
     * or Vector2D object.
     * @param {number[][] | Vector2D} [value] - The `value` parameter can be either a 2D array of numbers (`number[][]`) or
     * an instance of the `Vector2D` class.
     */
    constructor(value?: number[][] | Vector2D) {
        if (typeof value === 'undefined') {
            this._matrix = Matrix2D.identity
        } else if (value instanceof Vector2D) {
            this._matrix = Matrix2D.identity
            this._matrix[0][0] = value.x
            this._matrix[1][0] = value.y
            this._matrix[2][0] = value.w
        } else {
            this._matrix = value
        }
    }

    /**
     * The function returns a 2D array with three empty arrays.
     * @returns An empty 2-dimensional array with 3 empty arrays inside.
     */
    public static get empty(): number[][] {
        return [[], [], []]
    }

    /**
     * The above function returns a 3x3 identity matrix.
     * @returns The method is returning a 2-dimensional array of numbers representing the identity matrix.
     */
    public static get identity(): number[][] {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]]
    }

    /**
     * The function returns a two-dimensional array of numbers.
     * @returns The getter method is returning the value of the private variable `_matrix`, which is a two-dimensional
     * array of numbers.
     */
    public get m(): number[][] {
        return this._matrix
    }

    /**
     * The function "toVector" returns a new Vector2D object with the values from the first and second elements of the
     * _matrix array.
     * @returns A new instance of the Vector2D class is being returned. The values of the returned vector are taken from
     * the first column of the matrix.
     */
    public get toVector(): Vector2D {
        return new Vector2D(this._matrix[0][0], this._matrix[1][0])
    }

    /**
     * The function takes two 2D matrices as input and returns their sum as a new 2D matrix.
     * @param {Matrix2D} matrix1 - Matrix2D - The first matrix to be added.
     * @param {Matrix2D} matrix2 - The parameter `matrix2` is a Matrix2D object.
     * @returns a new instance of the Matrix2D class, which is created using the result array.
     */
    public static add(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D {
        const result = Matrix2D.empty
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = matrix1.m[i][j] + matrix2.m[i][j]
            }
        }
        return new Matrix2D(result);
    }

    /**
     * The function subtracts two 2D matrices and returns the result as a new Matrix2D object.
     * @param {Matrix2D} matrix1 - Matrix2D - The first matrix to subtract from.
     * @param {Matrix2D} matrix2 - Matrix2D is a class representing a 2D matrix. It has a property `m` which is a 2D array
     * representing the matrix elements.
     * @returns a new instance of the Matrix2D class, which is created using the result array.
     */
    public static subtract(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D {
        const result = Matrix2D.empty
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = matrix1.m[i][j] - matrix2.m[i][j]
            }
        }
        return new Matrix2D(result);
    }

    /**
     * The function multiplies two 2D matrices and returns the result as a new Matrix2D object.
     * @param {Matrix2D} matrix1 - A 2D matrix represented by the Matrix2D class.
     * @param {Matrix2D} matrix2 - The parameter `matrix2` is a 2D matrix of size 3x3.
     * @returns a new instance of the Matrix2D class, created using the result array.
     */
    public static multiply(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D {
        const result = Matrix2D.empty
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = 0;
                for (let k = 0; k < 3; k++) {
                    result[i][j] += matrix1.m[i][k] * matrix2.m[k][j];
                }
            }
        }
        return new Matrix2D(result);
    }

    /**
     * The function multiplies each element of a 2D matrix by a given value and returns the resulting matrix.
     * @param {Matrix2D} matrix - The `matrix` parameter is an instance of the `Matrix2D` class, which represents a 2D
     * matrix. It contains a property `m` that is a 2D array representing the matrix elements.
     * @param {number} value - The `value` parameter is a number that you want to multiply each element of the `matrix` by.
     * @returns a new instance of the Matrix2D class, which is created using the result array.
     */
    public static multiplyByValue(matrix: Matrix2D, value: number): Matrix2D {
        const result = Matrix2D.empty
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = matrix.m[i][j] * value
            }
        }
        return new Matrix2D(result);
    }

    /**
     * The function multiplies a 2D matrix by a 2D vector and returns the result as a 2D vector.
     * @param {Matrix2D} matrix - The parameter "matrix" is of type Matrix2D. It represents a 2-dimensional matrix.
     * @param {Vector2D} vector - The "vector" parameter is a 2D vector, represented by an object of type Vector2D.
     * @returns a Vector2D.
     */
    public static multiplyByVector(matrix: Matrix2D, vector: Vector2D): Vector2D {
        return Matrix2D.multiply(matrix, new Matrix2D(vector)).toVector
    }

    /**
     * The function returns a 2D matrix that scales and flips a vector around the center of a given width and height.
     * @param {number} width - The width parameter represents the width of the view or the canvas. It is a number that
     * specifies the width in pixels or any other unit of measurement.
     * @param {number} height - The height parameter represents the height of the view or the canvas. It is used to
     * calculate the centerY value, which is the vertical center of the view.
     * @returns a Matrix2D object.
     */
    public static view(width: number, height: number): Matrix2D {
        const scaleStep = 1 // Scale every vector * scaleStep
        const centerX = width / 2
        const centerY = height / 2
        const flipX = Math.cos(Math.PI) // rotate 180deg / 3.14radian around X-axis

        return new Matrix2D([
            [scaleStep, 0, centerX],
            [0, flipX * scaleStep, centerY],
            [0, 0, 1]])
    }

    /**
     * The function scales a matrix by a given factor.
     * @param {number} factor - The factor parameter is a number that represents the scaling factor by which the matrix
     * should be scaled.
     * @returns the result of multiplying a new instance of Matrix2D by the given factor.
     */
    public static scale(factor: number) {
        return Matrix2D.multiplyByValue(new Matrix2D(), factor)
    }

    /**
     * The function "rotate" takes an angle in radians and returns a 2D transformation matrix for rotating objects.
     * @param {number} radians - The "radians" parameter is the angle in radians by which you want to rotate an object.
     * @returns The code is returning a new instance of a Matrix2D object.
     */
    public static rotate(radians: number) {
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        return new Matrix2D([
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1]])
    }

    /**
     * The translate function takes a 2D vector and returns a 2D matrix that represents a translation transformation.
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D. It represents a 2D vector with components x
     * and y, and an optional w component.
     * @returns The method is returning a new instance of the Matrix2D class.
     */
    public static translate(vector: Vector2D): Matrix2D {
        return new Matrix2D([
            [1, 0, vector.x],
            [0, 1, vector.y],
            [0, 0, vector.w]])
    }
}

export default Matrix2D