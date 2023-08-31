import {TreeMultisetNode} from '../binary-tree';
import {AVLTreeOptions} from './avl-tree';

export type TreeMultisetNodeNested<T> = TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, TreeMultisetNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type TreeMultisetOptions = Omit<AVLTreeOptions, 'isMergeDuplicatedNodeById'> & {
    isMergeDuplicatedNodeById: true,
}
