import {RBTreeNode} from '../binary-tree';
import {IBST, IBSTNode} from './bst';

export interface IRBTreeNode<T, FAMILY extends IRBTreeNode<T, FAMILY>> extends IBSTNode<T, FAMILY> {

}

export interface IRBTree<N extends RBTreeNode<N['val'], N>> extends IBST<N> {


}