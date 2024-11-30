import type { AVLTreeOptions } from './avl-tree';

export type AVLTreeMultiMapOptions<K, V, R> = Omit<AVLTreeOptions<K, V, R>, 'isMapMode'> & {}
