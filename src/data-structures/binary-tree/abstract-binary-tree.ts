/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {AbstractBinaryTreeNodeNested, BinaryTreeNodeKey} from '../../types';
import {IAbstractBinaryTree, IAbstractBinaryTreeNode} from '../../interfaces';

export abstract class AbstractBinaryTreeNode<
  V = any,
  FAMILY extends AbstractBinaryTreeNode<V, FAMILY> = AbstractBinaryTreeNodeNested<V>
> implements IAbstractBinaryTreeNode<V, FAMILY>
{
  /**
   * The constructor function initializes a BinaryTreeNode object with a key and an optional value.
   * @param {V} [val] - The "val" parameter is an optional parameter of type V. It represents the value that will be
   * stored in the binary tree node. If no value is provided, it will be set to undefined.
   */
  protected constructor(val?: V) {
    this.val = val;
  }

  val: V | undefined;
}

export abstract class AbstractBinaryTree<N extends AbstractBinaryTreeNode<N['val'], N> = AbstractBinaryTreeNode>
  implements IAbstractBinaryTree<N>
{
  abstract createNode(key: BinaryTreeNodeKey, val?: N['val']): N | null;
}
