import { BST, BSTNode } from '../../../data-structures';
import type { BinaryTreeOptions } from './binary-tree';
import { Comparator } from "../../common";
import { Comparable } from "../../utils";

export type BSTNodeNested<K extends Comparable, V> = BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTNested<K extends Comparable, V, N extends BSTNode<K, V, N>> = BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, BST<K, V, N, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTOptions<K> = BinaryTreeOptions & {
  comparator?: Comparator<K>
}
