import { BinaryTree, BinaryTreeNode } from '../data-structures';
import {
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BiTreeDeleteResult,
  BTNCallback,
  BTNExemplar,
  BTNKey,
} from '../types';

export interface IBinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNodeNested<V>, TREE extends BinaryTree<V, N, TREE> = BinaryTreeNested<V, N>> {
  createNode(key: BTNKey, value?: N['value']): N;

  createTree(options?: Partial<BinaryTreeOptions>): TREE;

  init(elements: Iterable<BTNExemplar<V, N>>): void;

  add(keyOrNode: BTNKey | N | null, value?: N['value']): N | null | undefined;

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C> | null, callback: C): BiTreeDeleteResult<N>[];
}
