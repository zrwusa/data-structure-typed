[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / SegmentTree

# Class: SegmentTree\<E\>

Defined in: [data-structures/binary-tree/segment-tree.ts:30](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L30)

Generic Segment Tree with flat array internals.

Supports any associative merge operation (sum, min, max, gcd, etc.).
Reference: AtCoder Library segtree&lt;S, op, e&gt;.

## Example

```ts
const sumTree = SegmentTree.sum([1, 2, 3, 4, 5]);
sumTree.query(1, 3);    // 9 (2+3+4)
sumTree.update(2, 10);  // [1, 2, 10, 4, 5]
sumTree.query(1, 3);    // 16 (2+10+4)

const minTree = SegmentTree.min([5, 2, 8, 1, 9]);
minTree.query(0, 4);    // 1
```

## Type Parameters

### E

`E` = `number`

## Implements

- `Iterable`\<`E`\>

## Methods

### \[iterator\]()

```ts
iterator: IterableIterator<E>;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:514](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L514)

Iterates over leaf values in index order.

#### Returns

`IterableIterator`\<`E`\>

#### Implementation of

```ts
Iterable.[iterator]
```

***

### get()

```ts
get(index): E;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:312](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L312)

Get element at index.
Time: O(1)

 *

#### Parameters

##### index

`number`

#### Returns

`E`

#### Example

```ts
const st = SegmentTree.sum([10, 20, 30, 40]);
console.log(st.get(0)); // 10
console.log(st.get(2)); // 30
```

***

### maxRight()

```ts
maxRight(left, predicate): number;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:360](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L360)

Find the largest r such that predicate(query(left, r)) is true.
Returns left-1 if predicate(identity) is false.
Returns n-1 if predicate holds for the entire range [left, n-1].
Time: O(log n)

 *

#### Parameters

##### left

`number`

##### predicate

(`segValue`) => `boolean`

#### Returns

`number`

#### Example

```ts
// Prefix sums: find the rightmost index where prefix sum < 10
    const st = SegmentTree.sum([3, 1, 4, 1, 5]);
    // maxRight(0, sum => sum < 10) — prefix [3,4,8,9,14]
    // sum < 10 holds through index 3 (prefix=9), fails at 4 (prefix=14)
    const result = st.maxRight(0, sum => sum < 10);
console.log(result); // 3
```

***

### minLeft()

```ts
minLeft(right, predicate): number;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:443](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L443)

Find the smallest l such that predicate(query(l, right)) is true.
Returns right+1 if predicate(identity) is false.
Returns 0 if predicate holds for the entire range [0, right].
Time: O(log n)

 *

#### Parameters

##### right

`number`

##### predicate

(`segValue`) => `boolean`

#### Returns

`number`

#### Example

```ts
const st = SegmentTree.sum([3, 1, 4, 1, 5]);
    // minLeft(5, sum => sum < 7) — suffix sums from right
    // From right: [5]=5 < 7, [1,5]=6 < 7, [4,1,5]=10 ≥ 7
    const result = st.minLeft(5, sum => sum < 7);
console.log(result); // 3
```

***

### query()

```ts
query(start, end): E;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:250](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L250)

Range query: returns merger result over [start, end] (inclusive).
Time: O(log n)

 *

#### Parameters

##### start

`number`

##### end

`number`

#### Returns

`E`

#### Example

```ts
const tree = SegmentTree.sum([1, 3, 5, 7, 9, 11]);

    // Query sum of range [1, 3] → 3 + 5 + 7 = 15
console.log(tree.query(1, 3)); // 15

    // Query entire range
console.log(tree.query(0, 5)); // 36

    // Query single element
console.log(tree.query(2, 2)); // 5
```

***

### update()

```ts
update(index, value): void;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:193](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L193)

Point update: set element at index to value.
Time: O(log n)

 *

#### Parameters

##### index

`number`

##### value

`E`

#### Returns

`void`

#### Example

```ts
// Monthly revenue data (in thousands)
    const revenue = [120, 95, 140, 110, 85, 130, 150, 100, 160, 125, 90, 175];
    const tree = SegmentTree.sum(revenue);

    // Q1 revenue (Jan-Mar)
console.log(tree.query(0, 2)); // 355

    // Update March revenue from 140 to 200
    tree.update(2, 200);

    // Q1 revenue after update
console.log(tree.query(0, 2)); // 415

    // H1 revenue (Jan-Jun)
console.log(tree.query(0, 5)); // 740
```

***

### max()

```ts
static max(elements): SegmentTree<number>;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:136](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L136)

Create a max segment tree.

#### Parameters

##### elements

`number`[]

#### Returns

`SegmentTree`\<`number`\>

***

### min()

```ts
static min(elements): SegmentTree<number>;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:121](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L121)

Create a min segment tree.

 *

#### Parameters

##### elements

`number`[]

#### Returns

`SegmentTree`\<`number`\>

#### Example

```ts
// Hourly temperatures for a day (24 readings)
    const temps = [18, 17, 16, 15, 16, 18, 21, 24, 27, 29, 31, 32, 33, 32, 31, 29, 27, 25, 23, 21, 20, 19, 18, 17];
    const tree = SegmentTree.sum(temps);

    // Average temperature during work hours (9-17)
    const workSum = tree.query(9, 17);

    // Sum of morning temps (6-11)
console.log(tree.query(6, 11)); // 164
```

***

### sum()

```ts
static sum(elements): SegmentTree<number>;
```

Defined in: [data-structures/binary-tree/segment-tree.ts:72](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/segment-tree.ts#L72)

Create a sum segment tree.

#### Parameters

##### elements

`number`[]

#### Returns

`SegmentTree`\<`number`\>
