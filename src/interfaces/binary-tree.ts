import {BinaryTreeNode} from '../data-structures';
import {IAbstractBinaryTree, IAbstractBinaryTreeNode} from './abstract-binary-tree';

export type IBinaryTreeNode<T, NEIGHBOR extends IBinaryTreeNode<T, NEIGHBOR>> = IAbstractBinaryTreeNode<T, NEIGHBOR>

export type IBinaryTree<N extends BinaryTreeNode<N['val'], N>> = IAbstractBinaryTree<N>