import { BinaryTree, BinaryTreeNode } from '../../../data-structures';
import { IterationType, OptValue } from '../../common';
import { DFSOperation } from '../../../common';

export type BinaryTreeNodeNested<K, V> = BinaryTreeNode<K, V, BinaryTreeNode<K, V, BinaryTreeNode<K, V,  any>>>

export type BinaryTreeNested<K, V, R, MK, MV, MR, NODE extends BinaryTreeNode<K, V, NODE>> = BinaryTree<K, V, R, MK, MV, MR, NODE,BinaryTree<K, V, R, MK, MV, MR, NODE,BinaryTree<K, V, R, MK, MV, MR, NODE,any>>>

export type ToEntryFn<K, V, R> = (rawElement: R) => BTNEntry<K, V>;

export type BinaryTreeOptions<K, V, R> = {
  iterationType?: IterationType;
  toEntryFn?: ToEntryFn<K, V, R>;
  isMapMode?: boolean;
}

export type BinaryTreePrintOptions = { isShowUndefined?: boolean; isShowNull?: boolean; isShowRedBlackNIL?: boolean };

export type OptNodeOrNull<NODE> = NODE | null | undefined;

export type BTNOptKeyOrNull<K> = K | null | undefined;

export type BTNEntry<K, V> = [BTNOptKeyOrNull<K>, OptValue<V>];

export type BTNOptKeyNodeOrNull<K, NODE> = BTNOptKeyOrNull<K> | NODE;

export type BTNRep<K, V, NODE> = BTNEntry<K, V> | BTNOptKeyNodeOrNull<K, NODE>;

export type BinaryTreeDeleteResult<NODE> = { deleted: OptNodeOrNull<NODE>; needBalanced: OptNodeOrNull<NODE> };

export type NodeCallback<NODE, D = any> = (node: NODE) => D;

export type NodePredicate<NODE> = (node: NODE) => boolean;

export type DFSStackItem<NODE> = { opt: DFSOperation; node: OptNodeOrNull<NODE> }
