# Installation

## Package Manager

::: code-group

```bash [npm]
npm i data-structure-typed
```

```bash [yarn]
yarn add data-structure-typed
```

```bash [pnpm]
pnpm add data-structure-typed
```

:::

## Subpath Imports

Import only the category you need for smaller bundles:

```typescript
import { RedBlackTree, TreeMap } from 'data-structure-typed/binary-tree';
import { Deque, Queue } from 'data-structure-typed/queue';
import { HashMap } from 'data-structure-typed/hash';
import { Heap, MinHeap } from 'data-structure-typed/heap';
import { Trie } from 'data-structure-typed/trie';
import { Stack } from 'data-structure-typed/stack';
```

::: tip Tree-Shaking
With `"sideEffects": false` and modern bundlers (Vite, Webpack 5, Rollup), even the full import `from 'data-structure-typed'` will tree-shake unused structures. Subpath imports give you explicit control and faster IDE autocomplete.
:::

## Individual Packages

Standalone packages are also available:

```bash
npm i avl-tree-typed bst-typed heap-typed
```

## CDN

```html
<script src="https://unpkg.com/data-structure-typed/dist/umd/data-structure-typed.min.js"></script>
```

## Requirements

- **Node.js** ≥ 16
- **TypeScript** ≥ 4.8 (optional, for type support)
- **Browser**: Any modern browser (ES2018+)
