[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Deque

# Class: Deque\<E, R\>

Defined in: [data-structures/queue/deque.ts:85](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L85)

Deque implemented with circular buckets allowing O(1) amortized push/pop at both ends.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// Deque as sliding window for stream processing
 interface DataPoint {
      timestamp: number;
      value: number;
      sensor: string;
    }

    // Create a deque-based sliding window for real-time data aggregation
    const windowSize = 3;
    const dataWindow = new Deque<DataPoint>();

    // Simulate incoming sensor data stream
    const incomingData: DataPoint[] = [
      { timestamp: 1000, value: 25.5, sensor: 'temp-01' },
      { timestamp: 1100, value: 26.2, sensor: 'temp-01' },
      { timestamp: 1200, value: 25.8, sensor: 'temp-01' },
      { timestamp: 1300, value: 27.1, sensor: 'temp-01' },
      { timestamp: 1400, value: 26.9, sensor: 'temp-01' }
    ];

    const windowResults: Array<{ avgValue: number; windowSize: number }> = [];

    for (const dataPoint of incomingData) {
      // Add new data to the end
      dataWindow.push(dataPoint);

      // Remove oldest data when window exceeds size (O(1) from front)
      if (dataWindow.length > windowSize) {
        dataWindow.shift();
      }

      // Calculate average of current window
      let sum = 0;
      for (const point of dataWindow) {
        sum += point.value;
      }
      const avg = sum / dataWindow.length;

      windowResults.push({
        avgValue: Math.round(avg * 10) / 10,
        windowSize: dataWindow.length
      });
    }

    // Verify sliding window behavior
    console.log(windowResults.length); // 5;
    console.log(windowResults[0].windowSize); // 1; // First window has 1 element
    console.log(windowResults[2].windowSize); // 3; // Windows are at max size from 3rd onwards
    console.log(windowResults[4].windowSize); // 3; // Last window still has 3 elements
    console.log(dataWindow.length); // 3;
```

```ts
// Convert deque to array
 const dq = new Deque<number>([10, 20, 30]);
    console.log(dq.toArray()); // [10, 20, 30];
```

## Extends

- [`LinearBase`](LinearBase.md)\<`E`, `R`\>

## Type Parameters

### E

`E` = `any`

### R

`R` = `any`

1. Operations at Both Ends: Supports adding and removing elements at both the front and back of the queue. This allows it to be used as a stack (last in, first out) and a queue (first in, first out).
2. Efficient Random Access: Being based on an array, it offers fast random access capability, allowing constant time access to any element.
3. Continuous Memory Allocation: Since it is based on an array, all elements are stored contiguously in memory, which can bring cache friendliness and efficient memory access.
4. Efficiency: Adding and removing elements at both ends of a deque is usually very fast. However, when the dynamic array needs to expand, it may involve copying the entire array to a larger one, and this operation has a time complexity of O(n).
5. Performance jitter: Deque may experience performance jitter, but DoublyLinkedList will not

## Constructors

### Constructor

```ts
new Deque<E, R>(elements?, options?): Deque<E, R>;
```

Defined in: [data-structures/queue/deque.ts:96](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L96)

Create a Deque and optionally bulk-insert elements.

#### Parameters

##### elements?

`IterableWithSizeOrLength`\<`E`\>

Iterable (or iterable-like) of elements/records to insert.

##### options?

`DequeOptions`\<`E`, `R`\>

Options such as bucketSize, toElementFn, and maxLen.

#### Returns

`Deque`\<`E`, `R`\>

New Deque instance.

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`LinearBase`](LinearBase.md).[`constructor`](LinearBase.md#constructor)

## Properties

### \_compactCounter

```ts
protected _compactCounter: number = 0;
```

Defined in: [data-structures/queue/deque.ts:162](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L162)

Counter for shift/pop operations since last compaction check.
Only checks ratio every `_bucketSize` operations to minimize overhead.

***

### \_toElementFn?

```ts
protected optional _toElementFn?: (rawElement) => E;
```

Defined in: [data-structures/base/iterable-element-base.ts:38](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L38)

The converter used to transform a raw element (`R`) into a public element (`E`).

#### Parameters

##### rawElement

`R`

#### Returns

`E`

#### Remarks

Time O(1), Space O(1).

#### Inherited from

[`LinearBase`](LinearBase.md).[`_toElementFn`](LinearBase.md#toelementfn)

## Accessors

### autoCompactRatio

#### Get Signature

```ts
get autoCompactRatio(): number;
```

Defined in: [data-structures/queue/deque.ts:145](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L145)

Get the auto-compaction ratio.
When `elements / (bucketCount * bucketSize)` drops below this ratio after
enough shift/pop operations, the deque auto-compacts.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Current ratio threshold. 0 means auto-compact is disabled.

#### Set Signature

```ts
set autoCompactRatio(value): void;
```

Defined in: [data-structures/queue/deque.ts:154](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L154)

Set the auto-compaction ratio.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`number`

Ratio in [0,1]. 0 disables auto-compact.

##### Returns

`void`

***

### bucketCount

#### Get Signature

```ts
get bucketCount(): number;
```

Defined in: [data-structures/queue/deque.ts:220](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L220)

Get the number of buckets allocated.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Bucket count.

***

### bucketFirst

#### Get Signature

```ts
get bucketFirst(): number;
```

Defined in: [data-structures/queue/deque.ts:172](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L172)

Get the index of the first bucket in use.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Zero-based bucket index.

***

### bucketLast

#### Get Signature

```ts
get bucketLast(): number;
```

Defined in: [data-structures/queue/deque.ts:196](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L196)

Get the index of the last bucket in use.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Zero-based bucket index.

***

### buckets

#### Get Signature

```ts
get buckets(): E[][];
```

Defined in: [data-structures/queue/deque.ts:232](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L232)

Get the internal buckets array.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E`[][]

Array of buckets storing values.

***

### bucketSize

#### Get Signature

```ts
get bucketSize(): number;
```

Defined in: [data-structures/queue/deque.ts:132](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L132)

Get the current bucket size.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Bucket capacity per bucket.

***

### first

#### Get Signature

```ts
get first(): E | undefined;
```

Defined in: [data-structures/queue/deque.ts:292](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L292)

Get the first element without removing it.

##### Remarks

Time O(1), Space O(1)

##### Example

```ts
const deque = new Deque<number>([10, 20, 30, 40, 50]);

    // Get first element without removing
    const first = deque.at(0);
console.log(first); // 10

    // Get last element without removing
    const last = deque.at(deque.length - 1);
console.log(last); // 50

    // Length unchanged
console.log(deque.length); // 5
```

##### Returns

`E` \| `undefined`

First element or undefined.

 *

***

### firstInBucket

#### Get Signature

```ts
get firstInBucket(): number;
```

Defined in: [data-structures/queue/deque.ts:184](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L184)

Get the index inside the first bucket.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Zero-based index within the first bucket.

***

### last

#### Get Signature

```ts
get last(): E | undefined;
```

Defined in: [data-structures/queue/deque.ts:332](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L332)

Get the last element without removing it.

##### Remarks

Time O(1), Space O(1)

##### Example

```ts
const dq = new Deque<string>(['a', 'b', 'c']);
console.log(dq.last); // 'c'
console.log(dq.first); // 'a'
```

##### Returns

`E` \| `undefined`

Last element or undefined.

 *

***

### lastInBucket

#### Get Signature

```ts
get lastInBucket(): number;
```

Defined in: [data-structures/queue/deque.ts:208](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L208)

Get the index inside the last bucket.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Zero-based index within the last bucket.

***

### length

#### Get Signature

```ts
get length(): number;
```

Defined in: [data-structures/queue/deque.ts:244](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L244)

Get the number of elements in the deque.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Current length.

#### Overrides

[`LinearBase`](LinearBase.md).[`length`](LinearBase.md#length)

***

### maxLen

#### Get Signature

```ts
get maxLen(): number;
```

Defined in: [data-structures/base/linear-base.ts:100](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L100)

Upper bound for length (if positive), or `-1` when unbounded.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Maximum allowed length.

#### Inherited from

[`LinearBase`](LinearBase.md).[`maxLen`](LinearBase.md#maxlen)

***

### toElementFn

#### Get Signature

```ts
get toElementFn(): ((rawElement) => E) | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:47](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L47)

Exposes the current `toElementFn`, if configured.

##### Remarks

Time O(1), Space O(1).

##### Returns

((`rawElement`) => `E`) \| `undefined`

The converter function or `undefined` when not set.

#### Inherited from

[`LinearBase`](LinearBase.md).[`toElementFn`](LinearBase.md#toelementfn)

## Methods

### \_autoCompact()

```ts
protected _autoCompact(): void;
```

Defined in: [data-structures/queue/deque.ts:1101](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1101)

(Protected) Trigger auto-compaction if space utilization drops below threshold.
Only checks every `_bucketSize` operations to minimize hot-path overhead.
Uses element-based ratio: `elements / (bucketCount * bucketSize)`.

#### Returns

`void`

***

### \_createInstance()

```ts
protected _createInstance(options?): this;
```

Defined in: [data-structures/queue/deque.ts:1440](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1440)

(Protected) Create an empty instance of the same concrete class.

#### Parameters

##### options?

`LinearBaseOptions`\<`E`, `R`\>

Options forwarded to the constructor.

#### Returns

`this`

An empty like-kind deque instance.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`_createInstance`](LinearBase.md#createinstance)

***

### \_createLike()

```ts
protected _createLike<T, RR>(elements?, options?): any;
```

Defined in: [data-structures/queue/deque.ts:1458](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1458)

(Protected) Create a like-kind deque seeded by elements.

#### Type Parameters

##### T

`T` = `E`

##### RR

`RR` = `R`

#### Parameters

##### elements?

`IterableWithSizeOrLength`\<`T`\> \| `IterableWithSizeOrLength`\<`RR`\>

Iterable used to seed the new deque.

##### options?

`DequeOptions`\<`T`, `RR`\>

Options forwarded to the constructor.

#### Returns

`any`

A like-kind Deque instance.

#### Remarks

Time O(N), Space O(N)

***

### \_getBucketAndPosition()

```ts
protected _getBucketAndPosition(pos): object;
```

Defined in: [data-structures/queue/deque.ts:1414](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1414)

(Protected) Translate a logical position to bucket/offset.

#### Parameters

##### pos

`number`

Zero-based position.

#### Returns

`object`

An object containing bucketIndex and indexInBucket.

##### bucketIndex

```ts
bucketIndex: number;
```

##### indexInBucket

```ts
indexInBucket: number;
```

#### Remarks

Time O(1), Space O(1)

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<E>;
```

Defined in: [data-structures/queue/deque.ts:1371](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1371)

(Protected) Iterate elements from front to back.

#### Returns

`IterableIterator`\<`E`\>

Iterator of elements.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`_getIterator`](LinearBase.md#getiterator)

***

### \_getReverseIterator()

```ts
protected _getReverseIterator(): IterableIterator<E>;
```

Defined in: [data-structures/queue/deque.ts:1475](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1475)

(Protected) Iterate elements from back to front.

#### Returns

`IterableIterator`\<`E`\>

Iterator of elements.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`_getReverseIterator`](LinearBase.md#getreverseiterator)

***

### \_reallocate()

```ts
protected _reallocate(needBucketNum?): void;
```

Defined in: [data-structures/queue/deque.ts:1385](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1385)

(Protected) Reallocate buckets to make room near the ends.

#### Parameters

##### needBucketNum?

`number`

How many extra buckets to add; defaults to half of current.

#### Returns

`void`

void

#### Remarks

Time O(N), Space O(N)

***

### \_setBucketSize()

```ts
protected _setBucketSize(size): void;
```

Defined in: [data-structures/queue/deque.ts:1351](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1351)

(Protected) Set the internal bucket size.

#### Parameters

##### size

`number`

Bucket capacity to assign.

#### Returns

`void`

void

#### Remarks

Time O(1), Space O(1)

***

### \[iterator\]()

```ts
iterator: IterableIterator<E>;
```

Defined in: [data-structures/base/iterable-element-base.ts:60](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L60)

Returns an iterator over the structure's elements.

#### Parameters

##### args

...`unknown`[]

Optional iterator arguments forwarded to the internal iterator.

#### Returns

`IterableIterator`\<`E`\>

An `IterableIterator<E>` that yields the elements in traversal order.

#### Remarks

Producing the iterator is O(1); consuming the entire iterator is Time O(n) with O(1) extra space.

#### Inherited from

[`LinearBase`](LinearBase.md).[`[iterator]`](LinearBase.md#iterator)

***

### addAt()

```ts
addAt(
   pos, 
   element, 
   num?): boolean;
```

Defined in: [data-structures/queue/deque.ts:777](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L777)

Insert repeated copies of an element at a position.

#### Parameters

##### pos

`number`

Zero-based position from the front.

##### element

`E`

Element to insert.

##### num?

`number` = `1`

Number of times to insert (default 1).

#### Returns

`boolean`

True if inserted.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`addAt`](LinearBase.md#addat)

***

### at()

```ts
at(pos): E | undefined;
```

Defined in: [data-structures/queue/deque.ts:747](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L747)

Get the element at a given position.

#### Parameters

##### pos

`number`

Zero-based position from the front.

#### Returns

`E` \| `undefined`

Element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const dq = new Deque<string>(['a', 'b', 'c']);
console.log(dq.at(0)); // 'a'
console.log(dq.at(2)); // 'c'
```

#### Overrides

[`LinearBase`](LinearBase.md).[`at`](LinearBase.md#at)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/queue/deque.ts:707](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L707)

Remove all elements and reset structure.

#### Returns

`void`

void

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
    dq.clear();
console.log(dq.length); // 0
```

#### Overrides

[`LinearBase`](LinearBase.md).[`clear`](LinearBase.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/queue/deque.ts:1215](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1215)

Deep clone this deque, preserving options.

#### Returns

`this`

A new deque with the same content and options.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
    const copy = dq.clone();
    copy.pop();
console.log(dq.length); // 3
console.log(copy.length); // 2
```

#### Overrides

[`LinearBase`](LinearBase.md).[`clone`](LinearBase.md#clone)

***

### compact()

```ts
compact(): boolean;
```

Defined in: [data-structures/queue/deque.ts:1152](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1152)

Compact the deque by removing unused buckets.

#### Returns

`boolean`

True if compaction was performed (bucket count reduced).

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3, 4, 5]);
    dq.shift();
    dq.shift();
    dq.compact();
console.log(dq.length); // 3
```

***

### concat()

```ts
concat(...items): this;
```

Defined in: [data-structures/base/linear-base.ts:165](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L165)

Concatenate elements and/or containers.

#### Parameters

##### items

...(`E` \| `Deque`\<`E`, `R`\>)[]

Elements or other containers.

#### Returns

`this`

New container with combined elements (`this` type).

#### Remarks

Time O(sum(length)), Space O(sum(length))

#### Inherited from

[`LinearBase`](LinearBase.md).[`concat`](LinearBase.md#concat)

***

### cut()

```ts
cut(pos, isCutSelf?): Deque<E>;
```

Defined in: [data-structures/queue/deque.ts:805](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L805)

Cut the deque to keep items up to index; optionally mutate in-place.

#### Parameters

##### pos

`number`

Last index to keep.

##### isCutSelf?

`boolean` = `false`

When true, mutate this deque; otherwise return a new deque.

#### Returns

`Deque`\<`E`\>

This deque if in-place; otherwise a new deque of the prefix.

#### Remarks

Time O(N), Space O(1)

***

### cutRest()

```ts
cutRest(pos, isCutSelf?): Deque<E>;
```

Defined in: [data-structures/queue/deque.ts:872](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L872)

Cut the deque to keep items from index onward; optionally mutate in-place.

#### Parameters

##### pos

`number`

First index to keep.

##### isCutSelf?

`boolean` = `false`

When true, mutate this deque; otherwise return a new deque.

#### Returns

`Deque`\<`E`\>

This deque if in-place; otherwise a new deque of the suffix.

#### Remarks

Time O(N), Space O(1)

***

### delete()

```ts
delete(element): boolean;
```

Defined in: [data-structures/queue/deque.ts:960](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L960)

Delete the first occurrence of a value.

#### Parameters

##### element

`E`

Element to remove (using the configured equality).

#### Returns

`boolean`

True if an element was removed.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
    dq.delete(2);
console.log(dq.length); // 2
```

#### Overrides

[`LinearBase`](LinearBase.md).[`delete`](LinearBase.md#delete)

***

### deleteAt()

```ts
deleteAt(pos): E | undefined;
```

Defined in: [data-structures/queue/deque.ts:901](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L901)

Delete the element at a given position.

#### Parameters

##### pos

`number`

Zero-based position from the front.

#### Returns

`E` \| `undefined`

Removed element or undefined.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`deleteAt`](LinearBase.md#deleteat)

***

### deleteWhere()

```ts
deleteWhere(predicate): boolean;
```

Defined in: [data-structures/queue/deque.ts:984](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L984)

Delete the first element matching a predicate.

#### Parameters

##### predicate

(`value`, `index`, `deque`) => `boolean`

Function (value, index, deque) → boolean.

#### Returns

`boolean`

True if a match was removed.

#### Remarks

Time O(N), Space O(1)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:86](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L86)

Tests whether all elements satisfy the predicate.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Function invoked for each element with signature `(value, index, self)`.

##### thisArg?

`unknown`

Optional `this` binding for the predicate.

#### Returns

`boolean`

`true` if every element passes; otherwise `false`.

#### Remarks

Time O(n) in the worst case; may exit early when the first failure is found. Space O(1).

#### Example

```ts
const dq = new Deque<number>([2, 4, 6]);
console.log(dq.every(x => x % 2 === 0)); // true
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`every`](LinearBase.md#every)

***

### fill()

```ts
fill(
   value, 
   start?, 
   end?): this;
```

Defined in: [data-structures/base/linear-base.ts:292](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L292)

Fill a range with a value.

#### Parameters

##### value

`E`

Value to set.

##### start?

`number` = `0`

Inclusive start.

##### end?

`number` = `...`

Exclusive end.

#### Returns

`this`

This list.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`LinearBase`](LinearBase.md).[`fill`](LinearBase.md#fill)

***

### filter()

```ts
filter(predicate, thisArg?): this;
```

Defined in: [data-structures/queue/deque.ts:1258](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1258)

Filter elements into a new deque of the same class.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Predicate (value, index, deque) → boolean to keep element.

##### thisArg?

`any`

Value for `this` inside the predicate.

#### Returns

`this`

A new deque with kept elements.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3, 4]);
    const result = dq.filter(x => x > 2);
console.log(result.length); // 2
```

#### Overrides

[`LinearBase`](LinearBase.md).[`filter`](LinearBase.md#filter)

***

### find()

#### Call Signature

```ts
find<S>(predicate, thisArg?): S | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:162](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L162)

Finds the first element that satisfies the predicate and returns it.

Finds the first element of type `S` (a subtype of `E`) that satisfies the predicate and returns it.

##### Type Parameters

###### S

`S`

##### Parameters

###### predicate

`ElementCallback`\<`E`, `R`, `S`\>

Type-guard predicate: `(value, index, self) => value is S`.

###### thisArg?

`unknown`

Optional `this` binding for the predicate.

##### Returns

`S` \| `undefined`

The matched element typed as `S`, or `undefined` if not found.

##### Remarks

Time O(n) in the worst case; may exit early on the first match. Space O(1).

##### Example

```ts
const dq = new Deque<number>([1, 2, 3, 4]);
console.log(dq.find(x => x > 2)); // 3
```

##### Inherited from

[`LinearBase`](LinearBase.md).[`find`](LinearBase.md#find)

#### Call Signature

```ts
find(predicate, thisArg?): E | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:163](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L163)

Finds the first element that satisfies the predicate and returns it.

Finds the first element of type `S` (a subtype of `E`) that satisfies the predicate and returns it.

##### Parameters

###### predicate

`ElementCallback`\<`E`, `R`, `unknown`\>

Type-guard predicate: `(value, index, self) => value is S`.

###### thisArg?

`unknown`

Optional `this` binding for the predicate.

##### Returns

`E` \| `undefined`

The matched element typed as `S`, or `undefined` if not found.

##### Remarks

Time O(n) in the worst case; may exit early on the first match. Space O(1).

##### Example

```ts
const dq = new Deque<number>([1, 2, 3, 4]);
console.log(dq.find(x => x > 2)); // 3
```

##### Inherited from

[`LinearBase`](LinearBase.md).[`find`](LinearBase.md#find)

***

### findIndex()

```ts
findIndex(predicate, thisArg?): number;
```

Defined in: [data-structures/base/linear-base.ts:151](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L151)

Find the first index matching a predicate.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

`(element, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`number`

Index or `-1`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`LinearBase`](LinearBase.md).[`findIndex`](LinearBase.md#findindex)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:132](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L132)

Invokes a callback for each element in iteration order.

#### Parameters

##### callbackfn

`ElementCallback`\<`E`, `R`, `void`\>

Function invoked per element with signature `(value, index, self)`.

##### thisArg?

`unknown`

Optional `this` binding for the callback.

#### Returns

`void`

`void`.

#### Remarks

Time O(n), Space O(1).

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
    const items: number[] = [];
    dq.forEach(x => items.push(x));
console.log(items); // [1, 2, 3]
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`forEach`](LinearBase.md#foreach)

***

### has()

```ts
has(element): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:188](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L188)

Checks whether a strictly-equal element exists in the structure.

#### Parameters

##### element

`E`

The element to test with `===` equality.

#### Returns

`boolean`

`true` if an equal element is found; otherwise `false`.

#### Remarks

Time O(n) in the worst case. Space O(1).

#### Inherited from

[`LinearBase`](LinearBase.md).[`has`](LinearBase.md#has)

***

### indexOf()

```ts
indexOf(searchElement, fromIndex?): number;
```

Defined in: [data-structures/base/linear-base.ts:111](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L111)

First index of a value from the left.

#### Parameters

##### searchElement

`E`

Value to match.

##### fromIndex?

`number` = `0`

Start position (supports negative index).

#### Returns

`number`

Index or `-1` if not found.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const dq = new Deque<string>(['x', 'y', 'z']);
console.log(dq.indexOf('y')); // 1
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`indexOf`](LinearBase.md#indexof)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/queue/deque.ts:670](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L670)

Check whether the deque is empty.

#### Returns

`boolean`

True if length is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const dq = new Deque();
console.log(dq.isEmpty()); // true
```

#### Overrides

[`LinearBase`](LinearBase.md).[`isEmpty`](LinearBase.md#isempty)

***

### join()

```ts
join(separator?): string;
```

Defined in: [data-structures/base/linear-base.ts:228](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L228)

Join all elements into a string.

#### Parameters

##### separator?

`string` = `','`

Separator string.

#### Returns

`string`

Concatenated string.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`LinearBase`](LinearBase.md).[`join`](LinearBase.md#join)

***

### lastIndexOf()

```ts
lastIndexOf(searchElement, fromIndex?): number;
```

Defined in: [data-structures/base/linear-base.ts:131](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L131)

Last index of a value from the right.

#### Parameters

##### searchElement

`E`

Value to match.

##### fromIndex?

`number` = `...`

Start position (supports negative index).

#### Returns

`number`

Index or `-1` if not found.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`LinearBase`](LinearBase.md).[`lastIndexOf`](LinearBase.md#lastindexof)

***

### map()

```ts
map<EM, RM>(
   callback, 
   options?, 
thisArg?): Deque<EM, RM>;
```

Defined in: [data-structures/queue/deque.ts:1325](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1325)

Map elements into a new deque (possibly different element type).

#### Type Parameters

##### EM

`EM`

##### RM

`RM`

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `EM`\>

Mapping function (value, index, deque) → newElement.

##### options?

`IterableElementBaseOptions`\<`EM`, `RM`\>

Options for the output deque (e.g., bucketSize, toElementFn, maxLen).

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`Deque`\<`EM`, `RM`\>

A new Deque with mapped elements.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
    const result = dq.map(x => x * 10);
console.log(result.toArray()); // [10, 20, 30]
```

#### Overrides

[`LinearBase`](LinearBase.md).[`map`](LinearBase.md#map)

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/queue/deque.ts:1277](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1277)

Map elements into a new deque of the same element type.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `E`\>

Mapping function (value, index, deque) → newValue.

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`this`

A new deque with mapped values.

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`LinearBase`](LinearBase.md).[`mapSame`](LinearBase.md#mapsame)

***

### pop()

```ts
pop(): E | undefined;
```

Defined in: [data-structures/queue/deque.ts:462](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L462)

Remove and return the last element.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
console.log(dq.pop()); // 3
console.log(dq.length); // 2
```

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:268](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L268)

Prints `toVisual()` to the console. Intended for quick debugging.

#### Returns

`void`

`void`.

#### Remarks

Time O(n) due to materialization, Space O(n) for the intermediate representation.

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`print`](LinearBase.md#print)

***

### push()

```ts
push(element): boolean;
```

Defined in: [data-structures/queue/deque.ts:408](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L408)

Append one element at the back.

#### Parameters

##### element

`E`

Element to append.

#### Returns

`boolean`

True when appended.

 *

#### Remarks

Time O(1) amortized, Space O(1)

#### Example

```ts
// Create a simple Deque with initial values
    const deque = new Deque([1, 2, 3, 4, 5]);

    // Verify the deque maintains insertion order
console.log([...deque]); // [1, 2, 3, 4, 5]

    // Check length
console.log(deque.length); // 5

    // Push to the end
    deque.push(6);
console.log(deque.length); // 6

    // Pop from the end
    const last = deque.pop();
console.log(last); // 6
```

#### Overrides

[`LinearBase`](LinearBase.md).[`push`](LinearBase.md#push)

***

### pushMany()

```ts
pushMany(elements): boolean[];
```

Defined in: [data-structures/queue/deque.ts:607](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L607)

Append a sequence of elements.

#### Parameters

##### elements

`IterableWithSizeOrLength`\<`E`\> \| `IterableWithSizeOrLength`\<`R`\>

Iterable (or iterable-like) of elements/records.

#### Returns

`boolean`[]

Array of per-element success flags.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`pushMany`](LinearBase.md#pushmany)

***

### reduce()

Reduces all elements to a single accumulated value.

#### Param

Reducer of signature `(acc, value, index, self) => nextAcc`. The first element is used as the initial accumulator.

#### Param

Reducer of signature `(acc, value, index, self) => nextAcc`.

#### Param

The initial accumulator value of type `E`.

#### Template

The accumulator type when it differs from `E`.

#### Param

Reducer of signature `(acc: U, value, index, self) => U`.

#### Param

The initial accumulator value of type `U`.

#### Remarks

Time O(n), Space O(1). Throws if called on an empty structure without `initialValue`.

#### Call Signature

```ts
reduce(callbackfn): E;
```

Defined in: [data-structures/base/iterable-element-base.ts:193](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L193)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`\>

##### Returns

`E`

##### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
console.log(dq.reduce((acc, x) => acc + x, 0)); // 6
```

##### Inherited from

[`LinearBase`](LinearBase.md).[`reduce`](LinearBase.md#reduce)

#### Call Signature

```ts
reduce(callbackfn, initialValue): E;
```

Defined in: [data-structures/base/iterable-element-base.ts:194](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L194)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`\>

###### initialValue

`E`

##### Returns

`E`

##### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
console.log(dq.reduce((acc, x) => acc + x, 0)); // 6
```

##### Inherited from

[`LinearBase`](LinearBase.md).[`reduce`](LinearBase.md#reduce)

#### Call Signature

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-element-base.ts:195](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L195)

##### Type Parameters

###### U

`U`

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`, `U`\>

###### initialValue

`U`

##### Returns

`U`

##### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
console.log(dq.reduce((acc, x) => acc + x, 0)); // 6
```

##### Inherited from

[`LinearBase`](LinearBase.md).[`reduce`](LinearBase.md#reduce)

***

### reduceRight()

```ts
reduceRight<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/linear-base.ts:256](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L256)

Right-to-left reduction over elements.

#### Type Parameters

##### U

`U`

#### Parameters

##### callbackfn

`ReduceLinearCallback`\<`E`, `U`\>

`(acc, element, index, self) => acc`.

##### initialValue

`U`

Initial accumulator (optional generic overloads supported).

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`LinearBase`](LinearBase.md).[`reduceRight`](LinearBase.md#reduceright)

***

### reverse()

```ts
reverse(): this;
```

Defined in: [data-structures/queue/deque.ts:1055](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1055)

Reverse the deque by reversing buckets and pointers.

#### Returns

`this`

This deque.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const deque = new Deque<string>(['A', 'B', 'C', 'D']);

    // Iterate forward
    const forward: string[] = [];
    for (const item of deque) {
      forward.push(item);
    }
console.log(forward); // ['A', 'B', 'C', 'D']

    // Reverse the deque
    deque.reverse();
    const backward: string[] = [];
    for (const item of deque) {
      backward.push(item);
    }
console.log(backward); // ['D', 'C', 'B', 'A']
```

#### Overrides

[`LinearBase`](LinearBase.md).[`reverse`](LinearBase.md#reverse)

***

### setAt()

```ts
setAt(pos, element): boolean;
```

Defined in: [data-structures/queue/deque.ts:761](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L761)

Replace the element at a given position.

#### Parameters

##### pos

`number`

Zero-based position from the front.

##### element

`E`

New element value.

#### Returns

`boolean`

True if updated.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`setAt`](LinearBase.md#setat)

***

### setEquality()

```ts
setEquality(equals): this;
```

Defined in: [data-structures/queue/deque.ts:1002](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1002)

Set the equality comparator used by delete operations.

#### Parameters

##### equals

(`a`, `b`) => `boolean`

Equality predicate (a, b) → boolean.

#### Returns

`this`

This deque.

#### Remarks

Time O(1), Space O(1)

***

### shift()

```ts
shift(): E | undefined;
```

Defined in: [data-structures/queue/deque.ts:516](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L516)

Remove and return the first element.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(1) amortized, Space O(1)

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
console.log(dq.shift()); // 1
console.log(dq.length); // 2
```

***

### slice()

```ts
slice(start?, end?): this;
```

Defined in: [data-structures/base/linear-base.ts:273](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L273)

Create a shallow copy of a subrange.

#### Parameters

##### start?

`number` = `0`

Inclusive start (supports negative index).

##### end?

`number` = `...`

Exclusive end (supports negative index).

#### Returns

`this`

New list with the range (`this` type).

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`LinearBase`](LinearBase.md).[`slice`](LinearBase.md#slice)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:109](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L109)

Tests whether at least one element satisfies the predicate.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Function invoked for each element with signature `(value, index, self)`.

##### thisArg?

`unknown`

Optional `this` binding for the predicate.

#### Returns

`boolean`

`true` if any element passes; otherwise `false`.

#### Remarks

Time O(n) in the worst case; may exit early on first success. Space O(1).

#### Example

```ts
const dq = new Deque<number>([1, 3, 4]);
console.log(dq.some(x => x > 3)); // true
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`some`](LinearBase.md#some)

***

### sort()

```ts
sort(compareFn?): this;
```

Defined in: [data-structures/base/linear-base.ts:185](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L185)

In-place stable order via array sort semantics.

#### Parameters

##### compareFn?

(`a`, `b`) => `number`

Comparator `(a, b) => number`.

#### Returns

`this`

This container.

#### Remarks

Time O(n log n), Space O(n) (materializes to array temporarily)

#### Example

```ts
const dq = new Deque<number>([3, 1, 2]);
    dq.sort((a, b) => a - b);
console.log(dq.toArray()); // [1, 2, 3]
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`sort`](LinearBase.md#sort)

***

### splice()

```ts
splice(
   start, 
   deleteCount?, ...
   items?): this;
```

Defined in: [data-structures/queue/deque.ts:837](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L837)

Remove and/or insert elements at a position (array-like behavior).

#### Parameters

##### start

`number`

Start index (clamped to [0, length]).

##### deleteCount?

`number` = `...`

Number of elements to remove (default: length - start).

##### items?

...`E`[]

Elements to insert after `start`.

#### Returns

`this`

A new deque containing the removed elements (typed as `this`).

#### Remarks

Time O(N + M), Space O(M)

#### Overrides

[`LinearBase`](LinearBase.md).[`splice`](LinearBase.md#splice)

***

### toArray()

```ts
toArray(): E[];
```

Defined in: [data-structures/base/iterable-element-base.ts:245](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L245)

Materializes the elements into a new array.

#### Returns

`E`[]

A shallow array copy of the iteration order.

#### Remarks

Time O(n), Space O(n).

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
console.log(dq.toArray()); // [1, 2, 3]
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`toArray`](LinearBase.md#toarray)

***

### toReversedArray()

```ts
toReversedArray(): E[];
```

Defined in: [data-structures/base/linear-base.ts:237](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L237)

Snapshot elements into a reversed array.

#### Returns

`E`[]

New reversed array.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`LinearBase`](LinearBase.md).[`toReversedArray`](LinearBase.md#toreversedarray)

***

### toVisual()

```ts
toVisual(): E[];
```

Defined in: [data-structures/base/iterable-element-base.ts:257](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L257)

Returns a representation of the structure suitable for quick visualization.
Defaults to an array of elements; subclasses may override to provide richer visuals.

#### Returns

`E`[]

A visual representation (array by default).

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`LinearBase`](LinearBase.md).[`toVisual`](LinearBase.md#tovisual)

***

### unique()

```ts
unique(): this;
```

Defined in: [data-structures/queue/deque.ts:1073](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L1073)

Deduplicate consecutive equal elements in-place.

#### Returns

`this`

This deque.

#### Remarks

Time O(N), Space O(1)

***

### unshift()

```ts
unshift(element): boolean;
```

Defined in: [data-structures/queue/deque.ts:581](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L581)

Prepend one element at the front.

#### Parameters

##### element

`E`

Element to prepend.

#### Returns

`boolean`

True when prepended.

 *

#### Remarks

Time O(1) amortized, Space O(1)

#### Example

```ts
const deque = new Deque<number>([20, 30, 40]);

    // Unshift adds to the front
    deque.unshift(10);
console.log([...deque]); // [10, 20, 30, 40]

    // Shift removes from the front (O(1) complexity!)
    const first = deque.shift();
console.log(first); // 10

    // Verify remaining elements
console.log([...deque]); // [20, 30, 40]
console.log(deque.length); // 3
```

***

### unshiftMany()

```ts
unshiftMany(elements?): boolean[];
```

Defined in: [data-structures/queue/deque.ts:626](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L626)

Prepend a sequence of elements.

#### Parameters

##### elements?

`IterableWithSizeOrLength`\<`E`\> \| `IterableWithSizeOrLength`\<`R`\>

Iterable (or iterable-like) of elements/records.

#### Returns

`boolean`[]

Array of per-element success flags.

#### Remarks

Time O(N), Space O(1)

***

### values()

```ts
values(): IterableIterator<E>;
```

Defined in: [data-structures/base/iterable-element-base.ts:71](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L71)

Returns an iterator over the values (alias of the default iterator).

#### Returns

`IterableIterator`\<`E`\>

An `IterableIterator<E>` over all elements.

#### Remarks

Creating the iterator is O(1); full iteration is Time O(n), Space O(1).

#### Example

```ts
const dq = new Deque<number>([1, 2, 3]);
console.log([...dq.values()]); // [1, 2, 3]
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`values`](LinearBase.md#values)

***

### fromArray()

```ts
static fromArray<E, R>(
   this, 
   data, 
   options?): any;
```

Defined in: [data-structures/queue/deque.ts:348](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/deque.ts#L348)

Create a Deque from an array of elements.

#### Type Parameters

##### E

`E`

##### R

`R` = `any`

#### Parameters

##### this

`Object`

Constructor (subclass) to instantiate.

##### data

`E`[]

Array of elements to insert in order.

##### options?

`DequeOptions`\<`E`, `R`\>

Options forwarded to the constructor.

#### Returns

`any`

A new Deque populated from the array.

#### Remarks

Time O(N), Space O(N)
