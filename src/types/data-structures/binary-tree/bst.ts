import { BST, BSTNode } from '../../../data-structures';
import type { BinaryTreeOptions } from './binary-tree';
import { BSTVariant } from "../../common";

export type BSTNodeNested<K, V> = BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTNested<K, V, N extends BSTNode<K, V, N>> = BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTOptions<K> = BinaryTreeOptions<K> & {
  variant?: BSTVariant
}
