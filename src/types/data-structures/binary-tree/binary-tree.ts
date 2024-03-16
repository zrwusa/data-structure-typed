import { BinaryTree, BinaryTreeNode } from '../../../data-structures';
import { IterationType, OptValue } from '../../common';

export type BinaryTreeNodeNested<K, V> = BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BinaryTreeNested<K, V, R, NODE extends BinaryTreeNode<K, V, NODE>> = BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, BinaryTree<K, V, R, NODE, any>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export type BinaryTreeOptions<K, V, R> = {
  iterationType?: IterationType;
  toEntryFn?: (rawElement: R) => BTNEntry<K, V>;
}

export type BinaryTreePrintOptions = { isShowUndefined?: boolean; isShowNull?: boolean; isShowRedBlackNIL?: boolean };

export type OptBTNOrNull<NODE> = NODE | null | undefined;

export type OptBTNKeyOrNull<K> = K | null | undefined;

export type BTNEntry<K, V> = [OptBTNKeyOrNull<K>, OptValue<V>];

export type BTNKeyOrNode<K, NODE> = OptBTNKeyOrNull<K> | NODE;

export type BTNKeyOrNodeOrEntry<K, V, NODE> = BTNEntry<K, V> | BTNKeyOrNode<K, NODE>;

export type BTNPureKeyOrNode<K, NODE> = K | NODE;

export type BTNPureKeyOrNodeOrEntry<K, V, NODE> = [K, OptValue<V>] | BTNPureKeyOrNode<K, NODE>;

export type BinaryTreeDeleteResult<NODE> = { deleted: OptBTNOrNull<NODE>; needBalanced: OptBTNOrNull<NODE> };

export type BTNCallback<NODE, D = any> = (node: NODE) => D;