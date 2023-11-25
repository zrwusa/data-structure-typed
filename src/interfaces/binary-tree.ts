import { BinaryTree, BinaryTreeNode } from '../data-structures';
import {
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BiTreeDeleteResult,
  BTNCallback,
  BTNKey,
  BTNodeExemplar,
} from '../types';

export interface IBinaryTree<V = any, N extends BinaryTreeNode<V, N> = BinaryTreeNodeNested<V>, TREE extends BinaryTree<V, N, TREE> = BinaryTreeNested<V, N>> {
  createNode(key: BTNKey, value?: N['value']): N;

  createTree(options?: Partial<BinaryTreeOptions>): TREE;

  add(keyOrNodeOrEntry: BTNodeExemplar<V, N>, count?: number): N | null | undefined;

  addMany(nodes: Iterable<BTNodeExemplar<V, N>>): (N | null | undefined)[];

  delete<C extends BTNCallback<N>>(identifier: ReturnType<C> | null, callback: C): BiTreeDeleteResult<N>[];
}
