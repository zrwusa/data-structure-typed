
[NPM](https://www.npmjs.com/package/data-structure-typed)

[Github](https://github.com/zrwusa/data-structure-typed)

## Pain Points Addressed

### Enhancing the Performance of Simulated Data Structures in JS/TS

- `Queue`: While many resort to using Arrays to simulate Queues and Deques, the time complexity of Array.shift is O(n). We have tackled this challenge by implementing a Queue and Deque with O(1) time complexity for enqueue and dequeue operations.

- `HashMap`: Opting for a pure HashMap over the built-in Map (technically a LinkedHashMap) can boost algorithmic speed. However, the performance is compromised due to the necessity of considering insertion order. We have independently implemented an optimized HashMap.

- `Stack`: In JS, simulating a Stack with an Array is acceptable, and its performance is on par with a genuine Stack.

### Introducing Missing Native Data Structures in JS/TS

- `Heap / Priority Queue`: Algorithms with O(log n) time complexity have been pivotal in improving efficiency since the dawn of computers. A Heap supports insertion, deletion, and search with O(log n) time complexity, coupled with the ability to obtain the minimum / maximum value in O(1) time.

- `Red Black Tree`: Developers well-versed in databases, file systems, Linux virtual memory management, and network routing tables often have a nuanced understanding of Red-Black Trees. It stands out as the least operation-intensive among all balanced binary search trees, offering optimal performance balance in CRUD operations.

- `Linked List`: In scenarios where insertion or deletion of elements with O(1) time complexity is required at a specific index in an ordered collection, JS lacks a provided data structure. Hence, the need for a LinkedList to implement this functionality.

- `Trie`: Efficient for fast string queries and space-efficient string storage, yet not commonly found in the standard libraries of most programming languages.

- `Graph`: This data structure is not commonly found in the standard libraries of most languages, making it a non-issue in JS.

## Advantages

### Performance:

- The performance of some ours data structures has surpassed JS's built-in data structures (`Queue`, `Deque`, `HashMap`), while most are comparable to or even surpass those in other languages. Some are still undergoing refinement (`Graph`, `AVL Tree`).

### Uniformity

- 1. Implementation or constraint of `forEach`, `filter`, `map`, `every`, `some`, `reduce`, `find`, `has`, `hasValue`, `get`, `print`, `isEmpty`, `clear`, `clone` methods in the base class.
- 2. Use of generators to uniformly implement `[Symbol.iterator]`, `entries`, `keys`, `values`. Delaying iterator execution prevents performance loss and provides control during traversal.
- 3. All deletion methods uniformly use the widely adopted `delete` in ES6, while addition methods uniformly use `add`. Compatibility with some specifications in Java.
- 4. The first parameter for all constructors is data, and the second parameter is configuration, maintaining uniformity. The first parameter accepts any iterable type for seamless conversion between data structures.
- 5. Uniform return types, for example, the `add` method consistently returns a boolean.

### Convenience and Simplicity of APIs

- Inspired by ES6, Java, ESNext, TypeScript, Python, featuring methods like `forEach`, `filter`, `map`, `every`, `some`, `reduce`, `find`, `has`, `hasValue` and `get`.

### Use of Commonly Understood Industry Standard Naming

- `enqueue`, `dequeue`, `push`, `pop`, `poll`, `push`, `unshift`, `shift`, `pop`, `isEmpty`, `clear`, `print`, `clone`.

### Implementation of Customizable Features Whenever Possible

- Such as providing callback functions (lambda expressions) for all traversal methods.

### Comprehensive Documentation

- The documentation not only explains the purpose of methods but also annotates time and space complexity across the entire series.

像getter和setter是优于Java的getXxx和setXxx

Java中
添加元素（类似 push）：
add(E element): 将元素添加到列表的末尾。
add(int index, E element): 在指定的索引位置插入元素。

移除元素（类似 pop）：
remove(int index): 移除指定索引位置的元素。

获取并移除首个元素（类似 shift）：
remove(0): 移除索引为0的元素。

在首位插入元素（类似 unshift）：
add(0, E element): 在指定索引（0）处插入元素。


大多数程序员更喜欢JS中的Array的push, pop, shift, unshift。

原因有以下几点：

命名更直观。JS中的push, pop, shift, unshift的命名更加直观，可以直接理解其操作的含义。而Java中的add和remove的命名则比较抽象，需要一定的理解才能理解其操作的含义。
使用更方便。JS中的push, pop, shift, unshift的操作更加方便，只需要一个参数即可完成操作。而Java中的add和remove的操作则需要两个参数，第一个参数指定操作的索引，第二个参数指定操作的值。
性能更高。JS中的push, pop, shift, unshift的性能更高，因为其操作只需要修改数组的长度即可完成。而Java中的add和remove的性能则较低，因为其操作需要移动数组中的元素。