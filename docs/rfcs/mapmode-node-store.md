# RFC: MapMode `_store` as Node Index (Map<K, Node>) for Binary Trees

- Status: Draft
- Target: `BST` / `RedBlackTree` (and thus TreeMap/TreeSet and other derived structures)
- Motivation: make MapMode accelerate **presence + lookup + node retrieval** reliably (including `undefined` values) and close Node Mode lookup gaps.

## 0. Summary

Today, MapMode uses an internal key→value store (`_store`) to accelerate value access. However:

- `has()` cannot safely use `_store` because `_store` may not contain keys when value is `undefined`.
- Node Mode (`isMapMode=false`) lookup-only benchmarks show large slowdowns vs MapMode.

This RFC proposes changing MapMode’s internal store from:

- **Current**: `Map<K, V>` (or similar)
- **Proposed**: `Map<K, NODE>` (node reference index)

This makes MapMode a true O(1) *key index*:

- `has(key)` → `_store.has(key)`
- `getNode(key)` → `_store.get(key)`
- `get(key)` → `_store.get(key)?.value`

while the tree structure remains the source of ordering and range operations.

## 1. Goals

1) **Correctness**
- `has(key)` must be correct even when values are `undefined`.
- TreeSet semantics (value is always `undefined`) must still work.

2) **Performance**
- MapMode should give consistent gains for `has/get/getNode/search` in lookup-heavy workloads.
- Node Mode remains supported and unchanged.

3) **API stability**
- Keep public API semantics unchanged unless explicitly documented.
- Keep inheritance chain: `RedBlackTree extends BST extends BinaryTree`.

## 2. Non-goals

- Changing comparator behavior.
- Changing iteration order, range semantics, or balancing logic.
- Making Node Mode faster in this RFC (though this change may reduce pressure to optimize Node Mode).

## 3. Background / Problem Statement

### 3.1 Why `has()` doesn’t use `_store` today

In current MapMode, `_store` behaves like a *value cache*, not a *presence index*. Implementations commonly skip writing `_store` when `value === undefined`.

That means:
- `TreeSet` (value always `undefined`) would appear empty if `has()` used `_store`.
- `TreeMap` allows `V | undefined`, so key existence cannot be inferred from value presence.

### 3.2 Bench evidence (directional)

We observed lookup-only cases where:
- MapMode ON `get-only` is orders of magnitude faster than Node Mode.

This indicates the primary win comes from avoiding repeated O(log n) tree search in hot paths.

## 4. Proposed Design

### 4.1 Data structure

When `isMapMode === true`:

- Maintain a private index:

```ts
// conceptual
_store: Map<K, NODE>
```

Where `NODE` is the concrete node type (e.g. `BSTNode<K,V>` / `RedBlackTreeNode<K,V>`).

When `isMapMode === false`:
- `_store` is absent/unused (keep current behavior).

### 4.2 Core invariants

In MapMode:

1) `_store.has(k) === true` iff key `k` exists in the tree.
2) `_store.get(k)` returns the *current* node for `k`.
3) `_store` never contains sentinel nodes (`NIL`, headers) and never contains stale references.

### 4.3 Operation semantics

#### set / insert
- If key is new: insert node into tree, then `_store.set(key, node)`.
- If key exists: update node’s value in place (do not create a new node), `_store` unchanged.

#### delete
- After deletion completes, `_store.delete(key)`.
- If the delete algorithm performs node swapping/transplanting:
  - Ensure the store entries remain correct for both the deleted key and any successor/target nodes.

#### clear
- Clear tree + `_store.clear()`.

#### has
- MapMode: `return _store.has(key)`.
- Node Mode: keep current tree search.

#### get
- MapMode: `return _store.get(key)?.value`.
- Node Mode: keep current logic.

#### getNode
- MapMode: `return _store.get(key)`.
- Node Mode: keep current tree search.

### 4.4 Interactions with rangeSearch / iteration / min/max caches

- Range queries and ordering still use the tree structure.
- Min/max caches remain valid and independent.
- MapMode index does not change ordering or traversal.

## 5. Edge Cases

1) **`undefined` values**
- Fully supported: index stores node presence regardless of value.

2) **Duplicate keys / update**
- Index remains stable (same key maps to same node reference).

3) **Node replacement patterns**
- If deletion uses key/value copying (e.g. copying successor’s key into target node), this must update `_store` to avoid key→node mismatch.

4) **Key mutation**
- If the library allows mutating node.key externally (public node exposure), MapMode correctness cannot be guaranteed.
- Recommendation: document key immutability requirement for MapMode OR harden by preventing key mutation (may be breaking; likely doc-only).

## 6. Performance Expectations

- `has/get/getNode` in MapMode should become O(1) average time.
- `set/insert/delete` cost increases by O(1) map maintenance.

## 7. Memory Expectations

- Adds one hash index entry per key.
- Net effect: memory increases vs Node Mode.
- This is an explicit time–space tradeoff controlled by `isMapMode`.

## 8. Migration Plan

1) Implement behind the existing `isMapMode` flag.
2) Keep Node Mode unchanged.
3) Add/expand unit tests:
   - `has()` correctness when values are `undefined` (TreeMap + TreeSet)
   - delete cases: leaf/one-child/two-child, successor swap/copy paths
   - invariants: `_store` size equals tree size in MapMode
4) Add/expand perf suites (playground): confirm lookup-only improvements and stable semantics.

## 9. Risks & Mitigations

- **Stale node references** after complex delete operations.
  - Mitigate with targeted tests around delete/transplant paths.
- **Public node mutation** (key changes) could break store.
  - Mitigate via documentation + optionally internal guards.
- **Increased memory** for large N.
  - Acceptable as opt-in tradeoff.

## 10. Open Questions

1) Do we want MapMode to store `NODE` or store an internal lightweight record `{ node, value }`?
   - **Recommendation**: store `NODE` (node reference index).

2) Should MapMode be enabled by default for TreeMap/TreeSet wrappers?

3) How should we document key immutability when using node-exposing APIs?
   - **Decision**: document that `node.key` is logically immutable; mutating it is undefined behavior.

4) Delete strategy (two-child delete)
   - **Decision**: prefer a *transplant/move-node* delete strategy (do not copy successor key/value into the target node) to keep the MapMode index consistent and avoid store remapping bugs.

