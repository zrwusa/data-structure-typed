/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
export class CoordinateSet extends Set {
    private readonly _joint: string = '_';

    constructor(joint?: string) {
        super();
        if (joint !== undefined) this._joint = joint;
    }

    /**
     * The "has" function overrides the "has" method of the superclass and checks if a value exists in an array after
     * joining its elements with a specified separator.
     * @param {number[]} value - The parameter "value" is an array of numbers.
     * @returns The overridden `has` method is returning the result of calling the `has` method of the superclass, passing
     * in the joined value as an argument.
     */
    override has(value: number[]) {
        return super.has(value.join(this._joint));
    }

    /**
     * The "add" function overrides the parent class's "add" function by joining the elements of the input array with a
     * specified delimiter before calling the parent class's "add" function.
     * @param {number[]} value - An array of numbers
     * @returns The overridden `add` method is returning the result of calling the `add` method of the superclass
     * (`super.add`) with the joined string representation of the `value` array (`value.join(this._joint)`).
     */
    override add(value: number[]) {
        return super.add(value.join(this._joint));
    }

    /**
     * The function overrides the delete method and deletes an element from a Set by joining the elements of the input
     * array with a specified joint and then calling the delete method of the parent class.
     * @param {number[]} value - An array of numbers
     * @returns The `delete` method is returning the result of calling the `delete` method of the superclass, with the
     * `value` array joined together using the `_joint` property.
     */
    override delete(value: number[]) {
        return super.delete(value.join(this._joint));
    }
}