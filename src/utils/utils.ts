/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {Thunk, ToThunkFn, TrlAsyncFn, TrlFn} from './types';

export const uuidV4 = function () {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const arrayRemove = function <T>(array: T[], predicate: (item: T, index: number, array: T[]) => boolean): T[] {
    let i = -1, len = array ? array.length : 0;
    const result = [];

    while (++i < len) {
        const value = array[i];
        if (predicate(value, i, array)) {
            result.push(value);
            Array.prototype.splice.call(array, i--, 1);
            len--;
        }
    }

    return result;
};


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
