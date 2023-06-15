import {BST, BSTNode} from './bst';
import {BinaryTreeNodeId} from './binary-tree';

export type TreeMultiSetDeletedResult<T> = { deleted: BSTNode<T> | null, needBalanced: BSTNode<T> | null };


export class TreeMultiSet<T> extends BST<T> {
    override createNode(id: BinaryTreeNodeId, val: T, count?: number): BSTNode<T> {
        return new BSTNode<T>(id, val, count);
    }

    override put(id: BinaryTreeNodeId, val: T | null, count?: number): BSTNode<T> | null {
        return super.put(id, val, count);
    }

    override remove(id: BinaryTreeNodeId, isUpdateAllLeftSum?: boolean): TreeMultiSetDeletedResult<T>[] {
        return super.remove(id, isUpdateAllLeftSum);
    }
}


