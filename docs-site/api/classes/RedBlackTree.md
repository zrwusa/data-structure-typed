[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / RedBlackTree

# Class: RedBlackTree\<K, V, R\>

Defined in: [data-structures/binary-tree/red-black-tree.ts:254](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L254)

Represents a Red-Black Tree (self-balancing BST) supporting map-like mode and stable O(log n) updates.

## Remarks

Operation complexity depends on the method; see each method's docs.

## Examples

```ts
// Red-Black Tree with key-value pairs for lookups
 interface Employee {
      id: number;
      name: string;
    }

    // Create tree with employee data
    const employees = new RedBlackTree<number, Employee>([
      [1, { id: 1, name: 'Alice' }],
      [3, { id: 3, name: 'Charlie' }],
      [2, { id: 2, name: 'Bob' }]
    ]);

    // Retrieve employee by ID
    const alice = employees.get(1);
    console.log(alice?.name); // 'Alice';

    // Verify sorted order by ID
    console.log([...employees.keys()]); // [1, 2, 3];
```

```ts
// Red-Black Tree range search for filtering
 interface Product {
      name: string;
      price: number;
    }

    const products = new RedBlackTree<number, Product>([
      [10, { name: 'Item A', price: 10 }],
      [25, { name: 'Item B', price: 25 }],
      [40, { name: 'Item C', price: 40 }],
      [50, { name: 'Item D', price: 50 }]
    ]);

    // Find products in price range [20, 45]
    const pricesInRange = products.rangeSearch([20, 45], node => {
      return products.get(node)?.name;
    });

    console.log(pricesInRange); // ['Item B', 'Item C'];
```

```ts
// Red-Black Tree as database index for stock market data
 interface StockPrice {
      symbol: string;
      volume: number;
      timestamp: Date;
    }

    // Simulate real-time stock price index
    const priceIndex = new RedBlackTree<number, StockPrice>([
      [142.5, { symbol: 'AAPL', volume: 1000000, timestamp: new Date() }],
      [335.2, { symbol: 'MSFT', volume: 800000, timestamp: new Date() }],
      [3285.04, { symbol: 'AMZN', volume: 500000, timestamp: new Date() }],
      [267.98, { symbol: 'META', volume: 750000, timestamp: new Date() }],
      [234.57, { symbol: 'GOOGL', volume: 900000, timestamp: new Date() }]
    ]);

    // Find highest-priced stock
    const maxPrice = priceIndex.getRightMost();
    console.log(priceIndex.get(maxPrice)?.symbol); // 'AMZN';

    // Find stocks in price range [200, 400] for portfolio balancing
    const stocksInRange = priceIndex.rangeSearch([200, 400], node => {
      const stock = priceIndex.get(node);
      return {
        symbol: stock?.symbol,
        price: node,
        volume: stock?.volume
      };
    });

    console.log(stocksInRange.length); // 3;
    console.log(stocksInRange.some((s: any) => s.symbol === 'GOOGL')); // true;
    console.log(stocksInRange.some((s: any) => s.symbol === 'META')); // true;
    console.log(stocksInRange.some((s: any) => s.symbol === 'MSFT')); // true;
```

## Extends

- [`BST`](BST.md)\<`K`, `V`, `R`\>

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

### R

`R` = `any`

1. Efficient self-balancing, but not completely balanced. Compared with AVLTree, the addition and deletion efficiency is high, but the query efficiency is slightly lower.
2. It is BST itself. Compared with Heap which is not completely ordered, RedBlackTree is completely ordered.

## Implements

- `IBinaryTree`\<`K`, `V`, `R`\>

## Accessors

### comparator

#### Get Signature

```ts
get comparator(): Comparator<K>;
```

Defined in: [data-structures/binary-tree/bst.ts:380](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L380)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:322](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L322)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:310](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L310)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:373](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L373)

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
get root(): RedBlackTreeNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:305](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L305)

Get the current root node.

##### Remarks

Time O(1), Space O(1)

##### Returns

[`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\> \| `undefined`

Root node, or undefined.

#### Implementation of

```ts
IBinaryTree.root
```

#### Overrides

[`BST`](BST.md).[`root`](BST.md#root)

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:361](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L361)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:337](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L337)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:385](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L385)

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

### \[iterator\]()

```ts
iterator: IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L22)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:600](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L600)

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
const rbt = new RedBlackTree<number>();
    rbt.add(10);
    rbt.add(5);
    rbt.add(15);
console.log(rbt.size); // 3
console.log(rbt.has(10)); // true
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

Defined in: [data-structures/binary-tree/binary-tree.ts:757](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L757)

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
const rbt = new RedBlackTree<number>();
    rbt.addMany([5, 3, 7, 1, 9]);
console.log(rbt.size); // 5
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

Defined in: [data-structures/binary-tree/bst.ts:583](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L583)

BinaryTree level-order traversal

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const rbt = new RedBlackTree<number>([5, 3, 7]);
    const levelOrder = rbt.bfs(node => node.key);
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

Defined in: [data-structures/binary-tree/bst.ts:584](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L584)

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
const rbt = new RedBlackTree<number>([5, 3, 7]);
    const levelOrder = rbt.bfs(node => node.key);
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

Defined in: [data-structures/binary-tree/bst.ts:1412](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1412)

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
const rbt = new RedBlackTree<number>([10, 20, 30, 40]);
console.log(rbt.ceiling(25)); // 30
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

Defined in: [data-structures/binary-tree/bst.ts:1427](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1427)

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
const rbt = new RedBlackTree<number>([10, 20, 30, 40]);
console.log(rbt.ceiling(25)); // 30
```

##### Inherited from

[`BST`](BST.md).[`ceiling`](BST.md#ceiling)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:448](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L448)

Remove all nodes and clear internal caches.

#### Returns

`void`

#### Remarks

Time O(n) average, Space O(1)

 *

#### Example

```ts
const rbt = new RedBlackTree<number>([1, 2, 3]);
    rbt.clear();
console.log(rbt.isEmpty()); // true
```

#### Implementation of

```ts
IBinaryTree.clear
```

#### Overrides

[`BST`](BST.md).[`clear`](BST.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2521](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2521)

Clones the tree.

#### Returns

`this`

A new, cloned instance of the tree.

 *

#### Remarks

Time O(N * M), where N is the number of nodes and M is the tree size during insertion (due to `bfs` + `set`, and `set` is O(M)). Space O(N) for the new tree and the BFS queue.

#### Example

```ts
const rbt = new RedBlackTree<number>([5, 3, 7]);
    const copy = rbt.clone();
    copy.delete(3);
console.log(rbt.has(3)); // true
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
createNode(
   key, 
   value?, 
color?): RedBlackTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:317](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L317)

Create a red-black node for the given key/value (value ignored in map mode).

#### Parameters

##### key

`K`

See parameter type for details.

##### value?

`V`

See parameter type for details.

##### color?

`RBTNColor` = `'BLACK'`

See parameter type for details.

#### Returns

[`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\>

A new RedBlackTreeNode instance.

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

Defined in: [data-structures/binary-tree/binary-tree.ts:408](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L408)

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
delete(keyNodeEntryRawOrPredicate): BinaryTreeDeleteResult<RedBlackTreeNode<K, V>>[];
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:1127](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L1127)

Delete a node by key/node/entry and rebalance as needed.

#### Parameters

##### keyNodeEntryRawOrPredicate

  \| `BTNRep`\<`K`, `V`, [`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\>\>
  \| `NodePredicate`\<[`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\> \| `null`\>

Key, node, or [key, value] entry identifying the node to delete.

#### Returns

`BinaryTreeDeleteResult`\<[`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\>\>[]

Array with deletion metadata (removed node, rebalancing hint if any).

 *

#### Remarks

Time O(log n) average, Space O(1)

#### Example

```ts
const rbt = new RedBlackTree<number>([10, 5, 15, 3, 7]);
    rbt.delete(5);
console.log(rbt.has(5)); // false
console.log(rbt.size); // 4
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

Defined in: [data-structures/binary-tree/bst.ts:2171](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L2171)

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

Defined in: [data-structures/binary-tree/bst.ts:497](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L497)

Depth-first search traversal

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    const inOrder = rbt.dfs(node => node.key, 'IN');
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

Defined in: [data-structures/binary-tree/bst.ts:499](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L499)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    const inOrder = rbt.dfs(node => node.key, 'IN');
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

Defined in: [data-structures/binary-tree/bst.ts:404](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L404)

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

Defined in: [data-structures/base/iterable-entry-base.ts:31](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L31)

Iterate over `[key, value]` pairs (may yield `undefined` values).

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

Iterator of `[K, V | undefined]`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const rbt = new RedBlackTree<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
console.log([...rbt.entries()]); // [[1, 'a'], [2, 'b'], [3, 'c']]
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

Defined in: [data-structures/base/iterable-entry-base.ts:66](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L66)

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
const rbt = new RedBlackTree<number>([2, 4, 6]);
console.log(rbt.every((v, k) => k > 0)); // true
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

Defined in: [data-structures/binary-tree/binary-tree.ts:2565](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2565)

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
const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5]);
    const evens = rbt.filter((v, k) => k % 2 === 0);
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

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L114)

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
const rbt = new RedBlackTree<number, string>([[1, 'a'], [2, 'b']]);
    const found = rbt.find(v => v === 'b');
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

Defined in: [data-structures/binary-tree/bst.ts:1607](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1607)

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
const rbt = new RedBlackTree<number>([10, 20, 30, 40]);
console.log(rbt.floor(25)); // 20
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

Defined in: [data-structures/binary-tree/bst.ts:1622](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1622)

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
const rbt = new RedBlackTree<number>([10, 20, 30, 40]);
console.log(rbt.floor(25)); // 20
```

##### Inherited from

[`BST`](BST.md).[`floor`](BST.md#floor)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L99)

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
const rbt = new RedBlackTree<number>([3, 1, 2]);
    const keys: number[] = [];
    rbt.forEach((v, k) => keys.push(k));
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

Defined in: [data-structures/binary-tree/binary-tree.ts:1269](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1269)

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
const rbt = new RedBlackTree<number, string>([[1, 'one'], [2, 'two']]);
console.log(rbt.get(1)); // 'one'
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

Defined in: [data-structures/binary-tree/binary-tree.ts:1590](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1590)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1646](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1646)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1]);
console.log(rbt.getHeight()); // >= 2
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

Defined in: [data-structures/binary-tree/binary-tree.ts:1773](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1773)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1775](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1775)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1688](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1688)

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

Defined in: [data-structures/binary-tree/bst.ts:760](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L760)

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
const rbt = new RedBlackTree<number, string>([[5, 'root'], [3, 'left']]);
console.log(rbt.getNode(3)?.value); // 'left'
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

Defined in: [data-structures/binary-tree/binary-tree.ts:1141](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1141)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 9]);
    const big = rbt.getNodes(n => n.key > 5);
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

Defined in: [data-structures/binary-tree/binary-tree.ts:1735](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1735)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1739](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1739)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1873](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1873)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1820](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1820)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1822](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1822)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1894](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1894)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:1346](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1346)

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
const rbt = new RedBlackTree<number>([5, 3, 7]);
console.log(rbt.has(3)); // true
console.log(rbt.has(99)); // false
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

Defined in: [data-structures/base/iterable-entry-base.ts:143](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L143)

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

Defined in: [data-structures/binary-tree/bst.ts:1509](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1509)

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
const rbt = new RedBlackTree<number>([10, 20, 30]);
console.log(rbt.higher(20)); // 30
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

Defined in: [data-structures/binary-tree/bst.ts:1524](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1524)

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
const rbt = new RedBlackTree<number>([10, 20, 30]);
console.log(rbt.higher(20)); // 30
```

##### Inherited from

[`BST`](BST.md).[`higher`](BST.md#higher)

***

### isAVLBalanced()

```ts
isAVLBalanced(iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/bst.ts:2008](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L2008)

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
const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5, 6, 7]);
    // RBT is balanced but not necessarily AVL-balanced
console.log(typeof rbt.isAVLBalanced()); // 'boolean'
```

#### Inherited from

[`BST`](BST.md).[`isAVLBalanced`](BST.md#isavlbalanced)

***

### isBST()

```ts
isBST(startNode?, iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1507](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1507)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
console.log(rbt.isBST()); // true
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

Defined in: [data-structures/binary-tree/binary-tree.ts:1452](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1452)

Checks if the tree is empty.

#### Returns

`boolean`

True if the tree has no nodes, false otherwise.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
console.log(new RedBlackTree().isEmpty()); // true
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

Defined in: [data-structures/binary-tree/binary-tree.ts:545](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L545)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:531](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L531)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:500](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L500)

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
isNode(keyNodeOrEntry): keyNodeOrEntry is RedBlackTreeNode<K, V>;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:328](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L328)

Type guard: check whether the input is a RedBlackTreeNode.

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

See parameter type for details.

#### Returns

`keyNodeOrEntry is RedBlackTreeNode<K, V>`

True if the value is a RedBlackTreeNode.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`BST`](BST.md).[`isNode`](BST.md#isnode)

***

### isPerfectlyBalanced()

```ts
isPerfectlyBalanced(startNode?): boolean;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:1463](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L1463)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:511](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L511)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:460](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L460)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:473](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L473)

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

Defined in: [data-structures/binary-tree/binary-tree.ts:487](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L487)

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

Defined in: [data-structures/binary-tree/bst.ts:431](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L431)

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

Defined in: [data-structures/base/iterable-entry-base.ts:42](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L42)

Iterate over keys only.

#### Returns

`IterableIterator`\<`K`\>

Iterator of keys.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const rbt = new RedBlackTree<number>([30, 10, 20]);
console.log([...rbt.keys()]); // [10, 20, 30]
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

Defined in: [data-structures/binary-tree/binary-tree.ts:2164](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2164)

Get leaf nodes

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = rbt.leaves(n => n.key);
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

Defined in: [data-structures/binary-tree/binary-tree.ts:2166](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2166)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = rbt.leaves(n => n.key);
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

Defined in: [data-structures/binary-tree/bst.ts:1850](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1850)

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

Defined in: [data-structures/binary-tree/bst.ts:1852](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1852)

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

Defined in: [data-structures/binary-tree/bst.ts:668](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L668)

Level-order grouping

 *

##### Returns

(`K` \| `undefined`)[][]

##### Example

```ts
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    const levels = rbt.listLevels(n => n.key);
console.log(levels.length); // > 0
    // Filter out NIL sentinels (NaN keys)
    const allKeys = levels.flat().filter(k => !isNaN(k)).sort((a, b) => a - b);
console.log(allKeys); // [1, 3, 4, 5, 7]
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

Defined in: [data-structures/binary-tree/bst.ts:670](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L670)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    const levels = rbt.listLevels(n => n.key);
console.log(levels.length); // > 0
    // Filter out NIL sentinels (NaN keys)
    const allKeys = levels.flat().filter(k => !isNaN(k)).sort((a, b) => a - b);
console.log(allKeys); // [1, 3, 4, 5, 7]
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

Defined in: [data-structures/binary-tree/bst.ts:1747](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1747)

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
const rbt = new RedBlackTree<number>([10, 20, 30]);
console.log(rbt.lower(20)); // 10
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

Defined in: [data-structures/binary-tree/bst.ts:1762](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1762)

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
const rbt = new RedBlackTree<number>([10, 20, 30]);
console.log(rbt.lower(20)); // 10
```

##### Inherited from

[`BST`](BST.md).[`lower`](BST.md#lower)

***

### map()

```ts
map<MK, MV, MR>(
   callback, 
   options?, 
thisArg?): RedBlackTree<MK, MV, MR>;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:1428](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L1428)

Transform to new tree

 *

#### Type Parameters

##### MK

`MK` = `K`

##### MV

`MV` = `V`

##### MR

`MR` = `any`

#### Parameters

##### callback

`EntryCallback`\<`K`, `V` \| `undefined`, \[`MK`, `MV`\]\>

##### options?

`Partial`\<`RedBlackTreeOptions`\<`MK`, `MV`, `MR`\>\>

##### thisArg?

`unknown`

#### Returns

`RedBlackTree`\<`MK`, `MV`, `MR`\>

#### Example

```ts
const rbt = new RedBlackTree<number, number>([[1, 10], [2, 20]]);
    const doubled = rbt.map((v, k) => [k, (v ?? 0) * 2] as [number, number]);
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

Defined in: [data-structures/binary-tree/binary-tree.ts:862](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L862)

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
const rbt1 = new RedBlackTree<number>([1, 3]);
    const rbt2 = new RedBlackTree<number>([2, 4]);
    rbt1.merge(rbt2);
console.log([...rbt1.keys()]); // [1, 2, 3, 4]
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

Defined in: [data-structures/binary-tree/binary-tree.ts:2366](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2366)

Morris traversal (O(1) space)

 *

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const rbt = new RedBlackTree<number>([5, 3, 7]);
    const result = rbt.morris(n => n.key, 'IN');
console.log(result.length); // > 0
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

Defined in: [data-structures/binary-tree/binary-tree.ts:2368](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2368)

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
const rbt = new RedBlackTree<number>([5, 3, 7]);
    const result = rbt.morris(n => n.key, 'IN');
console.log(result.length); // > 0
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
perfectlyBalance(_iterationType?): boolean;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:1307](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L1307)

Red-Black trees are self-balancing — `perfectlyBalance` rebuilds via
sorted bulk insert, which naturally produces a balanced RBT.

#### Parameters

##### \_iterationType?

`IterationType`

#### Returns

`boolean`

#### Remarks

Time O(N), Space O(N)

 *

#### Example

```ts
const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5]);
    rbt.perfectlyBalance();
console.log(rbt.isAVLBalanced()); // true
```

#### Overrides

[`BST`](BST.md).[`perfectlyBalance`](BST.md#perfectlybalance)

***

### print()

```ts
print(options?, startNode?): void;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2695](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2695)

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
const rbt = new RedBlackTree<number>([5, 3, 7]);
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

Defined in: [data-structures/binary-tree/bst.ts:1058](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1058)

Find all keys in a range

 *

##### Parameters

###### range

`Range`\<`K`\> \| \[`K`, `K`\]

##### Returns

(`K` \| `undefined`)[]

##### Example

```ts
const rbt = new RedBlackTree<number>([10, 20, 30, 40, 50]);
console.log(rbt.rangeSearch([15, 35])); // [20, 30]
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

Defined in: [data-structures/binary-tree/bst.ts:1060](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1060)

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
const rbt = new RedBlackTree<number>([10, 20, 30, 40, 50]);
console.log(rbt.rangeSearch([15, 35])); // [20, 30]
```

##### Inherited from

[`BST`](BST.md).[`rangeSearch`](BST.md#rangesearch)

***

### reduce()

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-entry-base.ts:171](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L171)

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
const rbt = new RedBlackTree<number, number>([[1, 10], [2, 20], [3, 30]]);
    const sum = rbt.reduce((acc, v) => acc + (v ?? 0), 0);
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

Defined in: [data-structures/binary-tree/binary-tree.ts:873](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L873)

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

Defined in: [data-structures/binary-tree/bst.ts:872](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L872)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 9]);
    const found = rbt.search(n => n.key > 5, true);
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

Defined in: [data-structures/binary-tree/bst.ts:884](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L884)

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
const rbt = new RedBlackTree<number>([5, 3, 7, 1, 9]);
    const found = rbt.search(n => n.key > 5, true);
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

Defined in: [data-structures/binary-tree/red-black-tree.ts:958](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L958)

Insert or update a key/value (map mode) or key-only (set mode).

This method is optimized for:
- monotonic inserts via min/max boundary fast paths
- updates via a single-pass search (no double walk)

#### Parameters

##### keyNodeOrEntry

  \| `K`
  \| [`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\>
  \| \[`K` \| `null` \| `undefined`, `V` \| `undefined`\]
  \| `null`
  \| `undefined`

##### value?

`V`

#### Returns

`boolean`

#### Remarks

Time O(log n) average, Space O(1)

 *

#### Example

```ts
// Create a simple Red-Black Tree with numeric keys
    const tree = new RedBlackTree([5, 2, 8, 1, 9]);

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

Defined in: [data-structures/binary-tree/bst.ts:1281](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/bst.ts#L1281)

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
const rbt = new RedBlackTree<number, string>();
    rbt.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
console.log(rbt.size); // 3
```

#### Inherited from

[`BST`](BST.md).[`setMany`](BST.md#setmany)

***

### setWithHint()

```ts
setWithHint(
   key, 
   value, 
   hint?): boolean;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:828](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L828)

Boolean wrapper for setWithHintNode.

#### Parameters

##### key

`K`

##### value

`V`

##### hint?

[`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\>

#### Returns

`boolean`

#### Remarks

Time O(log n) average, Space O(1)

***

### setWithHintNode()

```ts
setWithHintNode(
   key, 
   value, 
   hint?): RedBlackTreeNode<K, V> | undefined;
```

Defined in: [data-structures/binary-tree/red-black-tree.ts:728](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/red-black-tree.ts#L728)

Insert/update using a hint node to speed up nearby insertions.

close to the expected insertion position (often the previously returned node in a loop).

When the hint is a good fit (sorted / nearly-sorted insertion), this can avoid most of the
normal root-to-leaf search and reduce constant factors.

When the hint does not match (random workloads), this will fall back to the normal set path.

#### Parameters

##### key

`K`

##### value

`V`

##### hint?

[`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\>

#### Returns

[`RedBlackTreeNode`](RedBlackTreeNode.md)\<`K`, `V`\> \| `undefined`

#### Remarks

Time O(log n) average, Space O(1)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:83](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L83)

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
const rbt = new RedBlackTree<number>([1, 3, 5]);
console.log(rbt.some((v, k) => k === 3)); // true
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

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`K`, `V` \| `undefined`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

#### Example

```ts
const rbt = new RedBlackTree<number>([30, 10, 20]);
console.log(rbt.toArray().map(([k]) => k)); // [10, 20, 30]
```

#### Inherited from

[`BST`](BST.md).[`toArray`](BST.md#toarray)

***

### toVisual()

```ts
toVisual(startNode?, options?): string;
```

Defined in: [data-structures/binary-tree/binary-tree.ts:2633](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/binary-tree.ts#L2633)

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

Defined in: [data-structures/base/iterable-entry-base.ts:53](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L53)

Iterate over values only.

#### Returns

`IterableIterator`\<`V` \| `undefined`\>

Iterator of values.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const rbt = new RedBlackTree<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
console.log([...rbt.values()]); // ['a', 'b', 'c']
```

#### Implementation of

```ts
IBinaryTree.values
```

#### Inherited from

[`BST`](BST.md).[`values`](BST.md#values)
