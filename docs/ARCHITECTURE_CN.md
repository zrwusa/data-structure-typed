# 架构：设计和实现细节

理解该库为什么这样设计，以及它内部如何工作。

**[回到 README](../README_CN.md) • [查看性能](./PERFORMANCE_CN.md) • [实战示例](./GUIDES_CN.md)**

---

## 目录

1. [设计理念](#设计理念)
2. [三大痛点](#三大痛点)
3. [为什么 Deque 快 484 倍](#为什么-deque-快-484-倍)
4. [迭代器协议设计](#迭代器协议设计)
5. [自平衡策略](#自平衡策略)
6. [V8 JIT 优化](#v8-jit-优化)

---

## 设计理念

### 核心原则

1. **实用性**：遵循 ES6 标准、ESNext 模式、简单方法名
2. **可扩展性**：所有数据结构的 OOP 继承
3. **模块化**：独立 NPM 包，无冗余
4. **效率**：时间/空间复杂度与原生 JS 相当
5. **可维护性**：开源标准、TDD、CI/CD
6. **可测试性**：自动化单元 + 性能测试
7. **可重用性**：完全解耦、最小化副作用
8. **安全性**：读写分离、安全成员访问

### API 设计：统一接口

与其学习不同库的不同 API：

```javascript
// ❌ 不同库，不同 API
const queue = new Queue();
queue.enqueue(1);           // 库 A
queue.push(1);              // 库 B
queue.offer(1);             // 库 C（Java 风格）

// ✅ data-structure-typed：处处一致
const queue = new Queue();
const deque = new Deque();
const stack = new Stack();

// 所有都使用相同的 4 个方法
queue.push(item);           // 添加
deque.unshift(item);        // 添加到前面
stack.pop();                // 移除
queue.shift();              // 从前面移除
```

**为什么？** 因为开发者已经从 Array 知道 `push`、`pop`、`shift`、`unshift`。零新心理模型。

---

## 三大痛点

### 痛点 1：性能瓶颈

当操作成为性能瓶颈时：

```javascript
// ❌ 重复排序拖累一切
const scores = [];
for (const game of games) {
  scores.push(game.score);
  scores.sort((a, b) => b - a);  // 每次 O(n log n)！
}

// ✅ 自动维护排序顺序
const rankings = new RedBlackTree();
for (const game of games) {
  rankings.set(game.id, game.score);  // O(log n)
}
// 迭代总是排序的！
```

**真实影响：**
- 竞技编程：TLE → AC（超时到通过）
- 实时系统：P99 延迟 500ms → 5ms
- 消息队列：100 条消息/秒 → 10,000 条消息/秒

### 痛点 2：API 混乱

不同库使用完全不同的方法名：

| 操作 | ArrayList | Queue | ArrayDeque | LinkedList |
|------|-----------|-------|-----------|-----------|
| 添加末尾 | add() | offer() | push() | add() |
| 移除末尾 | remove() | - | pop() | removeLast() |
| 移除开头 | remove(0) | poll() | removeFirst() | removeFirst() |
| 添加开头 | add(0, e) | offerFirst() | unshift() | addFirst() |

**结果**：开发者必须记住 N 种不同的 API。

**解决方案**：处处使用 4 个一致的方法：

```typescript
// 每个线性结构使用相同的 API
const deque = new Deque();
const queue = new Queue();
const stack = new Stack();
const list = new DoublyLinkedList();

// 所有都支持这 4 个方法：
structure.push(item);          // 添加到末尾
structure.pop();               // 从末尾移除
structure.shift();             // 从开头移除
structure.unshift(item);       // 添加到开头
```

### 痛点 3：转换地狱

在结构间弹来弹去浪费周期：

```javascript
// ❌ 痛苦方式：到处转换
const tree = new TreeLibrary(data);
const filtered = tree.toArray()
  .filter(x => x > 5)           // 转换为 Array
  .map(x => x * 2)              // 还是 Array
  .sort((a, b) => b - a);       // Array 排序是 O(n log n)

// 失去了树的排序优势！

// ✅ 干净方式：操作直接在结构上
const tree = new RedBlackTree(data);
const result = tree
  .filter(x => x > 5)           // 直接在树上
  .map(x => x * 2)              // 仍在树上
  .reduce((sum, v) => sum + v); // 仍在树上

// 零转换，树结构保持！
```

---

## 为什么 Deque 快 484 倍

### 问题：Array.shift()

```javascript
// 从数组 shift 时发生什么：
const arr = [1, 2, 3, 4, 5];
arr.shift();  // 移除 1

// JavaScript 引擎必须：
// 1. 为索引 0 创建新内存
// 2. 复制元素 2 → 索引 0
// 3. 复制元素 3 → 索引 1
// 4. 复制元素 4 → 索引 2
// 5. 复制元素 5 → 索引 3
// 6. 调整数组大小

// 100,000 元素：O(n) = 每次 100,000 个操作！
```

真实基准：

```javascript
const queue = [];
for (let i = 0; i < 100000; i++) queue.push(i);
for (let i = 0; i < 100000; i++) queue.shift();
// 耗时：2829ms 对于 100,000 次 shift ❌
```

### 解决方案：Deque 的分块环

```javascript
// Deque 实现策略：
// 不是物理数组，而使用分块桶

//   bucket[0]      bucket[1]      bucket[2]
// [1,2,3,4,5]    [6,7,8,9,10]   [11,12,13]
//  ^                              
//  头指针

// 当你 shift()：
// 在桶内向前移动指针
// 桶空了才删除！
// 只有那时才进行批量操作
```

基准结果：

```javascript
const deque = new Deque();
for (let i = 0; i < 100000; i++) deque.push(i);
for (let i = 0; i < 100000; i++) deque.shift();
// 耗时：5.83ms 对于 100,000 次 shift ✅

// 2829ms / 5.83ms = 485 倍快！
```

### 为什么这样有效

**批处理操作**：与其在每次 shift 时重新索引，Deque 批处理成块操作。只有当整个块被消耗时才被清理。

**内存局部性**：分块结构对 CPU 缓存比分散的重新索引操作更友好。

**指针移动**：Shift 只是在内存中向前移动指针，这是 CPU 寄存器操作（纳秒）。

---

## 迭代器协议设计

### 隐藏的超能力

每个数据结构都实现了 JavaScript 的迭代器协议：

```javascript
// 为什么这很重要：
const tree = new RedBlackTree([5, 2, 8]);

// 所有这些自动工作：
[...tree]                      // 展开操作符
for (const x of tree) { }      // for...of 循环
const [a, b, c] = tree         // 解构
new Set(tree)                  // Set 构造器
Array.from(tree)               // Array.from

// 无需特殊方法！
// 只需实现 Symbol.iterator
```

### 实现策略

```typescript
class CustomStructure<T> {
  private items: T[] = [];

  // 一个方法使所有工作
  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item;
    }
  }
}

// 现在结构到处工作：
const struct = new CustomStructure();
struct.push(1, 2, 3);

// 所有这些自动工作：
[...struct];                   // [1, 2, 3]
for (const x of struct) { }    // 循环 1, 2, 3
```

### 为什么是迭代器协议？

1. **一致性**：使用与 Array 和 Map 相同的接口
2. **零学习曲线**：开发者已经知道 `for...of`
3. **互操作性**：适用于展开、解构、Set 构造器
4. **面向未来**：JavaScript 标准，非库特定

---

## 自平衡策略

### 问题：不平衡树

```javascript
// 创建不平衡树：
const bst = new BST();
[1, 2, 3, 4, 5].forEach(x => bst.add(x));

//  1
//   \
//    2
//     \
//      3
//       \
//        4
//         \
//          5

// 这变成链表！O(n) 而非 O(log n)
```

### 红黑树解决方案

红黑树通过颜色编码规则自动自己重新平衡：

```javascript
// 红黑树属性：
// 1. 节点要么红要么黑
// 2. 根节点黑
// 3. 叶子（nil）都黑
// 4. 红节点孩子都黑
// 5. 根到任何叶子的黑节点数相同

// 结果：保证高度 ≤ 2 * log(n+1)
// 保证 O(log n) 所有操作
```

---

## V8 JIT 优化

该库针对现代 JavaScript 引擎优化：

1. **隐藏类**：一致的对象形状以优化查找
2. **内联缓存**：频繁访问的路径预编译
3. **类型稳定性**：避免类型切换以保持 JIT 优化

结果：10-40% 性能提升在热路径上，对 Node.js 18+ 和现代浏览器。

---

总结：这个库通过统一 API、解决性能痛点和充分利用现代 JavaScript 能力，为开发者提供了最佳的数据结构体验。
