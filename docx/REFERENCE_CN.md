# 参考：完整 API 和数据结构

权威的 API、结构和方法查询指南。当您需要查询调用方式时使用。

**[回到 README](../README_CN.md) • [实战示例](./GUIDES_CN.md) • [性能](./PERFORMANCE_CN.md)**

---

## 目录

1. [快速参考表](#快速参考表)
2. [所有数据结构](#所有数据结构)
3. [CRUD 操作](#crud-操作)
4. [常见方法](#常见方法)
5. [TypeScript 支持](#typescript-支持)

---

## 快速参考表

| 数据结构 | 最佳用途 | 时间复杂度 | 空间 |
|---------|---------|----------|------|
| **Array** | 直接索引访问 | O(n) 插入/删除 | O(n) |
| **LinkedList** | 动态大小、快速插入 | O(n) 搜索，O(1) 插入 | O(n) |
| **Stack** | 撤销/重做、DFS | O(1) 所有 | O(n) |
| **Queue** | FIFO 处理 | O(1) 所有 | O(n) |
| **Deque** | 首尾操作 | O(1) 所有 | O(n) |
| **BinaryTree** | 分层数据 | O(n) 平均 | O(n) |
| **BST** | 排序搜索 | O(log n) 平均 | O(n) |
| **RedBlackTree** | 保证排序 | O(log n) 保证 | O(n) |
| **AVLTree** | 平衡排序 | O(log n) 保证 | O(n) |
| **Heap** | 优先队列 | O(log n) 添加/移除 | O(n) |
| **PriorityQueue** | 任务调度 | O(log n) 添加/poll | O(n) |
| **Trie** | 前缀搜索 | O(m+k) 搜索 | O(26n) |
| **Graph** | 网络、路径 | 变化 | O(V+E) |

---

## 所有数据结构

### 线性结构

#### Stack（栈）
```typescript
import { Stack } from 'data-structure-typed';

const stack = new Stack<number>();
stack.push(1, 2, 3);        // 添加到顶部
const top = stack.pop();     // 从顶部移除 - O(1)
const peek = stack.peek();   // 查看顶部
stack.print();               // 3, 2, 1
```

#### Queue（队列）
```typescript
import { Queue } from 'data-structure-typed';

const queue = new Queue<number>();
queue.push(1, 2, 3);         // 添加到后面
const first = queue.shift(); // 从前面移除 - O(1)
const size = queue.size;     // 当前大小
```

#### Deque（双端队列）
```typescript
import { Deque } from 'data-structure-typed';

const deque = new Deque<number>();
deque.push(3);               // 添加到后面
deque.unshift(1);            // 添加到前面
deque.pop();                 // 从后面移除 - O(1)
deque.shift();               // 从前面移除 - O(1)
```

#### Linked Lists（链表）
```typescript
import { SinglyLinkedList, DoublyLinkedList } from 'data-structure-typed';

const singly = new SinglyLinkedList<number>();
const doubly = new DoublyLinkedList<number>();

singly.push(1, 2, 3);        // 添加到末尾
singly.insertAt(1, 99);      // 在索引插入 - O(n)
singly.deleteAt(1);          // 在索引删除 - O(n)
```

### 树结构

#### Binary Search Tree（二叉搜索树）
```typescript
import { BST } from 'data-structure-typed';

const bst = new BST<number>();
bst.add(5, 3, 8, 1, 9);      // 添加元素
bst.has(5);                  // 检查存在 - O(log n) 平均
bst.delete(3);               // 移除 - O(log n) 平均
bst.print();                 // 可视化表示
```

#### Red-Black Tree（红黑树）
```typescript
import { RedBlackTree } from 'data-structure-typed';

const rbTree = new RedBlackTree<number, string>();
rbTree.set(1, 'Alice');      // 添加键值
rbTree.set(2, 'Bob');
rbTree.get(1);               // 'Alice'
rbTree.delete(1);            // 移除 - O(log n) 保证
const sorted = [...rbTree.keys()]; // 自动排序
```

#### AVL Tree（AVL 树）
```typescript
import { AVLTree } from 'data-structure-typed';

const avl = new AVLTree<number>();
avl.add(5, 3, 8, 1, 9);
avl.isAVLBalanced();         // 检查平衡
avl.delete(3);               // 自动重新平衡
```

### 堆和优先队列

#### Heap（堆）
```typescript
import { MinHeap, MaxHeap } from 'data-structure-typed';

const minHeap = new MinHeap<number>();
minHeap.push(5, 3, 8, 1);    // 添加元素 - O(log n)
const min = minHeap.pop();   // 获取最小值 - O(log n)
const peek = minHeap.peek(); // 查看最小值 - O(1)
```

#### Priority Queue（优先队列）
```typescript
import { MaxPriorityQueue } from 'data-structure-typed';

const pq = new MaxPriorityQueue<Task>();
pq.add({ id: 1, priority: 5 }); // 添加 - O(log n)
const task = pq.poll();          // 移除最高 - O(log n)
const size = pq.size;            // 当前大小
```

### 特殊结构

#### Trie（字典树）
```typescript
import { Trie } from 'data-structure-typed';

const trie = new Trie();
trie.insert('apple', 'app', 'apply');
trie.getWords('app');        // ['app', 'apple', 'apply'] - O(m+k)
trie.startsWith('ap');       // true
trie.search('apple');        // true
```

#### Graph（图）
```typescript
import { DirectedGraph, UndirectedGraph } from 'data-structure-typed';

const graph = new DirectedGraph<string>();
graph.addVertex('A');
graph.addVertex('B');
graph.addEdge('A', 'B', 1);  // 添加带权边
graph.hasEdge('A', 'B');     // true
const [dist, path] = graph.dijkstra('A', 'B'); // 最短路径
const order = graph.topologicalSort(); // DAG 顺序
```

---

## CRUD 操作

### 创建（添加）

```typescript
// 树
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');
tree.setMany([[2, 'Bob'], [3, 'Charlie']]);

// 堆
const heap = new MaxHeap<number>();
heap.push(10, 20, 15);

// 字典树
const trie = new Trie();
trie.insert('hello', 'world');

// 图
const graph = new DirectedGraph<string>();
graph.addVertex('A');
graph.addEdge('A', 'B', 1);
```

### 读取（查询）

```typescript
// 树
tree.get(1);               // 'Alice'
tree.has(1);               // true
tree.size;                 // 元素数量

// 堆
heap.peek();               // 最高优先级元素
heap.size;                 // 当前大小

// 字典树
trie.search('hello');      // true
trie.startsWith('hel');    // true

// 图
graph.hasVertex('A');      // true
graph.hasEdge('A', 'B');   // true
graph.getNeighbors('A');   // 连接顶点
```

### 更新（修改）

```typescript
// 树
tree.set(1, 'Alice Updated'); // 更新值
tree.delete(1);               // 移除

// 堆
heap.pop();                    // 移除最高

// 图
graph.deleteEdge('A', 'B');   // 移除边
graph.deleteVertex('A');      // 移除顶点
```

### 删除

```typescript
// 所有结构都支持：
structure.clear();             // 移除所有元素
structure.delete(key);         // 移除特定
```

---

## 常见方法

### 适用于所有结构

```typescript
// 迭代
structure.forEach((value, key) => {});
for (const item of structure) { }

// 转换
[...structure];                // 展开
Array.from(structure);         // Array 转换

// 数组方法
structure.map((v, k) => v * 2);
structure.filter((v, k) => v > 5);
structure.reduce((acc, v) => acc + v, 0);
structure.find((v, k) => v === 5);
structure.some((v, k) => v > 10);
structure.every((v, k) => v > 0);

// 属性
structure.size;                // 元素数
structure.isEmpty();           // 检查空
```

### 结构特定方法

#### 树
```typescript
tree.height;                   // 树高
tree.isAVLBalanced();         // 平衡检查
tree.getNode(key);            // 获取节点对象
tree.getHeight(key);          // 节点高度
tree.getLeftMost();           // 最左节点
tree.getRightMost();          // 最右节点
```

#### Deque
```typescript
deque.peekFirst();            // 查看前面
deque.peekLast();             // 查看后面
deque.pollFirst();            // 移除前面 - O(1)
deque.pollLast();             // 移除后面 - O(1)
```

---

## TypeScript 支持

所有结构完全支持 TypeScript 泛型：

```typescript
// 类型安全
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');
const value = tree.get(1);  // 类型：string | undefined

// 复杂类型
interface User {
  id: number;
  name: string;
  score: number;
}

const users = new RedBlackTree<number, User>();
users.set(1, { id: 1, name: 'Alice', score: 100 });
const user = users.get(1);  // 类型：User | undefined
```

---

更多示例和最佳实践见 [GUIDES_CN.md](./GUIDES_CN.md)
