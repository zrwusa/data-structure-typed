# INTEGRATIONS_FULL: 框架集成指南完整版

如何在 React、Express、Nest.js 和其他框架中使用 data-structure-typed。

**[返回 README](../README_CN.md) • [代码示例](./GUIDES_CN.md) • [性能](./PERFORMANCE_CN.md)**

---

## 目录

1. [React 集成](#react-集成)
2. [Express 集成](#express-集成)
3. [Nest.js 集成](#nestjs-集成)
4. [TypeScript 配置](#typescript-配置)
5. [导入模式](#导入模式)
6. [常见集成模式](#常见集成模式)

---

## Nest.js 集成

### 使用场景：优先级任务队列

```typescript
import { Module, Controller, Post, Get, Body } from '@nestjs/common';
import { MaxPriorityQueue } from 'data-structure-typed';

interface QueuedTask {
  id: string;
  priority: number;
  action: () => Promise<void>;
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

@Module({
  controllers: [TaskController],
})
export class TaskModule {}
```

---

## TypeScript 配置

### 针对 data-structure-typed 的 tsconfig.json

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

### Package.json 设置

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

## 导入模式

### 所有结构

```typescript
import {
  // 树结构
  BST,
  AVLTree,
  RedBlackTree,
  BSTNode,
  TreeMultiMap,
  
  // 线性结构
  Stack,
  Queue,
  Deque,
  LinkedList,
  SinglyLinkedList,
  DoublyLinkedList,
  
  // 堆结构
  Heap,
  MinHeap,
  MaxHeap,
  MinPriorityQueue,
  MaxPriorityQueue,
  
  // 特殊结构
  Trie,
  DirectedGraph,
  UndirectedGraph,
  
  // 工具
  SegmentTree,
  FenwickTree
} from 'data-structure-typed';
```

### 模块系统

```js
// ES Module (ESM)
import { RedBlackTree } from 'data-structure-typed';

// CommonJS
const { RedBlackTree } = require('data-structure-typed');

// TypeScript 完整类型
import { RedBlackTree } from 'data-structure-typed/dist/esm/red-black-tree';

// CDN（浏览器）
<script src="https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js"></script>
<script>
  const tree = new DataStructureTyped.RedBlackTree();
</script>
```

---

## 常见集成模式

### 模式 1: 依赖注入（Nest.js）

```typescript
import { Module } from '@nestjs/common';
import { ProductInventoryService } from './product-inventory.service';

@Module({
  providers: [ProductInventoryService],
  exports: [ProductInventoryService]
})
export class ProductInventoryModule {}

// 在其他服务中使用
@Injectable()
export class OutherService {
  constructor(private inventoryService: ProductInventoryService) {}

  async addProduct(product: Product): Promise<void> {
    this.inventoryService.addProduct(product);
  }
}
```

### 模式 2: React Hooks

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

// 使用
function MyComponent() {
  const {add, remove, getAll} = useSortedList<string>([]);

  return (
    <div>
      <button onClick={() => add(1, 'Item 1')}>添加项目</button>
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

## 故障排除

### 问题：导入错误

```typescript
// ❌ 错误
import RedBlackTree from 'data-structure-typed';

// ✅ 正确
import { RedBlackTree } from 'data-structure-typed';
```

### 问题：找不到类型

```shell
// 确保 TypeScript 配置正确
// 并且你有最新的类型定义
npm update data-structure-typed
```

### 问题：开发中性能低

```shell
# 开发模式因为热重载而较慢
# 使用生产构建进行基准测试：
npm run build
NODE_ENV=production node your-app.js
```

---

**需要更多例子？** 查看 [GUIDES_CN.md](./GUIDES_CN.md) 了解更多模式。

**性能问题？** 查看 [PERFORMANCE_CN.md](./PERFORMANCE_CN.md)。
