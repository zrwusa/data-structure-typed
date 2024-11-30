import type { RedBlackTreeOptions } from './rb-tree';

export type TreeMultiMapOptions<K, V, R> = Omit<RedBlackTreeOptions<K, V, R>, 'isMapMode'> & {}
