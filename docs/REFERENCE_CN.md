# REFERENCE: 完整 API 参考

数据结构库中所有数据结构的完整 API 文档。

**[返回 README](../README_CN.md) • [概念](./CONCEPTS_CN.md) • [指南](./GUIDES_CN.md)**

---

## 线性结构

### Array

基础顺序存储，具有 O(1) 访问和 O(n) 插入。

```typescript
// 创建
const arr = new Array([1, 2, 3]);

// 基本操作
arr.push(4);           // 添加到末尾 - O(1)
arr.pop();             // 移除末尾 - O(1)
arr.shift();           // 移除开头 - O(n)
arr.unshift(0);        // 添加到开头 - O(n)

// 查询
arr.at(0);             // 获取索引 - O(1)
arr.indexOf(2);        // 查找值 - O(n)

// 高阶函数
arr.map(x => x * 2);
arr.filter(x => x > 2);
arr.reduce((a, b) => a + b, 0);
```

### LinkedList

链式存储，O(n) 访问但 O(1) 插入（如果有节点引用）。

```typescript
// 创建
const list = new SinglyLinkedList([1, 2, 3]);

// 基本操作
list.push(4);          // 添加到末尾 - O(1)
list.pop();            // 移除末尾 - O(n)
list.shift();          // 移除开头 - O(1)
list.unshift(0);       // 添加到开头 - O(1)

// 查询
list.getFirst();       // 获取第一个 - O(1)
list.getLast();        // 获取最后一个 - O(n)
list.at(2);            // 获取索引 - O(n)

// DoublyLinkedList 相同，但向后遍历
const dlist = new DoublyLinkedList([1, 2, 3]);
dlist.reverse();       // 反向 - O(1)
```

### Queue (FIFO)

先进先出队列。

```typescript
// 创建
const queue = new Queue([1, 2, 3]);

// 基本操作
queue.enqueue(4);      // 添加到后面 - O(1)
queue.dequeue();       // 从前面移除 - O(1)
queue.peek();          // 查看前面 - O(1)

// 属性
queue.size;            // 项数
queue.isEmpty;         // 是否为空
```

### Stack (LIFO)

后进先出栈。

```typescript
// 创建
const stack = new Stack([1, 2, 3]);

// 基本操作
stack.push(4);         // 添加到顶部 - O(1)
stack.pop();           // 移除顶部 - O(1)
stack.peek();          // 查看顶部 - O(1)

// 属性
stack.size;            // 项数
stack.isEmpty;         // 是否为空

// 用例：撤销/重做
const undoStack = new Stack<Action>();
const redoStack = new Stack<Action>();
```

### Deque (双端队列)

双端队列，两端都有 O(1) 操作。

```typescript
// 创建
const deque = new Deque([1, 2, 3]);

// 基本操作
deque.push(4);         // 添加到后面 - O(1)
deque.unshift(0);      // 添加到前面 - O(1)
deque.pop();           // 移除末尾 - O(1)
deque.shift();         // 移除开头 - O(1)

// 查询
deque.peekFirst();     // 查看前面 - O(1)
deque.peekLast();      // 查看后面 - O(1)

// 属性
deque.size;
deque.isEmpty;
```

---

## 树结构

### Binary Search Tree (BST)

基础二叉搜索树。

```typescript
// 创建
const bst = new BST<number>();
const bst2 = new BST([5, 2, 8, 1, 3]);

// 基本操作
bst.add(5);            // 添加 - O(log n) 平衡时
bst.delete(5);         // 删除 - O(log n) 平衡时
bst.has(5);            // 包含 - O(log n)

// 查询
bst.search(5);         // 搜索 - O(log n)
bst.min();             // 最小值 - O(log n)
bst.max();             // 最大值 - O(log n)

// 遍历
bst.inOrder();         // 有序遍历
bst.preOrder();        // 前序遍历
bst.postOrder();       // 后序遍历
```

### Red-Black Tree

自平衡树，保证 O(log n)。

```typescript
// 创建
const rbTree = new RedBlackTree<number>();
const rbTree2 = new RedBlackTree([5, 2, 8]);

// 键值对
const kvTree = new RedBlackTree<number, string>();
kvTree.set(1, 'Alice');
kvTree.set(2, 'Bob');

// 基本操作
rbTree.set(5, value);     // 设置 - O(log n)
rbTree.delete(5);          // 删除 - O(log n)
rbTree.has(5);             // 检查 - O(log n)
rbTree.get(5);             // 获取值 - O(log n)

// 范围查询
rbTree.rangeSearch([2, 8]);  // 范围内的值

// 迭代
rbTree.keys();             // 所有键
rbTree.values();           // 所有值
for (const [k, v] of rbTree) {
  // 遍历所有项
}
```

### AVL Tree

严格平衡的树。

```typescript
// 创建和使用类似 RedBlackTree
const avlTree = new AVLTree<number>();

avlTree.add(5);        // 添加 - O(log n)
avlTree.delete(5);     // 删除 - O(log n)
avlTree.search(5);     // 搜索 - O(log n)

// 更严格的平衡 → 更好的搜索，更慢的修改
```

### Heap

优先级队列的完全二叉树。

```typescript
// Max Heap
const maxHeap = new MaxHeap([5, 2, 8, 1]);

// 基本操作
maxHeap.add(9);        // 添加 - O(log n)
maxHeap.poll();        // 移除最大 - O(log n)
maxHeap.peek();        // 查看最大 - O(1)

// Min Heap
const minHeap = new MinHeap([5, 2, 8, 1]);
minHeap.poll();        // 移除最小

// Priority Queue
const pq = new PriorityQueue<Task>([], {
  comparator: (a, b) => a.priority - b.priority
});

pq.add(task);          // 添加 - O(log n)
const highest = pq.poll(); // 获取最高优先级 - O(log n)
```

### Trie

前缀树，用于前缀搜索。

```typescript
// 创建
const trie = new Trie();

// 基本操作
trie.insert('apple');  // 插入 - O(m)，m 是字符串长度
trie.search('app');    // 精确搜索 - O(m)
trie.startsWith('ap'); // 前缀搜索 - O(m)

// 自动完成
const suggestions = trie.getWordsWithPrefix('ap');
// 返回：['apple', 'application', ...]
```

---

## 图结构

### Graph

顶点和边的网络。

```typescript
// 创建
const graph = new Graph();

// 顶点操作
graph.addVertex('A');
graph.removeVertex('A');
graph.hasVertex('A');

// 边操作
graph.addEdge('A', 'B', { weight: 5 });
graph.removeEdge('A', 'B');
graph.getEdge('A', 'B');

// 查询
graph.getVertices();   // 所有顶点
graph.getEdges();      // 所有边
graph.getNeighbors('A'); // A 的邻接点

// 遍历
graph.dfs('A');        // 深度优先搜索
graph.bfs('A');        // 广度优先搜索

// 路径
graph.shortestPath('A', 'B'); // 最短路径
graph.hasCycle();      // 检测循环
```

---

## 常见模式

### Iterator 模式

```typescript
const tree = new RedBlackTree([5, 2, 8]);

// 扩展运算符
const arr = [...tree.keys()];

// Set 构造器
const set = new Set(tree.keys());

// for...of 循环
for (const val of tree.values()) {
  console.log(val);
}

// 解构
const [first, ...rest] = tree.keys();
```

### 过滤模式

```typescript
const tree = new RedBlackTree([
  [1, { active: true }],
  [2, { active: false }],
  [3, { active: true }]
]);

// 过滤活跃项
const active = tree
  .filter((val) => val?.active ?? false)
  .map((val, key) => [key, !val]);

console.log(...active);
```

### 排序模式

```typescript
const data = [64, 34, 25, 12, 22, 11, 90];
// 即时排序
const sorted = [...new RedBlackTree(data).keys()];
// [11, 12, 22, 25, 34, 64, 90]
```

---

## 类型定义

### 泛型类型

```typescript
// 单个类型参数
interface Container<T> {
  add(item: T): void;
  remove(item: T): void;
  get(): T | null;
}

// 两个类型参数（键值）
interface KeyValueStore<K, V> {
  set(key: K, value: V): void;
  get(key: K): V | null;
  delete(key: K): void;
}

// 实现
const stringSet = new RedBlackTree<string>();
const userMap = new RedBlackTree<number, User>();
```

### 比较器类型

```typescript
type Comparator<T> = (a: T, b: T) => number;

// 升序比较器
const ascending: Comparator<number> = (a, b) => a - b;

// 降序比较器
const descending: Comparator<number> = (a, b) => b - a;

// 对象比较器
interface Task {
  id: string;
  priority: number;
  action: Promise<void>;
}

const pq = new MaxPriorityQueue<Task>(
  {
    comparator: (a, b) => a.priority - b.priority
  }
);

pq.add({
  id: '1',
  priority: 5,
  action: async () => {
    // 做某事
  }
});

// 类型检查捕获错误
const task = pq.poll();
if (task) {
  // task 保证是 Task
  await task.action;
}
```

---

## 复杂度图表

| 操作 | Array | LinkedList | BST      | RBTree   | Heap     | Trie |
|-----------|-------|------------|----------|----------|----------|------|
| 访问    | O(1)  | O(n)       | O(log n) | O(log n) | O(n)     | N/A  |
| 搜索    | O(n)  | O(n)       | O(log n) | O(log n) | O(n)     | O(m) |
| 插入    | O(n)  | O(1)       | O(log n) | O(log n) | O(log n) | O(m) |
| 删除    | O(n)  | O(1)       | O(log n) | O(log n) | O(log n) | O(m) |

*m = 字符串长度（对于 Trie）

---

**需要实现例子？** 查看 [GUIDES_CN.md](./GUIDES_CN.md) 了解代码示例。

**想了解性能？** 查看 [PERFORMANCE_CN.md](./PERFORMANCE_CN.md) 了解基准测试。