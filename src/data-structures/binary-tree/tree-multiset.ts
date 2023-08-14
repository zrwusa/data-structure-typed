/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import {BST, BSTNode} from './bst';
import type {BinaryTreeNodeId, TreeMultiSetDeletedResult} from '../types';

export class TreeMultiSet<T> extends BST<T> {
    /**
     * The function creates a new BSTNode with the given id, value, and count.
     * @param {BinaryTreeNodeId} id - The id parameter is the unique identifier for the binary tree node. It is used to
     * distinguish one node from another in the tree.
     * @param {T} val - The `val` parameter represents the value that will be stored in the binary search tree node.
     * @param {number} [count] - The "count" parameter is an optional parameter of type number. It represents the number of
     * occurrences of the value in the binary search tree node. If not provided, the count will default to 1.
     * @returns A new instance of the BSTNode class with the specified id, value, and count (if provided).
     */
    override createNode(id: BinaryTreeNodeId, val: T, count?: number): BSTNode<T> {
        return new BSTNode<T>(id, val, count);
    }

    /**
     * The function overrides the add method of the BinarySearchTree class in TypeScript.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier of the binary tree node that you want to add.
     * @param {T | null} val - The `val` parameter represents the value that you want to add to the binary search tree. It
     * can be of type `T` (the generic type) or `null`.
     * @param {number} [count] - The `count` parameter is an optional parameter of type `number`. It represents the number
     * of times the value should be added to the binary search tree. If not provided, the default value is `undefined`.
     * @returns The `add` method is returning a `BSTNode<T>` object or `null`.
     */
    override add(id: BinaryTreeNodeId, val: T | null, count?: number): BSTNode<T> | null {
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
    override remove(id: BinaryTreeNodeId, isUpdateAllLeftSum?: boolean): TreeMultiSetDeletedResult<T>[] {
        return super.remove(id, isUpdateAllLeftSum);
    }
}


