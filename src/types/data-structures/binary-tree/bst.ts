import type { BinaryTreeOptions } from './binary-tree';
import { Comparable } from '../../utils';
import { OptValue } from '../../common';

export type BSTOptions<K, V, R> = BinaryTreeOptions<K, V, R> & {
  specifyComparable?: (key: K) => Comparable
  isReverse?: boolean;
}

export type BSTNOptKey<K> = K | undefined;

export type OptNode<NODE> = NODE | undefined;

export type BSTNEntry<K, V> = [BSTNOptKey<K>, OptValue<V>];

export type BSTNOptKeyOrNode<K, NODE> = BSTNOptKey<K> | NODE;

export type BSTNRep<K, V, NODE> = BSTNEntry<K, V> | BSTNOptKeyOrNode<K, NODE>;

