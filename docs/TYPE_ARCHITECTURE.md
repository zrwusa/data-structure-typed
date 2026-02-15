# Type Architecture (Tech Debt & Guidelines)

This document records **how types are organized** in `data-structure-typed`, why certain patterns are used, and the **technical debt** we intend to address.

> Scope: project-wide (all data structures). This is not specific to TreeSet/TreeMap.

## 1) Current Layout (Observed)

- **Implementations** live in: `src/data-structures/**`
- **Type definitions** live in: `src/types/**`
- `src/types/index.ts` re-exports `src/types/data-structures/**` and other shared types.
- Many areas rely on **barrel exports** (e.g. `index.ts`) for public API.

## 2) The Core Constraint: Avoid Circular Dependencies

A common pitfall:

- Implementation files import shared types from `src/types`.
- If a `src/types/**` module imports an implementation class (e.g. `TreeSet`), we can create a cycle:

```
src/data-structures/.../tree-set.ts
  -> imports from src/types
    -> exports from src/types/data-structures/.../tree-set.ts
      -> imports TreeSet from src/data-structures/.../tree-set.ts
```

Even when using `import type`, cycles can still cause:

- confusing declaration generation
- unstable build order interactions
- `index.ts` barrel export chains amplifying the problem

## 3) Working Rule (Temporary): Types Should Not Import Implementations

### 3.1 Guideline

- Modules under `src/types/**` should **not** import from `src/data-structures/**`.
- Prefer exporting types that are **implementation-agnostic**.

### 3.2 SELF-generic callbacks (used today)

When a callback type wants to include a `self` parameter (e.g. `(value, index, self) => ...`), do **not** reference concrete implementation classes from `src/types/**`.

Instead, define the callback with a **generic `SELF`** parameter:

```ts
// in src/types/**
export type ElementCallback<E, R, RT, SELF> = (element: E, index: number, self: SELF) => RT;
```

Then, at the **use site** (implementation file), bind `SELF` to the concrete class:

```ts
// in src/data-structures/**
map<U>(cb: ElementCallback<K, unknown, U, TreeSet<K>>) { /* ... */ }
```

This preserves strong typing for users (IDE/TS) while keeping the type layer acyclic.

## 4) What Should Live Where (Proposed)

### 4.1 Put in `src/types/**`

- Options interfaces (`*Options`)
- Public callback types (with `SELF` as generic parameter when needed)
- Small shared DTOs and unions used across implementations

### 4.2 Put in `src/data-structures/**` (implementation)

- Anything that must reference concrete classes
- Internal helpers that are runtime-bearing
- Private/Protected implementation details

## 5) Known Tech Debt (To Be Unified Later)

1) **Callback type consistency**
   - Some existing callback types use different argument orders.
   - Goal: standardize across structures.

2) **`unknown`/`any` usage in types**
   - Some types currently use `unknown` to avoid importing implementations.
   - Goal: reduce `unknown` by using `SELF` generics and better shared interfaces.

3) **Barrel export amplification**
   - `index.ts` chains can amplify cycles and make type tracing harder.
   - Goal: audit and possibly reduce barrel exports where it helps.

4) **Type vs runtime boundaries**
   - Some locations blur type-only vs runtime imports.
   - Goal: enforce `import type` where appropriate and document safe patterns.

## 6) Next Steps

- Adopt these constraints for new code.
- When doing a broader refactor, decide on a single, project-wide rule set and update existing structures accordingly.

