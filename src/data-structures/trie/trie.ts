/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { ElementCallback, TrieOptions } from '../../types';
import { IterableElementBase } from '../base';

/**
 * TrieNode represents a node in the Trie data structure. It holds a character key, a map of children nodes,
 * and a flag indicating whether it's the end of a word.
 */
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
 */
export class Trie<R = any> extends IterableElementBase<string, R, Trie<R>> {
  /**
   * The constructor function for the Trie class.
   * @param words: Iterable string Initialize the trie with a set of words
   * @param options?: TrieOptions Allow the user to pass in options for the trie
   * @return This
   */
  constructor(words: Iterable<string> | Iterable<R> = [], options?: TrieOptions<R>) {
    super(options);
    if (options) {
      const { caseSensitive } = options;
      if (caseSensitive !== undefined) this._caseSensitive = caseSensitive;
    }
    if (words) {
      for (const word of words) {
        if (this.toElementFn) {
          this.add(this.toElementFn(word as R));
        } else {
          this.add(word as string);
        }
      }
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
   */

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
   * Time Complexity: O(l), where l is the length of the input word.
   * Space Complexity: O(1) - Constant space.
   */

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
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The isEmpty function checks if the size of the queue is 0.
   * @return True if the size of the queue is 0
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

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
   */

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
   * Time Complexity: O(n), where n is the total number of nodes in the trie.
   * Space Complexity: O(1) - Constant space.
   */

  /**
   * Time Complexity: O(n), where n is the total number of nodes in the trie.
   * Space Complexity: O(1) - Constant space.
   *
   */
  getHeight(): number {
    const beginRoot = this.root;
    let maxDepth = 0;
    if (beginRoot) {
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
      bfs(beginRoot, 0);
    }
    return maxDepth;
  }

  /**
   * Time Complexity: O(l), where l is the length of the input prefix.
   * Space Complexity: O(1) - Constant space.
   */

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
   */

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
   */

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
   */

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
   */

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
        if (nodeC) startNode = nodeC;
      }
    }

    if (isAllWhenEmptyPrefix || startNode !== this.root) dfs(startNode, prefix);

    return words;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

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
   */

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
  filter(predicate: ElementCallback<string, R, boolean, Trie<R>>, thisArg?: any): Trie<R> {
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
   */

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
    callback: ElementCallback<string, R, string, Trie<R>>,
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
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `_getIterator` returns an iterable iterator that performs a depth-first search on a
   * trie data structure and yields all the paths to the end nodes.
   */
  protected* _getIterator(): IterableIterator<string> {
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
   * Time Complexity: O(l), where l is the length of the input string.
   * Space Complexity: O(1) - Constant space.
   */

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
