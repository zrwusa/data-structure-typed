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


/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
    NonNumberNonObjectButDefined,
    ObjectWithNonNumberId,
    ObjectWithNumberId,
    ObjectWithoutId,
    Thunk,
    ToThunkFn,
    TrlAsyncFn,
    TrlFn
} from './types';

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

// export class AutoPruneMap<K, V> extends Map<K, V> {
//
//     private _proxySet: Set<V>;
//     get proxySet(): Set<V> {
//         return this._proxySet;
//     }
//
//     set proxySet(value: Set<V>) {
//         this._proxySet = value;
//     }
//
//     private _isEmptyArrayAllowed: boolean;
//
//     get isEmptyArrayAllowed(): boolean {
//         return this._isEmptyArrayAllowed;
//     }
//
//     set isEmptyArrayAllowed(value: boolean) {
//         this._isEmptyArrayAllowed = value;
//     }
//
//     constructor(isEmptyArrayAllowed: boolean = false) {
//         super();
//         this._isEmptyArrayAllowed = isEmptyArrayAllowed;
//         this._proxySet = new Set<V>();
//     }
//
//     set(key: K, value: V): this {
//         if (Array.isArray(value) && !this.proxySet.has(value)) {
//             if(!this.isEmptyArrayAllowed && value.length === 0) return this;
//             value = this.createArrayProxy(value, key);
//             if (!this.proxySet.has(value)) this.proxySet.add(value);
//         }
//         super.set(key, value);
//         return this;
//     }
//
//     private createArrayProxy(array: V & any[], key: K) {
//         const that = this;
//         const proxyHandler: ProxyHandler<V & any[]> = {
//             set(target: any, property: PropertyKey, value: any): boolean {
//                 const result = Reflect.set(target, property, value);
//                 that.checkAndDeleteEmptyArray(key);
//                 return result;
//             },
//             deleteProperty(target: any, property: PropertyKey): boolean {
//                 const result = Reflect.deleteProperty(target, property);
//                 that.checkAndDeleteEmptyArray(key);
//                 return result;
//             },
//         }
//         return new Proxy(array, proxyHandler);
//     }
//
//     private checkAndDeleteEmptyArray(key: K): void {
//         const value = this.get(key);
//
//         if (Array.isArray(value) && value.length === 0) {
//             super.delete(key);
//         }
//     }
// }

export function isNonNumberNonObjectButDefined(val: any): val is NonNumberNonObjectButDefined {
    return typeof val !== 'number' && typeof val !== 'object' && val !== undefined;
}

export function isObjectWithoutId(val: any): val is ObjectWithoutId {
    return typeof val === 'object' && !('id' in val);
}

export function isObjectWithNonNumberId(val: any): val is ObjectWithNonNumberId {
    return typeof val === 'object' && 'id' in val && typeof val.id !== 'number';
}

export function isObjectWithNumberId(val: any): val is ObjectWithNumberId {
    return typeof val === 'object' && 'id' in val && typeof val.id === 'number';
}

export function isNumber(val: any): val is number {
    return typeof val === 'number';
}