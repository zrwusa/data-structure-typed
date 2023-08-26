import {RBTreeNode} from '../binary-tree';
import {IBST, IBSTNode} from './bst';
import {BinaryTreeNodeId} from '../types';

export interface IRBTreeNode<T, FAMILY extends IRBTreeNode<T, FAMILY>> extends IBSTNode<T, FAMILY> {
    createNode(val: T, id: BinaryTreeNodeId, count?: number): FAMILY
}

export interface IRBTree<N extends RBTreeNode<N['val'], N>> extends IBST<N> {

    createNode(val: N['val'], id: BinaryTreeNodeId, count?: number): N
}