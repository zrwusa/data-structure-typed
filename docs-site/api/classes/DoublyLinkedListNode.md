[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / DoublyLinkedListNode

# Class: DoublyLinkedListNode\<E\>

Defined in: [data-structures/linked-list/doubly-linked-list.ts:17](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L17)

Node of a doubly linked list; stores value and prev/next links.

## Remarks

Time O(1), Space O(1)

## Extends

- [`LinkedListNode`](LinkedListNode.md)\<`E`\>

## Type Parameters

### E

`E` = `any`

## Constructors

### Constructor

```ts
new DoublyLinkedListNode<E>(value): DoublyLinkedListNode<E>;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:25](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L25)

Create a node.

#### Parameters

##### value

`E`

Element value to store.

#### Returns

`DoublyLinkedListNode`\<`E`\>

New node instance.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`LinkedListNode`](LinkedListNode.md).[`constructor`](LinkedListNode.md#constructor)

## Accessors

### next

#### Get Signature

```ts
get next(): DoublyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:40](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L40)

Get the next node link.

##### Remarks

Time O(1), Space O(1)

##### Returns

`DoublyLinkedListNode`\<`E`\> \| `undefined`

Next node or undefined.

#### Set Signature

```ts
set next(value): void;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:51](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L51)

Set the next node link.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`DoublyLinkedListNode`\<`E`\> \| `undefined`

Next node or undefined.

##### Returns

`void`

void

#### Overrides

[`LinkedListNode`](LinkedListNode.md).[`next`](LinkedListNode.md#next)

***

### prev

#### Get Signature

```ts
get prev(): DoublyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:63](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L63)

Get the previous node link.

##### Remarks

Time O(1), Space O(1)

##### Returns

`DoublyLinkedListNode`\<`E`\> \| `undefined`

Previous node or undefined.

#### Set Signature

```ts
set prev(value): void;
```

Defined in: [data-structures/linked-list/doubly-linked-list.ts:74](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/linked-list/doubly-linked-list.ts#L74)

Set the previous node link.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`DoublyLinkedListNode`\<`E`\> \| `undefined`

Previous node or undefined.

##### Returns

`void`

void

***

### value

#### Get Signature

```ts
get value(): E;
```

Defined in: [data-structures/base/linear-base.ts:27](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L27)

Element payload getter.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E`

Element value.

#### Set Signature

```ts
set value(value): void;
```

Defined in: [data-structures/base/linear-base.ts:36](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L36)

Element payload setter.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`E`

New value.

##### Returns

`void`

#### Inherited from

[`LinkedListNode`](LinkedListNode.md).[`value`](LinkedListNode.md#value)
