export type ToThunkFn<R = any> = () => R;
export type Thunk<R = any> = ToThunkFn<R> & { __THUNK__?: symbol };
export type TrlFn<A extends any[] = any[], R = any> = (...args: A) => R;
export type TrlAsyncFn = (...args: any[]) => any;

export type SpecifyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Any = string | number | bigint | boolean | symbol | undefined | object;

export type Arithmetic = number | bigint;

export type ComparablePrimitive = number | bigint | string | boolean;

export interface BaseComparableObject {
  [key: string]: unknown;
}

export interface ValueComparableObject extends BaseComparableObject {
  valueOf: () => ComparablePrimitive | ValueComparableObject;
  toString?: () => string;
}

export interface StringComparableObject extends BaseComparableObject {
  toString: () => string;
}

export type ComparableObject = ValueComparableObject | StringComparableObject;

export type Comparable = ComparablePrimitive | Date | ComparableObject;
