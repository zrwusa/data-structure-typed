export type ArgumentTypes<T extends (...args: any[]) => any> =
    T extends (...args: infer A) => any
        ? A
        : never;

export const THUNK_SYMBOL: unique symbol = Symbol('thunk');

export interface Thunk<T> extends Function {
    __THUNK__: typeof THUNK_SYMBOL;

    (): T;
}

export type ThunkOrValue<T> = T | Thunk<T>;

export type UnwrapThunkDeep<T> = {
    0: T extends Thunk<infer U> ? UnwrapThunkDeep<U> : T;
}[
    T extends ThunkOrValue<T> ? 0 : never
    ];

export const isThunk = <T>(value: any): value is Thunk<T> => {
    return typeof value === 'function' && value.__THUNK__ === THUNK_SYMBOL;
};

export const toThunk = <R>(fn: () => R): Thunk<R> => {
    const thunk = () => fn();
    thunk.__THUNK__ = THUNK_SYMBOL;
    return thunk;
};
export type UnwrapPromise<T> = T extends Promise<infer U> ? Exclude<U, Promise<T>> : T;

export type Unbox<T> = UnwrapThunkDeep<UnwrapPromise<T>>;

export type Cont<A extends any[], R> = (...args: A) => Thunk<Unbox<R>>;

export interface Trampoline<F extends ((...args: any[]) => any)> {
    (...args: ArgumentTypes<F>): Unbox<ReturnType<F>>;

    cont: Cont<ArgumentTypes<F>, ReturnType<F>>;
}

export interface TrampolineAsync<F extends ((...args: any[]) => any)> {
    (...args: ArgumentTypes<F>): Promise<Unbox<ReturnType<F>>>;

    cont: Cont<ArgumentTypes<F>, ReturnType<F>>;
}

export const trampoline = <F extends ((...args: any[]) => any)>(fn: F): Trampoline<F> => {
    const cont = (...args: ArgumentTypes<F>) => toThunk(() => fn(...args));

    return Object.assign(
        (...args: ArgumentTypes<F>): Unbox<ReturnType<F>> => {
            let result: ThunkOrValue<ReturnType<F>> = fn(...args);

            while (isThunk<ReturnType<F>>(result)) {
                result = result();
            }

            return result;
        },
        {cont},
    );
};

export const trampolineAsync = <F extends ((...args: any[]) => any)>(fn: F): TrampolineAsync<F> => {
    const cont = (...args: ArgumentTypes<F>) => toThunk(() => fn(...args));

    return Object.assign(
        async (...args: ArgumentTypes<F>): Promise<Unbox<ReturnType<F>>> => {
            let result: ThunkOrValue<ReturnType<F>> = await fn(...args);

            while (isThunk<ReturnType<F>>(result)) {
                result = await result();
            }

            return result;
        },
        {cont},
    );
};


const factorial = trampoline((n: number, acc: number = 1): ThunkOrValue<number> => {
    return n
        // Note: calling factorial.cont instead of factorial directly
        ? factorial.cont(n - 1, acc * n)
        : acc;
});

// factorial(32768)
