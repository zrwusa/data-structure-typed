# RFC: Plain Object Node Pattern for Binary Trees

## 概述

将 LinkedList 验证成功的 **Sentinel + Plain Object Node** 模式移植到所有二叉树数据结构。

## 背景

### LinkedList 优化成果

| 结构 | 模式 | vs js-sdsl |
|------|------|-----------|
| DLL | Class Node | 2-3x 慢 |
| DLL | Sentinel + Plain Object | 基本持平 |

### 原理

1. **Plain Object** `{value, left, right}` 比 `new Node()` 快 ~10x
2. **Sentinel (NIL)** 消除 null 检查分支
3. **Duck Typing** `isNode()` 用属性检查代替 `instanceof`

## 影响范围

### 需要修改的类

| 类 | Node 类 | 复杂度 |
|---|---------|--------|
| BinaryTree | BinaryTreeNode | 中 |
| BST | BSTNode | 中 |
| AVLTree | AVLTreeNode | 高 (平衡因子) |
| RedBlackTree | RedBlackTreeNode | 高 (颜色) |
| TreeMap | (用 RBT Node) | 低 |
| TreeSet | (用 RBT Node) | 低 |
| TreeMultiMap | (用 RBT Node) | 低 |
| TreeMultiSet | (用 RBT Node) | 低 |
| TreeCounter | (用 RBT Node) | 低 |
| AVLTreeCounter | (用 AVL Node) | 低 |
| AVLTreeMultiMap | (用 AVL Node) | 低 |

### 继承链

```
BinaryTreeNode
  └── BSTNode
        ├── AVLTreeNode (+ height)
        └── RedBlackTreeNode (+ color)
```

## 设计方案

### 1. Node Interface 定义

```typescript
// base
export interface IBinaryTreeNode<K, V> {
  key: K;
  value: V | undefined;
  left: IBinaryTreeNode<K, V> | undefined;
  right: IBinaryTreeNode<K, V> | undefined;
  parent: IBinaryTreeNode<K, V> | undefined;
}

// BST - 同上，类型收窄
export interface IBSTNode<K, V> extends IBinaryTreeNode<K, V> {
  left: IBSTNode<K, V> | undefined;
  right: IBSTNode<K, V> | undefined;
  parent: IBSTNode<K, V> | undefined;
}

// AVL - 增加 height
export interface IAVLTreeNode<K, V> extends IBSTNode<K, V> {
  height: number;
  left: IAVLTreeNode<K, V> | undefined;
  right: IAVLTreeNode<K, V> | undefined;
  parent: IAVLTreeNode<K, V> | undefined;
}

// RBT - 增加 color
export interface IRedBlackTreeNode<K, V> extends IBSTNode<K, V> {
  color: 'RED' | 'BLACK';
  left: IRedBlackTreeNode<K, V> | undefined;
  right: IRedBlackTreeNode<K, V> | undefined;
  parent: IRedBlackTreeNode<K, V> | undefined;
}
```

### 2. NIL Sentinel

```typescript
// 共享的 NIL 节点 (RBT)
const NIL: IRedBlackTreeNode<any, any> = {
  key: undefined as any,
  value: undefined,
  color: 'BLACK',
  left: undefined,  // 指向自己，构造后设置
  right: undefined,
  parent: undefined
};
NIL.left = NIL;
NIL.right = NIL;
NIL.parent = NIL;
```

### 3. createNode 工厂函数

```typescript
function createBSTNode<K, V>(key: K, value?: V): IBSTNode<K, V> {
  return { key, value, left: undefined, right: undefined, parent: undefined };
}

function createRBTNode<K, V>(key: K, value?: V): IRedBlackTreeNode<K, V> {
  return { 
    key, value, 
    color: 'RED',  // 新节点默认红色
    left: NIL, right: NIL, parent: NIL 
  };
}

function createAVLNode<K, V>(key: K, value?: V): IAVLTreeNode<K, V> {
  return { 
    key, value, 
    height: 1,  // 叶子节点高度 1
    left: undefined, right: undefined, parent: undefined 
  };
}
```

### 4. isNode Duck Typing

```typescript
function isRBTNode<K, V>(obj: unknown): obj is IRedBlackTreeNode<K, V> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'key' in obj &&
    'color' in obj &&
    'left' in obj &&
    'right' in obj
  );
}
```

## 实施步骤

### Phase 1: RedBlackTree (核心)

1. [ ] 定义 `IRedBlackTreeNode` interface
2. [ ] 创建 `createRBTNode()` 工厂
3. [ ] 修改 NIL 为 plain object
4. [ ] 更新 `_createNode()` 使用工厂
5. [ ] 更新 `isNode()` 使用 duck typing
6. [ ] 更新 `instanceof` 检查为属性检查
7. [ ] 运行测试
8. [ ] 运行基准对比

### Phase 2: BST

1. [ ] 定义 `IBSTNode` interface
2. [ ] 创建 `createBSTNode()` 工厂
3. [ ] 更新相关方法
4. [ ] 测试 + 基准

### Phase 3: AVLTree

1. [ ] 定义 `IAVLTreeNode` interface (含 height)
2. [ ] 创建 `createAVLNode()` 工厂
3. [ ] 确保 height 更新逻辑正确
4. [ ] 测试 + 基准

### Phase 4: BinaryTree (基类)

1. [ ] 定义 `IBinaryTreeNode` interface
2. [ ] 更新基类方法
3. [ ] 测试

### Phase 5: 高层封装

- TreeMap, TreeSet, TreeMultiMap, TreeMultiSet, TreeCounter
- 这些主要使用 RBT，Phase 1 完成后应自动生效
- 验证测试通过即可

## 风险和注意事项

### Breaking Changes

1. **Node 类型变化** - `XXXNode` 从 class 变为 interface
2. **instanceof 失效** - 用户代码如有 `instanceof XXXNode` 会失败
3. **继承失效** - 用户如继承 Node 类需重构

### 测试重点

1. **旋转操作** - 确保指针正确更新
2. **平衡操作** - AVL height / RBT color 正确维护
3. **NIL 处理** - 确保 NIL 不被意外修改
4. **边界情况** - 空树、单节点、删除根节点

### 性能预期

| 操作 | 预期提升 | 原因 |
|------|---------|------|
| insert | 10-20% | 节点创建变快 |
| delete | 5-10% | 节点创建占比小 |
| search | ~0% | 无节点创建 |
| 遍历 | ~0% | 无节点创建 |

## 基准测试计划

```javascript
// 对比项
const benchmarks = [
  'insert 100K sequential',
  'insert 100K random',
  'delete 50K',
  'search 100K',
  'iterate all'
];

// 对比对象
- DST (before): Class Node
- DST (after): Plain Object Node
- js-sdsl OrderedMap/OrderedSet
```

## 时间线

| Phase | 预计时间 | 依赖 |
|-------|---------|------|
| Phase 1 (RBT) | 2-3h | - |
| Phase 2 (BST) | 1-2h | Phase 1 |
| Phase 3 (AVL) | 1-2h | Phase 2 |
| Phase 4 (BinaryTree) | 1h | Phase 3 |
| Phase 5 (封装类) | 30min | Phase 1 |
| 总计 | 6-8h | - |

## 决策点

- [ ] 确认 Breaking Change 可接受
- [ ] 确认继承链处理方式
- [ ] 确认 NIL 共享策略 (每树一个 vs 全局一个)
- [ ] 确认预期性能提升值得投入

---

*RFC Status: Draft*
*Author: Claw*
*Date: 2026-02-28*
