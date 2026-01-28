# ARCHITECTURE: 设计与实现细节

理解为什么本库的设计方式是这样的，以及它如何在内部工作。

**[返回 README](../README_CN.md) • [查看性能](./PERFORMANCE_CN.md) • [实战示例](./GUIDES_CN.md)**

---

## 目录

1. [设计理念](#设计理念)
2. [三大痛点](#三大痛点)
3. [为什么 Deque 快 484 倍](#为什么-deque-快-484-倍)
4. [Iterator 协议设计](#iterator-协议设计)
5. [自平衡策略](#自平衡策略)
6. [V8 JIT 优化](#v8-jit-优化)

---

## 设计理念

### 核心原则

1. **实用性**：遵循 ES6 标准、ESNext 模式、简单的方法名
2. **可扩展性**：所有数据结构都有 OOP 继承
3. **模块化**：独立的 NPM 包，无多余代码
4. **效率**：时间/空间复杂度与原生 JS 相当
5. **可维护性**：开源标准、TDD、CI/CD
6. **可测试性**：自动化单元 + 性能测试
7. **可重用性**：完全解耦、最小化副作用
8. **安全性**：读写分离、安全的成员访问

### API 设计：统一接口

代替学习不同库的不同 API：

```javascript
// ❌ 不同库，不同 API
const queue = new Queue();
queue.enqueue(1);           // 库 A
queue.push(1);              // 库 B
queue.offer(1);             // 库 C (Java 风格)

// ✅ data-structure-typed: 处处一致
const queue = new Queue();
const deque = new Deque();
const stack = new Stack();

// 所有都使用相同的 4 个方法
queue.push(item);           // 添加
deque.unshift(item);        // 添加到前面
stack.pop();                // 删除
queue.shift();              // 从前面删除
```

**为什么？** 因为开发者已经知道来自 Array 的 `push`、`pop`、`shift`、`unshift`。无需新的心智模型。

---

## 三大痛点

### 痛点 1: 性能墙

当操作变成瓶颈时：

```javascript
const games = [
  { id: 'game_001', name: 'Tetris', score: 9850 },
  { id: 'game_002', name: 'Minecraft', score: 9750 },
  { id: 'game_003', name: 'Grand Theft Auto V', score: 9600 },
  // ... 更多游戏
];

// ❌ 重复排序变慢了一切
const scores = [];
for (const game of games) {
  scores.push(game.score);
  scores.sort((a, b) => b - a);  // 每次都是 O(n log n)！
}
```

```javascript
// ✅ 自动维护的排序顺序
const rankings = new RedBlackTree(games, {
  toEntryFn: (game) => [game.id, game.score],
  comparator: (a, b) => b - a,
});                              // 总共只需 O(n log n)！
// 迭代总是排序的！
```

**真实影响**：

- 竞技编程：TLE → AC（超时改接受）
- 实时系统：P99 延迟 500ms → 5ms
- 消息队列：100 msg/sec → 10,000 msg/sec

### 痛点 2: API 混乱

不同的库使用完全不同的方法名：

| 操作    | ArrayList | Queue        | ArrayDeque    | LinkedList    |
|--------|-----------|--------------|---------------|---------------:|
| 添加末尾      | add()     | offer()      | push()        | add()         |
| 删除末尾   | remove()  | -            | pop()         | removeLast()  |
| 删除开头 | remove(0) | poll()       | removeFirst() | removeFirst() |
| 添加开头    | add(0, e) | offerFirst() | unshift()     | addFirst()    |

**结果**：开发者必须记住 N 个不同的 API。

**解决方案**：随处使用 4 个一致的方法：

```typescript
// 每个线性结构都使用相同的 API
const deque = new Deque();
const queue = new Queue();
const list = new DoublyLinkedList();

// 所有支持这 4 个方法：
structure.push(item);          // 添加到末尾
structure.pop();               // 从末尾删除
structure.shift();             // 从开头删除
structure.unshift(item);       // 添加到开头
```

### 痛点 3: 转换地狱

数据在结构之间跳跃浪费周期：

```typescript
// ❌ 痛苦的方式：处处转换
const tree = new TreeLibrary(data);
const filtered = tree.toArray()
  .filter(x => x > 5)           // 转换为 Array
  .map(x => x * 2)              // 仍是 Array
  .sort((a, b) => b - a);       // Array 排序是 O(n log n)

// 丢失了树的排序优势！
```

```typescript
// ✅ 干净的方式：操作直接在树上
const tree = new RedBlackTree<number, number>();
const result = tree
  .filter(v => (v ?? 0) > 5)              // 直接在树上
  .map((v, k) => [k, (v ?? 0) * 2])       // 仍在树上
  .reduce((sum, v) => sum + (v ?? 0), 0); // 仍在树上

// 零转换，树结构被维护！
```

---

## 为什么 Deque 快 484 倍

### 问题：Array.shift()

```javascript
// 当你从数组 shift 时会发生什么：
const arr = [1, 2, 3, 4, 5];
arr.shift();  // 删除 1

// JavaScript 引擎必须：
// 1. 为索引 0 创建新内存
// 2. 将元素 2 → 索引 0
// 3. 将元素 3 → 索引 1
// 4. 将元素 4 → 索引 2
// 5. 将元素 5 → 索引 3
// 6. 调整数组大小

// 对于 100,000 个元素：每次都是 O(n) = 100,000 次操作！
```

真实基准：

```javascript
const queue = [];
for (let i = 0; i < 100000; i++) queue.push(i);
for (let i = 0; i < 100000; i++) queue.shift();
// 时间：2829ms，100,000 次 shift ❌
```

### 解决方案：Deque 的分块环

```javascript
// Deque 实现策略：
// 代替物理数组，使用分块桶

//   bucket[0]      bucket[1]      bucket[2]
// [1,2,3,4,5]    [6,7,8,9,10]   [11,12,13]
//  ^                              
//  head 指针

// 当你 shift()：
// 在桶内前进指针
// 直到桶为空才删除！
// 只有那时才进行批处理操作
```

基准结果：

```javascript
const deque = new Deque();
for (let i = 0; i < 100000; i++) deque.push(i);
for (let i = 0; i < 100000; i++) deque.shift();
// 时间：5.83ms，100,000 次 shift ✅

// 2829ms / 5.83ms = 485 倍快！
```

### 这为什么有效

**批处理操作**：Deque 将操作分批放入块中，而不是在每次 shift 时重新索引。只有当整个块被消耗时才会清理它。

**内存局部性**：分块结构对 CPU 缓存比分散的重新索引操作更好。

**指针移动**：Shifting 只是在内存中前进指针，这是 CPU 寄存器操作（纳秒）。

---

**更多架构细节请查看原文件和其他文档。**
