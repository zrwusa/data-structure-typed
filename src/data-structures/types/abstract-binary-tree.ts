import {AbstractBinaryTreeNode} from '../binary-tree';

/**
 * Enum representing different loop types.
 *
 * - `iterative`: Indicates the iterative loop type (with loops that use iterations).
 * - `recursive`: Indicates the recursive loop type (with loops that call themselves).
 */
export enum LoopType { ITERATIVE = 'ITERATIVE', RECURSIVE = 'RECURSIVE'}

/* This enumeration defines the position of a node within a family tree composed of three associated nodes, where 'root' represents the root node of the family tree, 'left' represents the left child node, and 'right' represents the right child node. */
export enum FamilyPosition {ROOT, LEFT, RIGHT}

export type BinaryTreeNodePropertyName = 'id' | 'val' | 'count';
export type NodeOrPropertyName = 'node' | BinaryTreeNodePropertyName;
export type DFSOrderPattern = 'in' | 'pre' | 'post';
export type BinaryTreeNodeId = number;
export type BinaryTreeDeletedResult<N> = { deleted: N | null | undefined, needBalanced: N | null };

export type AbstractBinaryTreeNodeProperty<N extends AbstractBinaryTreeNode<N['val'], N>> =
    N['val']
    | N
    | number
    | BinaryTreeNodeId;
export type AbstractBinaryTreeNodeProperties<N extends AbstractBinaryTreeNode<N['val'], N>> = AbstractBinaryTreeNodeProperty<N>[];
export type AbstractRecursiveBinaryTreeNode<T> = AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, AbstractBinaryTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export type AbstractBinaryTreeOptions = {
    loopType?: LoopType,
    autoIncrementId?: boolean,
    isDuplicatedVal?: boolean
}