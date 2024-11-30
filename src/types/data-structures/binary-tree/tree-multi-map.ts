import type { RedBlackTreeOptions } from './red-black-tree';

export type TreeMultiMapOptions<K, V, R> = Omit<RedBlackTreeOptions<K, V, R>, 'isMapMode'> & {}
