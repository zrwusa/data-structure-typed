import {BinaryTreeNode} from '../data-structures';
import {BinaryTreeDeletedResult, BTNKey, BinaryTreeNodeNested, BTNCallback} from '../types';

export interface IBinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNodeNested<V>> {
  createNode(key: BTNKey, val?: N['val']): N;

  add(keyOrNode: BTNKey | N | null, val?: N['val']): N | null | undefined;

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C> | null, callback: C): BinaryTreeDeletedResult<N>[];
}
