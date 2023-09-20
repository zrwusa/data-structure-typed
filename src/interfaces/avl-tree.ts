import {AVLTreeNode} from '../data-structures';
import {IBST, IBSTNode} from './bst';
import {BinaryTreeDeletedResult, BinaryTreeNodeId} from '../types';

export type IAVLTreeNode<T, NEIGHBOR extends IAVLTreeNode<T, NEIGHBOR>> = IBSTNode<T, NEIGHBOR>

export interface IAVLTree<N extends AVLTreeNode<N['val'], N>> extends IBST<N> {

  add(id: BinaryTreeNodeId, val?: N['val'] | null): N | null | undefined

  remove(id: BinaryTreeNodeId, isUpdateAllLeftSum?: boolean): BinaryTreeDeletedResult<N>[]

  // _balanceFactor(node: N): number
  //
  // _updateHeight(node: N): void
  //
  // _balancePath(node: N): void
  //
  // _balanceLL(A: N): void
  //
  // _balanceLR(A: N): void
  //
  // _balanceRR(A: N): void
  //
  // _balanceRL(A: N): void
}
