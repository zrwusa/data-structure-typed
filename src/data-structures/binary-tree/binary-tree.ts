/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {BinaryTreeNodeId, BinaryTreeNodeNested, BinaryTreeOptions} from '../types';
import {AbstractBinaryTree, AbstractBinaryTreeNode} from './abstract-binary-tree';
import {IBinaryTree, IBinaryTreeNode} from '../interfaces/binary-tree';

export class BinaryTreeNode<T = any, NEIGHBOR extends BinaryTreeNode<T, NEIGHBOR> = BinaryTreeNodeNested<T>> extends AbstractBinaryTreeNode<T, NEIGHBOR> implements IBinaryTreeNode<T, NEIGHBOR> {

}

export class BinaryTree<N extends BinaryTreeNode<N['val'], N> = BinaryTreeNode> extends AbstractBinaryTree<N> implements IBinaryTree<N> {

    /**
     * This is a constructor function for a binary tree class that takes an optional options parameter.
     * @param {BinaryTreeOptions} [options] - The `options` parameter is an optional object that can be passed to the
     * constructor of the `BinaryTree` class. It allows you to customize the behavior of the binary tree by providing
     * different configuration options.
     */
    constructor(options?: BinaryTreeOptions) {
        super(options);
    }

    /**
     * The function creates a new binary tree node with an optional value.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier for the binary tree node. It is of type
     * `BinaryTreeNodeId`, which represents the unique identifier for each node in the binary tree.
     * @param [val] - The `val` parameter is an optional value that can be assigned to the node. It represents the value
     * stored in the node.
     * @returns a new instance of a BinaryTreeNode with the specified id and value.
     */
    createNode(id: BinaryTreeNodeId, val?: N['val']): N {
        return new BinaryTreeNode<N['val'], N>(id, val) as N;
    }
}