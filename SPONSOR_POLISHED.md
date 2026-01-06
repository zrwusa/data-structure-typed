# About Me

I am a seasoned software development engineer with over 15 years of professional experience. Since graduating, I have honed my expertise across various software companies and diverse industries, contributing to several prominent platforms.

I describe myself as a technology enthusiast with a perfectionist streak. My deep focus on the essence of technical problems and my serious demeanor can sometimes make me appear as a "stern boss"—a trait that my family occasionally finds amusingly intense. However, my outlook on life is grounded in broad-mindedness, defined by love, loyalty, and an appreciation for beauty. I find great joy in exploring cultural differences across regions and harbor a hidden artistic flair.

# The Story Behind the Project

My recent relocation to Malaysia was driven by a desire to provide my daughter with a comprehensive, formal education. As a holder of the MM2H (10-year residency) visa, I am restricted from seeking employment with local Malaysian companies. 

Rather than seeing this as a limitation, I viewed it as an opportunity. Fueled by my lifelong passion for programming and recognizing a critical gap in the JavaScript/TypeScript ecosystem—the absence of a standardized, high-performance data structures library—I embarked on the journey to build `data-structure-typed`.

# Project Overview: `data-structure-typed`

## Ultimate Goal

**To seamlessly integrate into the standard library of JavaScript and TypeScript.**

## Solving Real Pain Points

### 1. Enhancing Performance
- **Queue & Deque**: Developers often resort to using JavaScript Arrays to simulate Queues. However, `Array.shift()` has a time complexity of **O(n)**. We have implemented Queue and Deque structures with **O(1)** time complexity, offering massive performance gains for large datasets.
- **HashMap**: The built-in JavaScript `Map` is technically a `LinkedHashMap` because it maintains insertion order. This comes with overhead. We have implemented a pure **HashMap** that prioritizes raw performance over ordering.

### 2. Bringing Missing Structures to JS/TS
- **Heap / Priority Queue**: Essential for efficient algorithms, Heaps support O(log n) insertion/deletion and O(1) access to min/max values. These are standard in other languages but missing natively in JS.
- **Red-Black Tree**: A staple in database and system design, the Red-Black Tree offers the best balance between lookup, insertion, and deletion performance among balanced binary search trees.

## Key Advantages

### 🚀 Superior Performance
Our benchmarks show that `data-structure-typed` implementations often surpass native JS structures (like `Queue` vs `Array`) and are comparable to standard libraries in languages like C++ or Java. We are continuously refining complex structures like `Graph` and `AVL Tree`.

### ⚡ Uniform & Standardized API
1.  **Standard Naming**: We implement standard methods (`forEach`, `filter`, `map`, `reduce`, `find`, `clear`, etc.) across all data structures for consistency.
2.  **ES6 Compliance**: We use generators for `[Symbol.iterator]`, `keys()`, `values()`, and `entries()`. This allows for lazy evaluation and better control during traversal.
3.  **Predictable Interfaces**: 
    - **Constructors**: Always accept `(data, configuration)`.
    - **Return Types**: Methods like `add()` consistently return booleans to indicate success.
    - **Iterables**: Seamlessly convert between data structures (e.g., initialize a Tree from an Array).

For technical specifications, benchmarks, and API documentation, please visit:
- [GitHub Repository](https://github.com/zrwusa/data-structure-typed)
- [Documentation](https://data-structure-typed-docs.vercel.app/)

# Community & Impact

The project is gaining traction in the open-source community:
- ![NPM Downloads](https://img.shields.io/npm/dm/data-structure-typed)
- ![GitHub Stars](https://img.shields.io/github/stars/zrwusa/data-structure-typed)
- ![Contributors](https://img.shields.io/github/contributors/zrwusa/data-structure-typed)

# Why Sponsor?

From a strict software engineering perspective, I consider `data-structure-typed` to be **75% complete**. 

Your sponsorship is not just a donation; it is an investment in the JavaScript ecosystem. It will allow me to:
1.  **Accelerate Development**: Swiftly bring the project to **95% completion**, polishing edge cases and documentation.
2.  **Sustain Maintenance**: Support my family while I dedicate full-time effort to this open-source work.
3.  **Achieve Standardization**: Help push this library closer to becoming a de-facto standard for TS/JS developers worldwide.

Thank you for supporting open source and high-performance software engineering!