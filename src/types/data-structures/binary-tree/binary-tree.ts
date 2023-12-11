import { BinaryTree, BinaryTreeNode } from '../../../data-structures';

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

export type BinaryTreeDeleteResult<N> = { deleted: N | null | undefined; needBalanced: N | null | undefined };

export type BinaryTreeNodeNested<K, V> = BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BinaryTreeNested<K, V, N extends BinaryTreeNode<K, V, N>> = BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, BinaryTree<K, V, N, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BinaryTreeOptions<K> = {
  iterationType: IterationType,
  extractor: (key: K) => number
}

export type NodeDisplayLayout = [string[], number, number, number];
