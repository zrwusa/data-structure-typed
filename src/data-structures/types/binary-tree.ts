import {BinaryTreeNode} from '../binary-tree';

export type BinaryTreeNodePropertyName = 'id' | 'val' | 'count';
export type NodeOrPropertyName = 'node' | BinaryTreeNodePropertyName;
export type DFSOrderPattern = 'in' | 'pre' | 'post';
export type BinaryTreeNodeId = number;
export type BinaryTreeDeleted<N> = { deleted: N | null | undefined, needBalanced: N | null };
export type ResultByProperty<N extends BinaryTreeNode<N['val'], N>> = N['val'] | N | number | BinaryTreeNodeId;
export type ResultsByProperty<N extends BinaryTreeNode<N['val'], N>> = ResultByProperty<N>[];
export type RecursiveBinaryTreeNode<T> = BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
