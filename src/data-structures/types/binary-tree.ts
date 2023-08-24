import {BinaryTreeNode} from '../binary-tree';
import {AbstractBinaryTreeOptions} from './abstract-binary-tree';


// export type BinaryTreeDeleted<N> = { deleted: N | null | undefined, needBalanced: N | null };
// export type ResultByProperty<N extends BinaryTreeNode<N['val'], N>> = N['val'] | N | number | BinaryTreeNodeId;
// export type ResultsByProperty<N extends BinaryTreeNode<N['val'], N>> = ResultByProperty<N>[];
export type BinaryTreeNodeNested<T> = BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, BinaryTreeNode<T, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export type BinaryTreeOptions = AbstractBinaryTreeOptions & {}