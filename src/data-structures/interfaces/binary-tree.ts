import {BinaryTreeNode} from '../binary-tree';
import {IAbstractBinaryTree, IAbstractBinaryTreeNode} from './abstract-binary-tree';

export interface IBinaryTreeNode<T, FAMILY extends IBinaryTreeNode<T, FAMILY>> extends IAbstractBinaryTreeNode<T, FAMILY> {
}

export interface IBinaryTree<N extends BinaryTreeNode<N['val'], N>> extends IAbstractBinaryTree<N> {
}