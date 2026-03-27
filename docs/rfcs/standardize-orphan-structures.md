# RFC: Standardize SegmentTree, BinaryIndexedTree, Matrix, SkipList

**Status**: Draft  
**Date**: 2026-03-26  
**Author**: 大菠萝 + Pablo

## Design Philosophy

Three guiding rules for all design decisions in this RFC:

1. **Functionality aligns with the best standard implementations** — regardless of language. Java, C++, Python — pick whichever has the most battle-tested, authoritative version of each data structure. We match their feature set.

2. **API style aligns with our own design identity** — method names, parameter conventions, and patterns follow our library's established style (ES6-native naming, `set/get/delete`, chaining via `this` return, etc.), not the reference language's style.

3. **Follow our 5 core traits where they fit — don't force them** — if Iterator Protocol or `map/filter/reduce` doesn't make semantic sense for a structure (e.g., SegmentTree), omit it deliberately. The goal is a natural, coherent API, not checkbox compliance.

## Library Core Traits

Every data structure in this library must follow these 5 core traits where semantically appropriate:

1. **Unified API** — All linear structures use `push/pop/shift/unshift`. All structures support `map/filter/reduce/find/some/every/forEach` where semantically appropriate. Method names follow ES6 conventions (Array/Map/Set).

2. **Iterator Protocol** — Every container implements `[Symbol.iterator]()`. Users can `for...of`, `[...spread]`, `Array.from()`, and destructure any data structure. Zero friction interoperability with native JS.

3. **Method Chaining** — `filter().map().reduce()` preserves the original structure type instead of degrading to Array. Operations stay on the data structure, keeping its algorithmic properties.

4. **Generics `<E, R>` + `toElementFn`/`toEntryFn`** — All containers accept generic type parameters. The `R` (raw) type with transform functions enables construction from arbitrary objects without pre-mapping.

5. **Zero Learning Curve** — API mirrors ES6 natives as closely as possible. If you know Array/Map/Set, you already know 80% of the API. No Java-style `offer()`/`poll()` naming.

These traits define our library's DNA. Where a trait doesn't apply semantically (e.g., `map/filter` on SegmentTree), it should be omitted — but the omission must be deliberate, not accidental.

## Trait Applicability Matrix

Not all traits apply to all structures. This table defines what's required vs deliberately omitted:

| Trait | SkipList | SegmentTree | BinaryIndexedTree | Matrix | Rationale |
|---|---|---|---|---|---|
| `Iterable` | ✅ Required | ✅ Required | ✅ Required | ✅ Required | Traversal is fundamental for all |
| `map/filter/reduce` | ✅ Required | ❌ Skip | ❌ Skip | `map` only | SkipList is a collection; "filter a segment tree" has no meaning; Matrix map(num→num) is natural |
| `size` | ✅ Required | ✅ Required | ✅ Required | ✅ Required | Basic property |
| `clone/toArray` | ✅ Required | ✅ Required | ✅ Required | ✅ Required | Basic capability |
| Generics `<E, R>` | ✅ `<K,V,R>` | ✅ `<E>` | ❌ Skip | ❌ Skip | BIT and Matrix are inherently number-only |
| `toEntryFn`/`toElementFn` | ✅ Required | ❌ Skip | ❌ Skip | ❌ Skip | Only SkipList needs object→entry construction |
| `comparator` | ✅ Required | N/A | N/A | N/A | Only ordered containers need custom ordering |
| Method chaining | ✅ Required | ❌ Skip | ❌ Skip | ❌ Skip | SkipList `set()` returns `this`; SegmentTree `update()` returns void is more natural |

**Summary**: SkipList gets all 5 traits (it's a collection, same as TreeMap). The other three get Iterable + size/clone/toArray as baseline, plus only what makes semantic sense.

## Motivation

Four data structures in the library exist as "orphans" — they don't follow these core design principles. This RFC proposes bringing them up to standard.

### Current State

| Capability | TreeMap/HashMap/Heap | SegmentTree | BinaryIndexedTree | Matrix | SkipList |
|---|---|---|---|---|---|
| `Iterable` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `map/filter/reduce` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `size` | ✅ | ❌ | ❌ | ✅ (rows/cols) | ❌ |
| `clone()` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `toArray()` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Generics | ✅ | ❌ | ❌ | ❌ | `<K,V>` partial |
| `toElementFn`/`toEntryFn` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `comparator` | ✅ | N/A | N/A | N/A | ❌ |
| Correctness bugs | ✅ | ✅ | ✅ | ❌ (0-value, transpose) | ❌ (no key update) |

## Reference Implementations

Functionality aligns with these battle-tested implementations; API style stays ours.

| Structure | Reference | Why |
|---|---|---|
| **SkipList** | Java `ConcurrentSkipListMap` (`NavigableMap` interface) | SkipList and TreeMap share the same interface — users can swap freely |
| **SegmentTree** | AtCoder Library (C++) `segtree<S, op, e>` | Cleanest generic segment tree: custom merge + identity + binary search on tree |
| **BinaryIndexedTree** | C++ standard Fenwick Tree | Array-based, prefix sum + point update, the universally accepted implementation |
| **Matrix** | Keep lightweight; fix bugs | Not competing with NumPy/mathjs — just a correct, minimal matrix utility |

---

## 1. SkipList Redesign

### Goal
Align API with our `TreeMap` so users can swap `TreeMap` ↔ `SkipList` with zero code changes.

### Reference: Java NavigableMap
Java's `ConcurrentSkipListMap` implements `NavigableMap<K,V>`, same interface as `TreeMap`.

### API Changes

```typescript
// Before
class SkipList<K, V> {
  add(key: K, value: V): void;        // doesn't update existing keys
  get(key: K): V | undefined;
  delete(key: K): boolean;
  higher(key: K): V | undefined;      // returns value, not entry
  lower(key: K): V | undefined;
  get first(): V | undefined;         // getter, inconsistent
  get last(): V | undefined;
}

// After — mirrors TreeMap API exactly
class SkipList<K = any, V = any, R = [K, V]> implements Iterable<[K, V | undefined]> {
  constructor(elements?: Iterable<R>, options?: SkipListOptions<K, V, R>);

  // Core CRUD (same as TreeMap)
  set(key: K, value: V): this;        // upsert, returns this for chaining
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean;

  // Size & lifecycle
  get size(): number;
  isEmpty(): boolean;
  clear(): void;
  clone(): SkipList<K, V, R>;

  // Navigation (same as TreeMap)
  first(): [K, V | undefined] | undefined;      // method, returns entry tuple
  last(): [K, V | undefined] | undefined;
  pollFirst(): [K, V | undefined] | undefined;
  pollLast(): [K, V | undefined] | undefined;
  ceiling(key: K): [K, V | undefined] | undefined;
  floor(key: K): [K, V | undefined] | undefined;
  higher(key: K): [K, V | undefined] | undefined;
  lower(key: K): [K, V | undefined] | undefined;
  rangeSearch(range: [K, K], options?: RangeOptions): [K, V | undefined][];

  // Iteration (Iterator protocol)
  [Symbol.iterator](): IterableIterator<[K, V | undefined]>;
  keys(): IterableIterator<K>;
  values(): IterableIterator<V | undefined>;
  entries(): IterableIterator<[K, V | undefined]>;
  forEach(callback: (value: V | undefined, key: K, map: this) => void, thisArg?: any): void;

  // Functional (same as TreeMap)
  map<NK, NV>(callback: (value: V | undefined, key: K) => [NK, NV], options?: SkipListOptions<NK, NV>): SkipList<NK, NV>;
  filter(predicate: (value: V | undefined, key: K) => boolean): SkipList<K, V>;
  reduce<U>(callback: (acc: U, value: V | undefined, key: K) => U, initialValue: U): U;
  find(predicate: (value: V | undefined, key: K) => boolean): [K, V | undefined] | undefined;
  every(predicate: (value: V | undefined, key: K) => boolean): boolean;
  some(predicate: (value: V | undefined, key: K) => boolean): boolean;

  // Conversion
  toArray(): [K, V | undefined][];
  print(): void;
}

interface SkipListOptions<K, V, R> {
  comparator?: (a: K, b: K) => number;
  toEntryFn?: (raw: R) => [K, V];
  maxLevel?: number;       // default 16
  probability?: number;    // default 0.5
}
```

### SkipListSet (new class)

Mirrors `TreeSet` API, backed by SkipList internally. Reference: Java `ConcurrentSkipListSet`.

```typescript
class SkipListSet<K = any, R = K> implements Iterable<K> {
  constructor(elements?: Iterable<R>, options?: SkipListSetOptions<K, R>);

  // Core (same as TreeSet)
  add(key: K): this;
  has(key: K): boolean;
  delete(key: K): boolean;

  // Size & lifecycle
  get size(): number;
  isEmpty(): boolean;
  clear(): void;
  clone(): SkipListSet<K, R>;

  // Navigation (same as TreeSet)
  first(): K | undefined;
  last(): K | undefined;
  pollFirst(): K | undefined;
  pollLast(): K | undefined;
  ceiling(key: K): K | undefined;
  floor(key: K): K | undefined;
  higher(key: K): K | undefined;
  lower(key: K): K | undefined;
  rangeSearch(range: [K, K], options?: RangeOptions): K[];

  // Iteration + functional
  [Symbol.iterator](): IterableIterator<K>;
  keys(): IterableIterator<K>;
  values(): IterableIterator<K>;
  entries(): IterableIterator<[K, K]>;
  forEach(callback: (value: K, key: K, set: this) => void, thisArg?: any): void;
  map<NK>(callback: (value: K) => NK, options?: SkipListSetOptions<NK>): SkipListSet<NK>;
  filter(predicate: (value: K) => boolean): SkipListSet<K>;
  reduce<U>(callback: (acc: U, value: K) => U, initialValue: U): U;
  find(predicate: (value: K) => boolean): K | undefined;
  every(predicate: (value: K) => boolean): boolean;
  some(predicate: (value: K) => boolean): boolean;
  toArray(): K[];
  print(): void;
}

interface SkipListSetOptions<K, R = K> {
  comparator?: (a: K, b: K) => number;
  toElementFn?: (raw: R) => K;
  maxLevel?: number;
  probability?: number;
}
```

### Key Semantics
- **Unique keys only** — `set()` with existing key updates the value (same as TreeMap). No duplicate keys. If multi-value is needed, use TreeMultiMap.

### Internal Changes
- Track `_size` on add/delete
- `set()` updates value if key exists (currently `add()` inserts duplicate)
- Support custom `comparator` (currently uses `<` operator)
- Ordered iteration via level-0 forward pointers

### Breaking Changes
- `add(key, value)` → `set(key, value)` (returns `this` instead of `void`)
- `first`/`last` change from getter to method, return `[K, V]` tuple instead of `V`
- `higher`/`lower` return `[K, V]` tuple instead of `V`

---

## 2. SegmentTree Redesign

### Goal
Generic merge function support (sum/min/max/gcd/custom). Align with AtCoder Library's proven design.

### Reference: AtCoder Library `segtree<S, op, e>`
```cpp
segtree<S, op, e> seg(n);    // S=type, op=merge, e=identity
seg.set(i, x);               // point update
seg.get(i);                   // point query
seg.prod(l, r);               // range query [l, r)
seg.max_right(l, f);          // binary search: max r where f(prod(l,r)) is true
seg.min_left(r, f);           // binary search: min l where f(prod(l,r)) is true
```

### API Changes

```typescript
// Before
class SegmentTree {
  constructor(values: number[], start?: number, end?: number);
  build(start: number, end: number): SegmentTreeNode;
  updateNode(index: number, sum: number, value?: SegmentTreeNodeVal): void;
  querySumByRange(indexA: number, indexB: number): number;
}

// After — generic with standard API
class SegmentTree<E = number> implements Iterable<E> {
  constructor(elements: E[], options: SegmentTreeOptions<E>);

  // Core operations
  update(index: number, value: E): void;       // point update
  query(start: number, end: number): E;         // range query [start, end] inclusive
  get(index: number): E;                        // single element access

  // Binary search on tree (from ACL — finds boundary where predicate flips)
  maxRight(left: number, predicate: (segValue: E) => boolean): number;
  minLeft(right: number, predicate: (segValue: E) => boolean): number;

  // Convenience factories
  static sum(elements: number[]): SegmentTree<number>;
  static min(elements: number[]): SegmentTree<number>;
  static max(elements: number[]): SegmentTree<number>;

  // Standard interface
  get size(): number;
  isEmpty(): boolean;
  clone(): SegmentTree<E>;
  toArray(): E[];
  [Symbol.iterator](): IterableIterator<E>;     // iterates leaf values
  forEach(callback: (value: E, index: number) => void): void;
  print(): void;
}

interface SegmentTreeOptions<E> {
  merger: (a: E, b: E) => E;     // required: how to combine two segments
  identity: E;                    // required: identity element for merger
}

// Convenience factories (covers 90% of use cases):
const sumTree = SegmentTree.sum([1, 2, 3, 4]);
const minTree = SegmentTree.min([5, 2, 8, 1]);
const maxTree = SegmentTree.max([5, 2, 8, 1]);

// Generic constructor (advanced — custom merge functions):
const gcdTree = new SegmentTree([12, 8, 6], {
  merger: (a, b) => gcd(a, b),
  identity: 0
});
```

### Internal Changes
- Replace `SegmentTreeNode` class with flat array representation (2*n space, faster)
- Remove `SegmentTreeNodeVal` type — the generic `E` replaces it
- Internal: `_tree: E[]` array, `_n: number` (leaf count)

### Breaking Changes
- Constructor signature completely changes
- `querySumByRange` → `query`
- `updateNode` → `update` (simpler signature)
- `SegmentTreeNode` class removed (internal flat array)

### Phase 2 (future): Lazy Propagation
```typescript
class LazySegmentTree<E, F> extends SegmentTree<E> {
  constructor(elements: E[], options: LazySegmentTreeOptions<E, F>);
  rangeUpdate(start: number, end: number, f: F): void;
}
```

---

## 3. BinaryIndexedTree Refactor

### Goal
Standard Fenwick Tree implementation with array internals and cleaner API.

### Reference: C++ standard Fenwick Tree

### API Changes

```typescript
// Before
class BinaryIndexedTree {
  constructor({ frequency, max }: { frequency?: number; max: number });
  readSingle(index: number): number;
  writeSingle(index: number, freq: number): void;
  update(position: number, change: number): void;
  read(count: number): number;
  getPrefixSum(i: number): number;
  lowerBound(sum: number): number;
  upperBound(sum: number): number;
}

// After — cleaner naming, array internals
class BinaryIndexedTree implements Iterable<number> {
  constructor(size: number);
  constructor(elements: number[]);

  // Core operations
  update(index: number, delta: number): void;     // point update: add delta
  set(index: number, value: number): void;         // point set: absolute value
  get(index: number): number;                      // single element value
  query(index: number): number;                    // prefix sum [0, index]
  queryRange(start: number, end: number): number;  // range sum [start, end]

  // Binary search (requires all frequencies ≥ 0; behavior undefined for negative values)
  lowerBound(sum: number): number;
  upperBound(sum: number): number;

  // Standard interface
  get size(): number;
  isEmpty(): boolean;
  clear(): void;
  clone(): BinaryIndexedTree;
  toArray(): number[];                             // frequency array
  [Symbol.iterator](): IterableIterator<number>;   // iterates frequencies
  forEach(callback: (value: number, index: number) => void): void;
  print(): void;
}
```

### Internal Changes
- Replace `Record<number, number>` freqMap with `number[]` array
- Remove `_freq` default frequency concept (confusing, non-standard)
- Remove `_negativeCount` tracking (rarely used, adds complexity)
- Remove `_msb` caching (recompute is negligible)

### Breaking Changes
- Constructor: `{ max, frequency }` → `new BinaryIndexedTree(size)` or `new BinaryIndexedTree(array)`
- `readSingle` → `get`
- `writeSingle` → `set`
- `getPrefixSum` → `query`
- `read` removed (was confusing alias for prefix sum)
- Default frequency concept removed

---

## 4. Matrix Bug Fixes + Minimal Improvements

### Goal
Fix correctness bugs, add minimal standard interfaces. Not competing with NumPy — stays lightweight.

### Bug Fixes (Critical)

```typescript
// Bug 1: 0-value treated as falsy
// Before (broken):
if (added) { resultData[i][j] = added; }       // skips 0!
if (subtracted) { resultData[i][j] = subtracted; } // skips 0!

// After (correct):
if (added !== undefined) { resultData[i][j] = added; }
if (subtracted !== undefined) { resultData[i][j] = subtracted; }

// Bug 2: transpose only works for square matrices
// Before (broken):
if (this.data.some(row => row.length !== this.rows))  // checks row.length === rows (square only)

// After (correct):
if (this.data.some(row => row.length !== this.cols))   // checks rectangular consistency
```

### API Additions

```typescript
class Matrix {
  // Existing (keep all)
  // ...

  // New: standard interfaces
  get size(): [number, number];                    // [rows, cols] tuple
  isEmpty(): boolean;
  toArray(): number[][];                           // same as data, but defensive copy
  forEach(callback: (value: number, row: number, col: number) => void): void;
  [Symbol.iterator](): IterableIterator<number[]>; // iterates rows

  // New: factory methods
  static zeros(rows: number, cols: number): Matrix;
  static identity(n: number): Matrix;
  static from(data: number[][]): Matrix;

  // New: utility
  flatten(): number[];                             // row-major flat array
  map(callback: (value: number, row: number, col: number) => number): Matrix;  // always number → number, returns Matrix
}
```

### Not Doing
- Generic types (Matrix is always `number`)
- Full NumPy-style broadcasting
- Sparse matrix support

---

## Implementation Order

### Phase 1: Bug Fixes (patch release)
1. Matrix: fix 0-value bug in `add`/`subtract`
2. Matrix: fix `transpose` to support rectangular matrices
3. SkipList: fix `add` to update existing keys

### Phase 2: SkipList Redesign (minor release)
- Full rewrite to align with TreeMap API
- This has the highest user value — makes SkipList actually usable
- Also add `SkipListSet<K>` — mirrors `TreeSet` API, backed by SkipList (ref: Java `ConcurrentSkipListSet`)

### Phase 3: SegmentTree Redesign (minor release)
- Generic merge function
- Flat array internals
- `maxRight`/`minLeft` binary search

### Phase 4: BinaryIndexedTree Refactor (minor release)
- Array internals
- Cleaner API naming

### Phase 5: Matrix Improvements + Documentation (minor release)
- Standard interfaces
- Factory methods
- Documentation updates (see below)

### Phase 5 Documentation Checklist

All four structures are currently absent from key documentation. Must update:

**OVERVIEW.md**:
- Add to Quick Reference Table:
  | SegmentTree | Range queries | O(log n) query/update | O(n) |
  | BinaryIndexedTree | Prefix sums | O(log n) query/update | O(n) |
  | Matrix | Matrix arithmetic | O(n²) add, O(n³) multiply | O(n²) |
  | SkipList | Sorted key-value (probabilistic) | O(log n) avg all ops | O(n log n) |
- Add API sections with code examples for each structure

**CONCEPTS.md**:
- Add plain language explanations to the metaphor table
- Add to Decision Guide:
  ```
  Need range queries on array?
    ↓
    Yes → SegmentTree (O(log n) query + update)
    Only prefix sums? → BinaryIndexedTree (simpler, less memory)
    No → Continue

  Need sorted map with probabilistic balance?
    ↓
    Yes → SkipList (simpler than RBT, good average case)
    Need guaranteed O(log n)? → TreeMap (Red-Black Tree backed)
    No → Continue
  ```

**ARCHITECTURE.md**:
- Add SkipList to "Self-Balancing Strategy" section (probabilistic vs deterministic balancing)
- Add SegmentTree/BIT to a new "Range Query Structures" section

**README.md**:
- Add SkipList, SegmentTree, BinaryIndexedTree, Matrix to the data structures table

---

## Migration Guide (for users)

### SkipList
```typescript
// Before
const sl = new SkipList<number, string>();
sl.add(1, 'a');
sl.first;                    // 'a' (value only)
sl.higher(0);                // 'a' (value only)

// After
const sl = new SkipList<number, string>();
sl.set(1, 'a');              // add → set, returns this
sl.first();                  // [1, 'a'] (entry tuple, method not getter)
sl.higher(0);                // [1, 'a'] (entry tuple)
for (const [k, v] of sl) {} // now iterable!
```

### SegmentTree
```typescript
// Before
const st = new SegmentTree([1, 2, 3]);
st.querySumByRange(0, 2);   // 6

// After
const st = new SegmentTree([1, 2, 3], {
  merger: (a, b) => a + b,
  identity: 0
});
st.query(0, 2);             // 6
// Now supports min/max/gcd too!
```

### BinaryIndexedTree
```typescript
// Before
const bit = new BinaryIndexedTree({ max: 10 });
bit.update(3, 5);
bit.readSingle(3);          // 5
bit.getPrefixSum(3);

// After
const bit = new BinaryIndexedTree(10);
bit.update(3, 5);
bit.get(3);                  // 5
bit.query(3);                // prefix sum
```
