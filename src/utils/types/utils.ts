export type JSONSerializable = {
    [key: string]: any
}
export type JSONValue = string | number | boolean | undefined | JSONObject;

export interface JSONObject {
    [key: string]: JSONValue;
}

export type AnyFunction<A extends any[] = any[], R = any> = (...args: A) => R;
export type Primitive =
    | number
    | string
    | boolean
    | symbol
    | undefined
    | null
    | void
    | AnyFunction
    | Date;

export type Cast<T, TComplex> = { [M in keyof TComplex]: T };


export type DeepLeavesWrap<T, TComplex> =
    T extends string ? Cast<string, TComplex>
        : T extends number ? Cast<number, TComplex>
            : T extends boolean ? Cast<boolean, TComplex>
                : T extends undefined ? Cast<undefined, TComplex>
                    : T extends null ? Cast<null, TComplex>
                        : T extends void ? Cast<void, TComplex>
                            : T extends symbol ? Cast<symbol, TComplex>
                                : T extends AnyFunction ? Cast<AnyFunction, TComplex>
                                    : T extends Date ? Cast<Date, TComplex>
                                        : {
                                            [K in keyof T]:
                                            T[K] extends (infer U)[] ? DeepLeavesWrap<U, TComplex>[]
                                                : DeepLeavesWrap<T[K], TComplex>;
                                        }


type Json = null | string | number | boolean | Json [] | { [name: string]: Json }

export type TypeName<T> = T extends string
    ? 'string'
    : T extends number
        ? 'number'
        : T extends boolean
            ? 'boolean'
            : T extends undefined
                ? 'undefined'
                : T extends AnyFunction
                    ? 'function'
                    : 'object';

export type JsonKeys<T> = keyof {
    [P in keyof T]: number
}

const arr = ['1', 2, 4, 5, 6] as const;
type Range = typeof arr[number];
const a: Range = 2;


/**
 * A function that emits a side effect and does not return anything.
 */
export type Procedure = (...args: any[]) => void;

export type DebounceOptions = {
    isImmediate?: boolean;
    maxWait?: number;
};

export interface DebouncedFunction<F extends Procedure> {
    cancel: () => void;

    (this: ThisParameterType<F>, ...args: [...Parameters<F>]): void;
}

export type MonthKey =
    'January' |
    'February' |
    'March' |
    'April' |
    'May' |
    'June' |
    'July' |
    'August' |
    'September' |
    'October' |
    'November' |
    'December';

export type Month = { [key in MonthKey]: string }

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export class TreeNode<T> {
    id: string;
    name?: string | undefined;
    value?: T | undefined;
    children?: TreeNode<T>[] | undefined;

    constructor(id: string, name?: string, value?: T, children?: TreeNode<T>[]) {
        this.id = id;
        this.name = name || '';
        this.value = value || undefined;
        this.children = children || [];
    }

    // TODO get set
    // get name (): string | undefined {
    //     return this.name;
    // }
    //
    // set name (name: string | undefined) {
    //     this.name = name;
    // }

    addChildren(children: TreeNode<T> | TreeNode<T> []) {
        if (!this.children) {
            this.children = [];
        }
        if (children instanceof TreeNode) {
            this.children.push(children);
        } else {
            this.children = this.children.concat(children);
        }
    }

    getHeight() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const beginRoot = this;
        let maxDepth = 1;
        if (beginRoot) {
            const bfs = (node: TreeNode<T>, level: number) => {
                if (level > maxDepth) {
                    maxDepth = level;
                }
                const {children} = node;
                if (children) {
                    for (let i = 0, len = children.length; i < len; i++) {
                        bfs(children[i], level + 1);
                    }
                }
            };
            bfs(beginRoot, 1);
        }
        return maxDepth;
    }

}

export type OrderType = 'InOrder' | 'PreOrder' | 'PostOrder'

export type DeepProxy<T> = T extends (...args: any[]) => infer R
    ? (...args: [...Parameters<T>]) => DeepProxy<R>
    : T extends object
        ? { [K in keyof T]: DeepProxy<T[K]> }
        : T;

export type DeepProxyOnChange = (target: any, property: string | symbol, value: any, receiver: any, descriptor: any, result: any) => void;

export type DeepProxyOnGet = (target: any, property: string | symbol, value: any, receiver: any, descriptor: any, result: any) => void;

export type CurryFunc<T> = T extends (...args: infer Args) => infer R
    ? Args extends [infer Arg, ...infer RestArgs]
        ? (arg: Arg) => CurryFunc<(...args: RestArgs) => R>
        : R
    : T;


export type ToThunkFn = () => ReturnType<TrlFn>;
export type Thunk = () => ReturnType<ToThunkFn> & { __THUNK__: Symbol };
export type TrlFn = (...args: any[]) => any;
export type TrlAsyncFn = (...args: any[]) => any;

