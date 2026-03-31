# Changelog

All notable changes to this project will be documented in this file.

## References

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [`auto-changelog`](https://github.com/CookPete/auto-changelog)

## [v2.5.3](https://github.com/zrwusa/data-structure-typed/compare/v2.5.3...main) (upcoming)

## [v2.5.3](https://github.com/zrwusa/data-structure-typed/compare/v2.5.1...v2.5.3) (31 March 2026)

## [v2.5.1](https://github.com/zrwusa/data-structure-typed/compare/v2.5.0...v2.5.1) (28 March 2026)

## [v2.5.0](https://github.com/zrwusa/data-structure-typed/compare/v2.4.3...v2.5.0) (27 March 2026)

### Changes

- fix(binary-tree): null nodes no longer count toward size [`#70`](https://github.com/zrwusa/data-structure-typed/pull/70)
- feat(graph): add biconnected components and cycle detection for undirected graph [`#77`](https://github.com/zrwusa/data-structure-typed/pull/77)
- fix(rbt): override perfectlyBalance to preserve RBT invariants [`#79`](https://github.com/zrwusa/data-structure-typed/pull/79)
- feat(bst): support Date keys in default comparator [`#107`](https://github.com/zrwusa/data-structure-typed/pull/107)
- refactor(binary-tree): iterative _displayAux to prevent stack overflow on deep trees [`#104`](https://github.com/zrwusa/data-structure-typed/pull/104)
- fix(binary-tree): leaves() iterative mode uses DFS stack to match recursive order [`#102`](https://github.com/zrwusa/data-structure-typed/pull/102)
- refactor: migrate all throw sites to ERR message templates [`#130`](https://github.com/zrwusa/data-structure-typed/pull/130)
- refactor: lightweight centralized error messages via ERR templates [`#130`](https://github.com/zrwusa/data-structure-typed/pull/130)
- feat: centralized error handling with DSTError/DSTRangeError/DSTTypeError [`#130`](https://github.com/zrwusa/data-structure-typed/pull/130)
- refactor(deque): improve auto-compact with counter + element-based ratio [`#92`](https://github.com/zrwusa/data-structure-typed/pull/92)
- perf(deque): optimize auto-compact with counter-based checking and element ratio [`#92`](https://github.com/zrwusa/data-structure-typed/pull/92)
- feat(deque): add compact() method and autoCompactRatio option [`#92`](https://github.com/zrwusa/data-structure-typed/pull/92)
- fix(deque): add constructor overloads for better type inference [`#97`](https://github.com/zrwusa/data-structure-typed/pull/97)
- test(graph): add edge case tests for visual output [`#113`](https://github.com/zrwusa/data-structure-typed/pull/113)
- test(graph): add visual output tests for DirectedGraph and UndirectedGraph [`#113`](https://github.com/zrwusa/data-structure-typed/pull/113)
- feat(graph): add print, toVisual, and toDot methods for all graphs [`#113`](https://github.com/zrwusa/data-structure-typed/pull/113)
- fix(hash-map): deleteAt/deleteWhere now removes entry from hash table [`#99`](https://github.com/zrwusa/data-structure-typed/pull/99)
- fix(deque): shrinkToFit now updates _bucketCount and handles single-bucket case [`#98`](https://github.com/zrwusa/data-structure-typed/pull/98)

## [v2.4.3](https://github.com/zrwusa/data-structure-typed/compare/v2.2.3...v2.4.3) (3 March 2026)

## [v2.2.3](https://github.com/zrwusa/data-structure-typed/compare/v2.2.2...v2.2.3) (6 January 2026)

## [v2.2.2](https://github.com/zrwusa/data-structure-typed/compare/v2.0.4...v2.2.2) (5 January 2026)

### Changes

- Fix ESM build [`#125`](https://github.com/zrwusa/data-structure-typed/pull/125)

## [v2.0.4](https://github.com/zrwusa/data-structure-typed/compare/v1.51.5...v2.0.4) (7 May 2025)

### Changes

- docs(queue): fix mismatch between typings and jsdoc [`#95`](https://github.com/zrwusa/data-structure-typed/pull/95)
- fix(trie): trie returns invalid string when only the fist character m… [`#94`](https://github.com/zrwusa/data-structure-typed/pull/94)

## [v1.51.5](https://github.com/zrwusa/data-structure-typed/compare/v1.35.0...v1.51.5) (18 January 2024)

### Changes

- Tests for DirectedGraph.tarjan [`#69`](https://github.com/zrwusa/data-structure-typed/pull/69)
- Rbtree [`#31`](https://github.com/zrwusa/data-structure-typed/pull/31)
- [graph test] edge cases enriched [`#30`](https://github.com/zrwusa/data-structure-typed/pull/30)
- [graph] Modify the data structure design of the graph to change the g… [`#29`](https://github.com/zrwusa/data-structure-typed/pull/29)
- Optimization [`#23`](https://github.com/zrwusa/data-structure-typed/pull/23)
- Optimization [`#20`](https://github.com/zrwusa/data-structure-typed/pull/20)
- [binary-tree, graph] Replace all code that uses Arrays as makeshift Q… [`#18`](https://github.com/zrwusa/data-structure-typed/pull/18)
- 1. No need for dfsIterative; integrate it directly into the dfs metho… [`#17`](https://github.com/zrwusa/data-structure-typed/pull/17)
- [heap] fibonacci heap implemented. [test] big O estimate. [project] n… [`#15`](https://github.com/zrwusa/data-structure-typed/pull/15)
- [rbtree] implemented, but with bugs [`#13`](https://github.com/zrwusa/data-structure-typed/pull/13)
- [trie] renamed ambiguous methods and add comments to all methods. [`#12`](https://github.com/zrwusa/data-structure-typed/pull/12)
- [binarytree] modified the getDepth method to adhere to the proper def… [`#11`](https://github.com/zrwusa/data-structure-typed/pull/11)
- Trie [`#10`](https://github.com/zrwusa/data-structure-typed/pull/10)
- [tree] getHeight returns faulty height bug fixed [`#9`](https://github.com/zrwusa/data-structure-typed/pull/9)
- [trie] support casesensitivity. getWords bug fixed [`#8`](https://github.com/zrwusa/data-structure-typed/pull/8)
- [binary-tree, graph] In order to optimize the design of Binary Trees,… [`#7`](https://github.com/zrwusa/data-structure-typed/pull/7)
- [BinaryTree, Heap] In abstract classes, only retain abstract methods.… [`#6`](https://github.com/zrwusa/data-structure-typed/pull/6)
- [heap] test [`#5`](https://github.com/zrwusa/data-structure-typed/pull/5)
- [heap, priority queue] Heap improved. References #123: redesigned [`#4`](https://github.com/zrwusa/data-structure-typed/pull/4)
- test [`#3`](https://github.com/zrwusa/data-structure-typed/pull/3)

## [v1.35.0](https://github.com/zrwusa/data-structure-typed/compare/v1.34.1...v1.35.0) (11 October 2023)

## [v1.34.1](https://github.com/zrwusa/data-structure-typed/compare/v1.33.4...v1.34.1) (6 October 2023)

## [v1.33.4](https://github.com/zrwusa/data-structure-typed/compare/v1.33.3...v1.33.4) (26 September 2023)

## [v1.33.3](https://github.com/zrwusa/data-structure-typed/compare/v1.12.9...v1.33.3) (26 September 2023)

## [v1.12.9](https://github.com/zrwusa/data-structure-typed/compare/v1.12.8...v1.12.9) (14 August 2023)

## [v1.12.8](https://github.com/zrwusa/data-structure-typed/compare/v1.3.6...v1.12.8) (14 August 2023)

## v1.3.6 (21 September 2023)
