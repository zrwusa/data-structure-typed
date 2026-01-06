# 集成：框架集成指南

如何在 React、Express、Nest.js 和其他框架中使用 data-structure-typed。

**[回到 README](../README_CN.md) • [代码示例](./GUIDES_CN.md) • [性能](./PERFORMANCE_CN.md)**

---

## 目录

1. [React 集成](#react-集成)
2. [Express 集成](#express-集成)
3. [Nest.js 集成](#nestjs-集成)
4. [TypeScript 配置](#typescript-配置)

---

## React 集成

### 用例：排序状态管理

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
      (a, b) => b - a  // 按优先级降序排序
    )
  );

  // 记忆化排序值
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

  return (
    <div className="todo-app">
      <h1>优先级 Todos（自动排序）</h1>
      <ul className="todo-list">
        {sortedTodos.map(todo => (
          <li key={todo.id}>
            <span>{todo.text}</span>
            <span className="priority">P{todo.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 用例：排行榜组件

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
    new RedBlackTree((a, b) => b - a)  // 按分数降序
  );

  const updateScore = useCallback((player: Player) => {
    setLeaderboard(prev => {
      const next = prev.clone();
      
      // 如果存在，移除旧分数
      const existing = [...prev.values()].find(p => p.id === player.id);
      if (existing) {
        next.delete(existing.score);
      }
      
      // 添加新分数
      next.set(player.score, player);
      return next;
    });
  }, []);

  const topPlayers = [...leaderboard.values()].slice(0, 10);

  return (
    <div className="leaderboard">
      <h2>前 10 名玩家</h2>
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>名字</th>
            <th>分数</th>
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

## Express 集成

### 用例：LRU 缓存中间件

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
    
    // 移到末尾（最近使用）
    this.order.deleteNode(node);
    const newNode = this.order.pushBack(key);
    this.cache.set(key, { value, node: newNode });

    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.get(key);  // 标记为最近使用
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

// Express 中使用
const app = express();
const responseCache = new LRUCache<{ status: number; data: any }>(50);

app.use((req: Request, res: Response, next: Function) => {
  const cachedResponse = responseCache.get(req.url);
  
  if (cachedResponse) {
    return res.status(cachedResponse.status).json(cachedResponse.data);
  }

  // 包装原始 send 缓存响应
  const originalSend = res.send;
  res.send = function(data: any) {
    responseCache.set(req.url, { status: res.statusCode, data });
    return originalSend.call(this, data);
  };

  next();
});

app.get('/api/data', (req, res) => {
  res.json({ message: '缓存响应' });
});

app.listen(3000);
```

### 用例：使用 Deque 的速率限制

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

    // 移除窗口外的旧请求
    while (!deque.isEmpty && deque.peekFirst()! < now - this.windowMs) {
      deque.shift();
    }

    // 检查限制
    if (deque.size >= this.limit) {
      return false;
    }

    // 添加新请求
    deque.push(now);
    return true;
  }
}

// Express 中使用
const app = express();
const limiter = new RateLimiter(10, 60000); // 每分钟 10 个请求

app.use((req: Request, res: Response, next: Function) => {
  const clientId = req.ip;

  if (!limiter.isAllowed(clientId)) {
    return res.status(429).json({ error: '请求过于频繁' });
  }

  next();
});

app.get('/api/data', (req, res) => {
  res.json({ data: '您的数据' });
});
```

---

## Nest.js 集成

### 用例：排名服务

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
    (a, b) => b - a  // 降序排列
  );
  private userScores = new Map<string, number>();

  updateScore(userId: string, userName: string, score: number): void {
    // 移除旧分数
    if (this.userScores.has(userId)) {
      const oldScore = this.userScores.get(userId)!;
      this.rankings.delete(oldScore);
    }

    // 添加新分数
    const entry: RankingEntry = {
      userId,
      userName,
      score,
      lastUpdated: new Date()
    };
    
    this.rankings.set(score, entry);
    this.userScores.set(userId, score);
  }

  getTopN(n: number): RankingEntry[] {
    return [...this.rankings.values()].slice(0, n);
  }

  getUserRank(userId: string): number | null {
    if (!this.userScores.has(userId)) return null;

    const score = this.userScores.get(userId)!;
    let rank = 1;

    for (const [s] of this.rankings) {
      if (s > score) rank++;
      else break;
    }

    return rank;
  }

  getAroundUser(userId: string, range: number): RankingEntry[] {
    const rank = this.getUserRank(userId);
    if (rank === null) return [];

    const start = Math.max(1, rank - range);
    const end = Math.min(this.rankings.size, rank + range);

    return [...this.rankings.values()].slice(start - 1, end);
  }
}
```

---

## TypeScript 配置

推荐的 TypeScript 设置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  }
}
```

---

更多示例见 [GUIDES_CN.md](./GUIDES_CN.md)。
