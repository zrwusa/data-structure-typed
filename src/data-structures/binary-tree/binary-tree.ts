/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import {trampoline} from '../../utils';
import type {
    BinaryTreeDeleted,
    BinaryTreeNodeId,
    BinaryTreeNodePropertyName,
    DFSOrderPattern,
    NodeOrPropertyName,
    ResultByProperty,
    ResultsByProperty
} from '../types';

/* This enumeration defines the position of a node within a family tree composed of three associated nodes, where 'root' represents the root node of the family tree, 'left' represents the left child node, and 'right' represents the right child node. */
export enum FamilyPosition {root, left, right}

/**
 * Enum representing different loop types.
 *
 * - `iterative`: Indicates the iterative loop type (with loops that use iterations).
 * - `recursive`: Indicates the recursive loop type (with loops that call themselves).
 */
export enum LoopType { iterative = 1, recursive = 2}

export class BinaryTreeNode<T> {

    constructor(id: BinaryTreeNodeId, val: T, count?: number) {
        this._id = id;
        this._val = val;
        this._count = count ?? 1;
    }

    private _id: BinaryTreeNodeId;

    get id(): BinaryTreeNodeId {
        return this._id;
    }

    set id(v: BinaryTreeNodeId) {
        this._id = v;
    }

    private _val: T;
    get val(): T {
        return this._val;
    }

    set val(v: T) {
        this._val = v;
    }

    private _left?: BinaryTreeNode<T> | null;

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

    private _right?: BinaryTreeNode<T> | null;

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

    private _parent: BinaryTreeNode<T> | null | undefined;

    get parent(): BinaryTreeNode<T> | null | undefined {
        return this._parent;
    }

    set parent(v: BinaryTreeNode<T> | null | undefined) {
        this._parent = v;
    }

    private _familyPosition: FamilyPosition = FamilyPosition.root;

    get familyPosition(): FamilyPosition {
        return this._familyPosition;
    }

    set familyPosition(v: FamilyPosition) {
        this._familyPosition = v;
    }

    private _count = 1;

    get count(): number {
        return this._count;
    }

    set count(v: number) {
        this._count = v;
    }

    private _height = 0;

    get height(): number {
        return this._height;
    }

    set height(v: number) {
        this._height = v;
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

    /**
     * The constructor function accepts an optional options object and sets the values of loopType, autoIncrementId, and
     * isDuplicatedVal based on the provided options.
     * @param [options] - An optional object that can contain the following properties:
     */
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

    private _loopType: LoopType = LoopType.iterative;

    get loopType(): LoopType {
        return this._loopType;
    }

    private _visitedId: BinaryTreeNodeId[] = [];
    get visitedId(): BinaryTreeNodeId[] {
        return this._visitedId;
    }

    private _visitedVal: Array<T> = [];

    get visitedVal(): Array<T> {
        return this._visitedVal;
    }

    private _visitedNode: BinaryTreeNode<T>[] = [];

    get visitedNode(): BinaryTreeNode<T>[] {
        return this._visitedNode;
    }

    private _visitedCount: number[] = [];

    get visitedCount(): number[] {
        return this._visitedCount;
    }

    private _visitedLeftSum: number[] = [];

    get visitedLeftSum(): number[] {
        return this._visitedLeftSum;
    }

    private _autoIncrementId: boolean = false;

    get autoIncrementId(): boolean {
        return this._autoIncrementId;
    }

    private _maxId: number = -1;

    get maxId(): number {
        return this._maxId;
    }

    private _isDuplicatedVal: boolean = false;

    get isDuplicatedVal(): boolean {
        return this._isDuplicatedVal;
    }

    private _root: BinaryTreeNode<T> | null = null;

    get root(): BinaryTreeNode<T> | null {
        return this._root;
    }

    private _size = 0;

    get size(): number {
        return this._size;
    }

    private _count = 0;

    get count(): number {
        return this._count;
    }

    /**
     * The function creates a new binary tree node with the given id, value, and count, or returns null if the value is
     * null.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier for the binary tree node. It is of type
     * `BinaryTreeNodeId`, which could be a string or a number, depending on how you want to identify your nodes.
     * @param {T | null} val - The `val` parameter represents the value to be stored in the binary tree node. It can be of
     * any type `T` or `null`.
     * @param {number} [count] - The count parameter is an optional parameter that represents the number of occurrences of
     * the value in the binary tree node. It is of type number.
     * @returns The function `createNode` returns a `BinaryTreeNode<T>` object if the `val` parameter is not null.
     * Otherwise, it returns null.
     */
    createNode(id: BinaryTreeNodeId, val: T | null, count?: number): BinaryTreeNode<T> | null {
        return val !== null ? new BinaryTreeNode(id, val, count) : null;
    }

    /**
     * The clear function resets the state of an object by setting its properties to their initial values.
     */
    clear() {
        this._setRoot(null);
        this._setSize(0);
        this._setCount(0);
        this._setMaxId(-1);
    }

    /**
     * The function checks if the size of an object is equal to zero and returns a boolean value.
     * @returns A boolean value indicating whether the size of the object is 0 or not.
     */
    isEmpty(): boolean {
        return this.size === 0;
    }

    /**
     * The `add` function inserts a new node with a given ID and value into a binary tree, updating the count if the node
     * already exists.
     * @param {BinaryTreeNodeId} id - The id parameter is the identifier of the binary tree node. It is used to uniquely
     * identify each node in the binary tree.
     * @param {T} val - The value to be inserted into the binary tree.
     * @param {number} [count] - The `count` parameter is an optional parameter that specifies the number of times the
     * value should be inserted into the binary tree. If not provided, it defaults to 1.
     * @returns The function `add` returns a `BinaryTreeNode<T>` object if a new node is inserted, or `null` if no new node
     * is inserted, or `undefined` if the insertion fails.
     */
    add(id: BinaryTreeNodeId, val: T, count?: number): BinaryTreeNode<T> | null | undefined {
        count = count ?? 1;

        const _bfs = (root: BinaryTreeNode<T>, newNode: BinaryTreeNode<T> | null): BinaryTreeNode<T> | undefined | null => {
            const queue: Array<BinaryTreeNode<T> | null> = [root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    const inserted = this.addTo(newNode, cur);
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
                    this._setCount(this.count + count);
                    inserted = existNode;
                }
            } else {
                inserted = _bfs(this.root, needInsert);
            }
        } else {
            this._setRoot(val !== null ? new BinaryTreeNode<T>(id, val, count) : null);
            if (needInsert !== null) {
                this._setSize(1);
                this._setCount(count);
            }
            inserted = this.root;
        }
        return inserted;
    }

    /**
     * The function inserts a new node into a binary tree as the left or right child of a given parent node.
     * @param {BinaryTreeNode<T> | null} newNode - The `newNode` parameter is an instance of the `BinaryTreeNode` class or
     * `null`. It represents the node that needs to be inserted into the binary tree.
     * @param parent - The `parent` parameter is a BinaryTreeNode object representing the parent node to which the new node
     * will be inserted as a child.
     * @returns The method returns the newly inserted node, either as the left child or the right child of the parent node.
     */
    addTo(newNode: BinaryTreeNode<T> | null, parent: BinaryTreeNode<T>) {
        if (parent) {
            if (parent.left === undefined) {
                if (newNode) {
                    newNode.parent = parent;
                    newNode.familyPosition = FamilyPosition.left;
                }
                parent.left = newNode;
                if (newNode !== null) {
                    this._setSize(this.size + 1);
                    this._setCount(this.count + newNode?.count ?? 0)
                }

                return parent.left;
            } else if (parent.right === undefined) {
                if (newNode) {
                    newNode.parent = parent;
                    newNode.familyPosition = FamilyPosition.right;
                }
                parent.right = newNode;
                if (newNode !== null) {
                    this._setSize(this.size + 1);
                    this._setCount(this.count + newNode?.count ?? 0);
                }
                return parent.right;
            } else {
                return;
            }
        } else {
            return;
        }
    }

    /**
     * The `addMany` function inserts multiple items into a binary tree and returns an array of the inserted nodes or
     * null/undefined values.
     * @param {T[] | BinaryTreeNode<T>[]} data - The `data` parameter can be either an array of elements of type `T` or an
     * array of `BinaryTreeNode<T>` objects.
     * @returns The function `addMany` returns an array of `BinaryTreeNode<T>`, `null`, or `undefined` values.
     */
    addMany(data: T[] | BinaryTreeNode<T>[]): (BinaryTreeNode<T> | null | undefined)[] {
        const inserted: (BinaryTreeNode<T> | null | undefined)[] = [];
        const map: Map<T | BinaryTreeNode<T>, number> = new Map();

        if (!this._isDuplicatedVal) {
            for (const i of data) map.set(i, (map.get(i) ?? 0) + 1);
        }

        for (const item of data) {
            const count = this._isDuplicatedVal ? 1 : map.get(item);

            if (item instanceof BinaryTreeNode) {
                inserted.push(this.add(item.id, item.val, item.count));
            } else if (typeof item === 'number' && !this._autoIncrementId) {
                if (!this._isDuplicatedVal) {
                    if (map.get(item) !== undefined) {
                        inserted.push(this.add(item, item, count));
                        map.delete(item);
                    }
                } else {
                    inserted.push(this.add(item, item, 1));
                }
            } else {
                if (item !== null) {
                    if (!this._isDuplicatedVal) {
                        if (map.get(item) !== undefined) {
                            inserted.push(this.add(++this._maxId, item, count));
                            map.delete(item);
                        }
                    } else {
                        inserted.push(this.add(++this._maxId, item, 1));
                    }
                } else {
                    inserted.push(this.add(Number.MAX_SAFE_INTEGER, item, 0));
                }
            }
        }
        return inserted;
    }

    /**
     * The `fill` function clears the current data and inserts new data, returning a boolean indicating if the insertion
     * was successful.
     * @param {T[] | BinaryTreeNode<T>[]} data - The `data` parameter can be either an array of elements of type `T` or an
     * array of `BinaryTreeNode<T>` objects.
     * @returns The method is returning a boolean value.
     */
    fill(data: T[] | BinaryTreeNode<T>[]): boolean {
        this.clear();
        return data.length === this.addMany(data).length;
    }

    /**
     * The function removes a node from a binary tree and returns information about the deleted node.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier of the binary tree node that you want to remove.
     * It is of type `BinaryTreeNodeId`.
     * @param {boolean} [ignoreCount] - The `ignoreCount` parameter is an optional boolean parameter that determines
     * whether to ignore the count of the node being removed. If `ignoreCount` is set to `true`, the count of the node will
     * not be decremented and the overall count of the binary tree will not be updated. If `
     * @returns An array of objects is being returned. Each object in the array has two properties: "deleted" and
     * "needBalanced". The "deleted" property contains the deleted node or undefined if no node was deleted. The
     * "needBalanced" property is always null.
     */
    remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeleted<T>[] {
        const nodes = this.getNodes(id, 'id', true);
        let node: BinaryTreeNode<T> | null | undefined = nodes[0];

        if (!node) node = undefined;
        else if (node.count > 1 && !ignoreCount) {
            node.count--;
            this._setCount(this.count - 1);
        } else if (node instanceof BinaryTreeNode) {
            const [subSize, subCount] = this.getSubTreeSizeAndCount(node);

            switch (node.familyPosition) {
                case 0:
                    this._setSize(this.size - subSize);
                    this._setCount(this.count - subCount);
                    node = undefined;
                    break;
                case 1:
                    if (node.parent) {
                        this._setSize(this.size - subSize);
                        this._setCount(this.count - subCount);
                        node.parent.left = null;
                    }
                    break;
                case 2:
                    if (node.parent) {
                        this._setSize(this.size - subSize);
                        this._setCount(this.count - subCount);
                        node.parent.right = null;
                    }
                    break;
            }
        }
        return [{deleted: node, needBalanced: null}];
    }

    /**
     * The function calculates the depth of a binary tree node by traversing its parent nodes.
     * @param node - BinaryTreeNode<T> - This is the node for which we want to calculate the depth. It is a generic type,
     * meaning it can represent any type of data that we want to store in the node.
     * @returns The depth of the given binary tree node.
     */
    getDepth(node: BinaryTreeNode<T>): number {
        let depth = 0;
        while (node.parent) {
            depth++;
            node = node.parent;
        }
        return depth;
    }

    /**
     * The `getHeight` function calculates the maximum height of a binary tree using either a recursive or iterative
     * approach.
     * @param {BinaryTreeNode<T> | null} [beginRoot] - The `beginRoot` parameter is an optional parameter of type
     * `BinaryTreeNode<T> | null`. It represents the starting node from which to calculate the height of the binary tree.
     * If no value is provided for `beginRoot`, the function will use the `root` property of the class instance as
     * @returns the height of the binary tree.
     */
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
            let node: BinaryTreeNode<T> | null | undefined = beginRoot, last: BinaryTreeNode<T> | null = null;
            const depths: Map<BinaryTreeNode<T>, number> = new Map();

            while (stack.length > 0 || node) {
                if (node) {
                    stack.push(node);
                    node = node.left;
                } else {
                    node = stack[stack.length - 1]
                    if (!node.right || last === node.right) {
                        node = stack.pop();
                        if (node) {
                            const leftHeight = node.left ? depths.get(node.left) ?? -1 : -1;
                            const rightHeight = node.right ? depths.get(node.right) ?? -1 : -1;
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

    /**
     * The `getMinHeight` function calculates the minimum height of a binary tree using either a recursive or iterative
     * approach.
     * @param {BinaryTreeNode<T> | null} [beginRoot] - The `beginRoot` parameter is an optional parameter of type
     * `BinaryTreeNode<T> | null`. It represents the starting node from which to calculate the minimum height of the binary
     * tree. If no value is provided for `beginRoot`, the function will use the root node of the binary tree.
     * @returns The function `getMinHeight` returns the minimum height of the binary tree.
     */
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
            let node: BinaryTreeNode<T> | null | undefined = beginRoot, last: BinaryTreeNode<T> | null = null;
            const depths: Map<BinaryTreeNode<T>, number> = new Map();

            while (stack.length > 0 || node) {
                if (node) {
                    stack.push(node);
                    node = node.left;
                } else {
                    node = stack[stack.length - 1]
                    if (!node.right || last === node.right) {
                        node = stack.pop();
                        if (node) {
                            const leftMinHeight = node.left ? depths.get(node.left) ?? -1 : -1;
                            const rightMinHeight = node.right ? depths.get(node.right) ?? -1 : -1;
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

    /**
     * The function checks if a binary tree is balanced by comparing the minimum height and the maximum height of the tree.
     * @param {BinaryTreeNode<T> | null} [beginRoot] - The `beginRoot` parameter is the root node of a binary tree. It is
     * of type `BinaryTreeNode<T> | null`, which means it can either be a `BinaryTreeNode` object or `null`.
     * @returns The method is returning a boolean value.
     */
    isBalanced(beginRoot?: BinaryTreeNode<T> | null): boolean {
        return (this.getMinHeight(beginRoot) + 1 >= this.getHeight(beginRoot));
    }

    /**
     * The function `getNodes` returns an array of binary tree nodes that match a given property value, with options for
     * searching recursively or iteratively.
     * @param {BinaryTreeNodeId | T} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or a
     * generic type `T`. It represents the property of the binary tree node that you want to search for.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property name to use when searching for nodes. If not provided, it defaults to 'id'.
     * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
     * return only one node that matches the `nodeProperty` or `propertyName` criteria. If `onlyOne` is set to `true`, the
     * function will stop traversing the tree and return the first matching node. If `
     * @returns The function `getNodes` returns an array of `BinaryTreeNode<T> | null | undefined` objects.
     */
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

    /**
     * The function checks if a binary tree node has a specific property or if any node in the tree has a specific
     * property.
     * @param {BinaryTreeNodeId | T} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or a
     * generic type `T`. It represents the property of a binary tree node that you want to check.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the name of the property to check for in the nodes.
     * @returns a boolean value.
     */
    has(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName): boolean {
        return this.getNodes(nodeProperty, propertyName).length > 0;
    }

    /**
     * The function returns the first binary tree node that matches the given property name and value, or null if no match
     * is found.
     * @param {BinaryTreeNodeId | T} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or a
     * generic type `T`. It represents the property of the binary tree node that you want to search for.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property of the binary tree node to search for. If not provided, it defaults to `'id'`.
     * @returns a BinaryTreeNode object or null.
     */
    get(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName): BinaryTreeNode<T> | null {
        propertyName = propertyName ?? 'id';
        return this.getNodes(nodeProperty, propertyName, true)[0] ?? null;
    }

    /**
     * The function getPathToRoot returns an array of BinaryTreeNode objects representing the path from a given node to the
     * root of a binary tree.
     * @param node - The `node` parameter is a BinaryTreeNode object.
     * @returns The function `getPathToRoot` returns an array of `BinaryTreeNode<T>` objects, representing the path from
     * the given `node` to the root of the binary tree.
     */
    getPathToRoot(node: BinaryTreeNode<T>): BinaryTreeNode<T>[] {
        const result: BinaryTreeNode<T>[] = [];
        while (node.parent) {
            result.unshift(node);
            node = node.parent;
        }
        result.unshift(node);
        return result;
    }

    getLeftMost(): BinaryTreeNode<T> | null;

    getLeftMost(node: BinaryTreeNode<T>): BinaryTreeNode<T>;

    /**
     * The `getLeftMost` function returns the leftmost node in a binary tree, either recursively or iteratively using tail
     * recursion optimization.
     * @param {BinaryTreeNode<T> | null} [node] - The `node` parameter is an optional parameter of type `BinaryTreeNode<T>
     * | null`. It represents the starting node from which to find the leftmost node in a binary tree. If no node is
     * provided, the function will use the root node of the binary tree.
     * @returns The `getLeftMost` function returns the leftmost node in a binary tree.
     */
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
            const _traverse = trampoline((cur: BinaryTreeNode<T>) => {
                if (!cur.left) return cur;
                return _traverse.cont(cur.left);
            });

            return _traverse(node);
        }
    }

    getRightMost(): BinaryTreeNode<T> | null;

    getRightMost(node: BinaryTreeNode<T>): BinaryTreeNode<T>;

    /**
     * The `getRightMost` function returns the rightmost node in a binary tree, either recursively or iteratively using
     * tail recursion optimization.
     * @param {BinaryTreeNode<T> | null} [node] - The `node` parameter is an optional parameter of type `BinaryTreeNode<T>
     * | null`. It represents the starting node from which to find the rightmost node in a binary tree. If no node is
     * provided, the function will use the root node of the binary tree.
     * @returns The `getRightMost` function returns the rightmost node in a binary tree.
     */
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
            const _traverse = trampoline((cur: BinaryTreeNode<T>) => {
                if (!cur.right) return cur;
                return _traverse.cont(cur.right);
            });

            return _traverse(node);
        }
    }

    /**
     * The `isBST` function checks if a binary tree is a binary search tree.
     * @param {BinaryTreeNode<T> | null} [node] - The `node` parameter is an optional parameter of type `BinaryTreeNode<T>
     * | null`. It represents the root node of the binary search tree (BST) that we want to check for validity. If no node
     * is provided, the function will default to using the root node of the BST instance that
     * @returns The `isBST` function returns a boolean value. It returns `true` if the binary tree is a valid binary search
     * tree, and `false` otherwise.
     */
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
                if (!(curr) || prev >= curr.id) return false;
                prev = curr.id;
                curr = curr.right;
            }
            return true;
        }
    }

    /**
     * The function calculates the size and count of a subtree in a binary tree using either recursive or iterative
     * traversal.
     * @param {BinaryTreeNode<T> | null | undefined} subTreeRoot - The `subTreeRoot` parameter is the root node of a binary
     * tree.
     * @returns The function `getSubTreeSizeAndCount` returns an array `[number, number]`. The first element of the array
     * represents the size of the subtree, and the second element represents the count of the nodes in the subtree.
     */
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

    // --- start additional methods ---

    /**
     * The function `subTreeSum` calculates the sum of a specified property in a binary tree, either recursively or
     * iteratively.
     * @param subTreeRoot - The subTreeRoot parameter is the root node of the subtree for which you want to calculate the
     * sum.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property of the `BinaryTreeNode` object to use for calculating the sum. If `propertyName` is not
     * provided, it defaults to `'val'`.
     * @returns a number, which is the sum of the values of the nodes in the subtree rooted at `subTreeRoot`.
     */
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

    /**
     * The function `subTreeAdd` adds a specified delta value to a property of each node in a binary tree.
     * @param subTreeRoot - The `subTreeRoot` parameter is the root node of the subtree where the values will be modified.
     * @param {number} delta - The `delta` parameter is a number that represents the amount by which the property value of
     * each node in the subtree should be increased or decreased.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property of the `BinaryTreeNode` that should be modified. It defaults to `'id'` if not provided.
     * @returns a boolean value, which is `true`.
     */
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
                    this._setCount(this.count + delta);
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

    /**
     * The BFS function performs a breadth-first search on a binary tree and returns the results based on a specified node
     * or property name.
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The parameter `nodeOrPropertyName` is an optional parameter that
     * represents either a node or a property name. If a node is provided, the breadth-first search algorithm will be
     * performed starting from that node. If a property name is provided, the breadth-first search algorithm will be
     * performed starting from the root node
     * @returns an object of type `ResultsByProperty<T>`.
     */
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

    /**
     * The DFS function performs a depth-first search traversal on a binary tree and returns the results based on the
     * specified pattern and node or property name.
     * @param {'in' | 'pre' | 'post'} [pattern] - The "pattern" parameter is used to specify the order in which the nodes
     * of a binary tree are traversed during the Depth-First Search (DFS) algorithm. It can take one of three values: 'in',
     * 'pre', or 'post'.
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is a string that represents
     * either the name of a property in the `BinaryTreeNode` object or the value of the `id` property in the
     * `BinaryTreeNode` object. This parameter is used to accumulate the results based on the specified property name. If
     * no value
     * @returns an object of type `ResultsByProperty<T>`.
     */
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

    /**
     * The `levelIterative` function performs a level-order traversal on a binary tree and returns the values of the nodes
     * in an array, based on a specified property name.
     * @param {BinaryTreeNode<T> | null} node - The `node` parameter is a BinaryTreeNode object representing the starting
     * node for the level order traversal. It can be null if no specific node is provided, in which case the root node of
     * the tree is used as the starting node.
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is an optional parameter that
     * can be either a `BinaryTreeNode` property name or the string `'id'`. If a property name is provided, the function
     * will accumulate results based on that property. If no property name is provided, the function will default to
     * accumulating results
     * @returns The function `levelIterative` returns an object of type `ResultsByProperty<T>`.
     */
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

    /**
     * The `listLevels` function collects nodes from a binary tree by a specified property and organizes them into levels.
     * @param {BinaryTreeNode<T> | null} node - The `node` parameter is a BinaryTreeNode object or null. It represents the
     * root node of a binary tree. If it is null, the function will use the root node of the current binary tree instance.
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is an optional parameter that
     * specifies the property of the `BinaryTreeNode` object to collect at each level. It can be one of the following
     * values:
     * @returns The function `listLevels` returns a 2D array of `ResultByProperty<T>` objects.
     */
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

    /**
     * The function returns the predecessor of a given node in a binary tree.
     * @param node - The parameter `node` is a BinaryTreeNode object, representing a node in a binary tree.
     * @returns the predecessor of the given node in a binary tree.
     */
    getPredecessor(node: BinaryTreeNode<T>): BinaryTreeNode<T> {
        if (node.left) {
            let predecessor: BinaryTreeNode<T> | null | undefined = node.left;
            while (!(predecessor) || predecessor.right && predecessor.right !== node) {
                if (predecessor) {
                    predecessor = predecessor.right;
                }
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
     * The `morris` function performs an in-order, pre-order, or post-order traversal on a binary tree using the Morris
     * traversal algorithm and returns the results based on the specified property name.
     * The time complexity of Morris traversal is O(n), it's may slower than others
     * The space complexity  Morris traversal is O(1) because no using stack
     * @param {'in' | 'pre' | 'post'} [pattern] - The `pattern` parameter is an optional parameter that determines the
     * traversal pattern of the binary tree. It can have one of three values:
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is used to specify the
     * property of the nodes that you want to retrieve in the results. It can be either the node itself or the name of the
     * property. If not provided, it defaults to `'id'`.
     * @returns The function `morris` returns an object of type `ResultsByProperty<T>`.
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

    protected _setLoopType(value: LoopType) {
        this._loopType = value;
    }

    protected _setVisitedId(value: BinaryTreeNodeId[]) {
        this._visitedId = value;
    }

    protected _setVisitedVal(value: Array<T>) {
        this._visitedVal = value;
    }

    protected _setVisitedNode(value: BinaryTreeNode<T>[]) {
        this._visitedNode = value;
    }

    protected setVisitedCount(value: number[]) {
        this._visitedCount = value;
    }

    protected _setVisitedLeftSum(value: number[]) {
        this._visitedLeftSum = value;
    }

    protected _setAutoIncrementId(value: boolean) {
        this._autoIncrementId = value;
    }

    protected _setMaxId(value: number) {
        this._maxId = value;
    }

    protected _setIsDuplicatedVal(value: boolean) {
        this._isDuplicatedVal = value;
    }

    protected _setRoot(v: BinaryTreeNode<T> | null) {
        if (v) {
            v.parent = null;
            v.familyPosition = FamilyPosition.root;
        }
        this._root = v;
    }

    protected _setSize(v: number) {
        this._size = v;
    }

    protected _setCount(v: number) {
        this._count = v;
    }

    /**
     * The function resets the values of several arrays used for tracking visited nodes and their properties.
     */
    protected _resetResults() {
        this._visitedId = [];
        this._visitedVal = [];
        this._visitedNode = [];
        this._visitedCount = [];
        this._visitedLeftSum = [];
    }

    /**
     * The function checks if a given property of a binary tree node matches a specified value, and if so, adds the node to
     * a result array.
     * @param cur - The current binary tree node that is being checked.
     * @param {(BinaryTreeNode<T> | null | undefined)[]} result - An array that stores the matching nodes found during the
     * traversal.
     * @param {BinaryTreeNodeId | T} nodeProperty - The `nodeProperty` parameter is the value that we are searching for in
     * the binary tree nodes. It can be either the `id`, `count`, or `val` property of the node.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property of the `BinaryTreeNode` object that you want to compare with the `nodeProperty` value. It can
     * be one of the following values: 'id', 'count', or 'val'. If no `propertyName` is provided,
     * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
     * stop after finding the first matching node or continue searching for all matching nodes. If `onlyOne` is set to
     * `true`, the function will stop after finding the first matching node and return `true`. If `onlyOne
     * @returns a boolean value indicating whether or not a node was pushed into the result array.
     */
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

    /**
     * The function `_accumulatedByPropertyName` pushes a property value of a binary tree node into an array based on the
     * provided property name or a default property name.
     * @param node - The `node` parameter is of type `BinaryTreeNode<T>`, which represents a node in a binary tree.
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The parameter `nodeOrPropertyName` is an optional parameter that
     * can be either a string representing a property name or a reference to a node object. If it is a string, it specifies
     * the property name of the node that should be accumulated. If it is a node object, it specifies the node itself
     */
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

    /**
     * The function `_getResultByPropertyName` returns different results based on the provided property name or defaulting
     * to 'id'.
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The parameter `nodeOrPropertyName` is an optional parameter that
     * can accept a value of type `NodeOrPropertyName`.
     * @returns The method returns an object of type `ResultsByProperty<T>`.
     */
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

    // --- end additional methods ---
}