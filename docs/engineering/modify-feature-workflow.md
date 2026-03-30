# Modify Feature Workflow

Step-by-step checklist for modifying existing APIs in data-structure-typed.  
Based on the API unification refactor (2026-03-31).

Covers: return type changes, method renaming, deprecation, removal.

---

## Phase 1: Audit & Design

- [ ] **Identify scope** — which methods/classes are affected?
  - Use `grep -rn` to find all usages in `src/`, `test/`, `docs/`
  - Check base classes and interfaces (`src/interfaces/`, `src/data-structures/base/`)
  - Check wrapper classes (TreeMap/TreeSet/TreeMultiMap/TreeMultiSet forward to `#core`)
- [ ] **Cross-reference conventions**
  - JS standard library (Map/Set/Array) for return type expectations
  - Other languages (Java, C++, Rust, Python) for naming conventions
  - Internal consistency — do similar methods across data structures behave the same?
- [ ] **Classify the change**
  - **Breaking**: return type change, method removal, parameter change
  - **Deprecation**: old method kept as wrapper, new method added
  - **Non-breaking**: adding a new overload, adding a missing method
- [ ] **Document the decision** — rationale for each change

## Phase 2: Interface & Type Updates

- [ ] **Update interfaces** (`src/interfaces/*.ts`)
  - Change signatures, remove deprecated interface methods
- [ ] **Update type files** (`src/types/data-structures/**/*.ts`) if affected
- [ ] **Run `npx tsc --noEmit`** — identify all downstream compile errors
  - This tells you exactly which files need updating

## Phase 3: Source Implementation

- [ ] **Update core class** (e.g. `binary-tree.ts`, `heap.ts`)
  - Change return type / logic
  - If old logic is still needed internally, move to `protected _methodInternal()`
- [ ] **Update subclasses** that override the method
  - AVL, RBT must match parent signature
  - Check `override` keyword catches mismatches at compile time
- [ ] **Update wrapper classes** (TreeMap/TreeSet/etc.)
  - They proxy to `#core` — ensure return type transformation is correct
  - Don't forget `TreeMultiMap` and `TreeMultiSet` if they exist
- [ ] **For renames**: add deprecated wrapper that delegates to new method
  ```typescript
  /** @deprecated Use `pop` instead. Will be removed in a future major version. */
  poll(): E | undefined {
    return this.pop();
  }
  ```
- [ ] **For removals**: grep for all internal usages and update
  ```bash
  grep -rn 'refill' src/ test/ docs/
  ```
- [ ] **Run `npx tsc --noEmit`** — must be 0 errors before touching tests

## Phase 4: Test Updates

- [ ] **Find all affected tests**
  ```bash
  grep -rn 'oldMethodName\|OldReturnType' test/
  ```
- [ ] **Update assertions** for return type changes
  - `expect(result).toBe(true)` → `expect(result).toBe(...)` matching new type
- [ ] **Update test patterns** for removed methods
  - `x.refill([1,2,3])` → `x.clear(); x.addMany([1,2,3])`
  - ⚠️ Beware: replacement may produce different internal state (e.g. heap array order differs between `fix()` and incremental `add()`)
  - If tests check internal layout (`.toArray()` order), update expectations or switch to behavioral assertions (poll order)
- [ ] **Run full test suite** — `npm test` — 0 failures
- [ ] **Add coverage tests** for new/changed code paths
  - Deprecated wrappers need at least one test to cover the delegation
  - New methods (`deleteWhere`, `peek`) need their own test file

## Phase 5: Coverage Verification

- [ ] **Run `npx jest --coverage`**
- [ ] **Check uncovered lines** for modified files
  - Target: maintain or improve overall coverage (≥98% stmts)
- [ ] **Add coverage tests** for any new uncovered branches
  - Common misses: deprecated wrapper methods, empty-input guards, predicate edge cases

## Phase 6: Documentation

### Source-level (JSDoc)

- [ ] **Update JSDoc** on changed methods — return type in `@returns`
- [ ] **Add `@deprecated` tag** on deprecated methods with migration hint
- [ ] **Run `npm run gen:examples`** — re-inject examples into JSDoc

### API Docs

- [ ] **Run `npm run docs:api`** — regenerate typedoc output
- [ ] **Spot-check** key classes in `docs-site-docusaurus/docs/api/classes/`

### Specification

- [ ] **SPECIFICATION.md** — update API signatures
- [ ] **SPECIFICATION.zh-CN.md** — keep in sync

### Changelog

- [ ] **CHANGELOG.md** — add entries under appropriate version heading
  - Breaking changes section
  - Deprecations section
  - New features section

### Migration Guide

- [ ] **MIGRATION.md** — add before/after code examples for each breaking change

### README

- [ ] **README.md** — update any code examples that use changed APIs
- [ ] **README_CN.md** — keep in sync

## Phase 7: Final Verification

- [ ] **`npx tsc --noEmit`** — 0 errors
- [ ] **`npm test`** — all pass, no regressions
- [ ] **`npm run gen:examples`** — injection count correct
- [ ] **Review `git diff --stat`** — no unintended file changes
- [ ] **Wait for Pablo's approval** before push

---

## Quick Reference: Common Gotchas

| Gotcha | Solution |
|--------|----------|
| **Wrapper classes silently return wrong type** | TreeMap/TreeSet proxy to `#core` — if core return type changes, wrapper must adapt the transformation |
| **Subclass override signature mismatch** | TypeScript `override` catches this at compile time — always run `tsc` after core changes |
| **Tests check internal state, not behavior** | Heap `.toArray()` order depends on construction method (heapify vs incremental add). Prefer behavioral assertions (poll order) over internal array layout |
| **Deprecated method not tested** | Add at least one test that calls the deprecated wrapper to ensure delegation works |
| **`grep` misses dynamic references** | Also search for string-based references: `'poll'`, method aliases, re-exports |
| **Interface not updated** | `src/interfaces/` must match — tsc won't catch if interface is only used for documentation |
| **setMany/addMany return type cascade** | If `set()` return type changes, check `setMany()` — it may aggregate `set()` returns |
| **Performance tests use old API** | Check `test/performance/` — these are often forgotten |
| **SPECIFICATION and README out of sync** | Update both EN and CN versions of every doc |

---

## Change Type Recipes

### Return Type Change

```
1. Update interface signature
2. Update core implementation
3. Update subclass overrides (tsc will flag)
4. Update wrapper proxy methods
5. Update test assertions
6. Update SPECIFICATION + CHANGELOG
```

### Method Rename (with deprecation)

```
1. Rename core method body to new name
2. Add deprecated wrapper with old name → delegates to new
3. Update all internal usages to new name
4. Update tests (can keep some on old name for deprecation coverage)
5. Update docs: mark old as deprecated, document new
```

### Method Removal

```
1. Remove from interface
2. Remove from core class
3. grep all usages in src/ test/ docs/
4. Replace with equivalent pattern in tests
5. Update SPECIFICATION + CHANGELOG + MIGRATION
```

### Adding Missing Method (non-breaking)

```
1. Add to core class (or base class if shared)
2. Add to interface if applicable
3. Write tests (TDD if possible)
4. Update SPECIFICATION
5. Run gen:examples + docs:api
```
