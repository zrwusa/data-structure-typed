import {RBTreeNode} from '../data-structures';
import {IBST, IBSTNode} from './bst';
import {BinaryTreeNodeKey} from '../types';

export type IRBTreeNode<T, NEIGHBOR extends IRBTreeNode<T, NEIGHBOR>> = IBSTNode<T, NEIGHBOR>;

export interface IRBTree<N extends RBTreeNode<N['val'], N>> extends IBST<N> {
  createNode(key: BinaryTreeNodeKey, val?: N['val'], count?: number): N;
}
