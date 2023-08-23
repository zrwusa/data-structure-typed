import {RBTreeNode} from '../binary-tree';
import {IBST, IBSTNode} from './bst';
import {BinaryTreeNodeId} from '../types';

export interface IRBTreeNode<T, FAMILY extends IRBTreeNode<T, FAMILY>> extends IBSTNode<T, FAMILY> {
    createNode(id: BinaryTreeNodeId, val?: T | null, count?: number): FAMILY
}

export interface IRBTree<N extends RBTreeNode<N['val'], N>> extends IBST<N> {

    createNode(id: BinaryTreeNodeId, val?: N | null, count?: number): N
}