import {AVLTreeNode} from '../binary-tree';

export type AVLTreeDeleted<N> = {
    deleted: N | null;
    needBalanced: N | null;
}

export type RecursiveAVLTreeNode<T> = AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, AVLTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
