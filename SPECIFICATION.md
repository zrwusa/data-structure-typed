# SPECIFICATION: data-structure-typed Library

**Version:** 2.0.4  
**Last Updated:** January 2026  
**Repository:** https://github.com/zrwusa/data-structure-typed  
**API Docs:** https://data-structure-typed-docs.vercel.app

---

## Table of Contents

1. [Specification Overview](#specification-overview)
2. [Supported Data Structures](#supported-data-structures)
3. [API Standard](#api-standard)
4. [Type System Specification](#type-system-specification)
5. [Performance Guarantees](#performance-guarantees)
6. [Module System Support](#module-system-support)
7. [Browser & Runtime Compatibility](#browser--runtime-compatibility)
8. [Data Structure Contracts](#data-structure-contracts)
9. [Iterator Protocol Compliance](#iterator-protocol-compliance)
10. [Method Chaining Specification](#method-chaining-specification)
11. [Error Handling](#error-handling)
12. [Breaking Changes Policy](#breaking-changes-policy)

---

## Specification Overview

**data-structure-typed** is a comprehensive TypeScript data structures library implementing 20+ production-ready data structures with guaranteed time/space complexity.

### Design Goals

- ✅ **Unified API**: Consistent interface across all linear structures (push, pop, shift, unshift)
- ✅ **Type Safety**: Full TypeScript generics with strict typing
- ✅ **Performance Guaranteed**: O(log n) for trees, O(1) for deque operations
- ✅ **Zero Friction**: Iterator protocol on all structures
- ✅ **Production Ready**: Comprehensive error handling and edge case coverage
- ✅ **Framework Agnostic**: Works in Node.js, browsers, and edge runtimes

### Version Compatibility

| Version | Release Date | LTS Support | Node.js | TypeScript |
|---------|-------------|-------------|---------|-----------|
| 2.0.x   | Jan 2025    | Until 2027  | 16+     | 5.0+      |
| 1.x.x   | 2023-2024   | Until 2025  | 14+     | 4.5+      |

---

## Supported Data Structures

### Linear Structures (20+ total)

| Structure | Category | Time Complexity | Space | Status |
|-----------|----------|-----------------|-------|--------|
| **Stack** | Linear | O(1) all ops | O(n) | ✅ Stable |
| **Queue** | Linear | O(1) all ops | O(n) | ✅ Stable |
| **Deque** | Linear | O(1) all ops | O(n) | ✅ Stable |
| **SinglyLinkedList** | Linear | O(n) avg access, O(1) insert* | O(n) | ✅ Stable |
| **DoublyLinkedList** | Linear | O(n) avg access, O(1) insert* | O(n) | ✅ Stable |

### Tree Structures

| Structure | Balance | Time Complexity | Guarantee | Status |
|-----------|---------|-----------------|-----------|--------|
| **BinaryTree** | N/A | O(n) avg | None | ✅ Stable |
| **BST** | None | O(log n) avg | O(n) worst | ✅ Stable |
| **RedBlackTree** | Yes | O(log n) | O(log n) | ✅ Stable |
| **AVLTree** | Yes | O(log n) | O(log n) | ✅ Stable |
| **TreeMultiMap** | Yes | O(log n) | O(log n) | ✅ Stable |

### Priority Queues & Heaps

| Structure | Type | Time Complexity | Use Case | Status |
|-----------|------|-----------------|----------|--------|
| **Heap** | Generic | O(log n) add/remove | Heap operations | ✅ Stable |
| **MinHeap** | Min | O(log n) add/remove | Minimum priority | ✅ Stable |
| **MaxHeap** | Max | O(log n) add/remove | Maximum priority | ✅ Stable |
| **PriorityQueue** | Generic | O(log n) add/remove | Task scheduling | ✅ Stable |
| **MinPriorityQueue** | Min | O(log n) add/remove | Min priority tasks | ✅ Stable |
| **MaxPriorityQueue** | Max | O(log n) add/remove | Max priority tasks | ✅ Stable |

### Specialized Structures

| Structure | Purpose | Time Complexity | Status |
|-----------|---------|-----------------|--------|
| **Trie** | Prefix search | O(m+k) | ✅ Stable |
| **HashMap** | Key-value lookup | O(1) avg | ✅ Stable |
| **Graph** | Base graph class | Varies | ✅ Stable |
| **DirectedGraph** | Directed graphs | O(V+E) | ✅ Stable |
| **UndirectedGraph** | Undirected graphs | O(V+E) | ✅ Stable |
| **SegmentTree** | Range queries | O(log n) | ⚠️ Beta |
| **BinaryIndexedTree** | Cumulative queries | O(log n) | ⚠️ Beta |

---

## API Standard

### Unified Linear Structure API

**All linear structures (Stack, Queue, Deque, LinkedList) support the same 4 core methods:**

```typescript
// Add operations
structure.push(element: T): number          // Add to end, return length
structure.unshift(element: T): number       // Add to start, return length

// Remove operations
structure.pop(): T | undefined              // Remove from end
structure.shift(): T | undefined            // Remove from start

// Peek operations (read without removing)
structure.peek(): T | undefined             // View last element
structure.peekFirst(): T | undefined        // View first element (Deque)
structure.peekLast(): T | undefined         // View last element (Deque)

// Size and queries
structure.size: number                      // Element count
structure.isEmpty: boolean                  // Check if empty
```

### Tree & Map API

**All key-value structures (Trees, Maps) support:**

```typescript
// Add/update
structure.set(key: K, value: V): this
structure.setMany(entries: [K, V][]): this

// Query
structure.get(key: K): V | undefined
structure.has(key: K): boolean
structure.size: number

// Remove
structure.delete(key: K): boolean
structure.clear(): void

// Iteration
structure.keys(): IterableIterator<K>
structure.values(): IterableIterator<V>
structure.entries(): IterableIterator<[K, V]>
```

### Heap & Priority Queue API

**All heaps and priority queues support:**

```typescript
// Add/remove
heap.push(element: T): number               // Add element
heap.add(element: T): number                // Alias for push
heap.pop(): T | undefined                  // Remove highest/lowest priority
heap.poll(): T | undefined                 // Alias for pop

// Peek
heap.peek(): T | undefined                 // View highest/lowest without removing

// Query
heap.size: number
heap.isEmpty: boolean
```

### Array Methods (Available on All Structures)

**All structures support ES6+ array methods via iteration:**

```typescript
structure.map<U>(mapper: (v: V, k?: K, index?: number) => U): this
structure.filter(predicate: (v: V, k?: K, index?: number) => boolean): this
structure.reduce<U>(reducer: (acc: U, v: V, k?: K, i?: number) => U, init: U): U
structure.find(predicate: (v: V, k?: K, i?: number) => boolean): V | undefined
structure.some(predicate: (v: V, k?: K, i?: number) => boolean): boolean
structure.every(predicate: (v: V, k?: K, i?: number) => boolean): boolean
structure.forEach(callback: (v: V, k?: K, i?: number) => void): void
```

---

## Type System Specification

### Generic Parameters

**Binary type parameters for key-value structures:**

```typescript
class RedBlackTree<K = number, V = any> {
  set(key: K, value: V): this
  get(key: K): V | undefined
}

// Example usage
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');  // Type-safe
tree.get(1);           // Returns: string | undefined
```

**Single type parameter for linear structures:**

```typescript
class Stack<T> {
  push(element: T): number
  pop(): T | undefined
}

// Example usage
const stack = new Stack<number>();
stack.push(42);        // ✅ Type-safe
stack.push('text');    // ❌ Type error
```

### Comparator Functions

**All ordered structures accept optional comparator:**

```typescript
type Comparator<T> = (a: T, b: T) => number

// Return value semantics:
// < 0 means a comes before b (ascending)
// 0 means equal
// > 0 means a comes after b

const tree = new RedBlackTree<number>(
  (a, b) => b - a  // Descending order
);
```

### Iterator Protocol

**All structures implement Symbol.iterator:**

```typescript
interface Structure<T> {
  [Symbol.iterator](): Iterator<T>
}

// Enables:
[...structure]                    // Spread operator
for (const item of structure) {}  // for...of loop
const [a, b] = structure          // Destructuring
Array.from(structure)             // Array conversion
new Set(structure)                // Set constructor
```

---

## Performance Guarantees

### Time Complexity Guarantees

| Data Structure | Access | Search | Insert | Delete | Min |
|---|---|---|---|---|---|
| **Stack** | - | - | O(1) | O(1) | ✅ |
| **Queue** | - | - | O(1) | O(1) | ✅ |
| **Deque** | - | - | O(1) | O(1) | ✅ |
| **LinkedList** | O(n) | O(n) | O(1)* | O(1)* | ✅ |
| **BST** | O(log n) | O(log n) | O(log n) | O(log n) | ⚠️** |
| **RedBlackTree** | O(log n) | O(log n) | O(log n) | O(log n) | ✅ |
| **AVLTree** | O(log n) | O(log n) | O(log n) | O(log n) | ✅ |
| **Heap** | O(n) | O(n) | O(log n) | O(log n) | ✅ |
| **Trie** | N/A | O(m) | O(m) | O(m) | ✅ |
| **Graph** | - | O(V+E) | O(1) | O(V+E) | Varies |

*With pointer access; O(n) without  
**Average case; worst case O(n) if unbalanced

### Space Complexity

| Data Structure | Space | Notes |
|---|---|---|
| **Stack** | O(n) | One pointer per element |
| **Queue** | O(n) | Chunked optimized |
| **Deque** | O(n) | Bucket-based, minimal overhead |
| **LinkedList** | O(n) | Extra pointers (singly/doubly) |
| **BST/RedBlackTree/AVL** | O(n) | 2-3 pointers per node |
| **Heap** | O(n) | Array-based, tight packing |
| **Trie** | O(26n) | Per-character nodes |
| **Graph** | O(V+E) | Adjacency list representation |

### Benchmark Targets

Library maintains 10-100x performance vs naive implementations:

- **Deque**: 484x faster than Array.shift() for 100K operations
- **RedBlackTree**: 308x faster than Array sort for 100K+1K operations
- **Trie**: O(m+k) vs O(n*m) for prefix search

Benchmarks run on: MacBook Pro 2018, Intel i7, 16GB RAM

---

## Module System Support

### CommonJS

```javascript
const { RedBlackTree, Deque } = require('data-structure-typed');
```

### ES Modules (ESM)

```javascript
import { RedBlackTree, Deque } from 'data-structure-typed';
```

### TypeScript with Full Types

```typescript
import { RedBlackTree } from 'data-structure-typed';
const tree = new RedBlackTree<number, string>();
```

### UMD (Browser Global)

```html
<script src="https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js"></script>
<script>
  const { Deque } = window.dataStructureTyped;
  const deque = new Deque();
</script>
```

### Individual Packages

```bash
npm install heap-typed deque-typed red-black-tree-typed
```

---

## Browser & Runtime Compatibility

### Minimum Versions

| Runtime | Version | Notes |
|---------|---------|-------|
| **Node.js** | 16+ | Active LTS |
| **TypeScript** | 5.0+ | Latest stable |
| **Chrome** | 90+ | Modern ES2020 support |
| **Firefox** | 88+ | Modern ES2020 support |
| **Safari** | 14+ | Modern ES2020 support |
| **Edge** | 90+ | Modern ES2020 support |

### Built-in Globals Required

- Symbol.iterator (for iteration protocol)
- Map/Set (for some structures)
- WeakMap (not used currently)

### Polyfill Requirements

**None required for modern environments.**

For IE11 compatibility: Manual implementation needed (not officially supported)

### Tested Platforms

- ✅ Node.js 16, 18, 20, 21
- ✅ Deno 1.40+
- ✅ Bun 1.0+
- ✅ Chrome, Firefox, Safari (latest)
- ✅ Edge (latest)
- ✅ Browsers via CDN (jsDelivr, unpkg)

---

## Data Structure Contracts

### Stack Contract

```typescript
interface Stack<T> {
  push(element: T): number
  pop(): T | undefined
  peek(): T | undefined
  size: number
}

// LIFO: Last In, First Out
// Properties:
// - push() and pop() must be O(1)
// - Iteration order: LIFO (top to bottom)
```

### Queue Contract

```typescript
interface Queue<T> {
  push(element: T): number      // Enqueue
  shift(): T | undefined         // Dequeue
  peek(): T | undefined
  size: number
}

// FIFO: First In, First Out
// Properties:
// - push() and shift() must be O(1)
// - Iteration order: FIFO (head to tail)
```

### Tree Map Contract

```typescript
interface TreeMap<K, V> {
  set(key: K, value: V): this
  get(key: K): V | undefined
  has(key: K): boolean
  delete(key: K): boolean
  
  keys(): IterableIterator<K>
  values(): IterableIterator<V>
}

// Key Properties:
// - Keys iterated in sorted order
// - All ops O(log n) guaranteed
// - No duplicate keys
// - Maintains sort invariant
```

### Heap Contract

```typescript
interface Heap<T> {
  push(element: T): number
  pop(): T | undefined
  peek(): T | undefined
  
  size: number
}

// Heap Properties:
// - MinHeap: parent <= children
// - MaxHeap: parent >= children
// - push() and pop() O(log n)
// - peek() O(1)
// - NOT sorted when iterated (only heap order)
```

### Graph Contract

```typescript
interface Graph<V, E = number> {
  addVertex(vertex: V): boolean
  addEdge(from: V, to: V, weight?: E): boolean
  hasVertex(vertex: V): boolean
  hasEdge(from: V, to: V): boolean
  
  dijkstra(start: V, end?: V): any
  topologicalSort(): V[]
}

// Graph Properties:
// - Directed: edges are one-way
// - Undirected: edges are bidirectional
// - Weighted: edges have values
```

---

## Iterator Protocol Compliance

### Specification Compliance

**All structures implement ES6 Iterator Protocol:**

```typescript
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>
}

interface Iterator<T> {
  next(): IteratorResult<T>
}

interface IteratorResult<T> {
  done: boolean
  value?: T
}
```

### Iteration Order Guarantees

| Structure | Iteration Order | Deterministic |
|-----------|-----------------|---------------|
| **Stack** | Top to bottom (LIFO) | ✅ Yes |
| **Queue** | Front to back (FIFO) | ✅ Yes |
| **Deque** | First to last | ✅ Yes |
| **LinkedList** | Head to tail | ✅ Yes |
| **BST/RBTree** | In-order (sorted) | ✅ Yes |
| **Heap** | Heap order (not sorted) | ✅ Yes |
| **Trie** | Lexicographic | ✅ Yes |
| **Graph** | BFS from start vertex | ✅ Yes |

### Mutation During Iteration

**Behavior: Undefined (same as native Array)**

```typescript
const tree = new RedBlackTree([1, 2, 3]);

// ❌ Do NOT mutate during iteration
for (const item of tree) {
  if (item === 2) tree.delete(2);  // Unsafe!
}

// ✅ Do collect mutations first
const toDelete = [];
for (const item of tree) {
  if (item === 2) toDelete.push(item);
}
toDelete.forEach(item => tree.delete(item));
```

---

## Method Chaining Specification

### Chainable Operations

**Methods that return `this` support chaining:**

```typescript
structure
  .filter(predicate)
  .map(mapper)
  .reduce(reducer)
```

**Map and filter return same type to maintain structure:**

```typescript
const tree = new RedBlackTree([[1, 'a'], [2, 'b']]);

const result = tree
  .filter((v, k) => k > 1)    // Still RedBlackTree
  .map((v, k) => [k, v.toUpperCase()]);  // Still RedBlackTree

// Access tree methods still available
result.set(3, 'C');
```

### Terminal Operations

**Operations that break chain return final type:**

```typescript
structure.reduce((acc, val) => acc + val, 0)  // Returns number
structure.toArray()                            // Returns T[]
structure.find(pred)                           // Returns T | undefined
structure.some(pred)                           // Returns boolean
```

---

## Error Handling

### Error Types

**Library throws standard JavaScript errors:**

| Error Type | When | Example |
|---|---|---|
| **TypeError** | Type mismatch | Passing wrong type to generic |
| **RangeError** | Invalid index | Accessing out-of-bounds index |
| **Error** | Logic violation | Comparing incomparable items |

### Error Behavior

**No silent failures:**

```typescript
const tree = new RedBlackTree<number>();

// ✅ Throws TypeError if comparator fails
tree.set(null, 'value');  // TypeError: Cannot compare null

// ✅ Returns undefined for missing keys (safe)
tree.get(999);  // undefined (not an error)

// ✅ No exceptions for empty operations
tree.pop();     // Returns undefined (not an error)
```

### Silent vs Loud

**Silent (no exception):**
- Missing key on `.get()`
- Pop/shift from empty structure
- Failed delete (key not found)

**Loud (throws exception):**
- Type mismatch in generic
- Comparison failures
- Invalid graph operations

---

## Breaking Changes Policy

### Semantic Versioning

**Library follows SemVer 2.0:**

- **Major** (2.0.0): Breaking API changes
- **Minor** (2.1.0): New features, backward compatible
- **Patch** (2.0.1): Bug fixes, performance improvements

### Deprecation Policy

**Deprecations announced 2 versions ahead:**

```typescript
// v1.x
method() { /* old implementation */ }

// v1.x -> v2.0 (announcement release)
/**
 * @deprecated Use newMethod() instead. Will be removed in v3.0
 */
method() { /* old implementation */ }

// v3.0 (removal release)
// method() removed entirely
```

### Backward Compatibility Guarantee

**Within major version:**
- ✅ Public API guaranteed stable
- ✅ Existing code continues working
- ✅ Performance may improve
- ✅ New methods may be added
- ❌ Removed methods with deprecation notice

**Major version upgrades:**
- May include breaking changes
- Migration guide provided
- 6-month support overlap

---

## Compliance Checklist

### API Compliance

- ✅ Unified method names across all linear structures
- ✅ Type-safe generics on all structures
- ✅ Iterator protocol on all structures
- ✅ Array methods (map/filter/reduce) on all structures
- ✅ Consistent error handling

### Performance Compliance

- ✅ O(log n) guaranteed on all balanced trees
- ✅ O(1) guaranteed on Deque operations
- ✅ O(log n) heap add/remove operations
- ✅ Benchmarks published and maintained

### Browser/Runtime Compliance

- ✅ CommonJS + ESM + UMD support
- ✅ TypeScript 5.0+ support
- ✅ Node.js 16+ support
- ✅ Modern browser support (ES2020)

### Documentation Compliance

- ✅ Complete API documentation
- ✅ Real-world examples for all structures
- ✅ Performance benchmarks
- ✅ Framework integration guides

---

## Future Roadmap

### Planned (v2.x)

- [ ] AVL Tree performance optimizations
- [ ] Segment Tree completion
- [ ] Binary Indexed Tree completion
- [ ] Skip List implementation
- [ ] Performance improvements for V8 JIT

### Considering (v3.0+)

- [ ] Concurrent data structures
- [ ] Persistent (immutable) variants
- [ ] WebAssembly implementations for performance
- [ ] Java/Python ports

### Won't Implement

- ❌ Weak references (design decision)
- ❌ Async iterators (synchronous library)
- ❌ Browser storage bindings (out of scope)

---

## Related Documentation

- **[SECURITY.md](./SECURITY.md)** - Security considerations and best practices
- **[CONCEPTS.md](./CONCEPTS.md)** - Fundamental concepts and theory
- **[REFERENCE.md](./REFERENCE.md)** - Complete API reference
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance benchmarks
- **[GUIDES.md](./GUIDES.md)** - Real-world usage examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Design decisions and internals

---

**Last Updated:** January 2026  
**Maintained By:** [@zrwusa](https://github.com/zrwusa)  
**License:** MIT