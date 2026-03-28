[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / AVLTreeNode

# Class: AVLTreeNode\<K, V\>

Defined in: [data-structures/binary-tree/avl-tree.ts:29](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L29)

Represents a Node in an AVL (Adelson-Velsky and Landis) Tree.
It extends a BSTNode and ensures the 'height' property is maintained.

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
new AVLTreeNode<K, V>(key, value?): AVLTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:41](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L41)

Creates an instance of AVLTreeNode.

#### Parameters

##### key

`K`

The key of the node.

##### value?

`V`

The value associated with the key.

#### Returns

`AVLTreeNode`\<`K`, `V`\>

#### Remarks

Time O(1), Space O(1)

## Accessors

### color

#### Get Signature

```ts
get color(): RBTNColor;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:127](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L127)

Gets the color of the node (used in Red-Black trees).

##### Remarks

Time O(1), Space O(1)

##### Returns

`RBTNColor`

The node's color.

***

### count

#### Get Signature

```ts
get count(): number;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:145](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L145)

Gets the count of nodes in the subtree rooted at this node (used in order-statistic trees).

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

The subtree node count.

***

### familyPosition

#### Get Signature

```ts
get familyPosition(): FamilyPosition;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:160](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L160)

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

Defined in: [data-structures/binary-tree/avl-tree.ts:104](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L104)

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

Defined in: [data-structures/binary-tree/avl-tree.ts:114](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L114)

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
get left(): AVLTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:54](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L54)

Gets the left child of the node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`AVLTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The left child.

#### Set Signature

```ts
set left(v): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:64](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L64)

Sets the left child of the node and updates its parent reference.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`AVLTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The node to set as the left child.

##### Returns

`void`

***

### right

#### Get Signature

```ts
get right(): AVLTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:79](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L79)

Gets the right child of the node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`AVLTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The right child.

#### Set Signature

```ts
set right(v): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:89](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/avl-tree.ts#L89)

Sets the right child of the node and updates its parent reference.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`AVLTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

The node to set as the right child.

##### Returns

`void`
