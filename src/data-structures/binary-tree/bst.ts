/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {BinaryTreeNodeId, BinaryTreeNodePropertyName, BSTComparator, BSTNodeNested, BSTOptions} from '../types';
import {CP, LoopType} from '../types';
import {BinaryTree, BinaryTreeNode} from './binary-tree';
import {IBST, IBSTNode} from '../interfaces';

export class BSTNode<T = any, NEIGHBOR extends BSTNode<T, NEIGHBOR> = BSTNodeNested<T>> extends BinaryTreeNode<T, NEIGHBOR> implements IBSTNode<T, NEIGHBOR> {

}

export class BST<N extends BSTNode<N['val'], N> = BSTNode> extends BinaryTree<N> implements IBST<N> {
    /**
     * The constructor function initializes a binary search tree object with an optional comparator function.
     * @param {BSTOptions} [options] - An optional object that contains configuration options for the binary search tree.
     */
    constructor(options?: BSTOptions) {
        super(options);
        if (options !== undefined) {
            const {comparator} = options;
            if (comparator !== undefined) {
                this._comparator = comparator;
            }
        }
    }

    /**
     * The function creates a new binary search tree node with the given id and value.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier for the binary tree node. It is used to uniquely
     * identify each node in the binary tree.
     * @param [val] - The `val` parameter is an optional value that can be assigned to the node. It represents the value
     * that will be stored in the node.
     * @returns a new instance of the BSTNode class with the specified id and value.
     */
    override createNode(id: BinaryTreeNodeId, val?: N['val']): N {
        return new BSTNode<N['val'], N>(id, val) as N;
    }

    /**
     * The `add` function adds a new node to a binary tree, ensuring that duplicates are not accepted.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier of the binary tree node that we want to add. It
     * is of type `BinaryTreeNodeId`.
     * @param [val] - The `val` parameter is an optional value that can be assigned to the node being added. It represents
     * the value associated with the node.
     * @returns The function `add` returns the inserted node (`inserted`) if it was successfully added to the binary tree.
     * If the node was not added (e.g., due to a duplicate ID), it returns `null` or `undefined`.
     */
    override add(id: BinaryTreeNodeId, val?: N['val']): N | null | undefined {
        let inserted: N | null = null;
        const newNode = this.createNode(id, val);
        if (this.root === null) {
            this._setRoot(newNode);
            this._setSize(this.size + 1);
            inserted = (this.root);
        } else {
            let cur = this.root;
            let traversing = true;
            while (traversing) {
                if (cur !== null && newNode !== null) {
                    if (this._compare(cur.id, id) === CP.eq) {
                        if (newNode) {
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
                            }
                            //Add to the left of the current node
                            cur.left = newNode;
                            this._setSize(this.size + 1);
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
                            }
                            //Add to the right of the current node
                            cur.right = newNode;
                            this._setSize(this.size + 1);
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
     * The function returns the first node in a binary tree that matches the given property name and value.
     * @param {BinaryTreeNodeId | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or a
     * generic type `N`. It represents the property of the binary tree node that you want to search for.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property name to use for searching the binary tree nodes. If not provided, it defaults to `'id'`.
     * @returns The method is returning either a BinaryTreeNodeId or N (generic type) or null.
     */
    override get(nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName): N | null {
        propertyName = propertyName ?? 'id';
        return this.getNodes(nodeProperty, propertyName, true)[0] ?? null;
    }

    /**
     * The function returns the id of the rightmost node if the comparison between two values is less than, the id of the
     * leftmost node if the comparison is greater than, and the id of the rightmost node otherwise.
     * @returns The method `lastKey()` returns the id of the rightmost node in the binary tree if the comparison between
     * the values at index 0 and 1 is less than, otherwise it returns the id of the leftmost node. If the comparison is
     * equal, it returns the id of the rightmost node. If there are no nodes in the tree, it returns 0.
     */
    lastKey(): BinaryTreeNodeId {
        if (this._compare(0, 1) === CP.lt) return this.getRightMost()?.id ?? 0;
        else if (this._compare(0, 1) === CP.gt) return this.getLeftMost()?.id ?? 0;
        else return this.getRightMost()?.id ?? 0;
    }

    /**
     * The function `getNodes` returns an array of nodes in a binary tree that match a given property value.
     * @param {BinaryTreeNodeId | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or an
     * `N` type. It represents the property of the binary tree node that you want to compare with.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property name to use for comparison. If not provided, it defaults to `'id'`.
     * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
     * return only one node that matches the given `nodeProperty` or all nodes that match the `nodeProperty`. If `onlyOne`
     * is set to `true`, the function will return an array with only one node (if
     * @returns an array of nodes (type N).
     */
    override getNodes(nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean): N[] {
        propertyName = propertyName ?? 'id';
        if (!this.root) return [];
        const result: N[] = [];

        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N) => {
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
            const queue: N[] = [this.root];
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
     * The `lesserSum` function calculates the sum of property values in a binary tree for nodes that have a property value
     * less than a given node.
     * @param {N | BinaryTreeNodeId | null} beginNode - The `beginNode` parameter can be one of the following:
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property name to use for calculating the sum. If not provided, it defaults to `'id'`.
     * @returns The function `lesserSum` returns a number, which represents the sum of the values of the nodes in the
     * binary tree that have a lesser value than the specified `beginNode` based on the `propertyName`.
     */
    lesserSum(beginNode: N | BinaryTreeNodeId | null, propertyName ?: BinaryTreeNodePropertyName): number {
        propertyName = propertyName ?? 'id';
        if (typeof beginNode === 'number') beginNode = this.get(beginNode, 'id');
        if (!beginNode) return 0;
        if (!this.root) return 0;
        const id = beginNode.id;
        const getSumByPropertyName = (cur: N) => {
            let needSum: number;
            switch (propertyName) {
                case 'id':
                    needSum = cur.id;
                    break;
                default:
                    needSum = cur.id;
                    break;
            }
            return needSum;
        }

        let sum = 0;

        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N): void => {
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
            const queue: N[] = [this.root];
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
     * The `allGreaterNodesAdd` function adds a delta value to the specified property of all nodes in a binary tree that
     * have a greater value than a given node.
     * @param {N | BinaryTreeNodeId | null} node - The `node` parameter can be either of type `N` (a generic type),
     * `BinaryTreeNodeId`, or `null`. It represents the node in the binary tree to which the delta value will be added.
     * @param {number} delta - The `delta` parameter is a number that represents the amount by which the property value of
     * each greater node should be increased.
     * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
     * specifies the property name of the nodes in the binary tree that you want to update. If not provided, it defaults to
     * 'id'.
     * @returns a boolean value.
     */
    allGreaterNodesAdd(node: N | BinaryTreeNodeId | null, delta: number, propertyName ?: BinaryTreeNodePropertyName): boolean {
        propertyName = propertyName ?? 'id';
        if (typeof node === 'number') node = this.get(node, 'id');
        if (!node) return false;
        const id = node.id;
        if (!this.root) return false;

        const _sumByPropertyName = (cur: N) => {
            switch (propertyName) {
                case 'id':
                    cur.id += delta;
                    break;
                default:
                    cur.id += delta;
                    break;
            }
        }
        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N) => {
                const compared = this._compare(cur.id, id);
                if (compared === CP.gt) _sumByPropertyName(cur);

                if (!cur.left && !cur.right) return;
                if (cur.left && this._compare(cur.left.id, id) === CP.gt) _traverse(cur.left);
                if (cur.right && this._compare(cur.right.id, id) === CP.gt) _traverse(cur.right);
            };

            _traverse(this.root);
            return true;
        } else {
            const queue: N[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    const compared = this._compare(cur.id, id);
                    if (compared === CP.gt) _sumByPropertyName(cur);

                    if (cur.left && this._compare(cur.left.id, id) === CP.gt) queue.push(cur.left);
                    if (cur.right && this._compare(cur.right.id, id) === CP.gt) queue.push(cur.right);
                }
            }
            return true;
        }
    }

    /**
     * Balancing Adjustment:
     * Perfectly Balanced Binary Tree: Since the balance of a perfectly balanced binary tree is already fixed, no additional balancing adjustment is needed. Any insertion or deletion operation will disrupt the perfect balance, often requiring a complete reconstruction of the tree.
     * AVL Tree: After insertion or deletion operations, an AVL tree performs rotation adjustments based on the balance factor of nodes to restore the tree's balance. These rotations can be left rotations, right rotations, left-right rotations, or right-left rotations, performed as needed.
     *
     * Use Cases and Efficiency:
     * Perfectly Balanced Binary Tree: Perfectly balanced binary trees are typically used in specific scenarios such as complete binary heaps in heap sort or certain types of Huffman trees. However, they are not suitable for dynamic operations requiring frequent insertions and deletions, as these operations often necessitate full tree reconstruction.
     * AVL Tree: AVL trees are well-suited for scenarios involving frequent searching, insertion, and deletion operations. Through rotation adjustments, AVL trees maintain their balance, ensuring average and worst-case time complexity of O(log n).
     */


    /**
     * The `perfectlyBalance` function takes a binary tree, performs a depth-first search to sort the nodes, and then
     * constructs a balanced binary search tree using either a recursive or iterative approach.
     * @returns The function `perfectlyBalance()` returns a boolean value.
     */
    perfectlyBalance(): boolean {
        const sorted = this.DFS('in', 'node'), n = sorted.length;
        this.clear();

        if (sorted.length < 1) return false;
        if (this.loopType === LoopType.RECURSIVE) {
            const buildBalanceBST = (l: number, r: number) => {
                if (l > r) return;
                const m = l + Math.floor((r - l) / 2);
                const midNode = sorted[m];
                this.add(midNode.id, midNode.val);
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
                        this.add(midNode.id, midNode.val);
                        stack.push([m + 1, r]);
                        stack.push([l, m - 1]);
                    }
                }
            }
            return true;
        }
    }

    /**
     * The function `isAVLBalanced` checks if a binary tree is balanced according to the AVL tree property.
     * @returns a boolean value.
     */
    isAVLBalanced(): boolean {
        if (!this.root) return true;

        let balanced = true;

        if (this.loopType === LoopType.RECURSIVE) {
            const _height = (cur: N | null | undefined): number => {
                if (!cur) return 0;
                const leftHeight = _height(cur.left), rightHeight = _height(cur.right);
                if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
                return Math.max(leftHeight, rightHeight) + 1;
            };
            _height(this.root);
        } else {
            const stack: N[] = [];
            let node: N | null | undefined = this.root, last: N | null = null;
            const depths: Map<N, number> = new Map();

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