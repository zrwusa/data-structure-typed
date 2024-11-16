import { AVLTreeMultiMap, AVLTreeMultiMapNode } from '../../../data-structures';
import type { AVLTreeOptions } from './avl-tree';

export type AVLTreeMultiMapNodeNested<K, V> = AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type AVLTreeMultiMapNested<K, V, R, NODE extends AVLTreeMultiMapNode<K, V, NODE>> = AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, AVLTreeMultiMap<K, V, R, NODE, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type AVLTreeMultiMapOptions<K, V, R> = AVLTreeOptions<K, V, R> & {}
