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

Minimal v1 surface (Set-like):

- `constructor(elements?: Iterable<K>, options?: TreeSetOptions<K>)`
- `add(key: K): boolean` (returns true if inserted, false if already present)
- `has(key: K): boolean`
- `delete(key: K): boolean`
- `clear(): void`
- `get size(): number`
- `keys(): IterableIterator<K>`
- `values(): IterableIterator<K>` (same as keys)
- `entries(): IterableIterator<[K, K]>` (Set convention)
- `[Symbol.iterator](): IterableIterator<K>`
- `forEach(cb: (value: K, value2: K, set: TreeSet<K>) => void, thisArg?: any): void` (optional)

Notes:
- Iteration behavior should match native `Set` as closely as practical.

### 2.2 TreeMap<K, V>

Minimal v1 surface (Map-like):

- `constructor(entries?: Iterable<[K, V]>, options?: TreeMapOptions<K>)`
- `set(key: K, value: V): this`
- `get(key: K): V | undefined`
- `has(key: K): boolean`
- `delete(key: K): boolean`
- `clear(): void`
- `get size(): number`
- `keys(): IterableIterator<K>`
- `values(): IterableIterator<V>`
- `entries(): IterableIterator<[K, V]>`
- `[Symbol.iterator](): IterableIterator<[K, V]>` (Map convention)
- `forEach(cb: (value: V, key: K, map: TreeMap<K, V>) => void, thisArg?: any): void` (optional)

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

Options types (draft):

```ts
type Comparator<K> = (a: K, b: K) => number;

interface TreeSetOptions<K> {
  comparator?: Comparator<K>;
}

interface TreeMapOptions<K> {
  comparator?: Comparator<K>;
}
```

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

## 9. Open Questions (need decisions)

1) **Naming:** `TreeSet/TreeMap` vs `OrderedSet/OrderedMap`?
2) **Method names:** should `TreeSet` use `add/has/delete` (native Set) or reuse existing tree methods?
3) **Iterator output:** confirm `entries()` shapes.
4) **Exposure of tree-specific APIs:** allow `lowerBound/rangeSearch` on TreeMap/TreeSet? (recommend: no in v1)
5) **Handling `undefined` values** in TreeMap: allow but warn? disallow? provide alternative sentinel?

---

If approved, the next step is to finalize decisions in §9, then implement with a minimal API, tests, and docs.
