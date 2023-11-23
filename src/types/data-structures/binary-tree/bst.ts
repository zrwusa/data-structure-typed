import { BST, BSTNode } from '../../../data-structures';
import type { BinaryTreeOptions, BTNKey } from './binary-tree';
import { Comparator } from "../../common";

// prettier-ignore
export type BSTNodeNested<T> = BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, BSTNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTNested<T, N extends BSTNode<T, N>> = BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, BST<T, N, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTOptions = BinaryTreeOptions & {
  comparator: Comparator<BTNKey>
}
