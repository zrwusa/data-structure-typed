/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
export class TrieNode {
    protected _value;

    constructor(v: string) {
        this._value = v;
        this._isEnd = false;
        this._children = new Map<string, TrieNode>();
    }

    protected _children: Map<string, TrieNode>;

    get children(): Map<string, TrieNode> {
        return this._children;
    }

    set children(v: Map<string, TrieNode>) {
        this._children = v;
    }

    protected _isEnd: boolean;

    get isEnd(): boolean {
        return this._isEnd;
    }

    set isEnd(v: boolean) {
        this._isEnd = v;
    }

    get val(): string {
        return this._value;
    }

    set val(v: string) {
        this._value = v;
    }
}

export class Trie {
    constructor(words?: string[]) {
        this._root = new TrieNode('');
        if (words) {
            for (const i of words) {
                this.add(i);
            }
        }
    }

    protected _root: TrieNode;

    get root() {
        return this._root;
    }

    set root(v: TrieNode) {
        this._root = v;
    }

    add(word: string): boolean {
        let cur = this._root;
        for (const c of word) {
            let nodeC = cur.children.get(c);
            if (!nodeC) {
                nodeC = new TrieNode(c);
                cur.children.set(c, nodeC);
            }
            cur = nodeC;
        }
        cur.isEnd = true;
        return true;
    }

    has(input: string): boolean {
        let cur = this._root;
        for (const c of input) {
            const nodeC = cur.children.get(c);
            if (!nodeC) return false;
            cur = nodeC;
        }
        return cur.isEnd;
    }

    remove(word: string) {
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
        }

        dfs(this.root, 0);
        return isDeleted;
    }

    // --- start additional methods ---
    /**
     * The function checks if a given input string has an absolute prefix in a tree data structure.Only can present as a prefix, not a word
     * @param {string} input - The input parameter is a string that represents the input value for the function.
     * @returns a boolean value.
     */
    isAbsPrefix(input: string): boolean {
        let cur = this._root;
        for (const c of input) {
            const nodeC = cur.children.get(c);
            if (!nodeC) return false;
            cur = nodeC;
        }
        return !cur.isEnd;
    }

    /**
     * The function checks if a given input string is a prefix of any existing string in a tree structure.Can present as a abs prefix or word
     * @param {string} input - The input parameter is a string that represents the prefix we want to check.
     * @returns a boolean value.
     */
    isPrefix(input: string): boolean {
        let cur = this._root;
        for (const c of input) {
            const nodeC = cur.children.get(c);
            if (!nodeC) return false;
            cur = nodeC;
        }
        return true;
    }

    /**
     * The function checks if the input string is a common prefix in a Trie data structure.Check if the input string is the common prefix of all the words
     * @param {string} input - The input parameter is a string that represents the common prefix that we want to check for
     * in the Trie data structure.
     * @returns a boolean value indicating whether the input string is a common prefix in the Trie data structure.
     */
    isCommonPrefix(input: string): boolean {
        let commonPre = '';
        const dfs = (cur: TrieNode) => {
            commonPre += cur.val;
            if (commonPre === input) return;
            if (cur.isEnd) return;
            if (cur && cur.children && cur.children.size === 1) dfs(Array.from(cur.children.values())[0]);
            else return;
        }
        dfs(this._root);
        return commonPre === input;
    }

    /**
     * The function `getLongestCommonPrefix` returns the longest common prefix among all the words stored in a Trie data
     * structure.
     * @returns The function `getLongestCommonPrefix` returns a string, which is the longest common prefix found in the
     * Trie.
     */
    getLongestCommonPrefix(): string {
        let commonPre = '';
        const dfs = (cur: TrieNode) => {
            commonPre += cur.val;
            if (cur.isEnd) return;
            if (cur && cur.children && cur.children.size === 1) dfs(Array.from(cur.children.values())[0]);
            else return;
        }
        dfs(this._root);
        return commonPre;
    }

    /**
     * The `getAll` function returns an array of all words in a Trie data structure that start with a given prefix.
     * @param [prefix] - The `prefix` parameter is a string that represents the prefix that we want to search for in the
     * trie. It is an optional parameter, so if no prefix is provided, it will default to an empty string.
     * @returns an array of strings.
     */
    getAll(prefix = ''): string[] {
        const words: string[] = [];

        function dfs(node: TrieNode, word: string) {
            for (const char of node.children.keys()) {
                const charNode = node.children.get(char);
                if (charNode !== undefined) {
                    dfs(charNode, word.concat(char));
                }
            }
            if (node.isEnd) {
                words.push(word);
            }
        }

        let startNode = this._root;

        if (prefix) {
            for (const c of prefix) {
                const nodeC = startNode.children.get(c);
                if (nodeC) startNode = nodeC;
            }
        }

        dfs(startNode, prefix);
        return words;
    }

    // --- end additional methods ---
}
