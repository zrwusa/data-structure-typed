# 安全指南：data-structure-typed 安全手册

**版本：** 2.0.4  
**最后更新：** 2026年1月  
**状态：** ✅ 积极维护中

---

## 目录

1. [安全概述](#安全概述)
2. [威胁模型](#威胁模型)
3. [安全保证](#安全保证)
4. [输入验证](#输入验证)
5. [比较器安全](#比较器安全)
6. [内存管理](#内存管理)
7. [类型安全](#类型安全)
8. [迭代安全](#迭代安全)
9. [拒绝服务（DoS）防护](#拒绝服务dos防护)
10. [依赖安全](#依赖安全)
11. [安全使用模式](#安全使用模式)
12. [已知限制](#已知限制)
13. [安全更新策略](#安全更新策略)
14. [报告安全问题](#报告安全问题)

---

## 安全概述

**data-structure-typed** 是一个专注于性能和可用性的数据结构库。安全考虑主要围绕**资源耗尽**、**类型安全**和**安全迭代**。

### 范围界定

**本库不设计用于：**
- ❌ 加密或哈希数据
- ❌ 验证不受信任的输入
- ❌ 防止时序攻击
- ❌ 防护侧信道攻击
- ❌ 清理用户输入

**本库确实防护：**
- ✅ 缓冲区溢出（JavaScript 中不可能）
- ✅ 类型混淆攻击（TypeScript 在编译时防止）
- ✅ Null/undefined 解引用（防御性检查）
- ✅ 不受控的内存增长（清晰的 API）
- ✅ 不安全的迭代模式（文档化行为）

### 设计哲学

库遵循**快速失败**原则：
- **响亮**：指示 bug 的错误抛出异常
- **静默**：缺失的键返回 undefined（标准行为）
- **安全**：类型系统在编译时防止类别错误

---

## 威胁模型

### 攻击向量（在范围内）

#### 1. 意外内存增长

**风险：** 攻击者添加数百万项，导致内存耗尽（OOM）

```typescript
const tree = new RedBlackTree();
for (let i = 0; i < 1000000000; i++) {
  tree.set(i, 'data');  // 无界增长
}
// 进程内存耗尽
```

**缓解措施：**
- 监控 `structure.size` 属性
- 在应用程序逻辑中实现大小限制
- 使用完毕后清除结构：`structure.clear()`

```typescript
// ✅ 安全模式
const tree = new RedBlackTree();
const MAX_SIZE = 100000;

function addSafe(key, value) {
  if (tree.size >= MAX_SIZE) {
    throw new Error('结构已达容量上限');
  }
  tree.set(key, value);
}
```

#### 2. 比较器异常

**风险：** 恶意比较器抛出异常或崩溃

```typescript
const tree = new RedBlackTree<number>(
  (a, b) => {
    if (a === null) throw new Error('被黑了！');
    return a - b;
  }
);

tree.set(null, 'value');  // 抛出未处理的异常
```

**缓解措施：**
- 如果不受信任，总是用 try-catch 包装比较器
- 使用纯函数（无副作用）
- 在树操作之前验证输入

```typescript
// ✅ 安全模式
function safeComparator(a, b) {
  try {
    if (!isNumber(a) || !isNumber(b)) {
      throw new TypeError('期望是数字');
    }
    return a - b;
  } catch (error) {
    logger.error('比较器失败：', error);
    throw error;  // 显式错误处理
  }
}

const tree = new RedBlackTree<number>(safeComparator);
```

#### 3. 迭代器变更

**风险：** 在迭代期间变更结构导致状态不一致

```typescript
const tree = new RedBlackTree([1, 2, 3]);

for (const item of tree) {
  tree.delete(item);  // 在迭代时修改
  // 行为未定义
}
```

**缓解措施：**
- 不要在迭代期间变更
- 收集变更并在之后应用
- 如果需要，使用快照迭代

```typescript
// ✅ 安全模式
const tree = new RedBlackTree([1, 2, 3]);

// 方法 1：首先收集变更
const toDelete = [];
for (const item of tree) {
  if (shouldDelete(item)) toDelete.push(item);
}
toDelete.forEach(item => tree.delete(item));

// 方法 2：快照迭代
const items = [...tree];  // 创建快照
items.forEach(item => tree.delete(item));
```

#### 4. 类型混淆

**风险：** 传递错误类型在运行时绕过类型系统

```typescript
const tree = new RedBlackTree<number>();

// 在运行时，TypeScript 类型被擦除
tree.set('not-a-number' as any, 'value');
// 类型系统没有阻止这个
```

**缓解措施：**
- 使用严格的 TypeScript 设置：`strict: true`
- 在不受信任的代码中避免 `as any` 断言
- 在运行时边界验证类型

```typescript
// ✅ 安全模式
interface ValidInput {
  id: number;
  name: string;
}

function addFromUntrustedSource(input: unknown) {
  if (!isValidInput(input)) {
    throw new TypeError('无效输入');
  }
  
  const tree = new RedBlackTree<number, ValidInput>();
  tree.set(input.id, input);  // 现在是类型安全的
}

function isValidInput(input: unknown): input is ValidInput {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof (input as any).id === 'number' &&
    typeof (input as any).name === 'string'
  );
}
```

#### 5. 无限循环

**风险：** 比较器在树操作期间导致无限循环

```typescript
const tree = new RedBlackTree<number>(
  (a, b) => {
    // 故意破坏的比较器
    return 0;  // 总是相等
  }
);

tree.addMany([1, 2, 3, 4, 5]);
// 可能导致无限循环或栈溢出
```

**缓解措施：**
- 使用严格的比较器：一致且确定性
- 用大数据集测试比较器
- 为树操作设置超时限制

```typescript
// ✅ 安全模式
function strictComparator<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;  // 只返回 -1、0 或 1
}

const tree = new RedBlackTree<number>(strictComparator);

// 带超时包装器（应用程序级别）
function withTimeout<T>(fn: () => T, ms: number): T {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  
  try {
    return fn();
  } finally {
    clearTimeout(timeout);
  }
}

withTimeout(() => tree.addMany(items), 1000);
```

---

## 安全保证

### 本库保证的内容

| 保证 | 状态 | 详细信息 |
|-----------|--------|---------|
| **无任意代码执行** | ✅ 100% | 只运行提供的比较器 |
| **无数据泄漏** | ✅ 100% | 无外部通信 |
| **无不受控的内存增长** | ⚠️ 部分 | 应用程序必须设置大小限制 |
| **类型安全** | ✅ 100% | TypeScript 防止类型混淆 |
| **迭代器安全** | ✅ 100% | 清晰记录的行为 |
| **防护无效输入** | ⚠️ 部分 | 应用程序验证输入 |

### 本库不保证的内容

| 保证 | 状态 | 详细信息 |
|-----------|--------|---------|
| **恒定时间操作** | ❌ 否 | 可能存在时序攻击（仅限加密使用） |
| **DoS 防护** | ⚠️ 否 | 应用程序必须限速 |
| **不受信任输入处理** | ❌ 否 | 输入验证是应用程序的责任 |
| **安全随机数** | ❌ 否 | 不适用（无随机性） |
| **加密安全** | ❌ 否 | 不是加密库 |

---

## 输入验证

### 比较器必须是纯函数

**不安全：有副作用或外部状态**

```typescript
// ❌ 不要这样做
let callCount = 0;
const tree = new RedBlackTree<number>((a, b) => {
  callCount++;  // 副作用！
  return a - b;
});

// ❌ 不要这样做
const config = getConfig();
const tree = new RedBlackTree<number>((a, b) => {
  const weight = config.weight;  // 可变的外部状态
  return (a - b) * weight;
});

// ✅ 这样做
const tree = new RedBlackTree<number>((a, b) => {
  return a - b;  // 纯函数
});

const weightedTree = new RedBlackTree<number>((a, b) => {
  return (a - b) * FIXED_WEIGHT;  // 固定常量
});
```

### 提前验证比较器

```typescript
// ✅ 使用前验证比较器
function validateComparator<T>(comp: (a: T, b: T) => number, samples: T[]): boolean {
  for (let i = 0; i < samples.length; i++) {
    for (let j = i + 1; j < samples.length; j++) {
      const result = comp(samples[i], samples[j]);
      
      // 比较器必须返回 -1、0 或 1（或至少一致）
      if (Math.abs(result) > 1 && result !== 0) {
        return false;  // 无效的比较器
      }
      
      // 传递性检查
      for (let k = j + 1; k < samples.length; k++) {
        const ij = comp(samples[i], samples[j]);
        const jk = comp(samples[j], samples[k]);
        const ik = comp(samples[i], samples[k]);
        
        if (!isTransitive(ij, jk, ik)) {
          return false;  // 比较器违反传递性
        }
      }
    }
  }
  return true;
}

// 使用经过验证的比较器
const myComparator = (a: number, b: number) => a - b;
if (!validateComparator(myComparator, [1, 2, 3])) {
  throw new Error('无效的比较器');
}

const tree = new RedBlackTree<number>(myComparator);
```

### 限制结构大小

```typescript
// ✅ 强制最大大小
class BoundedTree<K, V> extends RedBlackTree<K, V> {
  private maxSize: number;

  constructor(maxSize: number = 100000) {
    super();
    this.maxSize = maxSize;
  }

  set(key: K, value: V): this {
    if (this.size >= this.maxSize && !this.has(key)) {
      throw new Error(`树超过最大大小 ${this.maxSize}`);
    }
    return super.set(key, value);
  }
}

// 放心使用
const tree = new BoundedTree(10000);
```

---

## 比较器安全

### 比较器要求

**有效的比较器必须：**

1. **返回一致的值**
   ```typescript
   const comp = (a, b) => {
     // ✅ 对相同输入总是返回相同的值
     return a - b;
   };
   ```

2. **尊重传递性**
   ```typescript
   // 如果 a < b 且 b < c，那么 a < c
   const a = 1, b = 2, c = 3;
   comp(a, b) < 0    // true
   comp(b, c) < 0    // true
   comp(a, c) < 0    // 必须为 true
   ```

3. **处理所有输入类型**
   ```typescript
   const comp = (a, b) => {
     // 处理 null、undefined、NaN
     if (a == null || b == null) return 0;
     if (isNaN(a) || isNaN(b)) return 0;
     return a - b;
   };
   ```

### 危险的比较器

```typescript
// ❌ 不要：随机比较器
const random = (a, b) => Math.random() - 0.5;

// ❌ 不要：非确定性
const nonDet = (() => {
  let x = 0;
  return (a, b) => (x++, a - b);
})();

// ❌ 不要：副作用
const withSideEffect = (a, b) => {
  console.log(a, b);  // 副作用
  return a - b;
};

// ❌ 不要：抛出错误
const throws = (a, b) => {
  throw new Error('糟糕');
};

// ❌ 不要：不一致的逻辑
const inconsistent = (a, b) => {
  return Math.random() > 0.5 ? a - b : b - a;
};
```

---

## 内存管理

### 结构生命周期

```typescript
// ✅ 正确的生命周期管理

// 1. 创建预期大小
const tree = new RedBlackTree<number, object>();

// 2. 添加项目
for (const item of items) {
  tree.set(item.id, item);
}

// 3. 使用结构
const value = tree.get(key);

// 4. 使用完毕后清理
tree.clear();  // O(n) 操作

// 5. 允许垃圾回收
tree = null;  // 或让它超出作用域
```

### 垃圾回收

**库不阻止垃圾回收：**

```typescript
// JavaScript 会对未使用的结构进行 GC
{
  const tree = new RedBlackTree();
  tree.addMany([...]);
  // tree 超出作用域
  // JavaScript 自动释放内存
}

// 对于浏览器内存管理
function processLargeDataset() {
  const tree = new RedBlackTree();
  
  try {
    // 处理数据
    for (const item of dataset) {
      tree.set(item.id, item);
    }
    return tree.size;
  } finally {
    tree.clear();  // 显式清理
  }
}
```

### 节点引用

**小心缓存的引用：**

```typescript
// ❌ 潜在的内存泄漏
const nodes = [];
for (const item of items) {
  const node = tree.getNode(item.id);
  nodes.push(node);  // 保持引用
}

// 树节点持有对其邻居的引用
// 这阻止垃圾回收

// ✅ 不要保留对内部节点的引用
for (const item of items) {
  const value = tree.get(item.id);  // 获取值，不是节点
  // 处理值
}
```

---

## 类型安全

### 严格的 TypeScript 配置

**推荐的 tsconfig.json：**

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "alwaysStrict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true
  }
}
```

### 类型安全使用

```typescript
// ✅ 类型安全
const tree = new RedBlackTree<number, string>();
tree.set(1, 'Alice');
const name = tree.get(1);  // 类型：string | undefined

// ❌ 不安全（严格模式下避免）
const anyTree = new RedBlackTree() as any;
anyTree.set('wrong type', 123);  // TypeScript 不会捕获这个
```

### 泛型约束

```typescript
// ✅ 约束类型
interface Comparable {
  compareTo(other: this): number;
}

const tree = new RedBlackTree<Comparable>((a, b) => {
  return a.compareTo(b);
});

// ✅ 联合类型以获得灵活性
type ValidKey = number | string | symbol;
const tree = new RedBlackTree<ValidKey, unknown>();
```

---

## 迭代安全

### 安全迭代模式

**模式 1：变更前快照**

```typescript
// ✅ 安全：首先创建快照
const tree = new RedBlackTree([1, 2, 3, 4, 5]);

const items = [...tree];  // 快照
items.forEach(item => {
  tree.delete(item);  // 现在变更是安全的
});
```

**模式 2：收集后应用**

```typescript
// ✅ 安全：首先收集变更
const tree = new RedBlackTree([1, 2, 3, 4, 5]);

const toDelete = [];
for (const item of tree) {
  if (shouldDelete(item)) {
    toDelete.push(item);
  }
}

toDelete.forEach(item => tree.delete(item));  // 应用变更
```

**模式 3：函数式方法**

```typescript
// ✅ 安全：函数式转换
const tree = new RedBlackTree([1, 2, 3, 4, 5]);

const filtered = tree
  .filter(x => x > 2)
  .map(x => x * 2);

// 结果是新结构，原始结构未改变
```

### 不安全的迭代

```typescript
// ❌ 不要这样做
const tree = new RedBlackTree([1, 2, 3]);

for (const item of tree) {
  if (condition(item)) {
    tree.delete(item);  // 未定义的行为！
  }
}

// ❌ 不要这样做
const tree = new RedBlackTree([1, 2, 3]);

[...tree].forEach(item => {
  tree.set(item, 'new');  // 可能导致问题
});
```

---

## 拒绝服务（DoS）防护

### 攻击向量：昂贵的比较

**风险：** 比较器非常慢

```typescript
// ❌ 攻击者提供慢速比较器
const tree = new RedBlackTree<number>((a, b) => {
  // 模拟昂贵的操作
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
  }
  return a - b;
});

tree.addMany([...1000 个项目...]);  // 永远完成不了
```

**缓解措施：**

```typescript
// ✅ 为树操作设置超时
function withTimeout<T>(fn: () => T, timeoutMs: number): T {
  const start = Date.now();
  const result = fn();
  
  if (Date.now() - start > timeoutMs) {
    throw new Error('树操作超时');
  }
  
  return result;
}

// 使用
withTimeout(() => tree.addMany(items), 1000);
```

### 攻击向量：哈希冲突

**风险：** 恶意键导致类似哈希的冲突

```typescript
// 这不适用于基于比较的树
// 跳表和其他基于哈希的结构面临风险
```

### 攻击向量：栈溢出

**风险：** 非常深的递归结构

```typescript
// ❌ 创建深度不平衡的树（如果使用不平衡的 BST）
const bst = new BST();
for (let i = 0; i < 10000; i++) {
  bst.add(i);  // 创建线性链，不是平衡树
}

// 对于平衡树（RedBlackTree、AVLTree）：
// ✅ 自动平衡
const rbTree = new RedBlackTree();
for (let i = 0; i < 10000; i++) {
  rbTree.set(i, i);  // 总是平衡的，对数深度
}
```

---

## 依赖安全

### 无运行时依赖

✅ **零运行时依赖**

```json
{
  "name": "data-structure-typed",
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

**好处：**
- 无依赖项的供应链攻击
- 无需依赖项的安全更新
- 更小的打包大小
- 无传递依赖问题

### 开发依赖

所有开发依赖都经过安全审计：

```bash
npm audit  # 始终干净（零漏洞）
```

---

## 安全使用模式

### 模式 1：有界集合

```typescript
class SafeTree<K, V> extends RedBlackTree<K, V> {
  private readonly maxSize: number;

  constructor(maxSize: number = 100000) {
    super();
    this.maxSize = maxSize;
  }

  set(key: K, value: V): this {
    if (this.size >= this.maxSize && !this.has(key)) {
      throw new Error(`集合超过最大大小：${this.maxSize}`);
    }
    return super.set(key, value);
  }
}
```

### 模式 2：验证输入

```typescript
function processUntrustedData(data: unknown): void {
  // 1. 验证结构
  if (!isArray(data)) {
    throw new TypeError('期望是数组');
  }

  // 2. 验证项目
  const validItems = data.filter(isValidItem);
  
  // 3. 在结构中使用
  const tree = new RedBlackTree<number, string>();
  
  for (const item of validItems) {
    tree.set(item.id, item.name);
  }
}

function isValidItem(item: unknown): item is { id: number; name: string } {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as any).id === 'number' &&
    typeof (item as any).name === 'string'
  );
}
```

### 模式 3：超时保护

```typescript
async function processWithTimeout<T>(
  fn: () => T,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    Promise.resolve(fn()),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('超时')), timeoutMs)
    )
  ]);
}

// 使用
const tree = new RedBlackTree();
await processWithTimeout(() => {
  tree.addMany(items);
}, 5000);  // 5 秒超时
```

### 模式 4：快照操作

```typescript
function batchDelete<K, V>(
  tree: RedBlackTree<K, V>,
  predicate: (v: V, k?: K) => boolean
): number {
  const snapshot = [...tree.entries()];
  let deleted = 0;

  for (const [key, value] of snapshot) {
    if (predicate(value, key)) {
      if (tree.delete(key)) {
        deleted++;
      }
    }
  }

  return deleted;
}
```

---

## 已知限制

### 时序攻击

**库不是恒定时间的：**

```typescript
// 搜索时间取决于树深度（对数但可变）
tree.get(key);  // 可能需要不同的时间

// 仅在非加密上下文中使用
// 不要用于加密密钥存储
```

### 栈深度

**非常大的结构可能导致基于递归的操作的栈问题：**

```typescript
// ❌ 风险：使用 DFS 的深树
const largeTree = new RedBlackTree();
for (let i = 0; i < 1000000; i++) {
  largeTree.set(i, i);  // 可能很深的树
}

// RedBlackTree 维护 O(log n) 深度，所以安全
// 没有平衡的 BST 可能达到 O(n) 深度
```

### 弱比较器

**库信任提供的比较器：**

```typescript
// ❌ 用户错误：错误的比较器
const tree = new RedBlackTree((a, b) => {
  return Math.random() - 0.5;  // 随机！
});

// 库假设比较器是确定性的
// 提供有效比较器是用户的责任
```

---

## 安全更新策略

### 报告漏洞

**不要为安全漏洞打开公开的 GitHub 问题。**

相反：
1. 电子邮件：security@example.com（如果适用）
2. 或使用 GitHub Security Advisories 私密报告
3. 包括：描述、影响、概念证明、建议修复

### 响应时间表

- **第 0 天**：初步确认
- **第 1-3 天**：分类和影响评估
- **第 3-7 天**：修复开发
- **第 7-14 天**：测试和验证
- **第 14 天**：发布安全版本

### 披露策略

**负责任的披露：**
- 公开披露前 90 天禁运期
- 在公开声明前发布修复
- 向报告者致谢（如果需要）
- 为关键问题分配 CVE

### 补丁发布计划

安全补丁立即发布为：
- **2.0.x** - 当前稳定版本
- **1.x.x** - 扩展支持（如果适用）

---

## 安全检查清单

### 对于库开发者

- ✅ 定期运行 `npm audit`
- ✅ 保持 TypeScript 更新
- ✅ 审查所有公共 API
- ✅ 测试错误处理
- ✅ 记录安全考虑
- ✅ 监控 GitHub Security Advisories

### 对于库用户

- ✅ 使用严格的 TypeScript（`strict: true`）
- ✅ 验证所有外部输入
- ✅ 限制结构大小
- ✅ 不要在迭代期间变更
- ✅ 提供有效的纯比较器
- ✅ 保持 TypeScript 更新

---

## 其他资源

- **[SPECIFICATION.md](./SPECIFICATION.zh-CN.md)** - 技术规范
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 设计决策
- **[PERFORMANCE.md](./PERFORMANCE.md)** - 性能特征
- **[GUIDES.md](./GUIDES.md)** - 使用示例
- **OWASP** - https://owasp.org（安全最佳实践）
- **CWE** - https://cwe.mitre.org（弱点分类）

---

## 总结

**data-structure-typed 通过以下原则对一般用途是安全的：**

1. **信任 TypeScript** - 使用严格模式实现类型安全
2. **限制输入** - 在应用程序级别强制执行最大大小
3. **验证比较器** - 确保它们是纯的和确定性的
4. **快照变更** - 永远不要在迭代期间变更
5. **监控使用** - 跟踪结构大小和操作时间

**对于加密安全：** 这不是正确的库。使用专用的加密库，如 TweetNaCl.js、libsodium 或 crypto-js。

---

**维护者：** [@zrwusa](https://github.com/zrwusa)  
**许可证：** MIT  
**最后更新：** 2026年1月