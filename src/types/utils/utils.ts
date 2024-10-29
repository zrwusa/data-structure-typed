export type ToThunkFn<R = any> = () => R;
export type Thunk<R = any> = ToThunkFn<R> & { __THUNK__?: symbol };
export type TrlFn<A extends any[] = any[], R = any> = (...args: A) => R;
export type TrlAsyncFn = (...args: any[]) => any;

export type SpecifyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Any = string | number | bigint | boolean | symbol | undefined | object;

export type ComparablePrimitive = number | bigint | string | boolean;

// TODO type safety looks not strict
export type ComparableObject = { [key in string]: any } & (
  | {
      valueOf: () => ComparablePrimitive | ComparableObject;
      toString?: () => string;
    }
  | {
      toString: () => string;
    }
);

export type Comparable = ComparablePrimitive | Date | ComparableObject;
