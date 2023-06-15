export type PriorityQueueComparator<T> = (a: T, b: T) => number;

export interface PriorityQueueOptions<T> {
    nodes?: T[];
    isFix?: boolean;
    comparator: PriorityQueueComparator<T>;
}

export type PriorityQueueDFSOrderPattern = 'pre' | 'in' | 'post';

export class PriorityQueue<T = number> {
    protected nodes: T[] = [];

    get size(): number {
        return this.nodes.length;
    }

    protected readonly _comparator: PriorityQueueComparator<T> = (a: T, b: T) => {
        const aKey = a as unknown as number, bKey = b as unknown as number;
        return aKey - bKey;
    };

    constructor(options: PriorityQueueOptions<T>) {
        const {nodes, comparator, isFix = true} = options;
        this._comparator = comparator;

        if (nodes && nodes instanceof Array && nodes.length > 0) {
            // TODO support distinct
            this.nodes = Array.isArray(nodes) ? [...nodes] : [];
            isFix && this._fix();
        }
    }

    protected _compare(a: number, b: number) {
        return this._comparator(this.nodes[a], this.nodes[b]) > 0;
    }

    protected _swap(a: number, b: number) {
        const temp = this.nodes[a];
        this.nodes[a] = this.nodes[b];
        this.nodes[b] = temp;
    }

    protected _isValidIndex(index: number): boolean {
        return index > -1 && index < this.nodes.length;
    }

    protected _getParent(child: number): number {
        return Math.floor((child - 1) / 2);
    }

    protected _getLeft(parent: number): number {
        return (2 * parent) + 1;
    }

    protected _getRight(parent: number): number {
        return (2 * parent) + 2;
    }

    protected _getComparedChild(parent: number) {
        let min = parent;
        const left = this._getLeft(parent), right = this._getRight(parent);

        if (left < this.size && this._compare(min, left)) {
            min = left;
        }
        if (right < this.size && this._compare(min, right)) {
            min = right;
        }
        return min;
    }

    protected _heapifyUp(start: number) {
        while (start > 0 && this._compare(this._getParent(start), start)) {
            const parent = this._getParent(start);
            this._swap(start, parent);
            start = parent;
        }
    }

    protected _heapifyDown(start: number) {
        let min = this._getComparedChild(start);
        while (this._compare(start, min)) {
            this._swap(min, start);
            start = min;
            min = this._getComparedChild(start);
        }
    }

    protected _fix() {
        for (let i = Math.floor(this.size / 2); i > -1; i--) this._heapifyDown(i);
    }

    offer(node: T) {
        this.nodes.push(node);
        this._heapifyUp(this.size - 1);
    }

    peek(): T | null {
        return this.size ? this.nodes[0] : null;
    }

    poll(): T | null {
        let res: T | null = null;
        if (this.size > 1) {
            this._swap(0, this.nodes.length - 1);
            res = this.nodes.pop() ?? null;
            this._heapifyDown(0);
        } else if (this.size === 1) {
            res = this.nodes.pop() ?? null;
        }
        return res;
    }

    leaf(): T | null {
        return this.nodes[this.size - 1] ?? null;
    }

    isEmpty() {
        return this.size === 0;
    }

    clear() {
        this.nodes = [];
    }

    toArray(): T[] {
        return [...this.nodes];
    }

    clone(): PriorityQueue<T> {
        return new PriorityQueue<T>({nodes: this.nodes, comparator: this._comparator});
    }

    // --- start additional methods ---
    isValid(): boolean {
        const isValidRecursive = (parentIndex: number): boolean => {
            let isValidLeft = true;
            let isValidRight = true;

            if (this._getLeft(parentIndex) !== -1) {
                const leftChildIndex = (parentIndex * 2) + 1;
                if (!this._compare(parentIndex, leftChildIndex)) return false;
                isValidLeft = isValidRecursive(leftChildIndex);
            }

            if (this._getRight(parentIndex) !== -1) {
                const rightChildIndex = (parentIndex * 2) + 2;
                if (!this._compare(parentIndex, rightChildIndex)) return false;
                isValidRight = isValidRecursive(rightChildIndex);
            }

            return isValidLeft && isValidRight;
        };

        return isValidRecursive(0);
    }

    sort(): T[] {
        const visitedNode: T[] = [];
        while (this.size !== 0) {
            const top = this.poll();
            if (top) visitedNode.push(top);
        }
        return visitedNode;
    }

    DFS(dfsMode: PriorityQueueDFSOrderPattern): (T | null)[] {
        const visitedNode: (T | null)[] = [];

        const traverse = (cur: number) => {
            const leftChildIndex = this._getLeft(cur);
            const rightChildIndex = this._getRight(cur);
            switch (dfsMode) {
                case 'in':
                    this._isValidIndex(leftChildIndex) && traverse(leftChildIndex);
                    visitedNode.push(this.nodes[cur] ?? null);
                    this._isValidIndex(rightChildIndex) && traverse(rightChildIndex);
                    break;
                case 'pre':
                    visitedNode.push(this.nodes[cur] ?? null);
                    this._isValidIndex(leftChildIndex) && traverse(leftChildIndex);
                    this._isValidIndex(rightChildIndex) && traverse(rightChildIndex);
                    break;
                case 'post':
                    this._isValidIndex(leftChildIndex) && traverse(leftChildIndex);
                    this._isValidIndex(rightChildIndex) && traverse(rightChildIndex);
                    visitedNode.push(this.nodes[cur] ?? null);
                    break;
            }
        };

        this._isValidIndex(0) && traverse(0);
        return visitedNode;
    }

    static heapify<T>(options: PriorityQueueOptions<T>) {
        const heap = new PriorityQueue(options);
        heap._fix();
        return heap;
    }

    static isPriorityQueueified<T>(options: Omit<PriorityQueueOptions<T>, 'isFix'>) {
        return new PriorityQueue({...options, isFix: true}).isValid();
    }

    // --- end additional methods ---
}