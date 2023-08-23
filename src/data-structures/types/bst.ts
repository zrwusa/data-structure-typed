import {BSTNode} from '../binary-tree';
import type {BinaryTreeOptions} from './binary-tree';
import {BinaryTreeNodeId} from './abstract-binary-tree';

export type BSTComparator = (a: BinaryTreeNodeId, b: BinaryTreeNodeId) => number;

export type RecursiveBSTNode<T> = BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export type BSTOptions = BinaryTreeOptions & {
    comparator?: BSTComparator,
}

export enum CP {lt = 'lt', eq = 'eq', gt = 'gt'}