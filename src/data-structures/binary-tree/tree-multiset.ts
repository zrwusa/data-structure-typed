/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {BinaryTreeNodeId, TreeMultisetNodeNested, TreeMultisetOptions} from '../types';
import {ITreeMultiset, ITreeMultisetNode} from '../interfaces';
import {AVLTree, AVLTreeNode} from './avl-tree';

export class TreeMultisetNode<T = any, FAMILY extends TreeMultisetNode<T, FAMILY> = TreeMultisetNodeNested<T>> extends AVLTreeNode<T, FAMILY> implements ITreeMultisetNode<T, FAMILY> {
    /**
     * The function creates a new node in a binary tree with an optional value and count.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier for the binary tree node. It is used to uniquely
     * identify each node in the tree.
     * @param {T} [val] - The `val` parameter represents the value to be stored in the node. It is an optional parameter,
     * meaning it can be omitted when calling the `createNode` method.
     * @param {number} [count] - The `count` parameter represents the number of occurrences of the value in the binary tree
     * node. It is an optional parameter, so it can be omitted when calling the `createNode` method.
     * @returns The method is returning a new instance of the TreeMultisetNode class, casted as the FAMILY type.
     */
    override createNode(id: BinaryTreeNodeId, val?: T, count?: number): FAMILY {
        return new TreeMultisetNode(id, val, count) as FAMILY;
    }
}

/**
 * The only distinction between a TreeMultiset and a AVLTree lies in the ability of the former to store duplicate nodes through the utilization of counters.
 */
export class TreeMultiset<N extends TreeMultisetNode<N['val'], N> = TreeMultisetNode> extends AVLTree<N> implements ITreeMultiset<N> {
    constructor(options?: TreeMultisetOptions) {
        super({...options, isMergeDuplicatedVal: true});
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
}
