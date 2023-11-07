/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import {RBTNColor} from '../../types';

export class RBTreeNode {
  key: number;
  parent?: RBTreeNode;
  left?: RBTreeNode;
  right?: RBTreeNode;
  color: number;

  constructor(key: number, color: RBTNColor = RBTNColor.BLACK) {
    this.key = key;
    this.color = color;
  }
}

export const NIL = new RBTreeNode(0);

/**
 * 1. Each node is either red or black.
 * 2. The root node is always black.
 * 3. Leaf nodes are typically NIL nodes and are considered black.
 * 4. Red nodes must have black children.
 * 5. Black balance: Every path from any node to each of its leaf nodes contains the same number of black nodes.
 */
export class RedBlackTree {
  constructor() {
    this._root = NIL;
  }

  protected _root: RBTreeNode;

  get root(): RBTreeNode {
    return this._root;
  }

  protected _size: number = 0;

  get size(): number {
    return this._size;
  }

  /**
   * The `insert` function inserts a new node with a given key into a red-black tree and fixes any
   * violations of the red-black tree properties.
   * @param {number} key - The key parameter is a number that represents the value to be inserted into
   * the RBTree.
   * @returns The function does not explicitly return anything.
   */
  add(key: number): void {
    const node: RBTreeNode = new RBTreeNode(key, RBTNColor.RED);
    node.left = NIL;
    node.right = NIL;

    let y: RBTreeNode | undefined = undefined;
    let x: RBTreeNode | undefined = this.root;

    while (x !== NIL) {
      y = x;
      if (x && node.key < x.key) {
        x = x.left;
      } else {
        x = x?.right;
      }
    }

    node.parent = y;
    if (y === undefined) {
      this._root = node;
    } else if (node.key < y.key) {
      y.left = node;
    } else {
      y.right = node;
    }

    if (node.parent === undefined) {
      node.color = RBTNColor.BLACK;
      this._size++;
      return;
    }

    if (node.parent.parent === undefined) {
      this._size++;
      return;
    }

    this._fixInsert(node);
    this._size++;
  }

  /**
   * The `delete` function in TypeScript is used to remove a node with a specific key from a red-black
   * tree.
   * @param {number} key - The `node` parameter is of type `RBTreeNode` and represents the current
   * node being processed in the delete operation.
   * @returns The `delete` function does not return anything. It has a return type of `void`.
   */
  delete(key: number): void {
    const helper = (node: RBTreeNode | undefined): void => {
      let z: RBTreeNode = NIL;
      let x: RBTreeNode | undefined, y: RBTreeNode;
      while (node !== NIL) {
        if (node && node.key === key) {
          z = node;
        }

        if (node && node.key <= key) {
          node = node.right;
        } else {
          node = node?.left;
        }
      }

      if (z === NIL) {
        this._size--;
        return;
      }

      y = z;
      let yOriginalColor: number = y.color;
      if (z.left === NIL) {
        x = z.right;
        this._rbTransplant(z, z.right!);
      } else if (z.right === NIL) {
        x = z.left;
        this._rbTransplant(z, z.left!);
      } else {
        y = this.getLeftMost(z.right);
        yOriginalColor = y.color;
        x = y.right;
        if (y.parent === z) {
          x!.parent = y;
        } else {
          this._rbTransplant(y, y.right!);
          y.right = z.right;
          y.right!.parent = y;
        }

        this._rbTransplant(z, y);
        y.left = z.left;
        y.left!.parent = y;
        y.color = z.color;
      }
      if (yOriginalColor === RBTNColor.BLACK) {
        this._fixDelete(x!);
      }
      this._size--;
    };
    helper(this.root);
  }

  isRealNode(node: RBTreeNode | undefined): node is RBTreeNode {
    return node !== NIL && node !== undefined;
  }

  /**
   * The function `getNode` is a recursive depth-first search algorithm that searches for a node with a
   * given key in a red-black tree.
   * @param {number} key - The key parameter is a number that represents the value we are searching for
   * in the RBTree.
   * @param beginRoot - The `beginRoot` parameter is an optional parameter that represents the starting
   * point for the search in the binary search tree. If no value is provided for `beginRoot`, it
   * defaults to the root of the binary search tree (`this.root`).
   * @returns a RBTreeNode.
   */
  getNode(key: number, beginRoot = this.root): RBTreeNode | undefined {
    const dfs = (node: RBTreeNode): RBTreeNode | undefined => {
      if (this.isRealNode(node)) {
        if (key === node.key) {
          return node;
        }

        if (key < node.key) return dfs(node.left!);
        return dfs(node.right!);
      } else {
        return undefined;
      }
    };
    return dfs(beginRoot);
  }

  /**
   * The function returns the leftmost node in a red-black tree.
   * @param {RBTreeNode} node - The parameter "node" is of type RBTreeNode, which represents a node in
   * a Red-Black Tree.
   * @returns The leftmost node in the given RBTreeNode.
   */
  getLeftMost(node: RBTreeNode = this.root): RBTreeNode {
    while (node.left !== undefined && node.left !== NIL) {
      node = node.left;
    }
    return node;
  }

  /**
   * The function returns the rightmost node in a red-black tree.
   * @param {RBTreeNode} node - The parameter "node" is of type RBTreeNode.
   * @returns the rightmost node in a red-black tree.
   */
  getRightMost(node: RBTreeNode): RBTreeNode {
    while (node.right !== undefined && node.right !== NIL) {
      node = node.right;
    }
    return node;
  }

  /**
   * The function returns the successor of a given node in a red-black tree.
   * @param {RBTreeNode} x - RBTreeNode - The node for which we want to find the successor.
   * @returns the successor of the given RBTreeNode.
   */
  getSuccessor(x: RBTreeNode): RBTreeNode | undefined {
    if (x.right !== NIL) {
      return this.getLeftMost(x.right);
    }

    let y: RBTreeNode | undefined = x.parent;
    while (y !== NIL && y !== undefined && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  /**
   * The function returns the predecessor of a given node in a red-black tree.
   * @param {RBTreeNode} x - The parameter `x` is of type `RBTreeNode`, which represents a node in a
   * Red-Black Tree.
   * @returns the predecessor of the given RBTreeNode 'x'.
   */
  getPredecessor(x: RBTreeNode): RBTreeNode {
    if (x.left !== NIL) {
      return this.getRightMost(x.left!);
    }

    let y: RBTreeNode | undefined = x.parent;
    while (y !== NIL && x === y!.left) {
      x = y!;
      y = y!.parent;
    }

    return y!;
  }

  clear() {
    this._root = NIL;
    this._size = 0;
  }

  print(beginRoot: RBTreeNode = this.root) {
    const display = (root: RBTreeNode | undefined): void => {
      const [lines, , ,] = _displayAux(root);
      for (const line of lines) {
        console.log(line);
      }
    };

    const _displayAux = (node: RBTreeNode | undefined): [string[], number, number, number] => {
      if (node === undefined) {
        return [[], 0, 0, 0];
      }

      if (node.right === undefined && node.left === undefined) {
        const line = `${node.key}`;
        const width = line.length;
        const height = 1;
        const middle = Math.floor(width / 2);
        return [[line], width, height, middle];
      }

      if (node.right === undefined) {
        const [lines, n, p, x] = _displayAux(node.left);
        const s = `${node.key}`;
        const u = s.length;
        const first_line = ' '.repeat(x + 1) + '_'.repeat(n - x - 1) + s;
        const second_line = ' '.repeat(x) + '/' + ' '.repeat(n - x - 1 + u);
        const shifted_lines = lines.map(line => line + ' '.repeat(u));
        return [[first_line, second_line, ...shifted_lines], n + u, p + 2, n + Math.floor(u / 2)];
      }

      if (node.left === undefined) {
        const [lines, n, p, u] = _displayAux(node.right);
        const s = `${node.key}`;
        const x = s.length;
        const first_line = s + '_'.repeat(x) + ' '.repeat(n - x);
        const second_line = ' '.repeat(u + x) + '\\' + ' '.repeat(n - x - 1);
        const shifted_lines = lines.map(line => ' '.repeat(u) + line);
        return [[first_line, second_line, ...shifted_lines], n + x, p + 2, Math.floor(u / 2)];
      }

      const [left, n, p, x] = _displayAux(node.left);
      const [right, m, q, y] = _displayAux(node.right);
      const s = `${node.key}`;
      const u = s.length;
      const first_line = ' '.repeat(x + 1) + '_'.repeat(n - x - 1) + s + '_'.repeat(y) + ' '.repeat(m - y);
      const second_line = ' '.repeat(x) + '/' + ' '.repeat(n - x - 1 + u + y) + '\\' + ' '.repeat(m - y - 1);
      if (p < q) {
        left.push(...new Array(q - p).fill(' '.repeat(n)));
      } else if (q < p) {
        right.push(...new Array(p - q).fill(' '.repeat(m)));
      }
      const zipped_lines = left.map((a, i) => a + ' '.repeat(u) + right[i]);
      return [[first_line, second_line, ...zipped_lines], n + m + u, Math.max(p, q) + 2, n + Math.floor(u / 2)];
    };

    display(beginRoot);
  }

  /**
   * The function performs a left rotation on a red-black tree node.
   * @param {RBTreeNode} x - The parameter `x` is a RBTreeNode object.
   */
  protected _leftRotate(x: RBTreeNode): void {
    if (x.right) {
      const y: RBTreeNode = x.right;
      x.right = y.left;
      if (y.left !== NIL) {
        if (y.left) y.left.parent = x;
      }
      y.parent = x.parent;
      if (x.parent === undefined) {
        this._root = y;
      } else if (x === x.parent.left) {
        x.parent.left = y;
      } else {
        x.parent.right = y;
      }
      y.left = x;
      x.parent = y;
    }
  }

  /**
   * The function performs a right rotation on a red-black tree node.
   * @param {RBTreeNode} x - x is a RBTreeNode, which represents the node that needs to be right
   * rotated.
   */
  protected _rightRotate(x: RBTreeNode): void {
    if (x.left) {
      const y: RBTreeNode = x.left;
      x.left = y.right;
      if (y.right !== NIL) {
        if (y.right) y.right.parent = x;
      }
      y.parent = x.parent;
      if (x.parent === undefined) {
        this._root = y;
      } else if (x === x.parent.right) {
        x.parent.right = y;
      } else {
        x.parent.left = y;
      }
      y.right = x;
      x.parent = y;
    }
  }

  /**
   * The _fixDelete function is used to rebalance the Red-Black Tree after a node deletion.
   * @param {RBTreeNode} x - The parameter `x` is of type `RBTreeNode`, which represents a node in a
   * red-black tree.
   */
  protected _fixDelete(x: RBTreeNode): void {
    let s: RBTreeNode | undefined;
    while (x !== this.root && x.color === RBTNColor.BLACK) {
      if (x.parent && x === x.parent.left) {
        s = x.parent.right!;
        if (s.color === 1) {
          s.color = RBTNColor.BLACK;
          x.parent.color = RBTNColor.RED;
          this._leftRotate(x.parent);
          s = x.parent.right!;
        }

        if (s.left !== undefined && s.left.color === RBTNColor.BLACK && s.right && s.right.color === RBTNColor.BLACK) {
          s.color = RBTNColor.RED;
          x = x.parent;
        } else {
          if (s.right && s.right.color === RBTNColor.BLACK) {
            if (s.left) s.left.color = RBTNColor.BLACK;
            s.color = RBTNColor.RED;
            this._rightRotate(s);
            s = x.parent.right;
          }

          if (s) s.color = x.parent.color;
          x.parent.color = RBTNColor.BLACK;
          if (s && s.right) s.right.color = RBTNColor.BLACK;
          this._leftRotate(x.parent);
          x = this.root;
        }
      } else {
        s = x.parent!.left!;
        if (s.color === 1) {
          s.color = RBTNColor.BLACK;
          x.parent!.color = RBTNColor.RED;
          this._rightRotate(x.parent!);
          s = x.parent!.left;
        }

        if (s && s.right && s.right.color === RBTNColor.BLACK && s.right.color === RBTNColor.BLACK) {
          s.color = RBTNColor.RED;
          x = x.parent!;
        } else {
          if (s && s.left && s.left.color === RBTNColor.BLACK) {
            if (s.right) s.right.color = RBTNColor.BLACK;
            s.color = RBTNColor.RED;
            this._leftRotate(s);
            s = x.parent!.left;
          }

          if (s) s.color = x.parent!.color;
          x.parent!.color = RBTNColor.BLACK;
          if (s && s.left) s.left.color = RBTNColor.BLACK;
          this._rightRotate(x.parent!);
          x = this.root;
        }
      }
    }
    x.color = RBTNColor.BLACK;
  }

  /**
   * The function `_rbTransplant` replaces one node in a red-black tree with another node.
   * @param {RBTreeNode} u - The parameter "u" represents a RBTreeNode object.
   * @param {RBTreeNode} v - The parameter "v" is a RBTreeNode object.
   */
  protected _rbTransplant(u: RBTreeNode, v: RBTreeNode): void {
    if (u.parent === undefined) {
      this._root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  /**
   * The `_fixInsert` function is used to fix the red-black tree after an insertion operation.
   * @param {RBTreeNode} k - The parameter `k` is a RBTreeNode object, which represents a node in a
   * red-black tree.
   */
  protected _fixInsert(k: RBTreeNode): void {
    let u: RBTreeNode | undefined;
    while (k.parent && k.parent.color === 1) {
      if (k.parent.parent && k.parent === k.parent.parent.right) {
        u = k.parent.parent.left;
        if (u && u.color === 1) {
          u.color = RBTNColor.BLACK;
          k.parent.color = RBTNColor.BLACK;
          k.parent.parent.color = RBTNColor.RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.left) {
            k = k.parent;
            this._rightRotate(k);
          }

          k.parent!.color = RBTNColor.BLACK;
          k.parent!.parent!.color = RBTNColor.RED;
          this._leftRotate(k.parent!.parent!);
        }
      } else {
        u = k.parent.parent!.right;

        if (u && u.color === 1) {
          u.color = RBTNColor.BLACK;
          k.parent.color = RBTNColor.BLACK;
          k.parent.parent!.color = RBTNColor.RED;
          k = k.parent.parent!;
        } else {
          if (k === k.parent.right) {
            k = k.parent;
            this._leftRotate(k);
          }

          k.parent!.color = RBTNColor.BLACK;
          k.parent!.parent!.color = RBTNColor.RED;
          this._rightRotate(k.parent!.parent!);
        }
      }
      if (k === this.root) {
        break;
      }
    }
    this.root.color = RBTNColor.BLACK;
  }
}
