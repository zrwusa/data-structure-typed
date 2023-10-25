import {BSTNode} from '../../../data-structures';
import type {BinaryTreeNodeKey, BinaryTreeOptions} from './binary-tree';

export type BSTComparator = (a: BinaryTreeNodeKey, b: BinaryTreeNodeKey) => number;

// prettier-ignore
export type BSTNodeNested<T> = BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTOptions = BinaryTreeOptions & {
  comparator?: BSTComparator,
}
