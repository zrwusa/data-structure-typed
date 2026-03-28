---
description: "Get started with data-structure-typed in 30 seconds. Create trees, queues, and maps with a familiar JavaScript API."
---

# Quick Start

## Leaderboard (Ranked Collections)

```typescript
import { RedBlackTree } from 'data-structure-typed';

// Descending comparator — highest scores first
const leaderboard = new RedBlackTree<number, string>([
  [100, 'Alice'],
  [85, 'Bob'],
  [92, 'Charlie']
], { comparator: (a, b) => b - a });

// Top-2 via lazy iterator — O(2 log n), no full traversal
const iter = leaderboard.entries();
for (let i = 0; i < 2; i++) {
  const { value: [score, player] } = iter.next();
  console.log(`${score}: ${player}`);
}
// Output: 100: Alice → 92: Charlie

// Update score — O(log n)
leaderboard.delete(85);
leaderboard.set(95, 'Bob');

// Range query — players scoring 90~100, O(log n + k)
const scores90to100 = leaderboard.rangeSearch([90, 100]);
```

## Task Queue (Scheduling)

```typescript
import { MinPriorityQueue } from 'data-structure-typed';

const tasks = new MinPriorityQueue<{ task: string; priority: number }>(
  [], { comparator: (a, b) => a.priority - b.priority }
);

tasks.add({ task: 'Send email', priority: 3 });
tasks.add({ task: 'Fix critical bug', priority: 1 });
tasks.add({ task: 'Update docs', priority: 2 });

// Process in priority order
while (!tasks.isEmpty()) {
  const next = tasks.poll();
  console.log(next?.task);
}
// Fix critical bug → Update docs → Send email
```

## Fast Autocomplete (Trie)

```typescript
import { Trie } from 'data-structure-typed';

const trie = new Trie();
trie.addMany(['apple', 'application', 'app', 'apex']);

console.log(trie.getWords('app')); // ['app', 'apple', 'application']
console.log(trie.hasPrefix('ap')); // true
```

## Next Steps

- 📖 [Core Concepts](/guide/concepts) — understand the Big Three
- 📋 [API Reference](/api/) — full method signatures and examples
- 💡 [Real-World Examples](/guide/guides) — patterns for production
- ⚡ [Performance](/guide/performance) — benchmarks and comparisons
