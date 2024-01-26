import { BST, BSTNode } from '../../../data-structures';
import type { BinaryTreeOptions } from './binary-tree';
import { Comparator } from '../../common';
import { Comparable } from '../../utils';

export type BSTNodeNested<K extends Comparable, V> = BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTNested<K extends Comparable, V, R, NODE extends BSTNode<K, V, NODE>> = BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTOptions<K, V, R> = BinaryTreeOptions<K, V, R> & {
  comparator?: Comparator<K>
}
