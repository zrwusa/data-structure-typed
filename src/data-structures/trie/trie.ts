/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { ElementCallback, TrieOptions } from '../../types';
import { IterableElementBase } from '../base';

export class TrieNode {
  constructor(key: string) {
    this._key = key;
    this._isEnd = false;
    this._children = new Map<string, TrieNode>();
  }

  protected _key: string;

  /**
   * The function returns the value of the protected variable _key.
   * @returns The value of the `_key` property, which is a string.
   */
  get key(): string {
    return this._key;
  }

  /**
   * The above function sets the value of a protected variable called "key".
   * @param {string} value - The value parameter is a string that represents the value to be assigned
   * to the key.
   */
  set key(value: string) {
    this._key = value;
  }

  protected _children: Map<string, TrieNode>;

  /**
   * The function returns the children of a TrieNode as a Map.
   * @returns The `children` property of the TrieNode object, which is a Map containing string keys and
   * TrieNode values.
   */
  get children(): Map<string, TrieNode> {
    return this._children;
  }

  /**
   * The function sets the value of the `_children` property of a TrieNode object.
   * @param value - The value parameter is a Map object that represents the children of a TrieNode. The
   * keys of the map are strings, which represent the characters that are associated with each child
   * TrieNode. The values of the map are TrieNode objects, which represent the child nodes of the
   * current TrieNode.
   */
  set children(value: Map<string, TrieNode>) {
    this._children = value;
  }

  protected _isEnd: boolean;

  /**
   * The function returns a boolean value indicating whether a certain condition is met.
   * @returns The method is returning a boolean value, specifically the value of the variable `_isEnd`.
   */
  get isEnd(): boolean {
    return this._isEnd;
  }

  /**
   * The function sets the value of the "_isEnd" property.
   * @param {boolean} value - The value parameter is a boolean value that indicates whether the current
   * state is the end state or not.
   */
  set isEnd(value: boolean) {
    this._isEnd = value;
  }
}

/**
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
 * // Autocomplete: Prefix validation and checking
 *     const autocomplete = new Trie<string>(['gmail.com', 'gmail.co.nz', 'gmail.co.jp', 'yahoo.com', 'outlook.com']);
 *
 *     // Get all completions for a prefix
 *     const gmailCompletions = autocomplete.getWords('gmail');
 *     console.log(gmailCompletions); // ['gmail.com', 'gmail.co.nz', 'gmail.co.jp']
 * @example
 * // File System Path Operations
 *     const fileSystem = new Trie<string>([
 *       '/home/user/documents/file1.txt',
 *       '/home/user/documents/file2.txt',
 *       '/home/user/pictures/photo.jpg',
 *       '/home/user/pictures/vacation/',
 *       '/home/user/downloads'
 *     ]);
 *
 *     // Find common directory prefix
 *     console.log(fileSystem.getLongestCommonPrefix()); // '/home/user/'
 *
 *     // List all files in a directory
 *     const documentsFiles = fileSystem.getWords('/home/user/documents/');
 *     console.log(documentsFiles); // ['/home/user/documents/file1.txt', '/home/user/documents/file2.txt']
 * @example
 * // Autocomplete: Basic word suggestions
 *     // Create a trie for autocomplete
 *     const autocomplete = new Trie<string>([
 *       'function',
 *       'functional',
 *       'functions',
 *       'class',
 *       'classes',
 *       'classical',
 *       'closure',
 *       'const',
 *       'constructor'
 *     ]);
 *
 *     // Test autocomplete with different prefixes
 *     console.log(autocomplete.getWords('fun')); // ['functional', 'functions', 'function']
 *     console.log(autocomplete.getWords('cla')); // ['classes', 'classical', 'class']
 *     console.log(autocomplete.getWords('con')); // ['constructor', 'const']
 *
 *     // Test with non-matching prefix
 *     console.log(autocomplete.getWords('xyz')); // []
 * @example
 * // Dictionary: Case-insensitive word lookup
 *     // Create a case-insensitive dictionary
 *     const dictionary = new Trie<string>([], { caseSensitive: false });
 *
 *     // Add words with mixed casing
 *     dictionary.add('Hello');
 *     dictionary.add('WORLD');
 *     dictionary.add('JavaScript');
 *
 *     // Test lookups with different casings
 *     console.log(dictionary.has('hello')); // true
 *     console.log(dictionary.has('HELLO')); // true
 *     console.log(dictionary.has('Hello')); // true
 *     console.log(dictionary.has('javascript')); // true
 *     console.log(dictionary.has('JAVASCRIPT')); // true
 * @example
 * // IP Address Routing Table
 *     // Add IP address prefixes and their corresponding routes
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
 *     console.log(ipRoutingTable.hasPrefix('192.168.1')); // true
 *     console.log(ipRoutingTable.hasPrefix('192.168.2')); // true
 *
 *     // Validate IP address belongs to subnet
 *     const ip = '192.168.1.100';
 *     const subnet = ip.split('.').slice(0, 3).join('.');
 *     console.log(ipRoutingTable.hasPrefix(subnet)); // true
 */
export class Trie<R = any> extends IterableElementBase<string, R> {
  /**
   * The constructor initializes a Trie data structure with optional options and words provided as
   * input.
   * @param {Iterable<string> | Iterable<R>} words - The `words` parameter in the constructor is an
   * iterable containing either strings or elements of type `R`. It is used to initialize the Trie with
   * a list of words or elements. If no `words` are provided, an empty iterable is used as the default
   * value.
   * @param [options] - The `options` parameter in the constructor is an optional object that can
   * contain configuration options for the Trie data structure. One of the options it can have is
   * `caseSensitive`, which is a boolean value indicating whether the Trie should be case-sensitive or
   * not. If `caseSensitive` is set to `
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
   * The size function returns the size of the stack.
   * @return The number of elements in the list
   */
  get size(): number {
    return this._size;
  }

  protected _caseSensitive: boolean = true;

  /**
   * The caseSensitive function is a getter that returns the value of the protected _caseSensitive property.
   * @return The value of the _caseSensitive protected variable
   */
  get caseSensitive(): boolean {
    return this._caseSensitive;
  }

  protected _root: TrieNode = new TrieNode('');

  /**
   * The root function returns the root node of the tree.
   * @return The root node
   */
  get root() {
    return this._root;
  }

  /**
   * Time Complexity: O(l), where l is the length of the word being added.
   * Space Complexity: O(l) - Each character in the word adds a TrieNode.
   *
   * Add a word to the Trie structure.
   * @param {string} word - The word to add.
   * @returns {boolean} True if the word was successfully added.
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
   * Time Complexity: O(n * l)
   * Space Complexity: O(1)
   *
   * The `addMany` function in TypeScript takes an iterable of strings or elements of type R, converts
   * them using a provided function if available, and adds them to a data structure while returning an
   * array of boolean values indicating success.
   * @param {Iterable<string> | Iterable<R>} words - The `words` parameter in the `addMany` function is
   * an iterable that contains either strings or elements of type `R`.
   * @returns The `addMany` method returns an array of boolean values indicating whether each word in
   * the input iterable was successfully added to the data structure.
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
   * Time Complexity: O(l), where l is the length of the input word.
   * Space Complexity: O(1) - Constant space.
   *
   * Check if the Trie contains a given word.
   * @param {string} word - The word to check for.
   * @returns {boolean} True if the word is present in the Trie.
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The isEmpty function checks if the size of the queue is 0.
   * @return True if the size of the queue is 0
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear function resets the size of the Trie to 0 and creates a new root TrieNode.
   */
  clear(): void {
    this._size = 0;
    this._root = new TrieNode('');
  }

  /**
   * Time Complexity: O(l), where l is the length of the word being deleted.
   * Space Complexity: O(n) - Due to the recursive DFS approach.
   *
   * Remove a word from the Trie structure.
   * @param{string} word - The word to delete.
   * @returns {boolean} True if the word was successfully removed.
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
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `getHeight` calculates the height of a trie data structure starting from the root
   * node.
   * @returns The `getHeight` method returns the maximum depth or height of the trie tree starting from
   * the root node. It calculates the depth using a breadth-first search (BFS) traversal of the trie
   * tree and returns the maximum depth found.
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
   * Time Complexity: O(l), where l is the length of the input prefix.
   * Space Complexity: O(1) - Constant space.
   *
   * Check if a given input string has an absolute prefix in the Trie, meaning it's not a complete word.
   * @param {string} input - The input string to check.
   * @returns {boolean} True if it's an absolute prefix in the Trie.
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
   * Time Complexity: O(l), where l is the length of the input prefix.
   * Space Complexity: O(1) - Constant space.
   *
   * Check if a given input string is a prefix of any existing word in the Trie, whether as an absolute prefix or a complete word.
   * @param {string} input - The input string representing the prefix to check.
   * @returns {boolean} True if it's a prefix in the Trie.
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
   * Time Complexity: O(n), where n is the total number of nodes in the trie.
   * Space Complexity: O(l), where l is the length of the input prefix.
   *
   * Check if the input string is a common prefix in the Trie, meaning it's a prefix shared by all words in the Trie.
   * @param {string} input - The input string representing the common prefix to check for.
   * @returns {boolean} True if it's a common prefix in the Trie.
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
   * Time Complexity: O(n), where n is the total number of nodes in the trie.
   * Space Complexity: O(l), where l is the length of the longest common prefix.
   *
   * Get the longest common prefix among all the words stored in the Trie.
   * @returns {string} The longest common prefix found in the Trie.
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
   * Time Complexity: O(w * l), where w is the number of words retrieved, and l is the average length of the words.
   * Space Complexity: O(w * l) - The space required for the output array.
   *
   * The `getAll` function returns an array of all words in a Trie data structure that start with a given prefix.
   * @param {string} prefix - The `prefix` parameter is a string that represents the prefix that we want to search for in the
   * trie. It is an optional parameter, so if no prefix is provided, it will default to an empty string.
   * @param {number} max - The max count of words will be found
   * @param isAllWhenEmptyPrefix - If true, when the prefix provided as '', returns all the words in the trie.
   * @returns {string[]} an array of strings.
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
          // Early return if the whole prefix is not found
          return [];
        }
      }
    }

    if (isAllWhenEmptyPrefix || startNode !== this.root) dfs(startNode, prefix);

    return words;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone` function returns a new instance of the Trie class with the same values and case
   * sensitivity as the original Trie.
   * @returns A new instance of the Trie class is being returned.
   */
  clone(): Trie<R> {
    return new Trie<R>(this, { caseSensitive: this.caseSensitive, toElementFn: this.toElementFn });
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function takes a predicate function and returns a new array containing all the
   * elements for which the predicate function returns true.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * `word`, `index`, and `this`. It should return a boolean value indicating whether the current
   * element should be included in the filtered results or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the `predicate` function. It is used when you want to bind a
   * specific object as the context for the `predicate` function. If `thisArg` is provided, it will be
   * @returns The `filter` method is returning an array of strings (`string[]`).
   */
  filter(predicate: ElementCallback<string, R, boolean>, thisArg?: any): Trie<R> {
    const results = new Trie<R>([], { toElementFn: this.toElementFn, caseSensitive: this.caseSensitive });
    let index = 0;
    for (const word of this) {
      if (predicate.call(thisArg, word, index, this)) {
        results.add(word);
      }
      index++;
    }
    return results;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new Trie by applying a callback function to each element in the
   * current Trie.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * Trie. It takes four arguments:
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * convert the raw element (`RM`) into a string representation. This can be useful if the raw element
   * is not already a string or if you want to customize how the element is converted into a string. If
   * this parameter is
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new Trie object.
   */
  map<RM>(
    callback: ElementCallback<string, R, string>,
    toElementFn?: (rawElement: RM) => string,
    thisArg?: any
  ): Trie<RM> {
    const newTrie = new Trie<RM>([], { toElementFn, caseSensitive: this.caseSensitive });
    let index = 0;
    for (const word of this) {
      newTrie.add(callback.call(thisArg, word, index, this));
      index++;
    }
    return newTrie;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `_getIterator` returns an iterable iterator that performs a depth-first search on a
   * trie data structure and yields all the paths to the end nodes.
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

  protected get _total() {
    return this._size;
  }

  /**
   * Time Complexity: O(l), where l is the length of the input string.
   * Space Complexity: O(1) - Constant space.
   *
   * @param str
   * @protected
   */
  protected _caseProcess(str: string) {
    if (!this._caseSensitive) {
      str = str.toLowerCase(); // Convert str to lowercase if case-insensitive
    }
    return str;
  }
}
