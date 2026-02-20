# RFC: TreeMultiMap & TreeMultiSet (Ordered MultiMap / MultiSet)

- **Status**: Implementing
- **Target**: `data-structure-typed`
- **Last Updated**: 2026-02-20

---

## 0. Summary

This RFC specifies:

1. **TreeMultiSet** — ordered multiset (bag), backed by RedBlackTree
2. **TreeMultiMap** — ordered multimap (key → bucket), backed by RedBlackTree

Both use **composition** over RedBlackTree (not inheritance) and follow strict comparator policies.

---

## 1. Goals

- Provide ordered MultiSet and MultiMap with clear, mainstream semantics
- Align with C++ STL (`std::multiset`, `std::multimap`) and Java Guava (`TreeMultiset`, `TreeMultimap`)
- TypeScript-friendly API with strict typing
- TDD development with comprehensive tests and `@example` documentation

## 2. Non-Goals

- AVL variants (removed — no backward compatibility required)
- Node exposure (composition model hides internal tree)
- C++ iterator invalidation semantics

---

## 3. Comparator Policy (Shared)

Both TreeMultiSet and TreeMultiMap use the **same strict default comparator** as TreeSet/TreeMap:

| Type | Behavior |
|------|----------|
| `number` | Natural order; **rejects `NaN`** (`TypeError`) |
| `string` | Lexicographic order |
| `Date` | By `getTime()`; rejects invalid dates |
| `-0` / `0` | Treated as equal |
| Other | **Requires custom comparator** (`TypeError` if missing) |

---

## 4. TreeMultiSet API

### 4.1 Semantic Model

- Each element `x` has a non-negative integer count `c(x)`
- Ordered by comparator
- Default iteration is **expanded** (yields each element `c(x)` times)

### 4.2 Final API

```typescript
class TreeMultiSet<K> implements Iterable<K> {
  constructor(elements?: Iterable<K>, options?: TreeMultiSetOptions<K>);

  // ━━━ Properties ━━━
  readonly size: number;           // Total occurrences (Σ counts)
  readonly distinctSize: number;   // Number of distinct keys
  readonly comparator: Comparator<K>;

  // ━━━ Query ━━━
  isEmpty(): boolean;
  has(key: K): boolean;
  count(key: K): number;           // Returns 0 if missing

  // ━━━ Mutation ━━━
  add(key: K, n?: number): boolean;      // Add n occurrences (default 1)
  delete(key: K, n?: number): boolean;   // Remove n occurrences (default 1)
  deleteAll(key: K): boolean;            // Remove all occurrences
  setCount(key: K, n: number): boolean;  // Set exact count
  clear(): void;                         // Remove all elements

  // ━━━ Iteration ━━━
  [Symbol.iterator](): Iterator<K>;      // Expanded (each element × count)
  keysDistinct(): IterableIterator<K>;   // Unique keys only
  entries(): IterableIterator<[K, number]>;  // [key, count] pairs

  // ━━━ Conversion ━━━
  toArray(): K[];                        // Expanded array
  toDistinctArray(): K[];                // Unique keys array
  toEntries(): Array<[K, number]>;       // [key, count][]

  // ━━━ Navigable (returns K | undefined) ━━━
  first(): K | undefined;
  last(): K | undefined;
  pollFirst(): K | undefined;    // deleteAll + return
  pollLast(): K | undefined;     // deleteAll + return
  ceiling(key: K): K | undefined;  // >= key
  floor(key: K): K | undefined;    // <= key
  higher(key: K): K | undefined;   // > key
  lower(key: K): K | undefined;    // < key

  // ━━━ Functional ━━━
  forEach(callback: (key: K, count: number) => void): void;
  filter(predicate: (key: K, count: number) => boolean): TreeMultiSet<K>;
  reduce<U>(callback: (acc: U, key: K, count: number) => U, initial: U): U;
  map<K2>(mapper: (key: K, count: number) => [K2, number], options?: { comparator?: Comparator<K2> }): TreeMultiSet<K2>;
  clone(): TreeMultiSet<K>;

  // ━━━ Tree Utilities ━━━
  rangeSearch(range: [K, K], callback?: (key: K) => any): any[];
  print(): void;
}
```

### 4.3 Method Comparison

| Method | Ours | C++ multiset | Guava TreeMultiset |
|--------|:----:|:------------:|:------------------:|
| `size` | ✅ | ✅ | ✅ |
| `distinctSize` | ✅ | ❌ | ✅ |
| `comparator` | ✅ | ✅ | ✅ |
| `isEmpty` | ✅ | ✅ | ✅ |
| `has` | ✅ | ✅ | ✅ |
| `count` | ✅ | ✅ | ✅ |
| `add` | ✅ | ✅ | ✅ |
| `delete` | ✅ | ✅ | ✅ |
| `deleteAll` | ✅ | ✅ | ✅ |
| `setCount` | ✅ | ❌ | ✅ |
| `clear` | ✅ | ✅ | ✅ |
| `first/last` | ✅ | ✅ | ✅ |
| `pollFirst/pollLast` | ✅ | ❌ | ✅ |
| `ceiling/floor` | ✅ | ✅ | ❌ |
| `higher/lower` | ✅ | ✅ | ❌ |
| `forEach` | ✅ | ❌ | ❌ |
| `filter` | ✅ | ❌ | ❌ |
| `reduce` | ✅ | ❌ | ❌ |
| `map` | ✅ | ❌ | ❌ |
| `clone` | ✅ | ✅ | ❌ |
| `rangeSearch` | ✅ | ❌ | ❌ |
| `print` | ✅ | ❌ | ❌ |

---

## 5. TreeMultiMap API

### 5.1 Semantic Model

- Key `k` maps to a **bucket** `V[]` (array of values)
- Ordered by key comparator
- Bucket is a **live reference** (mutations affect container)
- Default iteration yields `[K, V[]]` bucket entries

### 5.2 Final API

```typescript
class TreeMultiMap<K, V, R = any> implements Iterable<[K, V[]]> {
  constructor(entries?: Iterable<...>, options?: TreeMultiMapOptions<K, V, R>);

  // ━━━ Properties ━━━
  readonly size: number;           // Number of distinct keys
  readonly totalSize: number;      // Total values (Σ bucket.length)
  readonly comparator: Comparator<K>;

  // ━━━ Query ━━━
  isEmpty(): boolean;
  has(key: K): boolean;
  get(key: K): V[] | undefined;    // Live bucket reference
  count(key: K): number;           // Bucket length (0 if missing)
  hasEntry(key: K, value: V, eq?: (a: V, b: V) => boolean): boolean;

  // ━━━ Mutation ━━━
  add(key: K, value: V): boolean;           // Append to bucket
  set(key: K, value: V): boolean;           // Alias for add
  set(entry: [K, V[]]): boolean;            // Set/append bucket
  setMany(entries: Iterable<...>): boolean[];
  delete(key: K): boolean;                  // Remove key + bucket
  deleteValue(key: K, value: V, eq?: ...): boolean;   // Remove first match
  deleteValues(key: K, value: V, eq?: ...): number;   // Remove all matches
  clear(): void;

  // ━━━ Iteration ━━━
  [Symbol.iterator](): Iterator<[K, V[]]>;  // Bucket entries
  keys(): IterableIterator<K>;
  values(): IterableIterator<V[]>;          // Buckets
  entriesOf(key: K): IterableIterator<[K, V]>;   // Flat entries for one key
  valuesOf(key: K): IterableIterator<V>;         // Values for one key
  flatEntries(): IterableIterator<[K, V]>;       // All flat entries

  // ━━━ Navigable (returns [K, V[]] | undefined) ━━━
  first(): [K, V[]] | undefined;
  last(): [K, V[]] | undefined;
  pollFirst(): [K, V[]] | undefined;
  pollLast(): [K, V[]] | undefined;
  ceiling(key: K): [K, V[]] | undefined;
  floor(key: K): [K, V[]] | undefined;
  higher(key: K): [K, V[]] | undefined;
  lower(key: K): [K, V[]] | undefined;

  // ━━━ Functional ━━━
  forEach(callback: (bucket: V[], key: K, map: this) => void): void;
  filter(predicate: (bucket: V[], key: K, map: this) => boolean): TreeMultiMap<K, V, R>;
  reduce<U>(callback: (acc: U, bucket: V[], key: K, map: this) => U, initial: U): U;
  map<V2>(mapper: (bucket: V[], key: K, map: this) => [K, V2[]]): TreeMultiMap<K, V2, R>;
  clone(): TreeMultiMap<K, V, R>;

  // ━━━ Tree Utilities ━━━
  rangeSearch(range: [K, K], callback?: (node: ...) => any): any[];
  print(): void;
}
```

### 5.3 Method Comparison

| Method | Ours | C++ multimap | Guava TreeMultimap |
|--------|:----:|:------------:|:------------------:|
| `size` | ✅ | ✅ | ✅ |
| `totalSize` | ✅ | ✅ | ✅ |
| `comparator` | ✅ | ✅ | ✅ |
| `isEmpty` | ✅ | ✅ | ✅ |
| `has` | ✅ | ✅ | ✅ |
| `get` | ✅ | ✅ | ✅ |
| `count` | ✅ | ✅ | ✅ |
| `hasEntry` | ✅ | ❌ | ✅ |
| `add` | ✅ | ✅ | ✅ |
| `set` | ✅ | ❌ | ✅ |
| `setMany` | ✅ | ❌ | ✅ |
| `delete` | ✅ | ✅ | ✅ |
| `deleteValue` | ✅ | ❌ | ✅ |
| `deleteValues` | ✅ | ❌ | ❌ |
| `clear` | ✅ | ✅ | ✅ |
| `flatEntries` | ✅ | ✅ | ✅ |
| `first/last` | ✅ | ✅ | ❌ |
| `pollFirst/pollLast` | ✅ | ❌ | ❌ |
| `ceiling/floor` | ✅ | ✅ | ❌ |
| `higher/lower` | ✅ | ✅ | ❌ |
| `forEach` | ✅ | ❌ | ❌ |
| `filter` | ✅ | ❌ | ❌ |
| `reduce` | ✅ | ❌ | ❌ |
| `map` | ✅ | ❌ | ❌ |
| `clone` | ✅ | ✅ | ❌ |
| `rangeSearch` | ✅ | ❌ | ❌ |
| `print` | ✅ | ❌ | ❌ |

---

## 6. Implementation Plan

### 6.1 TDD Approach

1. **Write tests first** for each method group
2. **Implement** to pass tests
3. **Add `@example`** JSDoc with runnable examples
4. **Benchmark** after implementation complete

### 6.2 Coverage Target

| Module | Target |
|--------|--------|
| TreeMultiSet | **100%** |
| TreeMultiMap | **100%** |

All branches, statements, and edge cases must be covered.

### 6.3 Phase 1: TreeMultiSet Updates

| Task | Status |
|------|--------|
| Add `clear()` | 🔲 TODO |
| Add `first()`, `last()` | 🔲 TODO |
| Add `pollFirst()`, `pollLast()` | 🔲 TODO |
| Add `ceiling()`, `floor()`, `higher()`, `lower()` | 🔲 TODO |
| Add `forEach()` | 🔲 TODO |
| Add `filter()` | 🔲 TODO |
| Add `reduce()` | 🔲 TODO |
| Add `map()` with count merge | 🔲 TODO |
| Add `clone()` | 🔲 TODO |
| Add `rangeSearch()` | 🔲 TODO |
| Add `print()` | 🔲 TODO |
| Add `@example` for all methods | 🔲 TODO |
| Unit tests (TDD) | 🔲 TODO |

### 6.4 Phase 2: TreeMultiMap Updates

| Task | Status |
|------|--------|
| Simplify navigable methods (remove `*Entry` variants) | 🔲 TODO |
| Update `first/last/ceiling/floor/higher/lower` to return `[K, V[]]` | 🔲 TODO |
| Remove legacy tree API (keep only `rangeSearch`, `print`) | 🔲 TODO |
| Add `@example` for all methods | 🔲 TODO |
| Unit tests (TDD) | 🔲 TODO |

### 6.5 Phase 3: Cleanup & Benchmarks

| Task | Status |
|------|--------|
| Delete AVL/Counter variants | 🔲 TODO |
| Update exports in `index.ts` | 🔲 TODO |
| Run full test suite | 🔲 TODO |
| Benchmark vs js-sdsl, native Map | 🔲 TODO |
| Update documentation | 🔲 TODO |

---

## 7. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| TreeMultiSet navigable returns | `K` | Set semantics — user wants element, call `count()` if needed |
| TreeMultiMap navigable returns | `[K, V[]]` | Map semantics — key alone not useful without bucket |
| TreeMultiSet `pollFirst/pollLast` | `deleteAll` | Consistent with navigable — removes entire key |
| TreeMultiSet `map()` collision | Merge counts (add) | MultiSet semantics — more mappings = more occurrences |
| Bucket mutation | Live reference | Documented behavior, no auto-cleanup |
| AVL variants | Removed | User decision: no backward compatibility needed |

---

## 8. Example Usage

### TreeMultiSet

```typescript
const scores = new TreeMultiSet([100, 95, 100, 87, 95, 100]);
// { 87: 1, 95: 2, 100: 3 }

scores.size;          // 6 (total)
scores.distinctSize;  // 3 (unique)
scores.count(100);    // 3
scores.first();       // 87
scores.last();        // 100
scores.ceiling(90);   // 95

// Functional
const highScores = scores.filter((k, c) => k >= 95);
// { 95: 2, 100: 3 }

const doubled = scores.map((k, c) => [k * 2, c]);
// { 174: 1, 190: 2, 200: 3 }
```

### TreeMultiMap

```typescript
const inventory = new TreeMultiMap<string, string>();
inventory.add('fruit', 'apple');
inventory.add('fruit', 'banana');
inventory.add('vegetable', 'carrot');

inventory.size;       // 2 (keys)
inventory.totalSize;  // 3 (values)
inventory.get('fruit');  // ['apple', 'banana']

inventory.first();    // ['fruit', ['apple', 'banana']]
inventory.ceiling('meat');  // ['vegetable', ['carrot']]

// Flat iteration
for (const [k, v] of inventory.flatEntries()) {
  console.log(k, v);  // 'fruit' 'apple', 'fruit' 'banana', ...
}
```

---

## 9. Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| `get(k)` returns live or copy? | **Live** — documented |
| Default iteration expanded? | **Yes** for TreeMultiSet |
| Naming `deleteAll` vs `removeAll`? | **`deleteAll`** — consistent with existing API |
