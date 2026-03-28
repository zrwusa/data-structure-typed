[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / MaxPriorityQueue

# Class: MaxPriorityQueue\<E, R\>

Defined in: [data-structures/priority-queue/max-priority-queue.ts:77](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/priority-queue/max-priority-queue.ts#L77)

Max-oriented priority queue (max-heap) built on [PriorityQueue](PriorityQueue.md).
The default comparator orders primitive values in descending order. If you store objects,
you must provide a custom comparator via PriorityQueueOptions.

## Examples

```ts
// Job scheduling by priority
 const jobs = new MaxPriorityQueue<number>();

    jobs.add(3); // low priority
    jobs.add(7); // high priority
    jobs.add(5); // medium priority
    jobs.add(10); // critical

    // Highest priority job first
    console.log(jobs.poll()); // 10;
    console.log(jobs.poll()); // 7;
    console.log(jobs.poll()); // 5;
    console.log(jobs.poll()); // 3;
```

```ts
// Auction system with highest bid tracking
 interface Bid {
      bidder: string;
      amount: number;
    }

    const auction = new MaxPriorityQueue<Bid>([], {
      comparator: (a, b) => b.amount - a.amount
    });

    auction.add({ bidder: 'Alice', amount: 100 });
    auction.add({ bidder: 'Bob', amount: 250 });
    auction.add({ bidder: 'Charlie', amount: 175 });

    // Current highest bid
    console.log(auction.peek()?.bidder); // 'Bob';
    console.log(auction.peek()?.amount); // 250;

    // Process winning bid
    const winner = auction.poll()!;
    console.log(winner.bidder); // 'Bob';
    console.log(auction.peek()?.bidder); // 'Charlie';
```

```ts
// CPU process scheduling
 const cpuQueue = new MaxPriorityQueue<[number, string]>([], {
      comparator: (a, b) => b[0] - a[0]
    });

    cpuQueue.add([5, 'System process']);
    cpuQueue.add([1, 'Background task']);
    cpuQueue.add([8, 'User interaction']);
    cpuQueue.add([3, 'Network sync']);

    const order = [];
    while (cpuQueue.size > 0) {
      order.push(cpuQueue.poll()![1]);
    }
    console.log(order); // [
 //      'User interaction',
 //      'System process',
 //      'Network sync',
 //      'Background task'
 //    ];
```

## Extends

- [`PriorityQueue`](PriorityQueue.md)\<`E`, `R`\>

## Type Parameters

### E

`E` = `any`

Element type stored in the queue.

### R

`R` = `any`

Extra record/metadata associated with each element.

## Constructors

### Constructor

```ts
new MaxPriorityQueue<E, R>(elements?, options?): MaxPriorityQueue<E, R>;
```

Defined in: [data-structures/priority-queue/max-priority-queue.ts:85](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/priority-queue/max-priority-queue.ts#L85)

Creates a max-priority queue.

#### Parameters

##### elements?

`Iterable`\<`E`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Optional initial elements to insert.

##### options?

`PriorityQueueOptions`\<`E`, `R`\>

Optional configuration (e.g., `comparator`, `toElementFn`).

#### Returns

`MaxPriorityQueue`\<`E`, `R`\>

#### Throws

Thrown when using the default comparator with object elements (provide a custom comparator).

#### Remarks

Complexity — Time: O(n log n) when inserting n elements incrementally; Space: O(n).

#### Overrides

```ts
PriorityQueue<E, R>.constructor
```

## Accessors

### comparator

#### Get Signature

```ts
get comparator(): Comparator<E>;
```

Defined in: [data-structures/heap/heap.ts:1072](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L1072)

Get the comparator used to order elements.

##### Remarks

Time O(1), Space O(1)

##### Returns

`Comparator`\<`E`\>

Comparator function.

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`comparator`](PriorityQueue.md#comparator)

***

### elements

#### Get Signature

```ts
get elements(): E[];
```

Defined in: [data-structures/heap/heap.ts:180](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L180)

Get the backing array of the heap.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E`[]

Internal elements array.

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`elements`](PriorityQueue.md#elements)

***

### leaf

#### Get Signature

```ts
get leaf(): E | undefined;
```

Defined in: [data-structures/heap/heap.ts:236](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L236)

Get the last leaf element.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E` \| `undefined`

Last element or undefined.

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`leaf`](PriorityQueue.md#leaf)

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/heap/heap.ts:226](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L226)

Get the number of elements.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Heap size.

 *

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`size`](PriorityQueue.md#size)

***

### toElementFn

#### Get Signature

```ts
get toElementFn(): ((rawElement) => E) | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:47](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L47)

Exposes the current `toElementFn`, if configured.

##### Remarks

Time O(1), Space O(1).

##### Returns

((`rawElement`) => `E`) \| `undefined`

The converter function or `undefined` when not set.

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`toElementFn`](PriorityQueue.md#toelementfn)

## Methods

### \[iterator\]()

```ts
iterator: IterableIterator<E>;
```

Defined in: [data-structures/base/iterable-element-base.ts:60](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L60)

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

[`PriorityQueue`](PriorityQueue.md).[`[iterator]`](PriorityQueue.md#iterator)

***

### add()

```ts
add(element): boolean;
```

Defined in: [data-structures/heap/heap.ts:322](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L322)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`add`](PriorityQueue.md#add)

***

### addMany()

```ts
addMany(elements): boolean[];
```

Defined in: [data-structures/heap/heap.ts:364](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L364)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`addMany`](PriorityQueue.md#addmany)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/heap/heap.ts:620](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L620)

Remove all elements.

#### Returns

`void`

void

 *

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`clear`](PriorityQueue.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/heap/heap.ts:924](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L924)

Deep clone this heap.

#### Returns

`this`

A new heap with the same elements.

 *

#### Remarks

Time O(N), Space O(N)

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`clone`](PriorityQueue.md#clone)

***

### delete()

```ts
delete(element): boolean;
```

Defined in: [data-structures/heap/heap.ts:707](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L707)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`delete`](PriorityQueue.md#delete)

***

### deleteBy()

```ts
deleteBy(predicate): boolean;
```

Defined in: [data-structures/heap/heap.ts:735](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L735)

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

[`PriorityQueue`](PriorityQueue.md).[`deleteBy`](PriorityQueue.md#deleteby)

***

### dfs()

```ts
dfs(order?): E[];
```

Defined in: [data-structures/heap/heap.ts:798](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L798)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`dfs`](PriorityQueue.md#dfs)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:86](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L86)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`every`](PriorityQueue.md#every)

***

### filter()

```ts
filter(callback, thisArg?): this;
```

Defined in: [data-structures/heap/heap.ts:968](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L968)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`filter`](PriorityQueue.md#filter)

***

### find()

#### Call Signature

```ts
find<S>(predicate, thisArg?): S | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:162](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L162)

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

##### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`find`](PriorityQueue.md#find)

#### Call Signature

```ts
find(predicate, thisArg?): E | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:163](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L163)

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

##### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`find`](PriorityQueue.md#find)

***

### fix()

```ts
fix(): boolean[];
```

Defined in: [data-structures/heap/heap.ts:829](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L829)

Restore heap order bottom-up (heapify in-place).

#### Returns

`boolean`[]

Array of per-node results from fixing steps.

#### Remarks

Time O(N), Space O(1)

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`fix`](PriorityQueue.md#fix)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:132](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L132)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`forEach`](PriorityQueue.md#foreach)

***

### has()

```ts
has(element): boolean;
```

Defined in: [data-structures/heap/heap.ts:666](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L666)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`has`](PriorityQueue.md#has)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/heap/heap.ts:580](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L580)

Check whether the heap is empty.

#### Returns

`boolean`

True if size is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`isEmpty`](PriorityQueue.md#isempty)

***

### map()

```ts
map<EM, RM>(
   callback, 
   options, 
thisArg?): Heap<EM, RM>;
```

Defined in: [data-structures/heap/heap.ts:1021](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L1021)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`map`](PriorityQueue.md#map)

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/heap/heap.ts:1045](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L1045)

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

[`PriorityQueue`](PriorityQueue.md).[`mapSame`](PriorityQueue.md#mapsame)

***

### peek()

```ts
peek(): E | undefined;
```

Defined in: [data-structures/heap/heap.ts:539](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L539)

Get the current top element without removing it.

#### Returns

`E` \| `undefined`

Top element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`peek`](PriorityQueue.md#peek)

***

### poll()

```ts
poll(): E | undefined;
```

Defined in: [data-structures/heap/heap.ts:436](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L436)

Remove and return the top element.

#### Returns

`E` \| `undefined`

Top element or undefined.

 *

#### Remarks

Time O(log N), Space O(1)

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`poll`](PriorityQueue.md#poll)

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:268](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L268)

Prints `toVisual()` to the console. Intended for quick debugging.

#### Returns

`void`

`void`.

#### Remarks

Time O(n) due to materialization, Space O(n) for the intermediate representation.

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`print`](PriorityQueue.md#print)

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

Defined in: [data-structures/base/iterable-element-base.ts:193](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L193)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`\>

##### Returns

`E`

##### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`reduce`](PriorityQueue.md#reduce)

#### Call Signature

```ts
reduce(callbackfn, initialValue): E;
```

Defined in: [data-structures/base/iterable-element-base.ts:194](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L194)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`\>

###### initialValue

`E`

##### Returns

`E`

##### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`reduce`](PriorityQueue.md#reduce)

#### Call Signature

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-element-base.ts:195](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L195)

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

##### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`reduce`](PriorityQueue.md#reduce)

***

### refill()

```ts
refill(elements): boolean[];
```

Defined in: [data-structures/heap/heap.ts:631](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L631)

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

[`PriorityQueue`](PriorityQueue.md).[`refill`](PriorityQueue.md#refill)

***

### setEquality()

```ts
setEquality(equals): this;
```

Defined in: [data-structures/heap/heap.ts:763](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L763)

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

[`PriorityQueue`](PriorityQueue.md).[`setEquality`](PriorityQueue.md#setequality)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:109](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L109)

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

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`some`](PriorityQueue.md#some)

***

### sort()

```ts
sort(): E[];
```

Defined in: [data-structures/heap/heap.ts:875](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L875)

Return all elements in ascending order by repeatedly polling.

#### Returns

`E`[]

Sorted array of elements.

 *

#### Remarks

Time O(N log N), Space O(N)

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`sort`](PriorityQueue.md#sort)

***

### toArray()

```ts
toArray(): E[];
```

Defined in: [data-structures/base/iterable-element-base.ts:245](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L245)

Materializes the elements into a new array.

#### Returns

`E`[]

A shallow array copy of the iteration order.

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`toArray`](PriorityQueue.md#toarray)

***

### toVisual()

```ts
toVisual(): E[];
```

Defined in: [data-structures/base/iterable-element-base.ts:257](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L257)

Returns a representation of the structure suitable for quick visualization.
Defaults to an array of elements; subclasses may override to provide richer visuals.

#### Returns

`E`[]

A visual representation (array by default).

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`toVisual`](PriorityQueue.md#tovisual)

***

### values()

```ts
values(): IterableIterator<E>;
```

Defined in: [data-structures/base/iterable-element-base.ts:71](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L71)

Returns an iterator over the values (alias of the default iterator).

#### Returns

`IterableIterator`\<`E`\>

An `IterableIterator<E>` over all elements.

#### Remarks

Creating the iterator is O(1); full iteration is Time O(n), Space O(1).

#### Inherited from

[`PriorityQueue`](PriorityQueue.md).[`values`](PriorityQueue.md#values)

***

### from()

```ts
static from<T, R, S>(
   this, 
   elements?, 
   options?): S;
```

Defined in: [data-structures/heap/heap.ts:251](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L251)

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

[`PriorityQueue`](PriorityQueue.md).[`from`](PriorityQueue.md#from)

***

### heapify()

```ts
static heapify<EE, RR>(elements, options): Heap<EE, RR>;
```

Defined in: [data-structures/heap/heap.ts:269](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/heap/heap.ts#L269)

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

[`PriorityQueue`](PriorityQueue.md).[`heapify`](PriorityQueue.md#heapify)
