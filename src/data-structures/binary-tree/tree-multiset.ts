/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {BinaryTreeNodeId, TreeMultisetNodeNested, TreeMultisetOptions} from '../types';
import {BinaryTreeDeletedResult, CP, DFSOrderPattern, FamilyPosition, LoopType, NodeOrPropertyName} from '../types';
import {ITreeMultiset, ITreeMultisetNode} from '../interfaces';
import {AVLTree, AVLTreeNode} from './avl-tree';
import {ObjectWithNumberId} from '../../utils';

export class TreeMultisetNode<T = any, NEIGHBOR extends TreeMultisetNode<T, NEIGHBOR> = TreeMultisetNodeNested<T>> extends AVLTreeNode<T, NEIGHBOR> implements ITreeMultisetNode<T, NEIGHBOR> {

    /**
     * The constructor function initializes a BinaryTreeNode object with an id, value, and count.
     * @param {BinaryTreeNodeId} id - The `id` parameter is of type `BinaryTreeNodeId` and represents the unique identifier
     * of the binary tree node.
     * @param {T} [val] - The `val` parameter is an optional parameter of type `T`. It represents the value of the binary
     * tree node. If no value is provided, it will be `undefined`.
     * @param {number} [count=1] - The `count` parameter is a number that represents the number of times a particular value
     * occurs in a binary tree node. It has a default value of 1, which means that if no value is provided for the `count`
     * parameter when creating a new instance of the `BinaryTreeNode` class,
     */
    constructor(id: BinaryTreeNodeId, val?: T, count: number = 1) {
        super(id, val);
        this._count = count;
    }

    private _count = 1;

    get count(): number {
        return this._count;
    }

    set count(v: number) {
        this._count = v;
    }
}

/**
 * The only distinction between a TreeMultiset and a AVLTree lies in the ability of the former to store duplicate nodes through the utilization of counters.
 */
export class TreeMultiset<N extends TreeMultisetNode<N['val'], N> = TreeMultisetNode> extends AVLTree<N> implements ITreeMultiset<N> {

    /**
     * The constructor function for a TreeMultiset class in TypeScript, which extends another class and sets an option to
     * merge duplicated values.
     * @param {TreeMultisetOptions} [options] - An optional object that contains additional configuration options for the
     * TreeMultiset.
     */
    constructor(options?: TreeMultisetOptions) {
        super({...options, isMergeDuplicatedVal: true});
    }

    private _count = 0;

    get count(): number {
        return this._count;
    }

    /**
     * The function creates a new BSTNode with the given id, value, and count.
     * @param {BinaryTreeNodeId} id - The id parameter is the unique identifier for the binary tree node. It is used to
     * distinguish one node from another in the tree.
     * @param {N} val - The `val` parameter represents the value that will be stored in the binary search tree node.
     * @param {number} [count] - The "count" parameter is an optional parameter of type number. It represents the number of
     * occurrences of the value in the binary search tree node. If not provided, the count will default to 1.
     * @returns A new instance of the BSTNode class with the specified id, value, and count (if provided).
     */
    override createNode(id: BinaryTreeNodeId, val?: N['val'], count?: number): N {
        return new TreeMultisetNode(id, val, count) as N;
    }

    /**
     * The function swaps the location of two nodes in a tree data structure.
     * @param {N} srcNode - The source node that we want to swap with the destination node.
     * @param {N} destNode - The `destNode` parameter represents the destination node where the values from `srcNode` will
     * be swapped with.
     * @returns the `destNode` after swapping its values with the `srcNode`.
     */
    override swapLocation(srcNode: N, destNode: N): N {
        const {val, count, height, id} = destNode;
        const tempNode = this.createNode(id, val, count);
        if (tempNode) {
            tempNode.height = height;

            if (tempNode instanceof TreeMultisetNode) {
                destNode.id = srcNode.id;
                destNode.val = srcNode.val;
                destNode.count = srcNode.count;
                destNode.height = srcNode.height;

                srcNode.id = tempNode.id;
                srcNode.val = tempNode.val;
                srcNode.count = tempNode.count;
                srcNode.height = tempNode.height;
            }
        }

        return destNode;
    }

    /**
     * The `add` function adds a new node to a binary tree, updating the size and count properties accordingly, and
     * balancing the tree if necessary.
     * @param {BinaryTreeNodeId} id - The id parameter represents the identifier of the binary tree node that we want to
     * add. It is of type BinaryTreeNodeId.
     * @param [val] - The `val` parameter is an optional value that can be assigned to the node being added. If no value is
     * provided, it will default to `undefined`.
     * @param {number} [count] - The `count` parameter is an optional parameter that specifies the number of times the node
     * with the given `id` should be added to the binary tree. If the `count` parameter is not provided, it defaults to 1.
     * @returns The `add` method returns the inserted node (`N`), `null`, or `undefined`.
     */
    override add(id: BinaryTreeNodeId, val?: N['val'], count?: number): N | null | undefined {
        count = count ?? 1;
        let inserted: N | null = null;
        const newNode = this.createNode(id, val, count);
        if (this.root === null) {
            this._setRoot(newNode);
            this._setSize(this.size + 1);
            this._setCount(this.count + count);
            inserted = (this.root);
        } else {
            let cur = this.root;
            let traversing = true;
            while (traversing) {
                if (cur !== null && newNode !== null) {
                    if (this._compare(cur.id, id) === CP.eq) {
                        if (newNode) {
                            cur.val = newNode.val;
                            cur.count += count;
                            this._setCount(this.count + newNode.count);
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
                            this._setCount(this.count + newNode.count);

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
                            this._setCount(this.count + newNode.count);

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
        if (inserted) this.balancePath(inserted);
        return inserted;
    }

    /**
     * The function adds a new node to a binary tree as the left or right child of a given parent node.
     * @param {N | null} newNode - The `newNode` parameter represents the node that you want to add to the tree. It can be
     * either a node object (`N`) or `null`.
     * @param {N} parent - The `parent` parameter represents the parent node to which the new node will be added as a
     * child.
     * @returns either the left or right child node that was added to the parent node. It can also return `null` or
     * `undefined` in certain cases.
     */
    override addTo(newNode: N | null, parent: N): N | null | undefined {
        if (parent) {
            if (parent.left === undefined) {
                if (newNode) {
                    newNode.parent = parent;
                }
                parent.left = newNode;
                if (newNode !== null) {
                    this._setSize(this.size + 1);
                    this._setCount(this.count + newNode.count ?? 0)
                }

                return parent.left;
            } else if (parent.right === undefined) {
                if (newNode) {
                    newNode.parent = parent;
                }
                parent.right = newNode;
                if (newNode !== null) {
                    this._setSize(this.size + 1);
                    this._setCount(this.count + newNode.count ?? 0);
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
     * @param {N[] | N[]} data - The `data` parameter can be either an array of elements of type `N` or an
     * array of `N` objects.
     * @returns The function `addMany` returns an array of `N`, `null`, or `undefined` values.
     */
    override addMany(data: N[] | Array<N['val']>): (N | null | undefined)[] {
        // TODO not sure addMany not be run multi times
        const inserted: (N | null | undefined)[] = [];
        const map: Map<N | N['val'], number> = new Map();

        if (this.isMergeDuplicatedVal) {
            for (const nodeOrId of data) map.set(nodeOrId, (map.get(nodeOrId) ?? 0) + 1);
        }

        for (const nodeOrId of data) {

            if (nodeOrId instanceof TreeMultisetNode) {
                inserted.push(this.add(nodeOrId.id, nodeOrId.val, nodeOrId.count));
                continue;
            }

            if (nodeOrId === null) {
                inserted.push(this.add(NaN, null, 0));
                continue;
            }

            // TODO will this cause an issue?
            const count = this.isMergeDuplicatedVal ? map.get(nodeOrId) : 1;
            let newId: BinaryTreeNodeId;
            if (typeof nodeOrId === 'number') {
                newId = this.autoIncrementId ? this.maxId + 1 : nodeOrId;
            } else if (nodeOrId instanceof Object) {
                if (this.autoIncrementId) {
                    newId = this.maxId + 1;
                } else {
                    if (Object.keys(nodeOrId).includes('id')) {
                        newId = (nodeOrId as ObjectWithNumberId).id;
                    } else {
                        console.warn(nodeOrId, 'Object value must has an id property when the autoIncrementId is false');
                        continue;
                    }
                }
            } else {
                console.warn(nodeOrId, ` is not added`);
                continue;
            }

            if (this.isMergeDuplicatedVal) {
                if (map.has(nodeOrId)) {
                    inserted.push(this.add(newId, nodeOrId, count));
                    map.delete(nodeOrId);
                }
            } else {
                inserted.push(this.add(newId, nodeOrId, 1));
            }

            this._setMaxId(newId);
        }
        return inserted;
    }

    /**
     * The `remove` function removes a node from a binary search tree and returns the deleted node along with the parent
     * node that needs to be balanced.
     * @param {N | BinaryTreeNodeId | null} nodeOrId - The `nodeOrId` parameter can be one of the following:
     * @param {boolean} [ignoreCount] - The `ignoreCount` parameter is an optional boolean parameter that determines
     * whether to ignore the count of the node being removed. If `ignoreCount` is set to `true`, the count of the node will
     * not be taken into account when removing it. If `ignoreCount` is set to `false
     * @returns The function `remove` returns an array of `BinaryTreeDeletedResult<N>` objects.
     */
    override remove(nodeOrId: N | BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeletedResult<N>[] {
        const bstDeletedResult: BinaryTreeDeletedResult<N>[] = [];
        if (!this.root) return bstDeletedResult;

        const curr: N | null = (typeof nodeOrId === 'number') ? this.get(nodeOrId) : nodeOrId;
        if (!curr) return bstDeletedResult;

        const parent: N | null = curr?.parent ? curr.parent : null;
        let needBalanced: N | null = null, orgCurrent = curr;

        if (curr.count > 1 && !ignoreCount) {
            curr.count--;
            this._setCount(this.count - 1);
        } else {
            if (!curr.left) {
                if (!parent) {
                    if (curr.right !== undefined) this._setRoot(curr.right);
                } else {
                    const {familyPosition: fp} = curr;
                    if (fp === FamilyPosition.LEFT || fp === FamilyPosition.ROOT_LEFT) {
                        parent.left = curr.right;
                    } else if (fp === FamilyPosition.RIGHT || fp === FamilyPosition.ROOT_RIGHT) {
                        parent.right = curr.right;
                    }
                    needBalanced = parent;
                }
            } else {
                const leftSubTreeRightMost = curr.left ? this.getRightMost(curr.left) : null;
                if (leftSubTreeRightMost) {
                    const parentOfLeftSubTreeMax = leftSubTreeRightMost.parent;
                    orgCurrent = this.swapLocation(curr, leftSubTreeRightMost);
                    if (parentOfLeftSubTreeMax) {
                        if (parentOfLeftSubTreeMax.right === leftSubTreeRightMost) parentOfLeftSubTreeMax.right = leftSubTreeRightMost.left;
                        else parentOfLeftSubTreeMax.left = leftSubTreeRightMost.left;
                        needBalanced = parentOfLeftSubTreeMax;
                    }
                }
            }
            this._setSize(this.size - 1);
            this._setCount(this.count - orgCurrent.count);
        }

        bstDeletedResult.push({deleted: orgCurrent, needBalanced});

        if (needBalanced) {
            this.balancePath(needBalanced);
        }

        return bstDeletedResult;
    }

    /**
     * The function `getSubTreeCount` calculates the number of nodes and the sum of their counts in a subtree, using either
     * recursive or iterative traversal.
     * @param {N | null | undefined} subTreeRoot - The `subTreeRoot` parameter represents the root node of a subtree in a
     * binary tree.
     * @returns The function `getSubTreeCount` returns an array `[number, number]`.
     */
    getSubTreeCount(subTreeRoot: N | null | undefined) {
        const res: [number, number] = [0, 0];
        if (!subTreeRoot) return res;

        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N) => {
                res[0]++;
                res[1] += cur.count;
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            }

            _traverse(subTreeRoot);
            return res;
        } else {
            const stack: N[] = [subTreeRoot];

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

    /**
     * The function `subTreeSumCount` calculates the sum of the `count` property of each node in a subtree, either
     * recursively or iteratively.
     * @param {N | BinaryTreeNodeId | null} subTreeRoot - The `subTreeRoot` parameter represents the root node of a subtree
     * in a binary tree. It can be either a `BinaryTreeNodeId` (a unique identifier for a node in the binary tree) or
     * `null` if the subtree is empty.
     * @returns the sum of the count values of all nodes in the subtree rooted at `subTreeRoot`.
     */
    subTreeSumCount(subTreeRoot: N | BinaryTreeNodeId | null): number {

        if (typeof subTreeRoot === 'number') subTreeRoot = this.get(subTreeRoot, 'id');

        if (!subTreeRoot) return 0;

        let sum = 0;

        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N): void => {
                sum += cur.count;
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            }

            _traverse(subTreeRoot);
        } else {
            const stack: N[] = [subTreeRoot];

            while (stack.length > 0) {
                const cur = stack.pop()!;
                sum += cur.count;
                cur.right && stack.push(cur.right);
                cur.left && stack.push(cur.left);
            }
        }

        return sum;
    }

    /**
     * The function `subTreeAddCount` recursively or iteratively traverses a binary tree and adds a given delta value to
     * the `count` property of each node.
     * @param {N | BinaryTreeNodeId | null} subTreeRoot - The `subTreeRoot` parameter represents the root node of a subtree
     * in a binary tree. It can be either a `BinaryTreeNodeId` (a unique identifier for a node in the binary tree), a
     * `BinaryTreeNode` object, or `null` if the subtree is empty.
     * @param {number} delta - The delta parameter is a number that represents the amount by which the count of each node
     * in the subtree should be increased or decreased.
     * @returns a boolean value.
     */
    subTreeAddCount(subTreeRoot: N | BinaryTreeNodeId | null, delta: number): boolean {
        if (typeof subTreeRoot === 'number') subTreeRoot = this.get(subTreeRoot, 'id');

        if (!subTreeRoot) return false;

        const _addByProperty = (cur: N) => {
            cur.count += delta;
            this._setCount(this.count + delta);
        }

        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N) => {
                _addByProperty(cur);
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            };

            _traverse(subTreeRoot);
        } else {
            const stack: N[] = [subTreeRoot];

            while (stack.length > 0) {
                const cur = stack.pop()!;

                _addByProperty(cur);
                cur.right && stack.push(cur.right);
                cur.left && stack.push(cur.left);
            }
        }
        return true;
    }

    /**
     * The function `getNodesByCount` returns an array of nodes that have a specific count property, either recursively or
     * using a queue.
     * @param {BinaryTreeNodeId | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeId` or a
     * `N`. It represents the property of the nodes that you want to search for.
     * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
     * return only one node that matches the `nodeProperty` or all nodes that match the `nodeProperty`. If `onlyOne` is set
     * to `true`, the function will return only one node. If `onlyOne`
     * @returns an array of nodes that match the given nodeProperty.
     */
    getNodesByCount(nodeProperty: BinaryTreeNodeId | N, onlyOne ?: boolean): N[] {
        if (!this.root) return [];
        const result: N[] = [];

        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N) => {
                if (cur.count === nodeProperty) {
                    result.push(cur);
                    if (onlyOne) return;
                }

                if (!cur.left && !cur.right) return;
                cur.left && _traverse(cur.left);
                cur.right && _traverse(cur.right);
            }

            _traverse(this.root);
        } else {
            const queue: N[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    if (cur.count === nodeProperty) {
                        result.push(cur);
                        if (onlyOne) return result;
                    }

                    cur.left && queue.push(cur.left);
                    cur.right && queue.push(cur.right);

                }
            }
        }

        return result;
    }

    /**
     * The BFSCount function returns an array of counts from a breadth-first search of nodes.
     * @returns The BFSCount() function returns an array of numbers, specifically the count property of each node in the
     * BFS traversal.
     */
    BFSCount(): number[] {
        const nodes = super.BFS('node');
        return nodes.map(node => node.count);
    }

    /**
     * The function "listLevelsCount" takes a node and returns an array of arrays, where each inner array contains the
     * count property of each node at that level.
     * @param {N | null} node - The parameter `node` is of type `N | null`. This means that it can either be an instance of
     * the class `N` or `null`.
     * @returns a 2D array of numbers. Each inner array represents a level in the binary tree, and each number in the inner
     * array represents the count property of a node in that level.
     */
    listLevelsCount(node: N | null): number[][] {
        const levels = super.listLevels(node, 'node');
        return levels.map(level => level.map(node => node.count));
    }

    /**
     * The `morrisCount` function returns an array of counts for each node in a binary tree, based on a specified traversal
     * pattern.
     * @param {'in' | 'pre' | 'post'} [pattern] - The `pattern` parameter is an optional parameter that specifies the
     * traversal pattern for the Morris traversal algorithm. It can have one of three values: 'in', 'pre', or 'post'.
     * @returns The function `morrisCount` returns an array of numbers.
     */
    morrisCount(pattern?: 'in' | 'pre' | 'post'): number[] {
        pattern = pattern || 'in';
        const nodes = super.morris(pattern, 'node');
        return nodes.map(node => node.count);
    }

    /**
     * The function DFSIterativeCount performs a depth-first search iteratively and returns an array of count values for
     * each node.
     * @param {'in' | 'pre' | 'post'} [pattern] - The "pattern" parameter is a string that specifies the traversal order
     * for the Depth-First Search (DFS) algorithm. It can have one of three values: 'in', 'pre', or 'post'.
     * @param {NodeOrPropertyName} [nodeOrPropertyName] - The `nodeOrPropertyName` parameter is an optional parameter that
     * specifies whether to return the nodes or the property names during the depth-first search traversal. If it is set to
     * `'node'`, the function will return the nodes. If it is set to `'property'`, the function will return the property
     * @returns The DFSIterativeCount method returns an array of numbers.
     */
    DFSIterativeCount(pattern ?: 'in' | 'pre' | 'post', nodeOrPropertyName ?: NodeOrPropertyName): number[] {
        pattern = pattern ?? 'in';
        const nodes = super.DFSIterative(pattern, 'node');
        return nodes.map(node => node.count);
    }

    /**
     * The DFSCount function returns an array of counts for each node in a depth-first search traversal.
     * @param {DFSOrderPattern} [pattern] - The `pattern` parameter is an optional parameter that specifies the order in
     * which the Depth-First Search (DFS) algorithm should traverse the nodes. It can have one of the following values:
     * @param [nodeOrPropertyName] - The parameter `nodeOrPropertyName` is used to specify whether you want to retrieve the
     * nodes themselves or a specific property of the nodes. If you pass `'count'` as the value for `nodeOrPropertyName`,
     * the function will return an array of the `count` property of each node.
     * @returns The DFSCount method returns an array of numbers representing the count property of each node in the DFS
     * traversal.
     */
    DFSCount(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[] {
        pattern = pattern ?? 'in';
        const nodes = super.DFS(pattern, 'node');
        return nodes.map(node => node.count);

    }

    /**
     * The `lesserSumCount` function calculates the sum of the counts of all nodes in a binary tree that have a lesser
     * value than a given node.
     * @param {N | BinaryTreeNodeId | null} beginNode - The `beginNode` parameter can be one of the following:
     * @returns the sum of the counts of nodes in the binary tree that have a lesser value than the given beginNode.
     */
    lesserSumCount(beginNode: N | BinaryTreeNodeId | null): number {
        if (typeof beginNode === 'number') beginNode = this.get(beginNode, 'id');
        if (!beginNode) return 0;
        if (!this.root) return 0;
        const id = beginNode.id;

        let sum = 0;

        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N): void => {
                const compared = this._compare(cur.id, id);
                if (compared === CP.eq) {
                    if (cur.right) sum += this.subTreeSumCount(cur.right);
                    return;
                } else if (compared === CP.lt) {
                    if (cur.left) sum += this.subTreeSumCount(cur.left);
                    sum += cur.count;
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
                        if (cur.right) sum += this.subTreeSumCount(cur.right);
                        return sum;
                    } else if (compared === CP.lt) { // todo maybe a bug
                        if (cur.left) sum += this.subTreeSumCount(cur.left);
                        sum += cur.count;
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
     * The function `allGreaterNodesAddCount` updates the count property of all nodes in a binary tree that have an ID
     * greater than a given ID by a specified delta value.
     * @param {N | BinaryTreeNodeId | null} node - The `node` parameter can be one of the following:
     * @param {number} delta - The `delta` parameter is a number that represents the amount by which the `count` property
     * of each node should be increased.
     * @returns a boolean value.
     */
    allGreaterNodesAddCount(node: N | BinaryTreeNodeId | null, delta: number): boolean {
        if (typeof node === 'number') node = this.get(node, 'id');
        if (!node) return false;
        const id = node.id;
        if (!this.root) return false;


        if (this.loopType === LoopType.RECURSIVE) {
            const _traverse = (cur: N) => {
                const compared = this._compare(cur.id, id);
                if (compared === CP.gt) cur.count += delta;

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
                    if (compared === CP.gt) cur.count += delta

                    if (cur.left && this._compare(cur.left.id, id) === CP.gt) queue.push(cur.left);
                    if (cur.right && this._compare(cur.right.id, id) === CP.gt) queue.push(cur.right);
                }
            }
            return true;
        }
    }

    /**
     * The clear() function clears the data and sets the count to 0.
     */
    clear() {
        super.clear();
        this._setCount(0);
    }

    /**
     * The function "_setCount" is used to set the value of the "_count" property.
     * @param {number} v - number
     */
    protected _setCount(v: number) {
        this._count = v;
    }

}