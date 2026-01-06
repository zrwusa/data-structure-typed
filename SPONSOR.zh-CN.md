# 关于我

我是一名拥有超过 15 年专业经验的资深软件开发工程师。毕业以来，我曾在不同行业的各类软件公司磨练技艺，并为多个知名平台做出过贡献。

我将自己描述为一个带有完美主义倾向的技术狂热者。我对技术本质的深入钻研和严肃的态度，有时会让我看起来像个“严厉的老板”——这一特质有时会让我的家人感到既敬畏又好笑。然而，我的人生态度是建立在宽广胸怀之上的，关键词是爱、忠诚和对美的欣赏。我也非常享受探索不同地区的文化差异，并且内心深处其实藏着一点艺术天分。

# 项目背后的故事

我最近移居马来西亚，初衷是为了给女儿提供更全面、正规的教育。作为 MM2H（10年长期居留签证）持有者，我受到限制，无法受雇于当地的马来西亚公司。

我没有将其视为限制，而是将其视为一个机会。出于对编程的终身热爱，并认识到 JavaScript/TypeScript 生态系统中存在一个关键缺口——缺乏标准化的、高性能的数据结构库——我踏上了构建 `data-structure-typed` 的旅程。

# 项目概览：`data-structure-typed`

## 终极目标

**无缝集成到 JavaScript 和 TypeScript 的标准库中。**

## 解决实际痛点

### 1. 提升性能
- **Queue（队列）& Deque（双端队列）**：开发者经常使用 JavaScript 数组来模拟队列。然而，`Array.shift()` 的时间复杂度是 **O(n)**。我们实现了时间复杂度为 **O(1)** 的 Queue 和 Deque 结构，为大数据集提供了巨大的性能提升。
- **HashMap（哈希映射）**：JavaScript 内置的 `Map` 技术上是 `LinkedHashMap`，因为它维护插入顺序。这带来了额外开销。我们实现了一个纯粹的 **HashMap**，优先考虑原始性能而非顺序。

### 2. 为 JS/TS 引入缺失的结构
- **Heap（堆）/ Priority Queue（优先队列）**：对于高效算法至关重要，堆支持 O(log n) 的插入/删除和 O(1) 的极值访问。这些在其他语言中是标准的，但在 JS 原生中缺失。
- **Red-Black Tree（红黑树）**：数据库和系统设计中的主打结构，红黑树在平衡二叉搜索树中提供了查找、插入和删除性能之间的最佳平衡。

## 核心优势

### 🚀 卓越性能
我们的基准测试显示，`data-structure-typed` 的实现通常超过原生 JS 结构（如 `Queue` 对比 `Array`），并与 C++ 或 Java 等语言的标准库相当。我们正在持续优化复杂的结构，如 `Graph`（图）和 `AVL Tree`（AVL 树）。

### ⚡ 统一且标准化的 API
1.  **标准命名**：我们在所有数据结构中实现了标准方法（`forEach`, `filter`, `map`, `reduce`, `find`, `clear` 等）以保持一致性。
2.  **符合 ES6 规范**：我们使用生成器来实现 `[Symbol.iterator]`, `keys()`, `values()`, 和 `entries()`。这允许惰性求值并在遍历期间提供更好的控制。
3.  **可预测的接口**：
    - **构造函数**：始终接受 `(data, configuration)`。
    - **返回类型**：像 `add()` 这样的方法始终返回布尔值以指示成功。
    - **可迭代**：在数据结构之间无缝转换（例如，从数组初始化树）。

有关技术规范、基准测试和 API 文档，请访问：
- [GitHub 仓库](https://github.com/zrwusa/data-structure-typed)
- [在线文档](https://data-structure-typed-docs.vercel.app/)

# 社区与影响

该项目在开源社区中正获得越来越多的关注：
- ![NPM Downloads](https://img.shields.io/npm/dm/data-structure-typed)
- ![GitHub Stars](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
- ![Contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)

# 为什么赞助？

从严格的软件工程标准来看，我认为 `data-structure-typed` 目前已完成了 **75%**。

您的赞助不仅仅是捐赠；它是对 JavaScript 生态系统的投资。它将使我能够：
1.  **加速开发**：迅速将项目推进到 **95% 的完成度**，完善边缘情况和文档。
2.  **维持维护**：支持我的家庭，使我能够全职投入这项开源工作。
3.  **实现标准化**：帮助推动该库成为全球 TS/JS 开发者的事实标准。

感谢您支持开源和高性能软件工程！