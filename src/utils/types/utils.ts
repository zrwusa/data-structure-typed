export type ToThunkFn = () => ReturnType<TrlFn>;
export type Thunk = () => ReturnType<ToThunkFn> & { __THUNK__: Symbol };
export type TrlFn = (...args: any[]) => any;
export type TrlAsyncFn = (...args: any[]) => any;

export type SpecifyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type KeyValueObject = { [key: string]: any };

export type KeyValueObjectWithId = { [key: string]: any, id: string | number | symbol };

export type NonNumberNonObjectButDefined = string | boolean | symbol | null;

// export type ObjectWithoutId = Omit<object, 'id'>;
export type ObjectWithoutId = Omit<KeyValueObject, 'id'>;

// export type ObjectWithNonNumberId = object & {
//     id: string | boolean | symbol | null | object | undefined;
// }
export type ObjectWithNonNumberId = {
    [key: string]: any,
    id: string | boolean | symbol | null | object | undefined;
}

// export type ObjectWithNumberId = object & {
//     id: number;
// }
export type ObjectWithNumberId = {
    [key: string]: any,
    id: number;
}

export type DummyAny = string | number | boolean | null | undefined | object | symbol | void | Function | never;