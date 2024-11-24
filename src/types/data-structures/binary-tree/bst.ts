import { BSTNode } from '../../../data-structures';
import type { BinaryTreeOptions } from './binary-tree';
import { Comparable } from '../../utils';

export type BSTNodeNested<K, V> = BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, BSTNode<K, V, any>>>>>>>>>>

export type BSTOptions<K, V, R> = BinaryTreeOptions<K, V, R> & {
  specifyComparable?: (key: K) => Comparable
  isReverse?: boolean;
}

export type BSTNOptKey<K> = K | undefined;

export type OptNode<NODE> = NODE | undefined;

export type BSTNOptKeyOrNode<K, NODE> = BSTNOptKey<K> | NODE;

