import Vector2D from './vector2d'

export class Matrix2D {
    private readonly _matrix: number[][];

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

    public static get empty(): number[][] {
        return [[], [], []]
    }

    /**
     * Initialize an identity matrix
     */
    public static get identity(): number[][] {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]]
    }

    /**
     * Return the matrix values
     */
    public get m(): number[][] {
        return this._matrix
    }

    public get toVector(): Vector2D {
        return new Vector2D(this._matrix[0][0], this._matrix[1][0])
    }

    public static add(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D {
        const result = Matrix2D.empty
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = matrix1.m[i][j] + matrix2.m[i][j]
            }
        }
        return new Matrix2D(result);
    }

    public static subtract(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D {
        const result = Matrix2D.empty
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = matrix1.m[i][j] - matrix2.m[i][j]
            }
        }
        return new Matrix2D(result);
    }

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

    public static multiplyByValue(matrix: Matrix2D, value: number): Matrix2D {
        const result = Matrix2D.empty
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = matrix.m[i][j] * value
            }
        }
        return new Matrix2D(result);
    }

    public static multiplyByVector(matrix: Matrix2D, vector: Vector2D): Vector2D {
        return Matrix2D.multiply(matrix, new Matrix2D(vector)).toVector
    }

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

    public static scale(factor: number) {
        return Matrix2D.multiplyByValue(new Matrix2D(), factor)
    }

    public static rotate(radians: number) {
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        return new Matrix2D([
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1]])
    }

    public static translate(vector: Vector2D): Matrix2D {
        return new Matrix2D([
            [1, 0, vector.x],
            [0, 1, vector.y],
            [0, 0, vector.w]])
    }
}

export default Matrix2D