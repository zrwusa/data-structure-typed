import {BinaryTreeNode} from '../binary-tree';
import {IAbstractBinaryTree, IAbstractBinaryTreeNode} from './abstract-binary-tree';

export interface IBinaryTreeNode<T, NEIGHBOR extends IBinaryTreeNode<T, NEIGHBOR>> extends IAbstractBinaryTreeNode<T, NEIGHBOR> {
}

export interface IBinaryTree<N extends BinaryTreeNode<N['val'], N>> extends IAbstractBinaryTree<N> {
}