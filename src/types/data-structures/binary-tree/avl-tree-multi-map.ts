import { AVLTreeMultiMap, AVLTreeMultiMapNode } from '../../../data-structures';
import type { AVLTreeOptions } from './avl-tree';

export type AVLTreeMultiMapNodeNested<K, V> = AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, any>>>

export type AVLTreeMultiMapNested<K, V, R, MK, MV, MR, NODE extends AVLTreeMultiMapNode<K, V, NODE>> = AVLTreeMultiMap<K, V, R, MK, MV, MR, NODE, AVLTreeMultiMap<K, V, R, MK, MV, MR, NODE, AVLTreeMultiMap<K, V, R, MK, MV, MR, NODE, any>>>

export type AVLTreeMultiMapOptions<K, V, R> = AVLTreeOptions<K, V, R> & {}
