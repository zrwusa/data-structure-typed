[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / MinHeap

# Class: MinHeap\<E, R\>

Defined in: [data-structures/heap/min-heap.ts:86](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/min-heap.ts#L86)

## Examples

```ts
// Merge K sorted arrays
 const arrays = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ];

    // Use min heap to merge: track (value, arrayIndex, elementIndex)
    const heap = new MinHeap<[number, number, number]>([], {
      comparator: (a, b) => a[0] - b[0]
    });

    // Initialize with first element of each array
    arrays.forEach((arr, i) => heap.add([arr[0], i, 0]));

    const merged: number[] = [];
    while (heap.size > 0) {
      const [val, arrIdx, elemIdx] = heap.poll()!;
      merged.push(val);
      if (elemIdx + 1 < arrays[arrIdx].length) {
        heap.add([arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1]);
      }
    }

    console.log(merged); // [1, 2, 3, 4, 5, 6, 7, 8, 9];
```

```ts
// Dijkstra-style shortest distance tracking
 // Simulating distance updates: (distance, nodeId)
    const heap = new MinHeap<[number, string]>([], {
      comparator: (a, b) => a[0] - b[0]
    });

    heap.add([0, 'start']);
    heap.add([10, 'A']);
    heap.add([5, 'B']);
    heap.add([3, 'C']);

    // Process nearest node first
    console.log(heap.poll()); // [0, 'start'];
    console.log(heap.poll()); // [3, 'C'];
    console.log(heap.poll()); // [5, 'B'];
    console.log(heap.poll()); // [10, 'A'];
```

```ts
// Running median with min heap (upper half)
 const upperHalf = new MinHeap<number>();

    // Add larger numbers to min heap
    for (const n of [5, 8, 3, 9, 1]) {
      upperHalf.add(n);
    }

    // Smallest of the upper half is always accessible
    console.log(upperHalf.peek()); // 1;
    console.log(upperHalf.size); // 5;

    // Remove smallest repeatedly
    console.log(upperHalf.poll()); // 1;
    console.log(upperHalf.poll()); // 3;
    console.log(upperHalf.peek()); // 5;
```

## Extends

- [`Heap`](Heap.md)\<`E`, `R`\>

## Type Parameters

### E

`E` = `any`

### R

`R` = `any`

Min-oriented binary heap.
Notes and typical use-cases are documented in [Heap](Heap.md).

1. Complete Binary Tree: Heaps are typically complete binary trees, meaning every level is fully filled except possibly for the last level, which has nodes as far left as possible.
2. MinHeap Properties:  The value of each parent node is less than or equal to the value of its children.
3. Root Node Access: In a heap, the largest element (in a max heap) or the smallest element (in a min heap) is always at the root of the tree.
4. Efficient Insertion and Deletion: Due to its structure, a heap allows for insertion and deletion operations in logarithmic time (O(log n)).
5. Managing Dynamic Data Sets: Heaps effectively manage dynamic data sets, especially when frequent access to the largest or smallest elements is required.
6. Non-linear Search: While a heap allows rapid access to its largest or smallest element, it is less efficient for other operations, such as searching for a specific element, as it is not designed for these tasks.
7. Efficient Sorting Algorithms: For example, heap sort. MinHeap sort uses the properties of a heap to sort elements.
8. Graph Algorithms: Such as Dijkstra's shortest path algorithm and Prim's minimum spanning tree algorithm, which use heaps to improve performance.

## Constructors

### Constructor

```ts
new MinHeap<E, R>(elements?, options?): MinHeap<E, R>;
```

Defined in: [data-structures/heap/min-heap.ts:92](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/min-heap.ts#L92)

Create a min-heap.

#### Parameters

##### elements?

`Iterable`\<`E`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Optional initial elements.

##### options?

`HeapOptions`\<`E`, `R`\>

Optional configuration.

#### Returns

`MinHeap`\<`E`, `R`\>

#### Overrides

[`Heap`](Heap.md).[`constructor`](Heap.md#constructor)

## Properties

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

[`Heap`](Heap.md).[`_toElementFn`](Heap.md#toelementfn)

## Accessors

### comparator

#### Get Signature

```ts
get comparator(): Comparator<E>;
```

Defined in: [data-structures/heap/heap.ts:1030](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L1030)

Get the comparator used to order elements.

##### Remarks

Time O(1), Space O(1)

##### Returns

`Comparator`\<`E`\>

Comparator function.

#### Inherited from

[`Heap`](Heap.md).[`comparator`](Heap.md#comparator)

***

### elements

#### Get Signature

```ts
get elements(): E[];
```

Defined in: [data-structures/heap/heap.ts:180](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L180)

Get the backing array of the heap.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E`[]

Internal elements array.

#### Inherited from

[`Heap`](Heap.md).[`elements`](Heap.md#elements)

***

### leaf

#### Get Signature

```ts
get leaf(): E | undefined;
```

Defined in: [data-structures/heap/heap.ts:233](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L233)

Get the last leaf element.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E` \| `undefined`

Last element or undefined.

#### Inherited from

[`Heap`](Heap.md).[`leaf`](Heap.md#leaf)

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/heap/heap.ts:223](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L223)

Get the number of elements.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Heap size.

 *

#### Inherited from

[`Heap`](Heap.md).[`size`](Heap.md#size)

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

[`Heap`](Heap.md).[`toElementFn`](Heap.md#toelementfn)

## Methods

### \_createInstance()

```ts
protected _createInstance(options?): this;
```

Defined in: [data-structures/heap/heap.ts:1076](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L1076)

(Protected) Create an empty instance of the same concrete class.

#### Parameters

##### options?

`HeapOptions`\<`E`, `R`\>

Options to override comparator or toElementFn.

#### Returns

`this`

A like-kind empty heap instance.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`Heap`](Heap.md).[`_createInstance`](Heap.md#createinstance)

***

### \_createLike()

```ts
protected _createLike<EM, RM>(elements?, options?): Heap<EM, RM>;
```

Defined in: [data-structures/heap/heap.ts:1094](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L1094)

(Protected) Create a like-kind instance seeded by elements.

#### Type Parameters

##### EM

`EM`

##### RM

`RM`

#### Parameters

##### elements?

`Iterable`\<`EM`, `any`, `any`\> \| `Iterable`\<`RM`, `any`, `any`\>

Iterable of elements or raw values to seed.

##### options?

`HeapOptions`\<`EM`, `RM`\>

Options forwarded to the constructor.

#### Returns

[`Heap`](Heap.md)\<`EM`, `RM`\>

A like-kind heap instance.

#### Remarks

Time O(N log N), Space O(N)

#### Inherited from

[`Heap`](Heap.md).[`_createLike`](Heap.md#createlike)

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<E>;
```

Defined in: [data-structures/heap/heap.ts:1034](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L1034)

Internal iterator factory used by the default iterator.

#### Returns

`IterableIterator`\<`E`\>

An iterator over elements.

#### Remarks

Implementations should yield in O(1) per element with O(1) extra space when possible.

#### Inherited from

[`Heap`](Heap.md).[`_getIterator`](Heap.md#getiterator)

***

### \_spawnLike()

```ts
protected _spawnLike<EM, RM>(options?): Heap<EM, RM>;
```

Defined in: [data-structures/heap/heap.ts:1114](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L1114)

(Protected) Spawn an empty like-kind heap instance.

#### Type Parameters

##### EM

`EM`

##### RM

`RM`

#### Parameters

##### options?

`HeapOptions`\<`EM`, `RM`\>

Options forwarded to the constructor.

#### Returns

[`Heap`](Heap.md)\<`EM`, `RM`\>

An empty like-kind heap instance.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`Heap`](Heap.md).[`_spawnLike`](Heap.md#spawnlike)

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

[`Heap`](Heap.md).[`[iterator]`](Heap.md#iterator)

***

### add()

```ts
add(element): boolean;
```

Defined in: [data-structures/heap/heap.ts:316](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L316)

Insert an element.

#### Parameters

##### element

`E`

Element to insert.

#### Returns

`boolean`

True.

 *

#### Remarks

Time O(1) amortized, Space O(1)

#### Example

```ts
const heap = new MinHeap<number>([5, 3, 7]);
    heap.add(1);
console.log(heap.peek()); // 1
```

#### Inherited from

[`Heap`](Heap.md).[`add`](Heap.md#add)

***

### addMany()

```ts
addMany(elements): boolean[];
```

Defined in: [data-structures/heap/heap.ts:355](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L355)

Insert many elements from an iterable.

#### Parameters

##### elements

`Iterable`\<`E` \| `R`\>

Iterable of elements or raw values.

#### Returns

`boolean`[]

Array of per-element success flags.

 *

#### Remarks

Time O(N log N), Space O(1)

#### Example

```ts
const heap = new MinHeap<number>();
    heap.addMany([5, 3, 7, 1]);
console.log(heap.peek()); // 1
```

#### Inherited from

[`Heap`](Heap.md).[`addMany`](Heap.md#addmany)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/heap/heap.ts:599](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L599)

Remove all elements.

#### Returns

`void`

void

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const heap = new MinHeap<number>([1, 2, 3]);
    heap.clear();
console.log(heap.isEmpty()); // true
```

#### Inherited from

[`Heap`](Heap.md).[`clear`](Heap.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/heap/heap.ts:888](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L888)

Deep clone this heap.

#### Returns

`this`

A new heap with the same elements.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const heap = new MinHeap<number>([3, 1, 2]);
    const copy = heap.clone();
    copy.poll();
console.log(heap.size); // 3
```

#### Inherited from

[`Heap`](Heap.md).[`clone`](Heap.md#clone)

***

### delete()

```ts
delete(element): boolean;
```

Defined in: [data-structures/heap/heap.ts:680](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L680)

Delete one occurrence of an element.

#### Parameters

##### element

`E`

Element to delete.

#### Returns

`boolean`

True if an element was removed.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const heap = new MinHeap<number>([3, 1, 2]);
    heap.delete(1);
console.log(heap.peek()); // 2
```

#### Inherited from

[`Heap`](Heap.md).[`delete`](Heap.md#delete)

***

### deleteBy()

```ts
deleteBy(predicate): boolean;
```

Defined in: [data-structures/heap/heap.ts:708](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L708)

Delete the first element that matches a predicate.

#### Parameters

##### predicate

(`element`, `index`, `heap`) => `boolean`

Function (element, index, heap) → boolean.

#### Returns

`boolean`

True if an element was removed.

#### Remarks

Time O(N), Space O(1)

#### Inherited from

[`Heap`](Heap.md).[`deleteBy`](Heap.md#deleteby)

***

### dfs()

```ts
dfs(order?): E[];
```

Defined in: [data-structures/heap/heap.ts:768](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L768)

Traverse the binary heap as a complete binary tree and collect elements.

#### Parameters

##### order?

`DFSOrderPattern` = `'PRE'`

Traversal order: 'PRE' | 'IN' | 'POST'.

#### Returns

`E`[]

Array of visited elements.

 *

#### Remarks

Time O(N), Space O(H)

#### Example

```ts
const heap = new MinHeap<number>([3, 1, 2]);
console.log(heap.dfs('IN').length); // 3
```

#### Inherited from

[`Heap`](Heap.md).[`dfs`](Heap.md#dfs)

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
const heap = new MinHeap<number>([2, 4, 6]);
console.log(heap.every(x => x > 0)); // true
```

#### Inherited from

[`Heap`](Heap.md).[`every`](Heap.md#every)

***

### filter()

```ts
filter(callback, thisArg?): this;
```

Defined in: [data-structures/heap/heap.ts:929](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L929)

Filter elements into a new heap of the same class.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `boolean`\>

Predicate (element, index, heap) → boolean to keep element.

##### thisArg?

`unknown`

Value for `this` inside the callback.

#### Returns

`this`

A new heap with the kept elements.

 *

#### Remarks

Time O(N log N), Space O(N)

#### Example

```ts
const heap = new MinHeap<number>([1, 2, 3, 4, 5]);
    const evens = heap.filter(x => x % 2 === 0);
console.log(evens.size); // 2
```

#### Inherited from

[`Heap`](Heap.md).[`filter`](Heap.md#filter)

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
const heap = new MinHeap<number>([3, 1, 2]);
console.log(heap.find(x => x === 2)); // 2
```

##### Inherited from

[`Heap`](Heap.md).[`find`](Heap.md#find)

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
const heap = new MinHeap<number>([3, 1, 2]);
console.log(heap.find(x => x === 2)); // 2
```

##### Inherited from

[`Heap`](Heap.md).[`find`](Heap.md#find)

***

### fix()

```ts
fix(): boolean[];
```

Defined in: [data-structures/heap/heap.ts:799](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L799)

Restore heap order bottom-up (heapify in-place).

#### Returns

`boolean`[]

Array of per-node results from fixing steps.

#### Remarks

Time O(N), Space O(1)

#### Inherited from

[`Heap`](Heap.md).[`fix`](Heap.md#fix)

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
const heap = new MinHeap<number>([3, 1, 2]);
    const items: number[] = [];
    heap.forEach(x => items.push(x));
console.log(items.length); // 3
```

#### Inherited from

[`Heap`](Heap.md).[`forEach`](Heap.md#foreach)

***

### has()

```ts
has(element): boolean;
```

Defined in: [data-structures/heap/heap.ts:642](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L642)

Check if an equal element exists in the heap.

#### Parameters

##### element

`E`

Element to search for.

#### Returns

`boolean`

True if found.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const heap = new MinHeap<number>([3, 1, 2]);
console.log(heap.has(1)); // true
console.log(heap.has(99)); // false
```

#### Inherited from

[`Heap`](Heap.md).[`has`](Heap.md#has)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/heap/heap.ts:562](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L562)

Check whether the heap is empty.

#### Returns

`boolean`

True if size is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
console.log(new MinHeap<number>().isEmpty()); // true
```

#### Inherited from

[`Heap`](Heap.md).[`isEmpty`](Heap.md#isempty)

***

### map()

```ts
map<EM, RM>(
   callback, 
   options, 
thisArg?): Heap<EM, RM>;
```

Defined in: [data-structures/heap/heap.ts:979](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L979)

Map elements into a new heap of possibly different element type.

#### Type Parameters

##### EM

`EM`

##### RM

`RM`

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `EM`\>

Mapping function (element, index, heap) → newElement.

##### options

`IterableElementBaseOptions`\<`EM`, `RM`\> & `object` & `object`

Options for the output heap, including comparator for EM.

##### thisArg?

`unknown`

Value for `this` inside the callback.

#### Returns

[`Heap`](Heap.md)\<`EM`, `RM`\>

A new heap with mapped elements.

 *

#### Remarks

Time O(N log N), Space O(N)

#### Example

```ts
const heap = new MinHeap<number>([1, 2, 3]);
    const doubled = heap.map(x => x * 2, { comparator: (a, b) => a - b });
console.log(doubled.peek()); // 2
```

#### Inherited from

[`Heap`](Heap.md).[`map`](Heap.md#map)

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/heap/heap.ts:1003](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L1003)

Map elements into a new heap of the same element type.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `E`\>

Mapping function (element, index, heap) → element.

##### thisArg?

`unknown`

Value for `this` inside the callback.

#### Returns

`this`

A new heap with mapped elements.

#### Remarks

Time O(N log N), Space O(N)

#### Inherited from

[`Heap`](Heap.md).[`mapSame`](Heap.md#mapsame)

***

### peek()

```ts
peek(): E | undefined;
```

Defined in: [data-structures/heap/heap.ts:524](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L524)

Get the current top element without removing it.

#### Returns

`E` \| `undefined`

Top element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const heap = new MinHeap<number>([5, 3, 7]);
console.log(heap.peek()); // 3
```

#### Inherited from

[`Heap`](Heap.md).[`peek`](Heap.md#peek)

***

### poll()

```ts
poll(): E | undefined;
```

Defined in: [data-structures/heap/heap.ts:424](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L424)

Remove and return the top element.

#### Returns

`E` \| `undefined`

Top element or undefined.

 *

#### Remarks

Time O(log N), Space O(1)

#### Example

```ts
const heap = new MinHeap<number>([3, 1, 2]);
console.log(heap.poll()); // 1
console.log(heap.peek()); // 2
```

#### Inherited from

[`Heap`](Heap.md).[`poll`](Heap.md#poll)

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
const heap = new MinHeap<number>([3, 1, 2]);
```

#### Inherited from

[`Heap`](Heap.md).[`print`](Heap.md#print)

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
const heap = new MinHeap<number>([1, 2, 3]);
console.log(heap.reduce((acc, x) => acc + x, 0)); // 6
```

##### Inherited from

[`Heap`](Heap.md).[`reduce`](Heap.md#reduce)

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
const heap = new MinHeap<number>([1, 2, 3]);
console.log(heap.reduce((acc, x) => acc + x, 0)); // 6
```

##### Inherited from

[`Heap`](Heap.md).[`reduce`](Heap.md#reduce)

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
const heap = new MinHeap<number>([1, 2, 3]);
console.log(heap.reduce((acc, x) => acc + x, 0)); // 6
```

##### Inherited from

[`Heap`](Heap.md).[`reduce`](Heap.md#reduce)

***

### refill()

```ts
refill(elements): boolean[];
```

Defined in: [data-structures/heap/heap.ts:610](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L610)

Replace the backing array and rebuild the heap.

#### Parameters

##### elements

`Iterable`\<`E`\>

Iterable used to refill the heap.

#### Returns

`boolean`[]

Array of per-node results from fixing steps.

#### Remarks

Time O(N), Space O(N)

#### Inherited from

[`Heap`](Heap.md).[`refill`](Heap.md#refill)

***

### setEquality()

```ts
setEquality(equals): this;
```

Defined in: [data-structures/heap/heap.ts:736](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L736)

Set the equality comparator used by has/delete operations.

#### Parameters

##### equals

(`a`, `b`) => `boolean`

Equality predicate (a, b) → boolean.

#### Returns

`this`

This heap.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`Heap`](Heap.md).[`setEquality`](Heap.md#setequality)

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
const heap = new MinHeap<number>([1, 3, 5]);
console.log(heap.some(x => x === 3)); // true
```

#### Inherited from

[`Heap`](Heap.md).[`some`](Heap.md#some)

***

### sort()

```ts
sort(): E[];
```

Defined in: [data-structures/heap/heap.ts:842](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L842)

Return all elements in ascending order by repeatedly polling.

#### Returns

`E`[]

Sorted array of elements.

 *

#### Remarks

Time O(N log N), Space O(N)

#### Example

```ts
const heap = new MinHeap<number>([3, 1, 2]);
console.log(heap.sort()); // [1, 2, 3]
```

#### Inherited from

[`Heap`](Heap.md).[`sort`](Heap.md#sort)

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
const heap = new MinHeap<number>([3, 1, 2]);
console.log(heap.toArray().length); // 3
```

#### Inherited from

[`Heap`](Heap.md).[`toArray`](Heap.md#toarray)

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

[`Heap`](Heap.md).[`toVisual`](Heap.md#tovisual)

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
const heap = new MinHeap<number>([3, 1, 2]);
console.log([...heap.values()].length); // 3
```

#### Inherited from

[`Heap`](Heap.md).[`values`](Heap.md#values)

***

### from()

```ts
static from<T, R, S>(
   this, 
   elements?, 
   options?): S;
```

Defined in: [data-structures/heap/heap.ts:248](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L248)

Create a heap of the same class from an iterable.

#### Type Parameters

##### T

`T`

##### R

`R` = `any`

##### S

`S` *extends* [`Heap`](Heap.md)\<`T`, `R`\> = [`Heap`](Heap.md)\<`T`, `R`\>

#### Parameters

##### this

`Object`

##### elements?

`Iterable`\<`T` \| `R`, `any`, `any`\>

Iterable of elements or raw records.

##### options?

`HeapOptions`\<`T`, `R`\>

Heap options including comparator.

#### Returns

`S`

A new heap instance of this class.

#### Remarks

Time O(N), Space O(N)

#### Inherited from

[`Heap`](Heap.md).[`from`](Heap.md#from)

***

### heapify()

```ts
static heapify<EE, RR>(elements, options): Heap<EE, RR>;
```

Defined in: [data-structures/heap/heap.ts:266](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L266)

Build a Heap from an iterable in linear time given a comparator.

#### Type Parameters

##### EE

`EE` = `any`

##### RR

`RR` = `any`

#### Parameters

##### elements

`Iterable`\<`EE`\>

Iterable of elements.

##### options

`HeapOptions`\<`EE`, `RR`\>

Heap options including comparator.

#### Returns

[`Heap`](Heap.md)\<`EE`, `RR`\>

A new Heap built from elements.

#### Remarks

Time O(N), Space O(N)

#### Inherited from

[`Heap`](Heap.md).[`heapify`](Heap.md#heapify)
