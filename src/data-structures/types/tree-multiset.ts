import {BSTNode} from '../binary-tree';

export type TreeMultiSetDeletedResult<T> = { deleted: BSTNode<T> | null, needBalanced: BSTNode<T> | null };
