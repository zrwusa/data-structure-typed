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

<<<<<<< HEAD:src/types/data-structures/binary-tree.ts
export type NodeOrPropertyName = 'node' | BinaryTreeNodePropertyName;

export type DFSOrderPattern = 'in' | 'pre' | 'post';

export type BinaryTreeNodeKey = number;

export type BinaryTreeNodeProperty<N extends BinaryTreeNode<N['val'], N>> =
  | N['val']
  | N
  | number
  | BinaryTreeNodeKey;
export type BinaryTreeDeletedResult<N> = { deleted: N | null | undefined; needBalanced: N | null | undefined };
=======
export type BinaryTreeDeletedResult<N> = { deleted: N | null | undefined; needBalanced: N | null };
>>>>>>> 10bbcffcef4ed5901867431a3d3eae891d190b9d:src/types/data-structures/binary-tree/binary-tree.ts

export type BinaryTreeNodeNested<T> = BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BinaryTreeOptions = { iterationType?: IterationType }
