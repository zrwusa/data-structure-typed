/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type {
  BinaryTreeNodeKey,
  BinaryTreeNodePropertyName,
  BSTComparator,
  BSTNodeNested,
  BSTOptions
} from '../../types';
import {CP, LoopType} from '../../types';
import {BinaryTree, BinaryTreeNode} from './binary-tree';
import {IBinaryTree} from '../../interfaces';

export class BSTNode<V = any, FAMILY extends BSTNode<V, FAMILY> = BSTNodeNested<V>> extends BinaryTreeNode<V, FAMILY> {
  constructor(key: BinaryTreeNodeKey, val?: V) {
    super(key, val);
  }
}

export class BST<N extends BSTNode<N['val'], N> = BSTNode> extends BinaryTree<N> implements IBinaryTree<N> {
  /**
   * The constructor function initializes a binary search tree object with an optional comparator function.
   * @param {BSTOptions} [options] - An optional object that contains configuration options for the binary search tree.
   */
  constructor(options?: BSTOptions) {
    super(options);
    if (options !== undefined) {
      const {comparator} = options;
      if (comparator !== undefined) {
        this._comparator = comparator;
      }
    }
  }

  /**
   * The function creates a new binary search tree node with the given key and value.
   * @param {BinaryTreeNodeKey} key - The `key` parameter is the identifier for the binary tree node. It is used to uniquely
   * identify each node in the binary tree.
   * @param [val] - The `val` parameter is an optional value that can be assigned to the node. It represents the value
   * that will be stored in the node.
   * @returns a new instance of the BSTNode class with the specified key and value.
   */
  override createNode(key: BinaryTreeNodeKey, val?: N['val']): N {
    return new BSTNode<N['val'], N>(key, val) as N;
  }

  /**
   * The `add` function adds a new node to a binary search tree, either by creating a new node or by updating an existing
   * node with the same ID.
   * @param {BinaryTreeNodeKey | N | null} keyOrNode - The `keyOrNode` parameter can be either a `BinaryTreeNodeKey` or a `N`
   * (which represents a binary tree node) or `null`.
   * @param [val] - The `val` parameter is an optional value that can be assigned to the `val` property of the new node
   * being added to the binary search tree.
   * @returns The function `add` returns the inserted node (`inserted`) which can be of type `N`, `null`, or `undefined`.
   */
  override add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val']): N | null | undefined {
    // TODO support node as a param
    let inserted: N | null = null;
    let newNode: N | null = null;
    if (keyOrNode instanceof BSTNode) {
      newNode = keyOrNode;
    } else if (typeof keyOrNode === 'number') {
      newNode = this.createNode(keyOrNode, val);
    } else if (keyOrNode === null) {
      newNode = null;
    }
    if (this.root === null) {
      this._setRoot(newNode);
      this._setSize(this.size + 1);
      inserted = this.root;
    } else {
      let cur = this.root;
      let traversing = true;
      while (traversing) {
        if (cur !== null && newNode !== null) {
          if (this._compare(cur.key, newNode.key) === CP.eq) {
            if (newNode) {
              cur.val = newNode.val;
            }
            //Duplicates are not accepted.
            traversing = false;
            inserted = cur;
          } else if (this._compare(cur.key, newNode.key) === CP.gt) {
            // Traverse left of the node
            if (cur.left === undefined) {
              if (newNode) {
                newNode.parent = cur;
              }
              //Add to the left of the current node
              cur.left = newNode;
              this._setSize(this.size + 1);
              traversing = false;
              inserted = cur.left;
            } else {
              //Traverse the left of the current node
              if (cur.left) cur = cur.left;
            }
          } else if (this._compare(cur.key, newNode.key) === CP.lt) {
            // Traverse right of the node
            if (cur.right === undefined) {
              if (newNode) {
                newNode.parent = cur;
              }
              //Add to the right of the current node
              cur.right = newNode;
              this._setSize(this.size + 1);
              traversing = false;
              inserted = cur.right;
            } else {
              //Traverse the left of the current node
              if (cur.right) cur = cur.right;
            }
          }
        } else {
          traversing = false;
        }
      }
    }
    return inserted;
  }

  /**
   * The `addMany` function overrides the base class method to add multiple nodes to a binary search tree in a balanced
   * manner.
   * @param {[BinaryTreeNodeKey | N , N['val']][]} keysOrNodes - The `keysOrNodes` parameter in the `addMany` function is an array of
   * `BinaryTreeNodeKey` or `N` (node) objects, or `null` values. It represents the nodes or node IDs that need to be added
   * to the binary search tree.
   * @param {N['val'][]} data - The values of tree nodes
   * @param {boolean} isBalanceAdd - If true the nodes will be balance inserted in binary search method.
   * @returns The function `addMany` returns an array of `N`, `null`, or `undefined` values.
   */
  override addMany(
    keysOrNodes: (BinaryTreeNodeKey | null)[] | (N | null)[],
    data?: N['val'][],
    isBalanceAdd = false
  ): (N | null | undefined)[] {
    function hasNoNull(arr: (BinaryTreeNodeKey | null)[] | (N | null)[]): arr is BinaryTreeNodeKey[] | N[] {
      return arr.indexOf(null) === -1;
    }
    if (!isBalanceAdd || !hasNoNull(keysOrNodes)) {
      return super.addMany(keysOrNodes, data);
    }
    const inserted: (N | null | undefined)[] = [];
    const combinedArr: [BinaryTreeNodeKey | N, N['val']][] = keysOrNodes.map((value, index) => [value, data?.[index]]);
    let sorted = [];
    function isNodeOrNullTuple(arr: [BinaryTreeNodeKey | N, N['val']][]): arr is [N, N['val']][] {
      for (const [keyOrNode] of arr) if (keyOrNode instanceof BSTNode) return true;
      return false;
    }
    function isBinaryTreeKeyOrNullTuple(
      arr: [BinaryTreeNodeKey | N, N['val']][]
    ): arr is [BinaryTreeNodeKey, N['val']][] {
      for (const [keyOrNode] of arr) if (typeof keyOrNode === 'number') return true;
      return false;
    }
    let sortedKeysOrNodes: (number | N | null)[] = [],
      sortedData: (N['val'] | undefined)[] | undefined = [];

    if (isNodeOrNullTuple(combinedArr)) {
      sorted = combinedArr.sort((a, b) => a[0].key - b[0].key);
    } else if (isBinaryTreeKeyOrNullTuple(combinedArr)) {
      sorted = combinedArr.sort((a, b) => a[0] - b[0]);
    } else {
      throw new Error('Invalid input keysOrNodes');
    }
    sortedKeysOrNodes = sorted.map(([keyOrNode]) => keyOrNode);
    sortedData = sorted.map(([, val]) => val);
    const recursive = (arr: (BinaryTreeNodeKey | null | N)[], data?: N['val'][]) => {
      if (arr.length === 0) return;

      const mid = Math.floor((arr.length - 1) / 2);
      const newNode = this.add(arr[mid], data?.[mid]);
      inserted.push(newNode);
      recursive(arr.slice(0, mid), data?.slice(0, mid));
      recursive(arr.slice(mid + 1), data?.slice(mid + 1));
    };
    const iterative = () => {
      const n = sorted.length;
      const stack: [[number, number]] = [[0, n - 1]];
      while (stack.length > 0) {
        const popped = stack.pop();
        if (popped) {
          const [l, r] = popped;
          if (l <= r) {
            const m = l + Math.floor((r - l) / 2);
            const newNode = this.add(sortedKeysOrNodes[m], sortedData?.[m]);
            inserted.push(newNode);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
    };
    if (this.loopType === LoopType.RECURSIVE) {
      recursive(sortedKeysOrNodes, sortedData);
    } else {
      iterative();
    }

    return inserted;
  }

  /**
   * The function returns the first node in a binary tree that matches the given property name and value.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or a
   * generic type `N`. It represents the property of the binary tree node that you want to search for.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property name to use for searching the binary tree nodes. If not provided, it defaults to `'key'`.
   * @returns The method is returning either a BinaryTreeNodeKey or N (generic type) or null.
   */
  override get(nodeProperty: BinaryTreeNodeKey | N, propertyName: BinaryTreeNodePropertyName = 'key'): N | null {
    return this.getNodes(nodeProperty, propertyName, true)[0] ?? null;
  }

  /**
   * The function returns the key of the rightmost node if the comparison between two values is less than, the key of the
   * leftmost node if the comparison is greater than, and the key of the rightmost node otherwise.
   * @returns The method `lastKey()` returns the key of the rightmost node in the binary tree if the comparison between
   * the values at index 0 and 1 is less than, otherwise it returns the key of the leftmost node. If the comparison is
   * equal, it returns the key of the rightmost node. If there are no nodes in the tree, it returns 0.
   */
  lastKey(): BinaryTreeNodeKey {
    if (this._compare(0, 1) === CP.lt) return this.getRightMost()?.key ?? 0;
    else if (this._compare(0, 1) === CP.gt) return this.getLeftMost()?.key ?? 0;
    else return this.getRightMost()?.key ?? 0;
  }

  /**
   * The function `getNodes` returns an array of nodes in a binary tree that match a given property value.
   * @param {BinaryTreeNodeKey | N} nodeProperty - The `nodeProperty` parameter can be either a `BinaryTreeNodeKey` or an
   * `N` type. It represents the property of the binary tree node that you want to compare with.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property name to use for comparison. If not provided, it defaults to `'key'`.
   * @param {boolean} [onlyOne] - The `onlyOne` parameter is an optional boolean parameter that determines whether to
   * return only one node that matches the given `nodeProperty` or all nodes that match the `nodeProperty`. If `onlyOne`
   * is set to `true`, the function will return an array with only one node (if
   * @returns an array of nodes (type N).
   */
  override getNodes(
    nodeProperty: BinaryTreeNodeKey | N,
    propertyName: BinaryTreeNodePropertyName = 'key',
    onlyOne = false
  ): N[] {
    if (!this.root) return [];
    const result: N[] = [];

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return;

        if (!cur.left && !cur.right) return;
        if (propertyName === 'key') {
          if (this._compare(cur.key, nodeProperty as number) === CP.gt) cur.left && _traverse(cur.left);
          if (this._compare(cur.key, nodeProperty as number) === CP.lt) cur.right && _traverse(cur.right);
        } else {
          cur.left && _traverse(cur.left);
          cur.right && _traverse(cur.right);
        }
      };

      _traverse(this.root);
    } else {
      const queue: N[] = [this.root];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur) {
          if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return result;
          if (propertyName === 'key') {
            if (this._compare(cur.key, nodeProperty as number) === CP.gt) cur.left && queue.push(cur.left);
            if (this._compare(cur.key, nodeProperty as number) === CP.lt) cur.right && queue.push(cur.right);
          } else {
            cur.left && queue.push(cur.left);
            cur.right && queue.push(cur.right);
          }
        }
      }
    }

    return result;
  }

  // --- start additional functions
  /**
   * The `lesserSum` function calculates the sum of property values in a binary tree for nodes that have a property value
   * less than a given node.
   * @param {N | BinaryTreeNodeKey | null} beginNode - The `beginNode` parameter can be one of the following:
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property name to use for calculating the sum. If not provided, it defaults to `'key'`.
   * @returns The function `lesserSum` returns a number, which represents the sum of the values of the nodes in the
   * binary tree that have a lesser value than the specified `beginNode` based on the `propertyName`.
   */
  lesserSum(beginNode: N | BinaryTreeNodeKey | null, propertyName: BinaryTreeNodePropertyName = 'key'): number {
    if (typeof beginNode === 'number') beginNode = this.get(beginNode, 'key');
    if (!beginNode) return 0;
    if (!this.root) return 0;
    const key = beginNode.key;
    const getSumByPropertyName = (cur: N) => {
      let needSum: number;
      switch (propertyName) {
        case 'key':
          needSum = cur.key;
          break;
        default:
          needSum = cur.key;
          break;
      }
      return needSum;
    };

    let sum = 0;

    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N): void => {
        const compared = this._compare(cur.key, key);
        if (compared === CP.eq) {
          if (cur.right) sum += this.subTreeSum(cur.right, propertyName);
          return;
        } else if (compared === CP.lt) {
          if (cur.left) sum += this.subTreeSum(cur.left, propertyName);
          sum += getSumByPropertyName(cur);
          if (cur.right) _traverse(cur.right);
          else return;
        } else {
          if (cur.left) _traverse(cur.left);
          else return;
        }
      };

      _traverse(this.root);
    } else {
      const queue: N[] = [this.root];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur) {
          const compared = this._compare(cur.key, key);
          if (compared === CP.eq) {
            if (cur.right) sum += this.subTreeSum(cur.right, propertyName);
            return sum;
          } else if (compared === CP.lt) {
            // todo maybe a bug
            if (cur.left) sum += this.subTreeSum(cur.left, propertyName);
            sum += getSumByPropertyName(cur);
            if (cur.right) queue.push(cur.right);
            else return sum;
          } else {
            if (cur.left) queue.push(cur.left);
            else return sum;
          }
        }
      }
    }

    return sum;
  }

  /**
   * The `allGreaterNodesAdd` function adds a delta value to the specified property of all nodes in a binary tree that
   * have a greater value than a given node.
   * @param {N | BinaryTreeNodeKey | null} node - The `node` parameter can be either of type `N` (a generic type),
   * `BinaryTreeNodeKey`, or `null`. It represents the node in the binary tree to which the delta value will be added.
   * @param {number} delta - The `delta` parameter is a number that represents the amount by which the property value of
   * each greater node should be increased.
   * @param {BinaryTreeNodePropertyName} [propertyName] - The `propertyName` parameter is an optional parameter that
   * specifies the property name of the nodes in the binary tree that you want to update. If not provided, it defaults to
   * 'key'.
   * @returns a boolean value.
   */
  allGreaterNodesAdd(
    node: N | BinaryTreeNodeKey | null,
    delta: number,
    propertyName: BinaryTreeNodePropertyName = 'key'
  ): boolean {
    if (typeof node === 'number') node = this.get(node, 'key');
    if (!node) return false;
    const key = node.key;
    if (!this.root) return false;

    const _sumByPropertyName = (cur: N) => {
      switch (propertyName) {
        case 'key':
          cur.key += delta;
          break;
        default:
          cur.key += delta;
          break;
      }
    };
    if (this.loopType === LoopType.RECURSIVE) {
      const _traverse = (cur: N) => {
        const compared = this._compare(cur.key, key);
        if (compared === CP.gt) _sumByPropertyName(cur);

        if (!cur.left && !cur.right) return;
        if (cur.left && this._compare(cur.left.key, key) === CP.gt) _traverse(cur.left);
        if (cur.right && this._compare(cur.right.key, key) === CP.gt) _traverse(cur.right);
      };

      _traverse(this.root);
      return true;
    } else {
      const queue: N[] = [this.root];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur) {
          const compared = this._compare(cur.key, key);
          if (compared === CP.gt) _sumByPropertyName(cur);

          if (cur.left && this._compare(cur.left.key, key) === CP.gt) queue.push(cur.left);
          if (cur.right && this._compare(cur.right.key, key) === CP.gt) queue.push(cur.right);
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
   * The `perfectlyBalance` function takes a binary tree, performs a depth-first search to sort the nodes, and then
   * constructs a balanced binary search tree using either a recursive or iterative approach.
   * @returns The function `perfectlyBalance()` returns a boolean value.
   */
  perfectlyBalance(): boolean {
    const sorted = this.dfs('in', 'node'),
      n = sorted.length;
    this.clear();

    if (sorted.length < 1) return false;
    if (this.loopType === LoopType.RECURSIVE) {
      const buildBalanceBST = (l: number, r: number) => {
        if (l > r) return;
        const m = l + Math.floor((r - l) / 2);
        const midNode = sorted[m];
        this.add(midNode.key, midNode.val);
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
            this.add(midNode.key, midNode.val);
            stack.push([m + 1, r]);
            stack.push([l, m - 1]);
          }
        }
      }
      return true;
    }
  }

  /**
   * The function `isAVLBalanced` checks if a binary tree is balanced according to the AVL tree property.
   * @returns a boolean value.
   */
  isAVLBalanced(): boolean {
    if (!this.root) return true;

    let balanced = true;

    if (this.loopType === LoopType.RECURSIVE) {
      const _height = (cur: N | null | undefined): number => {
        if (!cur) return 0;
        const leftHeight = _height(cur.left),
          rightHeight = _height(cur.right);
        if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
        return Math.max(leftHeight, rightHeight) + 1;
      };
      _height(this.root);
    } else {
      const stack: N[] = [];
      let node: N | null | undefined = this.root,
        last: N | null = null;
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
              node = null;
            }
          } else node = node.right;
        }
      }
    }

    return balanced;
  }

  protected _comparator: BSTComparator = (a, b) => a - b;

  /**
   * The function compares two binary tree node IDs using a comparator function and returns whether the first ID is
   * greater than, less than, or equal to the second ID.
   * @param {BinaryTreeNodeKey} a - "a" is a BinaryTreeNodeKey, which represents the identifier of a binary tree node.
   * @param {BinaryTreeNodeKey} b - The parameter "b" in the above code refers to a BinaryTreeNodeKey.
   * @returns a value of type CP (ComparisonResult). The possible return values are CP.gt (greater than), CP.lt (less
   * than), or CP.eq (equal).
   */
  protected _compare(a: BinaryTreeNodeKey, b: BinaryTreeNodeKey): CP {
    const compared = this._comparator(a, b);
    if (compared > 0) return CP.gt;
    else if (compared < 0) return CP.lt;
    else return CP.eq;
  }

  // --- end additional functions
}
