import {BinaryTreeDeletedResult, BinaryTreeNodeId, RBColor, RBTreeNodeNested, RBTreeOptions} from '../../types';
import {IRBTree, IRBTreeNode} from '../../interfaces';
import {BST, BSTNode} from './bst';

export class RBTreeNode<V = any, NEIGHBOR extends RBTreeNode<V, NEIGHBOR> = RBTreeNodeNested<V>>
  extends BSTNode<V, NEIGHBOR>
  implements IRBTreeNode<V, NEIGHBOR> {

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


  private fixInsertion(node: N): void {
    while (node !== this.root && node.parent?.color === RBColor.RED) {
      if (node.parent === node.parent?.parent?.left) {
        const uncle = node.parent?.parent?.right;
        if (uncle?.color === RBColor.RED) {
          node.parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          node.parent.parent.color = RBColor.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent?.right) {
            node = node.parent;
            this.leftRotate(node);
          }
          if (node?.parent) node.parent.color = RBColor.BLACK;
          if (node?.parent?.parent) {
            node.parent.parent.color = RBColor.RED;
            this.rightRotate(node.parent.parent);
          }
        }
      } else {
        const uncle = node.parent?.parent?.left;
        if (uncle?.color === RBColor.RED) {
          node.parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          if (node.parent.parent) {
            node.parent.parent.color = RBColor.RED;
            node = node.parent.parent;
          }
        } else {
          if (node === node.parent?.left) {
            node = node.parent;
            this.rightRotate(node);
          }
          if (node.parent) node.parent.color = RBColor.BLACK;
          if (node?.parent?.parent) {
            node.parent.parent.color = RBColor.RED;
            this.leftRotate(node.parent.parent);
          }
        }
      }
    }
    if (this.root) this.root.color = RBColor.BLACK;
  }

  private leftRotate(node: N): void {
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
    // Update colors after rotation
    const originalNodeColor = node.color;
    node.color = rightChild.color;
    rightChild.color = originalNodeColor;
  }

  private rightRotate(node: N): void {
    const leftChild = node.left;
    if (!leftChild) return;

    node.left = leftChild.right;
    if (leftChild.right) {
      leftChild.right.parent = node;
    }

    leftChild.parent = node.parent;
    if (!node.parent) {
      this._setRoot(leftChild);
    } else if (node === node.parent.left) {
      node.parent.left = leftChild;
    } else {
      node.parent.right = leftChild;
    }

    leftChild.right = node;
    node.parent = leftChild;
    // Update colors after rotation
    const originalNodeColor = node.color;
    node.color = leftChild.color;
    leftChild.color = originalNodeColor;
  }

  override add(id: BinaryTreeNodeId, val?: N['val']) {
    let newNode = this.createNode(id, val);
    if (!this.root) {
      // Set the root node color to BLACK if this is the first node
      newNode.color = RBColor.BLACK;
      this._setRoot(newNode);
    } else {
      this.insertNode(newNode);
      this.fixInsertion(newNode);
      // Update the root to the actual root of the tree after fixInsertion
      while (newNode.parent) {
        newNode = newNode.parent;
      }
      this._setRoot(newNode);
    }

    return newNode;
  }

  private insertNode(node: N): void {
    let current: N | null | undefined = this.root;
    let parent: N | null = null;
    while (current) {
      parent = current;
      if (node.id < current.id) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    node.parent = parent;
    if (!parent) {
      this._setRoot(node);
    } else if (node.id < parent.id) {
      parent.left = node;
    } else {
      parent.right = node;
    }
  }

  private transplant(u: N, v: N | null | undefined): void {
    if (!u.parent) {
      // If u is the root, set v as the new root
      if (v !== undefined) this._setRoot(v);
    } else if (u === u.parent.left) {
      // If u is a left child, set v as the left child of u's parent
      u.parent.left = v;
    } else {
      // If u is a right child, set v as the right child of u's parent
      u.parent.right = v;
    }

    if (v) {
      // If v is not null, update its parent to be u's parent
      v.parent = u.parent;
    }
  }
  private minimum(node: N): N | null | undefined {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  override remove(nodeOrId: BinaryTreeNodeId | N): BinaryTreeDeletedResult<N>[] {
    const deletedNodes: BinaryTreeDeletedResult<N>[] = [];

    // Determine if the nodeOrId is a node or an ID
    const node: N | null = typeof nodeOrId === 'number' ? this.get(nodeOrId) : nodeOrId;
    if (!node) return deletedNodes;

    // We maintain a pointer to the deleted node and its parent.
    const needBalanced: N | null = null;

    // Determine the color of the node to be deleted
    let originalColor: RBColor = node.color;

    let child: N | null | undefined = null;

    if (!node.left) {
      // Case 1: The node to be deleted has no left child
      child = node.right;
      this.transplant(node, node.right);
    } else if (!node.right) {
      // Case 2: The node to be deleted has no right child
      child = node.left;
      this.transplant(node, node.left);
    } else {
      // Case 3: The node to be deleted has two children
      const successor = this.minimum(node.right);
      if (successor) {
        originalColor = successor?.color;
        child = successor.right;

        if (successor.parent === node) {
          if (child) child.parent = successor; // Update child's parent
        } else {
          this.transplant(successor, successor.right);
          successor.right = node.right;
          successor.right.parent = successor;
        }

        this.transplant(node, successor);
        successor.left = node.left;
        successor.left.parent = successor;
        successor.color = node.color;
      }

    }

    if (originalColor === RBColor.BLACK) {
      if (child) this.fixDeletion(child);
    }

    // Update the tree size
    this._setSize(this.size - 1);

    deletedNodes.push({ deleted: node, needBalanced });
    return deletedNodes;
  }
  private fixDeletion(node: N): void {
    while (node !== this.root && node.color === RBColor.BLACK) {
      if (node === node.parent?.left) {
        let sibling = node.parent?.right;
        if (sibling?.color === RBColor.RED) {
          // Case 1: Sibling is red, perform rotation and recoloring.
          sibling.color = RBColor.BLACK;
          node.parent.color = RBColor.RED;
          this.leftRotate(node.parent);
          sibling = node.parent?.right;
        }
        if (
          (!sibling?.left || sibling.left.color === RBColor.BLACK) &&
          (!sibling?.right || sibling.right.color === RBColor.BLACK)
        ) {
          // Case 2: Both of sibling's children are black.
          if (sibling) sibling.color = RBColor.RED;
          node = node.parent;
        } else {
          if (!sibling?.right || sibling.right.color === RBColor.BLACK) {
            // Case 3: Sibling's left child is red, right child is black.
            sibling.left!.color = RBColor.BLACK;
            sibling.color = RBColor.RED;
            this.rightRotate(sibling);
            sibling = node.parent?.right;
          }
          // Case 4: Sibling's right child is red.
          sibling!.color = node.parent!.color;
          node.parent!.color = RBColor.BLACK;
          sibling!.right!.color = RBColor.BLACK;
          this.leftRotate(node.parent!);
          if (this.root) node = this.root; // Terminate the loop
        }
      } else {
        let sibling = node.parent?.left;
        if (sibling?.color === RBColor.RED) {
          // Case 1: Sibling is red, perform rotation and recoloring.
          sibling.color = RBColor.BLACK;
          if (node.parent) {
            node.parent.color = RBColor.RED;
            this.rightRotate(node.parent);
            sibling = node.parent?.left;
          }

        }
        if (
          (!sibling?.left || sibling.left.color === RBColor.BLACK) &&
          (!sibling?.right || sibling.right.color === RBColor.BLACK)
        ) {
          // Case 2: Both of sibling's children are black.
          if (sibling) sibling.color = RBColor.RED;
          if (node.parent) node = node.parent;
        } else {
          if (!sibling?.right || sibling.right.color === RBColor.BLACK) {
            // Case 3: Sibling's right child is red, left child is black.
            sibling.right!.color = RBColor.BLACK;
            sibling.color = RBColor.RED;
            this.leftRotate(sibling);
            sibling = node.parent?.left;
          }
          // Case 4: Sibling's left child is red.
          sibling!.color = node.parent!.color;
          node.parent!.color = RBColor.BLACK;
          sibling!.left!.color = RBColor.BLACK;
          this.rightRotate(node.parent!);
          if (this.root) node = this.root; // Terminate the loop
        }
      }
    }
    node.color = RBColor.BLACK; // Ensure the root is always black.
  }

}
