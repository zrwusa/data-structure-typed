import {TreeMultisetNode} from '../data-structures';
import {IBSTNode} from './bst';
import {IAVLTree} from './avl-tree';

export interface ITreeMultisetNode<T, NEIGHBOR extends ITreeMultisetNode<T, NEIGHBOR>> extends IBSTNode<T, NEIGHBOR> {

}

export interface ITreeMultiset<N extends TreeMultisetNode<N['val'], N>> extends IAVLTree<N> {

}