import {AbstractBinaryTreeNode} from '../../data-structures';

/**
 * Enum representing different loop types.
 *
 * - `iterative`: Indicates the iterative loop type (with loops that use iterations).
 * - `recursive`: Indicates the recursive loop type (with loops that call themselves).
 */

export enum LoopType {
  ITERATIVE = 'ITERATIVE',
  RECURSIVE = 'RECURSIVE'
}

export enum FamilyPosition {
  ROOT = 'ROOT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  ROOT_LEFT = 'ROOT_LEFT',
  ROOT_RIGHT = 'ROOT_RIGHT',
  ISOLATED = 'ISOLATED',
  MAL_NODE = 'MAL_NODE'
}

export type BinaryTreeNodePropertyName = 'key' | 'val';

export type NodeOrPropertyName = 'node' | BinaryTreeNodePropertyName;

export type DFSOrderPattern = 'in' | 'pre' | 'post';

export type BinaryTreeNodeKey = number;

export type BinaryTreeDeletedResult<N> = { deleted: N | null | undefined; needBalanced: N | null };

export type AbstractBinaryTreeNodeProperty<N extends AbstractBinaryTreeNode<N['val'], N>> =
  | N['val']
  | N
  | number
  | BinaryTreeNodeKey;


export type AbstractBinaryTreeNodeProperties<N extends AbstractBinaryTreeNode<N['val'], N>> =
  AbstractBinaryTreeNodeProperty<N>[];

export type AbstractBinaryTreeNodeNested<T> = AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>;

export type AbstractBinaryTreeOptions = {

};
