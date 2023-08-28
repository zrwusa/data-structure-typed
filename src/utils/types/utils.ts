export type ToThunkFn = () => ReturnType<TrlFn>;
export type Thunk = () => ReturnType<ToThunkFn> & { __THUNK__: Symbol };
export type TrlFn = (...args: any[]) => any;
export type TrlAsyncFn = (...args: any[]) => any;

export type SpecifyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
