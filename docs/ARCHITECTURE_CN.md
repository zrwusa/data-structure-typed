# ARCHITECTURE: 设计与实现细节

了解本库为何采用这种设计,以及其内部工作原理。

**[返回 README](../README_CN.md) • [查看性能](./PERFORMANCE_CN.md) • [实战示例](./GUIDES_CN.md)**

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

1. **实用性**: 遵循 ES6 标准、ESNext 模式、简洁的方法命名
2. **可扩展性**: 所有数据结构采用 OOP 继承
3. **模块化**: 独立的 NPM 包,无冗余依赖
4. **高效性**: 时间/空间复杂度与原生 JS 相当
5. **可维护性**: 开源标准、TDD、CI/CD
6. **可测试性**: 自动化单元测试 + 性能测试
7. **可复用性**: 完全解耦,最小化副作用
8. **安全性**: 读写分离,安全的成员访问

### API 设计: 统一接口

无需为每个库学习不同的 API:

```javascript
// ❌ 不同的库,不同的 API
const queue = new Queue();
queue.enqueue(1);           // 库 A
queue.push(1);              // 库 B
queue.offer(1);             // 库 C (Java 风格)

// ✅ data-structure-typed: 到处都一致
const queue = new Queue();
const deque = new Deque();
const stack = new Stack();

// 全部使用相同的 4 个方法
queue.push(item);           // 添加
deque.unshift(item);        // 添加到前端
stack.pop();                // 移除
queue.shift();              // 从前端移除
```

**为什么?** 因为开发者已经从 Array 中熟悉了 `push`、`pop`、`shift`、`unshift`。无需学习新的心智模型。

---

## 三大痛点

### 痛点 1: 性能瓶颈

当操作成为瓶颈时:

```javascript
const games = [
  { id: 'game_001', name: 'Tetris', score: 9850 },
  { id: 'game_002', name: 'Minecraft', score: 9750 },
  { id: 'game_003', name: 'Grand Theft Auto V', score: 9600 },
  { id: 'game_004', name: 'Wii Sports', score: 9500 },
  { id: 'game_005', name: 'PlayerUnknown\'s Battlegrounds', score: 9200 },
  { id: 'game_006', name: 'Fortnite', score: 9100 },
  { id: 'game_007', name: 'League of Legends', score: 8950 },
  { id: 'game_008', name: 'The Legend of Zelda: Breath of the Wild', score: 8850 },
  { id: 'game_009', name: 'Elden Ring', score: 8700 },
  { id: 'game_010', name: 'Super Mario Bros', score: 8600 },
];
// ❌ 重复排序拖慢一切
const scores = [];
for (const game of games) {
  scores.push(game.score);
  scores.sort((a, b) => b - a);  // 每次都是 O(n log n)!
}
```

```javascript
// ✅ 自动维护有序状态
const rankings = new RedBlackTree(games, {
  toEntryFn: (game) => [game.id, game.score],
  comparator: (a, b) => b - a,
});                              // 总共只需 O(n log n)!
// 迭代时始终有序!
```

**实际影响:**

- 竞赛编程: TLE → AC (超时 → 通过)
- 实时系统: P99 延迟从 500ms 降至 5ms
- 消息队列: 从 100 msg/sec 提升至 10,000 msg/sec

### 痛点 2: API 混乱

不同的库使用完全不同的方法名:

| 操作     | ArrayList | Queue        | ArrayDeque    | LinkedList    |
|----------|-----------|--------------|---------------|---------------|
| 末尾添加 | add()     | offer()      | push()        | add()         |
| 末尾移除 | remove()  | -            | pop()         | removeLast()  |
| 开头移除 | remove(0) | poll()       | removeFirst() | removeFirst() |
| 开头添加 | add(0, e) | offerFirst() | unshift()     | addFirst()    |

**结果**: 开发者必须记住 N 种不同的 API。

**解决方案**: 到处使用 4 个一致的方法:

```typescript
// 每个线性结构使用相同的 API
const deque = new Deque();
const queue = new Queue();
const list = new DoublyLinkedList();

// 全部支持这 4 个方法:
structure.push(item);          // 添加到末尾
structure.pop();               // 从末尾移除
structure.shift();             // 从开头移除
structure.unshift(item);       // 添加到开头
```

### 痛点 3: 转换地狱

在不同数据结构间转换数据浪费性能:

```typescript
// ❌ 痛苦的方式: 到处都是转换
const tree = new TreeLibrary(data);
const filtered = tree.toArray()
  .filter(x => x > 5)           // 转换为 Array
  .map(x => x * 2)              // 仍然是 Array
  .sort((a, b) => b - a);       // Array 排序是 O(n log n)

// 丢失了树的有序优势!
```

```typescript
// ✅ 简洁的方式: 直接在结构上操作
const tree = new RedBlackTree<number, number>();
const result = tree
  .filter(v => (v ?? 0) > 5)              // 直接在树上操作
  .map((v, k) => [k, (v ?? 0) * 2])       // 仍然在树上
  .reduce((sum, v) => sum + (v ?? 0), 0); // 仍然在树上

// 零转换,树结构得以保持!
```

---

## 为什么 Deque 快 484 倍

### 问题: Array.shift()

```javascript
// 当你对数组执行 shift 时发生了什么:
const arr = [1, 2, 3, 4, 5];
arr.shift();  // 移除 1

// JavaScript 引擎必须:
// 1. 为索引 0 创建新内存
// 2. 复制元素 2 → 索引 0
// 3. 复制元素 3 → 索引 1
// 4. 复制元素 4 → 索引 2
// 5. 复制元素 5 → 索引 3
// 6. 调整数组大小

// 对于 100,000 个元素: O(n) = 每次 100,000 次操作!
```

实际基准测试:

```javascript
const queue = [];
for (let i = 0; i < 100000; i++) queue.push(i);
for (let i = 0; i < 100000; i++) queue.shift();
// 时间: 100,000 次 shift 耗时 2829ms ❌
```

### 解决方案: Deque 的分块环形结构

```javascript
// Deque 实现策略:
// 不使用物理数组,而是使用分块桶

//   bucket[0]      bucket[1]      bucket[2]
// [1,2,3,4,5]    [6,7,8,9,10]   [11,12,13]
//  ^
//  head 指针

// 当你执行 shift():
// 在桶内向前移动指针
// 桶未空时无需复制!
// 只有桶空了才删除桶 (批处理操作)
```

基准测试结果:

```javascript
const deque = new Deque();
for (let i = 0; i < 100000; i++) deque.push(i);
for (let i = 0; i < 100000; i++) deque.shift();
// 时间: 100,000 次 shift 耗时 5.83ms ✅

// 2829ms / 5.83ms = 485 倍速度提升!
```

### 为什么有效

**批处理操作**: Deque 不是每次 shift 都重新索引,而是将操作批处理成块。只有当整个块被消费完才会清理。

**内存局部性**: 分块结构比分散的重新索引操作对 CPU 缓存更友好。

**指针移动**: shift 只是在内存中向前移动指针,这是 CPU 寄存器操作(纳秒级)。

---

## 迭代器协议设计

### 隐藏的超能力

每个数据结构都实现了 JavaScript 的迭代器协议:

```javascript
// 为什么这很重要:
const tree = new RedBlackTree([5, 2, 8]);

// 以下所有操作自动工作:
[...tree]                      // 展开运算符
for (const x of tree) {
}      // for...of 循环
const [a, b, c] = tree         // 解构
new Set(tree)                  // Set 构造函数
Array.from(tree)               // Array.from

// 无需特殊方法!
// 只需实现 Symbol.iterator
```

### 实现策略

```typescript
class CustomStructure<T> {
  private items: T[] = [];

  // 一个方法让一切工作
  * [Symbol.iterator]() {
    for (const item of this.items) {
      yield item;
    }
  }

  push(...item: T[]) {
    this.items.concat(item);
  }
}

// 现在这个结构到处都能用:
const struct = new CustomStructure();
struct.push(1, 2, 3);

// 以下所有操作自动工作:
[...struct];                   // [1, 2, 3]
for (const x of struct) {
}    // 循环 1, 2, 3
```

### 为什么使用迭代器协议?

1. **一致性**: 使用与 Array 和 Map 相同的接口
2. **零学习曲线**: 开发者已经知道 `for...of`
3. **互操作性**: 适用于展开、解构、Set 构造函数
4. **面向未来**: JavaScript 标准,而非库特定

---

## 自平衡策略

### 问题: 不平衡树

```javascript
// 创建一个不平衡树:
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

// 这变成了链表! O(n) 而不是 O(log n)
```

### Red-Black Tree 解决方案

**规则:**

1. 每个节点要么是红色要么是黑色
2. 根节点始终是黑色
3. 红色节点的子节点是黑色(不允许连续的红色)
4. 到 null 的所有路径具有相同数量的黑色节点

**结果**: 树高度限制在 ~2 * log(n),保证 O(log n)

```javascript
const rbTree = new RedBlackTree([1, 2, 3, 4, 5]);

//       3(B)           平衡!
//      /   \
//    2(B)  4(R)
//    /      \
//  1(R)    5(B)

// 即使顺序插入: 保证 O(log n)!
```

### AVL Tree 替代方案

**更严格的平衡要求**: 高度差 ≤ 1

```javascript
//       3
//      / \
//     2   4
//    /     \
//   1       5

// 更严格的平衡 = 更好的查找
// 权衡: 插入/删除更慢(更多重平衡)
```

### SkipList: 概率平衡

与 Red-Black Tree 或 AVL Tree 的确定性重平衡不同,**SkipList** 使用随机化:

```
Level 3: ──────────────────────────► 50
Level 2: ────────► 20 ──────────────► 50
Level 1: ──► 10 ──► 20 ──► 30 ──► 50 ──► 70
```

每个节点以 0.5 的概率(可配置)被提升到更高层级。这提供了 O(log n) 的**平均**性能 — 在实践中等同于 Red-Black Tree,但代码实现简单得多。

**何时使用 SkipList vs TreeMap:**
- 两者提供相同的 API (`NavigableMap` 语义)
- SkipList: 代码更简单,常数因子略高
- TreeMap (Red-Black Tree): 保证 O(log n) 最坏情况

---

## 区间查询结构

### SegmentTree

在由平面数组支持的完全二叉树中存储聚合值:

```
Array:      [1, 3, 5, 7]

Tree:           16         (root = sum all)
              /    \
            4       12     (sum of halves)
           / \     / \
          1   3   5   7    (leaves = original values)

Internal array: [_, 16, 4, 12, 1, 3, 5, 7]  (1-indexed)
```

查询 `[1,2]` (3+5=8): 在 O(log n) 内组合精确覆盖该区间的节点。

通过 `merger` 函数支持任何结合运算: sum、min、max、GCD、product 等。

### BinaryIndexedTree (Fenwick Tree)

一个更紧凑的结构,仅用于前缀和:

```
Array:      [1, 3, 5, 7, 9]

BIT tree (1-indexed):
  T[1] = 1         (covers [1,1])
  T[2] = 1+3 = 4   (covers [1,2])
  T[3] = 5         (covers [3,3])
  T[4] = 1+3+5+7=16 (covers [1,4])
  T[5] = 9         (covers [5,5])
```

前缀和使用位技巧 (`i -= i & -i`) 仅遍历 O(log n) 个节点。

**SegmentTree vs BinaryIndexedTree:**
| | SegmentTree | BinaryIndexedTree |
|---|---|---|
| 操作 | sum/min/max/any | 仅 sum |
| 更新 | O(log n) | O(log n) |
| 查询 | O(log n) | O(log n) |
| 空间 | O(2n) | O(n) |
| 复杂度 | 较高 | 较低 |

---

## V8 JIT 优化

### V8 如何让这变快

```javascript
// V8 JIT 优化满足以下条件的数据结构:
// 1. 具有可预测的形状(隐藏类)
// 2. 使用一致的类型
// 3. 具有稳定的方法调用

// ✅ 对 V8 JIT 友好:
class Node {
  constructor(value) {
    this.value = value;    // 始终相同类型
    this.left = null;      // 始终 null 或 Node
    this.right = null;     // 始终 null 或 Node
  }
}
```

```javascript
// ❌ 对 V8 JIT 不友好:
class BadNode {
  constructor(value) {
    this.value = value;
    this.left = value;     // 有时是 Node,有时是 number
    this.meta = null;      // 稍后动态添加
  }
}

// 我们的库正是为此使用严格类型!
```

### 性能优势

```javascript
// 可预测的结构 → V8 缓存优化
// 第一次调用: 解释执行
// 后续调用: JIT 编译为原生代码

// 结果: 预热后通常更快(基准测试应包括预热轮次)

const tree = new RedBlackTree();
for (let i = 0; i < 1000000; i++) {
  tree.set(i, Math.random());
}
// 通过 JIT 接近原生速度!
```

---

## 方法链式调用架构

### 设计模式

```typescript
class TreeStructure<K, V> {
  // 方法返回 `this` 以支持链式调用
  filter(predicate: (v: V, k: K) => boolean): this {
    // ... filter 逻辑 ...
    return this;  // 返回结构,而非 Array!
  }

  map(mapper: (v: V, k: K) => V): this {
    // ... map 逻辑 ...
    return this;  // 链式继续!
  }

  reduce<A>(reducer: (acc: A, v: V, k: K) => A, init: A): A {
    // ... reduce 逻辑 ...
    return result;  // 终止操作
  }
}

// 结果: 在任何结构上都可链式调用
tree
  .filter(x => x > 5)
  .map(x => x * 2)
  .reduce((a, v) => a + v, 0);
```

### 为什么这很重要

传统方法会丢失结构类型:

```javascript
// ❌ 丢失类型信息
const result = tree.toArray()  // 现在是 Array[]
  .filter(x => x > 5)           // 仍然是 Array
  .map(x => x * 2);             // 仍然是 Array
// 丢失了 O(log n) 特性!
```

```javascript
// ✅ 保持结构
const result = tree
  .filter(x => x > 5)           // 仍然是 RedBlackTree
  .map(x => x * 2)              // 仍然是 RedBlackTree
  .reduce((a, v) => a + v);
// 特性得以保持!
```

---

## 内存效率

### 对比

| 结构       | 开销     | 备注                |
|------------|----------|---------------------|
| Array      | 低       | 固定大小            |
| LinkedList | 高       | 每个节点一个指针    |
| BST        | 中等     | 每个节点 2 个指针   |
| Deque      | 非常低   | 分块、批处理        |
| Heap       | 非常低   | 基于数组            |

### Deque 内存策略

```javascript
// 不使用一个大数组:
// [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]

// 使用分块(桶):
// bucket[0]: [1][2][3][4][5]
// bucket[1]: [6][7][8][9][10]

// 优势:
// 1. 只分配需要的块
// 2. 重用空桶
// 3. 更好的缓存局部性
// 4. 更少的内存碎片
```

---

## 类型安全架构

### 泛型类型参数

```typescript
// 自定义对象类型
interface User {
  id: number;
  name: string;
  age: number;
}

const userTree = new RedBlackTree<number, User>();
userTree.set(1, { id: 1, name: 'Alice', age: 30 });

// 类型推断生效:
const user = userTree.get(1);   // Type: User | undefined
user?.name;                     // 类型安全访问
```

### Comparator 自定义逻辑

```typescript
type CustomObject = {
  name: string;
  priority: number;
};

// 默认比较器(升序)
const ascTree = new RedBlackTree<number>();

// 反向比较器(降序)
const descTree = new RedBlackTree<number>([], {
  comparator: (a, b) => b - a        // 反向比较
});

// 适用于任何类型
const objectTree = new RedBlackTree<CustomObject>([], {
  comparator: (a, b) => a.priority - b.priority,
});

```

---

## Order-Statistic Tree 架构

### `enableOrderStatistic` 如何工作

启用后,每个节点维护一个 `_count` 字段 — 其子树中的节点数量(包括自身)。

```
        8 (count=5)
       / \
      3   10 (count=1)
    (count=3)
     / \
    1   6 (count=1)
  (count=1)
```

### Count 维护

在每个修改路径中更新 count:

- **Insert** (`set`/`add`): `_updateCountAlongPath` 从新节点到根递增 count
- **Delete**: `_updateCountAlongPath` 从删除位置到根递减 count
- **Rotations** (AVL: `_balanceLL/LR/RR/RL`, RBT: `_leftRotate/_rightRotate`): 结构变化后 `_updateCount` 重新计算
- **Balanced rebuild** (`setMany`, `perfectlyBalance`): 在树构建期间重建 count

### Rank 操作

全部通过使用 count 向下遍历树实现 O(log n):

- **`getByRank(k)`**: 从根开始。如果左子树 count > k,向左走。如果相等,返回当前节点。否则减去并向右走。
- **`getRank(key)`**: 遍历到 key,累积左子树 count。返回树序中在 key 之前的元素数量。
- **`rangeByRank(start, end)`**: 结合 `getByRank` 找到边界,然后中序收集。

### 可选设计

Order-statistic 是**可选的** (`enableOrderStatistic: true`) 因为:
- 每次修改的额外 count 维护增加 O(log n) 开销
- 大多数用户不需要 rank 查询
- `_snapshotOptions` 通过 `clone()` 和 `map()` 保留该标志

---

## 错误处理: `raise()`

### 统一错误策略

所有错误抛出都通过 `src/common/error.ts` 中的 `raise(ErrorType, message)`:

```typescript
raise(TypeError, ERR.comparatorRequired('TreeMap'));
raise(RangeError, ERR.indexOutOfBounds(index, length));
```

### 为什么使用 `raise()` 而非直接 `throw`

1. **单一关卡点** — 所有错误通过一个函数流动,行为一致
2. **错误消息模板** — `ERR` 对象提供标准化、可复用的消息
3. **未来可扩展性** — 可以添加日志、遥测或错误转换,无需触及调用点

### 错误类别

| 错误类型 | 何时 | 示例 |
|------------|------|---------|
| `TypeError` | 无效输入类型 | NaN key、缺少 comparator、非函数回调 |
| `RangeError` | 越界 | 索引超出数组长度、无效的 rank |

---

## 总结: 设计检查清单

- ✅ 所有结构的统一 API
- ✅ 迭代器协议实现
- ✅ 方法链式调用架构
- ✅ 自平衡保证
- ✅ V8 JIT 友好代码
- ✅ 内存高效算法
- ✅ 完整 TypeScript 支持
- ✅ 带可选 `enableOrderStatistic` 的 Order-statistic tree
- ✅ 通过 `raise()` + `ERR` 模板统一错误处理

---

**下一步:** [查看 PERFORMANCE_CN.md](./PERFORMANCE_CN.md) 了解基准测试。

**或者:** [查看 GUIDES_CN.md](./GUIDES_CN.md) 了解实现示例。
