import {BinaryTreeNode} from '../data-structures';
import {BinaryTreeDeletedResult, BTNKey, BinaryTreeNodeNested, BTNCallback} from '../types';

export interface IBinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNodeNested<V>> {
  createNode(key: BTNKey, value?: N['value']): N;

  add(keyOrNode: BTNKey | N | null, value?: N['value']): N | null | undefined;

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C> | null, callback: C): BinaryTreeDeletedResult<N>[];
}
