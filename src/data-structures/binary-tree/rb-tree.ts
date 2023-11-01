import {RBTNColor} from '../../types';

export class RBTreeNode {
  key: number;
  parent: RBTreeNode;
  left: RBTreeNode;
  right: RBTreeNode;
  color: number = RBTNColor.BLACK;

  constructor(key: number, color: RBTNColor = RBTNColor.BLACK) {
    this.key = key;
    this.color = color;
    this.parent = null as unknown as RBTreeNode;
    this.left = null as unknown as RBTreeNode;
    this.right = null as unknown as RBTreeNode;
  }
}

export const SN = new RBTreeNode(0);

export class RedBlackTree {
  constructor() {
    this._root = SN;
  }

  protected _root: RBTreeNode;

  get root(): RBTreeNode {
    return this._root;
  }

  /**
   * The `insert` function inserts a new node with a given key into a red-black tree and fixes any
   * violations of the red-black tree properties.
   * @param {number} key - The key parameter is a number that represents the value to be inserted into
   * the RBTree.
   * @returns The function does not explicitly return anything.
   */
  insert(key: number): void {
    const node: RBTreeNode = new RBTreeNode(key, RBTNColor.RED);
    node.left = SN;
    node.right = SN;

    let y: RBTreeNode = null as unknown as RBTreeNode;
    let x: RBTreeNode = this.root;

    while (x !== SN) {
      y = x;
      if (node.key < x.key) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    node.parent = y;
    if (y === null) {
      this._root = node;
    } else if (node.key < y.key) {
      y.left = node;
    } else {
      y.right = node;
    }

    if (node.parent === null) {
      node.color = RBTNColor.BLACK;
      return;
    }

    if (node.parent.parent === null) {
      return;
    }

    this._fixInsert(node);
  }

  /**
   * The `delete` function in TypeScript is used to remove a node with a specific key from a red-black
   * tree.
   * @param {RBTreeNode} node - The `node` parameter is of type `RBTreeNode` and represents the current
   * node being processed in the delete operation.
   * @returns The `delete` function does not return anything. It has a return type of `void`.
   */
  delete(key: number): void {
    const helper = (node: RBTreeNode): void => {
      let z: RBTreeNode = SN;
      let x: RBTreeNode, y: RBTreeNode;
      while (node !== SN) {
        if (node.key === key) {
          z = node;
        }

        if (node.key <= key) {
          node = node.right;
        } else {
          node = node.left;
        }
      }

      if (z === SN) {
        return;
      }

      y = z;
      let yOriginalColor: number = y.color;
      if (z.left === SN) {
        x = z.right;
        this._rbTransplant(z, z.right);
      } else if (z.right === SN) {
        x = z.left;
        this._rbTransplant(z, z.left);
      } else {
        y = this.getLeftMost(z.right);
        yOriginalColor = y.color;
        x = y.right;
        if (y.parent === z) {
          x.parent = y;
        } else {
          this._rbTransplant(y, y.right);
          y.right = z.right;
          y.right.parent = y;
        }

        this._rbTransplant(z, y);
        y.left = z.left;
        y.left.parent = y;
        y.color = z.color;
      }
      if (yOriginalColor === RBTNColor.BLACK) {
        this._fixDelete(x);
      }
    };
    helper(this.root);
  }

  isRealNode(node: RBTreeNode): node is RBTreeNode {
    return node !== SN && node !== null;
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
  getNode(key: number, beginRoot = this.root): RBTreeNode {
    const dfs = (node: RBTreeNode): RBTreeNode => {
      if (this.isRealNode(node)) {
        if (key === node.key) {
          return node;
        }

        if (key < node.key) return dfs(node.left);
        return dfs(node.right);
      } else {
        return null as unknown as RBTreeNode;
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
    while (node.left !== null && node.left !== SN) {
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
    while (node.right !== null && node.right !== SN) {
      node = node.right;
    }
    return node;
  }

  /**
   * The function returns the successor of a given node in a red-black tree.
   * @param {RBTreeNode} x - RBTreeNode - The node for which we want to find the successor.
   * @returns the successor of the given RBTreeNode.
   */
  getSuccessor(x: RBTreeNode): RBTreeNode {
    if (x.right !== SN) {
      return this.getLeftMost(x.right);
    }

    let y: RBTreeNode = x.parent;
    while (y !== SN && y !== null && x === y.right) {
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
    if (x.left !== SN) {
      return this.getRightMost(x.left);
    }

    let y: RBTreeNode = x.parent;
    while (y !== SN && x === y.left) {
      x = y;
      y = y.parent;
    }

    return y;
  }

  /**
   * The function performs a left rotation on a red-black tree node.
   * @param {RBTreeNode} x - The parameter `x` is a RBTreeNode object.
   */
  protected _leftRotate(x: RBTreeNode): void {
    const y: RBTreeNode = x.right;
    x.right = y.left;
    if (y.left !== SN) {
      y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this._root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  /**
   * The function performs a right rotation on a red-black tree node.
   * @param {RBTreeNode} x - x is a RBTreeNode, which represents the node that needs to be right
   * rotated.
   */
  protected _rightRotate(x: RBTreeNode): void {
    const y: RBTreeNode = x.left;
    x.left = y.right;
    if (y.right !== SN) {
      y.right.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this._root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    y.right = x;
    x.parent = y;
  }

  /**
   * The _fixDelete function is used to rebalance the Red-Black Tree after a node deletion.
   * @param {RBTreeNode} x - The parameter `x` is of type `RBTreeNode`, which represents a node in a
   * red-black tree.
   */
  protected _fixDelete(x: RBTreeNode): void {
    let s: RBTreeNode;
    while (x !== this.root && x.color === RBTNColor.BLACK) {
      if (x === x.parent.left) {
        s = x.parent.right;
        if (s.color === 1) {
          s.color = RBTNColor.BLACK;
          x.parent.color = RBTNColor.RED;
          this._leftRotate(x.parent);
          s = x.parent.right;
        }

        if (s.left !== null && s.left.color === RBTNColor.BLACK && s.right.color === RBTNColor.BLACK) {
          s.color = RBTNColor.RED;
          x = x.parent;
        } else {
          if (s.right.color === RBTNColor.BLACK) {
            s.left.color = RBTNColor.BLACK;
            s.color = RBTNColor.RED;
            this._rightRotate(s);
            s = x.parent.right;
          }

          s.color = x.parent.color;
          x.parent.color = RBTNColor.BLACK;
          s.right.color = RBTNColor.BLACK;
          this._leftRotate(x.parent);
          x = this.root;
        }
      } else {
        s = x.parent.left;
        if (s.color === 1) {
          s.color = RBTNColor.BLACK;
          x.parent.color = RBTNColor.RED;
          this._rightRotate(x.parent);
          s = x.parent.left;
        }

        if (s.right.color === RBTNColor.BLACK && s.right.color === RBTNColor.BLACK) {
          s.color = RBTNColor.RED;
          x = x.parent;
        } else {
          if (s.left.color === RBTNColor.BLACK) {
            s.right.color = RBTNColor.BLACK;
            s.color = RBTNColor.RED;
            this._leftRotate(s);
            s = x.parent.left;
          }

          s.color = x.parent.color;
          x.parent.color = RBTNColor.BLACK;
          s.left.color = RBTNColor.BLACK;
          this._rightRotate(x.parent);
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
    if (u.parent === null) {
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
    let u: RBTreeNode;
    while (k.parent.color === 1) {
      if (k.parent === k.parent.parent.right) {
        u = k.parent.parent.left;
        if (u.color === 1) {
          u.color = RBTNColor.BLACK;
          k.parent.color = RBTNColor.BLACK;
          k.parent.parent.color = RBTNColor.RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.left) {
            k = k.parent;
            this._rightRotate(k);
          }

          k.parent.color = RBTNColor.BLACK;
          k.parent.parent.color = RBTNColor.RED;
          this._leftRotate(k.parent.parent);
        }
      } else {
        u = k.parent.parent.right;

        if (u.color === 1) {
          u.color = RBTNColor.BLACK;
          k.parent.color = RBTNColor.BLACK;
          k.parent.parent.color = RBTNColor.RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.right) {
            k = k.parent;
            this._leftRotate(k);
          }

          k.parent.color = RBTNColor.BLACK;
          k.parent.parent.color = RBTNColor.RED;
          this._rightRotate(k.parent.parent);
        }
      }
      if (k === this.root) {
        break;
      }
    }
    this.root.color = RBTNColor.BLACK;
  }
}
