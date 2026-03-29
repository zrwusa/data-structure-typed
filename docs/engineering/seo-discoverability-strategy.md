# data-structure-typed Search Discoverability Strategy
## For Search Engines and AI Systems

The main goal is **not just to make more people search for the project name**.  
The real goal is:

> Make `data-structure-typed` easier to discover when developers search for real problems.

Most developers do **not** search for a library by name first.  
They usually search by:

- the problem they are trying to solve
- the data structure they need
- a specific use case
- an API capability
- an alternative to an existing approach
- a comparison between two options

So the SEO / discoverability strategy for `data-structure-typed` should focus on:

1. **problem-driven keywords**
2. **technology / structure keywords**
3. **use-case keywords**
4. **API capability keywords**
5. **comparison keywords**
6. **brand keywords**

---

## 1. What developers are likely to search for

### Problem-based searches

Developers often search by problem, not by library name.

Examples:

- typescript priority queue
- javascript deque
- typescript red black tree
- sorted map in typescript
- ordered set javascript
- typescript trie
- graph data structure typescript
- tree map javascript
- range query data structure ts
- getRank/getByRank data structure javascript

---

### Alternative-based searches

When native tools start feeling awkward, developers search for alternatives.

Examples:

- better alternative to array for sorted insert
- map vs object vs tree map javascript
- typescript data structures library
- javascript algorithms and data structures library
- npm sorted set
- npm priority queue typescript

---

### Use-case / scenario-based searches

A lot of searches come from actual business or application scenarios.

Examples:

- leaderboard data structure typescript
- task scheduler priority queue ts
- autocomplete trie typescript
- nearest rank query javascript
- interval merge structure ts
- pagination by rank tree map

---

### API capability searches

Some users search for a specific capability rather than a structure name.

Examples:

- getRank(key)
- getByRank(k)
- lowerBound upperBound typescript
- rangeByRank
- iterator-friendly data structures
- immutable vs mutable ordered collection js

---

### Comparison searches

Developers love searching for comparisons.

Examples:

- best typescript data structure library
- data-structure-typed vs collections-js
- js-sdsl alternative
- why not use array for sorted data
- red black tree vs heap for ranking

---

## 2. Keyword clusters that `data-structure-typed` should cover

### Category keywords

- typescript data structures
- javascript data structures library
- npm data structure library
- typed data structures

### Specific data structure keywords

- deque typescript
- heap typescript
- priority queue typescript
- red black tree typescript
- tree map javascript
- tree set javascript
- trie typescript
- linked list typescript
- graph typescript

### Capability keywords

- getRank query typescript
- select kth element javascript
- lower bound upper bound typescript
- ordered iteration javascript
- range search tree map

### Native Array / Map alternative keywords

- sorted insert without array sort
- ordered map alternative javascript
- when array is slow for sorted data
- better than map for ordered keys

### Use-case keywords

- leaderboard
- scheduler
- autocomplete
- cache
- routing graph
- top k
- sliding window
- frequency counter

### Learning / educational keywords

- data structures in typescript
- learn tree map javascript
- red black tree explained with typescript
- heap examples ts

### Comparison keywords

- array vs heap
- map vs tree map
- set vs tree set
- heap vs red black tree
- data-structure-typed vs js-sdsl

### Brand keywords

- data-structure-typed
- data structure typed
- zrwusa data structure library

---

## 3. High-value long-tail keywords

Broad keywords are hard to win.  
Long-tail keywords are usually more valuable because they reflect stronger intent.

Recommended long-tail targets:

- how to implement priority queue in typescript
- best ordered set for javascript
- typescript library for red black tree
- how to do rank query in javascript
- get kth smallest element in tree typescript
- sorted pagination by rank
- alternative to repeatedly sorting arrays in react
- efficient leaderboard data structure ts
- autocomplete using trie in typescript
- interval scheduling with heap in ts

These are especially valuable because the library is not just “a bunch of structures” — it is also a practical solution to real engineering problems.

---

## 4. What content the project should add or improve

### A. Problem-oriented landing pages

Do not rely only on API reference pages.  
Create pages that match real search intent.

Recommended pages:

- When Array + sort becomes too slow
- How to build a leaderboard in TypeScript
- TreeMap / TreeSet in JavaScript
- Priority Queue for schedulers and task systems
- getRank / getByRank / rangeByRank explained

These pages should not just describe classes.  
They should capture problem-oriented search traffic.

---

### B. Rewrite the README opening section

The README homepage should immediately tell both search engines and AI systems:

- what the library is
- what problems it solves
- what it provides beyond Array / Map / Set
- which use cases it fits
- which data structures it includes
- which advanced capabilities it supports

The opening should naturally include ideas like:

- TypeScript data structures library
- JavaScript data structures
- Heap / Deque / Trie / Red-Black Tree / Graph
- Ordered collections
- TreeMap / TreeSet style APIs
- Rank / Select / Range queries
- Production-ready
- Type-safe

A possible first sentence:

> A production-ready TypeScript data structures library for heaps, deques, tries, graphs, red-black trees, and TreeMap/TreeSet-style ordered collections, with support for getRank, getByRank, and rangeByRank queries.

---

### C. Improve each structure page with search-friendly language

A structure page should not contain only:

- complexity table
- raw API list
- internal terminology

Each major data structure page should include:

- What it is
- When to use it
- When not to use it
- Common use cases
- Alternatives
- Search-friendly terminology
- Example code
- Performance notes

For example:

#### RedBlackTree page
Should mention:

- TreeMap / TreeSet-style ordered collections
- ordered iteration
- getRank / getByRank / rangeByRank
- replacing repeated array sorting

#### Heap page
Should mention:

- priority queue
- scheduler
- top-k
- when heap is better than repeatedly sorting arrays

#### Trie page
Should mention:

- autocomplete
- prefix search
- dictionary matching

#### Deque page
Should mention:

- double-ended queue
- sliding window
- BFS

---

### D. Create comparison pages

Comparison pages are highly searchable.

Recommended pages:

- data-structure-typed vs native Array
- data-structure-typed vs Map / Set
- data-structure-typed vs js-sdsl
- Heap vs RedBlackTree
- Deque vs Array

Each comparison page should explain:

- use cases
- complexity differences
- developer experience differences
- when to choose A
- when to choose B
- example code
- common misunderstandings

---

### E. Improve examples / scenario pages

The examples should be titled and structured around search intent.

Recommended example page titles:

- Implement a leaderboard in TypeScript
- Build an autocomplete trie in TypeScript
- Use a heap for task scheduling
- Ordered map with range queries in JavaScript
- Efficient sorted inserts without re-sorting arrays

Each example page should include:

- the problem
- why the native solution is awkward or inefficient
- why this structure is a good fit
- full example code
- complexity discussion
- boundaries / limitations

---

## 5. AI discoverability principles

Do not treat this as fake “AI SEO.”  
The main idea is:

> Make the project easier for AI systems to understand, summarize, and cite.

### A. Have a stable, public, crawlable documentation site

A public docs site is usually better than relying only on GitHub README.

Requirements:

- public
- stable URLs
- crawlable
- readable without heavy client-side rendering
- clear page structure

---

### B. Make titles and first paragraphs extremely clear

AI systems often rely heavily on:

- page title
- H1
- first paragraph
- FAQ sections
- headings
- code examples with surrounding explanation

Each page should explain early:

- what this page is about
- what problem it solves
- how this structure / concept is used

---

### C. Create an FAQ page

FAQ pages are very useful for both search and AI summarization.

Recommended questions:

- Does JavaScript have TreeMap?
- When should I use a heap instead of sorting an array?
- Does this library support getRank/getByRank?
- Is it faster than native arrays for ordered operations?
- Can I use it in React / Node.js / browser?
- What data structures are included?
- Is this suitable for production?
- What is the difference between TreeMap-style collections and Map?

---

### D. Add `llms.txt`

This is an enhancement, not the core strategy.

Suggested use:

- project summary
- core docs entry points
- FAQ page
- terminology page
- use case pages
- comparison pages

Do not rely on `llms.txt` alone, but it can help.

---

### E. Keep terminology consistent

If the docs use multiple related terms like:

- TreeMap
- ordered map
- sorted map
- RB-tree-based map

Then clearly explain how they relate.

Inconsistent terminology makes AI summaries weaker and confuses human readers too.

---

## 6. README improvements to prioritize

The README should include or strengthen the following sections.

### Opening definition

Clearly define the library in one strong paragraph.

### Why this library / Who should use this

Use problem-based phrasing, for example:

You may need this library if:

- You repeatedly sort arrays after every insert
- You need a priority queue in TypeScript
- You need ordered iteration, rank, or range queries
- You want TreeMap / TreeSet-like behavior in JavaScript
- You want type-safe, production-ready data structures
- You want better tools than native Array / Map / Set for specific workloads

### “You may be looking for” section

This can naturally include common search terms:

- priority queue
- deque
- TreeMap
- TreeSet
- red-black tree
- trie
- ordered set
- sorted map
- getRank query
- kth element
- range query
- graph data structure in TypeScript

### Alias / search-term mapping for key structures

Examples:

- RedBlackTree → TreeMap / TreeSet-style ordered collections
- Heap → priority queue / top-k / scheduler
- Trie → autocomplete / prefix search
- Deque → double-ended queue / sliding window
- subtree-size-based ordered tree → getRank / getByRank / kth element

---

## 7. Technical SEO basics that should be checked

Even strong content needs basic technical discoverability.

Check:

- docs site exists and is crawlable
- sitemap.xml exists
- robots.txt exists
- pages have unique titles
- pages have reasonable meta descriptions
- canonical URLs are set
- Open Graph metadata exists
- Twitter metadata exists
- important pages are statically readable
- URL slugs are human-friendly

Recommended slug examples:

- `/priority-queue-typescript`
- `/treemap-javascript`
- `/leaderboard-typescript`
- `/rank-select-range-query`
- `/heap-vs-sorting-array`

These are usually better than internal class-name-only slugs.

---

## 8. Recommended content production order

### Phase 1: Core discoverability foundation

1. Rewrite the README opening
2. Improve docs homepage structure
3. Standardize terminology
4. Build a keyword map
5. Improve internal linking

### Phase 2: High-value content pages

6. Add FAQ page
7. Add Use Cases section
8. Add Comparison pages
9. Rewrite major structure pages
10. Improve example page titles and structure

### Phase 3: Long-tail traffic pages

11. Publish 5 problem-oriented pages
12. Publish 3–5 scenario pages
13. Publish 3 comparison pages
14. Add `llms.txt`
15. Submit site to search tools and monitor results

---

## 9. Highest-priority page ideas

### Problem pages

- When array + sort becomes too slow
- How to implement a priority queue in TypeScript
- TreeMap / TreeSet in JavaScript
- How to do rank queries in JavaScript
- Efficient sorted inserts without re-sorting arrays

### Scenario pages

- Build a leaderboard in TypeScript
- Build autocomplete with a trie in TypeScript
- Use a heap for scheduling tasks
- Ordered map with range queries
- Sliding window with deque

### Comparison pages

- Array vs Heap
- Map vs TreeMap
- Set vs TreeSet
- Heap vs RedBlackTree
- data-structure-typed vs js-sdsl

---

## 10. Strategy principles

### Do this

- write for real developer intent
- use practical examples
- keep titles close to real search language
- build strong internal links
- make each page focused
- naturally include related terms and synonyms

### Do not do this

- keyword stuffing
- dumping all structures on one page
- writing only API docs without use cases
- using author-only jargon
- publishing many low-quality near-duplicate pages

---

## 11. The final objective

The real win is not ranking for a vague giant keyword like “data structure.”

The better goal is to consistently show up for high-intent searches such as:

- typescript priority queue
- tree map javascript
- ordered set javascript
- red black tree typescript
- getRank query javascript
- leaderboard data structure typescript
- autocomplete trie typescript
- alternative to sorting array every insert
- js-sdsl alternative
- production-ready data structures typescript

In other words:

> The objective is to make `data-structure-typed` easier to discover, understand, and try when developers have real engineering needs.

---

## 12. A direct execution prompt for OpenClaw / Claude

You can give this directly to your agent:

---

You are tasked with improving the search discoverability and AI discoverability of the `data-structure-typed` project.

Your goal is not just to improve brand visibility, but to make the project easier to discover when developers search for real problems, such as priority queues, ordered maps, TreeMap/TreeSet-like collections, getRank/getByRank queries, range queries, tries, deques, or alternatives to repeatedly sorting arrays.

Please complete the work in phases:

1. Audit the current README, docs, examples, and site structure.
2. Build a keyword strategy, including:
   - category keywords
   - structure keywords
   - capability keywords
   - comparison keywords
   - long-tail problem keywords
3. Rewrite the README intro and top sections so they clearly communicate:
   - what the library is
   - what problems it solves
   - which data structures it includes
   - which common search intents it matches
4. Design or revise the docs architecture to include:
   - Overview
   - Data Structures
   - Use Cases
   - Comparisons
   - FAQ
   - Examples
5. Create or draft high-value pages such as:
   - priority queue in TypeScript
   - TreeMap / TreeSet in JavaScript
   - getRank/getByRank/range query explanation
   - leaderboard implementation
   - autocomplete with trie
   - array vs heap
   - map vs TreeMap
6. Make the content AI-friendly:
   - strong page titles
   - clear H1/H2 structure
   - concise first-paragraph definitions
   - terminology consistency
   - FAQ coverage
   - llms.txt draft
7. Audit technical SEO basics:
   - sitemap.xml
   - robots.txt
   - canonical URLs
   - meta descriptions
   - Open Graph
   - crawlable/static content
8. Output:
   - an action plan
   - rewritten README sections
   - proposed docs tree
   - proposed page titles and URLs
   - content drafts for the highest-priority pages
   - technical issues found and recommended fixes

Important constraints:
- Write naturally for developers.
- Do not keyword-stuff.
- Keep terminology consistent.
- Focus on search intent, not just library branding.
- Prioritize pages that solve real developer problems.

---

## 13. Additional Channels (supplementary)

### A. npm Search Optimization

npm search ranks by: package name > `description` > `keywords` > README content.

**`keywords` in package.json** should include high-search-volume terms not yet covered:

- `sorted map`, `sorted set`
- `skip list`, `segment tree`, `binary indexed tree`, `fenwick tree`, `matrix`
- `rank query`, `range query`, `order statistic tree`
- `zero dependency`, `production ready`
- `treemap javascript`, `treeset javascript`

**`description` field** should be a concise, keyword-rich sentence. It appears directly in npm search results and is the first thing developers read.

### B. GitHub Topics

GitHub repo topics are indexed by Google and influence GitHub Explore recommendations.

Recommended topics:

- `data-structures`, `typescript`, `javascript`
- `binary-tree`, `red-black-tree`, `heap`, `priority-queue`
- `trie`, `graph`, `deque`, `linked-list`, `hash-map`
- `tree-map`, `tree-set`, `sorted-collections`
- `zero-dependencies`, `leetcode`

### C. StackOverflow Presence

StackOverflow answers rank extremely well on Google for programming queries. High-value questions to answer with code examples referencing the library:

- "How to implement a priority queue in JavaScript/TypeScript?"
- "Is there a TreeMap equivalent in JavaScript?"
- "How to find the kth largest element efficiently in JavaScript?"
- "Sorted set / ordered set in JavaScript?"
- "Trie implementation for autocomplete in TypeScript?"

Rules:
- The answer must genuinely solve the problem first
- Library reference should be natural, not spammy
- Include runnable code, not just a link

### D. npm README as Discovery Surface

Many developers discover libraries on the npm package page, not GitHub. The npm README is often the first impression. Ensure:

- Opening paragraph is immediately clear (what + why + who)
- Install command is visible early
- A quick "hello world" example appears within the first screen
- Badge row includes: npm version, downloads, bundle size, license

### E. Bundle Size Visibility

Developers check bundle size before adopting. Sites like bundlephobia.com, pkg-size.dev, and bundlejs.com are indexed by Google for queries like "data-structure-typed bundle size."

Current stats worth highlighting:
- Zero dependencies
- UMD bundle: ~143KB min
- Subpath imports available (e.g., `data-structure-typed/heap` at ~36KB)
- `sideEffects: false` for tree-shaking

---
