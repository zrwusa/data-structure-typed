# Migration Guide

## Upgrading to v2.5.3

### Breaking Changes

#### 1. `HashMap/LinkedHashMap.set()` returns `this` instead of `boolean`

Aligns with the native JS `Map.set()` spec. Enables chaining.

```typescript
// Before
const success: boolean = map.set('key', 'value');

// After
map.set('key', 'value');                          // returns this
const chain = map.set('a', 1).set('b', 2);       // chaining works
```

#### 2. `BinaryTree/BST/AVL/RedBlackTree.delete()` returns `boolean` instead of `BinaryTreeDeleteResult[]`

Simplified to match standard container semantics.

```typescript
// Before
const results: BinaryTreeDeleteResult[] = tree.delete(key);
const success = results.length > 0 && results[0].deleted !== undefined;

// After
const success: boolean = tree.delete(key);        // true if found and removed
```

#### 3. `BST.deleteWhere()` returns `boolean` instead of `BinaryTreeDeleteResult[]`

```typescript
// Before
const results: BinaryTreeDeleteResult[] = bst.deleteWhere(pred);

// After
const deleted: boolean = bst.deleteWhere(pred);   // true if any match removed
```

#### 4. `Stack.deleteAt()` returns `E | undefined` instead of `boolean`

Consistent with `LinkedList.deleteAt()`, `Queue.deleteAt()`, `Deque.deleteAt()`.

```typescript
// Before
const success: boolean = stack.deleteAt(2);

// After
const removed: E | undefined = stack.deleteAt(2); // returns removed element
if (removed !== undefined) { /* success */ }
```

#### 5. `LinkedHashMap.deleteAt()` returns `[K, V] | undefined` instead of `boolean`

```typescript
// Before
const success: boolean = lhm.deleteAt(0);

// After
const entry: [K, V] | undefined = lhm.deleteAt(0);
if (entry) {
  const [key, value] = entry;
}
```

#### 6. `FibonacciHeap.push()` returns `boolean` instead of `this`

Consistent with `Heap.add()`.

```typescript
// Before
const heap: FibonacciHeap = fh.push(42);         // returned this

// After
const success: boolean = fh.push(42);            // returns true
```

#### 7. `refill()` removed from `BinaryTree` and `Heap`

Replace with `clear()` + `addMany()`/`setMany()`.

```typescript
// Before (Heap)
heap.refill([5, 3, 1, 4]);

// After (Heap)
heap.clear();
heap.addMany([5, 3, 1, 4]);

// Before (BinaryTree)
tree.refill(entries);

// After (BinaryTree)
tree.clear();
tree.setMany(entries);
```

---

### Deprecations

These still work but will be removed in a future major version.

#### `Heap.poll()` → use `Heap.pop()`

```typescript
// Deprecated
const top = heap.poll();

// Preferred
const top = heap.pop();
```

#### `Heap.deleteBy()` → use `Heap.deleteWhere()`

```typescript
// Deprecated
heap.deleteBy(e => e.id === 42);

// Preferred
heap.deleteWhere(e => e.id === 42);
```

#### `DoublyLinkedList.getBackward()` → use `findLast()`

```typescript
// Deprecated
list.getBackward(node => node.value > 5);

// Preferred (aligns with ES2023 Array.findLast)
list.findLast(node => node.value > 5);
```

---

### New Features

#### Array-Compatible APIs (v2.5.4+)

All `IterableElementBase` containers (Queue, Deque, Stack, LinkedList, Heap, Trie) now support:

```typescript
structure.includes(element);    // alias for has()
[...structure.entries()];       // [[0, val0], [1, val1], ...]
[...structure.keys()];          // [0, 1, 2, ...]
structure.toReversed();         // new instance, reversed (linear containers)
```

#### Back-to-Front Search (v2.5.4+)

```typescript
// Deque + DoublyLinkedList
deque.findLast(v => v > 10);       // last matching value
deque.findLastIndex(v => v > 10);  // last matching index, or -1
```

#### TreeSet ES2025 Set Operations (v2.5.4+)

```typescript
const a = new TreeSet([1, 2, 3, 4, 5]);
const b = new TreeSet([3, 4, 5, 6, 7]);

a.union(b);               // TreeSet [1,2,3,4,5,6,7]
a.intersection(b);        // TreeSet [3,4,5]
a.difference(b);          // TreeSet [1,2]
a.symmetricDifference(b); // TreeSet [1,2,6,7]
a.isSubsetOf(b);          // false
a.isSupersetOf(b);        // false
a.isDisjointFrom(b);      // false

// Works with any Iterable
a.union([10, 11]);
a.intersection(new Set([2, 4]));
```

#### `deleteWhere()` — conditional deletion

Available on: `TreeMap`, `TreeSet`, `TreeMultiMap`, `TreeMultiSet`, `DoublyLinkedList`, `Queue`, `Heap`

```typescript
// Delete first even number from queue
queue.deleteWhere((value, index) => value % 2 === 0);

// Delete entries where value > 100 from TreeMap
treeMap.deleteWhere((key, value) => value > 100);

// Delete keys > 50 from TreeSet
treeSet.deleteWhere((key) => key > 50);
```

#### `Queue.peek()` / `Deque.peek()`

Alias for the `first` getter. Familiar API for users coming from other languages.

```typescript
const queue = new Queue([10, 20, 30]);
queue.peek();   // 10 (same as queue.first)
queue.first;    // 10

const deque = new Deque([10, 20, 30]);
deque.peek();   // 10 (same as deque.first)
```

#### `Heap.pop()` — primary top-removal method

Consistent naming across all containers (`Stack.pop()`, `Deque.pop()`, `Heap.pop()`).

```typescript
const heap = new Heap([3, 1, 4], { comparator: (a, b) => a - b });
heap.pop();     // 1 (min element)
heap.pop();     // 3
heap.pop();     // 4
heap.pop();     // undefined
```
