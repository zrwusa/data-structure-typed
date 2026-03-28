[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / BinaryTree

# Class: BinaryTree\<K, V, R\>

Defined in: [data-structures/binary-tree/binary-tree.ts:270](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L270)

A general Binary Tree implementation.

## Remarks

This class implements a basic Binary Tree, not a Binary Search Tree.
The `set` operation inserts nodes level-by-level (BFS) into the first available slot.

## Examples

```ts
// determine loan approval using a decision tree
 // Decision tree structure
    const loanDecisionTree = new BinaryTree<string>(
      ['stableIncome', 'goodCredit', 'Rejected', 'Approved', 'Rejected'],
      { isDuplicate: true }
    );

    function determineLoanApproval(
      node?: BinaryTreeNode<string> | null,
      conditions?: { [key: string]: boolean }
    ): string {
      if (!node) throw new Error('Invalid node');

      // If it's a leaf node, return the decision result
      if (!node.left && !node.right) return node.key;

      // Check if a valid condition exists for the current node's key
      return conditions?.[node.key]
        ? determineLoanApproval(node.left, conditions)
        : determineLoanApproval(node.right, conditions);
    }

    // Test case 1: Stable income and good credit score
    console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: true, goodCredit: true })); // 'Approved';

    // Test case 2: Stable income but poor credit score
    console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: true, goodCredit: false })); // 'Rejected';

    // Test case 3: No stable income
    console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: false, goodCredit: true })); // 'Rejected';

    // Test case 4: No stable income and poor credit score
    console.log(determineLoanApproval(loanDecisionTree.root, { stableIncome: false, goodCredit: false })); // 'Rejected';
```

```ts
// evaluate the arithmetic expression represented by the binary tree
 const expressionTree = new BinaryTree<number | string>(['+', 3, '*', null, null, 5, '-', null, null, 2, 8]);

    function evaluate(node?: BinaryTreeNode<number | string> | null): number {
      if (!node) return 0;

      if (typeof node.key === 'number') return node.key;

      const leftValue = evaluate(node.left); // Evaluate the left subtree
      const rightValue = evaluate(node.right); // Evaluate the right subtree

      // Perform the operation based on the current node's operator
      switch (node.key) {
        case '+':
          return leftValue + rightValue;
        case '-':
          return leftValue - rightValue;
        case '*':
          return leftValue * rightValue;
        case '/':
          return rightValue !== 0 ? leftValue / rightValue : 0; // Handle division by zero
        default:
          throw new Error(`Unsupported operator: ${node.key}`);
      }
    }

    console.log(evaluate(expressionTree.root)); // -27;
```

## Extends

- [`IterableEntryBase`](IterableEntryBase.md)\<`K`, `V` \| `undefined`\>

## Extended by

- [`BST`](BST.md)

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
1. Two Children Maximum: Each node has at most two children.
2. Left and Right Children: Nodes have distinct left and right children.
3. Depth and Height: Depth is the number of edges from the root to a node; height is the maximum depth in the tree.
4. Subtrees: Each child of a node forms the root of a subtree.
5. Leaf Nodes: Nodes without children are leaves.

## Implements

- `IBinaryTree`\<`K`, `V`, `R`\>

## Constructors

### Constructor

```ts
new BinaryTree<K, V, R>(keysNodesEntriesOrRaws?, options?): BinaryTree<K, V, R>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:283](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L283)

Creates an instance of BinaryTree.

#### Parameters

##### keysNodesEntriesOrRaws?

`Iterable`\<
  \| `K`
  \| `R`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`\> = `[]`

An iterable of items to set.

##### options?

`BinaryTreeOptions`\<`K`, `V`, `R`\>

Configuration options for the tree.

#### Returns

`BinaryTree`\<`K`, `V`, `R`\>

#### Remarks

Time O(N * M), where N is the number of items in `keysNodesEntriesOrRaws` and M is the tree size at insertion time (due to O(M) `set` operation). Space O(N) for storing the nodes.

#### Overrides

```ts
IterableEntryBase<K, V | undefined>.constructor
```

## Properties

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

## Accessors

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

***

### root

#### Get Signature

```ts
get root(): BinaryTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:349](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L349)

Gets the root node of the tree.

##### Remarks

Time O(1)

##### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

The root node.

#### Implementation of

```ts
IBinaryTree.root
```

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

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`size`](IterableEntryBase.md#size)

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

## Methods

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

***

### \_clone()

```ts
protected _clone(cloned): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2909](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2909)

(Protected) Helper for cloning. Performs a BFS and sets all nodes to the new tree.

#### Parameters

##### cloned

`BinaryTree`\<`K`, `V`, `R`\>

The new, empty tree instance to populate.

#### Returns

`void`

#### Remarks

Time O(N * M) (O(N) BFS + O(M) `set` for each node).

***

### \_createInstance()

```ts
protected _createInstance<TK, TV, TR>(options?): this;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2843](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2843)

(Protected) Creates a new, empty instance of the same tree constructor.

#### Type Parameters

##### TK

`TK` = `K`

##### TV

`TV` = `V`

##### TR

`TR` = `R`

#### Parameters

##### options?

`Partial`\<`BinaryTreeOptions`\<`TK`, `TV`, `TR`\>\>

Options for the new tree.

#### Returns

`this`

A new, empty tree.

#### Remarks

Time O(1)

***

### \_createLike()

```ts
protected _createLike<TK, TV, TR>(iter?, options?): BinaryTree<TK, TV, TR>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2860](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2860)

(Protected) Creates a new instance of the same tree constructor, potentially with different generic types.

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
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`TK`, `TV`\>
  \| \[`TK` \| `null` \| `undefined`, `TV` \| `undefined`\]
  \| `null`
  \| `undefined`\> = `[]`

An iterable to populate the new tree.

##### options?

`Partial`\<`BinaryTreeOptions`\<`TK`, `TV`, `TR`\>\>

Options for the new tree.

#### Returns

`BinaryTree`\<`TK`, `TV`, `TR`\>

A new tree.

#### Remarks

Time O(N) (or as per constructor) due to processing the iterable.

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

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`_getIterator`](IterableEntryBase.md#getiterator)

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

***

### \_keyValueNodeOrEntryToNodeAndValue()

```ts
protected _keyValueNodeOrEntryToNodeAndValue(keyNodeOrEntry, value?): [BinaryTreeNode<K, V> | null | undefined, V | undefined];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2883](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2883)

(Protected) Converts a key, node, or entry into a standardized [node, value] tuple.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The input item.

##### value?

`V`

An optional value (used if input is just a key).

#### Returns

\[[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`, `V` \| `undefined`\]

A tuple of [node, value].

#### Remarks

Time O(1)

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

***

### \_setRoot()

```ts
protected _setRoot(v): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:3142](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L3142)

(Protected) Sets the root node and clears its parent reference.

#### Parameters

##### v

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

The node to set as root.

#### Returns

`void`

#### Remarks

Time O(1)

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

***

### \_snapshotOptions()

```ts
protected _snapshotOptions<TK, TV, TR>(): BinaryTreeOptions<TK, TV, TR>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2826](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2826)

(Protected) Snapshots the current tree's configuration options.

#### Type Parameters

##### TK

`TK` = `K`

##### TV

`TV` = `V`

##### TR

`TR` = `R`

#### Returns

`BinaryTreeOptions`\<`TK`, `TV`, `TR`\>

The options object.

#### Remarks

Time O(1)

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

[`IterableEntryBase`](IterableEntryBase.md).[`[iterator]`](IterableEntryBase.md#iterator)

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
const tree = new BinaryTree<number>();
    tree.add(1);
    tree.add(2);
    tree.add(3);
console.log(tree.size); // 3
console.log(tree.has(1)); // true
```

#### Implementation of

```ts
IBinaryTree.add
```

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
const tree = new BinaryTree<number>();
    tree.addMany([1, 2, 3, 4, 5]);
console.log(tree.size); // 5
```

#### Implementation of

```ts
IBinaryTree.addMany
```

***

### bfs()

Performs a Breadth-First Search (BFS) or Level-Order traversal.

#### Remarks

Time O(N), visits every node. Space O(N) in the worst case for the queue (e.g., a full last level).

#### Template

The type of the callback function.

#### Param

Function to call on each node.

#### Param

The node to start from.

#### Param

The traversal method ('RECURSIVE' BFS is less common but supported here).

#### Param

If true, includes null nodes in the traversal.

#### Call Signature

```ts
bfs(): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1993](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1993)

BinaryTree level-order traversal

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const tree = new BinaryTree([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
      [4, 'four'],
      [5, 'five'],
      [6, 'six'],
      [7, 'seven']
    ]);

    // Binary tree maintains level-order insertion
    // Complete binary tree structure
console.log(tree.size); // 7

    // Verify all keys are present
console.log(tree.has(1)); // true
console.log(tree.has(4)); // true
console.log(tree.has(7)); // true

    // Iterate through tree
    const keys: number[] = [];
    for (const [key] of tree) {
      keys.push(key);
    }
console.log(keys.length); // 7
```

##### Implementation of

```ts
IBinaryTree.bfs
```

#### Call Signature

```ts
bfs<C>(
   callback?, 
   startNode?, 
   iterationType?, 
   includeNull?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1995](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1995)

BinaryTree level-order traversal

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback?

`C`

###### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

###### includeNull?

`false`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const tree = new BinaryTree([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
      [4, 'four'],
      [5, 'five'],
      [6, 'six'],
      [7, 'seven']
    ]);

    // Binary tree maintains level-order insertion
    // Complete binary tree structure
console.log(tree.size); // 7

    // Verify all keys are present
console.log(tree.has(1)); // true
console.log(tree.has(4)); // true
console.log(tree.has(7)); // true

    // Iterate through tree
    const keys: number[] = [];
    for (const [key] of tree) {
      keys.push(key);
    }
console.log(keys.length); // 7
```

##### Implementation of

```ts
IBinaryTree.bfs
```

#### Call Signature

```ts
bfs<C>(
   callback?, 
   startNode?, 
   iterationType?, 
   includeNull?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2002](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2002)

BinaryTree level-order traversal

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>

##### Parameters

###### callback?

`C`

###### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

###### includeNull?

`true`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const tree = new BinaryTree([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
      [4, 'four'],
      [5, 'five'],
      [6, 'six'],
      [7, 'seven']
    ]);

    // Binary tree maintains level-order insertion
    // Complete binary tree structure
console.log(tree.size); // 7

    // Verify all keys are present
console.log(tree.has(1)); // true
console.log(tree.has(4)); // true
console.log(tree.has(7)); // true

    // Iterate through tree
    const keys: number[] = [];
    for (const [key] of tree) {
      keys.push(key);
    }
console.log(keys.length); // 7
```

##### Implementation of

```ts
IBinaryTree.bfs
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
const tree = new BinaryTree<number>([1, 2, 3]);
    tree.clear();
console.log(tree.isEmpty()); // true
```

#### Implementation of

```ts
IBinaryTree.clear
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`clear`](IterableEntryBase.md#clear)

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
const tree = new BinaryTree<number>([1, 2, 3]);
    const copy = tree.clone();
    copy.delete(1);
console.log(tree.has(1)); // true
```

#### Implementation of

```ts
IBinaryTree.clone
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`clone`](IterableEntryBase.md#clone)

***

### createNode()

```ts
createNode(key, value?): BinaryTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:397](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L397)

(Protected) Creates a new node.

#### Parameters

##### key

`K`

The key for the new node.

##### value?

`V`

The value for the new node (used if not in Map mode).

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>

The newly created node.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IBinaryTree.createNode
```

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

***

### delete()

```ts
delete(keyNodeEntryRawOrPredicate): BinaryTreeDeleteResult<BinaryTreeNode<K, V>>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:905](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L905)

Deletes a node from the tree.

#### Parameters

##### keyNodeEntryRawOrPredicate

  \| `BTNRep`\<`K`, `V`, [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>

The node to delete.

#### Returns

`BinaryTreeDeleteResult`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>[]

An array containing deletion results (for compatibility with self-balancing trees).

 *

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). This implementation finds the node, and if it has two children, swaps it with the rightmost node of its left subtree (in-order predecessor) before deleting. Time O(N) in the worst case. O(N) to find the node (`getNode`) and O(H) (which is O(N) worst-case) to find the rightmost node. Space O(1) (if `getNode` is iterative, which it is).

#### Example

```ts
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    tree.delete(3);
console.log(tree.has(3)); // false
console.log(tree.size); // 4
```

#### Implementation of

```ts
IBinaryTree.delete
```

***

### dfs()

Performs a Depth-First Search (DFS) traversal.

#### Remarks

Time O(N), visits every node. Space O(H) for the call/explicit stack. O(N) worst-case.

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

#### Param

If true, includes null nodes in the traversal.

#### Call Signature

```ts
dfs(): (K | undefined)[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1894](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1894)

Depth-first search traversal

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const inOrder = tree.dfs(node => node.key, 'IN');
console.log(inOrder); // [4, 2, 5, 1, 3]
```

##### Implementation of

```ts
IBinaryTree.dfs
```

#### Call Signature

```ts
dfs<C>(
   callback?, 
   pattern?, 
   onlyOne?, 
   startNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1896](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1896)

Depth-first search traversal

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback?

`C`

###### pattern?

`DFSOrderPattern`

###### onlyOne?

`boolean`

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
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const inOrder = tree.dfs(node => node.key, 'IN');
console.log(inOrder); // [4, 2, 5, 1, 3]
```

##### Implementation of

```ts
IBinaryTree.dfs
```

#### Call Signature

```ts
dfs<C>(
   callback?, 
   pattern?, 
   onlyOne?, 
   startNode?, 
   iterationType?, 
   includeNull?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1904](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1904)

Depth-first search traversal

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>

##### Parameters

###### callback?

`C`

###### pattern?

`DFSOrderPattern`

###### onlyOne?

`boolean`

###### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

###### includeNull?

`boolean`

##### Returns

`ReturnType`\<`C`\>[]

##### Example

```ts
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const inOrder = tree.dfs(node => node.key, 'IN');
console.log(inOrder); // [4, 2, 5, 1, 3]
```

##### Implementation of

```ts
IBinaryTree.dfs
```

***

### ensureNode()

```ts
ensureNode(keyNodeOrEntry, iterationType?): BinaryTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:420](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L420)

Ensures the input is a node. If it's a key or entry, it searches for the node.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The item to resolve to a node.

##### iterationType?

`IterationType` = `...`

The traversal method to use if searching.

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

The resolved node, or null/undefined if not found or input is null/undefined.

#### Remarks

Time O(1) if a node is passed. O(N) if a key or entry is passed (due to `getNode` performing a full search). Space O(1) if iterative search, O(H) if recursive (where H is height, O(N) worst-case).

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
const tree = new BinaryTree<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
console.log([...tree.entries()].length); // 3
```

#### Implementation of

```ts
IBinaryTree.entries
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`entries`](IterableEntryBase.md#entries)

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
const tree = new BinaryTree<number>([1, 2, 3]);
console.log(tree.every((v, key) => key > 0)); // true
```

#### Implementation of

```ts
IBinaryTree.every
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`every`](IterableEntryBase.md#every)

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
const tree = new BinaryTree<number>([1, 2, 3, 4]);
    const result = tree.filter((_, key) => key > 2);
console.log(result.size); // 2
```

#### Implementation of

```ts
IBinaryTree.filter
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`filter`](IterableEntryBase.md#filter)

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
const tree = new BinaryTree<number, string>([[1, 'a'], [2, 'b']]);
    const found = tree.find(v => v === 'b');
console.log(found?.[0]); // 2
console.log(found?.[1]); // 'b'
```

#### Implementation of

```ts
IBinaryTree.find
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`find`](IterableEntryBase.md#find)

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
const tree = new BinaryTree<number>([1, 2, 3]);
    let count = 0;
    tree.forEach(() => count++);
console.log(count); // 3
```

#### Implementation of

```ts
IBinaryTree.forEach
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`forEach`](IterableEntryBase.md#foreach)

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
const tree = new BinaryTree<number, string>([[1, 'root'], [2, 'left'], [3, 'right']]);
console.log(tree.get(2)); // 'left'
```

#### Implementation of

```ts
IBinaryTree.get
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`get`](IterableEntryBase.md#get)

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

#### Example

```ts
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const node = tree.getNode(4);
console.log(tree.getDepth(node!)); // 2
```

#### Implementation of

```ts
IBinaryTree.getDepth
```

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
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
console.log(tree.getHeight()); // 2
```

#### Implementation of

```ts
IBinaryTree.getHeight
```

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

***

### getNode()

```ts
getNode(
   keyNodeEntryOrPredicate, 
   startNode?, 
   iterationType?): BinaryTreeNode<K, V> | null | undefined;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1180](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1180)

Gets the first node matching a predicate.

#### Parameters

##### keyNodeEntryOrPredicate

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>
  \| `null`
  \| `undefined`

The key, node, entry, or predicate function to search for.

##### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

The node to start the search from.

##### iterationType?

`IterationType` = `...`

The traversal method.

#### Returns

[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null` \| `undefined`

The first matching node, or undefined if not found.

 *

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Time O(N) in the worst case (via `search`). Space O(H) or O(N) (via `search`).

#### Example

```ts
const tree = new BinaryTree<number, string>([[1, 'root'], [2, 'child']]);
console.log(tree.getNode(2)?.value); // 'child'
```

#### Implementation of

```ts
IBinaryTree.getNode
```

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
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const nodes = tree.getNodes(node => node.key > 3);
console.log(nodes.length); // 2
```

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
const tree = new BinaryTree(
      [
        [5, 'five'],
        [3, 'three'],
        [7, 'seven'],
        [1, 'one'],
        [4, 'four'],
        [6, 'six'],
        [8, 'eight']
      ],
      { isMapMode: false }
    );

    // Check if key exists
console.log(tree.has(5)); // true
console.log(tree.has(10)); // false

    // Get value by key
console.log(tree.get(3)); // 'three'
console.log(tree.get(7)); // 'seven'

    // Get node structure
    const node = tree.getNode(5);
console.log(node?.key); // 5
console.log(node?.value); // 'five'
```

#### Implementation of

```ts
IBinaryTree.has
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`has`](IterableEntryBase.md#has)

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

[`IterableEntryBase`](IterableEntryBase.md).[`hasValue`](IterableEntryBase.md#hasvalue)

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
const tree = new BinaryTree<number>([1, 2, 3]);
    // BinaryTree doesn't guarantee BST order
console.log(typeof tree.isBST()); // 'boolean'
```

#### Implementation of

```ts
IBinaryTree.isBST
```

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
console.log(new BinaryTree().isEmpty()); // true
```

#### Implementation of

```ts
IBinaryTree.isEmpty
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`isEmpty`](IterableEntryBase.md#isempty)

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

***

### isNode()

```ts
isNode(keyNodeOrEntry): keyNodeOrEntry is BinaryTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:447](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L447)

Checks if the given item is a `BinaryTreeNode` instance.

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

True if it's a node, false otherwise.

#### Remarks

Time O(1), Space O(1)

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

***

### isValidKey()

```ts
isValidKey(key): key is K;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:558](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L558)

Checks if the given key is valid (comparable or null).

#### Parameters

##### key

`any`

The key to validate.

#### Returns

`key is K`

True if the key is valid, false otherwise.

#### Remarks

Time O(1), Space O(1)

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
const tree = new BinaryTree<number>([1, 2, 3]);
console.log([...tree.keys()].sort()); // [1, 2, 3]
```

#### Implementation of

```ts
IBinaryTree.keys
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`keys`](IterableEntryBase.md#keys)

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
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const leafKeys = tree.leaves(node => node.key);
console.log(leafKeys.length); // > 0
```

##### Implementation of

```ts
IBinaryTree.leaves
```

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
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const leafKeys = tree.leaves(node => node.key);
console.log(leafKeys.length); // > 0
```

##### Implementation of

```ts
IBinaryTree.leaves
```

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

#### Param

If true, includes null nodes.

#### Call Signature

```ts
listLevels(): (K | undefined)[][];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2197](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2197)

Level-order grouping

 *

##### Returns

(`K` \| `undefined`)[][]

##### Example

```ts
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const levels = tree.listLevels(node => node.key);
console.log(levels[0]); // [1]
console.log(levels[1].sort()); // [2, 3]
```

##### Implementation of

```ts
IBinaryTree.listLevels
```

#### Call Signature

```ts
listLevels<C>(
   callback?, 
   startNode?, 
   iterationType?, 
   includeNull?): ReturnType<C>[][];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2199](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2199)

Level-order grouping

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>\>

##### Parameters

###### callback?

`C`

###### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

###### includeNull?

`false`

##### Returns

`ReturnType`\<`C`\>[][]

##### Example

```ts
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const levels = tree.listLevels(node => node.key);
console.log(levels[0]); // [1]
console.log(levels[1].sort()); // [2, 3]
```

##### Implementation of

```ts
IBinaryTree.listLevels
```

#### Call Signature

```ts
listLevels<C>(
   callback?, 
   startNode?, 
   iterationType?, 
   includeNull?): ReturnType<C>[][];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2206](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2206)

Level-order grouping

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>

##### Parameters

###### callback?

`C`

###### startNode?

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`

###### iterationType?

`IterationType`

###### includeNull?

`true`

##### Returns

`ReturnType`\<`C`\>[][]

##### Example

```ts
const tree = new BinaryTree<number>([1, 2, 3, 4, 5]);
    const levels = tree.listLevels(node => node.key);
console.log(levels[0]); // [1]
console.log(levels[1].sort()); // [2, 3]
```

##### Implementation of

```ts
IBinaryTree.listLevels
```

***

### map()

```ts
map<MK, MV, MR>(
   cb, 
   options?, 
thisArg?): BinaryTree<MK, MV, MR>;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2542](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L2542)

Creates a new tree by mapping each [key, value] pair to a new entry.

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

##### cb

`EntryCallback`\<`K`, `V` \| `undefined`, \[`MK`, `MV`\]\>

A function to map each [key, value] pair.

##### options?

`Partial`\<`BinaryTreeOptions`\<`MK`, `MV`, `MR`\>\>

Options for the new tree.

##### thisArg?

`unknown`

`this` context for the callback.

#### Returns

`BinaryTree`\<`MK`, `MV`, `MR`\>

A new, mapped tree.

 *

#### Remarks

Time O(N * M), where N is nodes in this tree, and M is size of the new tree during insertion. Space O(N) for the new tree.

#### Example

```ts
const tree = new BinaryTree<number, number>([[1, 10], [2, 20]]);
    const mapped = tree.map((v, key) => [key, (v ?? 0) + 1] as [number, number]);
```

#### Implementation of

```ts
IBinaryTree.map
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`map`](IterableEntryBase.md#map)

***

### merge()

```ts
merge(anotherTree): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:847](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L847)

Merges another tree into this one by seting all its nodes.

#### Parameters

##### anotherTree

`BinaryTree`\<`K`, `V`, `R`\>

The tree to merge.

 *

#### Returns

`void`

#### Remarks

Time O(N * M), same as `setMany`, where N is the size of `anotherTree` and M is the size of this tree. Space O(M) (from `set`).

#### Example

```ts
const t1 = new BinaryTree<number>([1, 2]);
    const t2 = new BinaryTree<number>([3, 4]);
    t1.merge(t2);
console.log(t1.size); // 4
```

#### Implementation of

```ts
IBinaryTree.merge
```

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
const tree = new BinaryTree<number>([1, 2, 3]);
    const result = tree.morris(node => node.key, 'IN');
console.log(result.length); // 3
```

##### Implementation of

```ts
IBinaryTree.morris
```

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
const tree = new BinaryTree<number>([1, 2, 3]);
    const result = tree.morris(node => node.key, 'IN');
console.log(result.length); // 3
```

##### Implementation of

```ts
IBinaryTree.morris
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
const tree = new BinaryTree<number>([1, 2, 3]);
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`print`](IterableEntryBase.md#print)

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
const tree = new BinaryTree<number, number>([[1, 10], [2, 20], [3, 30]]);
    const sum = tree.reduce((acc, v) => acc + (v ?? 0), 0);
console.log(sum); // 60
```

#### Implementation of

```ts
IBinaryTree.reduce
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`reduce`](IterableEntryBase.md#reduce)

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

***

### search()

Searches the tree for nodes matching a predicate.

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). Performs a full DFS (pre-order) scan of the tree. Time O(N), as it may visit every node. Space O(H) for the call stack (recursive) or explicit stack (iterative), where H is the tree height (O(N) worst-case).

#### Template

The type of the callback function.

#### Param

The key, node, entry, or predicate function to search for.

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

Defined in: [data-structures/binary-tree/binary-tree.ts:992](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L992)

Search by predicate

 *

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>
  \| `null`
  \| `undefined`

###### onlyOne?

`boolean`

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const tree = new BinaryTree<number>([5, 3, 7, 1, 9]);
    const found = tree.search(n => n!.key > 5, true);
console.log(found.length); // >= 1
```

##### Implementation of

```ts
IBinaryTree.search
```

#### Call Signature

```ts
search<C>(
   keyNodeEntryOrPredicate, 
   onlyOne, 
   callback, 
   startNode?, 
   iterationType?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1003](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L1003)

Search by predicate

 *

##### Type Parameters

###### C

`C` *extends* `NodeCallback`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>

##### Parameters

###### keyNodeEntryOrPredicate

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `NodePredicate`\<[`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\> \| `null`\>
  \| `null`
  \| `undefined`

###### onlyOne

`boolean`

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
const tree = new BinaryTree<number>([5, 3, 7, 1, 9]);
    const found = tree.search(n => n!.key > 5, true);
console.log(found.length); // >= 1
```

##### Implementation of

```ts
IBinaryTree.search
```

***

### set()

```ts
set(keyNodeOrEntry, value?): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:658](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L658)

Adds or updates a new node to the tree.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

The key, node, or entry to set or update.

##### value?

`V`

The value, if providing just a key.

#### Returns

`boolean`

True if the addition was successful, false otherwise.

 *

#### Remarks

Time O(log N), For BST, Red-Black Tree, and AVL Tree subclasses, the worst-case time is O(log N). This implementation sets the node at the first available position in a level-order (BFS) traversal. This is NOT a Binary Search Tree insertion. Time O(N), where N is the number of nodes. It must traverse level-by-level to find an empty slot. Space O(N) in the worst case for the BFS queue (e.g., a full last level).

#### Example

```ts
// Create a BinaryTree with entries
    const entries: [number, string][] = [
      [6, 'six'],
      [1, 'one'],
      [2, 'two'],
      [7, 'seven'],
      [5, 'five'],
      [3, 'three'],
      [4, 'four'],
      [9, 'nine'],
      [8, 'eight']
    ];

    const tree = new BinaryTree(entries);

    // Verify size
console.log(tree.size); // 9

    // Add new element
    tree.set(10, 'ten');
console.log(tree.size); // 10
```

#### Implementation of

```ts
IBinaryTree.set
```

***

### setMany()

```ts
setMany(keysNodesEntriesOrRaws, values?): boolean[];
```

Defined in: [data-structures/binary-tree/binary-tree.ts:784](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/binary-tree.ts#L784)

Adds or updates multiple items to the tree.

#### Parameters

##### keysNodesEntriesOrRaws

`Iterable`\<
  \| `K`
  \| `R`
  \| [`BinaryTreeNode`](BinaryTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`\>

An iterable of items to set or update.

##### values?

`Iterable`\<`V` \| `undefined`, `any`, `any`\>

An optional parallel iterable of values.

#### Returns

`boolean`[]

An array of booleans indicating the success of each individual `set` operation.

 *

#### Remarks

Time O(N * M), where N is the number of items to set and M is the size of the tree at insertion (due to O(M) `set` operation). Space O(M) (from `set`) + O(N) (for the `inserted` array).

#### Example

```ts
const tree = new BinaryTree<number, string>();
    tree.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
console.log(tree.size); // 3
```

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
const tree = new BinaryTree<number>([1, 2, 3]);
console.log(tree.some((v, key) => key === 2)); // true
```

#### Implementation of

```ts
IBinaryTree.some
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`some`](IterableEntryBase.md#some)

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
const tree = new BinaryTree<number>([1, 2, 3]);
console.log(tree.toArray().length); // 3
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`toArray`](IterableEntryBase.md#toarray)

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

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`toVisual`](IterableEntryBase.md#tovisual)

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
const tree = new BinaryTree<number, string>([[1, 'a'], [2, 'b']]);
```

#### Implementation of

```ts
IBinaryTree.values
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`values`](IterableEntryBase.md#values)
