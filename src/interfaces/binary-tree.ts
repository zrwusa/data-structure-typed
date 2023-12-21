import { BinaryTree, BinaryTreeNode } from '../data-structures';
import {
  BinaryTreeDeleteResult,
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BTNCallback,
  BTNExemplar
} from '../types';

export interface IBinaryTree<
  K = number,
  V = any,
  N extends BinaryTreeNode<K, V, N> = BinaryTreeNodeNested<K, V>,
  TREE extends BinaryTree<K, V, N, TREE> = BinaryTreeNested<K, V, N>
> {
  createNode(key: K, value?: N['value']): N;

  createTree(options?: Partial<BinaryTreeOptions<K>>): TREE;

  add(keyOrNodeOrEntry: BTNExemplar<K, V, N>, value?: V, count?: number): N | null | undefined;

  addMany(nodes: Iterable<BTNExemplar<K, V, N>>, values?: Iterable<V | undefined>): (N | null | undefined)[];

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C> | null, callback: C): BinaryTreeDeleteResult<N>[];
}
