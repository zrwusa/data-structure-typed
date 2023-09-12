import {RBTreeNode} from '../data-structures';
import {IBST, IBSTNode} from './bst';
import {BinaryTreeNodeId} from '../types';

export interface IRBTreeNode<T, NEIGHBOR extends IRBTreeNode<T, NEIGHBOR>> extends IBSTNode<T, NEIGHBOR> {
}

export interface IRBTree<N extends RBTreeNode<N['val'], N>> extends IBST<N> {

  createNode(id: BinaryTreeNodeId, val?: N['val'], count?: number): N
}
