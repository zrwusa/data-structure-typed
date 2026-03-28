[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / BinaryIndexedTree

# Class: BinaryIndexedTree

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:30](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L30)

Binary Indexed Tree (Fenwick Tree).

Efficient prefix sums and point updates in O(log n).
Standard array-based implementation per C++ competitive programming conventions.

All indices are 0-based externally; internally converted to 1-based for BIT arithmetic.

## Example

```ts
const bit = new BinaryIndexedTree(6);
bit.update(0, 3);   // index 0 += 3
bit.update(1, 2);   // index 1 += 2
bit.update(2, 7);   // index 2 += 7

bit.query(2);       // prefix sum [0..2] = 12
bit.queryRange(1, 2); // range sum [1..2] = 9
bit.get(1);         // point value at index 1 = 2
```

## Implements

- `Iterable`\<`number`\>

## Constructors

### Constructor

```ts
new BinaryIndexedTree(sizeOrElements): BinaryIndexedTree;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:38](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L38)

Construct a BIT of given size (all zeros), or from an initial values array.

#### Parameters

##### sizeOrElements

`number` \| `number`[]

number of elements, or an array of initial values

#### Returns

`BinaryIndexedTree`

## Methods

### \_highBit()

```ts
protected _highBit(n): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:564](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L564)

Returns highest power of 2 <= n.

#### Parameters

##### n

`number`

#### Returns

`number`

***

### \_pointQuery()

```ts
protected _pointQuery(pos): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:543](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L543)

1-based point query: get exact value at pos.

#### Parameters

##### pos

`number`

#### Returns

`number`

***

### \_pointUpdate()

```ts
protected _pointUpdate(pos, delta): void;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:535](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L535)

1-based point update: add delta to position pos.

#### Parameters

##### pos

`number`

##### delta

`number`

#### Returns

`void`

***

### \_prefixSum()

```ts
protected _prefixSum(pos): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:525](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L525)

1-based prefix sum up to pos (inclusive).

#### Parameters

##### pos

`number`

#### Returns

`number`

***

### \[iterator\]()

```ts
iterator: IterableIterator<number>;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:494](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L494)

Iterate over point values in index order.

#### Returns

`IterableIterator`\<`number`\>

#### Implementation of

```ts
Iterable.[iterator]
```

***

### get()

```ts
get(index): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:215](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L215)

Get the point value at index (0-based).
Time: O(log n)

 *

#### Parameters

##### index

`number`

#### Returns

`number`

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3]);
console.log(bit.get(0)); // 1
console.log(bit.get(2)); // 3
```

***

### lowerBound()

```ts
lowerBound(sum): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:384](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L384)

Find the smallest index i such that prefix sum [0..i] >= sum.
Requires all values to be non-negative (behavior undefined otherwise).
Returns size if no such index exists.
Time: O(log n)

 *

#### Parameters

##### sum

`number`

#### Returns

`number`

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3, 4]);
    const idx = bit.lowerBound(4);
console.log(idx); // >= 0
```

***

### query()

```ts
query(index): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:269](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L269)

Prefix sum query: returns sum of elements [0..index] (inclusive, 0-based).
Time: O(log n)

 *

#### Parameters

##### index

`number`

#### Returns

`number`

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3, 4]);
console.log(bit.query(2)); // 6
```

***

### queryRange()

```ts
queryRange(start, end): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:322](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L322)

Range sum query: returns sum of elements [start..end] (inclusive, 0-based).
Time: O(log n)

 *

#### Parameters

##### start

`number`

##### end

`number`

#### Returns

`number`

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3, 4]);
console.log(bit.queryRange(1, 2)); // 5
```

***

### set()

```ts
set(index, value): void;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:160](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L160)

Point set: set the value at index to an absolute value (0-based).
Time: O(log n)

 *

#### Parameters

##### index

`number`

##### value

`number`

#### Returns

`void`

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3]);
    bit.set(1, 10);
console.log(bit.get(1)); // 10
```

***

### toArray()

```ts
toArray(): number[];
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:483](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L483)

Returns the point values as a plain array.
Time: O(n log n)

 *

#### Returns

`number`[]

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3]);
console.log(bit.toArray()); // [1, 2, 3]
```

***

### update()

```ts
update(index, delta): void;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:105](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L105)

Point update: add delta to the value at index (0-based).
Time: O(log n)

 *

#### Parameters

##### index

`number`

##### delta

`number`

#### Returns

`void`

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3, 4, 5]);
    bit.update(2, 7);
console.log(bit.get(2)); // 10
```

***

### upperBound()

```ts
upperBound(sum): number;
```

Defined in: [data-structures/binary-tree/binary-indexed-tree.ts:426](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-indexed-tree.ts#L426)

Find the smallest index i such that prefix sum [0..i] > sum.
Requires all values to be non-negative (behavior undefined otherwise).
Returns size if no such index exists.
Time: O(log n)

 *

#### Parameters

##### sum

`number`

#### Returns

`number`

#### Example

```ts
const bit = new BinaryIndexedTree([1, 2, 3, 4]);
    const idx = bit.upperBound(4);
console.log(idx); // >= 0
```
