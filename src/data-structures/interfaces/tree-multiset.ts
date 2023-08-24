import {TreeMultiSetNode} from '../binary-tree';
import {IBSTNode} from './bst';
import {IAVLTree} from './avl-tree';

export interface ITreeMultiSetNode<T, FAMILY extends ITreeMultiSetNode<T, FAMILY>> extends IBSTNode<T, FAMILY> {

}

export interface ITreeMultiSet<N extends TreeMultiSetNode<N['val'], N>> extends IAVLTree<N> {


}