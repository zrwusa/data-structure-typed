import {AVLTree, AVLTreeNode} from '../../../data-structures';
import {BSTOptions} from './bst';

export type AVLTreeNodeNested<K, V> = AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, AVLTreeNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type AVLTreeNested<K, V, R, NODE extends AVLTreeNode<K, V, NODE>> = AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, AVLTree<K, V, R, NODE, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type AVLTreeOptions<K, V, R> = BSTOptions<K, V, R> & {};
