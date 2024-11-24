import { BinaryTreeNode } from '../data-structures';
import type { BinaryTreeDeleteResult, BinaryTreeNodeNested, BTNRep, NodePredicate } from '../types';

export interface IBinaryTree<
  K = any,
  V = any,
  R = object,
  NODE extends BinaryTreeNode<K, V, NODE> = BinaryTreeNodeNested<K, V>
> {
  createNode(key: K, value?: NODE['value']): NODE;

  add(keyOrNodeOrEntryOrRawElement: BTNRep<K, V, NODE>, value?: V, count?: number): boolean;

  addMany(nodes: Iterable<BTNRep<K, V, NODE>>, values?: Iterable<V | undefined>): boolean[];

  delete(predicate: R | BTNRep<K, V, NODE> | NodePredicate<NODE>): BinaryTreeDeleteResult<NODE>[];
}
