import {RBTreeNode} from '../data-structures';
import {IBST, IBSTNode} from './bst';

export interface IRBTreeNode<T, NEIGHBOR extends IRBTreeNode<T, NEIGHBOR>> extends IBSTNode<T, NEIGHBOR> {}

export interface IRBTree<N extends RBTreeNode<N['val'], N>> extends IBST<N> {}
