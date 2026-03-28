[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / AVLTree

# Class: AVLTree\<K, V, R\>

Defined in: [data-structures/binary-tree/avl-tree.ts:312](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L312)

Represents a self-balancing AVL (Adelson-Velsky and Landis) Tree.
This tree extends BST and performs rotations on set/delete to maintain balance.

## Examples

```ts
// AVLTree has and get operations
 const tree = new AVLTree<number>([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

    // Check if element exists
    console.log(tree.has(6)); // true;
    console.log(tree.has(99)); // false;

    // Get node by key
    const node = tree.getNode(6);
    console.log(node?.key); // 6;

    // Verify tree is balanced
    console.log(tree.isAVLBalanced()); // true;
```

```ts
// AVLTree for university ranking system with strict balance
 interface University {
      name: string;
      rank: number;
      students: number;
    }

    // AVLTree provides highest search efficiency with strict balance
    // (every node's left/right subtrees differ by at most 1 in height)
    const universityTree = new AVLTree<number, University>([
      [1, { name: 'MIT', rank: 1, students: 1200 }],
      [5, { name: 'Stanford', rank: 5, students: 1800 }],
      [3, { name: 'Harvard', rank: 3, students: 2300 }],
      [2, { name: 'Caltech', rank: 2, students: 400 }],
      [4, { name: 'CMU', rank: 4, students: 1500 }]
    ]);

    // Quick lookup by rank
    const mit = universityTree.get(1);
    console.log(mit?.name); // 'MIT';

    const cmulevel = universityTree.getHeight(4);
    console.log(typeof cmulevel); // 'number';

    // Tree maintains strict balance during insertions and deletions
    console.log(universityTree.isAVLBalanced()); // true;

    // Add more universities
    universityTree.set(6, { name: 'Oxford', rank: 6, students: 2000 });
    console.log(universityTree.isAVLBalanced()); // true;

    // Delete and verify balance is maintained
    universityTree.delete(2);
    console.log(universityTree.has(2)); // false;
    console.log(universityTree.isAVLBalanced()); // true;

    // Get all remaining universities in rank order
    const remainingRanks = [...universityTree.keys()];
    console.log(remainingRanks); // [1, 3, 4, 5, 6];
    console.log(universityTree.size); // 5;
```

```ts
// Find elements in a range
 // In interval queries, AVL trees, with their strictly balanced structure and lower height, offer better query efficiency, making them ideal for frequent and high-performance interval queries. In contrast, Red-Black trees, with lower update costs, are more suitable for scenarios involving frequent insertions and deletions where the requirements for interval queries are less demanding.
    type Datum = { timestamp: Date; temperature: number };
    // Fixed dataset of CPU temperature readings
    const cpuData: Datum[] = [
      { timestamp: new Date('2024-12-02T00:00:00'), temperature: 55.1 },
      { timestamp: new Date('2024-12-02T00:01:00'), temperature: 56.3 },
      { timestamp: new Date('2024-12-02T00:02:00'), temperature: 54.8 },
      { timestamp: new Date('2024-12-02T00:03:00'), temperature: 57.2 },
      { timestamp: new Date('2024-12-02T00:04:00'), temperature: 58.0 },
      { timestamp: new Date('2024-12-02T00:05:00'), temperature: 59.4 },
      { timestamp: new Date('2024-12-02T00:06:00'), temperature: 60.1 },
      { timestamp: new Date('2024-12-02T00:07:00'), temperature: 61.3 },
      { timestamp: new Date('2024-12-02T00:08:00'), temperature: 62.0 },
      { timestamp: new Date('2024-12-02T00:09:00'), temperature: 63.5 },
      { timestamp: new Date('2024-12-02T00:10:00'), temperature: 64.0 },
      { timestamp: new Date('2024-12-02T00:11:00'), temperature: 62.8 },
      { timestamp: new Date('2024-12-02T00:12:00'), temperature: 61.5 },
      { timestamp: new Date('2024-12-02T00:13:00'), temperature: 60.2 },
      { timestamp: new Date('2024-12-02T00:14:00'), temperature: 59.8 },
      { timestamp: new Date('2024-12-02T00:15:00'), temperature: 58.6 },
      { timestamp: new Date('2024-12-02T00:16:00'), temperature: 57.4 },
      { timestamp: new Date('2024-12-02T00:17:00'), temperature: 56.2 },
      { timestamp: new Date('2024-12-02T00:18:00'), temperature: 55.7 },
      { timestamp: new Date('2024-12-02T00:19:00'), temperature: 54.5 },
      { timestamp: new Date('2024-12-02T00:20:00'), temperature: 53.2 },
      { timestamp: new Date('2024-12-02T00:21:00'), temperature: 52.8 },
      { timestamp: new Date('2024-12-02T00:22:00'), temperature: 51.9 },
      { timestamp: new Date('2024-12-02T00:23:00'), temperature: 50.5 },
      { timestamp: new Date('2024-12-02T00:24:00'), temperature: 49.8 },
      { timestamp: new Date('2024-12-02T00:25:00'), temperature: 48.7 },
      { timestamp: new Date('2024-12-02T00:26:00'), temperature: 47.5 },
      { timestamp: new Date('2024-12-02T00:27:00'), temperature: 46.3 },
      { timestamp: new Date('2024-12-02T00:28:00'), temperature: 45.9 },
      { timestamp: new Date('2024-12-02T00:29:00'), temperature: 45.0 }
    ];

    // Create an AVL tree to store CPU temperature data
    const cpuTemperatureTree = new AVLTree<Date, number, Datum>(cpuData, {
      toEntryFn: ({ timestamp, temperature }) => [timestamp, temperature]
    });

    // Query a specific time range (e.g., from 00:05 to 00:15)
    const rangeStart = new Date('2024-12-02T00:05:00');
    const rangeEnd = new Date('2024-12-02T00:15:00');
    const rangeResults = cpuTemperatureTree.rangeSearch([rangeStart, rangeEnd], node => ({
      minute: node ? node.key.getMinutes() : 0,
      temperature: cpuTemperatureTree.get(node ? node.key : undefined)
    }));

    console.log(rangeResults); // [
 //      { minute: 5, temperature: 59.4 },
 //      { minute: 6, temperature: 60.1 },
 //      { minute: 7, temperature: 61.3 },
 //      { minute: 8, temperature: 62 },
 //      { minute: 9, temperature: 63.5 },
 //      { minute: 10, temperature: 64 },
 //      { minute: 11, temperature: 62.8 },
 //      { minute: 12, temperature: 61.5 },
 //      { minute: 13, temperature: 60.2 },
 //      { minute: 14, temperature: 59.8 },
 //      { minute: 15, temperature: 58.6 }
 //    ];
```

## Extends

- [`BST`](BST.md)\<`K`, `V`, `R`\>

## Type Parameters

### K

`K` = `any`

The type of the key.

### V

`V` = `any`

The type of the value.

### R

`R` = `any`

The type of the raw data object (if using `toEntryFn`).

1. Height-Balanced: Each node's left and right subtrees differ in height by no more than one.
2. Automatic Rebalancing: AVL trees rebalance themselves automatically during insertions and deletions.
3. Rotations for Balancing: Utilizes rotations (single or double) to maintain balance after updates.
4. Order Preservation: Maintains the binary search tree property where left child values are less than the parent, and right child values are greater.
5. Efficient Lookups: Offers O(log n) search time, where 'n' is the number of nodes, due to its balanced nature.
6. Complex Insertions and Deletions: Due to rebalancing, these operations are more complex than in a regular BST.
7. Path Length: The path length from the root to any leaf is longer compared to an unbalanced BST, but shorter than a linear chain of nodes.

## Implements

- `IBinaryTree`\<`K`, `V`, `R`\>

## Constructors

### Constructor

```ts
new AVLTree<K, V, R>(keysNodesEntriesOrRaws?, options?): AVLTree<K, V, R>;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:320](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L320)

Creates an instance of AVLTree.

#### Parameters

##### keysNodesEntriesOrRaws?

`Iterable`\<
  \| `K`
  \| `R`
  \| [`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`\> = `[]`

An iterable of items to set.

##### options?

`AVLTreeOptions`\<`K`, `V`, `R`\>

Configuration options for the AVL tree.

#### Returns

`AVLTree`\<`K`, `V`, `R`\>

#### Remarks

Time O(N log N) (from `setMany` with balanced set). Space O(N).

#### Overrides

[`BST`](BST.md).[`constructor`](BST.md#constructor)

## Properties

### \_comparator

```ts
protected readonly _comparator: Comparator<K>;
```

Defined in: [data-structures/binary-tree/bst.ts:372](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L372)

The comparator function used to determine the order of keys in the tree.

#### Remarks

Time O(1) Space O(1)

#### Inherited from

[`BST`](BST.md).[`_comparator`](BST.md#comparator)

***

### \_DEFAULT\_NODE\_CALLBACK

```ts
protected readonly _DEFAULT_NODE_CALLBACK: NodeCallback<BinaryTreeNode<K, V> | null | undefined, K | undefined>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2816](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2816)

(Protected) Default callback function, returns the node's key.

#### Remarks

Time O(1)

#### Param

The node.

#### Returns

The node's key or undefined.

#### Inherited from

[`BST`](BST.md).[`_DEFAULT_NODE_CALLBACK`](BST.md#default-node-callback)

## Accessors

### comparator

#### Get Signature

```ts
get comparator(): Comparator<K>;
```

Defined in: [data-structures/binary-tree/bst.ts:380](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L380)

Gets the comparator function used by the tree.

##### Remarks

Time O(1)

##### Returns

`Comparator`\<`K`\>

The comparator function.

#### Inherited from

[`BST`](BST.md).[`comparator`](BST.md#comparator)

***

### isDuplicate

#### Get Signature

```ts
get isDuplicate(): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:322](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L322)

Gets whether the tree allows duplicate keys.

##### Remarks

Time O(1)

##### Returns

`boolean`

True if duplicates are allowed, false otherwise.

#### Implementation of

```ts
IBinaryTree.isDuplicate
```

#### Inherited from

[`BST`](BST.md).[`isDuplicate`](BST.md#isduplicate)

***

### isMapMode

#### Get Signature

```ts
get isMapMode(): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:310](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L310)

Gets whether the tree is in Map mode.

##### Remarks

In Map mode (default), values are stored in an external Map, and nodes only hold keys. If false, values are stored directly on the nodes. Time O(1)

##### Returns

`boolean`

True if in Map mode, false otherwise.

#### Implementation of

```ts
IBinaryTree.isMapMode
```

#### Inherited from

[`BST`](BST.md).[`isMapMode`](BST.md#ismapmode)

***

### NIL

#### Get Signature

```ts
get NIL(): BinaryTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:373](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L373)

Gets the sentinel NIL node (used in self-balancing trees like Red-Black Tree).

##### Remarks

Time O(1)

##### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>

The NIL node.

#### Implementation of

```ts
IBinaryTree.NIL
```

#### Inherited from

[`BST`](BST.md).[`NIL`](BST.md#nil)

***

### root

#### Get Signature

```ts
get root(): OptNode<BSTNode<K, V>>;
```

Defined in: [data-structures/binary-tree/bst.ts:363](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L363)

Gets the root node of the tree.

##### Remarks

Time O(1)

##### Returns

`OptNode`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

The root node.

#### Implementation of

```ts
IBinaryTree.root
```

#### Inherited from

[`BST`](BST.md).[`root`](BST.md#root)

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:361](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L361)

Gets the number of nodes in the tree.

##### Remarks

Time O(1)

##### Returns

`number`

The size of the tree.

#### Implementation of

```ts
IBinaryTree.size
```

#### Inherited from

[`BST`](BST.md).[`size`](BST.md#size)

***

### store

#### Get Signature

```ts
get store(): Map<K, BinaryTreeNode<K, V>>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:337](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L337)

Gets the external value store (used in Map mode).

##### Remarks

Time O(1)

##### Returns

`Map`\<`K`, [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

The map storing key-value pairs.

#### Implementation of

```ts
IBinaryTree.store
```

#### Inherited from

[`BST`](BST.md).[`store`](BST.md#store)

***

### toEntryFn

#### Get Signature

```ts
get toEntryFn(): ToEntryFn<K, V, R> | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:385](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L385)

Gets the function used to convert raw data objects (R) into [key, value] entries.

##### Remarks

Time O(1)

##### Returns

`ToEntryFn`\<`K`, `V`, `R`\> \| `undefined`

The conversion function.

#### Implementation of

```ts
IBinaryTree.toEntryFn
```

#### Inherited from

[`BST`](BST.md).[`toEntryFn`](BST.md#toentryfn)

## Methods

### \_balanceFactor()

```ts
protected _balanceFactor(node): number;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:826](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L826)

(Protected) Calculates the balance factor (height(right) - height(left)).

#### Parameters

##### node

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The node to check.

#### Returns

`number`

The balance factor (positive if right-heavy, negative if left-heavy).

#### Remarks

Time O(1) (assumes heights are stored).

***

### \_balanceLL()

```ts
protected _balanceLL(A): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:850](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L850)

(Protected) Performs a Left-Left (LL) rotation (a single right rotation).

#### Parameters

##### A

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The unbalanced node (root of the unbalanced subtree).

#### Returns

`void`

#### Remarks

Time O(1), Space O(1)

***

### \_balanceLR()

```ts
protected _balanceLR(A): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:885](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L885)

(Protected) Performs a Left-Right (LR) double rotation.

#### Parameters

##### A

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The unbalanced node (root of the unbalanced subtree).

#### Returns

`void`

#### Remarks

Time O(1), Space O(1)

***

### \_balancePath()

```ts
protected _balancePath(node): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:1027](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L1027)

(Protected) Traverses up the tree from the specified node, updating heights and performing rotations as needed.

#### Parameters

##### node

  \| `K`
  \| [`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The node to start balancing from (e.g., the newly inserted node or parent of the deleted node).

#### Returns

`void`

#### Remarks

Time O(log N) (O(H)), as it traverses the path to root. Space O(H) for the path array.

***

### \_balanceRL()

```ts
protected _balanceRL(A): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:976](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L976)

(Protected) Performs a Right-Left (RL) double rotation.

#### Parameters

##### A

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The unbalanced node (root of the unbalanced subtree).

#### Returns

`void`

#### Remarks

Time O(1), Space O(1)

***

### \_balanceRR()

```ts
protected _balanceRR(A): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:937](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L937)

(Protected) Performs a Right-Right (RR) rotation (a single left rotation).

#### Parameters

##### A

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The unbalanced node (root of the unbalanced subtree).

#### Returns

`void`

#### Remarks

Time O(1), Space O(1)

***

### \_bound()

```ts
protected _bound(
   keyNodeEntryOrPredicate, 
   isLower, 
   iterationType): BSTNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:2403](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2403)

(Protected) Core bound search implementation supporting all parameter types.
Unified logic for both lowerBound and upperBound.
Resolves various input types (Key, Node, Entry, Predicate) using parent class utilities.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

The key, node, entry, or predicate function to search for.

##### isLower

`boolean`

True for lowerBound (>=), false for upperBound (>).

##### iterationType

`IterationType`

The iteration type (RECURSIVE or ITERATIVE).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\> \| `undefined`

The first matching node, or undefined if no such node exists.

#### Inherited from

[`BST`](BST.md).[`_bound`](BST.md#bound)

***

### \_boundByKey()

```ts
protected _boundByKey(
   key, 
   isLower, 
   iterationType): BSTNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:2460](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2460)

(Protected) Binary search for bound by key with pruning optimization.
Performs standard BST binary search, choosing left or right subtree based on comparator result.
For lowerBound: finds first node where key >= target.
For upperBound: finds first node where key > target.

#### Parameters

##### key

`K`

The target key to search for.

##### isLower

`boolean`

True for lowerBound (>=), false for upperBound (>).

##### iterationType

`IterationType`

The iteration type (RECURSIVE or ITERATIVE).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\> \| `undefined`

The first node matching the bound condition, or undefined if none exists.

#### Inherited from

[`BST`](BST.md).[`_boundByKey`](BST.md#boundbykey)

***

### \_boundByPredicate()

```ts
protected _boundByPredicate(predicate, iterationType): BSTNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:2515](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2515)

(Protected) In-order traversal search by predicate.
Falls back to linear in-order traversal when predicate-based search is required.
Returns the first node that satisfies the predicate function.
Note: Predicate-based search cannot leverage BST's binary search optimization.
Time Complexity: O(n) since it may visit every node.

#### Parameters

##### predicate

`NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

The predicate function to test nodes.

##### iterationType

`IterationType`

The iteration type (RECURSIVE or ITERATIVE).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\> \| `undefined`

The first node satisfying predicate, or undefined if none found.

#### Inherited from

[`BST`](BST.md).[`_boundByPredicate`](BST.md#boundbypredicate)

***

### \_clearNodes()

```ts
protected _clearNodes(): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3250](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3250)

(Protected) Clears all nodes from the tree.

#### Returns

`void`

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`_clearNodes`](BST.md#clearnodes)

***

### \_clearValues()

```ts
protected _clearValues(): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3259](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3259)

(Protected) Clears all values from the external store.

#### Returns

`void`

#### Remarks

Time O(N)

#### Inherited from

[`BST`](BST.md).[`_clearValues`](BST.md#clearvalues)

***

### \_clone()

```ts
protected _clone(cloned): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2909](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2909)

(Protected) Helper for cloning. Performs a BFS and sets all nodes to the new tree.

#### Parameters

##### cloned

[`BinaryTree`](BinaryTree.md)\<`K`, `V`, `R`\>

The new, empty tree instance to populate.

#### Returns

`void`

#### Remarks

Time O(N * M) (O(N) BFS + O(M) `set` for each node).

#### Inherited from

[`BST`](BST.md).[`_clone`](BST.md#clone)

***

### \_compare()

```ts
protected _compare(a, b): number;
```

Defined in: [data-structures/binary-tree/bst.ts:2655](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2655)

(Protected) Compares two keys using the tree's comparator and reverse setting.

#### Parameters

##### a

`K`

The first key.

##### b

`K`

The second key.

#### Returns

`number`

A number (1, -1, or 0) representing the comparison.

#### Remarks

Time O(1) Space O(1)

#### Inherited from

[`BST`](BST.md).[`_compare`](BST.md#compare)

***

### \_createDefaultComparator()

```ts
protected _createDefaultComparator(): Comparator<K>;
```

Defined in: [data-structures/binary-tree/bst.ts:2128](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2128)

(Protected) Creates the default comparator function for keys that don't have a custom comparator.

#### Returns

`Comparator`\<`K`\>

The default comparator function.

#### Remarks

Time O(1) Space O(1)

#### Inherited from

[`BST`](BST.md).[`_createDefaultComparator`](BST.md#createdefaultcomparator)

***

### \_createInstance()

```ts
protected _createInstance<TK, TV, TR>(options?): this;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:752](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L752)

(Protected) Creates a new, empty instance of the same AVLTree constructor.

#### Type Parameters

##### TK

`TK` = `K`

##### TV

`TV` = `V`

##### TR

`TR` = `R`

#### Parameters

##### options?

`Partial`\<`AVLTreeOptions`\<`TK`, `TV`, `TR`\>\>

Options for the new tree.

#### Returns

`this`

A new, empty tree.

#### Remarks

Time O(1)

#### Overrides

[`BST`](BST.md).[`_createInstance`](BST.md#createinstance)

***

### \_createLike()

```ts
protected _createLike<TK, TV, TR>(iter?, options?): AVLTree<TK, TV, TR>;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:769](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L769)

(Protected) Creates a new instance of the same AVLTree constructor, potentially with different generic types.

#### Type Parameters

##### TK

`TK` = `K`

##### TV

`TV` = `V`

##### TR

`TR` = `R`

#### Parameters

##### iter?

`Iterable`\<
  \| `TK`
  \| `TR`
  \| [`AVLTreeNode`](AVLTreeNode.md)\<`TK`, `TV`\>
  \| \[`TK` \| `null` \| `undefined`, `TV` \| `undefined`\]
  \| `null`
  \| `undefined`\> = `[]`

An iterable to populate the new tree.

##### options?

`Partial`\<`AVLTreeOptions`\<`TK`, `TV`, `TR`\>\>

Options for the new tree.

#### Returns

`AVLTree`\<`TK`, `TV`, `TR`\>

A new AVLTree.

#### Remarks

Time O(N log N) (from constructor) due to processing the iterable.

#### Overrides

[`BST`](BST.md).[`_createLike`](BST.md#createlike)

***

### \_deleteByKey()

```ts
protected _deleteByKey(key): boolean;
```

Defined in: [data-structures/binary-tree/bst.ts:2666](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2666)

(Private) Deletes a node by its key.

#### Parameters

##### key

`K`

The key of the node to delete.

#### Returns

`boolean`

True if the node was found and deleted, false otherwise.

#### Remarks

Standard BST deletion algorithm. Time O(log N), O(N) worst-case. Space O(1).

#### Inherited from

[`BST`](BST.md).[`_deleteByKey`](BST.md#deletebykey)

***

### \_dfs()

```ts
protected _dfs<C>(
   callback, 
   pattern?, 
   onlyOne?, 
   startNode?, 
   iterationType?, 
   includeNull?, 
   shouldVisitLeft?, 
   shouldVisitRight?, 
   shouldVisitRoot?, 
   shouldProcessRoot?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2627](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2627)

#### Type Parameters

##### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

Callback type.

#### Parameters

##### callback

`C`

Function to call on nodes.

##### pattern?

`DFSOrderPattern`

Traversal order.

##### onlyOne?

`boolean`

Stop after first match.

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

Starting node.

##### iterationType?

`IterationType`

Traversal method.

##### includeNull?

`boolean`

Include nulls.

##### shouldVisitLeft?

(`node`) => `boolean`

Predicate to traverse left.

##### shouldVisitRight?

(`node`) => `boolean`

Predicate to traverse right.

##### shouldVisitRoot?

(`node`) => `boolean`

Predicate to visit root.

##### shouldProcessRoot?

(`node`) => `boolean`

Predicate to process root.

#### Returns

`ReturnType`\<`C`\>[]

Array of callback results.

#### Inherited from

[`BST`](BST.md).[`_dfs`](BST.md#dfs)

***

### \_displayAux()

```ts
protected _displayAux(node, options): NodeDisplayLayout;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2933](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2933)

(Protected) Recursive helper for `toVisual`.

#### Parameters

##### node

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

The current node.

##### options

`BinaryTreePrintOptions`

Print options.

#### Returns

`NodeDisplayLayout`

Layout information for this subtree.

#### Remarks

Time O(N), Space O(N*H) or O(N^2)

#### Inherited from

[`BST`](BST.md).[`_displayAux`](BST.md#displayaux)

***

### \_ensurePredicate()

```ts
protected _ensurePredicate(keyNodeEntryOrPredicate): NodePredicate<BinaryTreeNode<K, V>>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3156](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3156)

(Protected) Converts a key, node, entry, or predicate into a standardized predicate function.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

The item to convert.

#### Returns

`NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

A predicate function.

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`_ensurePredicate`](BST.md#ensurepredicate)

***

### \_extractKey()

```ts
protected _extractKey(keyNodeOrEntry): K | null | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3216](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3216)

(Protected) Extracts the key from a key, node, or entry.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The item.

#### Returns

`K` \| `null` \| `undefined`

The extracted key.

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`_extractKey`](BST.md#extractkey)

***

### \_floorByKey()

```ts
protected _floorByKey(key, iterationType): BSTNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:2168](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2168)

(Protected) Binary search for floor by key with pruning optimization.
Performs standard BST binary search, choosing left or right subtree based on comparator result.
Finds first node where key <= target.

#### Parameters

##### key

`K`

The target key to search for.

##### iterationType

`IterationType`

The iteration type (RECURSIVE or ITERATIVE).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\> \| `undefined`

The first node with key <= target, or undefined if none exists.

#### Remarks

Time O(h) where h is tree height.

#### Inherited from

[`BST`](BST.md).[`_floorByKey`](BST.md#floorbykey)

***

### \_floorByPredicate()

```ts
protected _floorByPredicate(predicate, iterationType): BSTNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:2221](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2221)

(Protected) In-order traversal search for floor by predicate.
Falls back to linear in-order traversal when predicate-based search is required.
Returns the last node that satisfies the predicate function.

#### Parameters

##### predicate

`NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

The predicate function to test nodes.

##### iterationType

`IterationType`

The iteration type (RECURSIVE or ITERATIVE).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\> \| `undefined`

The last node satisfying predicate (highest key), or undefined if none found.

#### Remarks

Time Complexity: O(n) since it may visit every node.
Space Complexity: O(h) for recursion, O(h) for iterative stack.

#### Inherited from

[`BST`](BST.md).[`_floorByPredicate`](BST.md#floorbypredicate)

***

### \_getIterator()

```ts
protected _getIterator(node?): IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2772](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2772)

(Protected) Gets the iterator for the tree (default in-order).

#### Parameters

##### node?

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`

The node to start iteration from.

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

An iterator for [key, value] pairs.

#### Remarks

Time O(N) for full iteration. O(H) to get the first element. Space O(H) for the iterative stack. O(H) for recursive stack.

#### Inherited from

[`BST`](BST.md).[`_getIterator`](BST.md#getiterator)

***

### \_isDisplayLeaf()

```ts
protected _isDisplayLeaf(node, options): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3028](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3028)

Check if a node is a display leaf (empty, null, undefined, NIL, or real leaf).

#### Parameters

##### node

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

##### options

`BinaryTreePrintOptions`

#### Returns

`boolean`

#### Inherited from

[`BST`](BST.md).[`_isDisplayLeaf`](BST.md#isdisplayleaf)

***

### \_isPredicate()

```ts
protected _isPredicate(p): p is NodePredicate<BinaryTreeNode<K, V>>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3205](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3205)

(Protected) Checks if an item is a predicate function.

#### Parameters

##### p

`any`

The item to check.

#### Returns

`p is NodePredicate<BinaryTreeNode<K, V>>`

True if it's a function.

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`_isPredicate`](BST.md#ispredicate)

***

### \_keyValueNodeOrEntryToNodeAndValue()

```ts
protected _keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value?): [OptNode<BSTNode<K, V>>, V | undefined];
```

Defined in: [data-structures/binary-tree/bst.ts:2627](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2627)

(Protected) Converts a key, node, or entry into a standardized [node, value] tuple.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The input item.

##### value?

`V`

An optional value (used if input is just a key).

#### Returns

\[`OptNode`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>, `V` \| `undefined`\]

A tuple of [node, value].

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`_keyValueNodeOrEntryToNodeAndValue`](BST.md#keyvaluenodeorentrytonodeandvalue)

***

### \_lowerByKey()

```ts
protected _lowerByKey(key, iterationType): BSTNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:2286](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2286)

(Protected) Binary search for lower by key with pruning optimization.
Performs standard BST binary search, choosing left or right subtree based on comparator result.
Finds first node where key < target.

#### Parameters

##### key

`K`

The target key to search for.

##### iterationType

`IterationType`

The iteration type (RECURSIVE or ITERATIVE).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\> \| `undefined`

The first node with key < target, or undefined if none exists.

#### Remarks

Time O(h) where h is tree height.

#### Inherited from

[`BST`](BST.md).[`_lowerByKey`](BST.md#lowerbykey)

***

### \_lowerByPredicate()

```ts
protected _lowerByPredicate(predicate, iterationType): BSTNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:2339](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2339)

(Protected) In-order traversal search for lower by predicate.
Falls back to linear in-order traversal when predicate-based search is required.
Returns the node that satisfies the predicate and appears last in in-order traversal.

#### Parameters

##### predicate

`NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

The predicate function to test nodes.

##### iterationType

`IterationType`

The iteration type (RECURSIVE or ITERATIVE).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\> \| `undefined`

The last node satisfying predicate (highest key < target), or undefined if none found.

#### Remarks

Time Complexity: O(n) since it may visit every node.
Space Complexity: O(h) for recursion, O(h) for iterative stack.

#### Inherited from

[`BST`](BST.md).[`_lowerByPredicate`](BST.md#lowerbypredicate)

***

### \_replaceNode()

```ts
protected _replaceNode(oldNode, newNode): AVLTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:1074](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L1074)

(Protected) Replaces a node, ensuring height is copied.

#### Parameters

##### oldNode

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The node to be replaced.

##### newNode

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The node to insert.

#### Returns

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The `newNode`.

#### Remarks

Time O(1)

#### Overrides

[`BST`](BST.md).[`_replaceNode`](BST.md#replacenode)

***

### \_resolveDisplayLeaf()

```ts
protected _resolveDisplayLeaf(
   node, 
   options, 
   emptyDisplayLayout): NodeDisplayLayout;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3058](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3058)

Resolve a display leaf node to its layout.

#### Parameters

##### node

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

##### options

`BinaryTreePrintOptions`

##### emptyDisplayLayout

`NodeDisplayLayout`

#### Returns

`NodeDisplayLayout`

#### Inherited from

[`BST`](BST.md).[`_resolveDisplayLeaf`](BST.md#resolvedisplayleaf)

***

### \_setRoot()

```ts
protected _setRoot(v): void;
```

Defined in: [data-structures/binary-tree/bst.ts:2642](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2642)

(Protected) Sets the root node and clears its parent reference.

#### Parameters

##### v

`OptNode`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

The node to set as root.

#### Returns

`void`

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`_setRoot`](BST.md#setroot)

***

### \_setValue()

```ts
protected _setValue(key, value): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3237](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3237)

(Protected) Sets a value in the external store (Map mode).

#### Parameters

##### key

`K` \| `null` \| `undefined`

The key.

##### value

`V` \| `undefined`

The value.

#### Returns

`boolean`

True if successful.

#### Remarks

Time O(1) (average for Map.set).

#### Inherited from

[`BST`](BST.md).[`_setValue`](BST.md#setvalue)

***

### \_snapshotOptions()

```ts
protected _snapshotOptions<TK, TV, TR>(): BSTOptions<TK, TV, TR>;
```

Defined in: [data-structures/binary-tree/bst.ts:2612](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2612)

(Protected) Snapshots the current BST's configuration options.

#### Type Parameters

##### TK

`TK` = `K`

##### TV

`TV` = `V`

##### TR

`TR` = `R`

#### Returns

`BSTOptions`\<`TK`, `TV`, `TR`\>

The options object.

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`_snapshotOptions`](BST.md#snapshotoptions)

***

### \_swapProperties()

```ts
protected _swapProperties(srcNode, destNode): AVLTreeNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:788](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L788)

(Protected) Swaps properties of two nodes, including height.

#### Parameters

##### srcNode

`BSTNOptKeyOrNode`\<`K`, [`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>\>

The source node.

##### destNode

`BSTNOptKeyOrNode`\<`K`, [`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>\>

The destination node.

#### Returns

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\> \| `undefined`

The `destNode` (now holding `srcNode`'s properties).

#### Remarks

Time O(H) (due to `ensureNode`), but O(1) if nodes are passed directly.

#### Overrides

[`BST`](BST.md).[`_swapProperties`](BST.md#swapproperties)

***

### \_updateHeight()

```ts
protected _updateHeight(node): void;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:838](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L838)

(Protected) Recalculates and updates the height of a node based on its children's heights.

#### Parameters

##### node

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The node to update.

#### Returns

`void`

#### Remarks

Time O(1) (assumes children's heights are correct).

***

### \[iterator\]()

```ts
iterator: IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L22)

Default iterator yielding `[key, value]` entries.

#### Parameters

##### args

...`any`[]

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n) to iterate, Space O(1)

#### Implementation of

```ts
IBinaryTree.[iterator]
```

#### Inherited from

[`BST`](BST.md).[`[iterator]`](BST.md#iterator)

***

### add()

```ts
add(keyNodeOrEntry): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:597](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L597)

Adds a new node to the tree.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The key, node, or entry to add.

#### Returns

`boolean`

True if the addition was successful, false otherwise.

 *

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). This implementation adds the node at the first available position in a level-order (BFS) traversal. This is NOT a Binary Search Tree insertion. Time O(N), where N is the number of nodes. It must traverse level-by-level to find an empty slot. Space O(N) in the worst case for the BFS queue (e.g., a full last level).

#### Example

```ts
const avl = new AVLTree<number>();
    avl.add(10);
    avl.add(5);
    avl.add(15);
console.log(avl.size); // 3
console.log(avl.has(10)); // true
```

#### Implementation of

```ts
IBinaryTree.add
```

#### Inherited from

[`BST`](BST.md).[`add`](BST.md#add)

***

### addMany()

```ts
addMany(keysNodesEntriesOrRaws): boolean[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:748](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L748)

Adds multiple items to the tree.

#### Parameters

##### keysNodesEntriesOrRaws

`Iterable`\<
  \| `K`
  \| `R`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`\>

An iterable of items to set.

#### Returns

`boolean`[]

An array of booleans indicating the success of each individual `set` operation.

 *

#### Remarks

Time O(N * M), where N is the number of items to set and M is the size of the tree at insertion (due to O(M) `set` operation). Space O(M) (from `set`) + O(N) (for the `inserted` array).

#### Example

```ts
const avl = new AVLTree<number>();
    avl.addMany([5, 3, 7, 1, 9]);
console.log(avl.size); // 5
```

#### Implementation of

```ts
IBinaryTree.addMany
```

#### Inherited from

[`BST`](BST.md).[`addMany`](BST.md#addmany)

***

### bfs()

Performs a Breadth-First Search (BFS) or Level-Order traversal.

#### Remarks

Time O(N), visits every node. Space O(N) in the worst case for the queue.

#### Template

The type of the callback function.

#### Param

Function to call on each node.

#### Param

The node to start from.

#### Param

The traversal method.

#### Call Signature

```ts
bfs(): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/bst.ts:571](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L571)

BinaryTree level-order traversal

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7]);
    const levelOrder = avl.bfs(node => node.key);
console.log(levelOrder.length); // 3
```

##### Implementation of

```ts
IBinaryTree.bfs
```

##### Inherited from

[`BST`](BST.md).[`bfs`](BST.md#bfs)

#### Call Signature

```ts
bfs<C>(
   callback, 
   startNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/bst.ts:572](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L572)

BinaryTree level-order traversal

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback

`C`

###### startNode?

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7]);
    const levelOrder = avl.bfs(node => node.key);
console.log(levelOrder.length); // 3
```

##### Implementation of

```ts
IBinaryTree.bfs
```

##### Inherited from

[`BST`](BST.md).[`bfs`](BST.md#bfs)

***

### ceiling()

#### Call Signature

```ts
ceiling(keyNodeEntryOrPredicate): K | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:1361](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1361)

Returns the first key with a value >= target.
Equivalent to Java TreeMap.ceiling.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

 *

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

##### Returns

`K` \| `undefined`

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30, 40]);
console.log(avl.ceiling(25)); // 30
```

##### Inherited from

[`BST`](BST.md).[`ceiling`](BST.md#ceiling)

#### Call Signature

```ts
ceiling<C>(
   keyNodeEntryOrPredicate, 
   callback, 
iterationType?): ReturnType<C>;
```

Defined in: [data-structures/binary-tree/bst.ts:1376](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1376)

Returns the first node with a key >= target and applies callback.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

###### callback

`C`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30, 40]);
console.log(avl.ceiling(25)); // 30
```

##### Inherited from

[`BST`](BST.md).[`ceiling`](BST.md#ceiling)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1377](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1377)

Clears the tree of all nodes and values.

#### Returns

`void`

#### Remarks

Time O(N) if in Map mode (due to `_store.clear()`), O(1) otherwise. Space O(1)

 *

#### Example

```ts
const avl = new AVLTree<number>([1, 2, 3]);
    avl.clear();
console.log(avl.isEmpty()); // true
```

#### Implementation of

```ts
IBinaryTree.clear
```

#### Inherited from

[`BST`](BST.md).[`clear`](BST.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2455](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2455)

Clones the tree.

#### Returns

`this`

A new, cloned instance of the tree.

 *

#### Remarks

Time O(N * M), where N is the number of nodes and M is the tree size during insertion (due to `bfs` + `set`, and `set` is O(M)). Space O(N) for the new tree and the BFS queue.

#### Example

```ts
const avl = new AVLTree<number>([5, 3, 7]);
    const copy = avl.clone();
    copy.delete(3);
console.log(avl.has(3)); // true
```

#### Implementation of

```ts
IBinaryTree.clone
```

#### Inherited from

[`BST`](BST.md).[`clone`](BST.md#clone)

***

### createNode()

```ts
createNode(key, value?): AVLTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:339](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L339)

(Protected) Creates a new AVL tree node.

#### Parameters

##### key

`K`

The key for the new node.

##### value?

`V`

The value for the new node.

#### Returns

[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>

The newly created AVLTreeNode.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IBinaryTree.createNode
```

#### Overrides

[`BST`](BST.md).[`createNode`](BST.md#createnode)

***

### createTree()

```ts
createTree(options?): this;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:408](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L408)

Creates a new, empty tree of the same type and configuration.

#### Parameters

##### options?

`Partial`\<`BinaryTreeOptions`\<`K`, `V`, `R`\>\>

Optional overrides for the new tree's options.

#### Returns

`this`

A new, empty tree instance.

#### Remarks

Time O(1) (excluding options cloning), Space O(1)

#### Implementation of

```ts
IBinaryTree.createTree
```

#### Inherited from

[`BST`](BST.md).[`createTree`](BST.md#createtree)

***

### delete()

```ts
delete(keyNodeOrEntry): BinaryTreeDeleteResult<AVLTreeNode<K, V>>[];
```

Defined in: [data-structures/binary-tree/avl-tree.ts:554](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L554)

Deletes a node from the AVL tree and re-balances the tree.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The node to delete.

#### Returns

`BinaryTreeDeleteResult`\<[`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>\>[]

An array containing deletion results.

 *

#### Remarks

Time O(log N) (O(H) for BST delete + O(H) for `_balancePath`). Space O(H) for path/recursion.

#### Example

```ts
const tree = new AVLTree([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

    // Delete an element
    tree.delete(10);
console.log(tree.has(10)); // false

    // Tree should remain balanced after deletion
console.log(tree.isAVLBalanced()); // true

    // Size decreased
console.log(tree.size); // 15

    // Remaining elements are still sorted
    const keys = [...tree.keys()];
console.log(keys); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16]
```

#### Implementation of

```ts
IBinaryTree.delete
```

#### Overrides

[`BST`](BST.md).[`delete`](BST.md#delete)

***

### deleteWhere()

```ts
deleteWhere(
   keyNodeEntryOrPredicate, 
   onlyOne?, 
   startNode?, 
   iterationType?): BinaryTreeDeleteResult<BSTNode<K, V>>[];
```

Defined in: [data-structures/binary-tree/bst.ts:2099](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2099)

Deletes nodes that match a key, node, entry, predicate, or range.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `Range`\<`K`\>
  \| `null`
  \| `undefined`

The search criteria. Can be one of:
  - A key (type K): searches for exact key match using the comparator.
  - A BSTNode: searches for the matching node in the tree.
  - An entry tuple: searches for the key-value pair.
  - A NodePredicate function: tests each node and returns true for matches.
  - A Range object: searches for nodes whose keys fall within the specified range (inclusive/exclusive based on range settings).
  - null or undefined: treated as no match, returns empty results.

##### onlyOne?

`boolean` = `false`

If true, stops the search after finding the first match and only deletes that one node.
  If false (default), searches for and deletes all matching nodes.

##### startNode?

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The node to start the search from. Can be:
  - A key, node, or entry: the method resolves it to a node and searches from that subtree.
  - null or undefined: defaults to the root, searching the entire tree.
  - Default value: this._root (the tree's root).

##### iterationType?

`IterationType` = `...`

Controls the internal traversal implementation:
  - 'RECURSIVE': uses recursive function calls for traversal.
  - 'ITERATIVE': uses explicit stack-based iteration.
  - Default: this.iterationType (the tree's default iteration mode).

#### Returns

`BinaryTreeDeleteResult`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>[]

A Map&lt;K, boolean&gt; containing the deletion results:
  - Key: the matched node's key.
  - Value: true if the deletion succeeded, false if it failed (e.g., key not found during deletion phase).
  - If no nodes match the search criteria, the returned map is empty.

#### Remarks

Time Complexity: O(N) for search + O(M log N) for M deletions, where N is tree size.
Space Complexity: O(M) for storing matched nodes and result map.

#### Inherited from

[`BST`](BST.md).[`deleteWhere`](BST.md#deletewhere)

***

### dfs()

Performs a Depth-First Search (DFS) traversal.

#### Remarks

Time O(N), visits every node. Space O(log N) for the call/explicit stack. O(N) worst-case.

#### Template

The type of the callback function.

#### Param

Function to call on each node.

#### Param

The traversal order ('IN', 'PRE', 'POST').

#### Param

If true, stops after the first callback.

#### Param

The node to start from.

#### Param

The traversal method.

#### Call Signature

```ts
dfs(): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/bst.ts:491](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L491)

Depth-first search traversal

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 4]);
    const inOrder = avl.dfs(node => node.key, 'IN');
console.log(inOrder); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.dfs
```

##### Inherited from

[`BST`](BST.md).[`dfs`](BST.md#dfs)

#### Call Signature

```ts
dfs<C>(
   callback, 
   pattern?, 
   onlyOne?, 
   startNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/bst.ts:493](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L493)

Depth-first search traversal

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback

`C`

###### pattern?

`DFSOrderPattern`

###### onlyOne?

`boolean`

###### startNode?

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 4]);
    const inOrder = avl.dfs(node => node.key, 'IN');
console.log(inOrder); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.dfs
```

##### Inherited from

[`BST`](BST.md).[`dfs`](BST.md#dfs)

***

### ensureNode()

```ts
ensureNode(keyNodeOrEntry, iterationType?): OptNode<BSTNode<K, V>>;
```

Defined in: [data-structures/binary-tree/bst.ts:404](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L404)

Ensures the input is a node. If it's a key or entry, it searches for the node.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to resolve to a node.

##### iterationType?

`IterationType` = `...`

The traversal method to use if searching.

#### Returns

`OptNode`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

The resolved node, or undefined if not found.

#### Remarks

Time O(log N) (height of the tree), O(N) worst-case.

#### Inherited from

[`BST`](BST.md).[`ensureNode`](BST.md#ensurenode)

***

### entries()

```ts
entries(): IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:31](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L31)

Iterate over `[key, value]` pairs (may yield `undefined` values).

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

Iterator of `[K, V | undefined]`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
console.log([...avl.entries()]); // [[1, 'a'], [2, 'b'], [3, 'c']]
```

#### Implementation of

```ts
IBinaryTree.entries
```

#### Inherited from

[`BST`](BST.md).[`entries`](BST.md#entries)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:66](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L66)

Test whether all entries satisfy the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if all pass; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number>([2, 4, 6]);
console.log(avl.every((v, k) => k > 0)); // true
```

#### Implementation of

```ts
IBinaryTree.every
```

#### Inherited from

[`BST`](BST.md).[`every`](BST.md#every)

***

### filter()

```ts
filter(predicate, thisArg?): this;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2496](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2496)

Creates a new tree containing only the entries that satisfy the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

A function to test each [key, value] pair.

##### thisArg?

`unknown`

`this` context for the predicate.

#### Returns

`this`

A new, filtered tree.

 *

#### Remarks

Time O(N * M), where N is nodes in this tree, and M is size of the new tree during insertion (O(N) iteration + O(M) `set` for each item). Space O(N) for the new tree.

#### Example

```ts
const avl = new AVLTree<number>([1, 2, 3, 4, 5]);
    const evens = avl.filter((v, k) => k % 2 === 0);
console.log([...evens.keys()]); // [2, 4]
```

#### Implementation of

```ts
IBinaryTree.filter
```

#### Inherited from

[`BST`](BST.md).[`filter`](BST.md#filter)

***

### find()

```ts
find(callbackfn, thisArg?): [K, V | undefined] | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L114)

Find the first entry that matches a predicate.

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

Matching `[key, value]` or `undefined`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number, string>([[1, 'a'], [2, 'b']]);
    const found = avl.find(v => v === 'b');
console.log(found?.[0]); // 2
```

#### Implementation of

```ts
IBinaryTree.find
```

#### Inherited from

[`BST`](BST.md).[`find`](BST.md#find)

***

### floor()

#### Call Signature

```ts
floor(keyNodeEntryOrPredicate): K | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:1550](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1550)

Returns the first key with a value <= target.
Equivalent to Java TreeMap.floor.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

 *

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

##### Returns

`K` \| `undefined`

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30, 40]);
console.log(avl.floor(25)); // 20
```

##### Inherited from

[`BST`](BST.md).[`floor`](BST.md#floor)

#### Call Signature

```ts
floor<C>(
   keyNodeEntryOrPredicate, 
   callback, 
iterationType?): ReturnType<C>;
```

Defined in: [data-structures/binary-tree/bst.ts:1565](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1565)

Returns the first node with a key <= target and applies callback.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

###### callback

`C`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30, 40]);
console.log(avl.floor(25)); // 20
```

##### Inherited from

[`BST`](BST.md).[`floor`](BST.md#floor)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L99)

Visit each entry, left-to-right.

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V` \| `undefined`, `void`\>

`(key, value, index, self) => void`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`void`

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number>([3, 1, 2]);
    const keys: number[] = [];
    avl.forEach((v, k) => keys.push(k));
console.log(keys); // [1, 2, 3]
```

#### Implementation of

```ts
IBinaryTree.forEach
```

#### Inherited from

[`BST`](BST.md).[`forEach`](BST.md#foreach)

***

### get()

```ts
get(
   keyNodeEntryOrPredicate, 
   startNode?, 
   iterationType?): V | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1239](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1239)

Gets the value associated with a key.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The key, node, or entry to get the value for.

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start searching from (if not in Map mode).

##### iterationType?

`IterationType` = `...`

The traversal method (if not in Map mode).

#### Returns

`V` \| `undefined`

The associated value, or undefined.

 *

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Time O(1) if in Map mode. O(N) if not in Map mode (uses `getNode`). Space O(1) if in Map mode. O(H) or O(N) otherwise.

#### Example

```ts
const avl = new AVLTree<number, string>([[1, 'one'], [2, 'two']]);
console.log(avl.get(1)); // 'one'
```

#### Implementation of

```ts
IBinaryTree.get
```

#### Inherited from

[`BST`](BST.md).[`get`](BST.md#get)

***

### getDepth()

```ts
getDepth(dist, startNode?): number;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1545](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1545)

Gets the depth of a node (distance from `startNode`).

#### Parameters

##### dist

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The node to find the depth of.

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to measure depth from (defaults to root).

#### Returns

`number`

The depth (0 if `dist` is `startNode`).

 *

#### Remarks

Time O(H), where H is the depth of the `dist` node relative to `startNode`. O(N) worst-case. Space O(1).

#### Implementation of

```ts
IBinaryTree.getDepth
```

#### Inherited from

[`BST`](BST.md).[`getDepth`](BST.md#getdepth)

***

### getHeight()

```ts
getHeight(startNode?, iterationType?): number;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1598](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1598)

Gets the maximum height of the tree (longest path from startNode to a leaf).

#### Parameters

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start measuring from.

##### iterationType?

`IterationType` = `...`

The traversal method.

#### Returns

`number`

The height ( -1 for an empty tree, 0 for a single-node tree).

 *

#### Remarks

Time O(N), as it must visit every node. Space O(H) for recursive stack (O(N) worst-case) or O(N) for iterative stack (storing node + depth).

#### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1]);
console.log(avl.getHeight()); // >= 2
```

#### Implementation of

```ts
IBinaryTree.getHeight
```

#### Inherited from

[`BST`](BST.md).[`getHeight`](BST.md#getheight)

***

### getLeftMost()

Finds the leftmost node in a subtree (the node with the smallest key in a BST).

#### Remarks

Time O(H), where H is the height of the left spine. O(N) worst-case. Space O(H) for recursive/trampoline stack.

#### Template

The type of the callback function.

#### Param

A function to call on the leftmost node.

#### Param

The subtree root to search from.

#### Param

The traversal method.

#### Call Signature

```ts
getLeftMost(): K | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1725](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1725)

##### Returns

`K` \| `undefined`

##### Implementation of

```ts
IBinaryTree.getLeftMost
```

##### Inherited from

[`BST`](BST.md).[`getLeftMost`](BST.md#getleftmost)

#### Call Signature

```ts
getLeftMost<C>(
   callback, 
   startNode?, 
iterationType?): ReturnType<C>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1727](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1727)

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `undefined`\>

##### Parameters

###### callback

`C`

###### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>

##### Implementation of

```ts
IBinaryTree.getLeftMost
```

##### Inherited from

[`BST`](BST.md).[`getLeftMost`](BST.md#getleftmost)

***

### getMinHeight()

```ts
getMinHeight(startNode?, iterationType?): number;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1640](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1640)

Gets the minimum height of the tree (shortest path from startNode to a leaf).

#### Parameters

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start measuring from.

##### iterationType?

`IterationType` = `...`

The traversal method.

#### Returns

`number`

The minimum height (-1 for empty, 0 for single node).

#### Remarks

Time O(N), as it must visit every node. Space O(H) for recursive stack (O(N) worst-case) or O(N) for iterative (due to `depths` Map).

#### Implementation of

```ts
IBinaryTree.getMinHeight
```

#### Inherited from

[`BST`](BST.md).[`getMinHeight`](BST.md#getminheight)

***

### getNode()

```ts
getNode(
   keyNodeEntryOrPredicate, 
   startNode?, 
iterationType?): OptNode<BSTNode<K, V>>;
```

Defined in: [data-structures/binary-tree/bst.ts:736](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L736)

Gets the first node matching a predicate.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

The key, node, entry, or predicate function to search for.

##### startNode?

`BSTNOptKeyOrNode`\<`K`, [`BSTNode`](BSTNode.md)\<`K`, `V`\>\> = `...`

The node to start the search from.

##### iterationType?

`IterationType` = `...`

The traversal method.

#### Returns

`OptNode`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

The first matching node, or undefined if not found.

 *

#### Remarks

Time O(log N) if searching by key, O(N) if searching by predicate. Space O(log N) or O(N).

#### Example

```ts
const avl = new AVLTree<number, string>([[5, 'root'], [3, 'left']]);
console.log(avl.getNode(3)?.value); // 'left'
```

#### Implementation of

```ts
IBinaryTree.getNode
```

#### Inherited from

[`BST`](BST.md).[`getNode`](BST.md#getnode)

***

### getNodes()

```ts
getNodes(
   keyNodeEntryOrPredicate, 
   onlyOne?, 
   startNode?, 
   iterationType?): BinaryTreeNode<K, V>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1117](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1117)

Gets all nodes matching a predicate.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

The key, node, entry, or predicate function to search for.

##### onlyOne?

`boolean`

If true, stops after finding the first match.

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start the search from.

##### iterationType?

`IterationType`

The traversal method.

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>[]

An array of matching nodes.

 *

#### Remarks

Time O(N) (via `search`). Space O(H) or O(N) (via `search`).

#### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 9]);
    const big = avl.getNodes(n => n.key > 5);
console.log(big.length); // 2
```

#### Inherited from

[`BST`](BST.md).[`getNodes`](BST.md#getnodes)

***

### getPathToRoot()

Gets the path from a given node up to the root.

#### Remarks

Time O(H), where H is the depth of the `beginNode`. O(N) worst-case. Space O(H) for the result array.

#### Template

The type of the callback function.

#### Param

The node to start the path from.

#### Param

A function to call on each node in the path.

#### Param

If true, returns the path from root-to-node.

#### Call Signature

```ts
getPathToRoot(beginNode): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1687](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1687)

##### Parameters

###### beginNode

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

##### Returns

(`K` \| `undefined`)[]

##### Implementation of

```ts
IBinaryTree.getPathToRoot
```

##### Inherited from

[`BST`](BST.md).[`getPathToRoot`](BST.md#getpathtoroot)

#### Call Signature

```ts
getPathToRoot<C>(
   beginNode, 
   callback, 
   isReverse?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1691](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1691)

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `undefined`\>

##### Parameters

###### beginNode

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

###### callback

`C`

###### isReverse?

`boolean`

##### Returns

`ReturnType`\<`C`\>[]

##### Implementation of

```ts
IBinaryTree.getPathToRoot
```

##### Inherited from

[`BST`](BST.md).[`getPathToRoot`](BST.md#getpathtoroot)

***

### getPredecessor()

```ts
getPredecessor(node): BinaryTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1825](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1825)

Gets the Morris traversal predecessor (rightmost node in the left subtree, or node itself).

#### Parameters

##### node

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>

The node to find the predecessor for.

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>

The Morris predecessor.

#### Remarks

This is primarily a helper for Morris traversal. Time O(H), where H is the height of the left subtree. O(N) worst-case. Space O(1).

#### Inherited from

[`BST`](BST.md).[`getPredecessor`](BST.md#getpredecessor)

***

### getRightMost()

Finds the rightmost node in a subtree (the node with the largest key in a BST).

#### Remarks

Time O(H), where H is the height of the right spine. O(N) worst-case. Space O(H) for recursive/trampoline stack.

#### Template

The type of the callback function.

#### Param

A function to call on the rightmost node.

#### Param

The subtree root to search from.

#### Param

The traversal method.

#### Call Signature

```ts
getRightMost(): K | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1772](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1772)

##### Returns

`K` \| `undefined`

##### Implementation of

```ts
IBinaryTree.getRightMost
```

##### Inherited from

[`BST`](BST.md).[`getRightMost`](BST.md#getrightmost)

#### Call Signature

```ts
getRightMost<C>(
   callback, 
   startNode?, 
iterationType?): ReturnType<C>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1774](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1774)

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `undefined`\>

##### Parameters

###### callback

`C`

###### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>

##### Implementation of

```ts
IBinaryTree.getRightMost
```

##### Inherited from

[`BST`](BST.md).[`getRightMost`](BST.md#getrightmost)

***

### getSuccessor()

```ts
getSuccessor(x?): BinaryTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1846](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1846)

Gets the in-order successor of a node in a BST.

#### Parameters

##### x?

`K` \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`

The node to find the successor of.

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

The successor node, or null/undefined if none exists.

#### Remarks

Time O(H), where H is the tree height. O(N) worst-case. Space O(H) (due to `getLeftMost` stack).

#### Inherited from

[`BST`](BST.md).[`getSuccessor`](BST.md#getsuccessor)

***

### has()

```ts
has(
   keyNodeEntryOrPredicate?, 
   startNode?, 
   iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1313](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1313)

Checks if a node matching the predicate exists in the tree.

#### Parameters

##### keyNodeEntryOrPredicate?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `null`

The key, node, entry, or predicate to check for.

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start the search from.

##### iterationType?

`IterationType`

The traversal method.

#### Returns

`boolean`

True if a matching node exists, false otherwise.

 *

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Time O(N) in the worst case (via `search`). Space O(H) or O(N) (via `search`).

#### Example

```ts
const avl = new AVLTree<number>([5, 3, 7]);
console.log(avl.has(3)); // true
console.log(avl.has(99)); // false
```

#### Implementation of

```ts
IBinaryTree.has
```

#### Inherited from

[`BST`](BST.md).[`has`](BST.md#has)

***

### hasValue()

```ts
hasValue(value): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:143](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L143)

Whether there exists an entry with the given value.

#### Parameters

##### value

`V` \| `undefined`

Value to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Implementation of

```ts
IBinaryTree.hasValue
```

#### Inherited from

[`BST`](BST.md).[`hasValue`](BST.md#hasvalue)

***

### higher()

#### Call Signature

```ts
higher(keyNodeEntryOrPredicate): K | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:1455](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1455)

Returns the first key with a value > target.
Equivalent to Java TreeMap.higher.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

 *

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

##### Returns

`K` \| `undefined`

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30]);
console.log(avl.higher(20)); // 30
```

##### Inherited from

[`BST`](BST.md).[`higher`](BST.md#higher)

#### Call Signature

```ts
higher<C>(
   keyNodeEntryOrPredicate, 
   callback, 
iterationType?): ReturnType<C>;
```

Defined in: [data-structures/binary-tree/bst.ts:1470](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1470)

Returns the first node with a key > target and applies callback.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

###### callback

`C`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30]);
console.log(avl.higher(20)); // 30
```

##### Inherited from

[`BST`](BST.md).[`higher`](BST.md#higher)

***

### isAVLBalanced()

```ts
isAVLBalanced(iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/bst.ts:1942](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1942)

Checks if the tree meets the AVL balance condition (height difference <= 1).

#### Parameters

##### iterationType?

`IterationType` = `...`

The traversal method.

#### Returns

`boolean`

True if the tree is AVL balanced, false otherwise.

 *

#### Remarks

Time O(N), as it must visit every node to compute height. Space O(log N) for recursion or O(N) for iterative map.

#### Example

```ts
const avl = new AVLTree<number>([1, 2, 3, 4, 5, 6, 7]);
console.log(avl.isAVLBalanced()); // true
```

#### Inherited from

[`BST`](BST.md).[`isAVLBalanced`](BST.md#isavlbalanced)

***

### isBST()

```ts
isBST(startNode?, iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1465](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1465)

Checks if the tree is a valid Binary Search Tree (BST).

#### Parameters

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start checking from.

##### iterationType?

`IterationType` = `...`

The traversal method.

#### Returns

`boolean`

True if it's a valid BST, false otherwise.

 *

#### Remarks

Time O(N), as it must visit every node. Space O(H) for the call stack (recursive) or explicit stack (iterative), where H is the tree height (O(N) worst-case).

#### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 4]);
console.log(avl.isBST()); // true
```

#### Implementation of

```ts
IBinaryTree.isBST
```

#### Inherited from

[`BST`](BST.md).[`isBST`](BST.md#isbst)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1413](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1413)

Checks if the tree is empty.

#### Returns

`boolean`

True if the tree has no nodes, false otherwise.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
console.log(new AVLTree().isEmpty()); // true
```

#### Implementation of

```ts
IBinaryTree.isEmpty
```

#### Inherited from

[`BST`](BST.md).[`isEmpty`](BST.md#isempty)

***

### isEntry()

```ts
isEntry(keyNodeOrEntry): keyNodeOrEntry is BTNEntry<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:545](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L545)

Checks if the given item is a [key, value] entry pair.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeOrEntry is BTNEntry<K, V>`

True if it's an entry, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BST`](BST.md).[`isEntry`](BST.md#isentry)

***

### isLeaf()

```ts
isLeaf(keyNodeOrEntry): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:531](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L531)

Checks if a node is a leaf (has no real children).

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The node to check.

#### Returns

`boolean`

True if the node is a leaf, false otherwise.

#### Remarks

Time O(N) if a key/entry is passed (due to `ensureNode`). O(1) if a node is passed. Space O(1) or O(H) (from `ensureNode`).

#### Inherited from

[`BST`](BST.md).[`isLeaf`](BST.md#isleaf)

***

### isNIL()

```ts
isNIL(keyNodeOrEntry): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:500](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L500)

Checks if the given item is the sentinel NIL node.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`boolean`

True if it's the NIL node, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BST`](BST.md).[`isNIL`](BST.md#isnil)

***

### isNode()

```ts
isNode(keyNodeOrEntry): keyNodeOrEntry is AVLTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:350](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L350)

Checks if the given item is an `AVLTreeNode` instance.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeOrEntry is AVLTreeNode<K, V>`

True if it's an AVLTreeNode, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`BST`](BST.md).[`isNode`](BST.md#isnode)

***

### isPerfectlyBalanced()

```ts
isPerfectlyBalanced(startNode?): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1424](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1424)

Checks if the tree is perfectly balanced.

#### Parameters

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start checking from.

#### Returns

`boolean`

True if perfectly balanced, false otherwise.

#### Remarks

A tree is perfectly balanced if the difference between min and max height is at most 1. Time O(N), as it requires two full traversals (`getMinHeight` and `getHeight`). Space O(H) or O(N) (from height calculation).

#### Implementation of

```ts
IBinaryTree.isPerfectlyBalanced
```

#### Inherited from

[`BST`](BST.md).[`isPerfectlyBalanced`](BST.md#isperfectlybalanced)

***

### isRange()

```ts
isRange(keyNodeEntryOrPredicate): keyNodeEntryOrPredicate is Range<K>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:511](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L511)

Checks if the given item is a `Range` object.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `Range`\<`K`\>
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeEntryOrPredicate is Range<K>`

True if it's a Range, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BST`](BST.md).[`isRange`](BST.md#isrange)

***

### isRaw()

```ts
isRaw(keyNodeEntryOrRaw): keyNodeEntryOrRaw is R;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:460](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L460)

Checks if the given item is a raw data object (R) that needs conversion via `toEntryFn`.

#### Parameters

##### keyNodeEntryOrRaw

  \| `K`
  \| `R`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeEntryOrRaw is R`

True if it's a raw object, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BST`](BST.md).[`isRaw`](BST.md#israw)

***

### isRealNode()

```ts
isRealNode(keyNodeOrEntry): keyNodeOrEntry is BinaryTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:473](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L473)

Checks if the given item is a "real" node (i.e., not null, undefined, or NIL).

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeOrEntry is BinaryTreeNode<K, V>`

True if it's a real node, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BST`](BST.md).[`isRealNode`](BST.md#isrealnode)

***

### isRealNodeOrNull()

```ts
isRealNodeOrNull(keyNodeOrEntry): keyNodeOrEntry is BinaryTreeNode<K, V> | null;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:487](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L487)

Checks if the given item is either a "real" node or null.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`

The item to check.

#### Returns

keyNodeOrEntry is BinaryTreeNode\&lt;K, V\&gt; \| null

True if it's a real node or null, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BST`](BST.md).[`isRealNodeOrNull`](BST.md#isrealnodeornull)

***

### isValidKey()

```ts
isValidKey(key): key is K;
```

Defined in: [data-structures/binary-tree/bst.ts:431](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L431)

Checks if the given key is valid (comparable).

#### Parameters

##### key

`any`

The key to validate.

#### Returns

`key is K`

True if the key is valid, false otherwise.

#### Remarks

Time O(1)

#### Inherited from

[`BST`](BST.md).[`isValidKey`](BST.md#isvalidkey)

***

### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:42](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L42)

Iterate over keys only.

#### Returns

`IterableIterator`\<`K`\>

Iterator of keys.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number>([30, 10, 20]);
console.log([...avl.keys()]); // [10, 20, 30]
```

#### Implementation of

```ts
IBinaryTree.keys
```

#### Inherited from

[`BST`](BST.md).[`keys`](BST.md#keys)

***

### leaves()

Finds all leaf nodes in the tree.

#### Remarks

Time O(N), visits every node. Space O(H) for recursive or iterative stack.

#### Template

The type of the callback function.

#### Param

Function to call on each leaf node.

#### Param

The node to start from.

#### Param

The traversal method.

#### Call Signature

```ts
leaves(): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2107](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2107)

Get leaf nodes

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = avl.leaves(n => n.key);
console.log(leafKeys.length); // > 0
```

##### Implementation of

```ts
IBinaryTree.leaves
```

##### Inherited from

[`BST`](BST.md).[`leaves`](BST.md#leaves)

#### Call Signature

```ts
leaves<C>(
   callback, 
   startNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2109](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2109)

Get leaf nodes

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback

`C`

###### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = avl.leaves(n => n.key);
console.log(leafKeys.length); // > 0
```

##### Implementation of

```ts
IBinaryTree.leaves
```

##### Inherited from

[`BST`](BST.md).[`leaves`](BST.md#leaves)

***

### lesserOrGreaterTraverse()

Traverses the tree and returns nodes that are lesser or greater than a target node.

#### Remarks

Time O(N), as it performs a full traversal. Space O(log N) or O(N).

#### Template

The type of the callback function.

#### Param

Function to call on matching nodes.

#### Param

1 for lesser, 1 for greater, 0 for equal.

#### Param

The node to compare against.

#### Param

The traversal method.

#### Call Signature

```ts
lesserOrGreaterTraverse(): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/bst.ts:1790](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1790)

##### Returns

(`K` \| `undefined`)[]

##### Inherited from

[`BST`](BST.md).[`lesserOrGreaterTraverse`](BST.md#lesserorgreatertraverse)

#### Call Signature

```ts
lesserOrGreaterTraverse<C>(
   callback, 
   lesserOrGreater?, 
   targetNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/bst.ts:1792](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1792)

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback

`C`

###### lesserOrGreater?

`number`

###### targetNode?

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[]

##### Inherited from

[`BST`](BST.md).[`lesserOrGreaterTraverse`](BST.md#lesserorgreatertraverse)

***

### listLevels()

Returns a 2D array of nodes, grouped by level.

#### Remarks

Time O(N), visits every node. Space O(N) for the result array and the queue/stack.

#### Template

The type of the callback function.

#### Param

Function to call on each node.

#### Param

The node to start from.

#### Param

The traversal method.

#### Call Signature

```ts
listLevels(): (K | undefined)[][];
```

Defined in: [data-structures/binary-tree/bst.ts:650](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L650)

Level-order grouping

 *

##### Returns

(`K` \| `undefined`)[][]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 4]);
    const levels = avl.listLevels(n => n.key);
console.log(levels.length); // > 0
console.log(levels.flat().sort((a, b) => a - b)); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.listLevels
```

##### Inherited from

[`BST`](BST.md).[`listLevels`](BST.md#listlevels)

#### Call Signature

```ts
listLevels<C>(
   callback, 
   startNode?, 
   iterationType?): ReturnType<C>[][];
```

Defined in: [data-structures/binary-tree/bst.ts:652](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L652)

Level-order grouping

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback

`C`

###### startNode?

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[][]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 4]);
    const levels = avl.listLevels(n => n.key);
console.log(levels.length); // > 0
console.log(levels.flat().sort((a, b) => a - b)); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.listLevels
```

##### Inherited from

[`BST`](BST.md).[`listLevels`](BST.md#listlevels)

***

### lower()

#### Call Signature

```ts
lower(keyNodeEntryOrPredicate): K | undefined;
```

Defined in: [data-structures/binary-tree/bst.ts:1687](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1687)

Returns the first key with a value < target.
Equivalent to Java TreeMap.lower.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

 *

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

##### Returns

`K` \| `undefined`

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30]);
console.log(avl.lower(20)); // 10
```

##### Inherited from

[`BST`](BST.md).[`lower`](BST.md#lower)

#### Call Signature

```ts
lower<C>(
   keyNodeEntryOrPredicate, 
   callback, 
iterationType?): ReturnType<C>;
```

Defined in: [data-structures/binary-tree/bst.ts:1702](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1702)

Returns the first node with a key < target and applies callback.
Time Complexity: O(log n) average, O(h) worst case.
Space Complexity: O(h) for recursion, O(1) for iteration.

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

###### callback

`C`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30]);
console.log(avl.lower(20)); // 10
```

##### Inherited from

[`BST`](BST.md).[`lower`](BST.md#lower)

***

### map()

```ts
map<MK, MV, MR>(
   callback, 
   options?, 
thisArg?): AVLTree<MK, MV, MR>;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:728](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L728)

Creates a new AVLTree by mapping each [key, value] pair.

#### Type Parameters

##### MK

`MK` = `K`

New key type.

##### MV

`MV` = `V`

New value type.

##### MR

`MR` = `any`

New raw type.

#### Parameters

##### callback

`EntryCallback`\<`K`, `V` \| `undefined`, \[`MK`, `MV`\]\>

A function to map each [key, value] pair.

##### options?

`Partial`\<`BinaryTreeOptions`\<`MK`, `MV`, `MR`\>\>

Options for the new AVLTree.

##### thisArg?

`unknown`

`this` context for the callback.

#### Returns

`AVLTree`\<`MK`, `MV`, `MR`\>

A new, mapped AVLTree.

 *

#### Remarks

Time O(N log N) (O(N) iteration + O(log M) `set` for each item into the new tree). Space O(N) for the new tree.

#### Example

```ts
const avl = new AVLTree<number, number>([[1, 10], [2, 20]]);
    const doubled = avl.map((v, k) => [k, (v ?? 0) * 2] as [number, number]);
console.log([...doubled.values()]); // [20, 40]
```

#### Implementation of

```ts
IBinaryTree.map
```

#### Overrides

[`BST`](BST.md).[`map`](BST.md#map)

***

### merge()

```ts
merge(anotherTree): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:847](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L847)

Merges another tree into this one by seting all its nodes.

#### Parameters

##### anotherTree

[`BinaryTree`](BinaryTree.md)\<`K`, `V`, `R`\>

The tree to merge.

 *

#### Returns

`void`

#### Remarks

Time O(N * M), same as `setMany`, where N is the size of `anotherTree` and M is the size of this tree. Space O(M) (from `set`).

#### Example

```ts
const avl1 = new AVLTree<number>([1, 3]);
    const avl2 = new AVLTree<number>([2, 4]);
    avl1.merge(avl2);
console.log([...avl1.keys()]); // [1, 2, 3, 4]
```

#### Implementation of

```ts
IBinaryTree.merge
```

#### Inherited from

[`BST`](BST.md).[`merge`](BST.md#merge)

***

### morris()

Performs a Morris (threaded) traversal.

#### Remarks

This traversal uses O(1) extra space (excluding the result array) by temporarily modifying the tree's right child pointers. Time O(N), as each node is visited a constant number of times. Space O(1) (excluding the `ans` array).

#### Template

The type of the callback function.

#### Param

Function to call on each node.

#### Param

The traversal order ('IN', 'PRE', 'POST').

#### Param

The node to start from.

#### Call Signature

```ts
morris(): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2303](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2303)

Morris traversal (O(1) space)

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7]);
    const result = avl.morris(n => n.key, 'IN');
console.log(result); // [3, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.morris
```

##### Inherited from

[`BST`](BST.md).[`morris`](BST.md#morris)

#### Call Signature

```ts
morris<C>(
   callback?, 
   pattern?, 
   startNode?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2305](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2305)

Morris traversal (O(1) space)

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback?

`C`

###### pattern?

`DFSOrderPattern`

###### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7]);
    const result = avl.morris(n => n.key, 'IN');
console.log(result); // [3, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.morris
```

##### Inherited from

[`BST`](BST.md).[`morris`](BST.md#morris)

***

### perfectlyBalance()

```ts
perfectlyBalance(iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:621](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L621)

Rebuilds the tree to be perfectly balanced.

#### Parameters

##### iterationType?

`IterationType` = `...`

The traversal method for the initial node export.

#### Returns

`boolean`

True if successful, false if the tree was empty.

 *

#### Remarks

AVL trees are already height-balanced, but this makes them *perfectly* balanced (minimal height and all leaves at N or N-1).
Time O(N) (O(N) for DFS, O(N) for sorted build). Space O(N) for node array and recursion stack.

#### Example

```ts
const avl = new AVLTree<number>([1, 2, 3, 4, 5]);
    avl.perfectlyBalance();
console.log(avl.isAVLBalanced()); // true
```

#### Overrides

[`BST`](BST.md).[`perfectlyBalance`](BST.md#perfectlybalance)

***

### print()

```ts
print(options?, startNode?): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2620](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2620)

Prints a visual representation of the tree to the console.

#### Parameters

##### options?

`BinaryTreePrintOptions`

Options to control the output.

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start printing from.

 *

#### Returns

`void`

#### Remarks

Time O(N) (via `toVisual`). Space O(N*H) or O(N^2) (via `toVisual`).

#### Example

```ts
const avl = new AVLTree<number>([5, 3, 7]);
```

#### Inherited from

[`BST`](BST.md).[`print`](BST.md#print)

***

### rangeSearch()

Performs an optimized search for nodes within a given key range.

#### Remarks

Time O(H + M), where H is tree height and M is the number of matches.

#### Template

The type of the callback function.

#### Param

A `Range` object or a `[low, high]` tuple.

#### Param

A function to call on matching nodes.

#### Param

The node to start the search from.

#### Param

The traversal method.

#### Call Signature

```ts
rangeSearch(range): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/bst.ts:1025](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1025)

Find all keys in a range

 *

##### Parameters

###### range

`Range`\<`K`\> \| \[`K`, `K`\]

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30, 40, 50]);
console.log(avl.rangeSearch([15, 35])); // [20, 30]
```

##### Inherited from

[`BST`](BST.md).[`rangeSearch`](BST.md#rangesearch)

#### Call Signature

```ts
rangeSearch<C>(
   range, 
   callback, 
   startNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/bst.ts:1027](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1027)

Find all keys in a range

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### range

`Range`\<`K`\> \| \[`K`, `K`\]

###### callback

`C`

###### startNode?

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const avl = new AVLTree<number>([10, 20, 30, 40, 50]);
console.log(avl.rangeSearch([15, 35])); // [20, 30]
```

##### Inherited from

[`BST`](BST.md).[`rangeSearch`](BST.md#rangesearch)

***

### reduce()

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-entry-base.ts:171](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L171)

Reduce entries into a single accumulator.

#### Type Parameters

##### U

`U`

#### Parameters

##### callbackfn

`ReduceEntryCallback`\<`K`, `V` \| `undefined`, `U`\>

`(acc, value, key, index, self) => acc`.

##### initialValue

`U`

Initial accumulator.

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number, number>([[1, 10], [2, 20], [3, 30]]);
    const sum = avl.reduce((acc, v) => acc + (v ?? 0), 0);
console.log(sum); // 60
```

#### Implementation of

```ts
IBinaryTree.reduce
```

#### Inherited from

[`BST`](BST.md).[`reduce`](BST.md#reduce)

***

### refill()

```ts
refill(keysNodesEntriesOrRaws, values?): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:858](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L858)

Clears the tree and refills it with new items.

#### Parameters

##### keysNodesEntriesOrRaws

`Iterable`\<
  \| `K`
  \| `R`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`
  \| `undefined`\>

An iterable of items to set.

##### values?

`Iterable`\<`V` \| `undefined`, `any`, `any`\>

An optional parallel iterable of values.

#### Returns

`void`

#### Remarks

Time O(N) (for `clear`) + O(N * M) (for `setMany`) = O(N * M). Space O(M) (from `setMany`).

#### Implementation of

```ts
IBinaryTree.refill
```

#### Inherited from

[`BST`](BST.md).[`refill`](BST.md#refill)

***

### search()

Searches the tree for nodes matching a predicate, key, or range.

#### Remarks

This is an optimized search for a BST. If searching by key or range, it prunes branches.
Time O(H + M) for key/range search (H=height, M=matches). O(N) for predicate search.
Space O(log N) for the stack.

#### Template

The type of the callback function.

#### Param

The key, node, entry, predicate, or range to search for.

#### Param

If true, stops after finding the first match.

#### Param

A function to call on matching nodes.

#### Param

The node to start the search from.

#### Param

Whether to use 'RECURSIVE' or 'ITERATIVE' search.

#### Call Signature

```ts
search(keyNodeEntryOrPredicate, onlyOne?): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/bst.ts:842](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L842)

Search nodes by predicate

 *

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `Range`\<`K`\>
  \| `null`
  \| `undefined`

###### onlyOne?

`boolean`

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 9]);
    const found = avl.search(n => n.key > 5, true);
console.log(found.length); // >= 1
```

##### Implementation of

```ts
IBinaryTree.search
```

##### Inherited from

[`BST`](BST.md).[`search`](BST.md#search)

#### Call Signature

```ts
search<C>(
   keyNodeEntryOrPredicate, 
   onlyOne, 
   callback, 
   startNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/bst.ts:854](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L854)

Search nodes by predicate

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BSTNode`](BSTNode.md)\<`K`, `V`\>\>
  \| `Range`\<`K`\>
  \| `null`
  \| `undefined`

###### onlyOne

`boolean`

###### callback

`C`

###### startNode?

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const avl = new AVLTree<number>([5, 3, 7, 1, 9]);
    const found = avl.search(n => n.key > 5, true);
console.log(found.length); // >= 1
```

##### Implementation of

```ts
IBinaryTree.search
```

##### Inherited from

[`BST`](BST.md).[`search`](BST.md#search)

***

### set()

```ts
set(keyNodeOrEntry, value?): boolean;
```

Defined in: [data-structures/binary-tree/avl-tree.ts:458](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/avl-tree.ts#L458)

Sets a new node to the AVL tree and balances the tree path.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`AVLTreeNode`](AVLTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The key, node, or entry to set.

##### value?

`V`

The value, if providing just a key.

#### Returns

`boolean`

True if the addition was successful, false otherwise.

 *

#### Remarks

Time O(log N) (O(H) for BST set + O(H) for `_balancePath`). Space O(H) for path/recursion.

#### Example

```ts
// Create a simple AVLTree with initial values
    const tree = new AVLTree([5, 2, 8, 1, 9]);

    tree.print();
    //   _2___
    //  /     \
    //  1    _8_
    //      /   \
    //      5   9

    // Verify the tree maintains sorted order
console.log([...tree.keys()]); // [1, 2, 5, 8, 9]

    // Check size
console.log(tree.size); // 5

    // Add a new element
    tree.set(3);
console.log(tree.size); // 6
console.log([...tree.keys()]); // [1, 2, 3, 5, 8, 9]
```

#### Implementation of

```ts
IBinaryTree.set
```

#### Overrides

[`BST`](BST.md).[`set`](BST.md#set)

***

### setMany()

```ts
setMany(
   keysNodesEntriesOrRaws, 
   values?, 
   isBalanceAdd?, 
   iterationType?): boolean[];
```

Defined in: [data-structures/binary-tree/bst.ts:1233](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1233)

Adds multiple items to the tree.

#### Parameters

##### keysNodesEntriesOrRaws

`Iterable`\<`R` \| `BTNRep`\<`K`, `V`, [`BSTNode`](BSTNode.md)\<`K`, `V`\>\>\>

An iterable of items to set.

##### values?

`Iterable`\<`V` \| `undefined`, `any`, `any`\>

An optional parallel iterable of values.

##### isBalanceAdd?

`boolean` = `true`

If true, builds a balanced tree from the items.

##### iterationType?

`IterationType` = `...`

The traversal method for balanced set (recursive or iterative).

#### Returns

`boolean`[]

An array of booleans indicating the success of each individual `set` operation.

 *

#### Remarks

If `isBalanceAdd` is true, sorts the input and builds a balanced tree. Time O(N log N) (due to sort and balanced set).
If false, adds items one by one. Time O(N * H), which is O(N^2) worst-case.
Space O(N) for sorting and recursion/iteration stack.

#### Example

```ts
const avl = new AVLTree<number, string>();
    avl.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
console.log(avl.size); // 3
```

#### Inherited from

[`BST`](BST.md).[`setMany`](BST.md#setmany)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:83](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L83)

Test whether any entry satisfies the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if any passes; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number>([1, 3, 5]);
console.log(avl.some((v, k) => k === 3)); // true
```

#### Implementation of

```ts
IBinaryTree.some
```

#### Inherited from

[`BST`](BST.md).[`some`](BST.md#some)

***

### toArray()

```ts
toArray(): [K, V | undefined][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`K`, `V` \| `undefined`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

#### Example

```ts
const avl = new AVLTree<number>([30, 10, 20]);
console.log(avl.toArray().map(([k]) => k)); // [10, 20, 30]
```

#### Inherited from

[`BST`](BST.md).[`toArray`](BST.md#toarray)

***

### toVisual()

```ts
toVisual(startNode?, options?): string;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2561](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2561)

Generates a string representation of the tree for visualization.

#### Parameters

##### startNode?

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| `null`

The node to start printing from.

##### options?

`BinaryTreePrintOptions`

Options to control the output (e.g., show nulls).

#### Returns

`string`

The string representation of the tree.

#### Remarks

Time O(N), visits every node. Space O(N*H) or O(N^2) in the worst case, as the string width can grow significantly.

#### Inherited from

[`BST`](BST.md).[`toVisual`](BST.md#tovisual)

***

### values()

```ts
values(): IterableIterator<V | undefined>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:53](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L53)

Iterate over values only.

#### Returns

`IterableIterator`\<`V` \| `undefined`\>

Iterator of values.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const avl = new AVLTree<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
console.log([...avl.values()]); // ['a', 'b', 'c']
```

#### Implementation of

```ts
IBinaryTree.values
```

#### Inherited from

[`BST`](BST.md).[`values`](BST.md#values)
