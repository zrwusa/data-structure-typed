import {AbstractBinaryTreeNode} from '../binary-tree/abstract-binary-tree';

/**
 * Enum representing different loop types.
 *
 * - `iterative`: Indicates the iterative loop type (with loops that use iterations).
 * - `recursive`: Indicates the recursive loop type (with loops that call themselves).
 */
export enum LoopType { iterative = 1, recursive = 2}

/* This enumeration defines the position of a node within a family tree composed of three associated nodes, where 'root' represents the root node of the family tree, 'left' represents the left child node, and 'right' represents the right child node. */
export enum FamilyPosition {root, left, right}

export type RecursiveAbstractBinaryTreeNode<T> = AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
