[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / LinkedListNode

# Class: LinkedListNode\<E\>

Defined in: [data-structures/base/linear-base.ts:9](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L9)

Singly-linked list node.

## Remarks

Time O(1), Space O(1)

## Extended by

- [`SinglyLinkedListNode`](SinglyLinkedListNode.md)
- [`DoublyLinkedListNode`](DoublyLinkedListNode.md)

## Type Parameters

### E

`E` = `any`

Element type.

## Constructors

### Constructor

```ts
new LinkedListNode<E>(value): LinkedListNode<E>;
```

Defined in: [data-structures/base/linear-base.ts:15](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L15)

Initialize a node.

#### Parameters

##### value

`E`

Element value.

#### Returns

`LinkedListNode`\<`E`\>

#### Remarks

Time O(1), Space O(1)

## Accessors

### next

#### Get Signature

```ts
get next(): LinkedListNode<E> | undefined;
```

Defined in: [data-structures/base/linear-base.ts:47](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L47)

Next node getter.

##### Remarks

Time O(1), Space O(1)

##### Returns

`LinkedListNode`\<`E`\> \| `undefined`

Next node or `undefined`.

#### Set Signature

```ts
set next(value): void;
```

Defined in: [data-structures/base/linear-base.ts:56](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L56)

Next node setter.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`LinkedListNode`\<`E`\> \| `undefined`

Next node or `undefined`.

##### Returns

`void`

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
