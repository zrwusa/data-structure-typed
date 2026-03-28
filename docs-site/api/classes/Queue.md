[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Queue

# Class: Queue\<E, R\>

Defined in: [data-structures/queue/queue.ts:91](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L91)

Array-backed queue with amortized O(1) enqueue/dequeue via an offset pointer and optional auto-compaction.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// Queue as message broker for event processing
 interface Message {
      id: string;
      type: 'email' | 'sms' | 'push';
      recipient: string;
      content: string;
      timestamp: Date;
    }

    // Create a message queue for real-time event processing
    const messageQueue = new Queue<Message>([
      {
        id: 'msg-001',
        type: 'email',
        recipient: 'user@example.com',
        content: 'Welcome!',
        timestamp: new Date()
      },
      {
        id: 'msg-002',
        type: 'sms',
        recipient: '+1234567890',
        content: 'OTP: 123456',
        timestamp: new Date()
      },
      {
        id: 'msg-003',
        type: 'push',
        recipient: 'device-token-xyz',
        content: 'New notification',
        timestamp: new Date()
      },
      {
        id: 'msg-004',
        type: 'email',
        recipient: 'admin@example.com',
        content: 'Daily report',
        timestamp: new Date()
      }
    ]);

    // Process messages in FIFO order (first message first)
    const processedMessages: string[] = [];
    while (messageQueue.length > 0) {
      const message = messageQueue.shift();
      if (message) {
        processedMessages.push(`${message.type}:${message.recipient}`);
      }
    }

    // Verify messages were processed in order
    console.log(processedMessages); // [
 //      'email:user@example.com',
 //      'sms:+1234567890',
 //      'push:device-token-xyz',
 //      'email:admin@example.com'
 //    ];

    // Queue should be empty after processing all messages
    console.log(messageQueue.length); // 0;
```

```ts
// Convert queue to array
 const q = new Queue<number>([10, 20, 30]);
    console.log(q.toArray()); // [10, 20, 30];
```

## Extends

- [`LinearBase`](LinearBase.md)\<`E`, `R`\>

## Type Parameters

### E

`E` = `any`

### R

`R` = `any`

1. First In, First Out (FIFO): The core feature of a queue is its first in, first out nature. The element added to the queue first will be the one to be removed first.
2. Operations: The main operations include enqueue (adding an element to the end of the queue) and dequeue (removing and returning the element at the front of the queue). Typically, there is also a peek operation (looking at the front element without removing it).
3. Uses: Queues are commonly used to manage a series of tasks or elements that need to be processed in order. For example, managing task queues in a multi-threaded environment, or in algorithms for data structures like trees and graphs for breadth-first search.
4. Task Scheduling: Managing the order of task execution in operating systems or applications.
5. Data Buffering: Acting as a buffer for data packets in network communication.
6. Breadth-First Search (BFS): In traversal algorithms for graphs and trees, queues store elements that are to be visited.
7. Real-time Queuing: Like queuing systems in banks or supermarkets.

## Constructors

### Constructor

```ts
new Queue<E, R>(elements?, options?): Queue<E, R>;
```

Defined in: [data-structures/queue/queue.ts:100](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L100)

Create a Queue and optionally bulk-insert elements.

#### Parameters

##### elements?

`Iterable`\<`E`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Iterable of elements (or raw records if toElementFn is set).

##### options?

`QueueOptions`\<`E`, `R`\>

Options such as toElementFn, maxLen, and autoCompactRatio.

#### Returns

`Queue`\<`E`, `R`\>

New Queue instance.

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`LinearBase`](LinearBase.md).[`constructor`](LinearBase.md#constructor)

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

[`LinearBase`](LinearBase.md).[`_toElementFn`](LinearBase.md#toelementfn)

## Accessors

### autoCompactRatio

#### Get Signature

```ts
get autoCompactRatio(): number;
```

Defined in: [data-structures/queue/queue.ts:141](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L141)

Get the compaction threshold (offset/size).

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Auto-compaction ratio in (0,1].

#### Set Signature

```ts
set autoCompactRatio(value): void;
```

Defined in: [data-structures/queue/queue.ts:152](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L152)

Set the compaction threshold.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`number`

New ratio; compacts when offset/size exceeds this value.

##### Returns

`void`

void

***

### elements

#### Get Signature

```ts
get elements(): E[];
```

Defined in: [data-structures/queue/queue.ts:117](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L117)

Get the underlying array buffer.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E`[]

Backing array of elements.

***

### first

#### Get Signature

```ts
get first(): E | undefined;
```

Defined in: [data-structures/queue/queue.ts:232](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L232)

Get the first element (front) without removing it.

##### Remarks

Time O(1), Space O(1)

##### Example

```ts
const q = new Queue<string>(['first', 'second', 'third']);
console.log(q.first); // 'first'
console.log(q.length); // 3
```

##### Returns

`E` \| `undefined`

Front element or undefined.

 *

***

### last

#### Get Signature

```ts
get last(): E | undefined;
```

Defined in: [data-structures/queue/queue.ts:242](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L242)

Get the last element (back) without removing it.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E` \| `undefined`

Back element or undefined.

***

### length

#### Get Signature

```ts
get length(): number;
```

Defined in: [data-structures/queue/queue.ts:193](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L193)

Get the number of elements currently in the queue.

##### Remarks

Time O(1), Space O(1)

##### Example

```ts
const q = new Queue<number>();
console.log(q.length); // 0
    q.push(1);
    q.push(2);
console.log(q.length); // 2
```

##### Returns

`number`

Current length.

 *

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

### offset

#### Get Signature

```ts
get offset(): number;
```

Defined in: [data-structures/queue/queue.ts:129](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L129)

Get the current start offset into the array.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Zero-based offset.

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

### \_createInstance()

```ts
protected _createInstance(options?): this;
```

Defined in: [data-structures/queue/queue.ts:871](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L871)

(Protected) Create an empty instance of the same concrete class.

#### Parameters

##### options?

`LinearBaseOptions`\<`E`, `R`\>

Options forwarded to the constructor.

#### Returns

`this`

An empty like-kind queue instance.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`_createInstance`](LinearBase.md#createinstance)

***

### \_createLike()

```ts
protected _createLike<EM, RM>(elements?, options?): Queue<EM, RM>;
```

Defined in: [data-structures/queue/queue.ts:886](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L886)

(Protected) Create a like-kind queue and seed it from an iterable.

#### Type Parameters

##### EM

`EM` = `E`

##### RM

`RM` = `R`

#### Parameters

##### elements?

`Iterable`\<`EM`, `any`, `any`\> \| `Iterable`\<`RM`, `any`, `any`\>

Iterable used to seed the new queue.

##### options?

`QueueOptions`\<`EM`, `RM`\>

Options forwarded to the constructor.

#### Returns

`Queue`\<`EM`, `RM`\>

A like-kind Queue instance.

#### Remarks

Time O(N), Space O(N)

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<E>;
```

Defined in: [data-structures/queue/queue.ts:847](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L847)

(Protected) Iterate elements from front to back.

#### Returns

`IterableIterator`\<`E`\>

Iterator of E.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`_getIterator`](LinearBase.md#getiterator)

***

### \_getReverseIterator()

```ts
protected _getReverseIterator(): IterableIterator<E>;
```

Defined in: [data-structures/queue/queue.ts:857](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L857)

(Protected) Iterate elements from back to front.

#### Returns

`IterableIterator`\<`E`\>

Iterator of E.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`_getReverseIterator`](LinearBase.md#getreverseiterator)

***

### \_setAutoCompactRatio()

```ts
protected _setAutoCompactRatio(value): void;
```

Defined in: [data-structures/queue/queue.ts:837](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L837)

(Protected) Set the internal auto-compaction ratio.

#### Parameters

##### value

`number`

New ratio to assign.

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
addAt(index, newElement): boolean;
```

Defined in: [data-structures/queue/queue.ts:528](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L528)

Insert a new element at a given index.

#### Parameters

##### index

`number`

Zero-based index from the front.

##### newElement

`E`

Element to insert.

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
at(index): E | undefined;
```

Defined in: [data-structures/queue/queue.ts:501](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L501)

Get the element at a given logical index.

#### Parameters

##### index

`number`

Zero-based index from the front.

#### Returns

`E` \| `undefined`

Element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const q = new Queue<string>(['a', 'b', 'c']);
console.log(q.at(0)); // 'a'
console.log(q.at(2)); // 'c'
```

#### Overrides

[`LinearBase`](LinearBase.md).[`at`](LinearBase.md#at)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/queue/queue.ts:593](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L593)

Remove all elements and reset offset.

#### Returns

`void`

void

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const q = new Queue<number>([1, 2, 3]);
    q.clear();
console.log(q.length); // 0
```

#### Overrides

[`LinearBase`](LinearBase.md).[`clear`](LinearBase.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/queue/queue.ts:698](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L698)

Deep clone this queue and its parameters.

#### Returns

`this`

A new queue with the same content and options.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const q = new Queue<number>([1, 2, 3]);
    const copy = q.clone();
    copy.shift();
console.log(q.length); // 3
console.log(copy.length); // 2
```

#### Overrides

[`LinearBase`](LinearBase.md).[`clone`](LinearBase.md#clone)

***

### compact()

```ts
compact(): boolean;
```

Defined in: [data-structures/queue/queue.ts:632](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L632)

Compact storage by discarding consumed head elements.

#### Returns

`boolean`

True when compaction performed.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const q = new Queue<number>([1, 2, 3, 4, 5]);
    q.shift();
    q.shift();
    q.compact();
console.log(q.length); // 3
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

...(`E` \| `Queue`\<`E`, `R`\>)[]

Elements or other containers.

#### Returns

`this`

New container with combined elements (`this` type).

#### Remarks

Time O(sum(length)), Space O(sum(length))

#### Inherited from

[`LinearBase`](LinearBase.md).[`concat`](LinearBase.md#concat)

***

### delete()

```ts
delete(element): boolean;
```

Defined in: [data-structures/queue/queue.ts:458](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L458)

Delete the first occurrence of a specific element.

#### Parameters

##### element

`E`

Element to remove (strict equality via Object.is).

#### Returns

`boolean`

True if an element was removed.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const q = new Queue<number>([1, 2, 3, 2]);
    q.delete(2);
console.log(q.length); // 3
```

#### Overrides

[`LinearBase`](LinearBase.md).[`delete`](LinearBase.md#delete)

***

### deleteAt()

```ts
deleteAt(index): E | undefined;
```

Defined in: [data-structures/queue/queue.ts:513](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L513)

Delete the element at a given index.

#### Parameters

##### index

`number`

Zero-based index from the front.

#### Returns

`E` \| `undefined`

Removed element or undefined.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`deleteAt`](LinearBase.md#deleteat)

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
const q = new Queue<number>([2, 4, 6]);
console.log(q.every(x => x % 2 === 0)); // true
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

Defined in: [data-structures/queue/queue.ts:740](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L740)

Filter elements into a new queue of the same class.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Predicate (element, index, queue) → boolean to keep element.

##### thisArg?

`unknown`

Value for `this` inside the predicate.

#### Returns

`this`

A new queue with kept elements.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const q = new Queue<number>([1, 2, 3, 4, 5]);
    const evens = q.filter(x => x % 2 === 0);
console.log(evens.length); // 2
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
const q = new Queue<number>([1, 2, 3, 4]);
console.log(q.find(x => x > 2)); // 3
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
const q = new Queue<number>([1, 2, 3, 4]);
console.log(q.find(x => x > 2)); // 3
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
const q = new Queue<string>(['a', 'b', 'c']);
    const items: string[] = [];
    q.forEach(item => items.push(item));
console.log(items); // ['a', 'b', 'c']
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
const q = new Queue<string>(['a', 'b', 'c']);
console.log(q.indexOf('b')); // 1
console.log(q.indexOf('z')); // -1
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`indexOf`](LinearBase.md#indexof)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/queue/queue.ts:306](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L306)

Check whether the queue is empty.

#### Returns

`boolean`

True if length is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const queue = new Queue<string>(['A', 'B', 'C', 'D']);

    const elements: string[] = [];
    for (const item of queue) {
      elements.push(item);
    }

    // Verify all elements are iterated in order
console.log(elements); // ['A', 'B', 'C', 'D']

    // Process all elements
    while (queue.length > 0) {
      queue.shift();
    }

console.log(queue.length); // 0
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
thisArg?): Queue<EM, RM>;
```

Defined in: [data-structures/queue/queue.ts:788](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L788)

Map each element to a new element in a possibly different-typed queue.

#### Type Parameters

##### EM

`EM`

##### RM

`RM`

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `EM`\>

Mapping function (element, index, queue) → newElement.

##### options?

`QueueOptions`\<`EM`, `RM`\>

Options for the output queue (e.g., toElementFn, maxLen, autoCompactRatio).

##### thisArg?

`unknown`

Value for `this` inside the callback.

#### Returns

`Queue`\<`EM`, `RM`\>

A new Queue with mapped elements.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const q = new Queue<number>([1, 2, 3]);
    const doubled = q.map(x => x * 2);
console.log(doubled.toArray()); // [2, 4, 6]
```

#### Overrides

[`LinearBase`](LinearBase.md).[`map`](LinearBase.md#map)

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/queue/queue.ts:811](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L811)

Map each element to a new value of the same type.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `E`\>

Mapping function (element, index, queue) → element.

##### thisArg?

`unknown`

Value for `this` inside the callback.

#### Returns

`this`

A new queue with mapped elements (same element type).

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`LinearBase`](LinearBase.md).[`mapSame`](LinearBase.md#mapsame)

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
const q = new Queue<number>([1, 2, 3]);
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`print`](LinearBase.md#print)

***

### push()

```ts
push(element): boolean;
```

Defined in: [data-structures/queue/queue.ts:351](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L351)

Enqueue one element at the back.

#### Parameters

##### element

`E`

Element to enqueue.

#### Returns

`boolean`

True on success.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
// Create a simple Queue with initial values
    const queue = new Queue([1, 2, 3, 4, 5]);

    // Verify the queue maintains insertion order
console.log([...queue]); // [1, 2, 3, 4, 5]

    // Check length
console.log(queue.length); // 5
```

#### Overrides

[`LinearBase`](LinearBase.md).[`push`](LinearBase.md#push)

***

### pushMany()

```ts
pushMany(elements): boolean[];
```

Defined in: [data-structures/queue/queue.ts:364](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L364)

Enqueue many elements from an iterable.

#### Parameters

##### elements

`Iterable`\<`E`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Iterable of elements (or raw records if toElementFn is set).

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
const q = new Queue<number>([1, 2, 3, 4]);
    const sum = q.reduce((acc, x) => acc + x, 0);
console.log(sum); // 10
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
const q = new Queue<number>([1, 2, 3, 4]);
    const sum = q.reduce((acc, x) => acc + x, 0);
console.log(sum); // 10
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
const q = new Queue<number>([1, 2, 3, 4]);
    const sum = q.reduce((acc, x) => acc + x, 0);
console.log(sum); // 10
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

Defined in: [data-structures/queue/queue.ts:554](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L554)

Reverse the queue in-place by compacting then reversing.

#### Returns

`this`

This queue.

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`LinearBase`](LinearBase.md).[`reverse`](LinearBase.md#reverse)

***

### setAt()

```ts
setAt(index, newElement): boolean;
```

Defined in: [data-structures/queue/queue.ts:542](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L542)

Replace the element at a given index.

#### Parameters

##### index

`number`

Zero-based index from the front.

##### newElement

`E`

New element to set.

#### Returns

`boolean`

True if updated.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`LinearBase`](LinearBase.md).[`setAt`](LinearBase.md#setat)

***

### shift()

```ts
shift(): E | undefined;
```

Defined in: [data-structures/queue/queue.ts:417](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L417)

Dequeue one element from the front (amortized via offset).

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(1) amortized, Space O(1)

#### Example

```ts
const queue = new Queue<number>([10, 20, 30, 40]);

    // Peek at the front element without removing it
console.log(queue.first); // 10

    // Remove and get the first element (FIFO)
    const first = queue.shift();
console.log(first); // 10

    // Verify remaining elements and length decreased
console.log([...queue]); // [20, 30, 40]
console.log(queue.length); // 3
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
const q = new Queue<number>([1, 3, 5, 4]);
console.log(q.some(x => x % 2 === 0)); // true
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

Defined in: [data-structures/queue/queue.ts:647](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L647)

Remove and/or insert elements at a position (array-like).

#### Parameters

##### start

`number`

Start index (clamped to [0, length]).

##### deleteCount?

`number` = `0`

Number of elements to remove (default 0).

##### items?

...`E`[]

Elements to insert after `start`.

#### Returns

`this`

A new queue containing the removed elements (typed as `this`).

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
const q = new Queue<number>([3, 1, 2]);
console.log(q.toArray()); // [3, 1, 2]
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
const q = new Queue<number>([1, 2, 3]);
console.log([...q.values()]); // [1, 2, 3]
```

#### Inherited from

[`LinearBase`](LinearBase.md).[`values`](LinearBase.md#values)

***

### fromArray()

```ts
static fromArray<E>(elements): Queue<E>;
```

Defined in: [data-structures/queue/queue.ts:254](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/queue/queue.ts#L254)

Create a queue from an array of elements.

#### Type Parameters

##### E

`E`

#### Parameters

##### elements

`E`[]

Array of elements to enqueue in order.

#### Returns

`Queue`\<`E`\>

A new queue populated from the array.

#### Remarks

Time O(N), Space O(N)
