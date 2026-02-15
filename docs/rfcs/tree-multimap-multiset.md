# RFC: TreeMultiMap & TreeMultiSet (Ordered MultiMap / MultiSet)

- Status: Draft
- Target: `data-structure-typed`
- Motivation: align the library’s higher-level “multi” containers with mainstream semantics (C++ STL + Java/Guava), while keeping the project’s API style and internal binary-tree performance characteristics.

> Notes
>
> - C++ provides these containers in the standard library (`std::multimap`, `std::multiset`).
> - Java (JDK) does **not** provide them in the standard library; the de-facto standard is Guava (`Multimap`, `Multiset`).

---

## 0. Summary

This RFC specifies:

1) **TreeMultiSet** (ordered multiset / bag)
   - Semantic alignment: C++ `std::multiset<T>` and Guava `Multiset<E>`
   - Recommended implementation: **composition** over an ordered map structure (TreeMap / RedBlackTree).

2) **TreeMultiMap** (ordered multimap)
   - Semantic alignment: C++ `std::multimap<K,V>` (capabilities), and common Java practice `Map<K, List<V>>` / Guava `Multimap`.
   - Recommended implementation: keep current **bucketed** design (tree key unique, bucket stores multiple values), but provide **flat-entry views** for a C++-like experience.

---

## 1. Goals

- Provide ordered MultiSet and MultiMap containers with clear, mainstream semantics.
- Keep project API style (TypeScript-friendly, ergonomic methods, explicit options).
- Ensure predictable complexity and avoid semantic footguns.
- Allow internal tree optimizations (e.g. MapMode) to benefit these higher-level containers.

## 2. Non-goals

- Recreating C++ iterator invalidation rules.
- Forcing an “entry-flat” multimap/multiset internal model (C++-style duplicates as tree nodes).
- Requiring AVL variants for these containers.

---

## 3. Terminology

- **occurrence**: one instance of an element in a multiset.
- **distinct element**: a key with count > 0.
- **bucket**: `V[]` list associated with a key in a bucketed multimap.

---

## 4. TreeMultiSet: semantics and API

### 4.0 Comparator + typing policy

TreeMultiSet follows the **same strict default comparator policy** as TreeSet/TreeMap:

- Supported by default comparator: `number | string | Date`
- Rejects `NaN` (`TypeError`)
- Treats `-0` and `0` as equal
- `Date` ordered by `getTime()` and rejects invalid dates (`TypeError`)

Typing policy:

- When **no custom comparator** is provided, TreeMultiSet should be typed as `T extends number | string | Date`.
- When a **custom comparator** is provided, TreeMultiSet may be used with arbitrary `T`.

Implementation should use **constructor overloads** (no factory function) to keep `new TreeMultiSet(...)` consistent with the rest of the library.

### 4.1 Semantic model

TreeMultiSet is an **ordered multiset** over `T`:

- Each element `x` has a non-negative integer count `c(x)`.
- The container’s ordering is by element comparator.

### 4.2 Key decisions (from discussion)

1) **Default iteration is expanded** (C++/Guava-aligned)
   - Iterating the multiset yields each element `x` exactly `c(x)` times.

2) **`delete(x)` removes one occurrence** by default
   - Removing all occurrences uses a dedicated method (`deleteAll(x)` / `removeAll(x)`).

3) **`size` counts total occurrences**
   - `size === Σ c(x)` across all distinct elements.

4) **Expose `distinctSize`**
   - `distinctSize` counts distinct elements (keys with `c(x)>0`).

### 4.3 Suggested API surface (project style)

```ts
class TreeMultiSet<T> implements Iterable<T> {
  // state
  readonly size: number;         // total occurrences (sumCounts)
  readonly distinctSize: number; // number of distinct keys

  // core ops
  add(x: T, n = 1): boolean;
  count(x: T): number;           // returns 0 when missing
  has(x: T): boolean;

  delete(x: T, n = 1): boolean;  // remove n occurrences
  deleteAll(x: T): boolean;      // remove all occurrences
  setCount(x: T, n: number): boolean; // Guava-style useful primitive

  // views
  entries(): Iterable<[T, number]>;    // distinct view (element,count)
  keysDistinct(): Iterable<T>;         // distinct keys

  // navigation (ordered)
  first(): T | undefined;
  last(): T | undefined;
  ceiling(x: T): T | undefined;
  floor(x: T): T | undefined;
  higher(x: T): T | undefined;
  lower(x: T): T | undefined;

  // iteration
  [Symbol.iterator](): Iterator<T>; // expanded by default
}
```

### 4.4 Implementation recommendation

Prefer **composition**:

- Internal: `TreeMap<T, number>` (or a `RedBlackTree<T, number>` with map semantics)
- Store the count as the map value.
- Maintain `size` as a separate accumulator (sumCounts).

Rationale:
- Clean semantics: MultiSet is conceptually `OrderedMap<T, number>`.
- Avoid exposing node APIs.
- Enables MapMode fast paths for `has/count` when desired.

### 4.5 AVL variants

AVL-based MultiSet variants are not required. If present today, they may be deprecated/removed to reduce maintenance.

---

## 5. TreeMultiMap: semantics and API

### 5.1 Semantic model

TreeMultiMap associates a key `k` with a **bucket** of values `V[]`.

This is the “bucketed” model: the tree stores each key once, and duplicates live in the bucket.

### 5.2 Key decisions

1) **Bucket type is `Array` by default**
   - Allows duplicate values and is cache-friendly.
   - (A `Set` bucket would become a different semantic container: SetMultimap.)

2) Provide a **flat-entry view** for C++-like iteration
   - C++ `std::multimap` is entry-flat (tree supports duplicate keys).
   - Bucketed TreeMultiMap can still provide equivalent capabilities for most use cases via:
     - `flatEntries()` → `(k,v)` entries expanded
     - `entriesOf(key)` / `equalRange(key)` → entries for a single key

### 5.3 Suggested API surface (project style)

```ts
class TreeMultiMap<K, V> {
  // core ops
  add(key: K, value: V): boolean;           // append to bucket
  get(key: K): V[] | undefined;             // bucket (live view) OR copy (decision to document)
  has(key: K): boolean;
  count(key: K): number;                    // bucket length

  delete(key: K): boolean;                  // remove whole bucket
  deleteValue(key: K, value: V): boolean;   // remove one matching value

  // views
  entries(): Iterable<[K, V[]]>;            // bucket view
  flatEntries(): Iterable<[K, V]>;          // entry-flat view
  entriesOf(key: K): Iterable<[K, V]>;      // equalRange-style view
}
```

### 5.4 Implementation recommendation

Bucketed design is acceptable and idiomatic in JS/TS. Prefer composition over a TreeMap/RBT if it simplifies semantics; otherwise, ensure bucket behavior is well-documented.

---

## 6. Documentation requirements

- Clearly document:
  - TreeMultiSet iteration is **expanded by default**.
  - TreeMultiSet `delete(x)` removes **one occurrence**.
  - TreeMultiSet `size` is **sumCounts** and `distinctSize` exists.
  - TreeMultiMap bucket is an `Array` by default and supports duplicates.
  - Whether `TreeMultiMap.get(k)` returns a live bucket reference or a copy.

---

## 7. Open questions

1) Should `TreeMultiMap.get(k)` return a live bucket reference, or a copy?
2) Should MultiSet expose both expanded and distinct iteration as separate named methods (recommended), and which should be default?
3) Naming: `deleteAll` vs `removeAll` consistency with existing containers.
