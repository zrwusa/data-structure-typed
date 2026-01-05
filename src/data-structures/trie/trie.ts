/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { ElementCallback, TrieOptions } from '../../types';
import { IterableElementBase } from '../base';

/**
 * Node used by Trie to store one character and its children.
 * @remarks Time O(1), Space O(1)
 */
export class TrieNode {
  /**
   * Create a Trie node with a character key.
   * @remarks Time O(1), Space O(1)
   * @returns New TrieNode instance.
   */

  constructor(key: string) {
    this._key = key;
    this._isEnd = false;
    this._children = new Map<string, TrieNode>();
  }

  protected _key: string;

  /**
   * Get the character key of this node.
   * @remarks Time O(1), Space O(1)
   * @returns Character key string.
   */

  get key(): string {
    return this._key;
  }

  /**
   * Set the character key of this node.
   * @remarks Time O(1), Space O(1)
   * @param value - New character key.
   * @returns void
   */

  set key(value: string) {
    this._key = value;
  }

  protected _children: Map<string, TrieNode>;

  /**
   * Get the child map of this node.
   * @remarks Time O(1), Space O(1)
   * @returns Map from character to child node.
   */

  get children(): Map<string, TrieNode> {
    return this._children;
  }

  /**
   * Replace the child map of this node.
   * @remarks Time O(1), Space O(1)
   * @param value - New map of character → node.
   * @returns void
   */

  set children(value: Map<string, TrieNode>) {
    this._children = value;
  }

  protected _isEnd: boolean;

  /**
   * Check whether this node marks the end of a word.
   * @remarks Time O(1), Space O(1)
   * @returns True if this node ends a word.
   */

  get isEnd(): boolean {
    return this._isEnd;
  }

  /**
   * Mark this node as the end of a word or not.
   * @remarks Time O(1), Space O(1)
   * @param value - Whether this node ends a word.
   * @returns void
   */

  set isEnd(value: boolean) {
    this._isEnd = value;
  }
}

/**
 * Prefix tree (Trie) for fast prefix queries and word storage.
 * @remarks Time O(1), Space O(1)
 * @template R
 * 1. Node Structure: Each node in a Trie represents a string (or a part of a string). The root node typically represents an empty string.
 * 2. Child Node Relationship: Each node's children represent the strings that can be formed by adding one character to the string at the current node. For example, if a node represents the string 'ca', one of its children might represent 'cat'.
 * 3. Fast Retrieval: Trie allows retrieval in O(m) time complexity, where m is the length of the string to be searched.
 * 4. Space Efficiency: Trie can store a large number of strings very space-efficiently, especially when these strings share common prefixes.
 * 5. Autocomplete and Prediction: Trie can be used for implementing autocomplete and word prediction features, as it can quickly find all strings with a common prefix.
 * 6. Sorting: Trie can be used to sort a set of strings in alphabetical order.
 * 7. String Retrieval: For example, searching for a specific string in a large set of strings.
 * 8. Autocomplete: Providing recommended words or phrases as a user types.
 * 9. Spell Check: Checking the spelling of words.
 * 10. IP Routing: Used in certain types of IP routing algorithms.
 * 11. Text Word Frequency Count: Counting and storing the frequency of words in a large amount of text data.
 * @example
 * // basic Trie creation and add words
 *  // Create a simple Trie with initial words
 *     const trie = new Trie(['apple', 'app', 'apply']);
 *
 *     // Verify size
 *     console.log(trie.size); // 3;
 *
 *     // Check if words exist
 *     console.log(trie.has('apple')); // true;
 *     console.log(trie.has('app')); // true;
 *
 *     // Add a new word
 *     trie.add('application');
 *     console.log(trie.size); // 4;
 * @example
 * // Trie getWords and prefix search
 *  const trie = new Trie(['apple', 'app', 'apply', 'application', 'apricot']);
 *
 *     // Get all words with prefix 'app'
 *     const appWords = trie.getWords('app');
 *     console.log(appWords); // contains 'app';
 *     console.log(appWords); // contains 'apple';
 *     console.log(appWords); // contains 'apply';
 *     console.log(appWords); // contains 'application';
 *     expect(appWords).not.toContain('apricot');
 * @example
 * // Trie isPrefix and isAbsolutePrefix checks
 *  const trie = new Trie(['tree', 'trial', 'trick', 'trip', 'trie']);
 *
 *     // Check if string is a prefix of any word
 *     console.log(trie.hasPrefix('tri')); // true;
 *     console.log(trie.hasPrefix('tr')); // true;
 *     console.log(trie.hasPrefix('xyz')); // false;
 *
 *     // Check if string is an absolute prefix (not a complete word)
 *     console.log(trie.hasPurePrefix('tri')); // true;
 *     console.log(trie.hasPurePrefix('tree')); // false; // 'tree' is a complete word
 *
 *     // Verify size
 *     console.log(trie.size); // 5;
 * @example
 * // Trie delete and iteration
 *  const trie = new Trie(['car', 'card', 'care', 'careful', 'can', 'cat']);
 *
 *     // Delete a word
 *     trie.delete('card');
 *     console.log(trie.has('card')); // false;
 *
 *     // Word with same prefix still exists
 *     console.log(trie.has('care')); // true;
 *
 *     // Size decreased
 *     console.log(trie.size); // 5;
 *
 *     // Iterate through all words
 *     const allWords = [...trie];
 *     console.log(allWords.length); // 5;
 * @example
 * // Trie for autocomplete search index
 *  // Trie is perfect for autocomplete: O(m + k) where m is prefix length, k is results
 *     const searchIndex = new Trie(['typescript', 'javascript', 'python', 'java', 'rust', 'ruby', 'golang', 'kotlin']);
 *
 *     // User types 'j' - get all suggestions
 *     const jResults = searchIndex.getWords('j');
 *     console.log(jResults); // contains 'javascript';
 *     console.log(jResults); // contains 'java';
 *     console.log(jResults.length); // 2;
 *
 *     // User types 'ja' - get more specific suggestions
 *     const jaResults = searchIndex.getWords('ja');
 *     console.log(jaResults); // contains 'javascript';
 *     console.log(jaResults); // contains 'java';
 *     console.log(jaResults.length); // 2;
 *
 *     // User types 'jav' - even more specific
 *     const javResults = searchIndex.getWords('jav');
 *     console.log(javResults); // contains 'javascript';
 *     console.log(javResults); // contains 'java';
 *     console.log(javResults.length); // 2;
 *
 *     // Check for common prefix
 *
 *     console.log(searchIndex.hasCommonPrefix('ja')); // false; // Not all words start with 'ja'
 *
 *     // Total words in index
 *     console.log(searchIndex.size); // 8;
 *
 *     // Get height (depth of tree)
 *     const height = searchIndex.getHeight();
 *     console.log(typeof height); // 'number';
 * @example
 * // Dictionary: Case-insensitive word lookup
 *  // Create a case-insensitive dictionary
 *     const dictionary = new Trie<string>([], { caseSensitive: false });
 *
 *     // Add words with mixed casing
 *     dictionary.add('Hello');
 *     dictionary.add('WORLD');
 *     dictionary.add('JavaScript');
 *
 *     // Test lookups with different casings
 *     console.log(dictionary.has('hello')); // true;
 *     console.log(dictionary.has('HELLO')); // true;
 *     console.log(dictionary.has('Hello')); // true;
 *     console.log(dictionary.has('javascript')); // true;
 *     console.log(dictionary.has('JAVASCRIPT')); // true;
 * @example
 * // File System Path Operations
 *  const fileSystem = new Trie<string>([
 *       '/home/user/documents/file1.txt',
 *       '/home/user/documents/file2.txt',
 *       '/home/user/pictures/photo.jpg',
 *       '/home/user/pictures/vacation/',
 *       '/home/user/downloads'
 *     ]);
 *
 *     // Find common directory prefix
 *     console.log(fileSystem.getLongestCommonPrefix()); // '/home/user/';
 *
 *     // List all files in a directory
 *     const documentsFiles = fileSystem.getWords('/home/user/documents/');
 *     console.log(documentsFiles); // ['/home/user/documents/file1.txt', '/home/user/documents/file2.txt'];
 * @example
 * // IP Address Routing Table
 *  // Add IP address prefixes and their corresponding routes
 *     const routes = {
 *       '192.168.1': 'LAN_SUBNET_1',
 *       '192.168.2': 'LAN_SUBNET_2',
 *       '10.0.0': 'PRIVATE_NETWORK_1',
 *       '10.0.1': 'PRIVATE_NETWORK_2'
 *     };
 *
 *     const ipRoutingTable = new Trie<string>(Object.keys(routes));
 *
 *     // Check IP address prefix matching
 *     console.log(ipRoutingTable.hasPrefix('192.168.1')); // true;
 *     console.log(ipRoutingTable.hasPrefix('192.168.2')); // true;
 *
 *     // Validate IP address belongs to subnet
 *     const ip = '192.168.1.100';
 *     const subnet = ip.split('.').slice(0, 3).join('.');
 *     console.log(ipRoutingTable.hasPrefix(subnet)); // true;
 */
export class Trie<R = any> extends IterableElementBase<string, R> {
  /**
   * Create a Trie and optionally bulk-insert words.
   * @remarks Time O(totalChars), Space O(totalChars)
   * @param [words] - Iterable of strings (or raw records if toElementFn is provided).
   * @param [options] - Options such as toElementFn and caseSensitive.
   * @returns New Trie instance.
   */

  constructor(words: Iterable<string> | Iterable<R> = [], options?: TrieOptions<R>) {
    super(options);
    if (options) {
      const { caseSensitive } = options;
      if (caseSensitive !== undefined) this._caseSensitive = caseSensitive;
    }
    if (words) {
      this.addMany(words);
    }
  }

  protected _size: number = 0;

  /**
   * Get the number of stored words.
   * @remarks Time O(1), Space O(1)
   * @returns Word count.
   */

  get size(): number {
    return this._size;
  }

  protected _caseSensitive: boolean = true;

  /**
   * Get whether comparisons are case-sensitive.
   * @remarks Time O(1), Space O(1)
   * @returns True if case-sensitive.
   */

  get caseSensitive(): boolean {
    return this._caseSensitive;
  }

  protected _root: TrieNode = new TrieNode('');

  /**
   * Get the root node.
   * @remarks Time O(1), Space O(1)
   * @returns Root TrieNode.
   */

  get root() {
    return this._root;
  }

  /**
   * (Protected) Get total count for base class iteration.
   * @remarks Time O(1), Space O(1)
   * @returns Total number of elements.
   */

  protected get _total() {
    return this._size;
  }

  /**
   * Insert one word into the trie.
   * @remarks Time O(L), Space O(L)
   * @param word - Word to insert.
   * @returns True if the word was newly added.
   */

  add(word: string): boolean {
    word = this._caseProcess(word);
    let cur = this.root;
    let isNewWord = false;
    for (const c of word) {
      let nodeC = cur.children.get(c);
      if (!nodeC) {
        nodeC = new TrieNode(c);
        cur.children.set(c, nodeC);
      }
      cur = nodeC;
    }
    if (!cur.isEnd) {
      isNewWord = true;
      cur.isEnd = true;
      this._size++;
    }
    return isNewWord;
  }

  /**
   * Insert many words from an iterable.
   * @remarks Time O(ΣL), Space O(ΣL)
   * @param words - Iterable of strings (or raw records if toElementFn is provided).
   * @returns Array of per-word 'added' flags.
   */

  addMany(words: Iterable<string> | Iterable<R>): boolean[] {
    const ans: boolean[] = [];
    for (const word of words) {
      if (this.toElementFn) {
        ans.push(this.add(this.toElementFn(word as R)));
      } else {
        ans.push(this.add(word as string));
      }
    }
    return ans;
  }

  /**
   * Check whether a word exists.
   * @remarks Time O(L), Space O(1)
   * @param word - Word to search for.
   * @returns True if present.
   */

  override has(word: string): boolean {
    word = this._caseProcess(word);
    let cur = this.root;
    for (const c of word) {
      const nodeC = cur.children.get(c);
      if (!nodeC) return false;
      cur = nodeC;
    }
    return cur.isEnd;
  }

  /**
   * Check whether the trie is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if size is 0.
   */

  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Remove all words and reset to a fresh root.
   * @remarks Time O(1), Space O(1)
   * @returns void
   */

  clear(): void {
    this._size = 0;
    this._root = new TrieNode('');
  }

  /**
   * Delete one word if present.
   * @remarks Time O(L), Space O(1)
   * @param word - Word to delete.
   * @returns True if a word was removed.
   */

  delete(word: string): boolean {
    word = this._caseProcess(word);
    let isDeleted = false;
    const dfs = (cur: TrieNode, i: number): boolean => {
      const char = word[i];
      const child = cur.children.get(char);
      if (child) {
        if (i === word.length - 1) {
          if (child.isEnd) {
            if (child.children.size > 0) {
              child.isEnd = false;
            } else {
              cur.children.delete(char);
            }
            isDeleted = true;
            return true;
          }
          return false;
        }
        const res = dfs(child, i + 1);
        if (res && !cur.isEnd && child.children.size === 0) {
          cur.children.delete(char);
          return true;
        }
        return false;
      }
      return false;
    };

    dfs(this.root, 0);
    if (isDeleted) {
      this._size--;
    }
    return isDeleted;
  }

  /**
   * Compute the height (max depth) of the trie.
   * @remarks Time O(N), Space O(H)
   * @returns Maximum depth from root to a leaf.
   */

  getHeight(): number {
    const startNode = this.root;
    let maxDepth = 0;
    if (startNode) {
      const bfs = (node: TrieNode, level: number) => {
        if (level > maxDepth) {
          maxDepth = level;
        }
        const { children } = node;
        if (children) {
          for (const child of children.entries()) {
            bfs(child[1], level + 1);
          }
        }
      };
      bfs(startNode, 0);
    }
    return maxDepth;
  }

  /**
   * Check whether input is a proper prefix of at least one word.
   * @remarks Time O(L), Space O(1)
   * @param input - String to test as prefix.
   * @returns True if input is a prefix but not a full word.
   */

  hasPurePrefix(input: string): boolean {
    input = this._caseProcess(input);
    let cur = this.root;
    for (const c of input) {
      const nodeC = cur.children.get(c);
      if (!nodeC) return false;
      cur = nodeC;
    }
    return !cur.isEnd;
  }

  /**
   * Check whether any word starts with input.
   * @remarks Time O(L), Space O(1)
   * @param input - String to test as prefix.
   * @returns True if input matches a path from root.
   */

  hasPrefix(input: string): boolean {
    input = this._caseProcess(input);
    let cur = this.root;
    for (const c of input) {
      const nodeC = cur.children.get(c);
      if (!nodeC) return false;
      cur = nodeC;
    }
    return true;
  }

  /**
   * Check whether the trie’s longest common prefix equals input.
   * @remarks Time O(min(H,L)), Space O(1)
   * @param input - Candidate longest common prefix.
   * @returns True if input equals the common prefix.
   */

  hasCommonPrefix(input: string): boolean {
    input = this._caseProcess(input);
    let commonPre = '';
    const dfs = (cur: TrieNode) => {
      commonPre += cur.key;
      if (commonPre === input) return;
      if (cur.isEnd) return;
      if (cur && cur.children && cur.children.size === 1) dfs(Array.from(cur.children.values())[0]);
      else return;
    };
    dfs(this.root);
    return commonPre === input;
  }

  /**
   * Return the longest common prefix among all words.
   * @remarks Time O(H), Space O(1)
   * @returns The longest common prefix string.
   */

  getLongestCommonPrefix(): string {
    let commonPre = '';
    const dfs = (cur: TrieNode) => {
      commonPre += cur.key;
      if (cur.isEnd) return;
      if (cur && cur.children && cur.children.size === 1) dfs(Array.from(cur.children.values())[0]);
      else return;
    };
    dfs(this.root);
    return commonPre;
  }

  /**
   * Collect words under a prefix up to a maximum count.
   * @remarks Time O(K·L), Space O(K·L)
   * @param [prefix] - Prefix to match; default empty string for root.
   * @param [max] - Maximum number of words to return; default is Number.MAX_SAFE_INTEGER.
   * @param [isAllWhenEmptyPrefix] - When true, collect from root even if prefix is empty.
   * @returns Array of collected words (at most max).
   */

  getWords(prefix = '', max = Number.MAX_SAFE_INTEGER, isAllWhenEmptyPrefix = false): string[] {
    prefix = this._caseProcess(prefix);
    const words: string[] = [];
    let found = 0;

    function dfs(node: TrieNode, word: string) {
      for (const char of node.children.keys()) {
        const charNode = node.children.get(char);
        if (charNode !== undefined) {
          dfs(charNode, word.concat(char));
        }
      }
      if (node.isEnd) {
        if (found > max - 1) return;
        words.push(word);
        found++;
      }
    }

    let startNode = this.root;

    if (prefix) {
      for (const c of prefix) {
        const nodeC = startNode.children.get(c);
        if (nodeC) {
          startNode = nodeC;
        } else {
          return [];
        }
      }
    }

    if (isAllWhenEmptyPrefix || startNode !== this.root) dfs(startNode, prefix);

    return words;
  }

  /**
   * Deep clone this trie by iterating and inserting all words.
   * @remarks Time O(ΣL), Space O(ΣL)
   * @returns A new trie with the same words and options.
   */

  clone(): this {
    const next = this._createInstance();
    for (const x of this) next.add(x);
    return next;
  }

  /**
   * Filter words into a new trie of the same class.
   * @remarks Time O(ΣL), Space O(ΣL)
   * @param predicate - Predicate (word, index, trie) → boolean to keep word.
   * @param [thisArg] - Value for `this` inside the predicate.
   * @returns A new trie containing words that satisfy the predicate.
   */

  filter(predicate: ElementCallback<string, R, boolean>, thisArg?: any): this {
    const results = this._createInstance();
    let index = 0;
    for (const word of this) {
      if (predicate.call(thisArg, word, index, this)) {
        results.add(word);
      }
      index++;
    }
    return results;
  }

  map<RM>(callback: ElementCallback<string, R, string>, options?: TrieOptions<RM>, thisArg?: any): Trie<RM>;

  /**
   * Map words into a new trie (possibly different record type).
   * @remarks Time O(ΣL), Space O(ΣL)
   * @template EM
   * @template RM
   * @param callback - Mapping function (word, index, trie) → newWord (string).
   * @param [options] - Options for the output trie (e.g., toElementFn, caseSensitive).
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new Trie constructed from mapped words.
   */

  map<EM, RM>(
    callback: ElementCallback<string, R, EM>,
    options?: TrieOptions<RM>,
    thisArg?: any
  ): IterableElementBase<EM, RM>;

  map<EM, RM>(callback: ElementCallback<string, R, EM>, options?: TrieOptions<RM>, thisArg?: any): any {
    const newTrie = this._createLike<RM>([], options);
    let i = 0;
    for (const x of this) {
      const v = thisArg === undefined ? callback(x, i++, this) : callback.call(thisArg, x, i++, this);
      if (typeof v !== 'string') {
        throw new TypeError(`Trie.map callback must return string; got ${typeof v}`);
      }
      newTrie.add(v);
    }
    return newTrie;
  }

  /**
   * Map words into a new trie of the same element type.
   * @remarks Time O(ΣL), Space O(ΣL)
   * @param callback - Mapping function (word, index, trie) → string.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new trie with mapped words.
   */

  mapSame(callback: ElementCallback<string, R, string>, thisArg?: any): this {
    const next = this._createInstance();
    let i = 0;
    for (const key of this) {
      const mapped = thisArg === undefined ? callback(key, i++, this) : callback.call(thisArg, key, i++, this);
      next.add(mapped);
    }
    return next;
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind trie instance.
   */

  protected _createInstance(options?: TrieOptions<R>): this {
    const Ctor: any = this.constructor;
    const next: any = new Ctor([], {
      toElementFn: this.toElementFn,
      caseSensitive: this.caseSensitive,
      ...(options ?? {})
    });
    return next as this;
  }

  /**
   * (Protected) Create a like-kind trie and seed it from an iterable.
   * @remarks Time O(ΣL), Space O(ΣL)
   * @template RM
   * @param [elements] - Iterable used to seed the new trie.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind Trie instance.
   */

  protected _createLike<RM>(elements: Iterable<string> | Iterable<RM> = [], options?: TrieOptions<RM>): Trie<RM> {
    const Ctor: any = this.constructor;
    return new Ctor(elements, options) as Trie<RM>;
  }

  /**
   * (Protected) Spawn an empty like-kind trie instance.
   * @remarks Time O(1), Space O(1)
   * @template RM
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind Trie instance.
   */

  protected _spawnLike<RM>(options?: TrieOptions<RM>): Trie<RM> {
    return this._createLike<RM>([], options);
  }

  /**
   * (Protected) Iterate all words in lexicographic order of edges.
   * @remarks Time O(ΣL), Space O(H)
   * @returns Iterator of words.
   */

  protected *_getIterator(): IterableIterator<string> {
    function* _dfs(node: TrieNode, path: string): IterableIterator<string> {
      if (node.isEnd) {
        yield path;
      }
      for (const [char, childNode] of node.children) {
        yield* _dfs(childNode, path + char);
      }
    }

    yield* _dfs(this.root, '');
  }

  /**
   * (Protected) Normalize a string according to case sensitivity.
   * @remarks Time O(L), Space O(L)
   * @param str - Input string to normalize.
   * @returns Normalized string based on caseSensitive.
   */

  protected _caseProcess(str: string) {
    if (!this._caseSensitive) {
      str = str.toLowerCase();
    }
    return str;
  }
}
