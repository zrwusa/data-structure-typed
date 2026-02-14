# RFC: TreeSet and TreeMap (RedBlackTree-backed, restricted API)

- **Status:** Draft
- **Target release:** TBD
- **Authors:** TBD
- **Last updated:** 2026-02-14

## 0. Summary

Introduce two new public data structures:

- `TreeSet<K>`: an **ordered set** (unique keys)
- `TreeMap<K, V>`: an **ordered map** (key → value)

Both are implemented as **restricted API views** over an internal `RedBlackTree` core. The main goal is to provide a **standard-library-style entry point** (Set/Map semantics) while keeping existing `RedBlackTree` / `AVLTree` / `BST` APIs intact.

Key principles:

- **No algorithm fork:** do not duplicate tree algorithms into separate implementations.
- **Composition over inheritance:** prefer wrapping a `RedBlackTree` instance over subclassing it.
- **API clarity:** Set-like methods are not exposed on Map (and vice versa) in the new types.
- **Compatibility:** existing exports remain unchanged.

## 1. Motivation

### 1.1 Problems today

- Users often want “an ordered set” or “an ordered map” but are presented with multiple tree types (`BST`, `AVLTree`, `RedBlackTree`) and additional internal modes (e.g. MapMode/Node Mode).
- The current tree APIs can be used in both key-only and key-value styles, but the intent is not always obvious.
- Documentation and examples may mix “set” and “map” semantics, increasing cognitive load.

### 1.2 Goals

- Provide **simple, standard names**: `TreeSet` and `TreeMap`.
- Provide **restricted, intention-revealing APIs**:
  - `TreeSet` exposes `add/has/delete` style methods and iterates keys.
  - `TreeMap` exposes `set/get/has/delete` style methods and iterates entries.
- Keep internals stable and avoid regressions by **reusing `RedBlackTree`**.

### 1.3 Non-goals

- Do **not** remove or rename existing tree structures (`BST`, `AVLTree`, `RedBlackTree`).
- Do **not** enforce hard runtime privacy for `RedBlackTree` methods if users intentionally bypass types.
- Do **not** attempt to make a cross-language claim that JS should match C++ performance.

## 2. Proposed API

> This section is a proposal. Final names and method signatures must be confirmed.

### 2.1 TreeSet<K>

Minimal surface (Set-like):

- `constructor(elements?: Iterable<K>, options?: TreeSetOptions<K>)`
- `add(key: K): this` (native Set semantics; inserting an existing key is a no-op)
- `has(key: K): boolean`
- `delete(key: K): boolean`
- `clear(): void`
- `get size(): number`
- `keys(): IterableIterator<K>`
- `values(): IterableIterator<K>` (same as keys)
- `entries(): IterableIterator<[K, K]>` (Set convention)
- `[Symbol.iterator](): IterableIterator<K>`
- `forEach(cb: (value: K, value2: K, set: TreeSet<K>) => void, thisArg?: any): void`

Construction & duplicates:

- `elements` is iterated in order; duplicates are ignored (native Set semantics).

Notes:
- Iteration behavior should match native `Set` as closely as practical.

### 2.2 TreeMap<K, V>

Minimal surface (Map-like):

- `constructor(entries?: Iterable<[K, V]>, options?: TreeMapOptions<K>)`
- `set(key: K, value: V): this` (native Map semantics)
- `get(key: K): V | undefined`
- `has(key: K): boolean`
- `delete(key: K): boolean`
- `clear(): void`
- `get size(): number`
- `keys(): IterableIterator<K>`
- `values(): IterableIterator<V>`
- `entries(): IterableIterator<[K, V]>`
- `[Symbol.iterator](): IterableIterator<[K, V]>` (Map convention)
- `forEach(cb: (value: V, key: K, map: TreeMap<K, V>) => void, thisArg?: any): void`

Construction & duplicates:

- `entries` is iterated in order; when the same key appears multiple times, the **last value wins** (native Map semantics).

`get()` vs `has()`:

- Because `undefined` values are allowed, `get(key) === undefined` does **not** imply the key is absent.
- Use `has(key)` to distinguish “missing” vs “present with undefined value”.

Notes:
- Iteration behavior should match native `Map` as closely as practical.

## 3. Implementation Strategy

### 3.1 Composition (recommended)

Implementation sketch:

```ts
class TreeMap<K, V> {
  #core: RedBlackTree<K, V>;
  constructor(entries?: Iterable<[K, V]>, options?: TreeMapOptions<K>) {
    this.#core = new RedBlackTree(/* comparator, etc */);
    // load entries
  }

  set(key: K, value: V): this {
    this.#core.set(key, value);
    return this;
  }

  get(key: K): V | undefined {
    return this.#core.get(key);
  }

  // ...rest is forwarding + iterator adapters
}
```

Why composition:
- Avoids exposing `RedBlackTree` surface area on `TreeSet/TreeMap`.
- Allows `TreeSet/TreeMap` to track native `Set/Map` semantics without inheriting tree-specific helpers.
- Minimizes risk when `RedBlackTree` evolves.

### 3.2 Core selection

For v1:
- `TreeSet/TreeMap` are **always RedBlackTree-backed**.

Future (optional):
- Allow `options.implementation = 'rbt' | 'avl'`.
- Or introduce `AvlTreeSet/AvlTreeMap` separately.

## 4. Type Design

### 4.1 Comparator / ordering

Both structures need a comparator for `K`:

- default comparator for numbers/strings
- require user comparator for complex objects

Options types:

```ts
type Comparator<K> = (a: K, b: K) => number;

interface TreeSetOptions<K> {
  comparator?: Comparator<K>;
}

interface TreeMapOptions<K> {
  comparator?: Comparator<K>;
}
```

Non-goal: do not expose `RedBlackTree`-specific knobs (e.g. MapMode/Node Mode, `toEntryFn`, internal caches) via `TreeSet/TreeMap` options.

### 4.2 Value semantics (TreeMap)

- `get()` returns `V | undefined` (native Map behavior)
- `set()` always updates/overwrites

Open question: do we want `getOrThrow` / `setIfAbsent` helpers? (probably not in v1)

## 5. Behavior & Edge Cases

### 5.1 Iteration order

- In-order traversal by key.
- Must be stable and deterministic.

### 5.2 Duplicate keys

- `TreeSet.add(key)` returns false if key already exists.
- `TreeMap.set(key, value)` overwrites.

### 5.3 `undefined` values

If `V` can be `undefined`, this can affect Map-mode accelerations.
Decision needed: do we document that `undefined` is allowed but may reduce fast paths? Or do we recommend against using `undefined` as a stored value?

## 6. Relationship to existing trees

- `RedBlackTree` remains the advanced “power user” API.
- `TreeSet/TreeMap` are “standard entry points”:
  - smaller API
  - native-like iteration semantics

We should document:
- When to use `TreeSet/TreeMap` vs `RedBlackTree`.

## 7. Tests & Benchmarks

### 7.1 Tests

Add unit tests for:
- insertion/overwrite behavior
- iteration order
- delete semantics
- comparator behavior

### 7.2 Benchmarks

Optional: add micro/macros to compare:
- `TreeMap` vs `RedBlackTree` map usage
- `TreeSet` vs `RedBlackTree` set usage

## 8. Documentation Plan

- Update README: add `TreeSet/TreeMap` quick examples.
- Update PERFORMANCE/CONCEPTS: clarify set vs map semantics.
- Keep performance claims evidence-based.

## 9. Decisions (confirmed)

The following decisions were confirmed:

1) **Naming:** use `TreeSet` / `TreeMap`.
2) **TreeSet method names:** match native `Set` (`add/has/delete/size`).
3) **Iteration & entries():** match native `Set` / `Map` conventions.
4) **Tree-specific APIs:** do not expose tree-specific helpers as part of the `TreeSet/TreeMap` public surface.
5) **`undefined` values (TreeMap):** allow `undefined` values (native Map behavior), and document that certain internal fast paths may not apply when `value === undefined`.

## 10. Detailed Specification (full)

This section captures **implementation-level details** to avoid ambiguity.

### 10.0 Iteration + mutation semantics

We will **match native `Map` / `Set` behavior** as closely as practical when the collection is mutated during iteration.

- No fail-fast iterators.
- Exact edge-case parity with the JS engine is not guaranteed, but we should not throw solely due to mutation during iteration.

### 10.1 Node / hint / predicate inputs

`TreeSet` and `TreeMap` are intentionally **native-like**:

- **No node parameters**: users can only pass `key` (and `value` for TreeMap).
- **No predicate overloads**: methods do not accept `(node) => boolean` style predicates.

Rationale:
- Node/predicate overloads are tree-specific APIs and create confusing “hidden power” surfaces.
- Advanced usage remains available via `RedBlackTree`.

### 10.2 Ordering / comparator rules

- The underlying order is defined by an explicit `comparator?: (a: K, b: K) => number`.
- If no comparator is provided:
  - For `number` and `string`, use the default comparator.
  - For other types, **throw a descriptive error at construction time**.
- No additional built-in comparators are provided (e.g. `bigint`, `Date`): users must provide a comparator for non-`number`/`string` keys.

Error recommendation (informative):

- Throw: `TypeError("TreeMap/TreeSet: comparator is required for non-number/non-string keys")`

### 10.3 Equality semantics

- Key equality is defined by `comparator(a, b) === 0`.
- We should document that comparator must impose a strict weak ordering.

### 10.4 Duplicate keys

- `TreeSet.add(k)` is a no-op if the key already exists (native Set semantics).
- `TreeMap.set(k, v)` overwrites the old value.

### 10.5 Return types and chaining

- `TreeSet.add(k)` returns `this` (match native Set semantics).
- `TreeMap.set(k, v)` returns `this` (native Map semantics).

### 10.6 Iteration order

- Iteration is **in-order by key (ascending)**.
- No descending/reverse iterators are exposed in `TreeSet/TreeMap` (to keep a strict native-like surface).
- `TreeSet` iteration yields keys.
- `TreeMap` iteration yields `[key, value]`.

### 10.7 Views

- `keys()/values()/entries()` return iterators.
- `TreeSet.values()` is the same as `TreeSet.keys()`.
- `TreeSet.entries()` yields `[key, key]`.

### 10.8 forEach semantics

Match native `Set` / `Map` callback conventions:

- `TreeSet.forEach((value, value2, set) => { ... }, thisArg?)`
- `TreeMap.forEach((value, key, map) => { ... }, thisArg?)`

`thisArg` should behave like native implementations (bind `this` inside the callback).

### 10.8 Size semantics

- `size` is the number of keys (TreeSet) / entries (TreeMap).

### 10.9 `undefined` values (TreeMap)

- `undefined` values are allowed.
- Users must use `has(key)` to distinguish:
  - key absent vs key present with value `undefined`.
- Document that internal fast paths may depend on `value !== undefined`.

### 10.10 Performance notes

- `TreeSet/TreeMap` are wrappers; their overhead should be small but non-zero.
- Most cross-language gaps (JS vs C++) are runtime/memory-model differences.

---

Next steps:

1) Resolve remaining TBD items in §10 (notably: comparator default policy, and TreeSet.add return type).
2) Implement with composition, add tests, and update documentation.
