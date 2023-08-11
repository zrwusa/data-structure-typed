import {AVLTreeNode} from '../binary-tree';

export interface AVLTreeDeleted<T> {
    deleted: AVLTreeNode<T> | null;
    needBalanced: AVLTreeNode<T> | null;
}