/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {BinaryTreeNodeId, BinaryTreeNodePropertyName, BSTComparator, BSTDeletedResult} from '../types';
import {BinaryTree, BinaryTreeNode, FamilyPosition, LoopType,} from './binary-tree';

export enum CP {lt = -1, eq = 0, gt = 1}

export class BSTNode<T> extends BinaryTreeNode<T> {
    override clone(): BSTNode<T> {
        return new BSTNode<T>(this.id, this.val, this.count);
    }
}

export class BST<T> extends BinaryTree<T> {
    /**
     * The constructor function accepts an optional options object and sets the comparator property if provided.
     * @param [options] - An optional object that can contain the following properties:
     */
    constructor(options?: {
        comparator?: BSTComparator,
        loopType?: LoopType
    }) {
        super(options);
        if (options !== undefined) {
            const {comparator} = options;
            if (comparator !== undefined) {
                this._comparator = comparator;
            }
        }
    }

    override createNode(id: BinaryTreeNodeId, val: T | null, count?: number): BSTNode<T> | null {
        return val !== null ? new BSTNode<T>(id, val, count) : null;
    }

    /**
     * The `add` function inserts a new node into a binary search tree, updating the count and value of an existing node if
     * the ID matches, and returns the inserted node.
     * @param {BinaryTreeNodeId} id - The `id` parameter represents the identifier of the binary tree node. It is used to
     * determine the position of the node in the binary search tree.
     * @param {T | null} val - The `val` parameter represents the value to be stored in the binary search tree node. It can
     * be of type `T` (the generic type) or `null`.
     * @param {number} [count=1] - The `count` parameter represents the number of times the value should be inserted into
     * the binary search tree. By default, it is set to 1, meaning that if no count is specified, the value will be
     * inserted once.
     * @returns The method `add` returns a `BSTNode<T>` object or `null`.
     */
    override add(id: BinaryTreeNodeId, val: T | null, count: number = 1): BSTNode<T> | null {
        let inserted: BSTNode<T> | null = null;
        const newNode = this.createNode(id, val, count);
        if (this.root === null) {
            this.root = newNode;
            this.size++;
            this.count += newNode?.count ?? 1;
            inserted = (this.root);
        } else {
            let cur = this.root;
            let traversing = true;
            while (traversing) {
                if (cur !== null && newNode !== null) {
                    if (this._compare(cur.id, id) === CP.eq) {
                        if (newNode) {
                            cur.count += newNode.count;
                            this.count += newNode.count;
                            cur.val = newNode.val;
                        }
                        //Duplicates are not accepted.
                        traversing = false;
                        inserted = cur;
                    } else if (this._compare(cur.id, id) === CP.gt) {
                        // Traverse left of the node
                        if (cur.left === undefined) {
                            if (newNode) {
                                newNode.parent = cur;
                                newNode.familyPosition = FamilyPosition.left;
                            }
                            //Add to the left of the current node
                            cur.left = newNode;
                            this.size++;
                            this.count += newNode.count;
                            traversing = false;
                            inserted = cur.left;
                        } else {
                            //Traverse the left of the current node
                            if (cur.left) cur = cur.left;
                        }
                    } else if (this._compare(cur.id, id) === CP.lt) {
                        // Traverse right of the node
                        if (cur.right === undefined) {
                            if (newNode) {
                                newNode.parent = cur;
                                newNode.familyPosition = FamilyPosition.right;
                            }
                            //Add to the right of the current node
                            cur.right = newNode;
                            this.size++;
                            this.count += newNode.count;
                            traversing = false;
                            inserted = (cur.right);
                        } else {
                            //Traverse the left of the current node
                            if (cur.right) cur = cur.right;
                        }
                    }
                } else {
                    traversing = false;
                }
            }
        }
        return inserted;
    }

    /**
     * The `get` function returns the first node in a binary search tree that matches the given property value or name.
     * @param {BinaryTreeNodeId | T} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or a
     * generic type `T`. It represents the value of the property that you want to search for in the binary search tree.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property name to use for searching the binary search tree nodes. If not provided, it defaults to
     * `'id'`.
     * @returns The method is returning a BSTNode<T> object or null.
     */
    override get(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName): BSTNode<T> | null {
        propertyName = propertyName ?? 'id';
        return this.getNodes(nodeProperty, propertyName, true)[0] ?? null;
    }

    /**
     * The function returns the id of the rightmost node if the comparison between two values is less than, the id of the
     * leftmost node if the comparison is greater than, and the id of the rightmost node otherwise.
     * @returns The function `lastKey()` returns the ID of the rightmost node in a binary tree. If the comparison between
     * the first two elements in the tree is less than, it returns the ID of the rightmost node. If the comparison is
     * greater than, it returns the ID of the leftmost node. Otherwise, it also returns the ID of the rightmost node. If
     * there are no nodes in
     */
    lastKey() {
        if (this._compare(0, 1) === CP.lt) return this.getRightMost()?.id ?? 0;
        else if (this._compare(0, 1) === CP.gt) return this.getLeftMost()?.id ?? 0;
        else return this.getRightMost()?.id ?? 0;
    }

    /**
     * The `remove` function in this TypeScript code removes a node from a binary search tree and returns information about
     * the deleted node and any nodes that need to be balanced.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier of the binary tree node that needs to be removed
     * from the binary search tree.
     * @param {boolean} [ignoreCount] - A boolean flag indicating whether to ignore the count of the node being removed. If
     * set to true, the count of the node will not be considered and the node will be removed regardless of its count. If
     * set to false or not provided, the count of the node will be taken into account and the
     * @returns an array of `BSTDeletedResult<T>` objects.
     */
    override remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BSTDeletedResult<T>[] {
        const bstDeletedResult: BSTDeletedResult<T>[] = [];
        if (!this.root) return bstDeletedResult;

        const curr: BSTNode<T> | null = this.get(id);
        if (!curr) return bstDeletedResult;

        const parent: BSTNode<T> | null = curr?.parent ? curr.parent : null;
        let needBalanced: BSTNode<T> | null = null, orgCurrent = curr;

        if (curr.count > 1 && !ignoreCount) {
            curr.count--;
            this.count--;
        } else {
            if (!curr.left) {
                if (!parent) {
                    if (curr.right !== undefined) this.root = curr.right;
                } else {
                    switch (curr.familyPosition) {
                        case FamilyPosition.left:
                            parent.left = curr.right;
                            break;
                        case FamilyPosition.right:
                            parent.right = curr.right;
                            break;
                    }
                    needBalanced = parent;
                }
            } else {
                const leftSubTreeMax = curr.left ? this.getRightMost(curr.left) : null;
                if (leftSubTreeMax) {
                    const parentOfLeftSubTreeMax = leftSubTreeMax.parent;
                    orgCurrent = curr.swapLocation(leftSubTreeMax);
                    if (parentOfLeftSubTreeMax) {
                        if (parentOfLeftSubTreeMax.right === leftSubTreeMax) parentOfLeftSubTreeMax.right = leftSubTreeMax.left;
                        else parentOfLeftSubTreeMax.left = leftSubTreeMax.left;
                        needBalanced = parentOfLeftSubTreeMax;
                    }
                }
            }
            this.size--;
            this.count -= curr.count;
        }

        bstDeletedResult.push({deleted: orgCurrent, needBalanced});
        return bstDeletedResult;
    }

    /**
     * The function `getNodes` returns an array of binary search tree nodes that match a given property value, with the
     * option to specify the property name and whether to return only one node.
     * @param {BinaryTreeNodeId | T} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or a
     * generic type `T`. It represents the property value that you want to search for in the binary search tree.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property of the nodes to compare with the `nodeProperty` parameter. If not provided, it defaults to
     * `'id'`.
     * @param {boolean} [onlyOne] - A boolean value indicating whether to return only one node that matches the given
     * nodeProperty. If set to true, the function will stop traversing the tree and return the first matching node. If set
     * to false or not provided, the function will return all nodes that match the given nodeProperty.
     * @returns an array of BSTNode<T> objects.
     */
    override getNodes(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean): BSTNode<T>[] {
        propertyName = propertyName ?? 'id';
        if (!this.root) return [];
        const result: BSTNode<T>[] = [];

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BSTNode<T>) => {
                if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return;

                if (!cur.left && !cur.right) return;
                if (propertyName === 'id') {
                    if (this._compare(cur.id, nodeProperty as number) === CP.gt) cur.left && _traverse(cur.left);
                    if (this._compare(cur.id, nodeProperty as number) === CP.lt) cur.right && _traverse(cur.right);
                } else {
                    cur.left && _traverse(cur.left);
                    cur.right && _traverse(cur.right);
                }
            }

            _traverse(this.root);
        } else {
            const queue: BSTNode<T>[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return result;
                    if (propertyName === 'id') {
                        if (this._compare(cur.id, nodeProperty as number) === CP.gt) cur.left && queue.push(cur.left);
                        if (this._compare(cur.id, nodeProperty as number) === CP.lt) cur.right && queue.push(cur.right);
                    } else {
                        cur.left && queue.push(cur.left);
                        cur.right && queue.push(cur.right);
                    }
                }
            }
        }

        return result;
    }

    // --- start additional functions
    /**
     * The `lesserSum` function calculates the sum of a specified property in all nodes with an ID less than a given ID in
     * a binary search tree.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier of the binary tree node for which you want to
     * calculate the lesser sum.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property of the binary tree node to use for calculating the sum. If not provided, it defaults to 'id'.
     * @returns The function `lesserSum` returns a number, which represents the sum of the values of the nodes in the
     * binary search tree that have a property value lesser than the given `id`.
     */
    lesserSum(id: BinaryTreeNodeId, propertyName ?: BinaryTreeNodePropertyName): number {
        propertyName = propertyName ?? 'id';
        if (!this.root) return 0;

        const getSumByPropertyName = (cur: BSTNode<T>) => {
            let needSum: number;
            switch (propertyName) {
                case 'id':
                    needSum = cur.id;
                    break;
                case 'count':
                    needSum = cur.count;
                    break;
                default:
                    needSum = cur.id;
                    break;
            }
            return needSum;
        }

        let sum = 0;

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BSTNode<T>): void => {
                const compared = this._compare(cur.id, id);
                if (compared === CP.eq) {
                    if (cur.right) sum += this.subTreeSum(cur.right, propertyName);
                    return;
                } else if (compared === CP.lt) {
                    if (cur.left) sum += this.subTreeSum(cur.left, propertyName);
                    sum += getSumByPropertyName(cur);
                    if (cur.right) _traverse(cur.right);
                    else return;
                } else {
                    if (cur.left) _traverse(cur.left);
                    else return;
                }
            };

            _traverse(this.root);
        } else {
            const queue: BSTNode<T>[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    const compared = this._compare(cur.id, id);
                    if (compared === CP.eq) {
                        if (cur.right) sum += this.subTreeSum(cur.right, propertyName);
                        return sum;
                    } else if (compared === CP.lt) { // todo maybe a bug
                        if (cur.left) sum += this.subTreeSum(cur.left, propertyName);
                        sum += getSumByPropertyName(cur);
                        if (cur.right) queue.push(cur.right);
                        else return sum;
                    } else {
                        if (cur.left) queue.push(cur.left);
                        else return sum;
                    }
                }
            }
        }

        return sum;
    }

    /**
     * The function `allGreaterNodesAdd` updates the value of a specified property for all nodes in a binary search tree
     * that have a greater value than a given node.
     * @param node - The `node` parameter is of type `BSTNode<T>`, which represents a node in a binary search tree. It
     * contains properties such as `id` and `count`.
     * @param {number} delta - The `delta` parameter is a number that represents the amount by which the property value of
     * each node should be increased.
     * @param {BinaryTreeNodePropertyName} [propertyName] - propertyName is an optional parameter that specifies the
     * property of the BSTNode to be modified. It can be either 'id' or 'count'. If propertyName is not provided, it
     * defaults to 'id'.
     * @returns a boolean value.
     */
    allGreaterNodesAdd(node: BSTNode<T>, delta: number, propertyName ?: BinaryTreeNodePropertyName): boolean {
        propertyName = propertyName ?? 'id';
        if (!this.root) return false;

        const _sumByPropertyName = (cur: BSTNode<T>) => {
            switch (propertyName) {
                case 'id':
                    cur.id += delta;
                    break;
                case 'count':
                    cur.count += delta;
                    break;
                default:
                    cur.id += delta;
                    break;
            }
        }

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BSTNode<T>) => {
                const compared = this._compare(cur.id, node.id);
                _sumByPropertyName(cur);

                if (!cur.left && !cur.right) return;
                if (cur.left && compared === CP.gt) _traverse(cur.left);
                else if (cur.right && compared === CP.gt) _traverse(cur.right);
            };

            _traverse(this.root);
            return true;
        } else {
            const queue: BSTNode<T>[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    const compared = this._compare(cur.id, node.id);
                    _sumByPropertyName(cur);

                    if (cur.left && compared === CP.gt) queue.push(cur.left);
                    else if (cur.right && compared === CP.gt) queue.push(cur.right);
                }
            }
            return true;
        }
    }

    /**
     * The `balance` function takes a sorted array of nodes and builds a balanced binary search tree using either a
     * recursive or iterative approach.
     * @returns The `balance()` function returns a boolean value.
     */
    balance(): boolean {
        const sorted = this.DFS('in', 'node'), n = sorted.length;
        this.clear();

        if (sorted.length < 1) return false;
        if (this._loopType === LoopType.recursive) {
            const buildBalanceBST = (l: number, r: number) => {
                if (l > r) return;
                const m = l + Math.floor((r - l) / 2);
                const midNode = sorted[m];
                this.add(midNode.id, midNode.val, midNode.count);
                buildBalanceBST(l, m - 1);
                buildBalanceBST(m + 1, r);
            };

            buildBalanceBST(0, n - 1);
            return true;
        } else {
            const stack: [[number, number]] = [[0, n - 1]];
            while (stack.length > 0) {
                const popped = stack.pop();
                if (popped) {
                    const [l, r] = popped;
                    if (l <= r) {
                        const m = l + Math.floor((r - l) / 2);
                        const midNode = sorted[m];
                        this.add(midNode.id, midNode.val, midNode.count);
                        stack.push([m + 1, r]);
                        stack.push([l, m - 1]);
                    }
                }
            }
            return true;
        }
    }

    /**
     * The function `isAVLBalanced` checks if a binary search tree is balanced according to the AVL tree property.
     * @returns The function `isAVLBalanced()` returns a boolean value. It returns `true` if the binary search tree (BST)
     * is balanced according to the AVL tree property, and `false` otherwise.
     */
    isAVLBalanced(): boolean {
        if (!this.root) return true;

        let balanced = true;

        if (this._loopType === LoopType.recursive) {
            const _height = (cur: BSTNode<T> | null | undefined): number => {
                if (!cur) return 0;
                const leftHeight = _height(cur.left), rightHeight = _height(cur.right);
                if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
                return Math.max(leftHeight, rightHeight) + 1;
            };
            _height(this.root);
        } else {
            const stack: BSTNode<T>[] = [];
            let node: BSTNode<T> | null | undefined = this.root, last: BSTNode<T> | null = null;
            const depths: Map<BSTNode<T>, number> = new Map();

            while (stack.length > 0 || node) {
                if (node) {
                    stack.push(node);
                    node = node.left;
                } else {
                    node = stack[stack.length - 1]
                    if (!node.right || last === node.right) {
                        node = stack.pop();
                        if (node) {
                            const left = node.left ? depths.get(node.left) ?? -1 : -1;
                            const right = node.right ? depths.get(node.right) ?? -1 : -1;
                            if (Math.abs(left - right) > 1) return false;
                            depths.set(node, 1 + Math.max(left, right));
                            last = node;
                            node = null;
                        }
                    } else node = node.right
                }
            }
        }

        return balanced;
    }

    protected _comparator: BSTComparator = (a, b) => a - b;

    /**
     * The function compares two binary tree node IDs using a comparator function and returns whether the first ID is
     * greater than, less than, or equal to the second ID.
     * @param {BinaryTreeNodeId} a - a is a BinaryTreeNodeId, which represents the identifier of a binary tree node.
     * @param {BinaryTreeNodeId} b - The parameter "b" in the above code refers to a BinaryTreeNodeId.
     * @returns a value of type CP (ComparisonResult). The possible return values are CP.gt (greater than), CP.lt (less
     * than), or CP.eq (equal).
     */
    protected _compare(a: BinaryTreeNodeId, b: BinaryTreeNodeId): CP {
        const compared = this._comparator(a, b);
        if (compared > 0) return CP.gt;
        else if (compared < 0) return CP.lt;
        else return CP.eq;
    }

    // --- end additional functions
}