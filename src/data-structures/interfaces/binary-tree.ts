import {BinaryTreeNodeId} from '../types';
import {BinaryTreeNode} from '../binary-tree';

export interface IBinaryTreeNode<T> {
    _createNode(id: BinaryTreeNodeId, val: T | null, count?: number): BinaryTreeNode<T> | null
}

export interface IBinaryTree<T> {
    _createNode(id: BinaryTreeNodeId, val: T | null, count?: number): BinaryTreeNode<T> | null
}