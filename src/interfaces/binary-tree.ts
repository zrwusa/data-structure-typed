import { BinaryTreeNode } from '../data-structures';
import type { BinaryTreeDeleteResult, BinaryTreeOptions, BTNRep, NodePredicate } from '../types';

export interface IBinaryTree<K = any, V = any, R = object, MK = any, MV = any, MR = object> {
  createNode(key: K, value?: BinaryTreeNode['value']): BinaryTreeNode;

  createTree(options?: Partial<BinaryTreeOptions<K, V, R>>): IBinaryTree<K, V, R, MK, MV, MR>;

  add(keyOrNodeOrEntryOrRawElement: BTNRep<K, V, BinaryTreeNode<K, V>>, value?: V, count?: number): boolean;

  addMany(nodes: Iterable<BTNRep<K, V, BinaryTreeNode<K, V>>>, values?: Iterable<V | undefined>): boolean[];

  delete(
    predicate: R | BTNRep<K, V, BinaryTreeNode<K, V>> | NodePredicate<BinaryTreeNode<K, V>>
  ): BinaryTreeDeleteResult<BinaryTreeNode<K, V>>[];
}
