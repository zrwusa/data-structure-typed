import { RedBlackTreeNode } from '../../../data-structures';
import { BSTOptions } from "./bst";

export enum RBTNColor { RED = 1, BLACK = 0}

export type RedBlackTreeNodeNested<T> = RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, RedBlackTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type RBTreeOptions = BSTOptions & {};