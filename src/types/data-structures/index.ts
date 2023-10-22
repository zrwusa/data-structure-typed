export * from './binary-tree';
export * from './bst';
export * from './avl-tree';
export * from './segment-tree';
export * from './tree-multiset';
export * from './abstract-graph';
export * from './map-graph';
export * from './rb-tree';
export * from './directed-graph';
export * from './heap';
export * from './singly-linked-list';
export * from './doubly-linked-list';
export * from './navigator';
export * from './hash';

export type MapCallback<N> = (node: N) => any;
export type MapCallbackReturn<N> = ReturnType<MapCallback<N>>;
