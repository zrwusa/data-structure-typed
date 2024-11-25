import { BinaryTree, BinaryTreeNode } from '../data-structures';
import type {
  BinaryTreeDeleteResult,
  BinaryTreeNested,
  BinaryTreeNodeNested,
  BinaryTreeOptions,
  BTNRep,
  NodePredicate
} from '../types';

export interface IBinaryTree<
  K = any,
  V = any,
  R = object,
  MK = any,
  MV = any,
  MR = object,
  NODE extends BinaryTreeNode<K, V, NODE> = BinaryTreeNodeNested<K, V>,
  TREE extends BinaryTree<K, V, R, MK, MV, MR, NODE, TREE> = BinaryTreeNested<K, V, R, MK, MV, MR, NODE>
> {
  createNode(key: K, value?: NODE['value']): NODE;

  createTree(options?: Partial<BinaryTreeOptions<K, V, R>>): TREE;

  add(keyOrNodeOrEntryOrRawElement: BTNRep<K, V, NODE>, value?: V, count?: number): boolean;

  addMany(nodes: Iterable<BTNRep<K, V, NODE>>, values?: Iterable<V | undefined>): boolean[];

  delete(predicate: R | BTNRep<K, V, NODE> | NodePredicate<NODE>): BinaryTreeDeleteResult<NODE>[];
}
