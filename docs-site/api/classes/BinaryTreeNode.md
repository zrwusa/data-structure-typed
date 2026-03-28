[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / BinaryTreeNode

# Class: BinaryTreeNode\<K, V\>

Defined in: [data-structures/binary-tree/binary-tree.ts:37](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L37)

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
new BinaryTreeNode<K, V>(key, value?): BinaryTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:49](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L49)

Creates an instance of BinaryTreeNode.

#### Parameters

##### key

`K`

The key of the node.

##### value?

`V`

The value associated with the key.

#### Returns

`BinaryTreeNode`\<`K`, `V`\>

#### Remarks

Time O(1), Space O(1)

## Accessors

### color

#### Get Signature

```ts
get color(): RBTNColor;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:134](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L134)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:144](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L144)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:156](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L156)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:166](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L166)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:176](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L176)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:112](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L112)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:122](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L122)

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
get left(): BinaryTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:62](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L62)

Gets the left child of the node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`BinaryTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The left child.

#### Set Signature

```ts
set left(v): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:72](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L72)

Sets the left child of the node and updates its parent reference.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`BinaryTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The node to set as the left child.

##### Returns

`void`

***

### right

#### Get Signature

```ts
get right(): BinaryTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:87](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L87)

Gets the right child of the node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`BinaryTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The right child.

#### Set Signature

```ts
set right(v): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:97](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L97)

Sets the right child of the node and updates its parent reference.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`BinaryTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The node to set as the right child.

##### Returns

`void`
