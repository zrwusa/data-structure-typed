[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / SinglyLinkedListNode

# Class: SinglyLinkedListNode\<E\>

Defined in: [data-structures/linked-list/singly-linked-list.ts:17](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/singly-linked-list.ts#L17)

Node of a singly linked list; stores value and the next link.

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
new SinglyLinkedListNode<E>(value): SinglyLinkedListNode<E>;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:25](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/singly-linked-list.ts#L25)

Create a list node.

#### Parameters

##### value

`E`

Element value to store.

#### Returns

`SinglyLinkedListNode`\<`E`\>

New node instance.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`LinkedListNode`](LinkedListNode.md).[`constructor`](LinkedListNode.md#constructor)

## Accessors

### next

#### Get Signature

```ts
get next(): SinglyLinkedListNode<E> | undefined;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:39](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/singly-linked-list.ts#L39)

Get the next node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`SinglyLinkedListNode`\<`E`\> \| `undefined`

Next node or undefined.

#### Set Signature

```ts
set next(value): void;
```

Defined in: [data-structures/linked-list/singly-linked-list.ts:50](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/singly-linked-list.ts#L50)

Set the next node.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`SinglyLinkedListNode`\<`E`\> \| `undefined`

Next node or undefined.

##### Returns

`void`

void

#### Overrides

[`LinkedListNode`](LinkedListNode.md).[`next`](LinkedListNode.md#next)

***

### value

#### Get Signature

```ts
get value(): E;
```

Defined in: [data-structures/base/linear-base.ts:27](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L27)

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

Defined in: [data-structures/base/linear-base.ts:36](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/linear-base.ts#L36)

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
