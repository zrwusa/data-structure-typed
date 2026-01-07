import type { BinaryTreeOptions } from './binary-tree';
import type { Comparable } from '../../utils';
import type { Comparator, OptValue } from '../../common';

type BSTBaseOptions<K, V, R> = Omit<BinaryTreeOptions<K, V, R>, 'isDuplicate'>;

export type BSTOptions<K, V, R> = BSTBaseOptions<K, V, R> & {
  comparator?: Comparator<K>;
}

export type BSTNOptKey<K> = K | undefined;

export type OptNode<NODE> = NODE | undefined;

export type BSTNEntry<K, V> = [BSTNOptKey<K>, OptValue<V>];

export type BSTNOptKeyOrNode<K, NODE> = BSTNOptKey<K> | NODE;

export type BSTNRep<K, V, NODE> = BSTNEntry<K, V> | BSTNOptKeyOrNode<K, NODE>;

