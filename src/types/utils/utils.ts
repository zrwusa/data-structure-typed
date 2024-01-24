export type ToThunkFn = () => ReturnType<TrlFn>;
export type Thunk = () => ReturnType<ToThunkFn> & { __THUNK__: symbol };
export type TrlFn = (...args: any[]) => any;
export type TrlAsyncFn = (...args: any[]) => any;

export type SpecifyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Any = string | number | bigint | boolean | symbol | undefined | object;

export type Comparable =
  | number
  | string
  | bigint
  | boolean
  | ({ [key in string]: any } & {
  valueOf(): Comparable;
})
  | ({ [key in string]: any } & {
  toString(): Comparable;
})
  | (() => Comparable);
