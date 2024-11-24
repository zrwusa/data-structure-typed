import { AVLTreeNode } from '../../../data-structures';
import { BSTOptions } from './bst';

export type AVLTreeNodeNested<K, V> = AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, any>>>>>>>>>>

export type AVLTreeOptions<K, V, R> = BSTOptions<K, V, R> & {};
