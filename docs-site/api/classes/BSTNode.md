[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / BSTNode

# Class: BSTNode\<K, V\>

Defined in: [data-structures/binary-tree/bst.ts:37](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L37)

Represents a Node in a Binary Search Tree.

## Type Parameters

### K

`K` = `any`

The type of the key.

### V

`V` = `any`

The type of the value.

## Constructors

### Constructor

```ts
new BSTNode<K, V>(key, value?): BSTNode<K, V>;
```

Defined in: [data-structures/binary-tree/bst.ts:49](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L49)

Creates an instance of BSTNode.

#### Parameters

##### key

`K`

The key of the node.

##### value?

`V`

The value associated with the key.

#### Returns

`BSTNode`\<`K`, `V`\>

#### Remarks

Time O(1), Space O(1)

## Accessors

### color

#### Get Signature

```ts
get color(): RBTNColor;
```

Defined in: [data-structures/binary-tree/bst.ts:133](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L133)

Gets the color of the node (used in Red-Black trees).

##### Remarks

Time O(1), Space O(1)

##### Returns

`RBTNColor`

The node's color.

#### Set Signature

```ts
set color(value): void;
```

Defined in: [data-structures/binary-tree/bst.ts:144](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L144)

Sets the color of the node.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`RBTNColor`

The new color.

##### Returns

`void`

***

### count

#### Get Signature

```ts
get count(): number;
```

Defined in: [data-structures/binary-tree/bst.ts:157](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L157)

Gets the count of nodes in the subtree rooted at this node (used in order-statistic trees).

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

The subtree node count.

#### Set Signature

```ts
set count(value): void;
```

Defined in: [data-structures/binary-tree/bst.ts:168](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L168)

Sets the count of nodes in the subtree.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`number`

The new count.

##### Returns

`void`

***

### familyPosition

#### Get Signature

```ts
get familyPosition(): FamilyPosition;
```

Defined in: [data-structures/binary-tree/bst.ts:178](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L178)

Gets the position of the node relative to its parent.

##### Remarks

Time O(1), Space O(1)

##### Returns

`FamilyPosition`

The family position (e.g., 'ROOT', 'LEFT', 'RIGHT').

***

### height

#### Get Signature

```ts
get height(): number;
```

Defined in: [data-structures/binary-tree/bst.ts:109](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L109)

Gets the height of the node (used in self-balancing trees).

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

The height.

#### Set Signature

```ts
set height(value): void;
```

Defined in: [data-structures/binary-tree/bst.ts:120](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L120)

Sets the height of the node.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`number`

The new height.

##### Returns

`void`

***

### left

#### Get Signature

```ts
get left(): BSTNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:62](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L62)

Gets the left child of the node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`BSTNode`\<`K`, `V`\> \| `null` \| `undefined`

The left child.

#### Set Signature

```ts
set left(v): void;
```

Defined in: [data-structures/binary-tree/bst.ts:72](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L72)

Sets the left child of the node and updates its parent reference.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`BSTNode`\<`K`, `V`\> \| `null` \| `undefined`

The node to set as the left child.

##### Returns

`void`

***

### right

#### Get Signature

```ts
get right(): BSTNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:85](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L85)

Gets the right child of the node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`BSTNode`\<`K`, `V`\> \| `null` \| `undefined`

The right child.

#### Set Signature

```ts
set right(v): void;
```

Defined in: [data-structures/binary-tree/bst.ts:95](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L95)

Sets the right child of the node and updates its parent reference.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`BSTNode`\<`K`, `V`\> \| `null` \| `undefined`

The node to set as the right child.

##### Returns

`void`
