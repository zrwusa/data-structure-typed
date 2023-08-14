/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
export class CoordinateMap<V> extends Map<any, V> {
    private readonly _joint: string = '_';

    constructor(joint?: string) {
        super();
        if (joint !== undefined) this._joint = joint;
    }

    /**
     * The "has" function overrides the base class's "has" function and checks if a key exists in the map by joining the
     * key array with a specified delimiter.
     * @param {number[]} key - The parameter "key" is an array of numbers.
     * @returns The `has` method is being overridden to return the result of calling the `has` method of the superclass
     * (`super.has`) with the `key` array joined together using the `_joint` property.
     */
    override has(key: number[]) {
        return super.has(key.join(this._joint));
    }

    /**
     * The function overrides the set method of a Map object to convert the key from an array to a string using a specified
     * delimiter before calling the original set method.
     * @param {number[]} key - The key parameter is an array of numbers.
     * @param {V} value - The value parameter is the value that you want to associate with the specified key.
     * @returns The `set` method is returning the result of calling the `set` method of the superclass
     * (`super.set(key.join(this._joint), value)`).
     */
    override set(key: number[], value: V) {
        return super.set(key.join(this._joint), value);
    }

    /**
     * The function overrides the get method to join the key array with a specified joint and then calls the super get
     * method.
     * @param {number[]} key - An array of numbers
     * @returns The code is returning the value associated with the specified key in the map.
     */
    override get(key: number[]) {
        return super.get(key.join(this._joint));
    }

    /**
     * The function overrides the delete method and joins the key array using a specified joint character before calling
     * the super delete method.
     * @param {number[]} key - An array of numbers that represents the key to be deleted.
     * @returns The `delete` method is returning the result of calling the `delete` method on the superclass, with the
     * `key` array joined together using the `_joint` property.
     */
    override delete(key: number[]) {
        return super.delete(key.join(this._joint));
    }
}