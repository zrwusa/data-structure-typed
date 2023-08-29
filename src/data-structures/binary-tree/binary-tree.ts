/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {BinaryTreeNodeId, BinaryTreeNodeNested} from '../types';
import {BinaryTreeOptions} from '../types';
import {AbstractBinaryTree, AbstractBinaryTreeNode} from './abstract-binary-tree';
import {IBinaryTree, IBinaryTreeNode} from '../interfaces/binary-tree';

export class BinaryTreeNode<T = any, FAMILY extends BinaryTreeNode<T, FAMILY> = BinaryTreeNodeNested<T>> extends AbstractBinaryTreeNode<T, FAMILY> implements IBinaryTreeNode<T, FAMILY> {

}

export class BinaryTree<N extends BinaryTreeNode<N['val'], N> = BinaryTreeNode> extends AbstractBinaryTree<N> implements IBinaryTree<N> {

    /**
     * The constructor function accepts an optional options object and sets the values of loopType, autoIncrementId, and
     * isMergeDuplicatedVal based on the provided options.
     * @param [options] - An optional object that can contain the following properties:
     */
    constructor(options?: BinaryTreeOptions) {
        super(options);
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
    createNode(id: BinaryTreeNodeId, val?: N['val']): N {
        return new BinaryTreeNode<N['val'], N>(id, val) as N;
    }

}