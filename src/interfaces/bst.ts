import {BSTNode} from '../data-structures';
import {IBinaryTree, IBinaryTreeNode} from './binary-tree';

export interface IBSTNode<T, NEIGHBOR extends IBSTNode<T, NEIGHBOR>> extends IBinaryTreeNode<T, NEIGHBOR> {}

export interface IBST<N extends BSTNode<N['val'], N>> extends IBinaryTree<N> {}
