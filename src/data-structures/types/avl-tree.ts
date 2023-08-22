import {AVLTreeNode} from '../binary-tree';

export type AVLTreeDeleted<T> = {
    deleted: AVLTreeNode<T> | null;
    needBalanced: AVLTreeNode<T> | null;
}