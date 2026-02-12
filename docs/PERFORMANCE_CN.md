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

| 结构           | 访问       | 搜索       | 插入       | 删除       |        最适合 |
|--------------|----------|----------|----------|----------|-----------:|
| Array        | O(1)     | O(n)     | O(n)     | O(n)     |       随机访问 |
| LinkedList   | O(n)     | O(n)     | O(1)*    | O(1)*    |      如果有指针 |
| Stack        | -        | -        | O(1)     | O(1)     | LIFO、撤销/重做 |
| Queue        | -        | -        | O(1)     | O(1)     |  FIFO、消息队列 |
| Deque        | -        | -        | O(1)     | O(1)     |       头尾操作 |
| BST          | O(log n) | O(log n) | O(log n) | O(log n) |      平衡时排序 |
| RedBlackTree | O(log n) | O(log n) | O(log n) | O(log n) |       保证排序 |
| AVL Tree     | O(log n) | O(log n) | O(log n) | O(log n) |     最大搜索速度 |
| Heap         | O(n)     | O(n)     | O(log n) | O(log n) |      优先级队列 |
| Trie         | N/A      | O(m)     | O(m)     | O(m)     |       前缀搜索 |

---

## 真实场景

### 场景 1: 100K 元素的消息队列

| 方法                   | 时间           | 备注             |
|----------------------|--------------|----------------|
| Array.shift() 100K 次 | **2829ms** ❌ | O(n²) - 每次重新索引 |
| Deque.shift() 100K 次 | **5.83ms** ✅ | O(n) - 批处理操作   |
| **加速**               | **485 倍快**   | 关键差异           |

### 场景 2: 1000 次排行榜更新

| 方法              | 时间           | 备注                |
|-----------------|--------------|-------------------|
| Array.sort() 每次 | **2500ms** ❌ | 1000 * O(n log n) |
| RedBlackTree    | **8ms** ✅    | 1000 * O(log n)   |
| **加速**          | **312 倍快**   | 实时排行榜             |

### 场景 3: 10K 任务优先级处理

| 方法               | 时间           | 备注          |
|------------------|--------------|-------------|
| 手动优先级            | **3200ms** ❌ | O(n² log n) |
| MaxPriorityQueue | **45ms** ✅   | O(n log n)  |
| **加速**           | **71 倍快**    | 任务调度        |

---

## 详细基准测试

[//]: # (No deletion!!! Start of Replace Section)

### DoublyLinkedList

| Test Case            | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|----------------------|----------|----------|----------|-----------|--------------|
| 100k push            | 6.3575   | 4.7555   | 23.7759  | ±8.49%    | 5.46         |
| 100k unshift         | 6.7701   | 4.6905   | 37.7197  | ±15.43%   | 5.56         |
| 100k unshift & shift | 4.0098   | 3.8547   | 5.073    | ±0.77%    | 5.39         |
| 100k addBefore       | 1877.45  | 1858.74  | 1897.04  | ±0.87%    | 0.47         |

### SinglyLinkedList

| Test Case         | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|-------------------|----------|----------|----------|-----------|--------------|
| 100k push & shift | 3.6008   | 3.5134   | 3.8356   | ±0.32%    | 4.89         |
| 10K push & pop    | 114.5    | 108.15   | 167.94   | ±4.64%    | 0.5          |
| 10K addBefore     | 32.1     | 30.06    | 37.04    | ±1.06%    | 0.04         |

### HashMap

| Test Case                         | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|-----------------------------------|----------|----------|----------|-----------|--------------|
| 1M set                            | 82.56    | 43.94    | 321.05   | ±32.6%    | 73.76        |
| Native JS Map 1M set              | 148.61   | 118.19   | 176.66   | ±5.18%    | 167.27       |
| Native JS Set 1M add              | 123.94   | 98.55    | 311.75   | ±14.2%    | 71.49        |
| 1M set & get                      | 50.78    | 38.72    | 139.27   | ±11.52%   | 75.86        |
| Native JS Map 1M set & get        | 213.61   | 196.09   | 272.98   | ±5.83%    | 221.7        |
| Native JS Set 1M add & has        | 172.29   | 157.86   | 226.92   | ±5.44%    | 75.11        |
| 1M ObjKey set & get               | 242.67   | 221.18   | 307.08   | ±6.47%    | 77.94        |
| Native JS Map 1M ObjKey set & get | 207.18   | 192.94   | 277.13   | ±5.11%    | 216.96       |
| Native JS Set 1M ObjKey add & has | 191.08   | 173.17   | 261.54   | ±6.58%    | 77.81        |

### priority-queue

| Test Case       | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|-----------------|----------|----------|----------|-----------|--------------|
| 100K add        | 3.965    | 3.7785   | 4.3649   | ±0.7%     | 1.04         |
| 100K add & poll | 22.08    | 21.65    | 23.06    | ±0.34%    | 4.48         |

### Queue

| Test Case                         | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|-----------------------------------|----------|----------|----------|-----------|--------------|
| 1M push                           | 27.79    | 25.13    | 70.99    | ±5.69%    | 1.66         |
| 100K push & shift                 | 3.0897   | 2.6681   | 11.659   | ±6.96%    | 0.2          |
| Native JS Array 100K push & shift | 1061.9   | 953.11   | 1137.26  | ±5.36%    | 0.2          |

### Deque

| Test Case                            | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|--------------------------------------|----------|----------|----------|-----------|--------------|
| 1M push                              | 10.33    | 6.4      | 31.12    | ±10.21%   | 1.79         |
| 1M push & pop                        | 11.88    | 9.98     | 21.58    | ±4.97%    | 2.27         |
| 1M push & shift                      | 19.09    | 14.3     | 31.06    | ±3.92%    | 1.98         |
| 100K push & shift                    | 1.2163   | 1.1556   | 1.7065   | ±1.39%    | 0.2          |
| Native JS Array 100K push & shift    | 1145.83  | 942.03   | 1584.6   | ±22.3%    | 358.86       |
| 100K unshift & shift                 | 1.2694   | 1.1964   | 1.6306   | ±1.16%    | 0.2          |
| Native JS Array 100K unshift & shift | 2113.11  | 1898.32  | 2338.87  | ±7.55%    | 714.56       |

### Stack

| Test Case     | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|---------------|----------|----------|----------|-----------|--------------|
| 1M push       | 27.54    | 24.58    | 52.09    | ±6.12%    | 1.67         |
| 1M push & pop | 29.15    | 27.22    | 55.31    | ±4.33%    | 2.61         |

### RedBlackTree

| Test Case               | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|-------------------------|----------|----------|----------|-----------|--------------|
| 1M get                  | 82.1     | 63.85    | 95.93    | ±22.42%   | 42.57        |
| 1M get (Node Mode)      | 254.23   | 251.54   | 255.48   | ±0.78%    | 47.12        |
| 1M get (js-sdsl)        | 139.5    | 134.26   | 142.65   | ±2.94%    | -            |
| 200K rangeSearch SEQ    | 1253.09  | 1162.63  | 1312.24  | ±6.21%    | -            |
| 200K rangeSearch RAND   | 1934.09  | 1905.23  | 1987.67  | ±2.03%    | -            |
| 1M upd SEQ              | 79.47    | 73.18    | 92.62    | ±12.53%   | 69.08        |
| 1M upd SEQ (Node Mode)  | 223.62   | 215.45   | 241.23   | ±5.64%    | 56.13        |
| 1M upd SEQ (js-sdsl)    | 171.5    | 109.22   | 191.01   | ±25.26%   | -            |
| 1M upd RAND             | 84.46    | 82.87    | 86.86    | ±2.20%    | 166.5        |
| 1M upd RAND (Node Mode) | 389.86   | 380.9    | 395.4    | ±1.87%    | 165.69       |
| 1M upd RAND (js-sdsl)   | 326.37   | 317.4    | 347.64   | ±4.61%    | -            |
| 1M ins SEQ              | 531.29   | 438.83   | 886.69   | ±46.43%   | 165.06       |
| 1M ins SEQ (Node Mode)  | 192.38   | 185.53   | 198.22   | ±3.07%    | 215.53       |
| 1M ins SEQ (js-sdsl)    | 89.1     | 88.26    | 89.84    | ±0.86%    | -            |
| 1M ins RAND             | 1495.64  | 1484.62  | 1513.47  | ±1.04%    | 515.97       |
| 1M ins RAND (Node Mode) | 1157.01  | 1137     | 1204.25  | ±2.89%    | 428.99       |
| 1M ins RAND (js-sdsl)   | 878.02   | 841.74   | 914.54   | ±4.21%    | -            |
| 1M keys-only            | 3.6031   | 2.1752   | 4.7237   | ±38.73%   | 0.1          |

### AVLTree

| Test Case                         | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|-----------------------------------|----------|----------|----------|-----------|--------------|
| 100K add randomly                 | 140.68   | 132.77   | 184.45   | ±3.33%    | 17.4         |
| 100K add                          | 105.35   | 103.03   | 117.77   | ±1.05%    | 15.6         |
| 100K get                          | 0.6009   | 0.5943   | 0.7578   | ±0.76%    | 7.55         |
| 100K getNode                      | 36.75    | 35.6     | 41.27    | ±0.68%    | 8.92         |
| 100K iterator                     | 7.7432   | 7.1503   | 9.5011   | ±1.41%    | 1.1          |
| 100K add & delete orderly         | 156.94   | 155.04   | 169.74   | ±0.98%    | 21.21        |
| 100K add & delete randomly        | 209.78   | 201.03   | 229.58   | ±1.99%    | 28.83        |
| AVL Tree 100K rangeSearch queries | 1461.7   | 1435.32  | 1514.49  | ±1.95%    | 117.74       |

### BST

| Test Case                 | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|---------------------------|----------|----------|----------|-----------|--------------|
| 10K add randomly          | 5.0373   | 4.5875   | 8.6004   | ±2.07%    | -            |
| 10K add & delete randomly | 10.71    | 10.29    | 11.16    | ±0.35%    | -            |
| 10K addMany               | 12.2     | 11.49    | 16.21    | ±1.41%    | -            |
| 10K get                   | 12.67    | 11.87    | 16.81    | ±1.31%    | -            |

### Trie

| Test Case     | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|---------------|----------|----------|----------|-----------|--------------|
| 100K add      | 32.36    | 29.9     | 51.61    | ±2.8%     | -            |
| 100K getWords | 169.36   | 158.9    | 193.74   | ±2.35%    | -            |

### DirectedGraph

| Test Case       | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|-----------------|----------|----------|----------|-----------|--------------|
| 1K addVertex    | 0.0693   | 0.0671   | 0.0718   | ±0.41%    | -            |
| 1K addEdge      | 4.5665   | 4.313    | 6.2701   | ±1.42%    | -            |
| 1K getVertex    | 0.0612   | 0.0601   | 0.0694   | ±0.41%    | -            |
| 1K getEdge      | 27.74    | 26.13    | 66.12    | ±4.39%    | -            |
| tarjan          | 191.69   | 180.88   | 208.02   | ±2.19%    | -            |
| topologicalSort | 142.71   | 137.24   | 161.58   | ±2.24%    | -            |

### BinaryTree

| Test Case                | Avg (ms) | Min (ms) | Max (ms) | Stability | C++ Avg (ms) |
|--------------------------|----------|----------|----------|-----------|--------------|
| 1K add randomly          | 19.12    | 18.92    | 19.68    | ±0.19%    | -            |
| 1K add & delete randomly | 27.74    | 27.46    | 28.39    | ±0.17%    | -            |
| 1K addMany               | 19.13    | 18.92    | 19.44    | ±0.16%    | -            |
| 1K get                   | 19.17    | 18.95    | 20.02    | ±0.24%    | -            |
| 1K has                   | 33.25    | 32.65    | 48.51    | ±1.74%    | -            |
| 1K dfs                   | 186.37   | 185.57   | 188.69   | ±0.18%    | -            |
| 1K bfs                   | 76.5     | 75.36    | 84.24    | ±0.66%    | -            |
| 1K morris                | 79.95    | 77.75    | 82.63    | ±0.6%     | -            |

[//]: # (No deletion!!! End of Replace Section)

---

## 何时使用什么

### 快速决策表

| 需求      | 推荐使用            | 复杂度            |
|---------|-----------------|----------------|
| 随机访问索引  | Array           | O(1) 访问        |
| 频繁头尾操作  | Deque           | O(1) 两端        |
| FIFO 队列 | Queue           | O(1) 两端        |
| LIFO 栈  | Stack           | O(1) 推入/弹出     |
| 排序集合    | RedBlackTree    | O(log n) 保证    |
| 优先级队列   | MaxHeap/MinHeap | O(log n) 添加/删除 |
| 前缀搜索    | Trie            | O(m) m=字符串长度   |
| 图论问题    | Graph           | 取决于实现          |

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
