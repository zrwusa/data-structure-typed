/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
export class Vector2D {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public w: number = 1 // needed for matrix multiplication
    ) {
    }

    /**
     * The function checks if the x and y values of a point are both zero.
     * @returns A boolean value indicating whether both the x and y properties of the object are equal to 0.
     */
    get isZero(): boolean {
        return this.x === 0 && this.y === 0
    }

    /**
     * The above function calculates the length of a vector using the Pythagorean theorem.
     * @returns The length of a vector, calculated using the Pythagorean theorem.
     */
    get length(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y))
    }

    /**
     * The function calculates the square of the length of a vector.
     * @returns The method is returning the sum of the squares of the x and y values.
     */
    get lengthSq(): number {
        return (this.x * this.x) + (this.y * this.y)
    }

    /**
     * The "rounded" function returns a new Vector2D object with the x and y values rounded to the nearest whole number.
     * @returns The method is returning a new instance of the Vector2D class with the x and y values rounded to the nearest
     * whole number.
     */
    get rounded(): Vector2D {
        return new Vector2D(Math.round(this.x), Math.round(this.y))
    }

    /**
     * The function "add" takes two Vector2D objects as parameters and returns a new Vector2D object with the sum of their
     * x and y components.
     * @param {Vector2D} vector1 - The parameter `vector1` is an instance of the `Vector2D` class. It represents a
     * 2-dimensional vector with an `x` and `y` component.
     * @param {Vector2D} vector2 - The parameter "vector2" is of type Vector2D. It represents a 2-dimensional vector with
     * an x and y component.
     * @returns The method is returning a new instance of the Vector2D class with the x and y components of the two input
     * vectors added together.
     */
    static add(vector1: Vector2D, vector2: Vector2D): Vector2D {
        return new Vector2D(vector1.x + vector2.x, vector1.y + vector2.y)
    }

    /**
     * The subtract function takes two Vector2D objects as parameters and returns a new Vector2D object with the x and y
     * components subtracted.
     * @param {Vector2D} vector1 - The parameter `vector1` is an instance of the `Vector2D` class, representing a
     * 2-dimensional vector. It has properties `x` and `y` which represent the x and y components of the vector
     * respectively.
     * @param {Vector2D} vector2 - The parameter "vector2" is a Vector2D object. It represents the second vector that you
     * want to subtract from the first vector.
     * @returns The method is returning a new Vector2D object with the x and y components subtracted from vector1 and
     * vector2.
     */
    static subtract(vector1: Vector2D, vector2: Vector2D): Vector2D {
        return new Vector2D(vector1.x - vector2.x, vector1.y - vector2.y)
    }

    /**
     * The function subtracts a given value from the x and y components of a Vector2D object and returns a new Vector2D
     * object.
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D, which represents a 2-dimensional vector with
     * x and y components.
     * @param {number} value - The "value" parameter is a number that will be subtracted from both the x and y components
     * of the "vector" parameter.
     * @returns A new Vector2D object with the x and y values subtracted by the given value.
     */
    static subtractValue(vector: Vector2D, value: number): Vector2D {
        return new Vector2D(vector.x - value, vector.y - value)
    }

    /**
     * The function multiplies a Vector2D object by a given value.
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D, which represents a 2-dimensional vector with
     * x and y components.
     * @param {number} value - The "value" parameter is a number that represents the value by which the x and y components
     * of the vector will be multiplied.
     * @returns A new Vector2D object with the x and y values multiplied by the given value.
     */
    static multiply(vector: Vector2D, value: number): Vector2D {
        return new Vector2D(vector.x * value, vector.y * value)
    }

    /**
     * The function divides the x and y components of a Vector2D by a given value and returns a new Vector2D.
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D, which represents a 2-dimensional vector with
     * x and y components.
     * @param {number} value - The value parameter is a number that will be used to divide the x and y components of the
     * vector.
     * @returns A new instance of the Vector2D class with the x and y values divided by the given value.
     */
    static divide(vector: Vector2D, value: number): Vector2D {
        return new Vector2D(vector.x / value, vector.y / value)
    }

    /**
     * The function checks if two Vector2D objects are equal by comparing their x and y values.
     * @param {Vector2D} vector1 - The parameter `vector1` is of type `Vector2D`, which represents a 2-dimensional vector.
     * It has two properties: `x` and `y`, which represent the x and y components of the vector, respectively.
     * @param {Vector2D} vector2 - The parameter "vector2" is of type Vector2D.
     * @returns a boolean value, which indicates whether the two input vectors are equal or not.
     */
    static equals(vector1: Vector2D, vector2: Vector2D): boolean {
        return vector1.x === vector2.x && vector1.y === vector2.y
    }

    /**
     * The function checks if two Vector2D objects are equal within a specified rounding factor.
     * @param {Vector2D} vector1 - The first vector to compare.
     * @param {Vector2D} vector2 - The parameter "vector2" is a Vector2D object, which represents a 2-dimensional vector.
     * It is used as one of the inputs for the "equalsRounded" function.
     * @param [roundingFactor=12] - The roundingFactor parameter is used to determine the threshold for considering two
     * vectors as equal. If the absolute difference in the x and y components of the vectors is less than the
     * roundingFactor, the vectors are considered equal.
     * @returns a boolean value.
     */
    static equalsRounded(vector1: Vector2D, vector2: Vector2D, roundingFactor = 12): boolean {
        const vector = Vector2D.abs(Vector2D.subtract(vector1, vector2))
        if (vector.x < roundingFactor && vector.y < roundingFactor) {
            return true
        }

        return false
    }

    /**
     * The normalize function takes a vector as input and returns a normalized version of the vector.Normalizes the vector if it matches a certain condition
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D.
     * @returns the normalized vector if its length is greater than a very small value (epsilon), otherwise it returns the
     * original vector.
     */
    static normalize(vector: Vector2D): Vector2D {
        const length = vector.length
        if (length > 2.220446049250313e-16) { // Epsilon
            return Vector2D.divide(vector, length)
        }

        return vector
    }

    /**
     * The function truncates a vector to a maximum length if it exceeds that length.Adjusts x and y so that the length of the vector does not exceed max
     * @param {Vector2D} vector - A 2D vector represented by the Vector2D class.
     * @param {number} max - The `max` parameter is a number that represents the maximum length that the `vector` should
     * have.
     * @returns either the original vector or a truncated version of the vector, depending on whether the length of the
     * vector is greater than the maximum value specified.
     */
    static truncate(vector: Vector2D, max: number): Vector2D {
        if (vector.length > max) {
            return Vector2D.multiply(Vector2D.normalize(vector), max)
        }

        return vector
    }

    /**
     * The function returns a new Vector2D object that is perpendicular to the input vector.The vector that is perpendicular to this one
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D.
     * @returns A new Vector2D object is being returned.
     */
    static perp(vector: Vector2D): Vector2D {
        return new Vector2D(-vector.y, vector.x)
    }

    /**
     * The reverse function takes a Vector2D object and returns a new Vector2D object with the negated x and y values.
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D, which represents a 2-dimensional vector. It
     * has two properties: "x" and "y", which represent the x and y components of the vector, respectively.
     * @returns A new Vector2D object with the negated x and y values of the input vector. Returns the vector that is the reverse of this vector
     */
    static reverse(vector: Vector2D): Vector2D {
        return new Vector2D(-vector.x, -vector.y)
    }

    /**
     * The function takes a Vector2D object as input and returns a new Vector2D object with the absolute values of its x
     * and y components.
     * @param {Vector2D} vector - The parameter "vector" is of type Vector2D, which represents a 2-dimensional vector. It
     * has two properties: "x" and "y", which represent the x and y components of the vector, respectively.
     * @returns The method is returning a new Vector2D object with the absolute values of the x and y components of the
     * input vector.
     */
    static abs(vector: Vector2D): Vector2D {
        return new Vector2D(Math.abs(vector.x), Math.abs(vector.y))
    }

    /**
     * The dot function calculates the dot product of two 2D vectors.The dot product of v1 and v2
     * @param {Vector2D} vector1 - The parameter `vector1` represents a 2D vector with its x and y components.
     * @param {Vector2D} vector2 - The "vector2" parameter is a Vector2D object. It represents a two-dimensional vector
     * with an x and y component.
     * @returns The dot product of the two input vectors.
     */
    static dot(vector1: Vector2D, vector2: Vector2D): number {
        return (vector1.x * vector2.x) + (vector1.y * vector2.y)
    }

    // /**
    //  * Transform vectors based on the current tranformation matrices: translation, rotation and scale
    //  * @param vectors The vectors to transform
    //  */
    // static transform(vector: Vector2D, transformation: Matrix2D): Vector2D {
    //     return Matrix2D.multiplyByVector(transformation, vector)
    // }

    // /**
    //  * Transform vectors based on the current tranformation matrices: translation, rotation and scale
    //  * @param vectors The vectors to transform
    //  */
    // static transformList(vectors: Vector2D[], transformation: Matrix2D): Vector2D[] {
    //     return vectors.map(vector => Matrix2D.multiplyByVector(transformation, vector))
    // }

    /**
     * The function calculates the distance between two points in a two-dimensional space.
     * @param {Vector2D} vector1 - The parameter `vector1` represents the first vector in 2D space, while `vector2`
     * represents the second vector. Each vector has an `x` and `y` component, which represent their respective coordinates
     * in the 2D space.
     * @param {Vector2D} vector2 - The `vector2` parameter represents the second vector in the calculation of distance. It
     * is an instance of the `Vector2D` class, which typically has properties `x` and `y` representing the coordinates of
     * the vector in a 2D space.
     * @returns The distance between vector1 and vector2.
     */
    static distance(vector1: Vector2D, vector2: Vector2D): number {
        const ySeparation = vector2.y - vector1.y
        const xSeparation = vector2.x - vector1.x
        return Math.sqrt((ySeparation * ySeparation) + (xSeparation * xSeparation))
    }

    /**
     * The function calculates the squared distance between two 2D vectors.
     * @param {Vector2D} vector1 - The parameter `vector1` represents the first vector, which is an instance of the
     * `Vector2D` class. It contains the x and y coordinates of the vector.
     * @param {Vector2D} vector2 - The `vector2` parameter represents the second vector in a two-dimensional space. It has
     * properties `x` and `y` which represent the coordinates of the vector.
     * @returns the square of the distance between the two input vectors.
     */
    static distanceSq(vector1: Vector2D, vector2: Vector2D): number {
        const ySeparation = vector2.y - vector1.y
        const xSeparation = vector2.x - vector1.x
        return (ySeparation * ySeparation) + (xSeparation * xSeparation)
    }

    /**
     * The sign function determines the sign of the cross product between two 2D vectors.
     * (assuming the Y axis is pointing down, X axis to right like a Window app)
     * @param {Vector2D} vector1 - The parameter `vector1` is of type `Vector2D`, which represents a 2-dimensional vector.
     * It likely has properties `x` and `y` representing the x and y components of the vector, respectively.
     * @param {Vector2D} vector2 - The above code defines a function called "sign" that takes two parameters: vector1 and
     * vector2. Both vector1 and vector2 are of type Vector2D.
     * @returns either -1 or 1. Returns positive if v2 is clockwise of this vector, negative if counterclockwise
     */
    static sign(vector1: Vector2D, vector2: Vector2D): number {
        if (vector1.y * vector2.x > vector1.x * vector2.y) {
            return -1
        }

        return 1
    }

    /**
     * The function calculates the angle between a given vector and the negative y-axis.
     * @param {Vector2D} vector - The "vector" parameter is an instance of the Vector2D class, which represents a
     * 2-dimensional vector. It has two properties: "x" and "y", which represent the x and y components of the vector,
     * respectively.
     * @returns the angle between the given vector and the vector (0, -1) in radians.Returns the angle between origin and the given vector in radians
     */
    static angle(vector: Vector2D): number {
        const origin = new Vector2D(0, -1)
        const radian = Math.acos(Vector2D.dot(vector, origin) / (vector.length * origin.length))
        return Vector2D.sign(vector, origin) === 1 ? ((Math.PI * 2) - radian) : radian
    }

    /**
     * The function "random" generates a random Vector2D object with x and y values within the specified range.
     * @param {number} maxX - The maxX parameter represents the maximum value for the x-coordinate of the random vector.
     * @param {number} maxY - The `maxY` parameter represents the maximum value for the y-coordinate of the generated
     * random vector.
     * @returns a new instance of the Vector2D class with random x and y values.
     */
    static random(maxX: number, maxY: number): Vector2D {
        const randX = Math.floor(Math.random() * maxX - (maxX / 2))
        const randY = Math.floor(Math.random() * maxY - (maxY / 2))
        return new Vector2D(randX, randY)
    }

    /**
     * The function sets the values of x and y to zero.
     */
    zero(): void {
        this.x = 0
        this.y = 0
    }
}

export default Vector2D