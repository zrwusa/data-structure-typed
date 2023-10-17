import {BinaryTreeNodeKey, RBColor, RBTreeNodeNested, RBTreeOptions} from '../../types';
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

  // override add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val']): N | null | undefined {
  //   const inserted = super.add(keyOrNode, val);
  //   if (inserted) this._fixInsertViolation(inserted);
  //   return inserted;
  // }
  //
  // // Method for fixing insert violations in a red-black tree
  // private _fixInsertViolation(node: N) {
  //   while (node !== this.root! && node.color === RBColor.RED && node.parent!.color === RBColor.RED) {
  //     const parent = node.parent!;
  //     const grandparent = parent.parent!;
  //     let uncle: N | null | undefined = null;
  //
  //     if (parent === grandparent.left) {
  //       uncle = grandparent.right;
  //
  //       // Case 1: The uncle node is red
  //       if (uncle && uncle.color === RBColor.RED) {
  //         grandparent.color = RBColor.RED;
  //         parent.color = RBColor.BLACK;
  //         uncle.color = RBColor.BLACK;
  //         node = grandparent;
  //       } else {
  //         // Case 2: The uncle node is black, and the current node is a right child
  //         if (node === parent.right) {
  //           this._rotateLeft(parent);
  //           node = parent;
  //           // Update parent reference
  //           node.parent = grandparent;
  //           parent.parent = node;
  //         }
  //
  //         // Case 3: The uncle node is black, and the current node is a left child
  //         parent.color = RBColor.BLACK;
  //         grandparent.color = RBColor.RED;
  //         this._rotateRight(grandparent);
  //       }
  //     } else {
  //       // Symmetric case: The parent is the right child of the grandparent
  //       uncle = grandparent.left;
  //
  //       // Case 1: The uncle node is red
  //       if (uncle && uncle.color === RBColor.RED) {
  //         grandparent.color = RBColor.RED;
  //         parent.color = RBColor.BLACK;
  //         uncle.color = RBColor.BLACK;
  //         node = grandparent;
  //       } else {
  //         // Case 2: The uncle node is black, and the current node is a left child
  //         if (node === parent.left) {
  //           this._rotateRight(parent);
  //           node = parent;
  //           // Update parent reference
  //           node.parent = grandparent;
  //           parent.parent = node;
  //         }
  //
  //         // Case 3: The uncle node is black, and the current node is a right child
  //         parent.color = RBColor.BLACK;
  //         grandparent.color = RBColor.RED;
  //         this._rotateLeft(grandparent);
  //       }
  //     }
  //   }
  //
  //   // The root node is always black
  //   this.root!.color = RBColor.BLACK;
  // }
  //
  // // Left rotation operation
  // private _rotateLeft(node: N) {
  //   const rightChild = node.right;
  //   node.right = rightChild!.left;
  //
  //   if (rightChild!.left) {
  //     rightChild!.left.parent = node;
  //   }
  //
  //   rightChild!.parent = node.parent;
  //
  //   if (node === this.root) {
  //     // @ts-ignore
  //     this._setRoot(rightChild);
  //   } else if (node === node.parent!.left) {
  //     node.parent!.left = rightChild;
  //   } else {
  //     node.parent!.right = rightChild;
  //   }
  //
  //   rightChild!.left = node;
  //   node.parent = rightChild;
  // }
  //
  // // Right rotation operation
  // private _rotateRight(node: N) {
  //   const leftChild = node.left;
  //   node.left = leftChild!.right;
  //
  //   if (leftChild!.right) {
  //     leftChild!.right.parent = node;
  //   }
  //
  //   leftChild!.parent = node.parent;
  //
  //   if (node === this.root) {
  //     // @ts-ignore
  //     this._setRoot(leftChild);
  //   } else if (node === node.parent!.right) {
  //     node.parent!.right = leftChild;
  //   } else {
  //     node.parent!.left = leftChild;
  //   }
  //
  //   leftChild!.right = node;
  //   node.parent = leftChild;
  // }
  //
  // private _isNodeRed(node: N | null | undefined): boolean {
  //   return node ? node.color === RBColor.RED : false;
  // }
  //
  // // Find the sibling node
  // private _findSibling(node: N): N | null | undefined {
  //   if (!node.parent) {
  //     return undefined;
  //   }
  //
  //   return node === node.parent.left ? node.parent.right : node.parent.left;
  // }
  //
  // // Remove a node
  // private _removeNode(node: N, replacement: N | null | undefined): void {
  //   if (node === this.root && !replacement) {
  //     // If there's only the root node and no replacement, simply remove the root node
  //     this._setRoot(null);
  //   } else if (node === this.root || this._isNodeRed(node)) {
  //     // If the node is the root or a red node, remove it directly
  //     if (node.parent!.left === node) {
  //       node.parent!.left = replacement;
  //     } else {
  //       node.parent!.right = replacement;
  //     }
  //
  //     if (replacement) {
  //       replacement.parent = node.parent!;
  //       replacement.color = RBColor.BLACK; // Set the replacement node's color to black
  //     }
  //   } else {
  //     // If the node is a black node, perform removal and repair
  //     const sibling = this._findSibling(node);
  //
  //     if (node.parent!.left === node) {
  //       node.parent!.left = replacement;
  //     } else {
  //       node.parent!.right = replacement;
  //     }
  //
  //     if (replacement) {
  //       replacement.parent = node.parent;
  //     }
  //
  //     if (!this._isNodeRed(sibling)) {
  //       // If the sibling node is black, perform repair
  //       this._fixDeleteViolation(replacement || node);
  //     }
  //   }
  //
  //   if (node.parent) {
  //     node.parent = null;
  //   }
  //   node.left = null;
  //   node.right = null;
  // }
  //
  // override remove(nodeOrKey: BinaryTreeNodeKey | N): BinaryTreeDeletedResult<N>[] {
  //   const node = this.get(nodeOrKey);
  //   const result: BinaryTreeDeletedResult<N>[] = [{deleted: undefined, needBalanced: null}];
  //   if (!node) return result; // Node does not exist
  //
  //   const replacement = this._getReplacementNode(node);
  //
  //   const isRed = this._isNodeRed(node);
  //   const isRedReplacement = this._isNodeRed(replacement);
  //
  //   // Remove the node
  //   this._removeNode(node, replacement);
  //
  //   if (isRed || isRedReplacement) {
  //     // If the removed node is red or the replacement node is red, no repair is needed
  //     return result;
  //   }
  //
  //   // Repair any violation introduced by the removal
  //   this._fixDeleteViolation(replacement);
  //
  //   return result;
  // }
  //
  // // Repair operation after node deletion
  // private _fixDeleteViolation(node: N | null | undefined) {
  //   let sibling;
  //
  //   while (node && node !== this.root && !this._isNodeRed(node)) {
  //     if (node === node.parent!.left) {
  //       sibling = node.parent!.right;
  //
  //       if (sibling && this._isNodeRed(sibling)) {
  //         // Case 1: The sibling node is red
  //         sibling.color = RBColor.BLACK;
  //         node.parent!.color = RBColor.RED;
  //         this._rotateLeft(node.parent!);
  //         sibling = node.parent!.right;
  //       }
  //
  //       if (!sibling) return;
  //
  //       if (
  //         (!sibling.left || sibling.left.color === RBColor.BLACK) &&
  //         (!sibling.right || sibling.right.color === RBColor.BLACK)
  //       ) {
  //         // Case 2: The sibling node and its children are all black
  //         sibling.color = RBColor.RED;
  //         node = node.parent!;
  //       } else {
  //         if (!(sibling.right && this._isNodeRed(sibling.right))) {
  //           // Case 3: The sibling node is black, and the left child is red, the right child is black
  //           sibling.left!.color = RBColor.BLACK;
  //           sibling.color = RBColor.RED;
  //           this._rotateRight(sibling);
  //           sibling = node.parent!.right;
  //         }
  //
  //         // Case 4: The sibling node is black, and the right child is red
  //         if (sibling) {
  //           sibling.color = node.parent!.color;
  //         }
  //         if (node.parent) {
  //           node.parent.color = RBColor.BLACK;
  //         }
  //         if (sibling!.right) {
  //           sibling!.right.color = RBColor.BLACK;
  //         }
  //         this._rotateLeft(node.parent!);
  //         node = this.root;
  //       }
  //     } else {
  //       // Symmetric case: The parent is the right child of the grandparent
  //       sibling = node.parent!.left;
  //
  //       if (sibling && this._isNodeRed(sibling)) {
  //         // Case 1: The sibling node is red
  //         sibling.color = RBColor.BLACK;
  //         node.parent!.color = RBColor.RED;
  //         this._rotateRight(node.parent!);
  //         sibling = node.parent!.left;
  //       }
  //
  //       if (!sibling) return;
  //
  //       if (
  //         (!sibling.left || sibling.left.color === RBColor.BLACK) &&
  //         (!sibling.right || sibling.right.color === RBColor.BLACK)
  //       ) {
  //         // Case 2: The sibling node and its children are all black
  //         sibling.color = RBColor.RED;
  //         node = node.parent!;
  //       } else {
  //         if (!(sibling.left && this._isNodeRed(sibling.left))) {
  //           // Case 3: The sibling node is black, and the right child is red, the left child is black
  //           sibling.right!.color = RBColor.BLACK;
  //           sibling.color = RBColor.RED;
  //           this._rotateLeft(sibling);
  //           sibling = node.parent!.left;
  //         }
  //
  //         // Case 4: The sibling node is black, and the left child is red
  //         if (sibling) {
  //           sibling.color = node.parent!.color;
  //         }
  //         if (node.parent) {
  //           node.parent.color = RBColor.BLACK;
  //         }
  //         if (sibling!.left) {
  //           sibling!.left.color = RBColor.BLACK;
  //         }
  //         this._rotateRight(node.parent!);
  //         node = this.root;
  //       }
  //     }
  //   }
  //
  //   if (node) {
  //     node.color = RBColor.BLACK;
  //   }
  // }
  //
  // private _findMin(node: N): N {
  //   while (node.left) {
  //     node = node.left;
  //   }
  //   return node;
  // }
  //
  // // Get the replacement node
  // private _getReplacementNode(node: N): N | null | undefined {
  //   if (node.left && node.right) {
  //     return this._findSuccessor(node);
  //   }
  //
  //   if (!node.left && !node.right) {
  //     return null; // Return a fake node with color black
  //   }
  //
  //   return node.left || node.right;
  // }
  //
  // // Find the successor node
  // private _findSuccessor(node: N): N | null | undefined {
  //   if (node.right) {
  //     // If the node has a right child, find the minimum node in the right subtree as the successor
  //     return this._findMin(node.right);
  //   }
  //
  //   // Otherwise, traverse upward until finding the first parent whose left child is the current node
  //   let parent = node.parent;
  //   while (parent && node === parent.right) {
  //     node = parent;
  //     parent = parent.parent;
  //   }
  //
  //   return parent;
  // }
}
