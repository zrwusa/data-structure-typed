import { BST, BSTNode } from '../../../data-structures';
import type { BinaryTreeOptions } from './binary-tree';
import { Comparator } from '../../common';

export type BSTNodeNested<K, V> = BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTNested<K, V, R, NODE extends BSTNode<K, V, NODE>> = BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, BST<K, V, R, NODE, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BSTOptions<K, V, R> = BinaryTreeOptions<K, V, R> & {
  comparator?: Comparator<K>
}

export type OptBSTNKey<K> = K | undefined;

export type OptBSTN<NODE> = NODE | undefined;

export type BSTNKeyOrNode<K, NODE> = OptBSTNKey<K> | NODE;

