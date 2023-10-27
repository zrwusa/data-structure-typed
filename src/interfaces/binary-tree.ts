import {BinaryTreeNode} from '../data-structures';
import {BinaryTreeDeletedResult, BinaryTreeNodeKey, BinaryTreeNodeNested, MapCallback} from '../types';

export interface IBinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNodeNested<V>> {
  createNode(key: BinaryTreeNodeKey, val?: N['val']): N;

  add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val']): N | null | undefined;

  delete<C extends MapCallback<N>>(identifier: ReturnType<C> | N, callback: C): BinaryTreeDeletedResult<N>[];
}
