import {BinaryTreeNode} from '../binary-tree';

export type BinaryTreeNodePropertyName = 'id' | 'val' | 'count';
export type NodeOrPropertyName = 'node' | BinaryTreeNodePropertyName;
export type DFSOrderPattern = 'in' | 'pre' | 'post';
export type BinaryTreeNodeId = number;
export type BinaryTreeDeleted<T> = { deleted: BinaryTreeNode<T> | null | undefined, needBalanced: BinaryTreeNode<T> | null };
export type ResultByProperty<T> = T | BinaryTreeNode<T> | number | BinaryTreeNodeId;
export type ResultsByProperty<T> = ResultByProperty<T>[];