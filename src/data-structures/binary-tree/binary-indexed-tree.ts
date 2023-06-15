export class BinaryIndexedTree {
    private readonly _sumTree: number[];

    constructor(n: number) {
        this._sumTree = new Array<number>(n + 1).fill(0);
    }

    update(i: number, delta: number) {
        while (i < this._sumTree.length) {
            this._sumTree[i] += delta;
            i += BinaryIndexedTree.lowBit(i);
        }
    }

    getPrefixSum(i: number) {
        let sum = 0;
        while (i > 0) {
            sum += this._sumTree[i];
            i -= BinaryIndexedTree.lowBit(i);
        }
        return sum;
    }

    public getRangeSum(start: number, end: number): number {
        if (!(0 <= start && start <= end && end <= this._sumTree.length))
            throw 'Index out of bounds';
        return this.getPrefixSum(end) - this.getPrefixSum(start);
    }

    static lowBit(x: number) {
        return x & (-x);
    }
}
