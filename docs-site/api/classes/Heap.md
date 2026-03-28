[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Heap

# Class: Heap\<E, R\>

Defined in: [data-structures/heap/heap.ts:150](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L150)

Binary heap with pluggable comparator; supports fast insertion and removal of the top element.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// Use Heap to solve top k problems
 function topKElements(arr: number[], k: number): number[] {
      const heap = new Heap<number>([], { comparator: (a, b) => b - a }); // Max heap
      arr.forEach(num => {
        heap.add(num);
        if (heap.size > k) heap.poll(); // Keep the heap size at K
      });
      return heap.toArray();
    }

    const numbers = [10, 30, 20, 5, 15, 25];
    console.log(topKElements(numbers, 3)); // [15, 10, 5];
```

```ts
// Use Heap to dynamically maintain the median
 class MedianFinder {
      private low: MaxHeap<number>; // Max heap, stores the smaller half
      private high: MinHeap<number>; // Min heap, stores the larger half

      constructor() {
        this.low = new MaxHeap<number>([]);
        this.high = new MinHeap<number>([]);
      }

      addNum(num: number): void {
        if (this.low.isEmpty() || num <= this.low.peek()!) this.low.add(num);
        else this.high.add(num);

        // Balance heaps
        if (this.low.size > this.high.size + 1) this.high.add(this.low.poll()!);
        else if (this.high.size > this.low.size) this.low.add(this.high.poll()!);
      }

      findMedian(): number {
        if (this.low.size === this.high.size) return (this.low.peek()! + this.high.peek()!) / 2;
        return this.low.peek()!;
      }
    }

    const medianFinder = new MedianFinder();
    medianFinder.addNum(10);
    console.log(medianFinder.findMedian()); // 10;
    medianFinder.addNum(20);
    console.log(medianFinder.findMedian()); // 15;
    medianFinder.addNum(30);
    console.log(medianFinder.findMedian()); // 20;
    medianFinder.addNum(40);
    console.log(medianFinder.findMedian()); // 25;
    medianFinder.addNum(50);
    console.log(medianFinder.findMedian()); // 30;
```

```ts
// Use Heap for load balancing
 function loadBalance(requests: number[], servers: number): number[] {
      const serverHeap = new Heap<{ id: number; load: number }>([], { comparator: (a, b) => a.load - b.load }); // min heap
      const serverLoads = new Array(servers).fill(0);

      for (let i = 0; i < servers; i++) {
        serverHeap.add({ id: i, load: 0 });
      }

      requests.forEach(req => {
        const server = serverHeap.poll()!;
        serverLoads[server.id] += req;
        server.load += req;
        serverHeap.add(server); // The server after updating the load is re-entered into the heap
      });

      return serverLoads;
    }

    const requests = [5, 2, 8, 3, 7];
    console.log(loadBalance(requests, 3)); // [12, 8, 5];
```

```ts
// Use Heap to schedule tasks
 type Task = [string, number];

    function scheduleTasks(tasks: Task[], machines: number): Map<number, Task[]> {
      const machineHeap = new Heap<{ id: number; load: number }>([], { comparator: (a, b) => a.load - b.load }); // Min heap
      const allocation = new Map<number, Task[]>();

      // Initialize the load on each machine
      for (let i = 0; i < machines; i++) {
        machineHeap.add({ id: i, load: 0 });
        allocation.set(i, []);
      }

      // Assign tasks
      tasks.forEach(([task, load]) => {
        const machine = machineHeap.poll()!;
        allocation.get(machine.id)!.push([task, load]);
        machine.load += load;
        machineHeap.add(machine); // The machine after updating the load is re-entered into the heap
      });

      return allocation;
    }

    const tasks: Task[] = [
      ['Task1', 3],
      ['Task2', 1],
      ['Task3', 2],
      ['Task4', 5],
      ['Task5', 4]
    ];
    const expectedMap = new Map<number, Task[]>();
    expectedMap.set(0, [
      ['Task1', 3],
      ['Task4', 5]
    ]);
    expectedMap.set(1, [
      ['Task2', 1],
      ['Task3', 2],
      ['Task5', 4]
    ]);
    console.log(scheduleTasks(tasks, 2)); // expectedMap;
```

```ts
// Get all elements as array
 const heap = new Heap<number>([5, 1, 3, 2, 4]);
    const arr = heap.toArray();
    console.log(arr.length); // 5;
    console.log(arr.sort()); // [1, 2, 3, 4, 5];
```

## Extends

- [`IterableElementBase`](IterableElementBase.md)\<`E`, `R`\>

## Extended by

- [`MaxHeap`](MaxHeap.md)
- [`MinHeap`](MinHeap.md)
- [`PriorityQueue`](PriorityQueue.md)

## Type Parameters

### E

`E` = `any`

### R

`R` = `any`

1. Complete Binary Tree: Heaps are typically complete binary trees, meaning every level is fully filled except possibly for the last level, which has nodes as far left as possible.
2. Heap Properties: Each node in a heap follows a specific order property, which varies depending on the type of heap:
Max Heap: The value of each parent node is greater than or equal to the value of its children.
Min Heap: The value of each parent node is less than or equal to the value of its children.
3. Root Node Access: In a heap, the largest element (in a max heap) or the smallest element (in a min heap) is always at the root of the tree.
4. Efficient Insertion and Deletion: Due to its structure, a heap allows for insertion and deletion operations in logarithmic time (O(log n)).
5. Managing Dynamic Data Sets: Heaps effectively manage dynamic data sets, especially when frequent access to the largest or smallest elements is required.
6. Non-linear Search: While a heap allows rapid access to its largest or smallest element, it is less efficient for other operations, such as searching for a specific element, as it is not designed for these tasks.
7. Efficient Sorting Algorithms: For example, heap sort. Heap sort uses the properties of a heap to sort elements.
8. Graph Algorithms: Such as Dijkstra's shortest path algorithm and Prime's minimum-spanning tree algorithm, which use heaps to improve performance.

## Constructors

### Constructor

```ts
new Heap<E, R>(elements?, options?): Heap<E, R>;
```

Defined in: [data-structures/heap/heap.ts:161](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/heap/heap.ts#L161)

Create a Heap and optionally bulk-insert elements.

#### Parameters

##### elements?

`Iterable`\<`E` \| `R`\> = `[]`

Iterable of elements (or raw values if toElementFn is set).

##### options?

`HeapOptions`\<`E`, `R`\>

Options such as comparator and toElementFn.

#### Returns

`Heap`\<`E`, `R`\>

New Heap instance.

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`constructor`](IterableElementBase.md#constructor)

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

[`IterableElementBase`](IterableElementBase.md).[`_toElementFn`](IterableElementBase.md#toelementfn)

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

##### Example

```ts
const heap = new Heap<number>();
console.log(heap.size); // 0
    heap.add(10);
    heap.add(20);
console.log(heap.size); // 2
    heap.poll();
console.log(heap.size); // 1
```

##### Returns

`number`

Heap size.

 *

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

[`IterableElementBase`](IterableElementBase.md).[`toElementFn`](IterableElementBase.md#toelementfn)

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

`Heap`\<`EM`, `RM`\>

A like-kind heap instance.

#### Remarks

Time O(N log N), Space O(N)

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

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`_getIterator`](IterableElementBase.md#getiterator)

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

`Heap`\<`EM`, `RM`\>

An empty like-kind heap instance.

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

[`IterableElementBase`](IterableElementBase.md).[`[iterator]`](IterableElementBase.md#iterator)

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
// Create a min heap (default)
    const minHeap = new Heap([5, 3, 7, 1, 9, 2]);

    // Verify size
console.log(minHeap.size); // 6

    // Add new element
    minHeap.add(4);
console.log(minHeap.size); // 7

    // Min heap property: smallest element at root
    const min = minHeap.peek();
console.log(min); // 1
```

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
const heap = new Heap<number>([], { comparator: (a, b) => a - b });
    heap.addMany([5, 3, 7, 1]);
console.log(heap.peek()); // 1
console.log(heap.size); // 4
```

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
const heap = new Heap<number>([1, 2, 3], { comparator: (a, b) => a - b });
    heap.clear();
console.log(heap.isEmpty()); // true
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`clear`](IterableElementBase.md#clear)

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
const heap = new Heap<number>([3, 1, 4], { comparator: (a, b) => a - b });
    const copy = heap.clone();
    copy.poll();
console.log(heap.size); // 3
console.log(copy.size); // 2
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`clone`](IterableElementBase.md#clone)

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
const heap = new Heap<number>([3, 1, 4, 1, 5], { comparator: (a, b) => a - b });
    heap.delete(4);
console.log(heap.toArray().includes(4)); // false
```

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
const heap = new Heap<number>([3, 1, 2], { comparator: (a, b) => a - b });
    const result = heap.dfs('IN');
console.log(result.length); // 3
```

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
const heap = new Heap<number>([2, 4, 6], { comparator: (a, b) => a - b });
console.log(heap.every(x => x > 0)); // true
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`every`](IterableElementBase.md#every)

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
const heap = new Heap<number>([1, 2, 3, 4, 5], { comparator: (a, b) => a - b });
    const evens = heap.filter(x => x % 2 === 0);
console.log(evens.size); // 2
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`filter`](IterableElementBase.md#filter)

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
const heap = new Heap<number>([10, 20, 30], { comparator: (a, b) => a - b });
console.log(heap.find(x => x > 15)); // 20
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`find`](IterableElementBase.md#find)

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
const heap = new Heap<number>([10, 20, 30], { comparator: (a, b) => a - b });
console.log(heap.find(x => x > 15)); // 20
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`find`](IterableElementBase.md#find)

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
const heap = new Heap<number>([3, 1, 2], { comparator: (a, b) => a - b });
    const items: number[] = [];
    heap.forEach(x => items.push(x));
console.log(items.length); // 3
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`forEach`](IterableElementBase.md#foreach)

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
const heap = new Heap<number>([3, 1, 2], { comparator: (a, b) => a - b });
console.log(heap.has(1)); // true
console.log(heap.has(99)); // false
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`has`](IterableElementBase.md#has)

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
const heap = new Heap<number>([], { comparator: (a, b) => a - b });
console.log(heap.isEmpty()); // true
    heap.add(1);
console.log(heap.isEmpty()); // false
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`isEmpty`](IterableElementBase.md#isempty)

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

`Heap`\<`EM`, `RM`\>

A new heap with mapped elements.

 *

#### Remarks

Time O(N log N), Space O(N)

#### Example

```ts
const heap = new Heap<number>([1, 2, 3], { comparator: (a, b) => a - b });
    const doubled = heap.map(x => x * 2, { comparator: (a, b) => a - b });
console.log(doubled.peek()); // 2
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`map`](IterableElementBase.md#map)

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

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`mapSame`](IterableElementBase.md#mapsame)

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
interface Event {
      id: number;
      type: 'critical' | 'warning' | 'info';
      timestamp: number;
      message: string;
    }

    // Custom priority: critical > warning > info
    const priorityMap = { critical: 3, warning: 2, info: 1 };

    const eventHeap = new Heap<Event>([], {
      comparator: (a: Event, b: Event) => {
        const priorityA = priorityMap[a.type];
        const priorityB = priorityMap[b.type];
        return priorityB - priorityA; // Higher priority first
      }
    });

    // Add events in random order
    eventHeap.add({ id: 1, type: 'info', timestamp: 100, message: 'User logged in' });
    eventHeap.add({ id: 2, type: 'critical', timestamp: 101, message: 'Server down' });
    eventHeap.add({ id: 3, type: 'warning', timestamp: 102, message: 'High memory' });
    eventHeap.add({ id: 4, type: 'info', timestamp: 103, message: 'Cache cleared' });
    eventHeap.add({ id: 5, type: 'critical', timestamp: 104, message: 'Database error' });

console.log(eventHeap.size); // 5

    // Process events by priority (critical first)
    const processedOrder: Event[] = [];
    while (eventHeap.size > 0) {
      const event = eventHeap.poll();
      if (event) {
        processedOrder.push(event);
      }
    }

    // Verify critical events came first
console.log(processedOrder[0].type); // 'critical'
console.log(processedOrder[1].type); // 'critical'
console.log(processedOrder[2].type); // 'warning'
console.log(processedOrder[3].type); // 'info'
console.log(processedOrder[4].type); // 'info'

    // Verify O(log n) operations
    const newHeap = new Heap<number>([5, 3, 7, 1]);

    // Add - O(log n)
    newHeap.add(2);
console.log(newHeap.size); // 5

    // Poll - O(log n)
    const removed = newHeap.poll();
console.log(removed); // 1

    // Peek - O(1)
    const top = newHeap.peek();
console.log(top); // 2
```

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
interface Task {
      id: number;
      priority: number;
      name: string;
    }

    // Custom comparator for max heap behavior (higher priority first)
    const tasks: Task[] = [
      { id: 1, priority: 5, name: 'Email' },
      { id: 2, priority: 3, name: 'Chat' },
      { id: 3, priority: 8, name: 'Alert' }
    ];

    const maxHeap = new Heap(tasks, {
      comparator: (a: Task, b: Task) => b.priority - a.priority
    });

console.log(maxHeap.size); // 3

    // Peek returns highest priority task
    const topTask = maxHeap.peek();
console.log(topTask?.priority); // 8
console.log(topTask?.name); // 'Alert'
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
const heap = new Heap<number>([3, 1, 2], { comparator: (a, b) => a - b });
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`print`](IterableElementBase.md#print)

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
const heap = new Heap<number>([1, 2, 3], { comparator: (a, b) => a - b });
    const sum = heap.reduce((acc, x) => acc + x, 0);
console.log(sum); // 6
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

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
const heap = new Heap<number>([1, 2, 3], { comparator: (a, b) => a - b });
    const sum = heap.reduce((acc, x) => acc + x, 0);
console.log(sum); // 6
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

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
const heap = new Heap<number>([1, 2, 3], { comparator: (a, b) => a - b });
    const sum = heap.reduce((acc, x) => acc + x, 0);
console.log(sum); // 6
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

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
const heap = new Heap<number>([1, 3, 5], { comparator: (a, b) => a - b });
console.log(heap.some(x => x > 4)); // true
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`some`](IterableElementBase.md#some)

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
const heap = new Heap<number>([5, 1, 3, 2, 4]);
    const sorted = heap.sort();
console.log(sorted); // [1, 2, 3, 4, 5]
```

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
const heap = new Heap<number>([3, 1, 2], { comparator: (a, b) => a - b });
console.log(heap.toArray().length); // 3
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toArray`](IterableElementBase.md#toarray)

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

[`IterableElementBase`](IterableElementBase.md).[`toVisual`](IterableElementBase.md#tovisual)

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
const heap = new Heap<number>([3, 1, 2], { comparator: (a, b) => a - b });
    const vals = [...heap.values()];
console.log(vals.length); // 3
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`values`](IterableElementBase.md#values)

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

`S` *extends* `Heap`\<`T`, `R`\> = `Heap`\<`T`, `R`\>

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

`Heap`\<`EE`, `RR`\>

A new Heap built from elements.

#### Remarks

Time O(N), Space O(N)
