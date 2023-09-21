import { TreeMultisetNode } from '../data-structures';
import { IBSTNode } from './bst';
import { IAVLTree } from './avl-tree';

export type ITreeMultisetNode<T, NEIGHBOR extends ITreeMultisetNode<T, NEIGHBOR>> = IBSTNode<T, NEIGHBOR>;

export type ITreeMultiset<N extends TreeMultisetNode<N['val'], N>> = IAVLTree<N>;
