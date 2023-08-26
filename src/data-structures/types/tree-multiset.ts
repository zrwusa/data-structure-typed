import {TreeMultiSetNode} from '../binary-tree';
import {AVLTreeOptions} from './avl-tree';

export type TreeMultiSetNodeNested<T> = TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type TreeMultiSetOptions = Omit<AVLTreeOptions, 'isMergeDuplicatedVal'> & {
    isMergeDuplicatedVal: true,
}
