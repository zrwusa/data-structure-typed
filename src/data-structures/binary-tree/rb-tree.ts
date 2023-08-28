import {BinaryTreeNodeId, RBColor, RBTreeNodeNested, RBTreeOptions} from '../types';
import {IRBTree, IRBTreeNode} from '../interfaces/rb-tree';
import {BST, BSTNode} from './bst';


export class RBTreeNode<T = any, FAMILY extends RBTreeNode<T, FAMILY> = RBTreeNodeNested<T>> extends BSTNode<T, FAMILY> implements IRBTreeNode<T, FAMILY> {
    constructor(id: BinaryTreeNodeId, val?: T, count?: number) {
        super(id, val, count);
    }

    private _color: RBColor = RBColor.RED;

    get color(): RBColor {
        return this._color;
    }

    set color(value: RBColor) {
        this._color = value;
    }

    /**
     * The function creates a new RBTreeNode with the given id, value, and count and returns it as a FAMILY object.
     * @param {BinaryTreeNodeId} id - The `id` parameter is the identifier for the binary tree node. It is used to uniquely
     * identify each node in the tree.
     * @param {T | null} [val] - The "val" parameter represents the value to be stored in the node. It can be of type T
     * (generic type) or null.
     * @param {number} [count] - The `count` parameter represents the number of occurrences of the value in the binary tree
     * node.
     * @returns The method is returning a new instance of the RBTreeNode class, casted as a FAMILY type.
     */
    override createNode(id: BinaryTreeNodeId, val?: T, count?: number): FAMILY {
        return new RBTreeNode(id, val, count) as FAMILY;
    }

    // private override _parent: RBNode<T> | null;
    // override set parent(v: RBNode<T> | null) {
    //     this._parent = v;
    // }
    // override get parent(): RBNode<T> | null {
    //     return this._parent;
    // }
    // private override _left?: RBNode<T> | null;
    //
    // override get left(): RBNode<T> | null | undefined {
    //     return this._left;
    // }
    //
    // override set left(v: RBNode<T> | null | undefined) {
    //     if (v) {
    //         v.parent = this;
    //     }
    //     this._left = v;
    // }
    //
    // private override _right?: RBNode<T> | null;
    //
    // override get right(): RBNode<T> | null | undefined {
    //     return this._right;
    // }
    //
    // override set right(v: RBNode<T> | null | undefined) {
    //     if (v) {
    //         v.parent = this;
    //     }
    //     this._right = v;
    // }
}

export class RBTree<N extends RBTreeNode<N['val'], N> = RBTreeNode> extends BST<N> implements IRBTree<N> {
    constructor(options?: RBTreeOptions) {
        super(options);
    }

    override createNode(id: BinaryTreeNodeId, val?: N['val'], count?: number): N {
        return new RBTreeNode(id, val, count) as N;
    }

    // private override _root: BinaryTreeNode<N> | null = null;
    //
    // override get root(): BinaryTreeNode<N> | null {
    //     return this._root;
    // }

    insert(id: number, val?: N | null) {

    }

    private leftRotate(node: N) {

    }

    private rightRotate(node: N) {

    }

    private insertFixup(node: N) {

    }

    private deleteFixup(node: N) {

    }

    private transplant(u: N, v: N) {

    }

    // override remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeleted<N>[] {
    //
    //     return [{deleted: new N(0, 0), needBalanced: null}];
    // }


}
