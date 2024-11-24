import { AVLTreeMultiMapNode } from '../../../data-structures';
import type { AVLTreeOptions } from './avl-tree';

export type AVLTreeMultiMapNodeNested<K, V> = AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, AVLTreeMultiMapNode<K, V, any>>>>>>>>>>

export type AVLTreeMultiMapOptions<K, V, R> = AVLTreeOptions<K, V, R> & {}
