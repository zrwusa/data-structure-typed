/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {BST, BSTNode} from './bst';
import type {BinaryTreeNodeId, TreeMultiSetDeletedResult} from '../types';
import {IBinaryTree} from '../interfaces';

export class TreeMultiSet<N extends BSTNode<N['val'], N> = BSTNode<number>> extends BST<N> implements IBinaryTree<N> {
    /**
     * The function creates a new BSTNode with the given id, value, and count.
     * @param {BinaryTreeNodeId} id - The id parameter is the unique identifier for the binary tree node. It is used to
     * distinguish one node from another in the tree.
     * @param {N} val - The `val` parameter represents the value that will be stored in the binary search tree node.
     * @param {number} [count] - The "count" parameter is an optional parameter of type number. It represents the number of
     * occurrences of the value in the binary search tree node. If not provided, the count will default to 1.
     * @returns A new instance of the BSTNode class with the specified id, value, and count (if provided).
     */
    override _createNode(id: BinaryTreeNodeId, val: N['val'], count?: number): N {
        const node = new BSTNode<N['val'], N>(id, val, count);
        return node as N;
    }

    /**
     * The function overrides the add method of the BinarySearchTree class in TypeScript.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier of the binary tree node that you want to add.
     * @param {N | null} val - The `val` parameter represents the value that you want to add to the binary search tree. It
     * can be of type `N` (the generic type) or `null`.
     * @param {number} [count] - The `count` parameter is an optional parameter of type `number`. It represents the number
     * of times the value should be added to the binary search tree. If not provided, the default value is `undefined`.
     * @returns The `add` method is returning a `BSTNode<N>` object or `null`.
     */
    override add(id: BinaryTreeNodeId, val: N | null, count?: number): N | null {
        return super.add(id, val, count);
    }

    /**
     * The function overrides the remove method of the superclass and returns the result of calling the superclass's remove
     * method.
     * @param {BinaryTreeNodeId} id - The `id` parameter represents the identifier of the binary tree node that needs to be
     * removed from the tree.
     * @param {boolean} [isUpdateAllLeftSum] - The `isUpdateAllLeftSum` parameter is an optional boolean value that
     * determines whether to update the left sum of all nodes in the tree after removing a node. If `isUpdateAllLeftSum` is
     * set to `true`, the left sum of all nodes will be recalculated. If it
     * @returns The method is returning an array of TreeMultiSetDeletedResult objects.
     */
    override remove(id: BinaryTreeNodeId, isUpdateAllLeftSum?: boolean): TreeMultiSetDeletedResult<N>[] {
        return super.remove(id, isUpdateAllLeftSum);
    }
}


