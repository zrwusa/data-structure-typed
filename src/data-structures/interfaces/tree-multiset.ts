import {TreeMultisetNode} from '../binary-tree';
import {IBSTNode} from './bst';
import {IAVLTree} from './avl-tree';

export interface ITreeMultisetNode<T, FAMILY extends ITreeMultisetNode<T, FAMILY>> extends IBSTNode<T, FAMILY> {

}

export interface ITreeMultiset<N extends TreeMultisetNode<N['val'], N>> extends IAVLTree<N> {


}