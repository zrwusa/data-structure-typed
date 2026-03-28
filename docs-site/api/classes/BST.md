[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / BST

# Class: BST\<K, V, R\>

Defined in: [data-structures/binary-tree/bst.ts:327](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L327)

Represents a Binary Search Tree (BST).
Keys are ordered, allowing for faster search operations compared to a standard Binary Tree.

## Examples

```ts
// BST delete and search after deletion
 const bst = new BST<number>([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

    // Delete a leaf node
    bst.delete(1);
    console.log(bst.has(1)); // false;

    // Delete a node with one child
    bst.delete(2);
    console.log(bst.has(2)); // false;

    // Delete a node with two children
    bst.delete(3);
    console.log(bst.has(3)); // false;

    // Size decreases with each deletion
    console.log(bst.size); // 13;

    // Other nodes remain searchable
    console.log(bst.has(11)); // true;
    console.log(bst.has(15)); // true;
```

```ts
// Merge 3 sorted datasets
 const dataset1 = new BST<number, string>([
      [1, 'A'],
      [7, 'G']
    ]);
    const dataset2 = [
      [2, 'B'],
      [6, 'F']
    ];
    const dataset3 = new BST<number, string>([
      [3, 'C'],
      [5, 'E'],
      [4, 'D']
    ]);

    // Merge datasets into a single BinarySearchTree
    const merged = new BST<number, string>(dataset1);
    merged.setMany(dataset2);
    merged.merge(dataset3);

    // Verify merged dataset is in sorted order
    console.log([...merged.values()]); // ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
```

```ts
// BST with custom objects for expression evaluation
 interface Expression {
      id: number;
      operator: string;
      precedence: number;
    }

    // BST efficiently stores and retrieves operators by precedence
    const operatorTree = new BST<number, Expression>(
      [
        [1, { id: 1, operator: '+', precedence: 1 }],
        [2, { id: 2, operator: '*', precedence: 2 }],
        [3, { id: 3, operator: '/', precedence: 2 }],
        [4, { id: 4, operator: '-', precedence: 1 }],
        [5, { id: 5, operator: '^', precedence: 3 }]
      ],
      { isMapMode: false }
    );

    console.log(operatorTree.size); // 5;

    // Quick lookup of operators
    const mult = operatorTree.get(2);
    console.log(mult?.operator); // '*';
    console.log(mult?.precedence); // 2;

    // Check if operator exists
    console.log(operatorTree.has(5)); // true;
    console.log(operatorTree.has(99)); // false;

    // Retrieve operator by precedence level
    const expNode = operatorTree.getNode(3);
    console.log(expNode?.key); // 3;
    console.log(expNode?.value?.precedence); // 2;

    // Delete operator and verify
    operatorTree.delete(1);
    console.log(operatorTree.has(1)); // false;
    console.log(operatorTree.size); // 4;

    // Get tree height for optimization analysis
    const treeHeight = operatorTree.getHeight();
    console.log(treeHeight); // > 0;

    // Remaining operators are still accessible
    const remaining = operatorTree.get(2);
    console.log(remaining); // defined;
```

```ts
// Find lowest common ancestor
 const bst = new BST<number>([20, 10, 30, 5, 15, 25, 35, 3, 7, 12, 18]);

    // LCA helper function
    const findLCA = (num1: number, num2: number): number | undefined => {
      const path1 = bst.getPathToRoot(num1);
      const path2 = bst.getPathToRoot(num2);
      // Find the first common ancestor
      return findFirstCommon(path1, path2);
    };

    function findFirstCommon(arr1: (number | undefined)[], arr2: (number | undefined)[]): number | undefined {
      for (const num of arr1) {
        if (arr2.indexOf(num) !== -1) {
          return num;
        }
      }
      return undefined;
    }

    // Assertions
    console.log(findLCA(3, 10)); // 7;
    console.log(findLCA(5, 35)); // 15;
    console.log(findLCA(20, 30)); // 25;
```

## Extends

- [`BinaryTree`](BinaryTree.md)\<`K`, `V`, `R`\>

## Extended by

- [`AVLTree`](AVLTree.md)
- [`RedBlackTree`](RedBlackTree.md)

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

1. Node Order: Each node's left child has a lesser value, and the right child has a greater value.
2. Unique Keys: No duplicate keys in a standard BST.
3. Efficient Search: Enables quick search, minimum, and maximum operations.
4. Inorder Traversal: Yields nodes in ascending order.
5. Logarithmic Operations: Ideal operations like insertion, deletion, and searching are O(log n) time-efficient.
6. Balance Variability: Can become unbalanced; special types maintain balance.
7. No Auto-Balancing: Standard BSTs don't automatically balance themselves.

## Implements

- `IBinaryTree`\<`K`, `V`, `R`\>

## Constructors

### Constructor

```ts
new BST<K, V, R>(keysNodesEntriesOrRaws?, options?): BST<K, V, R>;
```

Defined in: [data-structures/binary-tree/bst.ts:335](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L335)

Creates an instance of BST.

#### Parameters

##### keysNodesEntriesOrRaws?

`Iterable`\<
  \| `K`
  \| `R`
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| [`BSTNode`](BSTNode.md)\<`any`, `any`\>
  \| `null`
  \| `undefined`\> = `[]`

An iterable of items to set.

##### options?

`BSTOptions`\<`K`, `V`, `R`\>

Configuration options for the BST, including comparator.

#### Returns

`BST`\<`K`, `V`, `R`\>

#### Remarks

Time O(N log N) or O(N^2) depending on `isBalanceAdd` in `addMany` and input order. Space O(N).

#### Overrides

[`BinaryTree`](BinaryTree.md).[`constructor`](BinaryTree.md#constructor)

## Properties

### \_comparator

```ts
protected readonly _comparator: Comparator<K>;
```

Defined in: [data-structures/binary-tree/bst.ts:372](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L372)

The comparator function used to determine the order of keys in the tree.

#### Remarks

Time O(1) Space O(1)

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

[`BinaryTree`](BinaryTree.md).[`_DEFAULT_NODE_CALLBACK`](BinaryTree.md#default-node-callback)

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

[`BinaryTree`](BinaryTree.md).[`isDuplicate`](BinaryTree.md#isduplicate)

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

[`BinaryTree`](BinaryTree.md).[`isMapMode`](BinaryTree.md#ismapmode)

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

[`BinaryTree`](BinaryTree.md).[`NIL`](BinaryTree.md#nil)

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

#### Overrides

[`BinaryTree`](BinaryTree.md).[`root`](BinaryTree.md#root)

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

[`BinaryTree`](BinaryTree.md).[`size`](BinaryTree.md#size)

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

[`BinaryTree`](BinaryTree.md).[`store`](BinaryTree.md#store)

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

[`BinaryTree`](BinaryTree.md).[`toEntryFn`](BinaryTree.md#toentryfn)

## Methods

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

[`BinaryTree`](BinaryTree.md).[`_clearNodes`](BinaryTree.md#clearnodes)

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

[`BinaryTree`](BinaryTree.md).[`_clearValues`](BinaryTree.md#clearvalues)

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

[`BinaryTree`](BinaryTree.md).[`_clone`](BinaryTree.md#clone)

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

***

### \_createInstance()

```ts
protected _createInstance<TK, TV, TR>(options?): this;
```

Defined in: [data-structures/binary-tree/bst.ts:2577](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2577)

(Protected) Creates a new, empty instance of the same BST constructor.

#### Type Parameters

##### TK

`TK` = `K`

##### TV

`TV` = `V`

##### TR

`TR` = `R`

#### Parameters

##### options?

`Partial`\<`BSTOptions`\<`TK`, `TV`, `TR`\>\>

Options for the new BST.

#### Returns

`this`

A new, empty BST.

#### Remarks

Time O(1)

#### Overrides

[`BinaryTree`](BinaryTree.md).[`_createInstance`](BinaryTree.md#createinstance)

***

### \_createLike()

```ts
protected _createLike<TK, TV, TR>(iter?, options?): BST<TK, TV, TR>;
```

Defined in: [data-structures/binary-tree/bst.ts:2594](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2594)

(Protected) Creates a new instance of the same BST constructor, potentially with different generic types.

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
  \| [`BSTNode`](BSTNode.md)\<`TK`, `TV`\>
  \| \[`TK` \| `null` \| `undefined`, `TV` \| `undefined`\]
  \| `null`
  \| `undefined`\> = `[]`

An iterable to populate the new BST.

##### options?

`Partial`\<`BSTOptions`\<`TK`, `TV`, `TR`\>\>

Options for the new BST.

#### Returns

`BST`\<`TK`, `TV`, `TR`\>

A new BST.

#### Remarks

Time O(N log N) or O(N^2) (from constructor) due to processing the iterable.

#### Overrides

[`BinaryTree`](BinaryTree.md).[`_createLike`](BinaryTree.md#createlike)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`_dfs`](BinaryTree.md#dfs)

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

[`BinaryTree`](BinaryTree.md).[`_displayAux`](BinaryTree.md#displayaux)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`_ensurePredicate`](BinaryTree.md#ensurepredicate)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item.

#### Returns

`K` \| `null` \| `undefined`

The extracted key.

#### Remarks

Time O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`_extractKey`](BinaryTree.md#extractkey)

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

[`BinaryTree`](BinaryTree.md).[`_getIterator`](BinaryTree.md#getiterator)

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

[`BinaryTree`](BinaryTree.md).[`_isDisplayLeaf`](BinaryTree.md#isdisplayleaf)

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

[`BinaryTree`](BinaryTree.md).[`_isPredicate`](BinaryTree.md#ispredicate)

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

#### Overrides

[`BinaryTree`](BinaryTree.md).[`_keyValueNodeOrEntryToNodeAndValue`](BinaryTree.md#keyvaluenodeorentrytonodeandvalue)

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

***

### \_replaceNode()

```ts
protected _replaceNode(oldNode, newNode): BinaryTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3118](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3118)

(Protected) Replaces a node in the tree with a new node, maintaining children and parent links.

#### Parameters

##### oldNode

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>

The node to be replaced.

##### newNode

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>

The node to insert.

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>

The `newNode`.

#### Remarks

Time O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`_replaceNode`](BinaryTree.md#replacenode)

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

[`BinaryTree`](BinaryTree.md).[`_resolveDisplayLeaf`](BinaryTree.md#resolvedisplayleaf)

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

#### Overrides

[`BinaryTree`](BinaryTree.md).[`_setRoot`](BinaryTree.md#setroot)

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

[`BinaryTree`](BinaryTree.md).[`_setValue`](BinaryTree.md#setvalue)

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

#### Overrides

[`BinaryTree`](BinaryTree.md).[`_snapshotOptions`](BinaryTree.md#snapshotoptions)

***

### \_swapProperties()

```ts
protected _swapProperties(srcNode, destNode): BinaryTreeNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3084](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3084)

(Protected) Swaps the key/value properties of two nodes.

#### Parameters

##### srcNode

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The source node.

##### destNode

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The destination node.

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `undefined`

The `destNode` (now holding `srcNode`'s properties).

#### Remarks

Time O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`_swapProperties`](BinaryTree.md#swapproperties)

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

[`BinaryTree`](BinaryTree.md).[`[iterator]`](BinaryTree.md#iterator)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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
const bst = new BST<number>();
    bst.add(5);
    bst.add(3);
    bst.add(7);
console.log(bst.size); // 3
console.log([...bst.keys()]); // [3, 5, 7]
```

#### Implementation of

```ts
IBinaryTree.add
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`add`](BinaryTree.md#add)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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
const bst = new BST<number>();
    bst.addMany([5, 3, 7, 1, 9]);
console.log(bst.size); // 5
console.log([...bst.keys()]); // [1, 3, 5, 7, 9]
```

#### Implementation of

```ts
IBinaryTree.addMany
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`addMany`](BinaryTree.md#addmany)

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
const bst = new BST<number>([5, 3, 7]);
    const result = bst.bfs(node => node.key);
console.log(result.length); // 3
```

##### Implementation of

```ts
IBinaryTree.bfs
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`bfs`](BinaryTree.md#bfs)

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
const bst = new BST<number>([5, 3, 7]);
    const result = bst.bfs(node => node.key);
console.log(result.length); // 3
```

##### Implementation of

```ts
IBinaryTree.bfs
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`bfs`](BinaryTree.md#bfs)

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
const bst = new BST<number>([10, 20, 30, 40, 50]);
console.log(bst.ceiling(25)); // 30
console.log(bst.ceiling(30)); // 30
```

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
const bst = new BST<number>([10, 20, 30, 40, 50]);
console.log(bst.ceiling(25)); // 30
console.log(bst.ceiling(30)); // 30
```

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
const bst = new BST<number>([1, 2, 3]);
    bst.clear();
console.log(bst.size); // 0
console.log(bst.isEmpty()); // true
```

#### Implementation of

```ts
IBinaryTree.clear
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`clear`](BinaryTree.md#clear)

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
const bst = new BST<number>([3, 1, 5]);
    const copy = bst.clone();
    copy.delete(1);
console.log(bst.has(1)); // true
console.log(copy.has(1)); // false
```

#### Implementation of

```ts
IBinaryTree.clone
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`clone`](BinaryTree.md#clone)

***

### createNode()

```ts
createNode(key, value?): BSTNode<K, V>;
```

Defined in: [data-structures/binary-tree/bst.ts:392](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L392)

(Protected) Creates a new BST node.

#### Parameters

##### key

`K`

The key for the new node.

##### value?

`V`

The value for the new node (used if not in Map mode).

#### Returns

[`BSTNode`](BSTNode.md)\<`K`, `V`\>

The newly created BSTNode.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IBinaryTree.createNode
```

#### Overrides

[`BinaryTree`](BinaryTree.md).[`createNode`](BinaryTree.md#createnode)

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

[`BinaryTree`](BinaryTree.md).[`createTree`](BinaryTree.md#createtree)

***

### delete()

```ts
delete(keyNodeEntryRawOrPredicate): BinaryTreeDeleteResult<BinaryTreeNode<K, V>>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:905](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L905)

Deletes a node from the tree.

#### Parameters

##### keyNodeEntryRawOrPredicate

  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>
  \| `BTNRep`\<`K`, `V`, [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

The node to delete.

#### Returns

`BinaryTreeDeleteResult`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>[]

An array containing deletion results (for compatibility with self-balancing trees).

 *

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). This implementation finds the node, and if it has two children, swaps it with the rightmost node of its left subtree (in-order predecessor) before deleting. Time O(N) in the worst case. O(N) to find the node (`getNode`) and O(H) (which is O(N) worst-case) to find the rightmost node. Space O(1) (if `getNode` is iterative, which it is).

#### Example

```ts
const bst = new BST<number>([5, 3, 7, 1, 4, 6, 8]);
    bst.delete(3);
console.log(bst.has(3)); // false
console.log(bst.size); // 6
```

#### Implementation of

```ts
IBinaryTree.delete
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`delete`](BinaryTree.md#delete)

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
const bst = new BST<number>([5, 3, 7, 1, 4]);
    const inOrder = bst.dfs(node => node.key, 'IN');
console.log(inOrder); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.dfs
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`dfs`](BinaryTree.md#dfs)

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
const bst = new BST<number>([5, 3, 7, 1, 4]);
    const inOrder = bst.dfs(node => node.key, 'IN');
console.log(inOrder); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.dfs
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`dfs`](BinaryTree.md#dfs)

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

#### Overrides

[`BinaryTree`](BinaryTree.md).[`ensureNode`](BinaryTree.md#ensurenode)

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
const bst = new BST<number, string>([[3, 'c'], [1, 'a'], [5, 'e']]);
    const pairs = [...bst.entries()];
console.log(pairs); // [[1, 'a'], [3, 'c'], [5, 'e']]
```

#### Implementation of

```ts
IBinaryTree.entries
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`entries`](BinaryTree.md#entries)

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
const bst = new BST<number>([5, 3, 7]);
console.log(bst.every((v, key) => key > 0)); // true
```

#### Implementation of

```ts
IBinaryTree.every
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`every`](BinaryTree.md#every)

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
const bst = new BST<number>([1, 2, 3, 4, 5, 6]);
    const evens = bst.filter((_, key) => key % 2 === 0);
console.log([...evens.keys()]); // [2, 4, 6]
```

#### Implementation of

```ts
IBinaryTree.filter
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`filter`](BinaryTree.md#filter)

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
const bst = new BST<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    const found = bst.find(v => v === 'b');
console.log(found?.[0]); // 2
console.log(found?.[1]); // 'b'
```

#### Implementation of

```ts
IBinaryTree.find
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`find`](BinaryTree.md#find)

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
const bst = new BST<number>([10, 20, 30, 40, 50]);
console.log(bst.floor(25)); // 20
console.log(bst.floor(10)); // 10
```

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
const bst = new BST<number>([10, 20, 30, 40, 50]);
console.log(bst.floor(25)); // 20
console.log(bst.floor(10)); // 10
```

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
const bst = new BST<number>([3, 1, 2]);
    const keys: number[] = [];
    bst.forEach((value, key) => keys.push(key));
console.log(keys); // [1, 2, 3]
```

#### Implementation of

```ts
IBinaryTree.forEach
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`forEach`](BinaryTree.md#foreach)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The key, node, or entry to get the value for.

##### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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
const bst = new BST<number, string>([[5, 'five'], [3, 'three'], [7, 'seven']]);
console.log(bst.get(3)); // 'three'
```

#### Implementation of

```ts
IBinaryTree.get
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`get`](BinaryTree.md#get)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The node to find the depth of.

##### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`getDepth`](BinaryTree.md#getdepth)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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
const bst = new BST<number>([5, 3, 7, 1]);
console.log(bst.getHeight()); // >= 2
```

#### Implementation of

```ts
IBinaryTree.getHeight
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`getHeight`](BinaryTree.md#getheight)

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

[`BinaryTree`](BinaryTree.md).[`getLeftMost`](BinaryTree.md#getleftmost)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`getLeftMost`](BinaryTree.md#getleftmost)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`getMinHeight`](BinaryTree.md#getminheight)

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
const bst = new BST<number, string>([[5, 'root'], [3, 'left'], [7, 'right']]);
    const node = bst.getNode(3);
console.log(node?.key); // 3
console.log(node?.value); // 'left'
```

#### Implementation of

```ts
IBinaryTree.getNode
```

#### Overrides

[`BinaryTree`](BinaryTree.md).[`getNode`](BinaryTree.md#getnode)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

The key, node, entry, or predicate function to search for.

##### onlyOne?

`boolean`

If true, stops after finding the first match.

##### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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
const bst = new BST<number>([5, 3, 7, 1, 9]);
    const bigNodes = bst.getNodes(node => node.key > 5);
console.log(bigNodes.length); // 2
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`getNodes`](BinaryTree.md#getnodes)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

##### Returns

(`K` \| `undefined`)[]

##### Implementation of

```ts
IBinaryTree.getPathToRoot
```

##### Inherited from

[`BinaryTree`](BinaryTree.md).[`getPathToRoot`](BinaryTree.md#getpathtoroot)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`getPathToRoot`](BinaryTree.md#getpathtoroot)

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

[`BinaryTree`](BinaryTree.md).[`getPredecessor`](BinaryTree.md#getpredecessor)

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

[`BinaryTree`](BinaryTree.md).[`getRightMost`](BinaryTree.md#getrightmost)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`getRightMost`](BinaryTree.md#getrightmost)

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

[`BinaryTree`](BinaryTree.md).[`getSuccessor`](BinaryTree.md#getsuccessor)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `null`

The key, node, entry, or predicate to check for.

##### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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
const bst = new BST<number>([5, 3, 7, 1]);
console.log(bst.has(3)); // true
console.log(bst.has(99)); // false
```

#### Implementation of

```ts
IBinaryTree.has
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`has`](BinaryTree.md#has)

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

[`BinaryTree`](BinaryTree.md).[`hasValue`](BinaryTree.md#hasvalue)

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
const bst = new BST<number>([10, 20, 30, 40]);
console.log(bst.higher(20)); // 30
```

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
const bst = new BST<number>([10, 20, 30, 40]);
console.log(bst.higher(20)); // 30
```

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
const bst = new BST<number>([3, 1, 5, 2, 4]);
console.log(bst.isAVLBalanced()); // true
```

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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
const bst = new BST<number>([5, 3, 7, 1, 4]);
console.log(bst.isBST()); // true
```

#### Implementation of

```ts
IBinaryTree.isBST
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isBST`](BinaryTree.md#isbst)

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
const bst = new BST<number>();
console.log(bst.isEmpty()); // true
    bst.add(1);
console.log(bst.isEmpty()); // false
```

#### Implementation of

```ts
IBinaryTree.isEmpty
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isEmpty`](BinaryTree.md#isempty)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeOrEntry is BTNEntry<K, V>`

True if it's an entry, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isEntry`](BinaryTree.md#isentry)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The node to check.

#### Returns

`boolean`

True if the node is a leaf, false otherwise.

#### Remarks

Time O(N) if a key/entry is passed (due to `ensureNode`). O(1) if a node is passed. Space O(1) or O(H) (from `ensureNode`).

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isLeaf`](BinaryTree.md#isleaf)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`boolean`

True if it's the NIL node, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isNIL`](BinaryTree.md#isnil)

***

### isNode()

```ts
isNode(keyNodeOrEntry): keyNodeOrEntry is BSTNode<K, V>;
```

Defined in: [data-structures/binary-tree/bst.ts:418](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L418)

Checks if the given item is a `BSTNode` instance.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeOrEntry is BSTNode<K, V>`

True if it's a BSTNode, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`BinaryTree`](BinaryTree.md).[`isNode`](BinaryTree.md#isnode)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`isPerfectlyBalanced`](BinaryTree.md#isperfectlybalanced)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `Range`\<`K`\>
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeEntryOrPredicate is Range<K>`

True if it's a Range, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isRange`](BinaryTree.md#isrange)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeEntryOrRaw is R`

True if it's a raw object, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isRaw`](BinaryTree.md#israw)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to check.

#### Returns

`keyNodeOrEntry is BinaryTreeNode<K, V>`

True if it's a real node, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isRealNode`](BinaryTree.md#isrealnode)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to check.

#### Returns

keyNodeOrEntry is BinaryTreeNode\&lt;K, V\&gt; \| null

True if it's a real node or null, false otherwise.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`isRealNodeOrNull`](BinaryTree.md#isrealnodeornull)

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

#### Overrides

[`BinaryTree`](BinaryTree.md).[`isValidKey`](BinaryTree.md#isvalidkey)

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
const bst = new BST<number>([30, 10, 50, 20, 40]);
console.log([...bst.keys()]); // [10, 20, 30, 40, 50]
```

#### Implementation of

```ts
IBinaryTree.keys
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`keys`](BinaryTree.md#keys)

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
const bst = new BST<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = bst.leaves(node => node.key);
console.log(leafKeys.sort((a, b) => a - b)); // [1, 4, 6, 8]
```

##### Implementation of

```ts
IBinaryTree.leaves
```

##### Inherited from

[`BinaryTree`](BinaryTree.md).[`leaves`](BinaryTree.md#leaves)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const bst = new BST<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = bst.leaves(node => node.key);
console.log(leafKeys.sort((a, b) => a - b)); // [1, 4, 6, 8]
```

##### Implementation of

```ts
IBinaryTree.leaves
```

##### Inherited from

[`BinaryTree`](BinaryTree.md).[`leaves`](BinaryTree.md#leaves)

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
const bst = new BST<number>([5, 3, 7, 1, 4]);
    const levels = bst.listLevels(node => node.key);
console.log(levels.length); // > 0
console.log(levels[0].length); // 1
    const allKeys = levels.flat().sort((a, b) => a - b);
console.log(allKeys); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.listLevels
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`listLevels`](BinaryTree.md#listlevels)

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
const bst = new BST<number>([5, 3, 7, 1, 4]);
    const levels = bst.listLevels(node => node.key);
console.log(levels.length); // > 0
console.log(levels[0].length); // 1
    const allKeys = levels.flat().sort((a, b) => a - b);
console.log(allKeys); // [1, 3, 4, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.listLevels
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`listLevels`](BinaryTree.md#listlevels)

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
const bst = new BST<number>([10, 20, 30, 40]);
console.log(bst.lower(30)); // 20
```

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
const bst = new BST<number>([10, 20, 30, 40]);
console.log(bst.lower(30)); // 20
```

***

### map()

```ts
map<MK, MV, MR>(
   callback, 
   options?, 
thisArg?): BST<MK, MV, MR>;
```

Defined in: [data-structures/binary-tree/bst.ts:2049](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L2049)

Creates a new BST by mapping each [key, value] pair to a new entry.

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

`Partial`\<`BSTOptions`\<`MK`, `MV`, `MR`\>\>

Options for the new BST.

##### thisArg?

`unknown`

`this` context for the callback.

#### Returns

`BST`\<`MK`, `MV`, `MR`\>

A new, mapped BST.

 *

#### Remarks

Time O(N * H), where N is nodes in this tree, and H is height of the new tree during insertion.
Space O(N) for the new tree.

#### Example

```ts
const bst = new BST<number, number>([[1, 10], [2, 20], [3, 30]]);
    const doubled = bst.map((value, key) => [key, (value ?? 0) * 2] as [number, number]);
console.log([...doubled.values()]); // [20, 40, 60]
```

#### Implementation of

```ts
IBinaryTree.map
```

#### Overrides

[`BinaryTree`](BinaryTree.md).[`map`](BinaryTree.md#map)

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
const bst1 = new BST<number>([1, 3, 5]);
    const bst2 = new BST<number>([2, 4, 6]);
    bst1.merge(bst2);
console.log([...bst1.keys()]); // [1, 2, 3, 4, 5, 6]
```

#### Implementation of

```ts
IBinaryTree.merge
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`merge`](BinaryTree.md#merge)

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
const bst = new BST<number>([5, 3, 7]);
    const result = bst.morris(n => n.key, 'IN');
console.log(result); // [3, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.morris
```

##### Inherited from

[`BinaryTree`](BinaryTree.md).[`morris`](BinaryTree.md#morris)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const bst = new BST<number>([5, 3, 7]);
    const result = bst.morris(n => n.key, 'IN');
console.log(result); // [3, 5, 7]
```

##### Implementation of

```ts
IBinaryTree.morris
```

##### Inherited from

[`BinaryTree`](BinaryTree.md).[`morris`](BinaryTree.md#morris)

***

### perfectlyBalance()

```ts
perfectlyBalance(iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/bst.ts:1884](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1884)

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

Time O(N) (O(N) for DFS, O(N) for sorted build). Space O(N) for node array and recursion stack.

#### Example

```ts
const bst = new BST<number>();
    // Insert in sorted order (worst case for BST)
    for (let i = 1; i <= 7; i++) bst.add(i);
console.log(bst.isAVLBalanced()); // false
    bst.perfectlyBalance();
console.log(bst.isAVLBalanced()); // true
```

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

The node to start printing from.

 *

#### Returns

`void`

#### Remarks

Time O(N) (via `toVisual`). Space O(N*H) or O(N^2) (via `toVisual`).

#### Example

```ts
const bst = new BST<number>([5, 3, 7]);
    // print() outputs to console, returns void
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`print`](BinaryTree.md#print)

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
const bst = new BST<number>([10, 20, 30, 40, 50]);
console.log(bst.rangeSearch([15, 35])); // [20, 30]
```

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
const bst = new BST<number>([10, 20, 30, 40, 50]);
console.log(bst.rangeSearch([15, 35])); // [20, 30]
```

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
const bst = new BST<number, number>([[1, 10], [2, 20], [3, 30]]);
    const sum = bst.reduce((acc, value) => acc + (value ?? 0), 0);
console.log(sum); // 60
```

#### Implementation of

```ts
IBinaryTree.reduce
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`reduce`](BinaryTree.md#reduce)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`refill`](BinaryTree.md#refill)

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
const bst = new BST<number, string>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]);
    const found = bst.search(node => node.key > 2, true);
console.log(found.length); // >= 1
```

##### Implementation of

```ts
IBinaryTree.search
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`search`](BinaryTree.md#search)

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
const bst = new BST<number, string>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]);
    const found = bst.search(node => node.key > 2, true);
console.log(found.length); // >= 1
```

##### Implementation of

```ts
IBinaryTree.search
```

##### Overrides

[`BinaryTree`](BinaryTree.md).[`search`](BinaryTree.md#search)

***

### set()

```ts
set(keyNodeOrEntry, value?): boolean;
```

Defined in: [data-structures/binary-tree/bst.ts:1133](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/bst.ts#L1133)

Adds a new node to the BST based on key comparison.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`BSTNode`](BSTNode.md)\<`K`, `V`\>
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

Time O(log N), where H is tree height. O(N) worst-case (unbalanced tree), O(log N) average. Space O(1).

#### Example

```ts
const bst = new BST<number, string>();
    bst.set(1, 'one');
    bst.set(2, 'two');
console.log(bst.get(1)); // 'one'
```

#### Implementation of

```ts
IBinaryTree.set
```

#### Overrides

[`BinaryTree`](BinaryTree.md).[`set`](BinaryTree.md#set)

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
const bst = new BST<number, string>();
    bst.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
console.log(bst.size); // 3
console.log(bst.get(2)); // 'b'
```

#### Overrides

[`BinaryTree`](BinaryTree.md).[`setMany`](BinaryTree.md#setmany)

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
const bst = new BST<number>([5, 3, 7]);
console.log(bst.some((v, key) => key === 7)); // true
```

#### Implementation of

```ts
IBinaryTree.some
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`some`](BinaryTree.md#some)

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
const bst = new BST<number>([30, 10, 20]);
console.log(bst.toArray().map(([k]) => k)); // [10, 20, 30]
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`toArray`](BinaryTree.md#toarray)

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
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

[`BinaryTree`](BinaryTree.md).[`toVisual`](BinaryTree.md#tovisual)

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
const bst = new BST<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
console.log([...bst.values()]); // ['a', 'b', 'c']
```

#### Implementation of

```ts
IBinaryTree.values
```

#### Inherited from

[`BinaryTree`](BinaryTree.md).[`values`](BinaryTree.md#values)
