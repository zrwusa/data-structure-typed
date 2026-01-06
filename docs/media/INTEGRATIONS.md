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

```typescript
import React, { useState, useMemo } from 'react';
import { RedBlackTree } from 'data-structure-typed';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: number;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<RedBlackTree<number, TodoItem>>(
    new RedBlackTree<number, TodoItem>(
      (a, b) => b - a  // Sort by priority descending
    )
  );

  // Memoized sorted values
  const sortedTodos = useMemo(() => [...todos.values()], [todos]);

  const addTodo = (text: string, priority: number) => {
    setTodos(prev => {
      const next = prev.clone();
      next.set(priority, {
        id: Math.random(),
        text,
        completed: false,
        priority
      });
      return next;
    });
  };

  const toggleTodo = (id: number, newPriority: number) => {
    setTodos(prev => {
      const next = prev.clone();
      const todo = [...prev.values()].find(t => t.id === id);
      
      if (todo) {
        // Remove old priority entry
        next.delete(todo.priority);
        // Add with new priority
        next.set(newPriority, { ...todo, priority: newPriority });
      }
      return next;
    });
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => {
      const next = prev.clone();
      const todo = [...prev.values()].find(t => t.id === id);
      if (todo) {
        next.delete(todo.priority);
      }
      return next;
    });
  };

  return (
    <div className="todo-app">
      <h1>Priority Todos (Auto-Sorted)</h1>
      
      <div className="input-section">
        <input type="text" id="text" placeholder="Todo text" />
        <input type="number" id="priority" placeholder="Priority (1-10)" />
        <button onClick={() => {
          const text = (document.getElementById('text') as HTMLInputElement).value;
          const priority = parseInt((document.getElementById('priority') as HTMLInputElement).value);
          addTodo(text, priority);
        }}>Add Todo</button>
      </div>

      <ul className="todo-list">
        {sortedTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.priority)}
            />
            <span>{todo.text}</span>
            <span className="priority">P{todo.priority}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div className="stats">
        Total: {todos.size} | 
        High Priority (≥7): {sortedTodos.filter(t => t.priority >= 7).length}
      </div>
    </div>
  );
}
```

### Use Case: Leaderboard Component

```typescript
import React, { useState, useCallback } from 'react';
import { RedBlackTree } from 'data-structure-typed';

interface Player {
  id: string;
  name: string;
  score: number;
}

export function LeaderboardComponent() {
  const [leaderboard, setLeaderboard] = useState<RedBlackTree<number, Player>>(
    new RedBlackTree((a, b) => b - a)  // Descending by score
  );

  const updateScore = useCallback((player: Player) => {
    setLeaderboard(prev => {
      const next = prev.clone();
      
      // Remove old score if exists
      const existing = [...prev.values()].find(p => p.id === player.id);
      if (existing) {
        next.delete(existing.score);
      }
      
      // Add new score
      next.set(player.score, player);
      return next;
    });
  }, []);

  const topPlayers = [...leaderboard.values()].slice(0, 10);

  return (
    <div className="leaderboard">
      <h2>Top 10 Players</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player, index) => (
            <tr key={player.id}>
              <td>#{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
