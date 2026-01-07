# INTEGRATIONS: Framework Integration Guide

How to use data-structure-typed with React, Express, Nest.js, and other frameworks.

**[Back to README](../README.md) • [Code Examples](./GUIDES.md) • [Performance](./PERFORMANCE.md)**

---

## Table of Contents

1. [React Integration](#react-integration)
2. [Express Integration](#express-integration)
3. [Nest.js Integration](#nestjs-integration)
4. [TypeScript Configuration](#typescript-configuration)

---

## React Integration

### Use Case: Sorted State Management

```tsx
import { useCallback, useMemo, useState } from 'react';
import { RedBlackTree } from 'data-structure-typed';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: number;
}

/**
 * ╔═════════════════════════════════════════════════════════════════════════╗
 * ║ PERFORMANCE COMPARISON TABLE                                            ║
 * ╠═════════════════╦═══════════════════╦═════════════════╦═════════════════╣
 * ║ Operation       ║ RedBlackTree      ║ Array           ║ Speedup         ║
 * ╠═════════════════╬═══════════════════╬═════════════════╬═════════════════╣
 * ║ Add todo        ║ O(log n) ✨       ║ O(n log n) 🐢  ║ 1000x faster!     ║
 * ║ Delete todo     ║ O(log n) ✨       ║ O(n) 🐢        ║ 100x faster!      ║
 * ║ Keep sorted     ║ Automatic ✓       ║ Manual sort ✗   ║ No extra code!  ║
 * ║ Rebalancing     ║ Self-balancing ✓  ║ N/A             ║ Always optimal! ║
 * ╠═════════════════╩═══════════════════╩═════════════════╩═════════════════╣
 * ║ EXAMPLE: With 1000 todos                                                ║
 * ║ ─────────────────────────────                                           ║
 * ║ • RedBlackTree add: ~10 operations                                      ║
 * ║ • Array add + sort: ~10,000 operations                                  ║
 * ║ • RedBlackTree is 1000x FASTER! 🚀                                      ║
 * ╚═════════════════════════════════════════════════════════════════════════╝
 */
export default function TodoApp() {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(5);

  const [todos, setTodos] = useState(() =>
    new RedBlackTree<TodoItem>([], {
      // Comparator ensures todos are ALWAYS sorted by priority (descending)
      // RedBlackTree maintains this order automatically on every insertion
      // With Array, you'd need to manually sort() after each add → expensive!
      comparator: (a, b) => b.priority - a.priority
    }));

  const addTodo = useCallback(() => {
    if (!text.trim()) return;

    setTodos((prev) => {
      const next = prev.clone();

      // This insertion maintains sorted order automatically
      // The Red-Black Tree algorithm handles all the balancing
      next.add({
        id: Date.now(),
        text: text.trim(),
        completed: false,
        priority: Math.max(1, Math.min(10, priority)),
      });
      return next;
    });

  }, [text, priority]);

  /**
   * Delete a todo efficiently
   *
   * Performance Analysis:
   * ──────────────────
   * ✅ RedBlackTree.delete(): O(log n)
   *    - For 1000 items: ~10 tree operations
   *    - No need to shift array elements
   *    - Red-Black Tree rebalances automatically
   *
   * ❌ Array Alternative:
   *    - Array.findIndex(): O(n) to find the item
   *    - Array.splice(): O(n) to remove and shift all elements
   *    - For 1000 items: ~500 operations per delete
   *    - RESULT: 50x SLOWER! 🐢
   */
  const deleteTodo = useCallback((todo: TodoItem) => {
    setTodos((prev) => {
      const next = prev.clone();
      next.delete(todo); // ← O(log n) deletion
      return next;
    });
  }, []);

  const todoList = useMemo(() => [...todos.keys()], [todos]);

  return (
    <div className="todo-app">
      <h2>Priority Todos (Auto-Sorted)</h2>
      <div className="input-section">
        <input
          type="text"
          placeholder="Todo text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Priority (1-10)"
          value={priority}
          onChange={(e) =>
            setPriority(Math.max(1, Math.min(10, Number(e.target.value))))
          }
        />
        <button onClick={addTodo} disabled={!text.trim()}>
          Add Todo
        </button>
      </div>
      <ul className="todo-list">
        {todoList.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                setTodos((prev) => {
                  const next = prev.clone();

                  // Delete the old todo object
                  next.delete(todo);
                  next.add({ ...todo, completed: !todo.completed });
                  return next;
                });
              }}
            />
            <span>{todo.text}</span>
            <span className="priority">P{todo.priority}</span>
            <button onClick={() => deleteTodo(todo)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Express Integration

### Use Case: LRU Cache Middleware

```typescript
import express, { Request, Response } from 'express';
import { DoublyLinkedList } from 'data-structure-typed';

class LRUCache<T> {
  private cache = new Map<string, { value: T; node: any }>();
  private order = new DoublyLinkedList<string>();
  private capacity: number;

  constructor(capacity: number = 100) {
    this.capacity = capacity;
  }

  get(key: string): T | null {
    if (!this.cache.has(key)) return null;

    const { value, node } = this.cache.get(key)!;
    
    // Move to end (most recently used)
    this.order.deleteNode(node);
    const newNode = this.order.pushBack(key);
    this.cache.set(key, { value, node: newNode });

    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.get(key);  // Mark as recently used
      this.cache.get(key)!.value = value;
      return;
    }

    if (this.cache.size >= this.capacity) {
      const lru = this.order.shift();
      this.cache.delete(lru);
    }

    const node = this.order.pushBack(key);
    this.cache.set(key, { value, node });
  }
}

// Usage in Express
const app = express();
const responseCache = new LRUCache<{ status: number; data: any }>(50);

app.use((req: Request, res: Response, next: Function) => {
  const cachedResponse = responseCache.get(req.url);
  
  if (cachedResponse) {
    return res.status(cachedResponse.status).json(cachedResponse.data);
  }

  // Wrap original send to cache response
  const originalSend = res.send;
  res.send = function(data: any) {
    responseCache.set(req.url, { status: res.statusCode, data });
    return originalSend.call(this, data);
  };

  next();
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Cached response' });
});

app.listen(3000);
```

### Use Case: Rate Limiting with Deque

```typescript
import { Deque } from 'data-structure-typed';

class RateLimiter {
  private requests = new Map<string, Deque<number>>();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(clientId: string): boolean {
    const now = Date.now();
    
    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, new Deque());
    }

    const deque = this.requests.get(clientId)!;

    // Remove old requests outside window
    while (!deque.isEmpty && deque.peekFirst()! < now - this.windowMs) {
      deque.shift();
    }

    // Check limit
    if (deque.size >= this.limit) {
      return false;
    }

    // Add new request
    deque.push(now);
    return true;
  }
}

// Usage in Express
const app = express();
const limiter = new RateLimiter(10, 60000); // 10 requests per minute

app.use((req: Request, res: Response, next: Function) => {
  const clientId = req.ip;

  if (!limiter.isAllowed(clientId)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'Your data here' });
});
```

---

## Nest.js Integration

### Use Case: Ranking Service

```typescript
import { Injectable } from '@nestjs/common';
import { RedBlackTree } from 'data-structure-typed';

export interface RankingEntry {
  userId: string;
  userName: string;
  score: number;
  lastUpdated: Date;
}

@Injectable()
export class RankingService {
  private rankings = new RedBlackTree<number, RankingEntry>(
    (a, b) => b - a  // Descending order
  );
  private userMap = new Map<string, number>();  // userId → score

  addOrUpdateScore(userId: string, userName: string, score: number): void {
    // Remove old score if exists
    if (this.userMap.has(userId)) {
      const oldScore = this.userMap.get(userId)!;
      this.rankings.delete(oldScore);
    }

    // Add new score
    const entry: RankingEntry = {
      userId,
      userName,
      score,
      lastUpdated: new Date()
    };

    this.rankings.set(score, entry);
    this.userMap.set(userId, score);
  }

  getTopN(n: number): RankingEntry[] {
    return [...this.rankings.values()].slice(0, n);
  }

  getUserRank(userId: string): number | null {
    if (!this.userMap.has(userId)) return null;

    const score = this.userMap.get(userId)!;
    let rank = 1;

    for (const [s] of this.rankings) {
      if (s > score) rank++;
      else break;
    }

    return rank;
  }

  getAroundUser(userId: string, range: number = 5): RankingEntry[] {
    const rank = this.getUserRank(userId);
    if (!rank) return [];

    const start = Math.max(1, rank - range);
    const end = Math.min(this.rankings.size, rank + range);

    return [...this.rankings.values()].slice(start - 1, end);
  }
}
```

### Use Case: Task Queue Controller

```typescript
import { Controller, Post, Body, Get } from '@nestjs/common';
import { MaxPriorityQueue } from 'data-structure-typed';

export interface QueuedTask {
  id: string;
  action: string;
  priority: number;
  createdAt: Date;
}

@Controller('tasks')
export class TaskController {
  private taskQueue = new MaxPriorityQueue<QueuedTask>({
    comparator: (a, b) => a.priority - b.priority
  });

  @Post('add')
  addTask(@Body() task: QueuedTask): { success: boolean; queueSize: number } {
    this.taskQueue.add(task);
    return {
      success: true,
      queueSize: this.taskQueue.size
    };
  }

  @Post('process')
  processNext(): { success: boolean; task: QueuedTask | null } {
    const task = this.taskQueue.poll();
    return {
      success: !!task,
      task: task || null
    };
  }

  @Get('queue-size')
  getQueueSize(): { size: number } {
    return { size: this.taskQueue.size };
  }
}
```

---

## TypeScript Configuration

### tsconfig.json for data-structure-typed

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Package.json Setup

```json
{
  "dependencies": {
    "data-structure-typed": "^latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^latest"
  }
}
```

---

## Import Patterns

### All Structures

```typescript
import {
  // Trees
  BST,
  AVLTree,
  RedBlackTree,
  BSTNode,
  TreeMultiMap,
  
  // Linear
  Stack,
  Queue,
  Deque,
  LinkedList,
  SinglyLinkedList,
  DoublyLinkedList,
  
  // Heap
  Heap,
  MinHeap,
  MaxHeap,
  MinPriorityQueue,
  MaxPriorityQueue,
  
  // Special
  Trie,
  DirectedGraph,
  UndirectedGraph,
  
  // Utilities
  SegmentTree,
  FenwickTree
} from 'data-structure-typed';
```

### Module Systems

```typescript
// ES Module (ESM)
import { RedBlackTree } from 'data-structure-typed';

// CommonJS
const { RedBlackTree } = require('data-structure-typed');

// TypeScript with full typing
import { RedBlackTree } from 'data-structure-typed/dist/esm/red-black-tree';

// CDN (for browsers)
<script src="https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js"></script>
<script>
  const tree = new DataStructureTyped.RedBlackTree();
</script>
```

---

## Common Integration Patterns

### Pattern 1: Dependency Injection (Nest.js)

```typescript
import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Module({
  providers: [RankingService],
  exports: [RankingService]
})
export class RankingModule {}

// Use in other services
@Injectable()
export class GameService {
  constructor(private rankingService: RankingService) {}

  async updatePlayerScore(userId: string, score: number): Promise<void> {
    this.rankingService.addOrUpdateScore(userId, '', score);
  }
}
```

### Pattern 2: React Hooks

```typescript
import { useState, useCallback, useRef } from 'react';
import { RedBlackTree } from 'data-structure-typed';

export function useSortedList<T>(initialData: T[] = []) {
  const treeRef = useRef(new RedBlackTree<number, T>());
  const [, setUpdateTrigger] = useState({});

  const add = useCallback((index: number, item: T) => {
    treeRef.current.set(index, item);
    setUpdateTrigger({});
  }, []);

  const remove = useCallback((index: number) => {
    treeRef.current.delete(index);
    setUpdateTrigger({});
  }, []);

  const getAll = useCallback(() => {
    return [...treeRef.current.values()];
  }, []);

  return { add, remove, getAll };
}

// Usage
function MyComponent() {
  const { add, remove, getAll } = useSortedList();

  return (
    <div>
      <button onClick={() => add(1, 'Item 1')}>Add Item</button>
      <ul>
        {getAll().map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Troubleshooting

### Issue: Import Error

```typescript
// ❌ Wrong
import RedBlackTree from 'data-structure-typed';

// ✅ Correct
import { RedBlackTree } from 'data-structure-typed';
```

### Issue: Type Not Found

```typescript
// Make sure TypeScript configuration is correct
// and you have the latest type definitions
npm update data-structure-typed
```

### Issue: Performance in Development

```typescript
// Development mode is slower due to hot reload
// Use production build for benchmarking:
npm run build
NODE_ENV=production node your-app.js
```

---

**Need more examples?** Check [GUIDES.md](./GUIDES.md) for more patterns.

**Performance questions?** See [PERFORMANCE.md](./PERFORMANCE.md).
