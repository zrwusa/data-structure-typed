# PERFORMANCE: 基准测试与对比

理解 data-structure-typed 的性能，以及何时使用每个结构。

**[返回 README](../README_CN.md) • [架构细节](./ARCHITECTURE_CN.md) • [代码示例](./GUIDES_CN.md)**

---

## 目录

1. [性能摘要](#性能摘要)
2. [真实场景](#真实场景)
3. [详细基准测试](#详细基准测试)
4. [何时使用什么](#何时使用什么)
5. [优化建议](#优化建议)

---

## 性能摘要

### 关键数据

- **快 484 倍** 比 Array.shift()，100K 元素（Deque vs Array）
- **快 1040 倍** 大规模排序繁重工作（RedBlackTree vs Array）
- **O(log n) 保证** 所有平衡树操作
- **O(1) 保证** Deque 头尾操作
- **快 10-100 倍** V8 JIT 预热后

### 性能层级图表

| 结构    | 访问   | 搜索   | 插入   | 删除   | 最适合             |
|--------|--------|--------|--------|--------|------------------:|
| Array        | O(1)     | O(n)     | O(n)     | O(n)     | 随机访问        |
| LinkedList   | O(n)     | O(n)     | O(1)*    | O(1)*    | 如果有指针  |
| Stack        | -        | -        | O(1)     | O(1)     | LIFO、撤销/重做      |
| Queue        | -        | -        | O(1)     | O(1)     | FIFO、消息队列 |
| Deque        | -        | -        | O(1)     | O(1)     | 头尾操作        |
| BST          | O(log n) | O(log n) | O(log n) | O(log n) | 平衡时排序   |
| RedBlackTree | O(log n) | O(log n) | O(log n) | O(log n) | 保证排序    |
| AVL Tree     | O(log n) | O(log n) | O(log n) | O(log n) | 最大搜索速度     |
| Heap         | O(n)     | O(n)     | O(log n) | O(log n) | 优先级队列       |
| Trie         | N/A      | O(m)     | O(m)     | O(m)     | 前缀搜索        |

---

## 真实场景

### 场景 1: 100K 元素的消息队列

| 方法 | 时间 | 备注 |
|------|------|------|
| Array.shift() 100K 次 | **2829ms** ❌ | O(n²) - 每次重新索引 |
| Deque.shift() 100K 次 | **5.83ms** ✅ | O(n) - 批处理操作 |
| **加速** | **485 倍快** | 关键差异 |

### 场景 2: 1000 次排行榜更新

| 方法 | 时间 | 备注 |
|------|------|------|
| Array.sort() 每次 | **2500ms** ❌ | 1000 * O(n log n) |
| RedBlackTree | **8ms** ✅ | 1000 * O(log n) |
| **加速** | **312 倍快** | 实时排行榜 |

### 场景 3: 10K 任务优先级处理

| 方法 | 时间 | 备注 |
|------|------|------|
| 手动优先级 | **3200ms** ❌ | O(n² log n) |
| MaxPriorityQueue | **45ms** ✅ | O(n log n) |
| **加速** | **71 倍快** | 任务调度 |

---

## 详细基准测试

### RedBlackTree

| 测试用例     | 平均 (ms) | 最小 (ms) | 最大 (ms) | 稳定性 |
|-------------|----------|---------|----------|--------|
| 1,000,000 set | 867.55   | 790.66   | 1193.22  | ±15.37% |
| 1,000,000 get | 88.65    | 86.8     | 91.48    | ±0.44%  |

### Deque

| 测试用例                            | 平均 (ms) | 最小 (ms) | 最大 (ms) | 稳定性 |
|-----------------------------------|----------|---------|----------|--------|
| 1M push                            | 13.29    | 6.8     | 37.04    | ±10.88% |
| 1M push & pop                      | 13.29    | 10.32   | 42.8     | ±8.41%  |
| 1M push & shift                    | 13.1     | 10.59   | 35       | ±6.13%  |
| 100K push & shift                  | 1.42     | 1.36    | 2.37     | ±2.04%  |
| 原生 JS Array 100K push & shift    | 1569.8   | 1387.13 | 1780.44  | ±9.3%   |
| 100K unshift & shift               | 1.22     | 1.16    | 1.66     | ±1.6%   |
| 原生 JS Array 100K unshift & shift | 2503.14  | 2456.1  | 2547.76  | ±2.15%  |

### Queue

| 测试用例                            | 平均 (ms) | 最小 (ms) | 最大 (ms) | 稳定性 |
|-----------------------------------|----------|---------|----------|--------|
| 1,000,000 push                    | 33.4     | 26.33   | 145.41   | ±13.78% |
| 100,000 push & shift              | 3.32     | 2.8     | 15.5     | ±8.8%   |
| 原生 JS Array 100K push & shift    | 1590.01  | 1447.58 | 1794.71  | ±7.89%  |

### Heap

| 测试用例       | 平均 (ms) | 最小 (ms) | 最大 (ms) | 稳定性 |
|-------------|----------|---------|----------|--------|
| 100K add        | 4.22     | 3.95    | 6.3      | ±1.44%  |
| 100K add & poll | 19.01    | 18.2    | 27.53    | ±1.54%  |

### Stack

| 测试用例     | 平均 (ms) | 最小 (ms) | 最大 (ms) | 稳定性 |
|----------|----------|---------|----------|--------|
| 1M push | 29.34    | 25.63   | 86.31    | ±6.65%  |
| 1M push & pop | 30.5     | 28.66   | 34.27    | ±0.99%  |

---

## 何时使用什么

### 快速决策表

| 需求 | 推荐使用 | 复杂度 |
|------|--------|--------|
| 随机访问索引 | Array | O(1) 访问 |
| 频繁头尾操作 | Deque | O(1) 两端 |
| FIFO 队列 | Queue | O(1) 两端 |
| LIFO 栈 | Stack | O(1) 推入/弹出 |
| 排序集合 | RedBlackTree | O(log n) 保证 |
| 优先级队列 | MaxHeap/MinHeap | O(log n) 添加/删除 |
| 前缀搜索 | Trie | O(m) m=字符串长度 |
| 图论问题 | Graph | 取决于实现 |

---

## 优化建议

### 建议 1: 选择正确的数据结构

```typescript
// ❌ 不好：为每个用例使用 Array
const sorted = array.sort();          // O(n log n) 每次
const found = array.find(x => x > 5); // O(n) 每次

// ✅ 好：为每个用例使用适当的结构
const tree = new RedBlackTree(array);
const found = tree.rangeSearch([5, Infinity]); // O(log n + k)
```

### 建议 2: 批量操作

```typescript
// ❌ 不好：单独操作
for (const item of items) {
  tree.set(item.id, item);  // 1000 * O(log n)
}

// ✅ 好：批量初始化
const tree = new RedBlackTree(items);  // O(n) 初始化
```

### 建议 3: 缓存范围查询

```typescript
// ❌ 不好：每次都查询
function getExpensive() {
  return tree.rangeSearch([0, 100], x => x.price);
}

// ✅ 好：缓存结果
class CachedQuery {
  private cache: null | any[] = null;
  private lastUpdate = 0;

  getExpensive() {
    const now = Date.now();
    if (!this.cache || now - this.lastUpdate > 5000) {
      this.cache = tree.rangeSearch([0, 100], x => x.price);
      this.lastUpdate = now;
    }
    return this.cache;
  }

  invalidate() {
    this.cache = null;
  }
}
```

### 建议 4: 避免不必要的转换

```typescript
// ❌ 不好：转换回数组
const result = tree.toArray()
  .filter(x => x > 5)
  .map(x => x * 2);

// ✅ 好：保持在树上
const result = tree
  .filter(x => x > 5)
  .map(x => x * 2);
```

---

## 性能调优清单

- ✅ 重复排序使用 RedBlackTree
- ✅ 队列使用 Deque（而不是 Array.shift）
- ✅ 前 K 个使用 Heap
- ✅ 前缀搜索使用 Trie
- ✅ 避免热路径中的 O(n) 操作
- ✅ 批量初始化结构
- ✅ 缓存范围查询结果
- ✅ 保持在树上而不是转换为数组

---

**需要实现指导？** 查看 [GUIDES_CN.md](./GUIDES_CN.md) 了解代码示例。

**想了解架构？** 查看 [ARCHITECTURE_CN.md](./ARCHITECTURE_CN.md) 了解设计决策。
