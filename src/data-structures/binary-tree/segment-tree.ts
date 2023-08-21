/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {SegmentTreeNodeVal} from '../types';

export class SegmentTreeNode {
    constructor(start: number, end: number, sum: number, val?: SegmentTreeNodeVal | null) {
        this._start = start;
        this._end = end;
        this._sum = sum;
        this._val = val || null;
    }

    private _start = 0;
    get start(): number {
        return this._start;
    }

    set start(v: number) {
        this._start = v;
    }

    private _end = 0;

    get end(): number {
        return this._end;
    }

    set end(v: number) {
        this._end = v;
    }

    private _val: SegmentTreeNodeVal | null = null;

    get val(): SegmentTreeNodeVal | null {
        return this._val;
    }

    set val(v: SegmentTreeNodeVal | null) {
        this._val = v;
    }

    private _sum = 0;

    get sum(): number {
        return this._sum;
    }

    set sum(v: number) {
        this._sum = v;
    }

    private _left: SegmentTreeNode | null = null;

    get left(): SegmentTreeNode | null {
        return this._left;
    }

    set left(v: SegmentTreeNode | null) {
        this._left = v;
    }

    private _right: SegmentTreeNode | null = null;

    get right(): SegmentTreeNode | null {
        return this._right;
    }

    set right(v: SegmentTreeNode | null) {
        this._right = v;
    }
}

export class SegmentTree {
    /**
     * The constructor initializes the values, start, end, and root properties of an object.
     * @param {number[]} values - An array of numbers that will be used to build a binary search tree.
     * @param {number} [start] - The `start` parameter is the index of the first element in the `values` array that should
     * be included in the range. If no value is provided for `start`, it defaults to 0, which means the range starts from
     * the beginning of the array.
     * @param {number} [end] - The "end" parameter is the index of the last element in the "values" array that should be
     * included in the range. If not provided, it defaults to the index of the last element in the "values" array.
     */
    constructor(values: number[], start?: number, end?: number) {
        start = start || 0;
        end = end || values.length - 1;
        this._values = values;
        this._start = start;
        this._end = end;
        this._root = this.build(start, end);
    }

    private _values: number[] = [];

    get values(): number[] {
        return this._values;
    }

    private _start = 0;
    get start(): number {
        return this._start;
    }

    private _end: number;

    get end(): number {
        return this._end;
    }

    private _root: SegmentTreeNode | null;

    get root(): SegmentTreeNode | null {
        return this._root;
    }

    /**
     * The function builds a segment tree by recursively dividing the given range into smaller segments and creating nodes
     * for each segment.
     * @param {number} start - The `start` parameter represents the starting index of the segment or range for which we are
     * building the segment tree.
     * @param {number} end - The `end` parameter represents the ending index of the segment or range for which we are
     * building the segment tree.
     * @returns a SegmentTreeNode object.
     */
    build(start: number, end: number): SegmentTreeNode {
        if (start === end) return new SegmentTreeNode(start, end, this._values[start]);

        const mid = start + Math.floor((end - start) / 2);
        const left = this.build(start, mid);
        const right = this.build(mid + 1, end);
        const cur = new SegmentTreeNode(start, end, left.sum + right.sum);
        cur.left = left;
        cur.right = right;
        return cur;
    }

    /**
     * The function updates the value of a node in a segment tree and recalculates the sum of its children if they exist.
     * @param {number} index - The index parameter represents the index of the node in the segment tree that needs to be
     * updated.
     * @param {number} sum - The `sum` parameter represents the new value that should be assigned to the `sum` property of
     * the `SegmentTreeNode` at the specified `index`.
     * @param {SegmentTreeNodeVal} [val] - The `val` parameter is an optional value that can be assigned to the `val`
     * property of the `SegmentTreeNode` object. It is not currently used in the code, but you can uncomment the line `//
     * cur.val = val;` and pass a value for `val` in the
     * @returns The function does not return anything.
     */
    updateNode(index: number, sum: number, val?: SegmentTreeNodeVal) {
        const root = this.root || null;
        if (!root) {
            return;
        }
        const dfs = (cur: SegmentTreeNode, index: number, sum: number, val?: SegmentTreeNodeVal) => {
            if (cur.start === cur.end && cur.start === index) {
                cur.sum = sum;
                // cur.val = val;
                return;
            }
            const mid = cur.start + Math.floor((cur.end - cur.start) / 2);
            if (index <= mid) {
                if (cur.left) {
                    dfs(cur.left, index, sum, val);
                }
            } else {
                if (cur.right) {
                    dfs(cur.right, index, sum, val);
                }
            }
            if (cur.left && cur.right) {
                cur.sum = cur.left.sum + cur.right.sum;
            }
        };

        dfs(root, index, sum);
    }

    /**
     * The function `querySumByRange` calculates the sum of values within a given range in a segment tree.
     * @param {number} indexA - The starting index of the range for which you want to calculate the sum.
     * @param {number} indexB - The parameter `indexB` represents the ending index of the range for which you want to
     * calculate the sum.
     * @returns The function `querySumByRange` returns a number.
     */
    querySumByRange(indexA: number, indexB: number): number {
        const root = this.root || null;
        if (!root) {
            return 0;
        }

        const dfs = (cur: SegmentTreeNode, i: number, j: number): number => {
            if (cur.start === i && cur.end === j) {
                return cur.sum;
            }
            const mid = cur.start + Math.floor((cur.end - cur.start) / 2);
            if (j <= mid) {
                // TODO after no-non-null-assertion not ensure the logic
                if (cur.left) {
                    return dfs(cur.left, i, j);
                } else {
                    return NaN;
                }
            } else if (i > mid) {
                // TODO after no-non-null-assertion not ensure the logic
                if (cur.right) {
                    // TODO after no-non-null-assertion not ensure the logic
                    return dfs(cur.right, i, j);

                } else {
                    return NaN;
                }
            } else {
                // TODO after no-non-null-assertion not ensure the logic
                if (cur.left && cur.right) {
                    return dfs(cur.left, i, mid) + dfs(cur.right, mid + 1, j);
                } else {
                    return NaN;
                }
            }
        };
        return dfs(root, indexA, indexB);
    }

    protected _setValues(value: number[]) {
        this._values = value;
    }

    protected _setStart(value: number) {
        this._start = value;
    }

    protected _setEnd(value: number) {
        this._end = value;
    }

    protected _setRoot(v: SegmentTreeNode | null) {
        this._root = v;
    }
}
