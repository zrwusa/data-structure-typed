import {BinaryTreeNode} from '../../../data-structures';

/**
 * Enum representing different loop types.
 *
 * - `iterative`: Indicates the iterative loop type (with loops that use iterations).
 * - `recursive`: Indicates the recursive loop type (with loops that call themselves).
 */

export enum IterationType {
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

export type BTNKey = number;

export type BiTreeDeleteResult<N> = { deleted: N | null | undefined; needBalanced: N | null | undefined };

export type BinaryTreeNodeNested<T> = BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BinaryTreeOptions = { iterationType?: IterationType }
