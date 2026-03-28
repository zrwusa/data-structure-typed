[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / SinglyLinkedList

# Class: SinglyLinkedList\<E, R\>

Defined in: [data-structures/linked-list/singly-linked-list.ts:194](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L194)

Singly linked list with O(1) push/pop-like ends operations and linear scans.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// SinglyLinkedList for sequentially processed data stream
 interface LogEntry {
      timestamp: number;
      level: 'INFO' | 'WARN' | 'ERROR';
      message: string;
    }

    // SinglyLinkedList is ideal for sequential processing where you only need forward iteration
    // O(1) insertion/deletion at head, O(n) for tail operations
    const logStream = new SinglyLinkedList<LogEntry>();

    // Simulate incoming log entries
    const entries: LogEntry[] = [
      { timestamp: 1000, level: 'INFO', message: 'Server started' },
      { timestamp: 1100, level: 'WARN', message: 'Memory usage high' },
      { timestamp: 1200, level: 'ERROR', message: 'Connection failed' },
      { timestamp: 1300, level: 'INFO', message: 'Connection restored' }
    ];

    // Add entries to the stream
    for (const entry of entries) {
      logStream.push(entry);
    }

    console.log(logStream.length); // 4;

    // Process logs sequentially (only forward iteration needed)
    const processedLogs: string[] = [];
    for (const log of logStream) {
      processedLogs.push(`[${log.level}] ${log.message}`);
    }

    console.log(processedLogs); // [
 //      '[INFO] Server started',
 //      '[WARN] Memory usage high',
 //      '[ERROR] Connection failed',
 //      '[INFO] Connection restored'
 //    ];

    // Get first log (O(1) - direct head access)
    const firstLog = logStream.at(0);
    console.log(firstLog?.message); // 'Server started';

    // Remove oldest log (O(1) operation at head)
    const removed = logStream.shift();
    console.log(removed?.message); // 'Server started';
    console.log(logStream.length); // 3;

    // Remaining logs still maintain order for sequential processing
    console.log(logStream.length); // 3;
```

```ts
// implementation of a basic text editor
 class TextEditor {
      private content: SinglyLinkedList<string>;
      private cursorIndex: number;
      private undoStack: Stack<{ operation: string; data?: any }>;

      constructor() {
        this.content = new SinglyLinkedList<string>();
        this.cursorIndex = 0; // Cursor starts at the beginning
        this.undoStack = new Stack<{ operation: string; data?: any }>(); // Stack to keep track of operations for undo
      }

      insert(char: string) {
        this.content.addAt(this.cursorIndex, char);
        this.cursorIndex++;
        this.undoStack.push({ operation: 'insert', data: { index: this.cursorIndex - 1 } });
      }

      delete() {
        if (this.cursorIndex === 0) return; // Nothing to delete
        const deleted = this.content.deleteAt(this.cursorIndex - 1);
        this.cursorIndex--;
        this.undoStack.push({ operation: 'delete', data: { index: this.cursorIndex, char: deleted } });
      }

      moveCursor(index: number) {
        this.cursorIndex = Math.max(0, Math.min(index, this.content.length));
      }

      undo() {
        if (this.undoStack.size === 0) return; // No operations to undo
        const lastAction = this.undoStack.pop();

        if (lastAction!.operation === 'insert') {
          this.content.deleteAt(lastAction!.data.index);
          this.cursorIndex = lastAction!.data.index;
        } else if (lastAction!.operation === 'delete') {
          this.content.addAt(lastAction!.data.index, lastAction!.data.char);
          this.cursorIndex = lastAction!.data.index + 1;
        }
      }

      getText(): string {
        return [...this.content].join('');
      }
    }

    // Example Usage
    const editor = new TextEditor();
    editor.insert('H');
    editor.insert('e');
    editor.insert('l');
    editor.insert('l');
    editor.insert('o');
    console.log(editor.getText()); // 'Hello'; // Output: "Hello"

    editor.delete();
    console.log(editor.getText()); // 'Hell'; // Output: "Hell"

    editor.undo();
    console.log(editor.getText()); // 'Hello'; // Output: "Hello"

    editor.moveCursor(1);
    editor.insert('a');
    console.log(editor.getText()); // 'Haello';
```

```ts
// Find first matching element
 const list = new SinglyLinkedList<number>([1, 2, 3, 4, 5]);
    console.log(list.find(n => n > 3)); // 4;
    console.log(list.find(n => n > 10)); // undefined;
```

```ts
// Iterate over elements
 const list = new SinglyLinkedList<number>([10, 20, 30]);
    const result: number[] = [];
    list.forEach(n => result.push(n));
    console.log(result); // [10, 20, 30];
```

## Extends

- [`LinearLinkedBase`](LinearLinkedBase.md)\<`E`, `R`, [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>\>

## Extended by

- [`LinkedListQueue`](LinkedListQueue.md)

## Type Parameters

### E

`E` = `any`

### R

`R` = `any`

1. Node Structure: Each node contains three parts: a data field, a pointer (or reference) to the previous node, and a pointer to the next node. This structure allows traversal of the linked list in both directions.
2. Bidirectional Traversal: Unlike doubly linked lists, singly linked lists can be easily traversed forwards but not backwards.
3. No Centralized Index: Unlike arrays, elements in a linked list are not stored contiguously, so there is no centralized index. Accessing elements in a linked list typically requires traversing from the head or tail node.
4. High Efficiency in Insertion and Deletion: Adding or removing elements in a linked list does not require moving other elements, making these operations more efficient than in arrays.
Caution: Although our linked list classes provide methods such as at, setAt, addAt, and indexOf that are based on array indices, their time complexity, like that of the native Array.lastIndexOf, is 𝑂(𝑛). If you need to use these methods frequently, you might want to consider other data structures, such as Deque or Queue (designed for random access). Similarly, since the native Array.shift method has a time complexity of 𝑂(𝑛), using an array to simulate a queue can be inefficient. In such cases, you should use Queue or Deque, as these data structures leverage deferred array rearrangement, effectively reducing the average time complexity to 𝑂(1).

## Constructors

### Constructor

```ts
new SinglyLinkedList<E, R>(elements?, options?): SinglyLinkedList<E, R>;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:205](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L205)

Create a SinglyLinkedList and optionally bulk-insert elements.

#### Parameters

##### elements?

  \| `Iterable`\<`E`, `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>
  \| `Iterable`\<[`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>, `any`, `any`\>

Iterable of elements or nodes (or raw records if toElementFn is provided).

##### options?

`SinglyLinkedListOptions`\<`E`, `R`\>

Options such as maxLen and toElementFn.

#### Returns

`SinglyLinkedList`\<`E`, `R`\>

New SinglyLinkedList instance.

#### Remarks

Time O(N), Space O(N)

#### Overrides

```ts
LinearLinkedBase<E, R, SinglyLinkedListNode<E>>.constructor
```

## Accessors

### first

#### Get Signature

```ts
get first(): E | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:255](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L255)

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
get head(): SinglyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:221](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L221)

Get the head node.

##### Remarks

Time O(1), Space O(1)

##### Returns

[`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\> \| `undefined`

Head node or undefined.

***

### last

#### Get Signature

```ts
get last(): E | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:265](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L265)

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:245](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L245)

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
get tail(): SinglyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:233](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L233)

Get the tail node.

##### Remarks

Time O(1), Space O(1)

##### Returns

[`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\> \| `undefined`

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:1045](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1045)

Insert a new element/node after an existing one.

#### Parameters

##### existingElementOrNode

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

Existing element or node.

##### newElementOrNode

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:826](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L826)

Insert a new element/node at an index, shifting following nodes.

#### Parameters

##### index

`number`

Zero-based index.

##### newElementOrNode

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

Element or node to insert.

#### Returns

`boolean`

True if inserted.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<number>([1, 3]);
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

Defined in: [data-structures/linked-list/singly-linked-list.ts:1015](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1015)

Insert a new element/node before an existing one.

#### Parameters

##### existingElementOrNode

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

Existing element or node.

##### newElementOrNode

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:626](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L626)

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
const list = new SinglyLinkedList<string>(['a', 'b', 'c', 'd']);
console.log(list.at(0)); // 'a'
console.log(list.at(2)); // 'c'
console.log(list.at(3)); // 'd'
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`at`](LinearLinkedBase.md#at)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:927](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L927)

Remove all nodes and reset length.

#### Returns

`void`

void

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<number>([1, 2, 3]);
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

Defined in: [data-structures/linked-list/singly-linked-list.ts:1211](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1211)

Deep clone this list (values are copied by reference).

#### Returns

`this`

A new list with the same element sequence.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const list = new SinglyLinkedList<number>([1, 2, 3]);
    const copy = list.clone();
    copy.pop();
console.log(list.length); // 3
console.log(copy.length); // 2
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

### countOccurrences()

```ts
countOccurrences(elementOrNode): number;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:1121](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1121)

Count how many nodes match a value/node/predicate.

#### Parameters

##### elementOrNode

  \| `E`
  \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or node predicate to match.

#### Returns

`number`

Number of matches in the list.

#### Remarks

Time O(N), Space O(1)

***

### delete()

```ts
delete(elementOrNode?): boolean;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:772](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L772)

Delete the first match by value/node.

#### Parameters

##### elementOrNode?

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

Element or node to remove; if omitted/undefined, nothing happens.

#### Returns

`boolean`

True if removed.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<number>([1, 2, 3, 2]);
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

Defined in: [data-structures/linked-list/singly-linked-list.ts:724](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L724)

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
const list = new SinglyLinkedList<string>(['a', 'b', 'c']);
    list.deleteAt(1);
console.log(list.toArray()); // ['a', 'c']
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`deleteAt`](LinearLinkedBase.md#deleteat)

***

### deleteWhere()

```ts
deleteWhere(predicate): boolean;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:1151](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1151)

Delete the first node whose value matches a predicate.

#### Parameters

##### predicate

(`value`, `index`, `list`) => `boolean`

Predicate (value, index, list) → boolean to decide deletion.

#### Returns

`boolean`

True if a node was removed.

#### Remarks

Time O(N), Space O(1)

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
const list = new SinglyLinkedList<number>([2, 4, 6]);
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

Defined in: [data-structures/linked-list/singly-linked-list.ts:1267](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1267)

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
const list = new SinglyLinkedList<number>([1, 2, 3, 4, 5]);

    // Filter even numbers
    const filtered = list.filter(value => value % 2 === 0);
console.log(filtered.length); // 2

    // Map to double values
    const doubled = list.map(value => value * 2);
console.log(doubled.length); // 5

    // Use reduce to sum
    const sum = list.reduce((acc, value) => acc + value, 0);
console.log(sum); // 15
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
const list = new SinglyLinkedList<number>([1, 2, 3, 4]);
console.log(list.find(x => x > 2)); // 3
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
const list = new SinglyLinkedList<number>([1, 2, 3, 4]);
console.log(list.find(x => x > 2)); // 3
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

### getNode()

```ts
getNode(elementNodeOrPredicate?): SinglyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:993](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L993)

Find a node by value, reference, or predicate.

#### Parameters

##### elementNodeOrPredicate?

  \| `E`
  \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or node predicate to match.

#### Returns

[`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\> \| `undefined`

Matching node or undefined.

#### Remarks

Time O(N), Space O(1)

***

### getNodeAt()

```ts
getNodeAt(index): SinglyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:681](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L681)

Get the node reference at a given index.

#### Parameters

##### index

`number`

Zero-based index.

#### Returns

[`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\> \| `undefined`

Node or undefined.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<string>(['a', 'b', 'c']);
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
const list = new SinglyLinkedList<number>([1, 2, 3]);
console.log(list.has(2)); // true
console.log(list.has(9)); // false
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
const list = new SinglyLinkedList<string>(['a', 'b', 'c']);
console.log(list.indexOf('b')); // 1
console.log(list.indexOf('z')); // -1
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`indexOf`](LinearLinkedBase.md#indexof)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:887](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L887)

Check whether the list is empty.

#### Returns

`boolean`

True if length is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
console.log(new SinglyLinkedList().isEmpty()); // true
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`isEmpty`](LinearLinkedBase.md#isempty)

***

### isNode()

```ts
isNode(elementNodeOrPredicate): elementNodeOrPredicate is SinglyLinkedListNode<E>;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:640](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L640)

Type guard: check whether the input is a SinglyLinkedListNode.

#### Parameters

##### elementNodeOrPredicate

  \| `E`
  \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or predicate.

#### Returns

`elementNodeOrPredicate is SinglyLinkedListNode<E>`

True if the value is a SinglyLinkedListNode.

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
thisArg?): SinglyLinkedList<EM, RM>;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:1335](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1335)

Map values into a new list (possibly different element type).

#### Type Parameters

##### EM

`EM`

##### RM

`RM` = `any`

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `EM`\>

Mapping function (value, index, list) → newElement.

##### options?

`SinglyLinkedListOptions`\<`EM`, `RM`\>

Options for the output list (e.g., maxLen, toElementFn).

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`SinglyLinkedList`\<`EM`, `RM`\>

A new SinglyLinkedList with mapped values.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const list = new SinglyLinkedList<number>([1, 2, 3]);
    const doubled = list.map(n => n * 2);
console.log([...doubled]); // [2, 4, 6]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`map`](LinearLinkedBase.md#map)

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:1282](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1282)

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:404](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L404)

Remove and return the tail element.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<number>([10, 20, 30, 40, 50]);

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
const list = new SinglyLinkedList<number>([1, 2, 3]);
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`print`](LinearLinkedBase.md#print)

***

### push()

```ts
push(elementOrNode): boolean;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:343](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L343)

Append an element/node to the tail.

#### Parameters

##### elementOrNode

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

Element or node to append.

#### Returns

`boolean`

True when appended.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
// Create a simple SinglyLinkedList with initial values
    const list = new SinglyLinkedList([1, 2, 3, 4, 5]);

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:542](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L542)

Append a sequence of elements/nodes.

#### Parameters

##### elements

  \| `Iterable`\<`E`, `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>
  \| `Iterable`\<[`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>, `any`, `any`\>

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
const list = new SinglyLinkedList<number>([1, 2, 3, 4]);
    const sum = list.reduce((acc, val) => acc + val, 0);
console.log(sum); // 10
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
const list = new SinglyLinkedList<number>([1, 2, 3, 4]);
    const sum = list.reduce((acc, val) => acc + val, 0);
console.log(sum); // 10
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
const list = new SinglyLinkedList<number>([1, 2, 3, 4]);
    const sum = list.reduce((acc, val) => acc + val, 0);
console.log(sum); // 10
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

Defined in: [data-structures/linked-list/singly-linked-list.ts:971](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L971)

Reverse the list in place.

#### Returns

`this`

This list.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<number>([1, 2, 3, 4]);
    list.reverse();
console.log([...list]); // [4, 3, 2, 1]
```

#### Overrides

[`LinearLinkedBase`](LinearLinkedBase.md).[`reverse`](LinearLinkedBase.md#reverse)

***

### search()

```ts
search(elementNodeOrPredicate): E | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:574](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L574)

Find the first value matching a predicate (by node).

#### Parameters

##### elementNodeOrPredicate

  \| `E`
  \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>
  \| ((`node`) => `boolean`)

Element, node, or node predicate to match.

#### Returns

`E` \| `undefined`

Matched value or undefined.

#### Remarks

Time O(N), Space O(1)

***

### setAt()

```ts
setAt(index, value): boolean;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:846](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L846)

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:1139](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1139)

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

Defined in: [data-structures/linked-list/singly-linked-list.ts:460](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L460)

Remove and return the head element.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<number>([10, 20, 30]);
console.log(list.shift()); // 10
console.log(list.length); // 2
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
const list = new SinglyLinkedList<number>([1, 3, 4]);
console.log(list.some(x => x % 2 === 0)); // true
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
const list = new SinglyLinkedList<number>([3, 1, 2]);
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
   items?): this;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:1065](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L1065)

Remove and/or insert elements at a position (array-like behavior).

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

A new list containing the removed elements (typed as `this`).

#### Remarks

Time O(N + M), Space O(M)

#### Overrides

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
const list = new SinglyLinkedList<number>([3, 1, 2]);
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

Defined in: [data-structures/linked-list/singly-linked-list.ts:523](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L523)

Prepend an element/node to the head.

#### Parameters

##### elementOrNode

`E` \| [`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>

Element or node to prepend.

#### Returns

`boolean`

True when prepended.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const list = new SinglyLinkedList<number>([20, 30, 40]);

    // Unshift adds to the beginning
    list.unshift(10);
console.log([...list]); // [10, 20, 30, 40]

    // Access elements (forward traversal only for singly linked)
    const second = list.at(1);
console.log(second); // 20

    // SinglyLinkedList allows forward iteration only
    const elements: number[] = [];
    for (const item of list) {
      elements.push(item);
    }
console.log(elements); // [10, 20, 30, 40]

console.log(list.length); // 4
```

***

### unshiftMany()

```ts
unshiftMany(elements): boolean[];
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:558](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L558)

Prepend a sequence of elements/nodes.

#### Parameters

##### elements

  \| `Iterable`\<`E`, `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>
  \| `Iterable`\<[`SinglyLinkedListNode`](SinglyLinkedListNode.md)\<`E`\>, `any`, `any`\>

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
const list = new SinglyLinkedList<number>([1, 2, 3]);
console.log([...list.values()]); // [1, 2, 3]
```

#### Inherited from

[`LinearLinkedBase`](LinearLinkedBase.md).[`values`](LinearLinkedBase.md#values)

***

### from()

```ts
static from<E, R, S>(
   this, 
   data, 
   options?): S;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:281](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/singly-linked-list.ts#L281)

Create a new list from an iterable of elements.

#### Type Parameters

##### E

`E`

##### R

`R` = `any`

##### S

`S` *extends* `SinglyLinkedList`\<`E`, `R`\> = `SinglyLinkedList`\<`E`, `R`\>

#### Parameters

##### this

`Object`

The constructor (subclass) to instantiate.

##### data

`Iterable`\<`E`\>

Iterable of elements to insert.

##### options?

`SinglyLinkedListOptions`\<`E`, `R`\>

Options forwarded to the constructor.

#### Returns

`S`

A new list populated with the iterable's elements.

#### Remarks

Time O(N), Space O(N)
