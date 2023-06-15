// todo need to be improved
export class MatrixNTI2D<T = number> {
    private readonly _matrix: Array<Array<T>>;

    constructor(options: { row: number, col: number, initialVal?: T }) {
        const {row, col, initialVal} = options;
        this._matrix = new Array(row).fill(undefined).map(() => new Array(col).fill(initialVal || 0));
    }

    toArray(): Array<Array<T>> {
        return this._matrix;
    }
}
