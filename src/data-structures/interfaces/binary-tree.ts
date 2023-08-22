import {BinaryTreeNodeId} from '../types';
import {FamilyPosition} from '../binary-tree';

export interface IBinaryTreeNode<T, FAMILY extends IBinaryTreeNode<T, FAMILY>> {
    _createNode(id: BinaryTreeNodeId, val: T | null, count?: number): FAMILY | null;


    get id(): BinaryTreeNodeId

    set id(v: BinaryTreeNodeId)


    get val(): T

    set val(v: T)


    get left(): FAMILY | null | undefined

    set left(v: FAMILY | null | undefined)


    get right(): FAMILY | null | undefined

    set right(v: FAMILY | null | undefined)


    get parent(): FAMILY | null | undefined

    set parent(v: FAMILY | null | undefined)


    get familyPosition(): FamilyPosition

    set familyPosition(v: FamilyPosition)


    get count(): number

    set count(v: number)


    get height(): number

    set height(v: number)

    _createNode(id: BinaryTreeNodeId, val: T | null, count?: number): FAMILY | null

    swapLocation(swapNode: FAMILY): FAMILY

    clone(): FAMILY | null;
}

export interface IBinaryTree<N extends IBinaryTreeNode<N['val'], N>> {
    _createNode(id: BinaryTreeNodeId, val: N['val'] | null, count?: number): N | null
}