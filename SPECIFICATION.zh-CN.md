# 规范说明：data-structure-typed 库

**版本：** 2.0.4  
**最后更新：** 2026年1月  
**代码仓库：** https://github.com/zrwusa/data-structure-typed  
**API 文档：** https://data-structure-typed-docs.vercel.app

---

## 目录

1. [规范概述](#规范概述)
2. [支持的数据结构](#支持的数据结构)
3. [API 标准](#api-标准)
4. [类型系统规范](#类型系统规范)
5. [性能保证](#性能保证)
6. [模块系统支持](#模块系统支持)
7. [浏览器与运行时兼容性](#浏览器与运行时兼容性)
8. [数据结构契约](#数据结构契约)
9. [迭代器协议合规性](#迭代器协议合规性)
10. [方法链式调用规范](#方法链式调用规范)
11. [错误处理](#错误处理)
12. [破坏性变更策略](#破坏性变更策略)

---

## 规范概述

**data-structure-typed** 是一个全面的 TypeScript 数据结构库，实现了 20 多种生产级数据结构，具有保证的时间/空间复杂度。

### 设计目标

- ✅ **统一 API**：所有线性结构使用一致的接口（push、pop、shift、unshift）
- ✅ **类型安全**：完整的 TypeScript 泛型与严格类型
- ✅ **性能保证**：树结构 O(log n)，双端队列操作 O(1)
- ✅ **零摩擦**：所有结构上的迭代器协议
- ✅ **生产就绪**：全面的错误处理和边缘情况覆盖
- ✅ **框架无关**：在 Node.js、浏览器和边缘运行时中工作

### 版本兼容性

| 版本 | 发布日期 | LTS 支持 | Node.js | TypeScript |
|---------|-------------|-------------|---------|-----------|
| 2.0.x   | 2025年1月    | 至2027年  | 16+     | 5.0+      |
| 1.x.x   | 2023-2024   | 至2025年  | 14+     | 4.5+      |

---

## 支持的数据结构

### 线性结构（共20+种）

| 结构 | 类别 | 时间复杂度 | 空间 | 状态 |
|-----------|----------|-----------------|-------|--------|
| **Stack（栈）** | 线性 | 所有操作 O(1) | O(n) | ✅ 稳定 |
| **Queue（队列）** | 线性 | 所有操作 O(1) | O(n) | ✅ 稳定 |
| **Deque（双端队列）** | 线性 | 所有操作 O(1) | O(n) | ✅ 稳定 |
| **SinglyLinkedList（单链表）** | 线性 | 平均访问 O(n)，插入 O(1)* | O(n) | ✅ 稳定 |
| **DoublyLinkedList（双链表）** | 线性 | 平均访问 O(n)，插入 O(1)* | O(n) | ✅ 稳定 |

### 树结构

| 结构 | 平衡 | 时间复杂度 | 保证 | 状态 |
|-----------|---------|-----------------|-----------|--------|
| **BinaryTree（二叉树）** | 无 | 平均 O(n) | 无 | ✅ 稳定 |
| **BST（二叉搜索树）** | 无 | 平均 O(log n) | 最坏 O(n) | ✅ 稳定 |
| **RedBlackTree（红黑树）** | 是 | O(log n) | O(log n) | ✅ 稳定 |
| **AVLTree（AVL树）** | 是 | O(log n) | O(log n) | ✅ 稳定 |
| **TreeMultiMap（树多重映射）** | 是 | O(log n) | O(log n) | ✅ 稳定 |

### 优先队列与堆

| 结构 | 类型 | 时间复杂度 | 使用场景 | 状态 |
|-----------|------|-----------------|----------|--------|
| **Heap（堆）** | 通用 | 添加/删除 O(log n) | 堆操作 | ✅ 稳定 |
| **MinHeap（最小堆）** | 最小 | 添加/删除 O(log n) | 最小优先级 | ✅ 稳定 |
| **MaxHeap（最大堆）** | 最大 | 添加/删除 O(log n) | 最大优先级 | ✅ 稳定 |
| **PriorityQueue（优先队列）** | 通用 | 添加/删除 O(log n) | 任务调度 | ✅ 稳定 |
| **MinPriorityQueue（最小优先队列）** | 最小 | 添加/删除 O(log n) | 最小优先级任务 | ✅ 稳定 |
| **MaxPriorityQueue（最大优先队列）** | 最大 | 添加/删除 O(log n) | 最大优先级任务 | ✅ 稳定 |

### 专用结构

| 结构 | 用途 | 时间复杂度 | 状态 |
|-----------|---------|-----------------|--------|
| **Trie（前缀树）** | 前缀搜索 | O(m+k) | ✅ 稳定 |
| **HashMap（哈希映射）** | 键值查找 | 平均 O(1) | ✅ 稳定 |
| **Graph（图）** | 图基类 | 不定 | ✅ 稳定 |
| **DirectedGraph（有向图）** | 有向图 | O(V+E) | ✅ 稳定 |
| **UndirectedGraph（无向图）** | 无向图 | O(V+E) | ✅ 稳定 |
| **SegmentTree（线段树）** | 区间查询 | O(log n) | ⚠️ Beta |
| **BinaryIndexedTree（树状数组）** | 累积查询 | O(log n) | ⚠️ Beta |

---

## API 标准

### 统一的线性结构 API

**所有线性结构（Stack、Queue、Deque、LinkedList）支持相同的 4 个核心方法：**

```typescript
// 添加操作
structure.push(element: T): number          // 添加到末尾，返回长度
structure.unshift(element: T): number       // 添加到开头，返回长度

// 删除操作
structure.pop(): T | undefined              // 从末尾删除
structure.shift(): T | undefined            // 从开头删除

// 查看操作（读取但不删除）
structure.peek(): T | undefined             // 查看最后一个元素
structure.peekFirst(): T | undefined        // 查看第一个元素（Deque）
structure.peekLast(): T | undefined         // 查看最后一个元素（Deque）

// 大小和查询
structure.size: number                      // 元素数量
structure.isEmpty: boolean                  // 检查是否为空
```

### 树和映射 API

**所有键值结构（树、映射）支持：**

```typescript
// 添加/更新
structure.set(key: K, value: V): this
structure.setMany(entries: [K, V][]): this

// 查询
structure.get(key: K): V | undefined
structure.has(key: K): boolean
structure.size: number

// 删除
structure.delete(key: K): boolean
structure.clear(): void

// 迭代
structure.keys(): IterableIterator<K>
structure.values(): IterableIterator<V>
structure.entries(): IterableIterator<[K, V]>
```

### 堆和优先队列 API

**所有堆和优先队列支持：**

```typescript
// 添加/删除
heap.push(element: T): number               // 添加元素
heap.add(element: T): number                // push 的别名
heap.pop(): T | undefined                  // 删除最高/最低优先级
heap.poll(): T | undefined                 // pop 的别名

// 查看
heap.peek(): T | undefined                 // 查看最高/最低优先级但不删除

// 查询
heap.size: number
heap.isEmpty: boolean
```

### 数组方法（所有结构上可用）

**所有结构通过迭代支持 ES6+ 数组方法：**

```typescript
structure.map<U>(mapper: (v: V, k?: K, index?: number) => U): this
structure.filter(predicate: (v: V, k?: K, index?: number) => boolean): this
structure.reduce<U>(reducer: (acc: U, v: V, k?: K, i?: number) => U, init: U): U
structure.find(predicate: (v: V, k?: K, i?: number) => boolean): V | undefined
structure.some(predicate: (v: V, k?: K, i?: number) => boolean): boolean
structure.every(predicate: (v: V, k?: K, i?: number) => boolean): boolean
structure.forEach(callback: (v: V, k?: K, i?: number) => void): void
```

---

## 类型系统规范

### 泛型参数

**键值结构的二元类型参数：**

```typescript
class RedBlackTree<K = number, V = any> {
  set(key: K, value: V): this
  get(key: K): V | undefined
}

// 使用示例
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');  // 类型安全
tree.get(1);           // 返回：string | undefined
```

**线性结构的单类型参数：**

```typescript
class Stack<T> {
  push(element: T): number
  pop(): T | undefined
}

// 使用示例
const stack = new Stack<number>();
stack.push(42);        // ✅ 类型安全
stack.push('text');    // ❌ 类型错误
```

### 比较器函数

**所有有序结构接受可选的比较器：**

```typescript
type Comparator<T> = (a: T, b: T) => number

// 返回值语义：
// < 0 表示 a 在 b 前面（升序）
// 0 表示相等
// > 0 表示 a 在 b 后面

const tree = new RedBlackTree<number>(
  (a, b) => b - a  // 降序
);
```

### 迭代器协议

**所有结构实现 Symbol.iterator：**

```typescript
interface Structure<T> {
  [Symbol.iterator](): Iterator<T>
}

// 启用：
[...structure]                    // 展开运算符
for (const item of structure) {}  // for...of 循环
const [a, b] = structure          // 解构
Array.from(structure)             // 数组转换
new Set(structure)                // Set 构造函数
```

---

## 性能保证

### 时间复杂度保证

| 数据结构 | 访问 | 搜索 | 插入 | 删除 | 最小值 |
|---|---|---|---|---|---|
| **Stack** | - | - | O(1) | O(1) | ✅ |
| **Queue** | - | - | O(1) | O(1) | ✅ |
| **Deque** | - | - | O(1) | O(1) | ✅ |
| **LinkedList** | O(n) | O(n) | O(1)* | O(1)* | ✅ |
| **BST** | O(log n) | O(log n) | O(log n) | O(log n) | ⚠️** |
| **RedBlackTree** | O(log n) | O(log n) | O(log n) | O(log n) | ✅ |
| **AVLTree** | O(log n) | O(log n) | O(log n) | O(log n) | ✅ |
| **Heap** | O(n) | O(n) | O(log n) | O(log n) | ✅ |
| **Trie** | N/A | O(m) | O(m) | O(m) | ✅ |
| **Graph** | - | O(V+E) | O(1) | O(V+E) | 不定 |

*有指针访问时；无指针时为 O(n)  
**平均情况；最坏情况下如果不平衡为 O(n)

### 空间复杂度

| 数据结构 | 空间 | 备注 |
|---|---|---|
| **Stack** | O(n) | 每个元素一个指针 |
| **Queue** | O(n) | 分块优化 |
| **Deque** | O(n) | 基于桶，最小开销 |
| **LinkedList** | O(n) | 额外指针（单/双） |
| **BST/RedBlackTree/AVL** | O(n) | 每个节点 2-3 个指针 |
| **Heap** | O(n) | 基于数组，紧密打包 |
| **Trie** | O(26n) | 每个字符节点 |
| **Graph** | O(V+E) | 邻接表表示 |

### 基准目标

库保持比朴素实现快 10-100 倍的性能：

- **Deque**：对于 10 万次操作，比 Array.shift() 快 484 倍
- **RedBlackTree**：对于 10 万+1000 次操作，比 Array sort 快 308 倍
- **Trie**：前缀搜索 O(m+k) vs O(n*m)

基准测试环境：MacBook Pro 2018，Intel i7，16GB RAM

---

## 模块系统支持

### CommonJS

```javascript
const { RedBlackTree, Deque } = require('data-structure-typed');
```

### ES 模块（ESM）

```javascript
import { RedBlackTree, Deque } from 'data-structure-typed';
```

### 带完整类型的 TypeScript

```typescript
import { RedBlackTree } from 'data-structure-typed';
const tree = new RedBlackTree<number, string>();
```

### UMD（浏览器全局变量）

```html
<script src="https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js"></script>
<script>
  const { Deque } = window.dataStructureTyped;
  const deque = new Deque();
</script>
```

### 独立包

```bash
npm install heap-typed deque-typed red-black-tree-typed
```

---

## 浏览器与运行时兼容性

### 最低版本

| 运行时 | 版本 | 备注 |
|---------|---------|-------|
| **Node.js** | 16+ | 活跃 LTS |
| **TypeScript** | 5.0+ | 最新稳定版 |
| **Chrome** | 90+ | 现代 ES2020 支持 |
| **Firefox** | 88+ | 现代 ES2020 支持 |
| **Safari** | 14+ | 现代 ES2020 支持 |
| **Edge** | 90+ | 现代 ES2020 支持 |

### 需要的内置全局对象

- Symbol.iterator（用于迭代协议）
- Map/Set（用于某些结构）
- WeakMap（当前未使用）

### Polyfill 要求

**现代环境无需 polyfill。**

对于 IE11 兼容性：需要手动实现（不正式支持）

### 测试平台

- ✅ Node.js 16、18、20、21
- ✅ Deno 1.40+
- ✅ Bun 1.0+
- ✅ Chrome、Firefox、Safari（最新版）
- ✅ Edge（最新版）
- ✅ 通过 CDN 的浏览器（jsDelivr、unpkg）

---

## 数据结构契约

### 栈契约

```typescript
interface Stack<T> {
  push(element: T): number
  pop(): T | undefined
  peek(): T | undefined
  size: number
}

// LIFO：后进先出
// 属性：
// - push() 和 pop() 必须是 O(1)
// - 迭代顺序：LIFO（从顶到底）
```

### 队列契约

```typescript
interface Queue<T> {
  push(element: T): number      // 入队
  shift(): T | undefined         // 出队
  peek(): T | undefined
  size: number
}

// FIFO：先进先出
// 属性：
// - push() 和 shift() 必须是 O(1)
// - 迭代顺序：FIFO（从头到尾）
```

### 树映射契约

```typescript
interface TreeMap<K, V> {
  set(key: K, value: V): this
  get(key: K): V | undefined
  has(key: K): boolean
  delete(key: K): boolean
  
  keys(): IterableIterator<K>
  values(): IterableIterator<V>
}

// 键属性：
// - 键按排序顺序迭代
// - 所有操作保证 O(log n)
// - 无重复键
// - 维护排序不变性
```

### 堆契约

```typescript
interface Heap<T> {
  push(element: T): number
  pop(): T | undefined
  peek(): T | undefined
  
  size: number
}

// 堆属性：
// - MinHeap：父节点 <= 子节点
// - MaxHeap：父节点 >= 子节点
// - push() 和 pop() O(log n)
// - peek() O(1)
// - 迭代时不排序（仅堆顺序）
```

### 图契约

```typescript
interface Graph<V, E = number> {
  addVertex(vertex: V): boolean
  addEdge(from: V, to: V, weight?: E): boolean
  hasVertex(vertex: V): boolean
  hasEdge(from: V, to: V): boolean
  
  dijkstra(start: V, end?: V): any
  topologicalSort(): V[]
}

// 图属性：
// - 有向：边是单向的
// - 无向：边是双向的
// - 加权：边有值
```

---

## 迭代器协议合规性

### 规范合规性

**所有结构实现 ES6 迭代器协议：**

```typescript
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>
}

interface Iterator<T> {
  next(): IteratorResult<T>
}

interface IteratorResult<T> {
  done: boolean
  value?: T
}
```

### 迭代顺序保证

| 结构 | 迭代顺序 | 确定性 |
|-----------|-----------------|---------------|
| **Stack** | 从顶到底（LIFO） | ✅ 是 |
| **Queue** | 从前到后（FIFO） | ✅ 是 |
| **Deque** | 从第一个到最后一个 | ✅ 是 |
| **LinkedList** | 从头到尾 | ✅ 是 |
| **BST/RBTree** | 中序遍历（排序） | ✅ 是 |
| **Heap** | 堆顺序（不排序） | ✅ 是 |
| **Trie** | 字典序 | ✅ 是 |
| **Graph** | 从起始顶点 BFS | ✅ 是 |

### 迭代期间的变更

**行为：未定义（与原生 Array 相同）**

```typescript
const tree = new RedBlackTree([1, 2, 3]);

// ❌ 不要在迭代期间变更
for (const item of tree) {
  if (item === 2) tree.delete(2);  // 不安全！
}

// ✅ 首先收集变更
const toDelete = [];
for (const item of tree) {
  if (item === 2) toDelete.push(item);
}
toDelete.forEach(item => tree.delete(item));
```

---

## 方法链式调用规范

### 可链式操作

**返回 `this` 的方法支持链式调用：**

```typescript
structure
  .filter(predicate)
  .map(mapper)
  .reduce(reducer)
```

**map 和 filter 返回相同类型以维护结构：**

```typescript
const tree = new RedBlackTree([[1, 'a'], [2, 'b']]);

const result = tree
  .filter((v, k) => k > 1)    // 仍然是 RedBlackTree
  .map((v, k) => [k, v.toUpperCase()]);  // 仍然是 RedBlackTree

// 树方法仍然可用
result.set(3, 'C');
```

### 终结操作

**打破链的操作返回最终类型：**

```typescript
structure.reduce((acc, val) => acc + val, 0)  // 返回 number
structure.toArray()                            // 返回 T[]
structure.find(pred)                           // 返回 T | undefined
structure.some(pred)                           // 返回 boolean
```

---

## 错误处理

### 错误类型

**库抛出标准 JavaScript 错误：**

| 错误类型 | 时机 | 示例 |
|---|---|---|
| **TypeError** | 类型不匹配 | 向泛型传递错误类型 |
| **RangeError** | 无效索引 | 访问越界索引 |
| **Error** | 逻辑违规 | 比较不可比较的项 |

### 错误行为

**无静默失败：**

```typescript
const tree = new RedBlackTree<number>();

// ✅ 如果比较器失败则抛出 TypeError
tree.set(null, 'value');  // TypeError: 无法比较 null

// ✅ 缺失键返回 undefined（安全）
tree.get(999);  // undefined（不是错误）

// ✅ 空操作不抛出异常
tree.pop();     // 返回 undefined（不是错误）
```

### 静默 vs 响亮

**静默（无异常）：**
- `.get()` 上缺失键
- 从空结构 pop/shift
- 删除失败（键未找到）

**响亮（抛出异常）：**
- 泛型中的类型不匹配
- 比较失败
- 无效的图操作

---

## 破坏性变更策略

### 语义化版本控制

**库遵循 SemVer 2.0：**

- **主版本**（2.0.0）：破坏性 API 变更
- **次版本**（2.1.0）：新功能，向后兼容
- **补丁**（2.0.1）：错误修复，性能改进

### 弃用策略

**提前 2 个版本宣布弃用：**

```typescript
// v1.x
method() { /* 旧实现 */ }

// v1.x -> v2.0（宣布版本）
/**
 * @deprecated 请改用 newMethod()。将在 v3.0 中删除
 */
method() { /* 旧实现 */ }

// v3.0（删除版本）
// method() 完全删除
```

### 向后兼容性保证

**在主版本内：**
- ✅ 公共 API 保证稳定
- ✅ 现有代码继续工作
- ✅ 性能可能提高
- ✅ 可能添加新方法
- ❌ 带弃用通知删除的方法

**主版本升级：**
- 可能包括破坏性变更
- 提供迁移指南
- 6 个月支持重叠期

---

## 合规性检查清单

### API 合规性

- ✅ 所有线性结构的统一方法名称
- ✅ 所有结构的类型安全泛型
- ✅ 所有结构的迭代器协议
- ✅ 所有结构的数组方法（map/filter/reduce）
- ✅ 一致的错误处理

### 性能合规性

- ✅ 所有平衡树保证 O(log n)
- ✅ Deque 操作保证 O(1)
- ✅ 堆添加/删除操作 O(log n)
- ✅ 发布和维护基准测试

### 浏览器/运行时合规性

- ✅ CommonJS + ESM + UMD 支持
- ✅ TypeScript 5.0+ 支持
- ✅ Node.js 16+ 支持
- ✅ 现代浏览器支持（ES2020）

### 文档合规性

- ✅ 完整的 API 文档
- ✅ 所有结构的实际示例
- ✅ 性能基准测试
- ✅ 框架集成指南

---

## 未来路线图

### 计划中（v2.x）

- [ ] AVL 树性能优化
- [ ] 线段树完成
- [ ] 树状数组完成
- [ ] 跳表实现
- [ ] V8 JIT 性能改进

### 考虑中（v3.0+）

- [ ] 并发数据结构
- [ ] 持久化（不可变）变体
- [ ] WebAssembly 实现以提高性能
- [ ] Java/Python 移植

### 不会实现

- ❌ 弱引用（设计决策）
- ❌ 异步迭代器（同步库）
- ❌ 浏览器存储绑定（超出范围）

---

## 相关文档

- **[SECURITY.md](./SECURITY.zh-CN.md)** - 安全考虑和最佳实践
- **[CONCEPTS.md](./CONCEPTS.md)** - 基本概念和理论
- **[REFERENCE.md](./REFERENCE.md)** - 完整 API 参考
- **[PERFORMANCE.md](./PERFORMANCE.md)** - 性能基准测试
- **[GUIDES.md](./GUIDES.md)** - 实际使用示例
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 设计决策和内部实现

---

**最后更新：** 2026年1月  
**维护者：** [@zrwusa](https://github.com/zrwusa)  
**许可证：** MIT