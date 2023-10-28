import {BinaryTreeNode} from '../data-structures';
import {BinaryTreeDeletedResult, BinaryTreeNodeKey, BinaryTreeNodeNested, OneParamCallback} from '../types';

export interface IBinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNodeNested<V>> {
  createNode(key: BinaryTreeNodeKey, val?: N['val']): N;

  add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val']): N | null | undefined;

  delete<C extends OneParamCallback<N>>(identifier: ReturnType<C> | null, callback: C): BinaryTreeDeletedResult<N>[];
}
