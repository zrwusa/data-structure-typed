import {AVLTreeNode} from '../data-structures';
import {IBST, IBSTNode} from './bst';

export interface IAVLTreeNode<T, NEIGHBOR extends IAVLTreeNode<T, NEIGHBOR>> extends IBSTNode<T, NEIGHBOR> {
  height: number;
}

export interface IAVLTree<N extends AVLTreeNode<N['val'], N>> extends IBST<N> {}
