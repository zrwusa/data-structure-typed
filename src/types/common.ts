export type BSTVariant = 'STANDARD' | 'INVERSE';
export type CP = 1 | -1 | 0;

/**
 * Enum representing different loop types.
 *
 * - `iterative`: Indicates the iterative loop type (with loops that use iterations).
 * - `recursive`: Indicates the recursive loop type (with loops that call themselves).
 */
export type IterationType = 'ITERATIVE' | 'RECURSIVE';

export type FamilyPosition = 'ROOT' | 'LEFT' | 'RIGHT' | 'ROOT_LEFT' | 'ROOT_RIGHT' | 'ISOLATED' | 'MAL_NODE';

export type Comparator<K> = (a: K, b: K) => number;

export type DFSOrderPattern = 'PRE' | 'IN' | 'POST';

export type NodeDisplayLayout = [string[], number, number, number];

export type BTNCallback<N, D = any> = (node: N) => D;

export interface IterableWithSize<T> extends Iterable<T> {
  size: number | ((...args: any[]) => number);
}

export interface IterableWithLength<T> extends Iterable<T> {
  length: number | ((...args: any[]) => number);
}

export type IterableWithSizeOrLength<T> = IterableWithSize<T> | IterableWithLength<T>;

export type BinaryTreePrintOptions = { isShowUndefined?: boolean; isShowNull?: boolean; isShowRedBlackNIL?: boolean };

export type BTNEntry<K, V> = [K | null | undefined, V | undefined];

export type BTNKeyOrNode<K, N> = K | null | undefined | N;

export type KeyOrNodeOrEntry<K, V, N> = BTNEntry<K, V> | BTNKeyOrNode<K, N>;

export type BTNodePureKeyOrNode<K, N> = K | N;

export type BTNodePureExemplar<K, V, N> = [K, V | undefined] | BTNodePureKeyOrNode<K, N>;

export type BSTNKeyOrNode<K, N> = K | undefined | N;

export type BinaryTreeDeleteResult<N> = { deleted: N | null | undefined; needBalanced: N | null | undefined };

export type CRUD = 'CREATED' | 'READ' | 'UPDATED' | 'DELETED';
