import { RBTreeNode } from '../data-structures';
import { IBST, IBSTNode } from './bst';
import { BinaryTreeNodeId } from '../types';

export type IRBTreeNode<T, NEIGHBOR extends IRBTreeNode<T, NEIGHBOR>> = IBSTNode<T, NEIGHBOR>;

export interface IRBTree<N extends RBTreeNode<N['val'], N>> extends IBST<N> {
  createNode(id: BinaryTreeNodeId, val?: N['val'], count?: number): N;
}
