[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / DoublyLinkedList

# Class: DoublyLinkedList\<E, R\>

Defined in: [data-structures/linked-list/doubly-linked-list.ts:150](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L150)

Doubly linked list with O(1) push/pop/unshift/shift and linear scans.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// Browser history
 const browserHistory = new DoublyLinkedList<string>();

    browserHistory.push('home page');
    browserHistory.push('search page');
    browserHistory.push('details page');

    console.log(browserHistory.last); // 'details page';
    console.log(browserHistory.pop()); // 'details page';
    console.log(browserHistory.last); // 'search page';
```

```ts
// DoublyLinkedList for LRU cache implementation
 interface CacheEntry {
      key: string;
      value: string;
    }

    // Simulate LRU cache using DoublyLinkedList
    // DoublyLinkedList is perfect because:
    // - O(1) delete from any position
    // - O(1) push to end
    // - Bidirectional traversal for LRU policy

    const cacheList = new DoublyLinkedList<CacheEntry>();
    const maxSize = 3;

    // Add cache entries
    cacheList.push({ key: 'user:1', value: 'Alice' });
    cacheList.push({ key: 'user:2', value: 'Bob' });
    cacheList.push({ key: 'user:3', value: 'Charlie' });

    // Try to add a new entry when cache is full
    if (cacheList.length >= maxSize) {
      // Remove the oldest (first) entry
      const evicted = cacheList.shift();
      console.log(evicted?.key); // 'user:1';
    }

    // Add new entry
    cacheList.push({ key: 'user:4', value: 'Diana' });

    // Verify current cache state
    console.log(cacheList.length); // 3;
    const cachedKeys = [...cacheList].map(entry => entry.key);
    console.log(cachedKeys); // ['user:2', 'user:3', 'user:4'];

    // Access entry (in real LRU, this would move it to end)
    const foundEntry = [...cacheList].find(entry => entry.key === 'user:2');
    console.log(foundEntry?.value); // 'Bob';
```

```ts
// Find first matching element
 const list = new DoublyLinkedList<number>([5, 10, 15, 20]);
    console.log(list.find(n => n >= 12)); // 15;
```

```ts
// Iterate over elements
 const list = new DoublyLinkedList<number>([1, 2, 3]);
    const sum: number[] = [];
    list.forEach(n => sum.push(n));
    console.log(sum); // [1, 2, 3];
```

## Extends

- [`LinearLinkedBase`](LinearLinkedBase.md)\<`E`, `R`, [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>\>

## Type Parameters

### E

`E` = `any`

### R

`R` = `any`

1. Node Structure: Each node contains three parts: a data field, a pointer (or reference) to the previous node, and a pointer to the next node. This structure allows traversal of the linked list in both directions.
2. Bidirectional Traversal: Unlike singly linked lists, doubly linked lists can be easily traversed forwards or backwards. This makes insertions and deletions in the list more flexible and efficient.
3. No Centralized Index: Unlike arrays, elements in a linked list are not stored contiguously, so there is no centralized index. Accessing elements in a linked list typically requires traversing from the head or tail node.
4. High Efficiency in Insertion and Deletion: Adding or removing elements in a linked list does not require moving other elements, making these operations more efficient than in arrays.
Caution: Although our linked list classes provide methods such as at, setAt, addAt, and indexOf that are based on array indices, their time complexity, like that of the native Array.lastIndexOf, is 𝑂(𝑛). If you need to use these methods frequently, you might want to consider other data structures, such as Deque or Queue (designed for random access). Similarly, since the native Array.shift method has a time complexity of 𝑂(𝑛), using an array to simulate a queue can be inefficient. In such cases, you should use Queue or Deque, as these data structures leverage deferred array rearrangement, effectively reducing the average time complexity to 𝑂(1).

## Constructors

### Constructor

```ts
new DoublyLinkedList<E, R>(elements?, options?): DoublyLinkedList<E, R>;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:161](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L161)

Create a DoublyLinkedList and optionally bulk-insert elements.

#### Parameters

##### elements?

  \| `Iterable`\<`E`, `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>
  \| `Iterable`\<[`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>, `any`, `any`\>

Iterable of elements or nodes (or raw records if toElementFn is provided).

##### options?

`DoublyLinkedListOptions`\<`E`, `R`\>

Options such as maxLen and toElementFn.

#### Returns

`DoublyLinkedList`\<`E`, `R`\>

New DoublyLinkedList instance.

#### Remarks

Time O(N), Space O(N)

#### Overrides

```ts
LinearLinkedBase<E, R, DoublyLinkedListNode<E>>.constructor
```

## Accessors

### first

#### Get Signature

```ts
get first(): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:219](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L219)

Get the first element value.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E` \| `undefined`

First element or undefined.

***

### head

#### Get Signature

```ts
get head(): DoublyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:185](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L185)

Get the head node.

##### Remarks

Time O(1), Space O(1)

##### Returns

[`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\> \| `undefined`

Head node or undefined.

***

### last

#### Get Signature

```ts
get last(): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:229](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L229)

Get the last element value.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E` \| `undefined`

Last element or undefined.

***

### length

#### Get Signature

```ts
get length(): number;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:209](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L209)

Get the number of elements.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Current length.

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`length`](LinearLinkedBase.md#length)

***

### maxLen

#### Get Signature

```ts
get maxLen(): number;
```

Defined in: [data-structures/base/linear-base.ts:100](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L100)

Upper bound for length (if positive), or `-1` when unbounded.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Maximum allowed length.

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`maxLen`](LinearLinkedBase.md#maxlen)

***

### tail

#### Get Signature

```ts
get tail(): DoublyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:197](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L197)

Get the tail node.

##### Remarks

Time O(1), Space O(1)

##### Returns

[`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\> \| `undefined`

Tail node or undefined.

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

[`LinearLinkedBase`](LinearLinkedBase.md).[`toElementFn`](LinearLinkedBase.md#toelementfn)

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

[`LinearLinkedBase`](LinearLinkedBase.md).[`[iterator]`](LinearLinkedBase.md#iterator)

***

### addAfter()

```ts
addAfter(existingElementOrNode, newElementOrNode): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:745](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L745)

Insert a new element/node after an existing one.

#### Parameters

##### existingElementOrNode

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Existing element or node.

##### newElementOrNode

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Element or node to insert.

#### Returns

`boolean`

True if inserted.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`addAfter`](LinearLinkedBase.md#addafter)

***

### addAt()

```ts
addAt(index, newElementOrNode): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:694](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L694)

Insert a new element/node at an index, shifting following nodes.

#### Parameters

##### index

`number`

Zero-based index.

##### newElementOrNode

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Element or node to insert.

#### Returns

`boolean`

True if inserted.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 3]);
    list.addAt(1, 2);
console.log(list.toArray()); // [1, 2, 3]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`addAt`](LinearLinkedBase.md#addat)

***

### addBefore()

```ts
addBefore(existingElementOrNode, newElementOrNode): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:718](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L718)

Insert a new element/node before an existing one.

#### Parameters

##### existingElementOrNode

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Existing element or node.

##### newElementOrNode

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Element or node to insert.

#### Returns

`boolean`

True if inserted.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`addBefore`](LinearLinkedBase.md#addbefore)

***

### at()

```ts
at(index): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:569](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L569)

Get the element at a given index.

#### Parameters

##### index

`number`

Zero-based index.

#### Returns

`E` \| `undefined`

Element or undefined.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<string>(['a', 'b', 'c']);
console.log(list.at(1)); // 'b'
console.log(list.at(2)); // 'c'
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`at`](LinearLinkedBase.md#at)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:952](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L952)

Remove all nodes and reset length.

#### Returns

`void`

void

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2]);
    list.clear();
console.log(list.isEmpty()); // true
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`clear`](LinearLinkedBase.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:1153](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L1153)

Deep clone this list (values are copied by reference).

#### Returns

`this`

A new list with the same element sequence.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
    const copy = list.clone();
    copy.pop();
console.log(list.length); // 3
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`clone`](LinearLinkedBase.md#clone)

***

### concat()

```ts
concat(...items): this;
```

Defined in: [data-structures/base/linear-base.ts:473](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L473)

Concatenate lists/elements preserving order.

#### Parameters

##### items

...(
  \| `E`
  \| [`LinearBase`](LinearBase.md)\<`E`, `R`, [`LinkedListNode`](LinkedListNode.md)\<`E`\>\>)[]

Elements or `LinearBase` instances.

#### Returns

`this`

New list with combined elements (`this` type).

#### Remarks

Time O(sum(length)), Space O(sum(length))

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`concat`](LinearLinkedBase.md#concat)

***

### delete()

```ts
delete(elementOrNode?): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:862](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L862)

Delete the first match by value/node.

#### Parameters

##### elementOrNode?

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Element or node to remove.

#### Returns

`boolean`

True if removed.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3, 2]);
    list.delete(2);
console.log(list.toArray()); // [1, 3, 2]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`delete`](LinearLinkedBase.md#delete)

***

### deleteAt()

```ts
deleteAt(index): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:812](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L812)

Delete the element at an index.

#### Parameters

##### index

`number`

Zero-based index.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<string>(['a', 'b', 'c']);
    list.deleteAt(1);
console.log(list.toArray()); // ['a', 'c']
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`deleteAt`](LinearLinkedBase.md#deleteat)

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

#### Example

```ts
const list = new DoublyLinkedList<number>([2, 4, 6]);
console.log(list.every(x => x % 2 === 0)); // true
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`every`](LinearLinkedBase.md#every)

***

### fill()

```ts
fill(
   value, 
   start?, 
   end?): this;
```

Defined in: [data-structures/base/linear-base.ts:292](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L292)

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

[`LinearLinkedBase`](LinearLinkedBase.md).[`fill`](LinearLinkedBase.md#fill)

***

### filter()

```ts
filter(callback, thisArg?): this;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:1199](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L1199)

Filter values into a new list of the same class.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `boolean`\>

Predicate (value, index, list) → boolean to keep value.

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`this`

A new list with kept values.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3, 4, 5]);
    const evens = list.filter(n => n % 2 === 0);
console.log([...evens]); // [2, 4]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`filter`](LinearLinkedBase.md#filter)

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

##### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
console.log(list.find(x => x > 1)); // 2
```

##### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`find`](LinearLinkedBase.md#find)

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

##### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
console.log(list.find(x => x > 1)); // 2
```

##### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`find`](LinearLinkedBase.md#find)

***

### findIndex()

```ts
findIndex(predicate, thisArg?): number;
```

Defined in: [data-structures/base/linear-base.ts:151](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L151)

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

[`LinearLinkedBase`](LinearLinkedBase.md).[`findIndex`](LinearLinkedBase.md#findindex)

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

[`LinearLinkedBase`](LinearLinkedBase.md).[`forEach`](LinearLinkedBase.md#foreach)

***

### getBackward()

```ts
getBackward(elementNodeOrPredicate): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:1043](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L1043)

Find the first value matching a predicate scanning backward.

#### Parameters

##### elementNodeOrPredicate

  \| `E`
  \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or predicate to match.

#### Returns

`E` \| `undefined`

Matched value or undefined.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3, 4]);
    // getBackward scans from tail to head, returns first match
    const found = list.getBackward(node => node.value < 4);
console.log(found); // 3
```

***

### getNode()

```ts
getNode(elementNodeOrPredicate?): DoublyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:625](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L625)

Find a node by value, reference, or predicate.

#### Parameters

##### elementNodeOrPredicate?

  \| `E`
  \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or predicate to match.

#### Returns

[`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\> \| `undefined`

Matching node or undefined.

#### Remarks

Time O(N), Space O(1)

***

### getNodeAt()

```ts
getNodeAt(index): DoublyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:611](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L611)

Get the node reference at a given index.

#### Parameters

##### index

`number`

Zero-based index.

#### Returns

[`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\> \| `undefined`

Node or undefined.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<string>(['a', 'b', 'c']);
console.log(list.getNodeAt(1)?.value); // 'b'
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`getNodeAt`](LinearLinkedBase.md#getnodeat)

***

### has()

```ts
has(element): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:188](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L188)

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

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
console.log(list.has(2)); // true
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`has`](LinearLinkedBase.md#has)

***

### indexOf()

```ts
indexOf(searchElement, fromIndex?): number;
```

Defined in: [data-structures/base/linear-base.ts:422](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L422)

Linked-list optimized `indexOf` (forwards scan).

#### Parameters

##### searchElement

`E`

Value to match.

##### fromIndex?

`number` = `0`

Start position.

#### Returns

`number`

Index or `-1`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<string>(['a', 'b', 'c']);
console.log(list.indexOf('b')); // 1
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`indexOf`](LinearLinkedBase.md#indexof)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:912](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L912)

Check whether the list is empty.

#### Returns

`boolean`

True if length is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
console.log(new DoublyLinkedList().isEmpty()); // true
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`isEmpty`](LinearLinkedBase.md#isempty)

***

### isNode()

```ts
isNode(elementNodeOrPredicate): elementNodeOrPredicate is DoublyLinkedListNode<E>;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:260](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L260)

Type guard: check whether the input is a DoublyLinkedListNode.

#### Parameters

##### elementNodeOrPredicate

  \| `E`
  \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or predicate.

#### Returns

`elementNodeOrPredicate is DoublyLinkedListNode<E>`

True if the value is a DoublyLinkedListNode.

#### Remarks

Time O(1), Space O(1)

***

### join()

```ts
join(separator?): string;
```

Defined in: [data-structures/base/linear-base.ts:228](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L228)

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

[`LinearLinkedBase`](LinearLinkedBase.md).[`join`](LinearLinkedBase.md#join)

***

### lastIndexOf()

```ts
lastIndexOf(searchElement, fromIndex?): number;
```

Defined in: [data-structures/base/linear-base.ts:448](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L448)

Linked-list optimized `lastIndexOf` (reverse scan).

#### Parameters

##### searchElement

`E`

Value to match.

##### fromIndex?

`number` = `...`

Start position.

#### Returns

`number`

Index or `-1`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`lastIndexOf`](LinearLinkedBase.md#lastindexof)

***

### map()

```ts
map<EM, RM>(
   callback, 
   options?, 
thisArg?): DoublyLinkedList<EM, RM>;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:1276](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L1276)

Map values into a new list (possibly different element type).

#### Type Parameters

##### EM

`EM`

##### RM

`RM`

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `EM`\>

Mapping function (value, index, list) → newElement.

##### options?

`DoublyLinkedListOptions`\<`EM`, `RM`\>

Options for the output list (e.g., maxLen, toElementFn).

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`DoublyLinkedList`\<`EM`, `RM`\>

A new DoublyLinkedList with mapped values.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3, 4, 5]);

    // Iterate through list
    const doubled = list.map(value => value * 2);
console.log(doubled.length); // 5

    // Use for...of loop
    const result: number[] = [];
    for (const item of list) {
      result.push(item);
    }
console.log(result); // [1, 2, 3, 4, 5]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`map`](LinearLinkedBase.md#map)

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:1214](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L1214)

Map values into a new list of the same class.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `E`\>

Mapping function (value, index, list) → newValue.

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`this`

A new list with mapped values.

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`mapSame`](LinearLinkedBase.md#mapsame)

***

### pop()

```ts
pop(): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:378](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L378)

Remove and return the tail element.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([10, 20, 30, 40, 50]);

    // Pop removes from the end
    const last = list.pop();
console.log(last); // 50

    // Shift removes from the beginning
    const first = list.shift();
console.log(first); // 10

    // Verify remaining elements
console.log([...list]); // [20, 30, 40]
console.log(list.length); // 3
```

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

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`print`](LinearLinkedBase.md#print)

***

### push()

```ts
push(elementOrNode): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:315](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L315)

Append an element/node to the tail.

#### Parameters

##### elementOrNode

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Element or node to append.

#### Returns

`boolean`

True when appended.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
// Create a simple DoublyLinkedList with initial values
    const list = new DoublyLinkedList([1, 2, 3, 4, 5]);

    // Verify the list maintains insertion order
console.log([...list]); // [1, 2, 3, 4, 5]

    // Check length
console.log(list.length); // 5

    // Push a new element to the end
    list.push(6);
console.log(list.length); // 6
console.log([...list]); // [1, 2, 3, 4, 5, 6]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`push`](LinearLinkedBase.md#push)

***

### pushMany()

```ts
pushMany(elements): boolean[];
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:505](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L505)

Append a sequence of elements/nodes.

#### Parameters

##### elements

  \| `Iterable`\<`E`, `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>
  \| `Iterable`\<[`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>, `any`, `any`\>

Iterable of elements or nodes (or raw records if toElementFn is provided).

#### Returns

`boolean`[]

Array of per-element success flags.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`pushMany`](LinearLinkedBase.md#pushmany)

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

##### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
    const sum = list.reduce((acc, val) => acc + val, 0);
console.log(sum); // 6
```

##### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`reduce`](LinearLinkedBase.md#reduce)

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

##### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
    const sum = list.reduce((acc, val) => acc + val, 0);
console.log(sum); // 6
```

##### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`reduce`](LinearLinkedBase.md#reduce)

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

##### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
    const sum = list.reduce((acc, val) => acc + val, 0);
console.log(sum); // 6
```

##### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`reduce`](LinearLinkedBase.md#reduce)

***

### reduceRight()

```ts
reduceRight<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/linear-base.ts:574](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L574)

Right-to-left reduction using reverse iterator.

#### Type Parameters

##### U

`U`

#### Parameters

##### callbackfn

`ReduceLinearCallback`\<`E`, `U`\>

`(acc, element, index, self) => acc`.

##### initialValue

`U`

Initial accumulator.

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`reduceRight`](LinearLinkedBase.md#reduceright)

***

### reverse()

```ts
reverse(): this;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:1093](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L1093)

Reverse the list in place.

#### Returns

`this`

This list.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
    list.reverse();
console.log([...list]); // [3, 2, 1]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`reverse`](LinearLinkedBase.md#reverse)

***

### search()

```ts
search(elementNodeOrPredicate): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:994](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L994)

Find the first value matching a predicate scanning forward.

#### Parameters

##### elementNodeOrPredicate

  \| `E`
  \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or predicate to match.

#### Returns

`E` \| `undefined`

Matched value or undefined.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([10, 20, 30]);
    const found = list.search(node => node.value > 15);
console.log(found); // 20
```

***

### setAt()

```ts
setAt(index, value): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:769](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L769)

Set the element value at an index.

#### Parameters

##### index

`number`

Zero-based index.

##### value

`E`

New value.

#### Returns

`boolean`

True if updated.

#### Remarks

Time O(N), Space O(1)

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`setAt`](LinearLinkedBase.md#setat)

***

### setEquality()

```ts
setEquality(equals): this;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:1111](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L1111)

Set the equality comparator used to compare values.

#### Parameters

##### equals

(`a`, `b`) => `boolean`

Equality predicate (a, b) → boolean.

#### Returns

`this`

This list.

#### Remarks

Time O(1), Space O(1)

***

### shift()

```ts
shift(): E | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:430](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L430)

Remove and return the head element.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([10, 20, 30]);
console.log(list.shift()); // 10
console.log(list.first); // 20
```

***

### slice()

```ts
slice(start?, end?): this;
```

Defined in: [data-structures/base/linear-base.ts:494](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L494)

Slice via forward iteration (no random access required).

#### Parameters

##### start?

`number` = `0`

Inclusive start (supports negative index).

##### end?

`number` = `...`

Exclusive end (supports negative index).

#### Returns

`this`

New list (`this` type).

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`slice`](LinearLinkedBase.md#slice)

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

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 3, 4]);
console.log(list.some(x => x > 3)); // true
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`some`](LinearLinkedBase.md#some)

***

### sort()

```ts
sort(compareFn?): this;
```

Defined in: [data-structures/base/linear-base.ts:185](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L185)

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
const list = new DoublyLinkedList<number>([3, 1, 2]);
    list.sort((a, b) => a - b);
console.log(list.toArray()); // [1, 2, 3]
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`sort`](LinearLinkedBase.md#sort)

***

### splice()

```ts
splice(
   start, 
   deleteCount?, ...
   items): this;
```

Defined in: [data-structures/base/linear-base.ts:522](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L522)

Splice by walking node iterators from the start index.

#### Parameters

##### start

`number`

Start index.

##### deleteCount?

`number` = `0`

How many elements to remove.

##### items

...`E`[]

Elements to insert after the splice point.

#### Returns

`this`

Removed elements as a new list (`this` type).

#### Remarks

Time O(n + m), Space O(min(n, m)) where `m = items.length`

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`splice`](LinearLinkedBase.md#splice)

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

#### Example

```ts
const list = new DoublyLinkedList<number>([3, 1, 2]);
console.log(list.toArray()); // [3, 1, 2]
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`toArray`](LinearLinkedBase.md#toarray)

***

### toReversedArray()

```ts
toReversedArray(): E[];
```

Defined in: [data-structures/base/linear-base.ts:237](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L237)

Snapshot elements into a reversed array.

#### Returns

`E`[]

New reversed array.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`toReversedArray`](LinearLinkedBase.md#toreversedarray)

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

[`LinearLinkedBase`](LinearLinkedBase.md).[`toVisual`](LinearLinkedBase.md#tovisual)

***

### unshift()

```ts
unshift(elementOrNode): boolean;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:483](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L483)

Prepend an element/node to the head.

#### Parameters

##### elementOrNode

`E` \| [`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>

Element or node to prepend.

#### Returns

`boolean`

True when prepended.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const list = new DoublyLinkedList<number>([2, 3]);
    list.unshift(1);
console.log([...list]); // [1, 2, 3]
```

***

### unshiftMany()

```ts
unshiftMany(elements): boolean[];
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:521](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L521)

Prepend a sequence of elements/nodes.

#### Parameters

##### elements

  \| `Iterable`\<`E`, `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>
  \| `Iterable`\<[`DoublyLinkedListNode`](DoublyLinkedListNode.md)\<`E`\>, `any`, `any`\>

Iterable of elements or nodes (or raw records if toElementFn is provided).

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

Defined in: [data-structures/base/iterable-element-base.ts:71](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L71)

Returns an iterator over the values (alias of the default iterator).

#### Returns

`IterableIterator`\<`E`\>

An `IterableIterator<E>` over all elements.

#### Remarks

Creating the iterator is O(1); full iteration is Time O(n), Space O(1).

#### Example

```ts
const list = new DoublyLinkedList<number>([1, 2, 3]);
console.log([...list.values()]); // [1, 2, 3]
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`values`](LinearLinkedBase.md#values)

***

### fromArray()

```ts
static fromArray<E, R>(this, data): any;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:243](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L243)

Create a new list from an array of elements.

#### Type Parameters

##### E

`E`

##### R

`R` = `any`

#### Parameters

##### this

`Object`

The constructor (subclass) to instantiate.

##### data

`E`[]

Array of elements to insert.

#### Returns

`any`

A new list populated with the array's elements.

#### Remarks

Time O(N), Space O(N)
