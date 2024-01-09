
# 我是谁

我是一个拥有15年工作经验的软件开发工程师，自大学毕业职于不同行业的软件公司其中也包括一些大厂。

# 目前现状

为了孩子得到正规教育移居到马来西亚，持有10年居留签证，但是这个签证不允许我被马来西亚公司雇佣。
由于自己酷爱编程，又正逢JavaScript / TypeScript (以下简称`JS/TS`)没有标准库涵盖数据结构，便决定在开源社区自己实现一套数据结构 [data-structure-typed]()。

[NPM](https://www.npmjs.com/package/data-structure-typed)

[Github](https://github.com/zrwusa/data-structure-typed)

# 项目介绍

## 最终目标

- 成为JS/TS的标准库的一部分。

## 解决了的痛点

### 在JS / TS我们只能基于Array和Map来模拟一些数据结构，例如Queue，Deque，Stack，HashMap

- `Queue`:大家使用Array来模拟Queue和Deque，但是Array.shift方法的时间复杂度是O(n)的。我们实现了入队和出队时间复杂度为O(1)的Queue，Deque。

- `HashMap`:如大家希望使用一个纯正的HashMap来加速自己的算法，而不是使用内置的Map(严格来说是LinkedHashMap)，由于需要顾及插入顺序所以性能上逊色于纯正的HashMap。我们单独实现了HashMap

- `Stack`: 在JS中，用Array模拟Stack并没有什么不妥，性能也不弱于真正的Stack。

### JS / TS内置数据结构的缺失。

- `Heap / Priority Queue`:
不得不提O(log n)，这个算法时间复杂度是人类使用计算机以来最受欢迎的提高效率的方式。Heap本身就支持插入、删除、查找时间复杂度均为O(log n)，
还顺带附赠一个动态随时以O(1)的时间复杂度获取最值的功能。

- `Red Black Tree`: 
相信很多了解数据库、文件系统、Linux的虚拟内存管理和网络路由表底层的开发者都对红黑树有一定了解。
因为它是在所有平衡二叉搜索树中操作消耗量最少的，而且在CRUD这4个操作上性能平衡得最好的实现。

- `Linked List`: 
例如我们需要在一个有序集合中，如果已经获取到某个元素的索引的情况下，在这个索引处插入或者删除元素，JS没有提供类似数据结构。我们需要LinkedList来实现。

- `Trie`: 
字符串高速查询，字符串存储高效性方面有奇效，但是大多数编程语言的标准库中不常见。

- `Graph`: 
这个数据结构在大多数的语言标准库中也不常见，所以我们不把它作为JS的弱项。


## 优势

### 性能：

- 少部分数据结构的性能已经超越JS内置数据结构（`Queue`，`Deque`, `HashMap`）， 大部分已接近或超越其它语言，部分还没达标(`Graph`, `AVL Tree`)

### 统一性

- 1、在基类中实现或约束 `forEach`，`filter`, `map`，`every`，`some`，`reduce`，`find`，`has`，`hasValue`，`get`，`print`，`isEmpty`, `clear`，`clone` 方法。
- 2、使用生成器，统一实现`[Symbol.iterator]`，`entries`, `keys`, `values`。延迟执行遍历器以防止性能损失，并提供遍历时的可控性。
- 3、所有的删除方法都统一采用ES6标准中惯用的`delete`。添加方法统一使用`add`。同时兼容Java中的一些规范。
- 4、所有构造函数的第一个参数都是数据，第二个参数是配置，保持统一。第一个参数接受任意可遍历类型，以实现数据结构间自由转换。
- 5、统一返回参数类型，如`add`方法统一返回布尔值。

### APIs的便捷性和简洁性

- 受ES6, Java, ESNext, TypeScript, Python的启发，如`forEach`，`filter`, `map`，`every`，`some`，`reduce`，`find`，`has`，`hasValue`，`get`

### 使用通俗易懂业界常用命名

- `enqueue`, `dequeue`, `push`, `pop`, `poll`, `push`, `unshift`, `shift`, `pop`, `isEmpty`, `clear`, `print`, `clone`

### 尽量实现可定制化功能

- 如所有遍历方法都提供回调函数（拉姆达表达式）的设计

### 完善的文档

- 文档不但阐述方法的用途，而且全系标注时间和空间复杂度


## 社区活跃度

- 从社区来说，NPM下载量![npm](https://img.shields.io/npm/dm/data-structure-typed)，
GitHub星星![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
贡献者![GitHub contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)

## 赞助我们吧

- 以软件工程标准来说，我们的项目目前已经达到至少75%的完整度，我们相信我们在您的赞助下很快将这个项目的完成度提高到95%，这对我的家庭来说算一种援助，对我们项目组来说是一种鼓励，也希望尽早能够实现成为`JS/TS`标准库的目标。
