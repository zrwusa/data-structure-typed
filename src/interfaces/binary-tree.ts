import { BinaryTree, BinaryTreeNode } from '../data-structures';
import {
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BiTreeDeleteResult,
  BTNCallback,
  BTNodeExemplar,
} from '../types';

export interface IBinaryTree<K = number, V = any, N extends BinaryTreeNode<K, V, N> = BinaryTreeNodeNested<K, V>, TREE extends BinaryTree<K, V, N, TREE> = BinaryTreeNested<K, V, N>> {
  createNode(key: K, value?: N['value']): N;

  createTree(options?: Partial<BinaryTreeOptions<K>>): TREE;

  add(keyOrNodeOrEntry: BTNodeExemplar<K, V, N>, value?: V, count?: number): N | null | undefined;

  addMany(nodes: Iterable<BTNodeExemplar<K, V, N>>): (N | null | undefined)[];

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C> | null, callback: C): BiTreeDeleteResult<N>[];
}
