export type Comparator<T> = (a: T, b: T) => number;

export type DFSOrderPattern = 'pre' | 'in' | 'post';

export type MapCallback<N> = (node: N) => any;

export type MapCallbackReturn<N> = ReturnType<MapCallback<N>>;

export enum CP {lt = 'lt', eq = 'eq', gt = 'gt'}
