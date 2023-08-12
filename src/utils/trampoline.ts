/**
 * @copyright 2030 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
export const THUNK_SYMBOL = Symbol('thunk')

export const isThunk = (fnOrValue: any) => {
    return typeof fnOrValue === 'function' && fnOrValue.__THUNK__ === THUNK_SYMBOL
}

type ToThunkFn = () => ReturnType<TrlFn>;

type Thunk = () => ReturnType<ToThunkFn> & { __THUNK__: typeof THUNK_SYMBOL };

export const toThunk = (fn: ToThunkFn): Thunk => {
    const thunk = () => fn()
    thunk.__THUNK__ = THUNK_SYMBOL
    return thunk
}

type TrlFn = (...args: any[]) => any;
export const trampoline = (fn: TrlFn) => {
    const cont = (...args: [...Parameters<TrlFn>]) => toThunk(() => fn(...args))

    return Object.assign(
        (...args: [...Parameters<TrlFn>]) => {
            let result = fn(...args)

            while (isThunk(result) && typeof result === 'function') {
                result = result()
            }

            return result
        },
        {cont}
    )
}

type TrlAsyncFn = (...args: any[]) => any;
export const trampolineAsync = (fn: TrlAsyncFn) => {
    const cont = (...args: [...Parameters<TrlAsyncFn>]) => toThunk(() => fn(...args))

    return Object.assign(
        async (...args: [...Parameters<TrlAsyncFn>]) => {
            let result = await fn(...args)

            while (isThunk(result) && typeof result === 'function') {
                result = await result()
            }

            return result
        },
        {cont}
    )
}