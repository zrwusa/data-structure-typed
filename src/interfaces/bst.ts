import {BSTNode} from '../data-structures';
import {IBinaryTree, IBinaryTreeNode} from './binary-tree';
import {BinaryTreeDeletedResult, BinaryTreeNodeKey, BinaryTreeNodePropertyName} from '../types';

export interface IBSTNode<T, NEIGHBOR extends IBSTNode<T, NEIGHBOR>> extends IBinaryTreeNode<T, NEIGHBOR> {}

export interface IBST<N extends BSTNode<N['val'], N>> extends IBinaryTree<N> {
  createNode(key: BinaryTreeNodeKey, val?: N['val'], count?: number): N;

  add(key: BinaryTreeNodeKey, val?: N['val'] | null, count?: number): N | null | undefined;

  get(nodeProperty: BinaryTreeNodeKey | N, propertyName?: BinaryTreeNodePropertyName): N | null;

  lastKey(): BinaryTreeNodeKey;

  remove(key: BinaryTreeNodeKey, ignoreCount?: boolean): BinaryTreeDeletedResult<N>[];

  getNodes(nodeProperty: BinaryTreeNodeKey | N, propertyName?: BinaryTreeNodePropertyName, onlyOne?: boolean): N[];

  // --- start additional functions

  lesserSum(key: BinaryTreeNodeKey, propertyName?: BinaryTreeNodePropertyName): number;

  allGreaterNodesAdd(node: N, delta: number, propertyName?: BinaryTreeNodePropertyName): boolean;

  perfectlyBalance(): boolean;

  isAVLBalanced(): boolean;

  // --- end additional functions
}
