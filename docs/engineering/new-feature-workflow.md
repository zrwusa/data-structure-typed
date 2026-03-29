# New Feature Workflow

Step-by-step checklist for adding a new feature to data-structure-typed.  
Based on the Order-Statistic Tree implementation (2026-03-29).

---

## Phase 1: Design

- [ ] **Write RFC** in `docs/rfcs/<feature-name>.md`
  - Problem statement, API design, complexity analysis
  - Reference implementations (Java, C++, etc.)
  - Decision: opt-in vs always-on, throw behavior, edge cases
- [ ] **Get approval** on API surface before writing code

## Phase 2: Types & Options

- [ ] **Add option to type file** (`src/types/data-structures/...`)
  - Core options type (e.g. `BSTOptions`)
  - Wrapper options types if needed (e.g. `TreeMapOptions`, `TreeSetOptions`, `TreeMultiSetOptions`)
- [ ] **Add error message template** to `src/common/error.ts` if the feature can fail
- [ ] **Export new types** — verify `src/common/index.ts` and `src/index.ts` re-export

## Phase 3: TDD — Tests First

- [ ] **Create test file** `test/unit/data-structures/<category>/<feature>.test.ts`
  - Import from `../../../../src` (relative path, not alias)
- [ ] **Write all test cases before implementation**
  - Happy path (core functionality)
  - Edge cases (empty, single element, out of bounds)
  - Callback/overload variants
  - IterationType variants (ITERATIVE + RECURSIVE)
  - Subclass tests (BST, AVL, RBT, TreeMap, TreeSet, TreeMultiMap, TreeMultiSet)
  - Disabled/error mode tests
  - Error handling mode tests (`setErrorHandling('warn'|'silent')`)
  - Stress tests (10K+ elements, random insert/delete)
- [ ] **Run tests — confirm they fail** (TDD red phase)

## Phase 4: Core Implementation

- [ ] **Implement in core class** (e.g. `bst.ts`)
  - Public API with overloads (no callback, with callback, with iterationType)
  - Protected helpers (iterative + recursive variants)
  - Guard clause: check feature flag, call `raise()` if disabled
  - Fallback return value after `raise()` for non-throw modes
- [ ] **Wire into mutation paths** — every place `_size` changes:
  - `set` / `add` (all insert paths including boundary fast-paths)
  - `delete` (after transplant/rebalance)
  - Rotations (AVL: `_balanceLL/LR/RR/RL`, `_balancePath`; RBT: `_leftRotate/rightRotate`)
  - Helper methods (RBT: `_attachNewNode`, `_insert`)
- [ ] **Propagate option in `_snapshotOptions`** — ensures `clone()` preserves the feature
- [ ] **Use `this.isRealNode()`** for all node traversal (RBT has NIL sentinel nodes)
- [ ] **Use `this.isNode()`** instead of `instanceof` for type checks (supports subclass nodes)

## Phase 5: Wrapper Classes

If feature applies to wrapper classes (TreeMap, TreeSet, TreeMultiMap, TreeMultiSet):

- [ ] **Pass option through constructor** to `#core` (e.g. `enableOrderStatistic`)
- [ ] **Add proxy methods** that delegate to `this.#core.<method>()`
- [ ] **Add JSDoc** to proxy methods (can be shorter, reference core docs)

## Phase 6: Compile & Test

- [ ] **`npx tsc --noEmit`** — 0 errors
- [ ] **Run feature tests** — all pass (TDD green phase)
- [ ] **Run full suite** — `npm test` — 0 regressions
- [ ] **Check coverage** — `npx jest --coverage --collectCoverageFrom='src/.../<file>.ts'`
  - Target: ≥98% statements, ≥95% branches, 100% functions
- [ ] **Add coverage supplement tests** for uncovered branches
  - Predicate input, node input, entry input, null input
  - String overload for IterationType
  - Recursive mode paths

## Phase 7: Documentation — JSDoc

- [ ] **All public methods**: `@remarks Time O(...), Space O(...)`
- [ ] **All overloads**: `@param` + `@returns` descriptions
- [ ] **Protected methods**: `@remarks Time O(...), Space O(...)` 
- [ ] **Format matches existing codebase** (check neighboring methods for style)

## Phase 8: Documentation — @example

- [ ] **Tag key tests** with `@example [ClassName.method] description`
  - At least one per class that exposes the feature (BST, RBT, AVL, TreeMap, TreeSet...)
  - Include real-world use cases, not just unit tests
- [ ] **Run `npm run gen:examples`** — verify injection count increases
- [ ] **Spot-check** that `@example` blocks appear in source JSDoc

## Phase 9: Documentation — Guides & README

- [ ] **README.md** — add example in relevant section
- [ ] **docs-site-docusaurus/docs/guide/quick-start.md** — add quick example if it's a headline feature
- [ ] **docs-site-docusaurus/docs/guide/concepts.md** — add "Array vs Tree" comparison if applicable
- [ ] **docs-site-docusaurus/docs/guide/overview.md** — add to data structure section
- [ ] **docs-site-docusaurus/docs/guide/guides.md** — update or add real-world example
- [ ] **docs/GUIDES.md** — sync with Docusaurus version (these are source-of-truth copies)
- [ ] **Update existing examples** that the new feature improves (e.g. manual top-k → rangeByRank)

## Phase 10: Final Verification

- [ ] **`npx tsc --noEmit`** — 0 errors (source + tests)
- [ ] **`npm test`** — all pass, no regressions
- [ ] **`npm run gen:examples`** — injection count correct
- [ ] **Review `git diff --stat`** — no unintended changes
- [ ] **Wait for Pablo's approval** before commit/push

---

## Quick Reference: Common Gotchas

| Gotcha | Solution |
|--------|----------|
| RBT NIL nodes crash comparator | Use `this.isRealNode()` in all loops |
| `instanceof BSTNode` misses subclass nodes | Use `this.isNode()` |
| Wrapper classes don't inherit BST methods | Add proxy methods manually |
| `clone()` loses feature flag | Add to `_snapshotOptions()` |
| Separate options types for wrappers | TreeMapOptions/TreeSetOptions are independent — update each |
| `raise()` doesn't halt in non-throw mode | Always add fallback return after `raise()` |
| Tests import from `'src'` alias | Use `'../../../../src'` relative path (Jest moduleNameMapper) |
| `docs/GUIDES.md` ≠ `docs-site-docusaurus/docs/guide/guides.md` | Keep both in sync |

---

## File Checklist Template

```
Types:
  src/types/data-structures/<category>/<type>.ts
  src/types/data-structures/binary-tree/tree-map.ts (if wrapper)
  src/types/data-structures/binary-tree/tree-set.ts (if wrapper)
  src/types/data-structures/binary-tree/tree-multi-set.ts (if wrapper)

Error:
  src/common/error.ts

Core:
  src/data-structures/<category>/<main>.ts

Subclass wiring:
  src/data-structures/binary-tree/avl-tree.ts
  src/data-structures/binary-tree/red-black-tree.ts

Wrappers:
  src/data-structures/binary-tree/tree-map.ts
  src/data-structures/binary-tree/tree-set.ts
  src/data-structures/binary-tree/tree-multi-map.ts
  src/data-structures/binary-tree/tree-multi-set.ts

Tests:
  test/unit/data-structures/<category>/<feature>.test.ts

Docs:
  README.md
  docs/GUIDES.md
  docs-site-docusaurus/docs/guide/quick-start.md
  docs-site-docusaurus/docs/guide/concepts.md
  docs-site-docusaurus/docs/guide/overview.md
  docs-site-docusaurus/docs/guide/guides.md
```
