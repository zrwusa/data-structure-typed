import { BinaryTree, BinaryTreeNode } from '../data-structures';
import type {
  BinaryTreeDeleteResult,
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BTNCallback,
  BTNKeyOrNodeOrEntry
} from '../types';

export interface IBinaryTree<
  K = any,
  V = any,
  R = [K, V],
  NODE extends BinaryTreeNode<K, V, NODE> = BinaryTreeNodeNested<K, V>,
  TREE extends BinaryTree<K, V, R, NODE, TREE> = BinaryTreeNested<K, V, R, NODE>
> {
  createNode(key: K, value?: NODE['value']): NODE;

  createTree(options?: Partial<BinaryTreeOptions<K, V, R>>): TREE;

  add(keyOrNodeOrEntryOrRawElement: BTNKeyOrNodeOrEntry<K, V, NODE>, value?: V, count?: number): boolean;

  addMany(nodes: Iterable<BTNKeyOrNodeOrEntry<K, V, NODE>>, values?: Iterable<V | undefined>): boolean[];

  delete<C extends BTNCallback<NODE>>(identifier: ReturnType<C> | null, callback: C): BinaryTreeDeleteResult<NODE>[];
}
