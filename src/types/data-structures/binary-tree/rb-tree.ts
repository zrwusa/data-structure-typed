import { RedBlackTreeNode } from '../../../data-structures';
import type { BSTOptions } from './bst';

export type RBTNColor = 'RED' | 'BLACK';

export type RedBlackTreeNodeNested<K, V> = RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, RedBlackTreeNode<K, V, any>>>>>>>>>>

export type RedBlackTreeOptions<K, V, R> = Omit<BSTOptions<K, V, R>, 'isReverse'> & {};
