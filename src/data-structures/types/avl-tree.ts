import {AVLTreeNode} from '../binary-tree';
import {BSTOptions} from './bst';

export type AVLTreeDeleted<N> = {
    deleted: N | null;
    needBalanced: N | null;
}

export type RecursiveAVLTreeNode<T> = AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export type AVLTreeOptions = BSTOptions & {};