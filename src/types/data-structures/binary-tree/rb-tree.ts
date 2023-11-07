import {RBTreeNode} from '../../../data-structures';
import {BSTOptions} from "./bst";

export enum RBTNColor { RED = 1, BLACK = 0}

export type RBTreeNodeNested<T> = RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, RBTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type RBTreeOptions = BSTOptions & {};