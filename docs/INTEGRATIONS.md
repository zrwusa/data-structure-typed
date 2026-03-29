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
 * ║ Add todo        ║ O(log n)          ║ O(n log n)      ║ Often much faster* ║
 * ║ Delete todo     ║ O(log n)          ║ O(n)            ║ Often faster*      ║
 * ║ Keep sorted     ║ Automatic ✓       ║ Manual sort ✗   ║ Less code          ║
 * ║ Rebalancing     ║ Self-balancing ✓  ║ N/A             ║ N/A                ║
 * ╠═════════════════╩═══════════════════╩═════════════════╩══════════════════╣
 * ║ *See PERFORMANCE.md for measured benchmarks and how results scale.       ║
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
   *    - Note: Actual wall-clock impact depends on your workload (rendering, GC, object shapes, etc.).
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

```javascript
const  {DoublyLinkedList} = require('data-structure-typed');

class LRUCache {
  constructor(capacity = 100) {
    this.cache = new Map();
    this.order = new DoublyLinkedList();
    this.capacity = capacity;
  }
  get(key) {
    if (!this.cache.has(key))
      return null;
    const { value, node } = this.cache.get(key);
    // Move to end (most recently used)
    this.order.delete(node);
    const newNode = this.order.push(key);
    this.cache.set(key, { value, node: newNode });
    return value;
  }
  set(key, value) {
    if (this.cache.has(key)) {
      this.get(key); // Mark as recently used
      this.cache.get(key).value = value;
      return;
    }
    if (this.cache.size >= this.capacity) {
      const lru = this.order.shift();
      this.cache.delete(lru);
    }
    const node = this.order.push(key);
    this.cache.set(key, { value, node });
  }
}

module.exports = LRUCache;
```

```javascript
// Usage in Express
const app = express();
const responseCache = new LRUCache(50);
app.use((req, res, next) => {
  const cachedResponse = responseCache.get(req.url);
  if (cachedResponse) {
    return res.status(cachedResponse.status).json(cachedResponse.data);
  }
  // Wrap original send to cache response
  const originalSend = res.send;
  res.send = function (data) {
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

### Use Case: Product Price Index Service

> Full working demo: [StackBlitz NestJS Playground](https://stackblitz.com/github/zrwusa/dst-playgrounds/tree/main/apps/nestjs?file=src%2Fproduct%2Fservices%2Fproduct-price-index.service.ts&title=data-structure-typed%20%E2%80%94%20NestJS%20Product%20API)

```typescript
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Range, RedBlackTree } from 'data-structure-typed';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  lastUpdated?: Date;
}

interface CompositeKey {
  price: number;
  productId: string;
}

export type TierName = 'budget' | 'mid-range' | 'premium';

/**
 * Product Price Index Service using Red-Black Tree with Composite Keys
 *
 * ⭐ Performance vs Alternatives:
 *
 * Operation          | RBTree(this approach) | Array     | HashMap + Sort
 * -------------------|-----------------------|-----------|---------------
 * Range Query        | O(log n + k)          | O(n)      | O(k log k)
 * Point Lookup       | O(1)                  | O(1)      | O(1)
 * Insert/Update      | O(log n)              | O(n)      | O(log n)
 * Sort by Price      | O(n)                  | O(n log n)| O(n log n)
 * Pagination         | O(log n + k)          | O(n log n)| O(n log n)
 * Rank/Percentile    | O(log n)              | O(n)      | O(n log n)
 */
@Injectable()
export class ProductPriceIndexService {
  private priceIndex: RedBlackTree<CompositeKey, Product>;
  private idToKeyMap: Map<string, CompositeKey>;

  constructor() {
    this.priceIndex = new RedBlackTree([], {
      comparator: (a: CompositeKey, b: CompositeKey) => {
        const priceCmp = a.price - b.price;
        if (priceCmp !== 0) return priceCmp;
        return a.productId.localeCompare(b.productId);
      },
      enableOrderStatistic: true, // Enables getRank/getByRank/rangeByRank
    });
    this.idToKeyMap = new Map();
  }

  /** O(log n) */
  addProduct(product: Product): Product {
    if (this.idToKeyMap.has(product.id))
      throw new BadRequestException(`Product ${product.id} already exists`);

    product.lastUpdated = new Date();
    const key: CompositeKey = { price: product.price, productId: product.id };
    this.priceIndex.set(key, product);
    this.idToKeyMap.set(product.id, key);
    return product;
  }

  /** O(1) — HashMap lookup */
  getProductById(productId: string): Product {
    const key = this.idToKeyMap.get(productId);
    if (key === undefined)
      throw new NotFoundException(`Product ${productId} not found`);
    return this.priceIndex.get(key)!;
  }

  /** O(log n + k) — directly returns values, no secondary lookup */
  getProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    const range = new Range(
      { price: minPrice, productId: '' },
      { price: maxPrice, productId: '\uffff' },
      true,
      true,
    );
    return this.priceIndex.rangeSearch(range, (n) => n.value!);
  }

  /** O(log n) — NavigableMap floor() */
  getHighestPricedProductWithinBudget(maxBudget: number): Product | null {
    const key: CompositeKey = { price: maxBudget, productId: '\uffff' };
    const floorKey = this.priceIndex.floor(key);
    return floorKey ? this.priceIndex.get(floorKey)! : null;
  }

  /** O(n) — iterator protocol, one-liner */
  getAllProductsSortedByPrice(): Product[] {
    return [...this.priceIndex.values()];
  }

  /**
   * O(n) for totalValue, O(log n) for min/max
   * min/max use getLeftMost/getRightMost instead of full traversal
   */
  getStatistics() {
    if (this.idToKeyMap.size === 0)
      return { totalProducts: 0, priceRange: { min: 0, max: 0 }, averagePrice: 0, totalValue: 0 };

    const minKey = this.priceIndex.getLeftMost();
    const maxKey = this.priceIndex.getRightMost();

    let totalValue = 0;
    let totalProducts = 0;
    for (const [, product] of this.priceIndex) {
      totalValue += product.price * product.quantity;
      totalProducts += product.quantity;
    }

    return {
      totalProducts,
      priceRange: { min: minKey?.price ?? 0, max: maxKey?.price ?? 0 },
      averagePrice: totalValue / totalProducts,
      totalValue,
    };
  }

  // ── Order-Statistic API (rank-based queries) ──────────────────────

  /** O(log n + pageSize) — rank-based pagination */
  getProductsByPage(page: number, pageSize: number): Product[] {
    const start = page * pageSize;
    const end = Math.min(start + pageSize - 1, this.priceIndex.size - 1);
    if (start >= this.priceIndex.size) return [];
    const keys = this.priceIndex.rangeByRank(start, end);
    return keys.map((key) => this.priceIndex.get(key)!);
  }

  /** O(log n) — what % of products are cheaper */
  getPricePercentile(productId: string): number {
    const key = this.idToKeyMap.get(productId);
    if (!key) throw new NotFoundException(`Product ${productId} not found`);
    return (this.priceIndex.getRank(key) / this.priceIndex.size) * 100;
  }

  /** O(log n) — median product */
  getMedianProduct(): Product | null {
    if (this.priceIndex.size === 0) return null;
    const key = this.priceIndex.getByRank(Math.floor((this.priceIndex.size - 1) / 2));
    return key ? this.priceIndex.get(key)! : null;
  }

  /** O(log n + k) — top N cheapest */
  getTopNCheapest(n: number): Product[] {
    const end = Math.min(n - 1, this.priceIndex.size - 1);
    if (end < 0) return [];
    return this.priceIndex.rangeByRank(0, end).map((key) => this.priceIndex.get(key)!);
  }

  /** O(log n + k) — top N most expensive */
  getTopNExpensive(n: number): Product[] {
    const size = this.priceIndex.size;
    if (size === 0) return [];
    const start = Math.max(size - n, 0);
    return this.priceIndex.rangeByRank(start, size - 1)
      .map((key) => this.priceIndex.get(key)!)
      .reverse();
  }

  /** O(log n) — dynamic tier by percentile, no hardcoded price ranges */
  getTierByPercentile(productId: string): TierName {
    const pct = this.getPricePercentile(productId);
    if (pct < 33) return 'budget';
    if (pct < 66) return 'mid-range';
    return 'premium';
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
  private taskQueue = new MaxPriorityQueue<QueuedTask>([], {
    comparator: (a, b) => a.priority - b.priority,
  });

  @Post('add')
  addTask(@Body() task: QueuedTask): { success: boolean; queueSize: number } {
    this.taskQueue.add(task);
    return {
      success: true,
      queueSize: this.taskQueue.size,
    };
  }

  @Post('process')
  processNext(): { success: boolean; task: QueuedTask | null } {
    const task = this.taskQueue.poll();
    return {
      success: !!task,
      task: task || null,
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

```js
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
import { ProductInventoryService } from './product-inventory.service';

@Module({
  providers: [ProductInventoryService],
  exports: [ProductInventoryService]
})
export class ProductInventoryModule {}

// Use in other services
@Injectable()
export class OutherService {
  constructor(private inventoryService: ProductInventoryService) {}

  async addProduct(product: Product): Promise<void> {
    this.inventoryService.addProduct(product);
  }
}
```

### Pattern 2: React Hooks

```tsx
import {useCallback, useRef, useState} from 'react';
import {RedBlackTree} from 'data-structure-typed';

function useSortedList<T>(initialData: T[] = []) {
  const treeRef = useRef(new RedBlackTree<number, T>(initialData));
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

  return {add, remove, getAll};
}

// Usage
function MyComponent() {
  const {add, remove, getAll} = useSortedList<string>([]);

  return (
    <div>
      <button onClick={() => add(1, 'Item 1')}>Add Item</button>
      <ul>
        {getAll().map((item, i) => (
          <li key={i} onClick={() => remove(i)}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default MyComponent;
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

```shell
// Make sure TypeScript configuration is correct
// and you have the latest type definitions
npm update data-structure-typed
```

### Issue: Performance in Development

```shell
// Development mode is slower due to hot reload
// Use production build for benchmarking:
npm run build
NODE_ENV=production node your-app.js
```

---

**Need more examples?** Check [GUIDES.md](./GUIDES.md) for more patterns.

**Performance questions?** See [PERFORMANCE.md](./PERFORMANCE.md).
