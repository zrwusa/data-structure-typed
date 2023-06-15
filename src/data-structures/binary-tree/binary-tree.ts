import {ThunkOrValue, trampoline} from '../trampoline';

export type BinaryTreeNodePropertyName = 'id' | 'val' | 'count';
export type NodeOrPropertyName = 'node' | BinaryTreeNodePropertyName;
export type DFSOrderPattern = 'in' | 'pre' | 'post';
export type BinaryTreeNodeId = number;
export type BinaryTreeDeleted<T> = { deleted: BinaryTreeNode<T> | null | undefined, needBalanced: BinaryTreeNode<T> | null };
export type ResultByProperty<T> = T | BinaryTreeNode<T> | number | BinaryTreeNodeId;
export type ResultsByProperty<T> = ResultByProperty<T>[];

export interface BinaryTreeNodeObj<T> {
    id: BinaryTreeNodeId;
    val: T;
    count?: number;
}

export enum FamilyPosition {root, left, right}

export enum LoopType { iterative = 1, recursive = 2}

export class BinaryTreeNode<T> {
    protected _id: BinaryTreeNodeId;
    get id(): BinaryTreeNodeId {
        return this._id;
    }

    set id(v: BinaryTreeNodeId) {
        this._id = v;
    }

    protected _val: T;
    get val(): T {
        return this._val;
    }

    set val(v: T) {
        this._val = v;
    }

    protected _left?: BinaryTreeNode<T> | null;
    get left(): BinaryTreeNode<T> | null | undefined {
        return this._left;
    }

    set left(v: BinaryTreeNode<T> | null | undefined) {
        if (v) {
            v.parent = this;
            v.familyPosition = FamilyPosition.left;
        }
        this._left = v;
    }

    protected _right?: BinaryTreeNode<T> | null;
    get right(): BinaryTreeNode<T> | null | undefined {
        return this._right;
    }

    set right(v: BinaryTreeNode<T> | null | undefined) {
        if (v) {
            v.parent = this;
            v.familyPosition = FamilyPosition.right;
        }
        this._right = v;
    }

    protected _parent: BinaryTreeNode<T> | null | undefined = undefined;
    get parent(): BinaryTreeNode<T> | null | undefined {
        return this._parent;
    }

    set parent(v: BinaryTreeNode<T> | null | undefined) {
        this._parent = v;
    }

    protected _familyPosition: FamilyPosition = FamilyPosition.root;
    get familyPosition(): FamilyPosition {
        return this._familyPosition;
    }

    set familyPosition(v: FamilyPosition) {
        this._familyPosition = v;
    }

    protected _count = 1;
    get count(): number {
        return this._count;
    }

    set count(v: number) {
        this._count = v;
    }

    protected _height = 0;

    get height(): number {
        return this._height;
    }

    set height(v: number) {
        this._height = v;
    }

    constructor(id: BinaryTreeNodeId, val: T, count?: number) {
        this._id = id;
        this._val = val;
        this._count = count ?? 1;
    }

    swapLocation(swapNode: BinaryTreeNode<T>): BinaryTreeNode<T> {
        const {val, count, height} = swapNode;
        const tempNode = new BinaryTreeNode<T>(swapNode.id, val);
        tempNode.val = val;
        tempNode.count = count;
        tempNode.height = height;

        swapNode.id = this.id;
        swapNode.val = this.val;
        swapNode.count = this.count;
        swapNode.height = this.height;

        this.id = tempNode.id;
        this.val = tempNode.val;
        this.count = tempNode.count;
        this.height = tempNode.height;
        return swapNode;
    }

    clone(): BinaryTreeNode<T> {
        return new BinaryTreeNode<T>(this.id, this.val, this.count);
    }
}

export class BinaryTree<T> {
    protected _root: BinaryTreeNode<T> | null = null;
    public get root(): BinaryTreeNode<T> | null {
        return this._root;
    }

    protected set root(v: BinaryTreeNode<T> | null) {
        if (v) {
            v.parent = null;
            v.familyPosition = FamilyPosition.root;
        }
        this._root = v;
    }

    protected _size = 0;
    get size(): number {
        return this._size;
    }

    protected set size(v: number) {
        this._size = v;
    }

    protected _count = 0;
    get count(): number {
        return this._count;
    }

    protected set count(v: number) {
        this._count = v;
    }

    private readonly _autoIncrementId: boolean = false;
    private _maxId: number = -1;
    private readonly _isDuplicatedVal: boolean = false;

    protected _loopType: LoopType = LoopType.iterative;
    protected _visitedId: BinaryTreeNodeId[] = [];
    protected _visitedVal: Array<T> = [];
    protected _visitedNode: BinaryTreeNode<T>[] = [];
    protected _visitedCount: number[] = [];
    protected _visitedLeftSum: number[] = [];

    protected _resetResults() {
        this._visitedId = [];
        this._visitedVal = [];
        this._visitedNode = [];
        this._visitedCount = [];
        this._visitedLeftSum = [];
    }

    constructor(options?: {
        loopType?: LoopType,
        autoIncrementId?: boolean,
        isDuplicatedVal?: boolean
    }) {
        if (options !== undefined) {
            const {
                loopType = LoopType.iterative,
                autoIncrementId = false,
                isDuplicatedVal = false
            } = options;
            this._isDuplicatedVal = isDuplicatedVal;
            this._autoIncrementId = autoIncrementId;
            this._loopType = loopType;
        }
    }

    createNode(id: BinaryTreeNodeId, val: T | null, count?: number): BinaryTreeNode<T> | null {
        return val !== null ? new BinaryTreeNode(id, val, count) : null;
    }

    clear() {
        this.root = null;
        this.size = 0;
        this.count = 0;
        this._maxId = -1;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    insertTo({newNode, parent}: { newNode: BinaryTreeNode<T> | null, parent: BinaryTreeNode<T> }) {
        if (parent) {
            if (parent.left === undefined) {
                if (newNode) {
                    newNode.parent = parent;
                    newNode.familyPosition = FamilyPosition.left;
                }
                parent.left = newNode;
                if (newNode !== null) {
                    this.size++;
                    this.count += newNode?.count ?? 0;
                }

                return parent.left;
            } else if (parent.right === undefined) {
                if (newNode) {
                    newNode.parent = parent;
                    newNode.familyPosition = FamilyPosition.right;
                }
                parent.right = newNode;
                if (newNode !== null) {
                    this.size++;
                    this.count += newNode?.count ?? 0;
                }
                return parent.right;
            } else {
                return;
            }
        } else {
            return;
        }
    }

    put(id: BinaryTreeNodeId, val: T, count?: number): BinaryTreeNode<T> | null | undefined {
        count = count ?? 1;

        const _bfs = (root: BinaryTreeNode<T>, newNode: BinaryTreeNode<T> | null): BinaryTreeNode<T> | undefined | null => {
            const queue: Array<BinaryTreeNode<T> | null> = [root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    const inserted = this.insertTo({newNode, parent: cur});
                    if (inserted !== undefined) return inserted;
                    if (cur.left) queue.push(cur.left);
                    if (cur.right) queue.push(cur.right);
                } else return;
            }
            return;
        };

        let inserted: BinaryTreeNode<T> | null | undefined;
        const needInsert = val !== null ? new BinaryTreeNode<T>(id, val, count) : null;
        const existNode = val !== null ? this.get(id, 'id') : null;
        if (this.root) {
            if (existNode) {
                existNode.count += count;
                existNode.val = val;
                if (needInsert !== null) {
                    this.count += count;
                    inserted = existNode;
                }
            } else {
                inserted = _bfs(this.root, needInsert);
            }
        } else {
            this.root = val !== null ? new BinaryTreeNode<T>(id, val, count) : null;
            if (needInsert !== null) {
                this.size = 1;
                this.count = count;
            }
            inserted = this.root;
        }
        return inserted;
    }

    insertMany(data: T[] | BinaryTreeNode<T>[]): (BinaryTreeNode<T> | null | undefined)[] {
        const inserted: (BinaryTreeNode<T> | null | undefined)[] = [];
        const map: Map<T | BinaryTreeNode<T>, number> = new Map();

        if (!this._isDuplicatedVal) {
            for (const i of data) map.set(i, (map.get(i) ?? 0) + 1);
        }

        for (const item of data) {
            const count = this._isDuplicatedVal ? 1 : map.get(item);

            if (item instanceof BinaryTreeNode) {
                inserted.push(this.put(item.id, item.val, item.count));
            } else if (typeof item === 'number' && !this._autoIncrementId) {
                if (!this._isDuplicatedVal) {
                    if (map.get(item) !== undefined) {
                        inserted.push(this.put(item, item, count));
                        map.delete(item);
                    }
                } else {
                    inserted.push(this.put(item, item, 1));
                }
            } else {
                if (item !== null) {
                    if (!this._isDuplicatedVal) {
                        if (map.get(item) !== undefined) {
                            inserted.push(this.put(++this._maxId, item, count));
                            map.delete(item);
                        }
                    } else {
                        inserted.push(this.put(++this._maxId, item, 1));
                    }
                } else {
                    inserted.push(this.put(Number.MAX_SAFE_INTEGER, item, 0));
                }
            }
        }
        return inserted;
    }

    fill(data: T[] | BinaryTreeNode<T>[]): boolean {
        this.clear();
        return data.length === this.insertMany(data).length;
    }

    remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeleted<T>[] {
        const nodes = this.getNodes(id, 'id', true);
        let node: BinaryTreeNode<T> | null | undefined = nodes[0];

        if (!node) node = undefined;
        else if (node.count > 1 && !ignoreCount) {
            node.count--;
            this.count--;
        } else if (node instanceof BinaryTreeNode) {
            const [subSize, subCount] = this.getSubTreeSizeAndCount(node);

            switch (node.familyPosition) {
                case 0:
                    this.size -= subSize;
                    this.count -= subCount;
                    node = undefined;
                    break;
                case 1:
                    if (node.parent) {
                        this.size -= subSize;
                        this.count -= subCount;
                        node.parent.left = null;
                    }
                    break;
                case 2:
                    if (node.parent) {
                        this.size -= subSize;
                        this.count -= subCount;
                        node.parent.right = null;
                    }
                    break;
            }
        }
        return [{deleted: node, needBalanced: null}];
    }

    getDepth(node: BinaryTreeNode<T>): number {
        let depth = 0;
        while (node.parent) {
            depth++;
            node = node.parent;
        }
        return depth;
    }

    getHeight(beginRoot?: BinaryTreeNode<T> | null): number {
        beginRoot = beginRoot ?? this.root;
        if (!beginRoot) return -1;

        if (this._loopType === LoopType.recursive) {
            const _getMaxHeight = (cur: BinaryTreeNode<T> | null | undefined): number => {
                if (!cur) return -1;
                const leftHeight = _getMaxHeight(cur.left);
                const rightHeight = _getMaxHeight(cur.right);
                return Math.max(leftHeight, rightHeight) + 1;
            };

            return _getMaxHeight(beginRoot);
        } else {
            const stack: BinaryTreeNode<T>[] = [];
            let node: BinaryTreeNode<T> | null | undefined = beginRoot, last: BinaryTreeNode<T> | null = null,
                depths: Map<BinaryTreeNode<T>, number> = new Map();

            while (stack.length > 0 || node) {
                if (node) {
                    stack.push(node);
                    node = node.left;
                } else {
                    node = stack[stack.length - 1]
                    if (!node.right || last === node.right) {
                        node = stack.pop();
                        if (node) {
                            let leftHeight = node.left ? depths.get(node.left) ?? -1 : -1;
                            let rightHeight = node.right ? depths.get(node.right) ?? -1 : -1;
                            depths.set(node, 1 + Math.max(leftHeight, rightHeight));
                            last = node;
                            node = null;
                        }
                    } else node = node.right
                }
            }

            return depths.get(beginRoot) ?? -1;
        }
    }

    getMinHeight(beginRoot?: BinaryTreeNode<T> | null): number {
        beginRoot = beginRoot || this.root;
        if (!beginRoot) return -1;

        if (this._loopType === LoopType.recursive) {
            const _getMinHeight = (cur: BinaryTreeNode<T> | null | undefined): number => {
                if (!cur) return 0;
                if (!cur.left && !cur.right) return 0;
                const leftMinHeight = _getMinHeight(cur.left);
                const rightMinHeight = _getMinHeight(cur.right);
                return Math.min(leftMinHeight, rightMinHeight) + 1;
            };

            return _getMinHeight(beginRoot);
        } else {
            const stack: BinaryTreeNode<T>[] = [];
            let node: BinaryTreeNode<T> | null | undefined = beginRoot, last: BinaryTreeNode<T> | null = null,
                depths: Map<BinaryTreeNode<T>, number> = new Map();

            while (stack.length > 0 || node) {
                if (node) {
                    stack.push(node);
                    node = node.left;
                } else {
                    node = stack[stack.length - 1]
                    if (!node.right || last === node.right) {
                        node = stack.pop();
                        if (node) {
                            let leftMinHeight = node.left ? depths.get(node.left) ?? -1 : -1;
                            let rightMinHeight = node.right ? depths.get(node.right) ?? -1 : -1;
                            depths.set(node, 1 + Math.min(leftMinHeight, rightMinHeight));
                            last = node;
                            node = null;
                        }
                    } else node = node.right
                }
            }

            return depths.get(beginRoot) ?? -1;
        }
    }

    isBalanced(beginRoot?: BinaryTreeNode<T> | null): boolean {
        return (this.getMinHeight(beginRoot) + 1 >= this.getHeight(beginRoot));
    }

    getNodes(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean) {
        if (!this.root) return [] as null[];
        propertyName = propertyName ?? 'id';

        const result: (BinaryTreeNode<T> | null | undefined)[] = [];

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BinaryTreeNode<T>) => {
                if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return;
                if (!cur.left && !cur.right) return;
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            }

            _traverse(this.root);
        } else {
            const queue: BinaryTreeNode<T>[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return result;
                    cur.left && queue.push(cur.left);
                    cur.right && queue.push(cur.right);
                }
            }
        }

        return result;
    }

    has(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName): boolean {
        return this.getNodes(nodeProperty, propertyName).length > 0;
    }

    get(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName): BinaryTreeNode<T> | null {
        propertyName = propertyName ?? 'id';
        return this.getNodes(nodeProperty, propertyName, true)[0] ?? null;
    }

    getPathToRoot(node: BinaryTreeNode<T>): BinaryTreeNode<T>[] {
        const result: BinaryTreeNode<T>[] = [];
        while (node.parent) {
            result.unshift(node);
            node = node.parent;
        }
        result.unshift(node);
        return result;
    }

    protected _pushByPropertyNameStopOrNot(cur: BinaryTreeNode<T>, result: (BinaryTreeNode<T> | null | undefined)[], nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean) {
        switch (propertyName) {
            case 'id':
                if (cur.id === nodeProperty) {
                    result.push(cur);
                    return !!onlyOne;
                }
                break;
            case 'count':
                if (cur.count === nodeProperty) {
                    result.push(cur);
                    return !!onlyOne;
                }
                break;
            case 'val':
                if (cur.val === nodeProperty) {
                    result.push(cur);
                    return !!onlyOne;
                }
                break;
            default:
                if (cur.id === nodeProperty) {
                    result.push(cur);
                    return !!onlyOne;
                }
                break;
        }
    }

    protected _accumulatedByPropertyName(node: BinaryTreeNode<T>, nodeOrPropertyName ?: NodeOrPropertyName) {
        nodeOrPropertyName = nodeOrPropertyName ?? 'id';

        switch (nodeOrPropertyName) {
            case 'id':
                this._visitedId.push(node.id);
                break;
            case 'val':
                this._visitedVal.push(node.val);
                break;
            case 'node':
                this._visitedNode.push(node);
                break;
            case 'count':
                this._visitedCount.push(node.count);
                break;
            default:
                this._visitedId.push(node.id);
                break;
        }
    }

    protected _getResultByPropertyName(nodeOrPropertyName ?: NodeOrPropertyName): ResultsByProperty<T> {
        nodeOrPropertyName = nodeOrPropertyName ?? 'id';

        switch (nodeOrPropertyName) {
            case 'id':
                return this._visitedId;
            case 'val':
                return this._visitedVal;
            case 'node':
                return this._visitedNode;
            case 'count':
                return this._visitedCount;
            default:
                return this._visitedId;
        }
    }

    getLeftMost(): BinaryTreeNode<T> | null;
    getLeftMost(node: BinaryTreeNode<T>): BinaryTreeNode<T>;
    getLeftMost(node?: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
        node = node ?? this.root;
        if (!node) return node;

        if (this._loopType === LoopType.recursive) {

            const _traverse = (cur: BinaryTreeNode<T>): BinaryTreeNode<T> => {
                if (!cur.left) return cur;
                return _traverse(cur.left);
            }

            return _traverse(node);
        } else {
            // Indirect implementation of iteration using tail recursion optimization
            const _traverse = trampoline((cur: BinaryTreeNode<T>): ThunkOrValue<BinaryTreeNode<T> | null> => {
                if (!cur.left) return cur;
                return _traverse.cont(cur.left);
            });

            return _traverse(node);
        }
    }

    getRightMost(): BinaryTreeNode<T> | null;
    getRightMost(node: BinaryTreeNode<T>): BinaryTreeNode<T>;
    getRightMost(node?: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
        node = node ?? this.root;
        if (!node) return node;

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BinaryTreeNode<T>): BinaryTreeNode<T> => {
                if (!cur.right) return cur;
                return _traverse(cur.right);
            }

            return _traverse(node);
        } else {
            // Indirect implementation of iteration using tail recursion optimization
            const _traverse = trampoline((cur: BinaryTreeNode<T>): ThunkOrValue<BinaryTreeNode<T> | null> => {
                if (!cur.right) return cur;
                return _traverse.cont(cur.right);
            });

            return _traverse(node);
        }
    }

    // --- start additional methods ---
    isBST(node?: BinaryTreeNode<T> | null): boolean {
        node = node ?? this.root;
        if (!node) return true;

        if (this._loopType === LoopType.recursive) {
            const dfs = (cur: BinaryTreeNode<T> | null | undefined, min: BinaryTreeNodeId, max: BinaryTreeNodeId): boolean => {
                if (!cur) return true;
                if (cur.id <= min || cur.id >= max) return false;
                return dfs(cur.left, min, cur.id) && dfs(cur.right, cur.id, max);
            }

            return dfs(node, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        } else {
            const stack = [];
            let prev = Number.MIN_SAFE_INTEGER, curr: BinaryTreeNode<T> | null | undefined = node;
            while (curr || stack.length > 0) {
                while (curr) {
                    stack.push(curr);
                    curr = curr.left;
                }
                curr = stack.pop()!;
                if (prev >= curr.id) return false;
                prev = curr.id;
                curr = curr.right;
            }
            return true;
        }
    }

    getSubTreeSizeAndCount(subTreeRoot: BinaryTreeNode<T> | null | undefined) {
        const res: [number, number] = [0, 0];
        if (!subTreeRoot) return res;

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BinaryTreeNode<T>) => {
                res[0]++;
                res[1] += cur.count;
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            }

            _traverse(subTreeRoot);
            return res;
        } else {
            const stack: BinaryTreeNode<T>[] = [subTreeRoot];

            while (stack.length > 0) {
                const cur = stack.pop()!;
                res[0]++;
                res[1] += cur.count;
                cur.right && stack.push(cur.right);
                cur.left && stack.push(cur.left);
            }

            return res;
        }
    }

    subTreeSum(subTreeRoot: BinaryTreeNode<T>, propertyName ?: BinaryTreeNodePropertyName): number {
        propertyName = propertyName ?? 'val';
        if (!subTreeRoot) return 0;

        let sum = 0;

        const _sumByProperty = (cur: BinaryTreeNode<T>) => {
            let needSum: number;
            switch (propertyName) {
                case 'id':
                    needSum = cur.id;
                    break;
                case 'count':
                    needSum = cur.count;
                    break;
                case 'val':
                    needSum = typeof cur.val === 'number' ? cur.val : 0;
                    break;
                default:
                    needSum = cur.id;
                    break;
            }
            return needSum;
        }

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BinaryTreeNode<T>): void => {
                sum += _sumByProperty(cur);
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            }

            _traverse(subTreeRoot);
        } else {
            const stack: BinaryTreeNode<T>[] = [subTreeRoot];

            while (stack.length > 0) {
                const cur = stack.pop()!;
                sum += _sumByProperty(cur);
                cur.right && stack.push(cur.right);
                cur.left && stack.push(cur.left);
            }
        }

        return sum;
    }

    subTreeAdd(subTreeRoot: BinaryTreeNode<T>, delta: number, propertyName ?: BinaryTreeNodePropertyName): boolean {
        propertyName = propertyName ?? 'id';
        if (!subTreeRoot) return false;

        const _addByProperty = (cur: BinaryTreeNode<T>) => {
            switch (propertyName) {
                case 'id':
                    cur.id += delta;
                    break;
                case 'count':
                    cur.count += delta;
                    this.count += delta;
                    break;
                default:
                    cur.id += delta;
                    break;
            }
        }

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BinaryTreeNode<T>) => {
                _addByProperty(cur);
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            };

            _traverse(subTreeRoot);
        } else {
            const stack: BinaryTreeNode<T>[] = [subTreeRoot];

            while (stack.length > 0) {
                const cur = stack.pop()!;

                _addByProperty(cur);
                cur.right && stack.push(cur.right);
                cur.left && stack.push(cur.left);
            }
        }
        return true;
    }

    BFS(): BinaryTreeNodeId[];
    BFS(nodeOrPropertyName: 'id'): BinaryTreeNodeId[];
    BFS(nodeOrPropertyName: 'val'): T[];
    BFS(nodeOrPropertyName: 'node'): BinaryTreeNode<T>[];
    BFS(nodeOrPropertyName: 'count'): number[];
    BFS(nodeOrPropertyName ?: NodeOrPropertyName): ResultsByProperty<T> {
        nodeOrPropertyName = nodeOrPropertyName ?? 'id';
        this._resetResults();
        const queue: Array<BinaryTreeNode<T> | null | undefined> = [this.root];

        while (queue.length !== 0) {
            const cur = queue.shift();
            if (cur) {
                this._accumulatedByPropertyName(cur, nodeOrPropertyName);
                if (cur?.left !== null) queue.push(cur.left);
                if (cur?.right !== null) queue.push(cur.right);
            }
        }

        return this._getResultByPropertyName(nodeOrPropertyName);
    }

    DFS(): BinaryTreeNodeId[];
    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];
    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): T[];
    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): BinaryTreeNode<T>[];
    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];
    DFS(pattern ?: 'in' | 'pre' | 'post', nodeOrPropertyName ?: NodeOrPropertyName): ResultsByProperty<T> {
        pattern = pattern ?? 'in';
        nodeOrPropertyName = nodeOrPropertyName ?? 'id';
        this._resetResults();
        const _traverse = (node: BinaryTreeNode<T>) => {
            switch (pattern) {
                case 'in':
                    if (node.left) _traverse(node.left);
                    this._accumulatedByPropertyName(node, nodeOrPropertyName);
                    if (node.right) _traverse(node.right);
                    break;
                case 'pre':
                    this._accumulatedByPropertyName(node, nodeOrPropertyName);
                    if (node.left) _traverse(node.left);
                    if (node.right) _traverse(node.right);
                    break;
                case 'post':
                    if (node.left) _traverse(node.left);
                    if (node.right) _traverse(node.right);
                    this._accumulatedByPropertyName(node, nodeOrPropertyName);
                    break;
            }
        };

        this.root && _traverse(this.root);
        return this._getResultByPropertyName(nodeOrPropertyName);
    }

    DFSIterative(): BinaryTreeNodeId[];
    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];
    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): T[];
    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): BinaryTreeNode<T>[];
    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];

    /**
     * Time complexity is O(n)
     * Space complexity of Iterative DFS equals to recursive DFS which is O(n) because of the stack
     * @param pattern
     * @param nodeOrPropertyName
     * @constructor
     */
    DFSIterative(pattern ?: 'in' | 'pre' | 'post', nodeOrPropertyName ?: NodeOrPropertyName): ResultsByProperty<T> {
        pattern = pattern || 'in';
        nodeOrPropertyName = nodeOrPropertyName || 'id';
        this._resetResults();
        if (!this.root) return this._getResultByPropertyName(nodeOrPropertyName);
        // 0: visit, 1: print
        const stack: { opt: 0 | 1, node: BinaryTreeNode<T> | null | undefined }[] = [{opt: 0, node: this.root}];

        while (stack.length > 0) {
            const cur = stack.pop();
            if (!cur || !cur.node) continue;
            if (cur.opt === 1) {
                this._accumulatedByPropertyName(cur.node, nodeOrPropertyName);
            } else {
                switch (pattern) {
                    case 'in':
                        stack.push({opt: 0, node: cur.node.right});
                        stack.push({opt: 1, node: cur.node});
                        stack.push({opt: 0, node: cur.node.left});
                        break;
                    case 'pre':
                        stack.push({opt: 0, node: cur.node.right});
                        stack.push({opt: 0, node: cur.node.left});
                        stack.push({opt: 1, node: cur.node});
                        break;
                    case 'post':
                        stack.push({opt: 1, node: cur.node});
                        stack.push({opt: 0, node: cur.node.right});
                        stack.push({opt: 0, node: cur.node.left});
                        break;
                    default:
                        stack.push({opt: 0, node: cur.node.right});
                        stack.push({opt: 1, node: cur.node});
                        stack.push({opt: 0, node: cur.node.left});
                        break;
                }
            }
        }

        return this._getResultByPropertyName(nodeOrPropertyName);
    }

    levelIterative(node: BinaryTreeNode<T> | null): BinaryTreeNodeId[];
    levelIterative(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];
    levelIterative(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'val'): T[];
    levelIterative(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'node'): BinaryTreeNode<T>[];
    levelIterative(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'count'): number[];
    levelIterative(node: BinaryTreeNode<T> | null, nodeOrPropertyName ?: NodeOrPropertyName): ResultsByProperty<T> {
        nodeOrPropertyName = nodeOrPropertyName || 'id';
        node = node || this.root;
        if (!node) return [];

        this._resetResults();
        const queue: BinaryTreeNode<T>[] = [node];

        while (queue.length > 0) {
            const cur = queue.shift();
            if (cur) {
                this._accumulatedByPropertyName(cur, nodeOrPropertyName);
                if (cur.left) {
                    queue.push(cur.left);
                }
                if (cur.right) {
                    queue.push(cur.right);
                }
            }
        }

        return this._getResultByPropertyName(nodeOrPropertyName);
    }

    listLevels(node: BinaryTreeNode<T> | null): BinaryTreeNodeId[][];
    listLevels(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[][];
    listLevels(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'val'): T[][];
    listLevels(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'node'): BinaryTreeNode<T>[][];
    listLevels(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: 'count'): number[][];
    listLevels(node: BinaryTreeNode<T> | null, nodeOrPropertyName?: NodeOrPropertyName): ResultByProperty<T>[][] {
        nodeOrPropertyName = nodeOrPropertyName || 'id';
        node = node || this.root;
        if (!node) return [];

        const levelsNodes: ResultByProperty<T>[][] = [];

        const collectByProperty = (node: BinaryTreeNode<T>, level: number) => {
            switch (nodeOrPropertyName) {
                case 'id':
                    levelsNodes[level].push(node.id);
                    break;
                case 'val':
                    levelsNodes[level].push(node.val);
                    break;
                case 'node':
                    levelsNodes[level].push(node);
                    break;
                case 'count':
                    levelsNodes[level].push(node.count);
                    break;
                default:
                    levelsNodes[level].push(node.id);
                    break;
            }
        }

        if (this._loopType === LoopType.recursive) {
            const _recursive = (node: BinaryTreeNode<T>, level: number) => {
                if (!levelsNodes[level]) levelsNodes[level] = [];
                collectByProperty(node, level);
                if (node.left) _recursive(node.left, level + 1);
                if (node.right) _recursive(node.right, level + 1);
            };

            _recursive(node, 0);
        } else {
            const stack: [BinaryTreeNode<T>, number][] = [[node, 0]];

            while (stack.length > 0) {
                const head = stack.pop()!;
                const [node, level] = head;

                if (!levelsNodes[level]) levelsNodes[level] = [];
                collectByProperty(node, level);
                if (node.right) stack.push([node.right, level + 1]);
                if (node.left) stack.push([node.left, level + 1]);
            }
        }

        return levelsNodes;
    }

    getPredecessor(node: BinaryTreeNode<T>): BinaryTreeNode<T> {
        if (node.left) {
            let predecessor: BinaryTreeNode<T> | null = node.left;
            while (predecessor.right && predecessor.right !== node) {
                predecessor = predecessor.right;
            }
            return predecessor;
        } else {
            return node;
        }
    }

    morris(): BinaryTreeNodeId[];
    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];
    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): T[];
    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): BinaryTreeNode<T>[];
    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];
    /**
     * The time complexity of Morris traversal is O(n), it's may slower than others
     * The space complexity  Morris traversal is O(1) because no using stack
     * @param pattern
     * @param nodeOrPropertyName
     */
    morris(pattern?: 'in' | 'pre' | 'post', nodeOrPropertyName?: NodeOrPropertyName): ResultsByProperty<T> {
        if (this.root === null) return [];

        pattern = pattern || 'in';
        nodeOrPropertyName = nodeOrPropertyName || 'id';

        this._resetResults();

        let cur: BinaryTreeNode<T> | null | undefined = this.root;
        const _reverseEdge = (node: BinaryTreeNode<T> | null | undefined) => {
            let pre: BinaryTreeNode<T> | null | undefined = null;
            let next: BinaryTreeNode<T> | null | undefined = null;
            while (node) {
                next = node.right;
                node.right = pre;
                pre = node;
                node = next;
            }
            return pre;
        };
        const _printEdge = (node: BinaryTreeNode<T> | null) => {
            const tail: BinaryTreeNode<T> | null | undefined = _reverseEdge(node);
            let cur: BinaryTreeNode<T> | null | undefined = tail;
            while (cur) {
                this._accumulatedByPropertyName(cur, nodeOrPropertyName);
                cur = cur.right;
            }
            _reverseEdge(tail);
        };
        switch (pattern) {
            case 'in':
                while (cur) {
                    if (cur.left) {
                        const predecessor = this.getPredecessor(cur);
                        if (!predecessor.right) {
                            predecessor.right = cur;
                            cur = cur.left;
                            continue;
                        } else {
                            predecessor.right = null;
                        }
                    }
                    this._accumulatedByPropertyName(cur, nodeOrPropertyName);
                    cur = cur.right;
                }
                break;
            case 'pre':
                while (cur) {
                    if (cur.left) {
                        const predecessor = this.getPredecessor(cur);
                        if (!predecessor.right) {
                            predecessor.right = cur;
                            this._accumulatedByPropertyName(cur, nodeOrPropertyName);
                            cur = cur.left;
                            continue;
                        } else {
                            predecessor.right = null;
                        }
                    } else {
                        this._accumulatedByPropertyName(cur, nodeOrPropertyName);
                    }
                    cur = cur.right;
                }
                break;
            case 'post':
                while (cur) {
                    if (cur.left) {
                        const predecessor = this.getPredecessor(cur);
                        if (predecessor.right === null) {
                            predecessor.right = cur;
                            cur = cur.left;
                            continue;
                        } else {
                            predecessor.right = null;
                            _printEdge(cur.left);
                        }
                    }
                    cur = cur.right;
                }
                _printEdge(this.root);
                break;
        }

        return this._getResultByPropertyName(nodeOrPropertyName);
    }

    // --- end additional methods ---
}