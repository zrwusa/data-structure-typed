# Changelog

All notable changes to this project will be documented in this file.

## References

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [`auto-changelog`](https://github.com/CookPete/auto-changelog)

## [v2.4.0](https://github.com/zrwusa/data-structure-typed/compare/v2.3.0...v2.4.0) (22 February 2026)

### Added

- **TreeMultiSet**: New sorted multi-set implementation using Red-Black Tree composition
- **TreeMultiMap**: Redesigned multi-map with bucket-based value storage `[K, V[]]`
- **Benchmark system**: Full benchmark pipeline with JS + C++ support, incremental updates, js-sdsl comparisons

### Changed

- **MapMode optimization**: `_store` changed from `Map<K, V>` to `Map<K, Node>` for O(1) node lookups
- **TreeMultiMap API**: Uses composition instead of inheritance, returns `[K, V[]]` for navigable methods
- **Performance docs**: Updated with comprehensive benchmark comparisons (js-sdsl, C++ STL)

### Removed

- **AVLTreeCounter**: Removed legacy counter variant
- **AVLTreeMultiMap**: Removed in favor of new TreeMultiMap design
- **TreeCounter**: Removed legacy counter variant

## [v2.3.0](https://github.com/zrwusa/data-structure-typed/compare/v2.2.3...v2.3.0) (February 2026)

### Added

- **TreeSet**: Spec-level sorted set implementation
- **TreeMap**: Spec-level sorted map implementation

## [v2.2.8](https://github.com/zrwusa/data-structure-typed/compare/v2.2.3...main) (upcoming)

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
