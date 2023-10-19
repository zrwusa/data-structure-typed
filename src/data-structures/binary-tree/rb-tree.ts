import {BinaryTreeDeletedResult, BinaryTreeNodeKey, RBColor, RBTreeNodeNested, RBTreeOptions} from '../../types';
import {IBinaryTree} from '../../interfaces';
import {BST, BSTNode} from './bst';

export class RBTreeNode<V = any, FAMILY extends RBTreeNode<V, FAMILY> = RBTreeNodeNested<V>> extends BSTNode<
  V,
  FAMILY
> {
  private _color: RBColor;

  constructor(key: BinaryTreeNodeKey, val?: V) {
    super(key, val);
    this._color = RBColor.RED;
  }

  get color(): RBColor {
    return this._color;
  }

  set color(value: RBColor) {
    this._color = value;
  }
}

export class RBTree<N extends RBTreeNode<N['val'], N> = RBTreeNode> extends BST<N> implements IBinaryTree<N> {
  constructor(options?: RBTreeOptions) {
    super(options);
  }

  override createNode(key: BinaryTreeNodeKey, val?: N['val']): N {
    return new RBTreeNode(key, val) as N;
  }

  override add(key: BinaryTreeNodeKey, val?: N['val']): N {
    const newNode = this.createNode(key, val);
    if (!this.root) {
      this._setRoot(newNode);
      newNode.color = RBColor.BLACK;
    } else {
      this.insertNode(this.root, newNode);
      this.fixInsertViolations(newNode);
    }
    this._setSize(this.size + 1);
    return newNode;
  }

  private insertNode(root: N, node: N): void {
    if (node.key < root.key) {
      if (!root.left) {
        root.left = node;
        node.parent = root;
      } else {
        this.insertNode(root.left as N, node);
      }
    } else if (node.key > root.key) {
      if (!root.right) {
        root.right = node;
        node.parent = root;
      } else {
        this.insertNode(root.right as N, node);
      }
    }
  }

  private fixInsertViolations(node: N): void {
    let parent: N | undefined = undefined;
    let grandparent: N | undefined = undefined;

    while (node !== this.root && node.color === RBColor.RED && node.parent?.color === RBColor.RED) {
      parent = node.parent as N;
      grandparent = parent.parent as N;

      if (parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle && uncle.color === RBColor.RED) {
          grandparent.color = RBColor.RED;
          parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          node = grandparent;
        } else {
          if (node === parent.right) {
            this.rotateLeft(parent);
            node = parent;
            parent = node.parent as N;
          }

          this.rotateRight(grandparent as N);

          const tempColor = parent.color;
          parent.color = grandparent.color;
          grandparent.color = tempColor;

          node = parent;
        }
      } else {
        const uncle = grandparent.left;

        if (uncle && uncle.color === RBColor.RED) {
          grandparent.color = RBColor.RED;
          parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          node = grandparent;
        } else {
          if (node === parent.left) {
            this.rotateRight(parent);
            node = parent;
            parent = node.parent as N;
          }

          this.rotateLeft(grandparent as N);

          const tempColor = parent.color;
          parent.color = grandparent.color;
          grandparent.color = tempColor;

          node = parent;
        }
      }
    }

    if (this.root) this.root.color = RBColor.BLACK;
  }

  private rotateLeft(node: N): void {
    const rightChild = node.right;
    if (!rightChild) return;

    node.right = rightChild.left;
    if (rightChild.left) {
      rightChild.left.parent = node;
    }
    rightChild.parent = node.parent;
    if (!node.parent) {
      this._setRoot(rightChild);
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }
    rightChild.left = node;
    node.parent = rightChild;
  }

  private rotateRight(node: N): void {
    const leftChild = node.left;
    if (!leftChild) return;

    node.left = leftChild.right;
    if (leftChild.right) {
      leftChild.right.parent = node;
    }
    leftChild.parent = node.parent;
    if (!node.parent) {
      this._setRoot(leftChild);
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }
    leftChild.right = node;
    node.parent = leftChild;
  }

  remove(nodeOrKey: BinaryTreeNodeKey | N): BinaryTreeDeletedResult<N>[] {
    const result: BinaryTreeDeletedResult<N>[] = [];
    if (this.root) {
      const nodeToRemove = typeof nodeOrKey === 'number' ? this.get(nodeOrKey) : nodeOrKey;
      if (nodeToRemove) {
        this.deleteNode(nodeToRemove);
        this._setSize(this.size - 1);
        result.push({deleted: nodeToRemove, needBalanced: undefined});
      }
    }
    return result;
  }

  private deleteNode(node: N): void {
    const parent = node.parent as N;
    const isLeftChild = parent && node === parent.left;

    if (!node.left && !node.right) {
      if (!parent) {
        this._setRoot(null);
      } else {
        if (!isLeftChild) {
          parent.right = undefined;
        } else {
          parent.left = undefined;
        }
      }
      return;
    }

    const child = node.left || node.right;
    if (child) child.parent = parent;

    if (!parent) {
      if (child) {
        this._setRoot(child);
        if (node.color === RBColor.BLACK && child.color === RBColor.RED) {
          child.color = RBColor.BLACK;
        }
      }
    } else {
      if (!isLeftChild) {
        parent.right = child;
      } else {
        parent.left = child;
      }

      if (node.color === RBColor.BLACK) {
        if (child && child.color === RBColor.RED) {
          // 如果删除的节点是黑色，而子节点是红色，直接将子节点染成黑色
          child.color = RBColor.BLACK;
        } else {
          // 否则，进入修复违反红黑树性质的情况
          this.fixDeleteViolations(child, parent, isLeftChild);
        }
      }

    }
  }

  private fixDeleteViolations(node: N | null | undefined, parent: N | undefined, isLeftChild: boolean): void {
    let sibling: N | undefined;

    while (node !== this.root && (!node || node.color === RBColor.BLACK)) {
      if (isLeftChild) {
        sibling = parent?.right as N;

        if (sibling?.color === RBColor.RED) {
          // Case 1: Sibling is red, transform into a case where sibling is black
          sibling.color = RBColor.BLACK;
          parent!.color = RBColor.RED;
          this.rotateLeft(parent!);
          sibling = parent!.right as N;
        }

        if (
          (!sibling?.left || sibling.left.color === RBColor.BLACK) &&
          (!sibling?.right || sibling.right.color === RBColor.BLACK)
        ) {
          // Case 2: Sibling and both of its children are black
          sibling.color = RBColor.RED;
          node = parent;
          parent = node?.parent as N;
          isLeftChild = node === parent?.left;
        } else {
          if (!sibling) {
            break;
          }

          if (!sibling.right || sibling.right.color === RBColor.BLACK) {
            // Case 3: Sibling is black, sibling's left child is red, and sibling's right child is black
            sibling!.left!.color = RBColor.BLACK;
            sibling.color = RBColor.RED;
            this.rotateRight(sibling);
            sibling = parent?.right as N;
          }

          // Case 4: Sibling is black, sibling's right child is red
          sibling.color = parent?.color as RBColor;
          parent!.color = RBColor.BLACK;
          sibling.right!.color = RBColor.BLACK;
          this.rotateLeft(parent!);
          node = this.root;
        }
      } else {
        sibling = parent?.left as N;

        if (sibling?.color === RBColor.RED) {
          // Case 1: Sibling is red, transform into a case where sibling is black
          sibling.color = RBColor.BLACK;
          parent!.color = RBColor.RED;
          this.rotateRight(parent!);
          sibling = parent!.left as N;
        }

        if (
          (!sibling?.right || sibling.right.color === RBColor.BLACK) &&
          (!sibling?.left || sibling.left.color === RBColor.BLACK)
        ) {
          // Case 2: Sibling and both of its children are black
          sibling.color = RBColor.RED;
          node = parent;
          parent = node?.parent as N;
          isLeftChild = node === parent?.left;
        } else {
          if (!sibling) {
            break;
          }

          if (!sibling.left || sibling.left.color === RBColor.BLACK) {
            // Case 3: Sibling is black, sibling's right child is red, and sibling's left child is black
            sibling!.right!.color = RBColor.BLACK;
            sibling.color = RBColor.RED;
            this.rotateLeft(sibling);
            sibling = parent!.left as N;
          }

          // Case 4: Sibling is black, sibling's left child is red
          sibling.color = parent?.color as RBColor;
          parent!.color = RBColor.BLACK;
          sibling.left!.color = RBColor.BLACK;
          this.rotateRight(parent!);
          node = this.root;
        }
      }
    }

    if (node) {
      node.color = RBColor.BLACK;
    }
  }


  isRBTree(): boolean {

    if (this.root) {
      const rootBlackHeight = this.computeBlackHeight(this.root);
      return rootBlackHeight > 0;
    }

    return true;
  }

  private computeBlackHeight(node: N | null | undefined): number {
    if (!node) {

      return 1;
    }

    const leftHeight = this.computeBlackHeight(node.left);
    const rightHeight = this.computeBlackHeight(node.right);

    if (leftHeight > 0 && rightHeight > 0 && leftHeight === rightHeight) {
      return node.color === RBColor.BLACK ? leftHeight + 1 : leftHeight;
    } else {
      return 0;
    }
  }
}
