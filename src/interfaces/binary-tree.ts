import { BinaryTree, BinaryTreeNode } from '../data-structures';
import { BinaryTreeNested, BinaryTreeNodeNested, BiTreeDeleteResult, BTNCallback, BTNKey } from '../types';

export interface IBinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNodeNested<V>, TREE extends BinaryTree<V, N, TREE> = BinaryTreeNested<V, N>> {
  createNode(key: BTNKey, value?: N['value']): N;

  add(keyOrNode: BTNKey | N | null, value?: N['value']): N | null | undefined;

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C> | null, callback: C): BiTreeDeleteResult<N>[];
}
