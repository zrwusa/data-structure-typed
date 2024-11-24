import { TreeMultiMapNode } from '../../../data-structures';
import type { RedBlackTreeOptions } from './rb-tree';

export type TreeMultiMapNodeNested<K, V> = TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, any>>>>>>>>>>

export type TreeMultiMapOptions<K, V, R> = RedBlackTreeOptions<K, V, R> & {}
