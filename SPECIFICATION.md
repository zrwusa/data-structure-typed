
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

- `enqueue`, `dequeue`, `push`, `pop`, `poll`, `addLast`, `addFirst`, `pollFirst`, `pollLast`, `isEmpty`, `clear`, `print`, `clone`.

### Implementation of Customizable Features Whenever Possible

- Such as providing callback functions (lambda expressions) for all traversal methods.

### Comprehensive Documentation

- The documentation not only explains the purpose of methods but also annotates time and space complexity across the entire series.
