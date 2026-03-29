# RFC: Order-Statistic Tree (select / rank / rangeByRank)

## Summary

Add order-statistic capabilities to BST by maintaining subtree `count` on every node.
Three new methods: `select(k)`, `rank(key)`, `rangeByRank(start, end)`.

Gated by `enableOrderStatistic: true` in options. When disabled (default), count is not maintained and the three methods throw.

## Motivation

Order-statistic queries are fundamental operations for ranked data:
- Leaderboards: "Who is ranked #5?"
- Percentile queries: "What rank is this score?"
- Pagination by rank: "Give me items ranked 10–19"

Currently users must do O(n) iteration to answer these. With count maintenance, all become O(log n).

## Scope

Applies to all BST-derived classes:
- BST
- AVLTree
- RedBlackTree
- TreeMap
- TreeSet
- TreeMultiMap
- TreeMultiSet

## Options

```ts
// Added to BSTOptions
enableOrderStatistic?: boolean; // default: false
```

When `false` (default):
- `_count` is NOT maintained (no overhead)
- `select()`, `rank()`, `rangeByRank()` throw `Error('Order statistic is not enabled')`

When `true`:
- `_count` is maintained on every insert, delete, and rotation
- All three methods available

### Inheritance

The option propagates through the inheritance chain:
```ts
const map = new TreeMap<string, number>([], { enableOrderStatistic: true });
map.select(0); // ✅ works
```

## API Design

### select(k) — Find the k-th smallest element

0-indexed to align with JavaScript Array conventions.

```ts
// Overload 1: no callback → returns key
select(k: number): K | undefined;

// Overload 2: with callback → returns callback result
select<C extends NodeCallback<BSTNode<K, V>>>(
  k: number,
  callback: C,
  iterationType?: IterationType
): ReturnType<C> | undefined;
```

**Behavior:**
- `k = 0` → smallest element
- `k = tree.size - 1` → largest element
- `k < 0 || k >= tree.size` → `undefined`
- Without callback → returns `K | undefined` (default: `node.key`)
- With callback → returns `ReturnType<C> | undefined`

**Algorithm (O(log n)):**
```
function select(node, k):
  leftCount = node.left?.count ?? 0
  if k < leftCount:
    return select(node.left, k)
  if k === leftCount:
    return node
  return select(node.right, k - leftCount - 1)
```

**Examples:**
```ts
const tree = new RedBlackTree<number>(
  [50, 30, 70, 20, 40, 60, 80],
  { enableOrderStatistic: true }
);

tree.select(0);  // 20 (smallest)
tree.select(3);  // 50 (median)
tree.select(6);  // 80 (largest)
tree.select(7);  // undefined (out of bounds)
tree.select(-1); // undefined

// With callback — get node
tree.select(3, node => node);  // BSTNode { key: 50 }

// With callback — get entry
tree.select(3, node => [node.key, node.value]);  // [50, undefined]

// TreeMap
const map = new TreeMap<string, number>(
  [['alice', 95], ['bob', 87], ['charlie', 92]],
  { enableOrderStatistic: true }
);
map.select(0);  // 'alice' (keys sorted alphabetically)
map.select(2);  // 'charlie'

// TreeSet
const set = new TreeSet<number>([10, 20, 30], { enableOrderStatistic: true });
set.select(1);  // 20
```

### rank(key) — Get the rank of a key

Returns the number of elements strictly less than the given key (0-indexed).

```ts
// Overload 1: returns number
rank(
  keyNodeEntryOrPredicate:
    | K
    | BSTNode<K, V>
    | [K | null | undefined, V | undefined]
    | null
    | undefined
    | NodePredicate<BSTNode<K, V>>
): number;

// Overload 2: with iterationType
rank(
  keyNodeEntryOrPredicate:
    | K
    | BSTNode<K, V>
    | [K | null | undefined, V | undefined]
    | null
    | undefined
    | NodePredicate<BSTNode<K, V>>,
  iterationType: IterationType
): number;
```

**Behavior:**
- Returns count of keys strictly less than the target
- If key exists: `rank(key)` is its 0-based position in sorted order
- If key does NOT exist: returns the position where it would be inserted
- `rank(null | undefined)` → `-1`
- For Predicate input: finds the first matching node, then returns its rank

**Algorithm (O(log n)):**
```
function rank(node, key):
  if node is null: return 0
  if key < node.key:
    return rank(node.left, key)
  if key > node.key:
    return (node.left?.count ?? 0) + 1 + rank(node.right, key)
  return node.left?.count ?? 0
```

**Examples:**
```ts
const tree = new RedBlackTree<number>(
  [10, 20, 30, 40, 50],
  { enableOrderStatistic: true }
);

tree.rank(10);  // 0 (smallest, 0 elements less than it)
tree.rank(30);  // 2 (20 and 10 are less)
tree.rank(50);  // 4
tree.rank(25);  // 2 (would be inserted at position 2)
tree.rank(5);   // 0 (would be inserted at position 0)
tree.rank(100); // 5 (would be inserted at end)

// Inverse relationship
tree.select(tree.rank(30)); // 30
tree.rank(tree.select(2)!); // 2

// TreeMap
const map = new TreeMap<string, number>(
  [['alice', 95], ['bob', 87], ['charlie', 92]],
  { enableOrderStatistic: true }
);
map.rank('bob'); // 1
```

### rangeByRank(start, end) — Get elements by rank range

0-indexed, inclusive on both ends. Follows `rangeSearch` pattern.

```ts
// Overload 1: no callback → returns keys
rangeByRank(start: number, end: number): (K | undefined)[];

// Overload 2: with callback
rangeByRank<C extends NodeCallback<BSTNode<K, V>>>(
  start: number,
  end: number,
  callback: C,
  iterationType?: IterationType
): ReturnType<C>[];
```

**Behavior:**
- `start` and `end` are both inclusive, 0-indexed
- `start < 0` → clamped to 0
- `end >= tree.size` → clamped to `tree.size - 1`
- `start > end` → empty array `[]`
- Without callback → returns `(K | undefined)[]`

**Algorithm (O(log n + k)):**
```
1. select(start) to find starting node
2. In-order traverse k = (end - start + 1) nodes
```

**Examples:**
```ts
const tree = new RedBlackTree<number>(
  [10, 20, 30, 40, 50, 60, 70],
  { enableOrderStatistic: true }
);

tree.rangeByRank(0, 2);   // [10, 20, 30] (first 3)
tree.rangeByRank(2, 4);   // [30, 40, 50] (middle 3)
tree.rangeByRank(5, 6);   // [60, 70] (last 2)
tree.rangeByRank(0, 100); // [10, 20, 30, 40, 50, 60, 70] (clamped)
tree.rangeByRank(5, 3);   // [] (invalid range)
tree.rangeByRank(-5, 1);  // [10, 20] (clamped start)

// With callback — get entries
tree.rangeByRank(0, 2, node => [node.key, node.value]);
// [[10, undefined], [20, undefined], [30, undefined]]

// Pagination: page 2, page size 3
const page = 2, size = 3;
tree.rangeByRank((page - 1) * size, page * size - 1);
// [40, 50, 60]
```

## Count Maintenance

### Node field

Already exists: `BSTNode._count: number = 1`

### When to update

| Operation | Update needed |
|-----------|--------------|
| insert    | Increment count along insertion path (root → new node) |
| delete    | Decrement count along deletion path |
| AVL rotation (single) | Update rotated node and its new parent |
| AVL rotation (double) | Update all 3 involved nodes |
| RBT rotation | Update rotated node and its new parent |
| RBT transplant | No extra update (covered by delete path) |

### Update helper

```ts
protected _updateCount(node: BSTNode<K, V>): void {
  if (!this._enableOrderStatistic) return;
  node._count = 1
    + (this.isRealNode(node.left) ? node.left._count : 0)
    + (this.isRealNode(node.right) ? node.right._count : 0);
}
```

Called after every structural change (rotation, insert fixup, delete fixup).

### Performance impact

- O(log n) additional work per insert/delete (walk path, update counts)
- O(1) per rotation (2 additions)
- When `enableOrderStatistic: false`: zero overhead (guard returns immediately)

## Error Handling

Uses the library's centralized error handling system (`raise` from `src/common/error.ts`).

### Global error handling modes

```ts
import { setErrorHandling } from 'data-structure-typed';

setErrorHandling('throw'); // default — fail-fast
setErrorHandling('warn');  // console.warn and continue
setErrorHandling('error'); // console.error and continue
setErrorHandling('silent');// suppress all
```

### Usage in order-statistic methods

```ts
select(k: number): K | undefined {
  if (!this._enableOrderStatistic) {
    raise(Error, ERR.orderStatisticNotEnabled('select'));
    return undefined; // reached in warn/error/silent modes
  }
  // ...
}

rank(key: K): number {
  if (!this._enableOrderStatistic) {
    raise(Error, ERR.orderStatisticNotEnabled('rank'));
    return -1; // reached in warn/error/silent modes
  }
  // ...
}

rangeByRank(start: number, end: number): (K | undefined)[] {
  if (!this._enableOrderStatistic) {
    raise(Error, ERR.orderStatisticNotEnabled('rangeByRank'));
    return []; // reached in warn/error/silent modes
  }
  // ...
}
```

Each call site provides a sensible fallback value after `raise()`:
- `select` → `undefined`
- `rank` → `-1`
- `rangeByRank` → `[]`

In `throw` mode (default), the fallback is never reached. In other modes, the function degrades gracefully.

### Migration path

New code uses `raise()`. Existing `throw` statements are gradually migrated — not a blocker for this RFC.

## IterationType Support

Both `select` and `rank` walk a single root-to-leaf path, similar to `ceiling`/`floor`.

- **ITERATIVE** (default): while loop, O(1) space
- **RECURSIVE**: function calls, O(log n) stack space

`rangeByRank` uses `select` + in-order traversal, both support IterationType.

## Edge Cases

| Case | select | rank | rangeByRank |
|------|--------|------|-------------|
| Empty tree | `undefined` | `-1` | `[]` |
| k out of bounds | `undefined` | n/a | clamped |
| Key not in tree | n/a | insertion position | n/a |
| null/undefined input | n/a | `-1` | n/a |
| enableOrderStatistic: false | throws | throws | throws |
| Single element tree | `select(0)` = that key | `rank(key)` = 0 | `[key]` |
| Duplicate keys (TreeMultiMap) | counts all duplicates | rank of first occurrence | includes duplicates |

## TreeMultiMap / TreeMultiSet Considerations

In TreeMultiMap, a single node can represent multiple entries.
- `count` should reflect **total entries** in subtree, not just node count
- `select(k)` should account for per-node multiplicity
- `rank(key)` should return rank counting all duplicates

## Test Plan

### Unit tests (TDD — write before implementation)

1. **Basic select**
   - select(0) = min, select(size-1) = max
   - select out of bounds = undefined
   - select on empty tree = undefined
   - select with callback

2. **Basic rank**
   - rank of existing keys
   - rank of non-existing keys (insertion position)
   - rank on empty tree = -1
   - rank(null) = -1, rank(undefined) = -1

3. **Basic rangeByRank**
   - Normal range
   - Clamped range (negative start, end > size)
   - Invalid range (start > end) = []
   - Full range (0 to size-1)
   - With callback

4. **Inverse relationship**
   - `select(rank(key)) === key` for all keys
   - `rank(select(k)) === k` for all valid k

5. **Count maintenance**
   - After insertions: verify count on root = tree.size
   - After deletions: verify count on root = tree.size
   - After rotations: verify count integrity (sum of children + 1)

6. **All subclasses**
   - BST, AVLTree, RedBlackTree: same tests
   - TreeMap: select returns key, rank accepts key
   - TreeSet: select returns key
   - TreeMultiMap: duplicate handling
   - TreeMultiSet: duplicate handling

7. **enableOrderStatistic: false**
   - select/rank/rangeByRank all throw
   - No count maintenance overhead (count stays 1)

8. **IterationType**
   - All methods produce same results with RECURSIVE and ITERATIVE

9. **Stress test**
   - Insert 10K random elements, verify select/rank consistency
   - Random insert/delete sequence, verify count integrity after each operation

## Implementation Order

1. Add `enableOrderStatistic` to BSTOptions
2. Write all tests (TDD)
3. Implement `_updateCount` helper
4. Wire count updates into BST insert/delete
5. Wire count updates into AVL rotations
6. Wire count updates into RBT rotations + fixup
7. Implement `select`
8. Implement `rank`
9. Implement `rangeByRank`
10. Verify all tests pass
11. Run performance benchmark (before/after with enableOrderStatistic: false)
12. Add @example from tests
