import {BinaryTreeNode} from '../data-structures';
import {BinaryTreeDeletedResult, BinaryTreeNodeKey} from '../types';

export interface IBinaryTree<N extends BinaryTreeNode<N['val'], N>> {
  createNode(key: BinaryTreeNodeKey, val?: N['val']): N;

  add(keyOrNode: BinaryTreeNodeKey | N | null, val?: N['val']): N | null | undefined;

  remove(nodeOrKey: N | BinaryTreeNodeKey): BinaryTreeDeletedResult<N>[];
}
