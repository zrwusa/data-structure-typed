[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / RedBlackTreeNode

# Class: RedBlackTreeNode\<K, V\>

Defined in: [data-structures/binary-tree/red-black-tree.ts:22](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L22)

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

## Constructors

### Constructor

```ts
new RedBlackTreeNode<K, V>(
   key, 
   value?, 
color?): RedBlackTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:35](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L35)

Create a Red-Black Tree node.

#### Parameters

##### key

`K`

Node key.

##### value?

`V`

Node value (unused in map mode trees).

##### color?

`RBTNColor` = `'BLACK'`

Node color.

#### Returns

`RedBlackTreeNode`\<`K`, `V`\>

#### Remarks

Time O(1), Space O(1)

## Accessors

### color

#### Get Signature

```ts
get color(): RBTNColor;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:119](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L119)

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

Defined in: [data-structures/binary-tree/red-black-tree.ts:129](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L129)

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

Defined in: [data-structures/binary-tree/red-black-tree.ts:142](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L142)

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

Defined in: [data-structures/binary-tree/red-black-tree.ts:152](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L152)

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

Defined in: [data-structures/binary-tree/red-black-tree.ts:102](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L102)

Gets the height of the node (used in self-balancing trees).

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

The height.

***

### left

#### Get Signature

```ts
get left(): RedBlackTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:49](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L49)

Get the left child pointer.

##### Remarks

Time O(1), Space O(1)

##### Returns

`RedBlackTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

Left child node, or null/undefined.

#### Set Signature

```ts
set left(v): void;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:60](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L60)

Set the left child and update its parent pointer.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`RedBlackTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

New left node, or null/undefined.

##### Returns

`void`

void

***

### right

#### Get Signature

```ts
get right(): RedBlackTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:75](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L75)

Get the right child pointer.

##### Remarks

Time O(1), Space O(1)

##### Returns

`RedBlackTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

Right child node, or null/undefined.

#### Set Signature

```ts
set right(v): void;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:86](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/red-black-tree.ts#L86)

Set the right child and update its parent pointer.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### v

`RedBlackTreeNode`\<`K`, `V`\> \| `null` \| `undefined`

New right node, or null/undefined.

##### Returns

`void`

void
