import {BinaryTreeNodeKey} from '../types';
import {AbstractBinaryTreeNode} from '../data-structures';

export interface IAbstractBinaryTreeNode<T, NEIGHBOR extends IAbstractBinaryTreeNode<T, NEIGHBOR>> {}

export interface IAbstractBinaryTree<N extends AbstractBinaryTreeNode<N['val'], N>> {
  createNode(key: BinaryTreeNodeKey, val?: N['val'], count?: number): N | null;
}
