/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {BST, BSTNode} from './bst';
import type {AVLTreeDeleted, BinaryTreeNodeId, RecursiveAVLTreeNode} from '../types';
import {IBinaryTreeNode} from '../interfaces';


export class AVLTreeNode<T, FAMILY extends AVLTreeNode<T, FAMILY> = RecursiveAVLTreeNode<T>> extends BSTNode<T, FAMILY> implements IBinaryTreeNode<T, FAMILY> {

}

export class AVLTree<N extends AVLTreeNode<N['val'], N> = AVLTreeNode<number>> extends BST<N> {

    override _createNode(id: BinaryTreeNodeId, val: N['val'], count?: number): N {
        const node = new AVLTreeNode<N['val'], N>(id, val, count);
        return node as N;
    }

    /**
     * The function overrides the add method of a Binary Search Tree to insert a node with a given id and value, and then
     * balances the tree.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier of the binary tree node that we want to add or
     * update in the AVL tree.
     * @param {N | null} val - The `val` parameter represents the value that you want to assign to the node with the given
     * `id`. It can be of type `N` (the generic type) or `null`.
     * @param {number} [count] - The `count` parameter is an optional parameter of type `number`. It represents the number
     * of times the value `val` should be inserted into the AVL tree. If the `count` parameter is not provided, it defaults
     * to `1`, indicating that the value should be inserted once.
     * @returns The method is returning either an N object or null.
     */
    override add(id: BinaryTreeNodeId, val: N['val'] | null, count?: number): N | null {
        const inserted = super.add(id, val, count);
        if (inserted) this.balancePath(inserted);
        return inserted;
    }

    /**
     * The function overrides the remove method of the Binary Search Tree class, performs the removal operation, and
     * then balances the tree if necessary.
     * @param {BinaryTreeNodeId} id - The `id` parameter represents the identifier of the binary tree node that needs to be
     * removed from the AVL tree.
     * @param {boolean} [isUpdateAllLeftSum] - The `isUpdateAllLeftSum` parameter is an optional boolean parameter that
     * determines whether the left sum of all nodes in the AVL tree should be updated after removing a node. If
     * `isUpdateAllLeftSum` is set to `true`, the left sum of all nodes will be recalculated.
     * @returns The method is returning an array of `AVLTreeDeleted<N>` objects.
     */
    override remove(id: BinaryTreeNodeId, isUpdateAllLeftSum?: boolean): AVLTreeDeleted<N>[] {
        const deletedResults = super.remove(id, isUpdateAllLeftSum);
        for (const {needBalanced} of deletedResults) {
            if (needBalanced) {
                this.balancePath(needBalanced);
            }
        }
        return deletedResults;
    }

    /**
     * The balance factor of a given AVL tree node is calculated by subtracting the height of its left subtree from the
     * height of its right subtree.
     * @param node - The parameter "node" is of type N, which represents a node in an AVL tree.
     * @returns The balance factor of the given AVL tree node.
     */
    balanceFactor(node: N): number {
        if (!node.right) // node has no right subtree
            return -node.height;
        else if (!node.left) // node has no left subtree
            return +node.height;
        else
            return node.right.height - node.left.height;
    }

    /**
     * The function updates the height of a node in an AVL tree based on the heights of its left and right subtrees.
     * @param node - The parameter `node` is an AVLTreeNode object, which represents a node in an AVL tree.
     */
    updateHeight(node: N): void {
        if (!node.left && !node.right) // node is a leaf
            node.height = 0;
        else if (!node.left) {
            // node has no left subtree
            const rightHeight = node.right ? node.right.height : 0;
            node.height = 1 + rightHeight;
        } else if (!node.right) // node has no right subtree
            node.height = 1 + node.left.height;
        else
            node.height = 1 + Math.max(node.right.height, node.left.height);
    }

    /**
     * The `balancePath` function balances the AVL tree by performing appropriate rotations based on the balance factor of
     * each node in the path from the given node to the root.
     * @param node - The `node` parameter is an AVLTreeNode object, which represents a node in an AVL tree.
     */
    balancePath(node: N): void {
        const path = this.getPathToRoot(node);
        for (let i = path.length - 1; i >= 0; i--) {
            const A = path[i];
            this.updateHeight(A);
            switch (this.balanceFactor(A)) {
                case -2:
                    if (A && A.left) {
                        if (this.balanceFactor(A.left) <= 0) {
                            this.balanceLL(A); // Perform LL rotation
                        } else {
                            this.balanceLR(A); // Perform LR rotation
                        }
                    }
                    break;
                case +2:
                    if (A && A.right) {
                        if (this.balanceFactor(A.right) >= 0) {
                            this.balanceRR(A); // Perform RR rotation
                        } else {
                            this.balanceRL(A); // Perform RL rotation
                        }
                    }
            }
        }
    }

    /**
     * The `balanceLL` function performs a left-left rotation on an AVL tree to balance it.
     * @param A - The parameter A is an AVLTreeNode object.
     */
    balanceLL(A: N): void {
        const parentOfA = A.parent;
        const B = A.left; // A is left-heavy and B is left-heavy
        A.parent = B;
        if (B && B.right) {
            B.right.parent = A;
        }
        if (B) B.parent = parentOfA;
        if (A === this.root) {
            if (B) this._setRoot(B);
        } else {
            if (parentOfA?.left === A) {
                parentOfA.left = B;
            } else {
                if (parentOfA) parentOfA.right = B;
            }
        }

        if (B) {
            A.left = B.right; // Make T2 the left subtree of A
            B.right = A; // Make A the left child of B
        }
        this.updateHeight(A);
        if (B) this.updateHeight(B);
    }

    /**
     * The `balanceLR` function performs a left-right rotation to balance an AVL tree.
     * @param A - A is an AVLTreeNode object.
     */
    balanceLR(A: N): void {
        const parentOfA = A.parent;
        const B = A.left; // A is left-heavy
        let C = null;
        if (B) {
            C = B.right;// B is right-heavy
        }
        if (A) A.parent = C;
        if (B) B.parent = C;

        if (C) {
            if (C.left) {
                C.left.parent = B;
            }
            if (C.right) {
                C.right.parent = A;
            }
            C.parent = parentOfA;
        }

        if (A === this.root) {
            if (C) this._setRoot(C);
        } else {
            if (parentOfA) {
                if (parentOfA.left === A) {
                    parentOfA.left = C;
                } else {
                    parentOfA.right = C;
                }
            }
        }

        if (C) {
            A.left = C.right; // Make T3 the left subtree of A
            if (B) B.right = C.left; // Make T2 the right subtree of B
            C.left = B;
            C.right = A;
        }

        this.updateHeight(A); // Adjust heights
        B && this.updateHeight(B);
        C && this.updateHeight(C);
    }

    /**
     * The `balanceRR` function performs a right-right rotation on an AVL tree to balance it.
     * @param A - The parameter A is an AVLTreeNode object.
     */
    balanceRR(A: N): void {
        const parentOfA = A.parent;
        const B = A.right; // A is right-heavy and B is right-heavy
        A.parent = B;
        if (B) {
            if (B.left) {
                B.left.parent = A;
            }
            B.parent = parentOfA;
        }

        if (A === this.root) {
            if (B) this._setRoot(B);
        } else {
            if (parentOfA) {
                if (parentOfA.left === A) {
                    parentOfA.left = B;
                } else {
                    parentOfA.right = B;
                }
            }
        }

        if (B) {
            A.right = B.left; // Make T2 the right subtree of A
            B.left = A;
        }
        this.updateHeight(A);
        B && this.updateHeight(B);
    }

    /**
     * The `balanceRL` function performs a right-left rotation to balance an AVL tree.
     * @param A - A is an AVLTreeNode object.
     */
    balanceRL(A: N): void {
        const parentOfA = A.parent;
        const B = A.right; // A is right-heavy
        let C = null;
        if (B) {
            C = B.left; // B is left-heavy
        }

        A.parent = C;
        if (B) B.parent = C;

        if (C) {
            if (C.left) {
                C.left.parent = A;
            }
            if (C.right) {
                C.right.parent = B;
            }
            C.parent = parentOfA;
        }


        if (A === this.root) {
            if (C) this._setRoot(C);
        } else {
            if (parentOfA) {
                if (parentOfA.left === A) {
                    parentOfA.left = C;
                } else {
                    parentOfA.right = C;
                }
            }
        }

        if (C) A.right = C.left; // Make T2 the right subtree of A
        if (B && C) B.left = C.right; // Make T3 the left subtree of B
        if (C) C.left = A;
        if (C) C.right = B;

        this.updateHeight(A); // Adjust heights
        B && this.updateHeight(B);
        C && this.updateHeight(C);
    }
}


