import { AVLTree, AVLTreeNode } from '../../../data-structures';
import { BSTOptions } from './bst';

export type AVLTreeNodeNested<K, V> = AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, any>>>

export type AVLTreeNested<K, V, R,MK, MV, MR,  NODE extends AVLTreeNode<K, V, NODE>> = AVLTree<K, V, R,MK, MV, MR,  NODE, AVLTree<K, V, R,MK, MV, MR,  NODE, AVLTree<K, V, R,MK, MV, MR,  NODE, any>>>

export type AVLTreeOptions<K, V, R> = BSTOptions<K, V, R> & {};
