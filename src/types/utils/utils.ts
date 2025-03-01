export type Thunk<T> = () => T | Thunk<T>;

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
