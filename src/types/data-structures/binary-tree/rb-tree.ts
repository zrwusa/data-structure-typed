import { RedBlackTree, RedBlackTreeNode } from '../../../data-structures';
import type { BSTOptions } from "./bst";

export type RBTNColor = 'RED' | 'BLACK';

export type RedBlackTreeNodeNested<K, V> = RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, any>>>

export type RedBlackTreeNested<K, V, R, MK, MV, MR, NODE extends RedBlackTreeNode<K, V, NODE>> = RedBlackTree<K, V, R, MK, MV, MR, NODE, RedBlackTree<K, V, R, MK, MV, MR, NODE, RedBlackTree<K, V, R, MK, MV, MR, NODE, any>>>

export type RedBlackTreeOptions<K, V, R> = BSTOptions<K, V, R> & {};
