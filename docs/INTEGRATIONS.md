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

/** KEY INSIGHT: Use compound keys to solve the problem of "multiple products at the same price" */
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
 * Multiple at Price  | ✓ Supported           | ✓         | Complex
 *
 * Advantages:
 * - O(1) idToKeyMap lookup + O(log n) tree operations
 * - Automatic ordering without post-sort
 * - Efficient range queries for pricing tiers
 * - Low memory footprint vs duplicate maps
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
    });
    this.idToKeyMap = new Map();
  }

  /** Time Complexity: O(log n) */
  addProduct(product: Product): Product {
    if (this.idToKeyMap.has(product.id))
      throw new BadRequestException(`Product ${product.id} already exists`);

    product.lastUpdated = new Date();

    const key: CompositeKey = {
      price: product.price,
      productId: product.id,
    };

    this.priceIndex.add(key, product);
    this.idToKeyMap.set(product.id, key);

    return product;
  }

  /** Time Complexity: O(log n) */
  updateProduct(productId: string, updates: Partial<Product>): Product {
    const oldKey = this.idToKeyMap.get(productId);
    if (oldKey === undefined)
      throw new NotFoundException(`Product ${productId} not found`);

    const existing = this.priceIndex.get(oldKey);
    if (!existing)
      throw new NotFoundException(`Product ${productId} not found`);

    const updated: Product = {
      ...existing,
      ...updates,
      id: existing.id,
      lastUpdated: new Date(),
    };

    const newPrice = updates.price ?? existing.price;

    this.priceIndex.delete(oldKey);
    const currentKey: CompositeKey = {
      price: newPrice,
      productId,
    };
    this.priceIndex.set(currentKey, updated);
    this.idToKeyMap.set(productId, currentKey);

    return updated;
  }

  /** Time Complexity: O(1) */
  getProductById(productId: string): Product {
    const key = this.idToKeyMap.get(productId);

    if (key === undefined)
      throw new NotFoundException(`Product ${productId} not found`);

    return this.priceIndex.get(key)!;
  }

  /** Time Complexity: O(log n + k) */
  getProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    const range = new Range(
      { price: minPrice, productId: '' },
      { price: maxPrice, productId: '\uffff' },
      true, // includeLow
      true, // includeHigh
    );

    const keys = this.priceIndex.rangeSearch(range, (n) => n.key);
    return keys.map((key) => this.priceIndex.get(key)!);
  }

  /** Time Complexity: O(log n) */
  getHighestPricedProductWithinBudget(maxBudget: number): Product | null {
    const key: CompositeKey = {
      price: maxBudget,
      productId: '\uffff',
    };
    const floorKey = this.priceIndex.floor(key);
    return floorKey ? this.priceIndex.get(floorKey)! : null;
  }

  /** Time O(log n) */
  getCheapestProductAbovePrice(minPrice: number): Product | null {
    const key: CompositeKey = {
      price: minPrice,
      productId: '\uffff',
    };
    const higherKey = this.priceIndex.higher(key);
    return higherKey ? this.priceIndex.get(higherKey)! : null;
  }

  /** Time Complexity: O(log n + k) */
  getProductsByTier(tierName: TierName): Product[] {
    const tiers = {
      budget: [0, 50],
      'mid-range': [50, 200],
      premium: [200, Infinity],
    };

    const [min, max] = tiers[tierName];
    return this.getProductsByPriceRange(min, max);
  }

  /** Time Complexity: O(log n + k + m) */
  getProductsByPriceAndCategory(
    minPrice: number,
    maxPrice: number,
    category: string,
  ): Product[] {
    const priceRangeProducts = this.getProductsByPriceRange(minPrice, maxPrice);
    return priceRangeProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  /** Time Complexity: O((log n + k) * log n) */
  applyDiscountToRange(
    minPrice: number,
    maxPrice: number,
    discountPercent: number,
  ): Product[] {
    const products = this.getProductsByPriceRange(minPrice, maxPrice);
    const updated: Product[] = [];

    for (const product of products) {
      const newPrice = product.price * (1 - discountPercent / 100);
      const updatedProduct = this.updateProduct(product.id, {
        price: newPrice,
      });
      updated.push(updatedProduct);
    }

    return updated;
  }

  /** Time Complexity: O(log n) */
  deleteProduct(productId: string): void {
    const key = this.idToKeyMap.get(productId);

    if (key === undefined)
      throw new NotFoundException(`Product ${productId} not found`);

    this.priceIndex.delete(key);
    this.idToKeyMap.delete(productId);
  }

  /** Time Complexity: O(n) */
  getStatistics(): {
    totalProducts: number;
    priceRange: { min: number; max: number };
    averagePrice: number;
    totalValue: number;
  } {
    if (this.idToKeyMap.size === 0) {
      return {
        totalProducts: 0,
        priceRange: { min: 0, max: 0 },
        averagePrice: 0,
        totalValue: 0,
      };
    }

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let totalValue = 0;
    let totalProducts = 0;

    let entry = this.priceIndex.getLeftMost((node) => node);

    while (entry) {
      const product = this.priceIndex.get(entry.key);
      if (product) {
        minPrice = Math.min(minPrice, product.price);
        maxPrice = Math.max(maxPrice, product.price);
        totalValue += product.price * product.quantity;
        totalProducts += product.quantity;
      }

      entry = this.priceIndex.higher(entry.key, (node) => node);
    }

    return {
      totalProducts: totalProducts,
      priceRange: { min: minPrice, max: maxPrice },
      averagePrice: totalValue / totalProducts,
      totalValue,
    };
  }

  /** Time Complexity: O(n) */
  getAllProductsSortedByPrice(): Product[] {
    const products: Product[] = [];
    let curNode = this.priceIndex.getLeftMost((node) => node);

    while (curNode) {
      if (curNode.key) products.push(this.priceIndex.get(curNode.key)!);
      curNode = this.priceIndex.higher(curNode.key, (node) => node);
    }

    return products;
  }

  /** O(1) */
  getProductCount(): number {
    return this.idToKeyMap.size;
  }

  /** O(1) */
  hasProduct(productId: string): boolean {
    return this.idToKeyMap.has(productId);
  }

  /** O(n) */
  getAllProductIds(): string[] {
    return [...this.idToKeyMap.keys()];
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
