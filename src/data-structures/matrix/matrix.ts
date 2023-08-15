/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
// todo need to be improved
export class MatrixNTI2D<T = number> {
    private readonly _matrix: Array<Array<T>>;

    /**
     * The constructor creates a matrix with the specified number of rows and columns, and initializes all elements to a
     * given initial value or 0 if not provided.
     * @param options - An object containing the following properties:
     */
    constructor(options: { row: number, col: number, initialVal?: T }) {
        const {row, col, initialVal} = options;
        this._matrix = new Array(row).fill(undefined).map(() => new Array(col).fill(initialVal || 0));
    }

    /* The `toArray` method returns the matrix as a two-dimensional array. It converts the internal representation of the
    matrix, which is an array of arrays, into a format that is more commonly used in JavaScript. */
    toArray(): Array<Array<T>> {
        return this._matrix;
    }
}
