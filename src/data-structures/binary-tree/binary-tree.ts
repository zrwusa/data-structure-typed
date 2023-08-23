/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {BinaryTreeNodeId, RecursiveBinaryTreeNode} from '../types';
import {BinaryTreeOptions} from '../types';
import {IBinaryTree, IBinaryTreeNode} from '../interfaces';
import {AbstractBinaryTree, AbstractBinaryTreeNode} from './abstract-binary-tree';


export class BinaryTreeNode<T = number, FAMILY extends BinaryTreeNode<T, FAMILY> = RecursiveBinaryTreeNode<T>> extends AbstractBinaryTreeNode<T, FAMILY> implements IBinaryTreeNode<T, FAMILY> {

    _createNode(id: BinaryTreeNodeId, val: T | null, count?: number): FAMILY | null {
        return val !== null ? new BinaryTreeNode<T, FAMILY>(id, val, count) as FAMILY : null;
    }

}

export class BinaryTree<N extends BinaryTreeNode<N['val'], N> = BinaryTreeNode> extends AbstractBinaryTree<N> implements IBinaryTree<N> {

    /**
     * The constructor function accepts an optional options object and sets the values of loopType, autoIncrementId, and
     * isDuplicatedVal based on the provided options.
     * @param [options] - An optional object that can contain the following properties:
     */
    constructor(options?: BinaryTreeOptions) {
        super();
    }


    /**
     * The function creates a new binary tree node with the given id, value, and count if the value is not null, otherwise
     * it returns null.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier for the binary tree node. It is of type
     * `BinaryTreeNodeId`.
     * @param {N | null} val - The `val` parameter represents the value of the node. It can be of type `N` (generic type)
     * or `null`.
     * @param {number} [count] - The `count` parameter is an optional parameter of type `number`. It represents the number
     * of occurrences of the value in the binary tree node. If not provided, the default value is `undefined`.
     * @returns a BinaryTreeNode object if the value is not null, otherwise it returns null.
     */
    _createNode(id: BinaryTreeNodeId, val: N['val'] | null, count?: number): N | null {
        const node = new BinaryTreeNode<N['val'], N>(id, val, count);
        return node as N | null;
    }

}