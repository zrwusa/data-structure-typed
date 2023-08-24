import {BinaryTreeOptions} from './binary-tree';
import {RBTreeNode} from '../binary-tree';

export enum RBColor { RED = 'RED', BLACK = 'BLACK'}

export type RBTreeNodeNested<T> = RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type RBTreeOptions = BinaryTreeOptions & {}