import {BSTNode} from '../binary-tree';
import {IBinaryTree, IBinaryTreeNode} from './binary-tree';
import {BinaryTreeDeletedResult, BinaryTreeNodeId, BinaryTreeNodePropertyName} from '../types';

export interface IBSTNode<T, FAMILY extends IBSTNode<T, FAMILY>> extends IBinaryTreeNode<T, FAMILY> {
    createNode(id: BinaryTreeNodeId, val?: T, count?: number): FAMILY
}

export interface IBST<N extends BSTNode<N['val'], N>> extends IBinaryTree<N> {
    createNode(id: BinaryTreeNodeId, val?: N['val'], count?: number): N

    add(id: BinaryTreeNodeId, val?: N['val'] | null, count?: number): N | null

    get(nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName): N | null

    lastKey(): BinaryTreeNodeId

    remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeletedResult<N>[]

    getNodes(nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean): N[]

    // --- start additional functions

    lesserSum(id: BinaryTreeNodeId, propertyName ?: BinaryTreeNodePropertyName): number

    allGreaterNodesAdd(node: N, delta: number, propertyName ?: BinaryTreeNodePropertyName): boolean

    balance(): boolean

    isAVLBalanced(): boolean

    // --- end additional functions
}