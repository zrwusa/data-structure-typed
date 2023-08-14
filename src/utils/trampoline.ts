/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import {Thunk, ToThunkFn, TrlAsyncFn, TrlFn} from './types';

export const THUNK_SYMBOL = Symbol('thunk')

export const isThunk = (fnOrValue: any) => {
    return typeof fnOrValue === 'function' && fnOrValue.__THUNK__ === THUNK_SYMBOL
}

export const toThunk = (fn: ToThunkFn): Thunk => {
    const thunk = () => fn()
    thunk.__THUNK__ = THUNK_SYMBOL
    return thunk
}

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