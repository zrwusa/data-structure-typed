import { BinaryTreeDeletedResult, BinaryTreeNodeId, RBColor, RBTreeNodeNested, RBTreeOptions } from '../../types';
import { IRBTree, IRBTreeNode } from '../../interfaces';
import { BST, BSTNode } from './bst';

export class RBTreeNode<T = any, NEIGHBOR extends RBTreeNode<T, NEIGHBOR> = RBTreeNodeNested<T>>
  extends BSTNode<T, NEIGHBOR>
  implements IRBTreeNode<T, NEIGHBOR>
{
  constructor(id: BinaryTreeNodeId, val?: T) {
    super(id, val);
    this._color = RBColor.RED;
  }

  private _color: RBColor;

  get color(): RBColor {
    return this._color;
  }

  set color(value: RBColor) {
    this._color = value;
  }
}

export class RBTree<N extends RBTreeNode<N['val'], N> = RBTreeNode> extends BST<N> implements IRBTree<N> {
  constructor(options?: RBTreeOptions) {
    super(options);
  }

  override createNode(id: BinaryTreeNodeId, val?: N['val']): N {
    return new RBTreeNode(id, val) as N;
  }

  // 添加节点到红黑树
  override add(idOrNode: BinaryTreeNodeId | N | null, val?: N['val']): N | null | undefined {
    // 首先，调用父类的添加方法
    const newNode = super.add(idOrNode, val);

    // 如果插入的是根节点或插入的节点为红色，需要执行平衡修复
    if (newNode && (newNode === this.root || newNode.color === RBColor.RED)) {
      this.fixInsertViolation(newNode);
    }

    return newNode;
  }


// Method for fixing insert violations in a red-black tree
  private fixInsertViolation(node: N) {
    let parent, grandparent, uncle;

    while (
      node !== this.root &&
      node.color === RBColor.RED &&
      node.parent!.color === RBColor.RED
      ) {
      parent = node.parent!;
      grandparent = parent.parent!;

      // Case 1: The uncle node is red
      if (parent === grandparent.left) {
        uncle = grandparent.right;

        if (uncle && uncle.color === RBColor.RED) {
          grandparent.color = RBColor.RED;
          parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          node = grandparent;
        } else {
          // Case 2: The uncle node is black, and the current node is a right child
          if (node === parent.right) {
            this.rotateLeft(parent);
            node = parent;
            parent = node.parent!;
          }

          // Case 3: The uncle node is black, and the current node is a left child
          parent.color = RBColor.BLACK;
          grandparent.color = RBColor.RED;
          this.rotateRight(grandparent);
        }
      } else {
        // Symmetric case: The parent is the right child of the grandparent
        uncle = grandparent.left;

        if (uncle && uncle.color === RBColor.RED) {
          grandparent.color = RBColor.RED;
          parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          node = grandparent;
        } else {
          // Case 2: The uncle node is black, and the current node is a left child
          if (node === parent.left) {
            this.rotateRight(parent);
            node = parent;
            parent = node.parent!;
          }

          // Case 3: The uncle node is black, and the current node is a right child
          parent.color = RBColor.BLACK;
          grandparent.color = RBColor.RED;
          this.rotateLeft(grandparent);
        }
      }
    }

    // The root node is always black
    this.root!.color = RBColor.BLACK;
  }

// Left rotation operation
  private rotateLeft(node: N) {
    const rightChild = node.right;

    // Connect the left child of the right node to the current node's right child
    node.right = rightChild!.left;
    if (rightChild!.left) {
      rightChild!.left.parent = node;
    }

    // Update the parent of the right child to the current node's parent
    rightChild!.parent = node.parent;

    // If the current node is the root node, update the root to be the right child
    if (rightChild !== undefined && node === this.root) {
      this._setRoot(rightChild);
    } else if (node === node.parent!.left) {
      // If the current node is the left child of the parent, update the parent's left child to be the right child
      node.parent!.left = rightChild;
    } else {
      // If the current node is the right child of the parent, update the parent's right child to be the right child
      node.parent!.right = rightChild;
    }

    // Set the current node as the left child of the right node
    rightChild!.left = node;
    node.parent = rightChild;
  }

// Right rotation operation
  private rotateRight(node: N) {
    const leftChild = node.left;

    // Connect the right child of the left node to the current node's left child
    node.left = leftChild!.right;
    if (leftChild!.right) {
      leftChild!.right.parent = node;
    }

    // Update the parent of the left child to the current node's parent
    leftChild!.parent = node.parent;

    // If the current node is the root node, update the root to be the left child
    if (leftChild !== undefined && node === this.root) {
      this._setRoot(leftChild);
    } else if (node === node.parent!.right) {
      // If the current node is the right child of the parent, update the parent's right child to be the left child
      node.parent!.right = leftChild;
    } else {
      // If the current node is the left child of the parent, update the parent's left child to be the left child
      node.parent!.left = leftChild;
    }

    // Set the current node as the right child of the left node
    leftChild!.right = node;
    node.parent = leftChild;
  }
  private _isNodeRed(node: N | null | undefined): boolean {
    return node ? node.color === RBColor.RED : false;
  }
// Find the sibling node
  private _findSibling(node: N): N | null | undefined {
    if (!node.parent) {
      return undefined;
    }

    return node === node.parent.left ? node.parent.right : node.parent.left;
  }
// Remove a node
  private _removeNode(node: N, replacement: N | null | undefined): void {
    if (node === this.root && !replacement) {
      // If there's only the root node and no replacement, simply remove the root node
      this._setRoot(null);
    } else if (node === this.root || this._isNodeRed(node)) {
      // If the node is the root or a red node, remove it directly
      if (node.parent!.left === node) {
        node.parent!.left = replacement;
      } else {
        node.parent!.right = replacement;
      }

      if (replacement) {
        replacement.parent = node.parent;
        replacement.color = RBColor.BLACK; // Set the replacement node's color to black
      }
    } else {
      // If the node is a black node, perform removal and repair
      const sibling = this._findSibling(node);

      if (node.parent!.left === node) {
        node.parent!.left = replacement;
      } else {
        node.parent!.right = replacement;
      }

      if (replacement) {
        replacement.parent = node.parent;
      }

      if (!this._isNodeRed(sibling)) {
        // If the sibling node is black, perform repair
        this.fixDeleteViolation(replacement || node);
      }
    }

    node.parent = null;
    node.left = null;
    node.right = null;
  }

  override remove(nodeOrId: BinaryTreeNodeId | N): BinaryTreeDeletedResult<N>[] {
    const node = this.get(nodeOrId);
    const result: BinaryTreeDeletedResult<N>[] = [{ deleted: undefined, needBalanced: null }];
    if (!node) return result; // Node does not exist

    const replacement = this._getReplacementNode(node);

    const isRed = this._isNodeRed(node);
    const isRedReplacement = this._isNodeRed(replacement);

    // Remove the node
    this._removeNode(node, replacement);

    if (isRed || isRedReplacement) {
      // If the removed node is red or the replacement node is red, no repair is needed
      return result;
    }

    this.fixDeleteViolation(replacement);
    return result;
  }

  // Repair operation after node deletion
  private fixDeleteViolation(node: N | null | undefined) {
    let sibling;
    if (node) {
      while (node !== this.root && !this._isNodeRed(node)) {
        if (node === node.parent!.left) {
          sibling = node.parent!.right;

          if (this._isNodeRed(sibling) && sibling) {
            // Case 1: The sibling node is red
            sibling.color = RBColor.BLACK;
            node.parent!.color = RBColor.RED;
            this.rotateLeft(node.parent!);
            sibling = node.parent!.right;
          }

          if (!sibling) return;

          if (!this._isNodeRed(sibling.left) && !this._isNodeRed(sibling.right)) {
            // Case 2: The sibling node and its children are all black
            sibling.color = RBColor.RED;
            node = node.parent!;
          } else {
            if (!this._isNodeRed(sibling.right)) {
              // Case 3: The sibling node is black, and the left child is red, the right child is black
              sibling.left!.color = RBColor.BLACK;
              sibling.color = RBColor.RED;
              this.rotateRight(sibling);
              sibling = node.parent!.right;
            }

            // Case 4: The sibling node is black, and the right child is red
            if (sibling !== null && sibling !== undefined) {
              sibling.color = node.parent!.color;
              node.parent!.color = RBColor.BLACK;
              sibling.right!.color = RBColor.BLACK;
              this.rotateLeft(node.parent!);
              node = this.root!;
            }
          }
        } else {
          // Symmetric case: The parent is the right child of the grandparent
          sibling = node.parent!.left;

          if (this._isNodeRed(sibling) && sibling) {
            // Case 1: The sibling node is red
            sibling.color = RBColor.BLACK;
            node.parent!.color = RBColor.RED;
            this.rotateRight(node.parent!);
            sibling = node.parent!.left;
          }

          if (!sibling) return;

          if (!this._isNodeRed(sibling.left) && !this._isNodeRed(sibling.right)) {
            // Case 2: The sibling node and its children are all black
            sibling.color = RBColor.RED;
            node = node.parent!;
          } else {
            if (!this._isNodeRed(sibling.left)) {
              // Case 3: The sibling node is black, and the right child is red, the left child is black
              sibling.right!.color = RBColor.BLACK;
              sibling.color = RBColor.RED;
              this.rotateLeft(sibling);
              sibling = node.parent!.left;
            }

            // Case 4: The sibling node is black, and the left child is red
            if (sibling !== null && sibling !== undefined) {
              sibling.color = node.parent!.color;
              node.parent!.color = RBColor.BLACK;
              sibling.left!.color = RBColor.BLACK;
              this.rotateRight(node.parent!);
              node = this.root!;
            }
          }
        }
      }

      if (node !== null && node !== undefined) {
        node.color = RBColor.BLACK;
      }
    }
  }

  private _findMin(node: N): N {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  // Get the replacement node
  private _getReplacementNode(node: N): N | null | undefined {
    if (node.left && node.right) {
      return this._findSuccessor(node);
    }

    if (!node.left && !node.right) {
      return null as any; // Return a fake node with color black
    }

    return node.left || node.right;
  }
// Find the successor node
  private _findSuccessor(node: N): N | null | undefined {
    if (node.right) {
      // If the node has a right child, find the minimum node in the right subtree as the successor
      return this._findMin(node.right);
    }

    // Otherwise, traverse upward until finding the first parent whose left child is the current node
    let parent = node.parent;
    while (parent && node === parent.right) {
      node = parent;
      parent = parent.parent;
    }

    return parent;
  }
}
