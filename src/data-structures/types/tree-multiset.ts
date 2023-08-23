import {BSTOptions} from './bst';
import {TreeMultiSetNode} from '../binary-tree';

export type RecursiveTreeMultiSetNode<T> = TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, TreeMultiSetNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type TreeMultiSetOptions = Omit<BSTOptions, 'isDuplicatedVal'> & {
    isDuplicatedVal: true,
}
