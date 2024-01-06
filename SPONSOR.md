# Who am I

I am a seasoned software development engineer with 15 years of professional experience. Following my graduation from university, I have contributed my expertise to various software companies across diverse industries, including some prominent ones.

Of course, I have my flaws, I have a nerd-like attitude towards technology and could be described as a perfectionist. For instance, being excessively serious and having a penchant for studying the essence of things, I sometimes come across as a stern boss, which can be intimidating to my wife and daughter.

Fortunately, my outlook on life is broad-minded. when it comes to life and family, the keywords are love, loyalty, and appreciation of beauty. I also enjoy studying cultural differences in various regions. Deep down, I actually have a bit of an artistic flair. LOL, just writing this makes me want to laugh!

# Current Situation

My recent move to Malaysia was motivated by the desire to provide my daughter with a formal education(Yes, you read it correctly, it is the word 'formal', because the education system in some countries is not normal), and it comes alongside holding a 10-year residency visa(MM2H). However, this visa restricts my employment opportunities within Malaysian companies. Fueled by my passion for programming and recognizing the absence of a standardized data structures library in JavaScript/TypeScript, I embarked on the journey of implementing my own set of data structures - `data-structure-typed` within the open-source community.

# `data-structure-typed` Project Overview

## Ultimate Goal

- To seamlessly integrate into the standard library of JS/TS.

## Pain Points Addressed

### Enhanced the Performance of Simulated Data Structures in JS/TS

- `Queue`: While many resort to using Array to simulate Queue and Deque, the time complexity of Array.shift is O(n). We have tackled this by implementing a Queue and Deque with O(1) time complexity.

- `HashMap`: The built-in Map in JS is actually a LinkedHashMap, as it maintains the insertion order of elements, resulting in performance inferiority compared to a pure HashMap. We have implemented a pure HashMap.

### Introducing Missing Native Data Structures in JS/TS

- `Heap / Priority Queue`: Algorithms with O(log n) time complexity have been pivotal in improving efficiency since the dawn of computers. A Heap supports insertion, deletion, and search with O(log n) time complexity, coupled with the ability to obtain the minimum / maximum value in O(1) time.

- `Red Black Tree`: Developers well-versed in databases, file systems, Linux virtual memory management, and network routing tables often have a nuanced understanding of Red-Black Trees. It stands out as the least operation-intensive among all balanced binary search trees, offering optimal performance balance in CRUD operations.

## Advantages

### Performance:

- The performance of some ours data structures has surpassed JS's built-in data structures, such as `Queue`, `Deque` and `HashMap`, while most are comparable to or even surpass those in other languages. Some are still undergoing refinement, notably the `Graph` and `AVL Tree`.

### Uniformity

- 1. Concise and industry-standard naming：Implementation or constraint of `forEach`, `filter`, `map`, `every`, `some`, `reduce`, `find`, `has`, `hasValue`, `get`, `print`, `isEmpty`, `clear`, `clone` methods in the base class.
- 2. Adhere to the ES6 specification: Use of generators to uniformly implement `[Symbol.iterator]`, `entries`, `keys`, `values`. Delaying iterator execution prevents performance loss and provides control during traversal. All deletion methods uniformly use the widely adopted `delete` in ES6, while addition methods uniformly use `add`. Compatibility with some specifications in Java.
- 3. Constructors：The first parameter for all constructors is data, and the second parameter is configuration, maintaining uniformity. The first parameter accepts any iterable type for seamless conversion between data structures.
- 4. Return types：for example, the `add` method consistently returns a boolean.

We would like to provide a more detailed description of this project, but space is limited here. For specific technical details, please refer to the [README.md](https://github.com/zrwusa/data-structure-typed), [SPECIFICATION.md](https://github.com/zrwusa/data-structure-typed/blob/main/CODE_OF_CONDUCT.md), or [API Docs](https://data-structure-typed-docs.vercel.app/).

## Community Activity

- In terms of community engagement, we have noteworthy metrics including NPM download count ![npm](https://img.shields.io/npm/dm/data-structure-typed), GitHub stars ![GITHUB Star](https://img.shields.io/github/stars/zrwusa/data-structure-typed), and contributors ![GitHub contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed).

## Sponsor Us

- From a software engineering standards perspective, our project has achieved at least 75% completeness. With your sponsorship, we believe we can swiftly elevate the project's completion to 95%, providing valuable assistance to my family and serving as encouragement to our project team. Additionally, we aspire to expedite the goal of becoming an integral part of the `JS/TS` standard library.
