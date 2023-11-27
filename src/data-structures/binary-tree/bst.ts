/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BSTNested,
  BSTNodeKeyOrNode,
  BSTNodeNested,
  BSTOptions,
  BTNCallback,
  BTNKey,
  BTNodeExemplar,
  BTNodePureExemplar,
  Comparator
} from '../../types';
import { CP, IterationType } from '../../types';
import { BinaryTree, BinaryTreeNode } from './binary-tree';
import { IBinaryTree } from '../../interfaces';
import { Queue } from '../queue';

export class BSTNode<V = any, N extends BSTNode<V, N> = BSTNodeNested<V>> extends BinaryTreeNode<V, N> {
  override parent?: N;

  constructor(key: BTNKey, value?: V) {
    super(key, value);
    this.parent = undefined;
    this._left = undefined;
    this._right = undefined;
  }

  protected override _left?: N;

  /**
   * Get the left child node.
   */
  override get left(): N | undefined {
    return this._left;
  }

  /**
   * Set the left child node.
   * @param {N | undefined} v - The left child node.
   */
  override set left(v: N | undefined) {
    if (v) {
      v.parent = this as unknown as N;
    }
    this._left = v;
  }

  protected override _right?: N;

  /**
   * Get the right child node.
   */
  override get right(): N | undefined {
    return this._right;
  }

  /**
   * Set the right child node.
   * @param {N | undefined} v - The right child node.
   */
  override set right(v: N | undefined) {
    if (v) {
      v.parent = this as unknown as N;
    }
    this._right = v;
  }
}

/**
 * 1. Node Order: Each node's left child has a lesser value, and the right child has a greater value.
 * 2. Unique Keys: No duplicate keys in a standard BST.
 * 3. Efficient Search: Enables quick search, minimum, and maximum operations.
 * 4. Inorder Traversal: Yields nodes in ascending order.
 * 5. Logarithmic Operations: Ideal operations like insertion, deletion, and searching are O(log n) time-efficient.
 * 6. Balance Variability: Can become unbalanced; special types maintain balance.
 * 7. No Auto-Balancing: Standard BSTs don't automatically balance themselves.
 */
export class BST<V = any, N extends BSTNode<V, N> = BSTNode<V, BSTNodeNested<V>>, TREE extends BST<V, N, TREE> = BST<V, N, BSTNested<V, N>>>
  extends BinaryTree<V, N, TREE>
  implements IBinaryTree<V, N, TREE> {


  /**
   * This is the constructor function for a binary search tree class in TypeScript, which initializes
   * the tree with optional elements and options.
   * @param [elements] - An optional iterable of BTNodeExemplar objects that will be added to the
   * binary search tree.
   * @param [options] - The `options` parameter is an optional object that can contain additional
   * configuration options for the binary search tree. It can have the following properties:
   */
  constructor(elements?: Iterable<BTNodeExemplar<V, N>>, options?: Partial<BSTOptions>) {
    super([], options);

    if (options) {
      const { comparator } = options;
      if (comparator) {
        this.comparator = comparator;
      }
    }

    this._root = undefined;

    if (elements) this.addMany(elements);
  }

  protected override _root?: N;

  override get root(): N | undefined {
    return this._root;
  }

  comparator: Comparator<BTNKey> = (a, b) => a - b

  /**
   * The function creates a new binary search tree node with the given key and value.
   * @param {BTNKey} key - The key parameter is the key value that will be associated with
   * the new node. It is used to determine the position of the node in the binary search tree.
   * @param [value] - The parameter `value` is an optional value that can be assigned to the node. It
   * represents the value associated with the node in a binary search tree.
   * @returns a new instance of the BSTNode class with the specified key and value.
   */
  override createNode(key: BTNKey, value?: V): N {
    return new BSTNode<V, N>(key, value) as N;
  }

  /**
   * The function creates a new binary search tree with the specified options.
   * @param [options] - The `options` parameter is an optional object that allows you to customize the
   * behavior of the `createTree` method. It accepts a partial `BSTOptions` object, which is a type
   * that defines various options for creating a binary search tree.
   * @returns a new instance of the BST class with the specified options.
   */
  override createTree(options?: Partial<BSTOptions>): TREE {
    return new BST<V, N, TREE>([], {
      iterationType: this.iterationType,
      comparator: this.comparator, ...options
    }) as TREE;
  }

  /**
   * The function checks if an exemplar is an instance of BSTNode.
   * @param exemplar - The `exemplar` parameter is a variable of type `BTNodeExemplar<V, N>`.
   * @returns a boolean value indicating whether the exemplar is an instance of the BSTNode class.
   */
  override isNode(exemplar: BTNodeExemplar<V, N>): exemplar is N {
    return exemplar instanceof BSTNode;
  }

  /**
   * The function `exemplarToNode` takes an exemplar and returns a corresponding node if the exemplar
   * is valid, otherwise it returns undefined.
   * @param exemplar - The `exemplar` parameter is of type `BTNodeExemplar<V, N>`.
   * @returns a variable `node` which is of type `N` or `undefined`.
   */
  override exemplarToNode(exemplar: BTNodeExemplar<V, N>): N | undefined {
    let node: N | undefined;
    if (exemplar === null || exemplar === undefined) {
      return;
    } else if (this.isNode(exemplar)) {
      node = exemplar;
    } else if (this.isEntry(exemplar)) {
      const [key, value] = exemplar;
      if (key === undefined || key === null) {
        return;
      } else {
        node = this.createNode(key, value);
      }
    } else if (this.isNodeKey(exemplar)) {
      node = this.createNode(exemplar);
    } else {
      return;
    }
    return node;
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. In the worst case (unbalanced tree), it can be O(n).
   * Space Complexity: O(1) - Constant space is used.
   */

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. In the worst case (unbalanced tree), it can be O(n).
   * Space Complexity: O(1) - Constant space is used.
   *
   * The `add` function adds a new node to a binary search tree, either by key or by providing a node
   * object.
   * @param keyOrNodeOrEntry - The `keyOrNodeOrEntry` parameter can be one of the following:
   * @returns The method returns either the newly added node (`newNode`) or `undefined` if the input
   * (`keyOrNodeOrEntry`) is null, undefined, or does not match any of the expected types.
   */
  override add(keyOrNodeOrEntry: BTNodeExemplar<V, N>): N | undefined {
    const newNode = this.exemplarToNode(keyOrNodeOrEntry);
    if (newNode === undefined) return;

    if (this.root === undefined) {
      this._setRoot(newNode);
      this._size++;
      return this.root;
    }

    let current = this.root;
    while (current !== undefined) {
      if (this._compare(current.key, newNode.key) === CP.eq) {
        // if (current !== newNode) {
        // The key value is the same but the reference is different, update the value of the existing node
        this._replaceNode(current, newNode);
        return newNode;

        // } else {
        // The key value is the same and the reference is the same, replace the entire node
        // this._replaceNode(current, newNode);

        //   return;
        // }
      } else if (this._compare(current.key, newNode.key) === CP.gt) {
        if (current.left === undefined) {
          current.left = newNode;
          newNode.parent = current;
          this._size++;
          return newNode;
        }
        current = current.left;
      } else {
        if (current.right === undefined) {
          current.right = newNode;
          newNode.parent = current;
          this._size++;
          return newNode;
        }
        current = current.right;
      }
    }

    return undefined;
  }

  /**
   * Time Complexity: O(k log n) - Adding each element individually in a balanced tree.
   * Space Complexity: O(k) - Additional space is required for the sorted array.
   */

  /**
   * Time Complexity: O(k log n) - Adding each element individually in a balanced tree.
   * Space Complexity: O(k) - Additional space is required for the sorted array.
   *
   * The `addMany` function in TypeScript adds multiple nodes to a binary tree, either in a balanced or
   * unbalanced manner, and returns an array of the inserted nodes.
   * @param keysOrNodesOrEntries - An iterable containing keys, nodes, or entries to be added to the
   * binary tree.
   * @param [isBalanceAdd=true] - A boolean flag indicating whether the tree should be balanced after
   * adding the nodes. The default value is true.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when adding multiple keys or nodes to the binary tree. It has a default
   * value of `this.iterationType`, which means it will use the iteration type specified by the binary
   * tree instance.
   * @returns The `addMany` function returns an array of `N` or `undefined` values.
   */
  override addMany(
    keysOrNodesOrEntries: Iterable<BTNodeExemplar<V, N>>,
    isBalanceAdd = true,
    iterationType = this.iterationType
  ): (N | undefined)[] {
    const inserted: (N | undefined)[] = []
    if (!isBalanceAdd) {
      for (const kve of keysOrNodesOrEntries) {
        const nn = this.add(kve)
        inserted.push(nn);
      }
      return inserted;
    }
    const realBTNExemplars: BTNodePureExemplar<V, N>[] = [];

    const isRealBTNExemplar = (kve: BTNodeExemplar<V, N>): kve is BTNodePureExemplar<V, N> => {
      if (kve === undefined || kve === null) return false;
      return !(this.isEntry(kve) && (kve[0] === undefined || kve[0] === null));
    }

    for (const kve of keysOrNodesOrEntries) {
      isRealBTNExemplar(kve) && realBTNExemplars.push(kve);
    }

    // TODO this addMany function is inefficient, it should be optimized
    let sorted: BTNodePureExemplar<V, N>[] = [];

    sorted = realBTNExemplars.sort((a, b) => {
      let aR: number, bR: number;
      if (this.isEntry(a)) aR = a[0]
      else if (this.isRealNode(a)) aR = a.key
      else aR = a;

      if (this.isEntry(b)) bR = b[0]
      else if (this.isRealNode(b)) bR = b.key
      else bR = b;

      return aR - bR;
    })


    const _dfs = (arr: BTNodePureExemplar<V, N>[]) => {
      if (arr.length === 0) return;

      const mid = Math.floor((arr.length - 1) / 2);
      const newNode = this.add(arr[mid]);
      inserted.push(newNode);
      _dfs(arr.slice(0, mid));
      _dfs(arr.slice(mid + 1));
    };
    const _iterate = () => {
      const n = sorted.length;
      const stack: [[number, number]] = [[0, n - 1]];
      while (stack.length > 0) {
        const popped = stack.pop();
        if (popped) {
          const [l, r] = popped;
          if (l <= r) {
            const m = l + Math.floor((r - l) / 2);
            const newNode = this.add(sorted[m]);
            inserted.push(newNode);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
    };
    if (iterationType === IterationType.RECURSIVE) {
      _dfs(sorted);
    } else {
      _iterate();
    }

    return inserted;
  }

  /**
   * Time Complexity: O(n log n) - Adding each element individually in a balanced tree.
   * Space Complexity: O(n) - Additional space is required for the sorted array.
   */

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(1) - Constant space is used.
   *
   * The `lastKey` function returns the key of the rightmost node in a binary tree, or the key of the
   * leftmost node if the comparison result is greater than.
   * @param {BTNKey | N | undefined} beginRoot - The `beginRoot` parameter is optional and can be of
   * type `BTNKey`, `N`, or `undefined`. It represents the starting point for finding the last key in
   * the binary tree. If not provided, it defaults to the root of the binary tree (`this.root`).
   * @param iterationType - The `iterationType` parameter is used to specify the type of iteration to
   * be performed. It can have one of the following values:
   * @returns the key of the rightmost node in the binary tree if the comparison result is less than,
   * the key of the leftmost node if the comparison result is greater than, and the key of the
   * rightmost node otherwise. If no node is found, it returns 0.
   */
  lastKey(beginRoot: BSTNodeKeyOrNode<N> = this.root, iterationType = this.iterationType): BTNKey {
    if (this._compare(0, 1) === CP.lt) return this.getRightMost(beginRoot, iterationType)?.key ?? 0;
    else if (this._compare(0, 1) === CP.gt) return this.getLeftMost(beginRoot, iterationType)?.key ?? 0;
    else return this.getRightMost(beginRoot, iterationType)?.key ?? 0;
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(1) - Constant space is used.
   */

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The function `getNodeByKey` searches for a node in a binary tree based on a given key, using
   * either recursive or iterative methods.
   * @param {BTNKey} key - The `key` parameter is the key value that we are searching for in the tree.
   * It is used to identify the node that we want to retrieve.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when searching for a node in the binary tree. It can have two possible
   * values:
   * @returns The function `getNodeByKey` returns a node (`N`) if a node with the specified key is
   * found in the binary tree. If no node is found, it returns `undefined`.
   */
  override getNodeByKey(key: BTNKey, iterationType = IterationType.ITERATIVE): N | undefined {
    if (!this.root) return undefined;
    if (iterationType === IterationType.RECURSIVE) {
      const _dfs = (cur: N): N | undefined => {
        if (cur.key === key) return cur;
        if (!cur.left && !cur.right) return;

        if (this._compare(cur.key, key) === CP.gt && cur.left) return _dfs(cur.left);
        if (this._compare(cur.key, key) === CP.lt && cur.right) return _dfs(cur.right);
      };

      return _dfs(this.root);
    } else {
      const queue = new Queue<N>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          if (this._compare(cur.key, key) === CP.eq) return cur;
          if (this._compare(cur.key, key) === CP.gt) cur.left && queue.push(cur.left);
          if (this._compare(cur.key, key) === CP.lt) cur.right && queue.push(cur.right);
        }
      }
    }
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   */

  /**
   * The function `ensureNode` returns the node corresponding to the given key if it is a node key,
   * otherwise it returns the key itself.
   * @param {BTNKey | N | undefined} key - The `key` parameter can be of type `BTNKey`, `N`, or
   * `undefined`.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to be performed. It has a default value of `IterationType.ITERATIVE`.
   * @returns either a node object (N) or undefined.
   */
  override ensureNode(key: BSTNodeKeyOrNode<N>, iterationType = IterationType.ITERATIVE): N | undefined {
    return this.isNodeKey(key) ? this.getNodeByKey(key, iterationType) : key;
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The function `getNodes` returns an array of nodes that match a given identifier, using either a
   * recursive or iterative approach.
   * @param {ReturnType<C> | undefined} identifier - The `identifier` parameter is the value that you
   * want to search for in the nodes of the binary tree. It can be of any type that is returned by the
   * callback function `C`.
   * @param {C} callback - The `callback` parameter is a function that takes a node of type `N` as its
   * argument and returns a value of type `ReturnType<C>`. The `C` type parameter represents a callback
   * function type that extends the `BTNCallback<N>` type. The `BTNCallback<N>` type is
   * @param [onlyOne=false] - A boolean flag indicating whether to stop searching after finding the
   * first node that matches the identifier. If set to true, the function will return an array
   * containing only the first matching node. If set to false (default), the function will continue
   * searching for all nodes that match the identifier and return an array containing
   * @param {BTNKey | N | undefined} beginRoot - The `beginRoot` parameter represents the starting node
   * for the traversal. It can be either a key value or a node object. If it is undefined, the
   * traversal will start from the root of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of iteration to be
   * performed on the binary tree. It can have two possible values:
   * @returns The method returns an array of nodes (`N[]`).
   */
  override getNodes<C extends BTNCallback<N>>(
    identifier: ReturnType<C> | undefined,
    callback: C = this._defaultOneParamCallback as C,
    onlyOne = false,
    beginRoot: BSTNodeKeyOrNode<N> = this.root,
    iterationType = this.iterationType
  ): N[] {
    beginRoot = this.ensureNode(beginRoot);
    if (!beginRoot) return [];
    const ans: N[] = [];

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N) => {
        const callbackResult = callback(cur);
        if (callbackResult === identifier) {
          ans.push(cur);
          if (onlyOne) return;
        }

        if (!cur.left && !cur.right) return;
        // TODO potential bug
        if (callback === this._defaultOneParamCallback) {
          if (this._compare(cur.key, identifier as number) === CP.gt) cur.left && _traverse(cur.left);
          if (this._compare(cur.key, identifier as number) === CP.lt) cur.right && _traverse(cur.right);
        } else {
          cur.left && _traverse(cur.left);
          cur.right && _traverse(cur.right);
        }
      };

      _traverse(beginRoot);
    } else {
      const queue = new Queue<N>([beginRoot]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          const callbackResult = callback(cur);
          if (callbackResult === identifier) {
            ans.push(cur);
            if (onlyOne) return ans;
          }
          // TODO potential bug
          if (callback === this._defaultOneParamCallback) {
            if (this._compare(cur.key, identifier as number) === CP.gt) cur.left && queue.push(cur.left);
            if (this._compare(cur.key, identifier as number) === CP.lt) cur.right && queue.push(cur.right);
          } else {
            cur.left && queue.push(cur.left);
            cur.right && queue.push(cur.right);
          }
        }
      }
    }

    return ans;
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   */

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The `lesserOrGreaterTraverse` function traverses a binary tree and returns an array of nodes that
   * are either lesser or greater than a target node, depending on the specified comparison type.
   * @param {C} callback - The `callback` parameter is a function that will be called for each node
   * that satisfies the condition specified by the `lesserOrGreater` parameter. It takes a single
   * parameter of type `N` (the node type) and returns a value of any type.
   * @param {CP} lesserOrGreater - The `lesserOrGreater` parameter is used to determine whether to
   * traverse nodes that are lesser than, greater than, or equal to the `targetNode`. It is of type
   * `CP`, which is a custom type representing the comparison operator. The possible values for
   * `lesserOrGreater` are
   * @param {BTNKey | N | undefined} targetNode - The `targetNode` parameter represents the node in the
   * binary tree that you want to traverse from. It can be specified either by its key, by the node
   * object itself, or it can be left undefined to start the traversal from the root of the tree.
   * @param iterationType - The `iterationType` parameter determines the type of traversal to be
   * performed on the binary tree. It can have two possible values:
   * @returns The function `lesserOrGreaterTraverse` returns an array of values of type
   * `ReturnType<C>`, which is the return type of the callback function passed as an argument.
   */
  lesserOrGreaterTraverse<C extends BTNCallback<N>>(
    callback: C = this._defaultOneParamCallback as C,
    lesserOrGreater: CP = CP.lt,
    targetNode: BSTNodeKeyOrNode<N> = this.root,
    iterationType = this.iterationType
  ): ReturnType<C>[] {
    targetNode = this.ensureNode(targetNode);
    const ans: ReturnType<BTNCallback<N>>[] = [];
    if (!targetNode) return ans;
    if (!this.root) return ans;

    const targetKey = targetNode.key;

    if (iterationType === IterationType.RECURSIVE) {
      const _traverse = (cur: N) => {
        const compared = this._compare(cur.key, targetKey);
        if (compared === lesserOrGreater) ans.push(callback(cur));

        if (!cur.left && !cur.right) return;
        if (cur.left && this._compare(cur.left.key, targetKey) === lesserOrGreater) _traverse(cur.left);
        if (cur.right && this._compare(cur.right.key, targetKey) === lesserOrGreater) _traverse(cur.right);
      };

      _traverse(this.root);
      return ans;
    } else {
      const queue = new Queue<N>([this.root]);
      while (queue.size > 0) {
        const cur = queue.shift();
        if (cur) {
          const compared = this._compare(cur.key, targetKey);
          if (compared === lesserOrGreater) ans.push(callback(cur));

          if (cur.left && this._compare(cur.left.key, targetKey) === lesserOrGreater) queue.push(cur.left);
          if (cur.right && this._compare(cur.right.key, targetKey) === lesserOrGreater) queue.push(cur.right);
        }
      }
      return ans;
    }
  }

  /**
   * Time Complexity: O(log n) - Average case for a balanced tree. O(n) - Visiting each node once when identifier is not node's key.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   */

  /**
   * Time Complexity: O(n) - Building a balanced tree from a sorted array.
   * Space Complexity: O(n) - Additional space is required for the sorted array.
   *
   * The `perfectlyBalance` function balances a binary search tree by adding nodes in a way that
   * ensures the tree is perfectly balanced.
   * @param iterationType - The `iterationType` parameter is an optional parameter that specifies the
   * type of iteration to use when building a balanced binary search tree. It can have two possible
   * values:
   * @returns The function `perfectlyBalance` returns a boolean value.
   */
  perfectlyBalance(iterationType = this.iterationType): boolean {
    const sorted = this.dfs(node => node, 'in'),
      n = sorted.length;
    this.clear();

    if (sorted.length < 1) return false;
    if (iterationType === IterationType.RECURSIVE) {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        this.add([midNode.key, midNode.value]);
        buildBalanceBST(l, m - 1);
        buildBalanceBST(m + 1, r);
      };

      buildBalanceBST(0, n - 1);
      return true;
    } else {
      const stack: [[number, number]] = [[0, n - 1]];
      while (stack.length > 0) {
        const popped = stack.pop();
        if (popped) {
          const [l, r] = popped;
          if (l <= r) {
            const m = l + Math.floor((r - l) / 2);
            const midNode = sorted[m];
            debugger;
            this.add([midNode.key, midNode.value]);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
    }
  }

  /**
   * Balancing Adjustment:
   * Perfectly Balanced Binary Tree: Since the balance of a perfectly balanced binary tree is already fixed, no additional balancing adjustment is needed. Any insertion or deletion operation will disrupt the perfect balance, often requiring a complete reconstruction of the tree.
   * AVL Tree: After insertion or deletion operations, an AVL tree performs rotation adjustments based on the balance factor of nodes to restore the tree's balance. These rotations can be left rotations, right rotations, left-right rotations, or right-left rotations, performed as needed.
   *
   * Use Cases and Efficiency:
   * Perfectly Balanced Binary Tree: Perfectly balanced binary trees are typically used in specific scenarios such as complete binary heaps in heap sort or certain types of Huffman trees. However, they are not suitable for dynamic operations requiring frequent insertions and deletions, as these operations often necessitate full tree reconstruction.
   * AVL Tree: AVL trees are well-suited for scenarios involving frequent searching, insertion, and deletion operations. Through rotation adjustments, AVL trees maintain their balance, ensuring average and worst-case time complexity of O(log n).
   */

  /**
   * Time Complexity: O(n) - Building a balanced tree from a sorted array.
   * Space Complexity: O(n) - Additional space is required for the sorted array.
   */

  /**
   * Time Complexity: O(n) - Visiting each node once.
   * Space Complexity: O(log n) - Space for the recursive call stack in the worst case.
   *
   * The function checks if a binary tree is AVL balanced using either recursive or iterative approach.
   * @param iterationType - The `iterationType` parameter is used to determine the method of iteration
   * to check if the AVL tree is balanced. It can have two possible values:
   * @returns a boolean value.
   */
  isAVLBalanced(iterationType = this.iterationType): boolean {
    if (!this.root) return true;

    let balanced = true;

    if (iterationType === IterationType.RECURSIVE) {
      const _height = (cur: N | undefined): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this.root);
    } else {
      const stack: N[] = [];
      let node: N | undefined = this.root,
        last: N | undefined = undefined;
      const depths: Map<N, number> = new Map();

      while (stack.length > 0 || node) {
        if (node) {
          stack.push(node);
          node = node.left;
        } else {
          node = stack[stack.length - 1];
          if (!node.right || last === node.right) {
            node = stack.pop();
            if (node) {
              const left = node.left ? depths.get(node.left) ?? -1 : -1;
              const right = node.right ? depths.get(node.right) ?? -1 : -1;
              if (Math.abs(left - right) > 1) return false;
              depths.set(node, 1 + Math.max(left, right));
              last = node;
              node = undefined;
            }
          } else node = node.right;
        }
      }
    }

    return balanced;
  }


  protected _setRoot(v: N | undefined) {
    if (v) {
      v.parent = undefined;
    }
    this._root = v;
  }

  /**
   * The function compares two values using a comparator function and returns whether the first value
   * is greater than, less than, or equal to the second value.
   * @param {BTNKey} a - The parameter "a" is of type BTNKey.
   * @param {BTNKey} b - The parameter "b" in the above code represents a BTNKey.
   * @returns a value of type CP (ComparisonResult). The possible return values are CP.gt (greater
   * than), CP.lt (less than), or CP.eq (equal).
   */
  protected _compare(a: BTNKey, b: BTNKey): CP {
    const compared = this.comparator(a, b);
    if (compared > 0) return CP.gt;
    else if (compared < 0) return CP.lt;
    else return CP.eq;
  }
}
