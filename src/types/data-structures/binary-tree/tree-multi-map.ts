import { TreeMultiMap, TreeMultiMapNode } from '../../../data-structures';
import type { RedBlackTreeOptions } from './rb-tree';

export type TreeMultiMapNodeNested<K, V> = TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, TreeMultiMapNode<K, V, any>>>

export type TreeMultiMapNested<K, V, R, MK, MV, MR, NODE extends TreeMultiMapNode<K, V, NODE>> = TreeMultiMap<K, V, R, MK, MV, MR, NODE, TreeMultiMap<K, V, R, MK, MV, MR, NODE,TreeMultiMap<K, V, R, MK, MV, MR, NODE, any>>>

export type TreeMultiMapOptions<K, V, R> = RedBlackTreeOptions<K, V, R> & {}
