import * as _ from 'lodash';
import {AnyFunction} from '../data-structures/types';

export type JSONSerializable = {
    [key: string]: any
}
export type JSONValue = string | number | boolean | undefined | JSONObject;

export interface JSONObject {
    [key: string]: JSONValue;
}

export function randomText(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const uuidV4 = function () {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export class IncrementId {
    private _id: string;
    private readonly _prefix: string;

    constructor(prefix?: string) {
        this._prefix = prefix ? prefix : '';
        this._id = this._prefix + '0';
    }

    getId() {
        const {_id, _prefix} = this;
        if (!_id) {
            this._id = _prefix + '0';
        } else {
            const idNumStr = _id.substr(_prefix.length, _id.length - _prefix.length);
            const newIdNum = parseInt(idNumStr, 10) + 1;
            this._id = _prefix + newIdNum.toString();
        }
        return this._id;
    }
}

export function incrementId(prefix?: string) {
    const _prefix = prefix ? prefix : '';
    let _id = _prefix + '0';
    return function id() {
        const idNumStr = _id.substr(_prefix.length, _id.length - _prefix.length);
        const newIdNum = parseInt(idNumStr, 10) + 1;
        _id = _prefix + newIdNum.toString();
        return _id;
    };
}

export const getValue = <T, K extends keyof T>(obj: T, names: K[]): Array<T[K]> => names.map(i => obj[i]);

export const isObject = (object: string | JSONObject | boolean | AnyFunction | number) => object != null && typeof object === 'object';

export const looseEqual = (a: any, b: any): boolean => a == b;

export const strictEqual = (a: any, b: any): boolean => a === b;

export const strictObjectIsEqual = (a: any, b: any): boolean => Object.is(a, b);

export const deepObjectStrictEqual = (object1: JSONSerializable, object2: JSONSerializable) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepObjectStrictEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
};

export function reverseColor(oldColor: string) {
    const oldColorTemp = '0x' + oldColor.replace(/#/g, '');
    const str = '000000' + (0xFFFFFF - Number(oldColorTemp)).toString(16);
    return '#' + str.substring(str.length - 6, str.length);
}

export const isSameStructure = (objA: unknown, objB: unknown) => {
    const objATraversable = objA as JSONSerializable;
    const objBTraversable = objB as JSONSerializable;
    const objAKeys = Object.keys(objATraversable);
    const objBKeys = Object.keys(objBTraversable);
    let isSame = true;
    if (objAKeys.length !== objBKeys.length) {
        return isSame = false;
    } else {
        objAKeys.forEach((i) => {
            if (!objBKeys.includes(i)) {
                return isSame = false;
            }
        });
        return isSame;
    }
};

export const isLeafParent = (obj: JSONObject) => {
    let isLeaf = true;
    Object.values(obj).forEach(value => {
        if (typeof value === 'object' && value instanceof Array) {
            value.forEach(item => {
                if (typeof item === 'object') {
                    return false;
                }
            });
            return isLeaf = true;
        }
        if (!['string', 'boolean', 'number', 'undefined', 'function'].includes(typeof value) && (value !== null)) {
            return isLeaf = false;
        }
    });
    return isLeaf;
};

export const addDays = (date: Date, days: number): Date => {
    date.setDate(date.getDate() + days);
    return date;
};

export class WaitManager {
    private _time30 = 20000;
    private readonly _nXSpeed: number = 1;

    constructor(nXSpeed?: number) {
        if (nXSpeed === undefined) nXSpeed = 1;
        this._nXSpeed = nXSpeed;
    }

    private _time1 = 1000;

    get time1(): number {
        return this._time1 / this._nXSpeed;
    }

    private _time2 = 2000;

    get time2(): number {
        return this._time2 / this._nXSpeed;
    }

    private _time3 = 3000;

    get time3(): number {
        return this._time3 / this._nXSpeed;
    }

    private _time4 = 4000;

    get time4(): number {
        return this._time4 / this._nXSpeed;
    }

    private _time10 = 10000;

    get time10(): number {
        return this._time10 / this._nXSpeed;
    }

    private _time20 = 20000;

    get time20(): number {
        return this._time20 / this._nXSpeed;
    }

    get time50(): number {
        return this._time30 / this._nXSpeed;
    }

    private _time60 = 60000;

    get time60(): number {
        return this._time60 / this._nXSpeed;
    }

    private _cusTime = 1000;

    get cusTime(): number {
        return this._cusTime / this._nXSpeed;
    }

    set cusTime(v: number) {
        this._cusTime = v;
    }
}

export const wait = async (ms: number, resolveValue?: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const finalResolveValue = resolveValue || true;
            resolve(finalResolveValue);
        }, ms);
    });
};

export function extractValue<Item>(data: { key: string, value: Item }[]) {
    let result: Item[] = [];
    if (data && data.length > 0) {
        result = data.map(item => item.value);
    }
    return result;
}

export function keyValueToArray<Item>(data: { [key: string]: Item }) {
    const itemArray: Array<Item> = [];
    const keys = Object.keys(data);
    for (const i of keys) {
        itemArray.push({...data[i], _id: i});
    }
    return itemArray;
}

export function minuted(time: number) {
    const minutes = Math.floor(time / 60000).toString();
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export function randomDate(start?: Date, end?: Date, specificProbabilityStart?: Date, specificProbability?: number) {
    if (!start) start = new Date('1970-1-1');
    if (!end) end = new Date();

    if (specificProbabilityStart) {
        if (!specificProbability) specificProbability = 0.5;
        if (Math.random() <= specificProbability) {
            return new Date(specificProbabilityStart.getTime() + Math.random() * (end.getTime() - specificProbabilityStart.getTime()));
        }
    }

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const capitalizeWords = (str: string) => str.replace(/(?:^|\s)\S/g, (a: string) => a.toUpperCase());

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const comparerArray = <T>(otherArray: T[], limitKeys?: string[]) => {
    return function (current: T) {
        return otherArray.filter(function (other: T) {
            if (!limitKeys) {
                return _.isEqual(current, other);
            } else {
                // TODO
            }
        }).length == 0;
    };
};

export const onlyInA = <T>(a: T[], b: T[]) => a.filter(comparerArray(b));

export const onlyInB = <T>(a: T[], b: T[]) => b.filter(comparerArray(a));

export const diffAB = <T>(a: T[], b: T[]) => onlyInA(a, b).concat(onlyInB(a, b));

export class StringUtil {
    // camelCase
    static toCamelCase(str: string) {
        return _.camelCase(str);
    }

    // snake_case
    static toSnakeCase(str: string) {
        return _.snakeCase(str);
    }

    // PascalCase
    static toPascalCase(str: string) {
        return _.startCase(_.camelCase(str)).replace(/ /g, '');
    }

    // CONSTANT_CASE
    static toConstantCase(str: string) {
        return _.upperCase(str).replace(/ /g, '_');
    }

    // kebab-case
    static toKebabCase(str: string) {
        return _.kebabCase(str);
    }

    // lowercase
    static toLowerCase(str: string) {
        return _.lowerCase(str).replace(/ /g, '');
    }

    // Title Case
    static toTitleCase(str: string) {
        return _.startCase(_.camelCase(str));
    }

    // Sentence case
    static toSentenceCase(str: string) {
        return _.upperFirst(_.lowerCase(str));
    }

    // path/case
    static toPathCase(str: string) {
        return _.lowerCase(str).replace(/ /g, '/');
    }

    // dot.case
    static toDotCase(str: string) {
        return _.lowerCase(str).replace(/ /g, '.');
    }
}

export type CaseType =
    'camel'
    | 'snake'
    | 'pascal'
    | 'constant'
    | 'kebab'
    | 'lower'
    | 'title'
    | 'sentence'
    | 'path'
    | 'dot';
export const deepKeysConvert = (obj: any, toType?: CaseType): any => {
    const _toType = toType || 'snake';
    if (Array.isArray(obj)) {
        return obj.map(v => deepKeysConvert(v, _toType));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => {
                let newKey = '';
                switch (_toType) {
                    case 'camel':
                        newKey = StringUtil.toCamelCase(key);
                        break;
                    case 'snake':
                        newKey = StringUtil.toSnakeCase(key);
                        break;
                    case 'pascal':
                        newKey = StringUtil.toPascalCase(key);
                        break;
                    case 'constant':
                        newKey = StringUtil.toConstantCase(key);
                        break;
                    case 'kebab':
                        newKey = StringUtil.toKebabCase(key);
                        break;
                    case 'lower':
                        newKey = StringUtil.toLowerCase(key);
                        break;
                    case 'title':
                        newKey = StringUtil.toTitleCase(key);
                        break;
                    case 'sentence':
                        newKey = StringUtil.toSentenceCase(key);
                        break;
                    case 'path':
                        newKey = StringUtil.toPathCase(key);
                        break;
                    case 'dot':
                        newKey = StringUtil.toDotCase(key);
                        break;
                    default:
                        newKey = StringUtil.toDotCase(key);
                        break;
                }
                return {
                    ...result,
                    [newKey]: deepKeysConvert(obj[key], _toType),
                };
            },
            {},
        );
    }
    return obj;
};

export const deepRemoveByKey = (obj: any, keysToBeRemoved: string[]) => {
    const result = _.transform(obj, function (result: JSONSerializable, value: any, key: string) {
        if (_.isObject(value)) {
            value = deepRemoveByKey(value, keysToBeRemoved);
        }
        if (!keysToBeRemoved.includes(key)) {
            _.isArray(obj) ? result.push(value) : result[key] = value;
        }
    });
    return result as typeof obj;
};

export const deepRenameKeys = (obj: JSONSerializable, keysMap: { [key in string]: string }) => {
    return _.transform(obj, function (result: JSONSerializable, value: any, key: string | number) {
        const currentKey = keysMap[key] || key;
        result[currentKey] = _.isObject(value) ? deepRenameKeys(value, keysMap) : value;
    });
};

export const deepReplaceValues = (obj: JSONSerializable, keyReducerMap: { [key in string]: (item: JSONSerializable) => any }) => {
    const newObject = _.clone(obj) as JSONSerializable;
    _.each(obj, (val: any, key: string) => {
        for (const item in keyReducerMap) {
            if (key === item) {
                newObject[key] = keyReducerMap[item](newObject);
            } else if (typeof (val) === 'object' || val instanceof Array) {
                newObject[key] = deepReplaceValues(val, keyReducerMap);
            }
        }
    });
    return newObject;
};

// TODO determine depth and pass root node as a param through callback
export const deepAdd = (obj: JSONSerializable, keyReducerMap: { [key in string]: (item: JSONSerializable) => any }, isItemRootParent?: boolean) => {
    const newObject = _.clone(obj) as JSONObject | [];
    if (_.isObject(newObject) && !_.isArray(newObject)) {
        for (const item in keyReducerMap) {
            newObject[item] = keyReducerMap[item](newObject);
        }
    }
    _.each(obj, (val: any, key: string | number) => {
        if (_.isObject(val)) {
            for (const item in keyReducerMap) {
                // @ts-ignore
                newObject[key] = deepAdd(val, keyReducerMap, isItemRootParent);
            }
        }
    });
    return newObject;
};

const styleString = (color: string) => `color: ${color}; font-weight: bold`;

const styleHeader = (header: string) => `%c[${header}]`;

export const bunnyConsole = {
    log: (headerLog = 'bunny', ...args: any[]) => {
        return console.log(styleHeader(headerLog), styleString('black'), ...args);
    },
    warn: (headerLog = 'bunny', ...args: any[]) => {
        return console.warn(styleHeader(headerLog), styleString('orange'), ...args);
    },
    error: (headerLog = 'bunny', ...args: any[]) => {
        return console.error(styleHeader(headerLog), styleString('red'), ...args);
    }
};

export const timeStart = () => {
    return performance ? performance.now() : new Date().getTime();
};

export const timeEnd = (startTime: number, headerLog?: string, consoleConditionFn?: (timeSpent: number) => boolean) => {
    const timeSpent = (performance ? performance.now() : new Date().getTime()) - startTime;
    const isPassCondition = consoleConditionFn ? consoleConditionFn(timeSpent) : true;
    if (isPassCondition) {
        bunnyConsole.log(headerLog ? headerLog : 'time spent', timeSpent.toFixed(2));
    }
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

export function memo() {
    const cache: { [k: string]: any } = {};
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const cacheKey = `__cacheKey__${args.toString()}`;
            // eslint-disable-next-line no-prototype-builtins
            if (!cache.hasOwnProperty(cacheKey)) {
                cache[cacheKey] = originalMethod.apply(this, args);
            }
            return cache[cacheKey];
        }
    }
}

export function zip<T = number, T1 = number>(array1: T[], array2: T1[], options?: { isToObj: boolean }) {
    const zipped: [T, T1][] = [];
    const zippedObjCoords: { x: T, y: T1 }[] = [];
    const {isToObj} = options ? options : {isToObj: false};
    for (let i = 0; i < array1.length; i++) {
        if (isToObj) {
            zippedObjCoords.push({x: array1[i], y: array2[i]})
        } else {
            zipped.push([array1[i], array2[i]]);
        }
    }
    return isToObj ? zippedObjCoords : zipped;
}