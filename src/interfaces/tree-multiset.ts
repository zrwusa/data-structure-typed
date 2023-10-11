import {TreeMultisetNode} from '../data-structures';
import {IAVLTree, IAVLTreeNode} from './avl-tree';

export interface ITreeMultisetNode<T, NEIGHBOR extends ITreeMultisetNode<T, NEIGHBOR>>
  extends IAVLTreeNode<T, NEIGHBOR> {}

export interface ITreeMultiset<N extends TreeMultisetNode<N['val'], N>> extends IAVLTree<N> {}
