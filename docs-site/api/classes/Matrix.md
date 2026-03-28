[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Matrix

# Class: Matrix

Defined in: [data-structures/matrix/matrix.ts:97](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L97)

Matrix — a numeric matrix with standard linear algebra operations.

## Examples

```ts
// Basic matrix arithmetic
 const a = new Matrix([
      [1, 2],
      [3, 4]
    ]);
    const b = new Matrix([
      [5, 6],
      [7, 8]
    ]);

    const sum = a.add(b);
    console.log(sum?.data); // [
 //      [6, 8],
 //      [10, 12]
 //    ];

    const diff = b.subtract(a);
    console.log(diff?.data); // [
 //      [4, 4],
 //      [4, 4]
 //    ];
```

```ts
// Matrix multiplication for transformations
 // 2x3 matrix * 3x2 matrix = 2x2 matrix
    const a = new Matrix([
      [1, 2, 3],
      [4, 5, 6]
    ]);
    const b = new Matrix([
      [7, 8],
      [9, 10],
      [11, 12]
    ]);

    const product = a.multiply(b);
    console.log(product?.rows); // 2;
    console.log(product?.cols); // 2;
    // Row 0: 1*7+2*9+3*11=58, 1*8+2*10+3*12=64
    // Row 1: 4*7+5*9+6*11=139, 4*8+5*10+6*12=154
    console.log(product?.data); // [
 //      [58, 64],
 //      [139, 154]
 //    ];
```

```ts
// Matrix transpose (square matrix)
 const m = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);

    const transposed = m.transpose();
    console.log(transposed.rows); // 3;
    console.log(transposed.cols); // 3;
    console.log(transposed.data); // [
 //      [1, 4, 7],
 //      [2, 5, 8],
 //      [3, 6, 9]
 //    ];

    // Transpose of transpose = original
    console.log(transposed.transpose().data); // m.data;
```

```ts
// Get and set individual cells
 const m = new Matrix([
      [0, 0, 0],
      [0, 0, 0]
    ]);

    m.set(0, 1, 42);
    m.set(1, 2, 99);

    console.log(m.get(0, 1)); // 42;
    console.log(m.get(1, 2)); // 99;
    console.log(m.get(0, 0)); // 0;

    // Out of bounds returns undefined
    console.log(m.get(5, 5)); // undefined;
```

## Constructors

### Constructor

```ts
new Matrix(data, options?): Matrix;
```

Defined in: [data-structures/matrix/matrix.ts:105](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L105)

The constructor function initializes a matrix object with the provided data and options, or with
default values if no options are provided.

#### Parameters

##### data

`number`[][]

A 2D array of numbers representing the data for the matrix.

##### options?

`MatrixOptions`

The `options` parameter is an optional object that can contain the following
properties:

#### Returns

`Matrix`

## Accessors

### addFn

#### Get Signature

```ts
get addFn(): (a, b) => number | undefined;
```

Defined in: [data-structures/matrix/matrix.ts:164](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L164)

The above function returns the value of the _addFn property.

##### Returns

The value of the property `_addFn` is being returned.

(`a`, `b`) => `number` \| `undefined`

***

### cols

#### Get Signature

```ts
get cols(): number;
```

Defined in: [data-structures/matrix/matrix.ts:146](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L146)

The function returns the value of the protected variable _cols.

##### Returns

`number`

The number of columns.

***

### data

#### Get Signature

```ts
get data(): number[][];
```

Defined in: [data-structures/matrix/matrix.ts:156](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L156)

The function returns a two-dimensional array of numbers.

##### Returns

`number`[][]

The data property, which is a two-dimensional array of numbers.

***

### multiplyFn

#### Get Signature

```ts
get multiplyFn(): (a, b) => number;
```

Defined in: [data-structures/matrix/matrix.ts:180](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L180)

The function returns the value of the _multiplyFn property.

##### Returns

The `_multiplyFn` property is being returned.

(`a`, `b`) => `number`

***

### rows

#### Get Signature

```ts
get rows(): number;
```

Defined in: [data-structures/matrix/matrix.ts:136](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L136)

The function returns the number of rows.

##### Returns

`number`

The number of rows.

***

### size

#### Get Signature

```ts
get size(): [number, number];
```

Defined in: [data-structures/matrix/matrix.ts:816](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L816)

Returns [rows, cols] dimensions tuple.

##### Returns

\[`number`, `number`\]

***

### subtractFn

#### Get Signature

```ts
get subtractFn(): (a, b) => number;
```

Defined in: [data-structures/matrix/matrix.ts:172](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L172)

The function returns the value of the _subtractFn property.

##### Returns

The `_subtractFn` property is being returned.

(`a`, `b`) => `number`

## Methods

### \_addScaledRow()

```ts
protected _addScaledRow(
   targetRow, 
   sourceRow, 
   scalar): void;
```

Defined in: [data-structures/matrix/matrix.ts:988](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L988)

The function `_addScaledRow` multiplies a row in a matrix by a scalar value and adds it to another
row.

#### Parameters

##### targetRow

`number`

The targetRow parameter represents the index of the row in which the
scaled values will be added.

##### sourceRow

`number`

The sourceRow parameter represents the index of the row from which the
values will be scaled and added to the targetRow.

##### scalar

`number`

The scalar parameter is a number that is used to scale the values in the
source row before adding them to the target row.

#### Returns

`void`

***

### \_scaleRow()

```ts
protected _scaleRow(row, scalar): void;
```

Defined in: [data-structures/matrix/matrix.ts:970](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L970)

The function scales a specific row in a matrix by a given scalar value.

#### Parameters

##### row

`number`

The `row` parameter represents the index of the row in the matrix that you
want to scale. It is a number that indicates the position of the row within the matrix.

##### scalar

`number`

The scalar parameter is a number that is used to multiply each element in
a specific row of a matrix.

#### Returns

`void`

***

### \_swapRows()

```ts
protected _swapRows(row1, row2): void;
```

Defined in: [data-structures/matrix/matrix.ts:957](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L957)

The function `_swapRows` swaps the positions of two rows in an array.

#### Parameters

##### row1

`number`

The `row1` parameter is the index of the first row that you want to swap.

##### row2

`number`

The `row2` parameter is the index of the second row that you want to swap
with the first row.

#### Returns

`void`

***

### \[iterator\]()

```ts
iterator: IterableIterator<number[]>;
```

Defined in: [data-structures/matrix/matrix.ts:845](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L845)

Iterates over rows.

#### Returns

`IterableIterator`\<`number`[]\>

***

### add()

```ts
add(matrix): Matrix | undefined;
```

Defined in: [data-structures/matrix/matrix.ts:352](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L352)

The `add` function adds two matrices together, returning a new matrix with the result.

#### Parameters

##### matrix

`Matrix`

The `matrix` parameter is an instance of the `Matrix` class.

#### Returns

`Matrix` \| `undefined`

The `add` method returns a new `Matrix` object that represents the result of adding the
current matrix with the provided `matrix` parameter.

 *

#### Example

```ts
const a = new Matrix([
      [1, 2],
      [3, 4]
    ]);
    const b = new Matrix([
      [5, 6],
      [7, 8]
    ]);

    const sum = a.add(b);
      [6, 8],
      [10, 12]
    ]);

    const diff = b.subtract(a);
      [4, 4],
      [4, 4]
    ]);
```

***

### clone()

```ts
clone(): Matrix;
```

Defined in: [data-structures/matrix/matrix.ts:798](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L798)

The `clone` function returns a new instance of the Matrix class with the same data and properties
as the original instance.

#### Returns

`Matrix`

The `clone()` method is returning a new instance of the `Matrix` class with the same data
and properties as the current instance.

***

### dot()

```ts
dot(matrix): Matrix | undefined;
```

Defined in: [data-structures/matrix/matrix.ts:747](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L747)

The dot function calculates the dot product of two matrices and returns a new matrix.

#### Parameters

##### matrix

`Matrix`

The `matrix` parameter is an instance of the `Matrix` class.

#### Returns

`Matrix` \| `undefined`

a new Matrix object.

 *

#### Example

```ts
const a = Matrix.from([[1, 2], [3, 4]]);
    const b = Matrix.from([[5, 6], [7, 8]]);
    const result = a.dot(b);
console.log(result?.toArray()); // [[19, 22], [43, 50]]
```

***

### flatten()

```ts
flatten(): number[];
```

Defined in: [data-structures/matrix/matrix.ts:834](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L834)

Returns a flat row-major array.

#### Returns

`number`[]

***

### forEach()

```ts
forEach(callback): void;
```

Defined in: [data-structures/matrix/matrix.ts:864](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L864)

Visits each element with its row and column index.

#### Parameters

##### callback

(`value`, `row`, `col`) => `void`

#### Returns

`void`

***

### get()

```ts
get(row, col): number | undefined;
```

Defined in: [data-structures/matrix/matrix.ts:233](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L233)

The `get` function returns the value at the specified row and column index if it is a valid index.

#### Parameters

##### row

`number`

The `row` parameter represents the row index of the element you want to
retrieve from the data array.

##### col

`number`

The parameter "col" represents the column number of the element you want to
retrieve from the data array.

#### Returns

`number` \| `undefined`

The `get` function returns a number if the provided row and column indices are valid.
Otherwise, it returns `undefined`.

 *

#### Example

```ts
const m = new Matrix([
      [0, 0, 0],
      [0, 0, 0]
    ]);

    m.set(0, 1, 42);
    m.set(1, 2, 99);

console.log(m.get(0, 1)); // 42
console.log(m.get(1, 2)); // 99
console.log(m.get(0, 0)); // 0

    // Out of bounds returns undefined
```

***

### inverse()

```ts
inverse(): Matrix | undefined;
```

Defined in: [data-structures/matrix/matrix.ts:637](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L637)

The `inverse` function calculates the inverse of a square matrix using Gaussian elimination.

#### Returns

`Matrix` \| `undefined`

a Matrix object, which represents the inverse of the original matrix.

 *

#### Example

```ts
const m = Matrix.from([[4, 7], [2, 6]]);
    const inv = m.inverse();
    // A * A^-1 should ≈ Identity
    const product = m.multiply(inv!);
```

***

### isMatchForCalculate()

```ts
isMatchForCalculate(matrix): boolean;
```

Defined in: [data-structures/matrix/matrix.ts:296](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L296)

The function checks if the dimensions of the given matrix match the dimensions of the current
matrix.

#### Parameters

##### matrix

`Matrix`

The parameter `matrix` is of type `Matrix`.

#### Returns

`boolean`

a boolean value.

***

### isValidIndex()

```ts
isValidIndex(row, col): boolean;
```

Defined in: [data-structures/matrix/matrix.ts:788](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L788)

The function checks if a given row and column index is valid within a specified range.

#### Parameters

##### row

`number`

The `row` parameter represents the row index of a two-dimensional array or
matrix. It is a number that indicates the specific row in the matrix.

##### col

`number`

The "col" parameter represents the column index in a two-dimensional array
or grid. It is used to check if the given column index is valid within the bounds of the grid.

#### Returns

`boolean`

A boolean value is being returned.

***

### map()

```ts
map(callback): Matrix;
```

Defined in: [data-structures/matrix/matrix.ts:875](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L875)

Maps each element (number → number) and returns a new Matrix.

#### Parameters

##### callback

(`value`, `row`, `col`) => `number`

#### Returns

`Matrix`

***

### multiply()

```ts
multiply(matrix): Matrix | undefined;
```

Defined in: [data-structures/matrix/matrix.ts:493](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L493)

The `multiply` function performs matrix multiplication between two matrices and returns the result
as a new matrix.

#### Parameters

##### matrix

`Matrix`

The `matrix` parameter is an instance of the `Matrix` class.

#### Returns

`Matrix` \| `undefined`

a new Matrix object.

 *

#### Example

```ts
// 2x3 matrix * 3x2 matrix = 2x2 matrix
    const a = new Matrix([
      [1, 2, 3],
      [4, 5, 6]
    ]);
    const b = new Matrix([
      [7, 8],
      [9, 10],
      [11, 12]
    ]);

    const product = a.multiply(b);
console.log(product?.rows); // 2
console.log(product?.cols); // 2
    // Row 0: 1*7+2*9+3*11=58, 1*8+2*10+3*12=64
    // Row 1: 4*7+5*9+6*11=139, 4*8+5*10+6*12=154
      [58, 64],
      [139, 154]
    ]);
```

***

### set()

```ts
set(
   row, 
   col, 
   value): boolean;
```

Defined in: [data-structures/matrix/matrix.ts:282](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L282)

The set function updates the value at a specified row and column in a two-dimensional array.

#### Parameters

##### row

`number`

The "row" parameter represents the row index of the element in a
two-dimensional array or matrix. It specifies the row where the value will be set.

##### col

`number`

The "col" parameter represents the column index of the element in a
two-dimensional array.

##### value

`number`

The value parameter represents the number that you want to set at the
specified row and column in the data array.

#### Returns

`boolean`

a boolean value. It returns true if the index (row, col) is valid and the value is
successfully set in the data array. It returns false if the index is invalid and the value is not
set.

 *

#### Example

```ts
const m = Matrix.zeros(2, 2);
console.log(m.set(0, 0, 5)); // true
console.log(m.set(1, 1, 10)); // true
console.log(m.get(0, 0)); // 5
console.log(m.get(1, 1)); // 10
```

***

### subtract()

```ts
subtract(matrix): Matrix | undefined;
```

Defined in: [data-structures/matrix/matrix.ts:415](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L415)

The `subtract` function performs element-wise subtraction between two matrices and returns a new
matrix with the result.

#### Parameters

##### matrix

`Matrix`

The `matrix` parameter is an instance of the `Matrix` class. It
represents the matrix that you want to subtract from the current matrix.

#### Returns

`Matrix` \| `undefined`

a new Matrix object with the result of the subtraction operation.

 *

#### Example

```ts
const a = Matrix.from([[5, 6], [7, 8]]);
    const b = Matrix.from([[1, 2], [3, 4]]);
    const result = a.subtract(b);
console.log(result?.toArray()); // [[4, 4], [4, 4]]
```

***

### toArray()

```ts
toArray(): number[][];
```

Defined in: [data-structures/matrix/matrix.ts:827](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L827)

Returns a deep copy of the data as a plain 2D array.

#### Returns

`number`[][]

***

### transpose()

```ts
transpose(): Matrix;
```

Defined in: [data-structures/matrix/matrix.ts:574](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L574)

The transpose function takes a matrix and returns a new matrix that is the transpose of the
original matrix.

#### Returns

`Matrix`

The transpose() function returns a new Matrix object with the transposed data.

 *

#### Example

```ts
const m = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);

    const transposed = m.transpose();
console.log(transposed.rows); // 3
console.log(transposed.cols); // 3
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ]);

    // Transpose of transpose = original
console.log(transposed.transpose().data); // m.data
```

***

### from()

```ts
static from(data): Matrix;
```

Defined in: [data-structures/matrix/matrix.ts:934](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L934)

Creates a Matrix from a plain 2D array (deep copy).

#### Parameters

##### data

`number`[][]

#### Returns

`Matrix`

***

### identity()

```ts
static identity(n): Matrix;
```

Defined in: [data-structures/matrix/matrix.ts:919](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L919)

Creates an n×n identity matrix.

#### Parameters

##### n

`number`

#### Returns

`Matrix`

***

### zeros()

```ts
static zeros(rows, cols): Matrix;
```

Defined in: [data-structures/matrix/matrix.ts:907](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/matrix.ts#L907)

Creates a rows×cols zero matrix.

#### Parameters

##### rows

`number`

##### cols

`number`

#### Returns

`Matrix`
