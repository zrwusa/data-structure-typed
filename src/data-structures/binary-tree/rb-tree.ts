import {BinaryTreeNodeId, RBColor, RBTreeNodeNested, RBTreeOptions} from '../types';
import {IRBTree, IRBTreeNode} from '../interfaces/rb-tree';
import {BST, BSTNode} from './bst';


export class RBTreeNode<T = any, NEIGHBOR extends RBTreeNode<T, NEIGHBOR> = RBTreeNodeNested<T>> extends BSTNode<T, NEIGHBOR> implements IRBTreeNode<T, NEIGHBOR> {
    constructor(id: BinaryTreeNodeId, val?: T, color: RBColor = RBColor.RED) {
        super(id, val);
        this._color = color;
    }

    private _color: RBColor;

    get color(): RBColor {
        return this._color;
    }

    set color(value: RBColor) {
        this._color = value;
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

    override createNode(id: BinaryTreeNodeId, val?: N['val']): N {
        return new RBTreeNode(id, val, RBColor.RED) as N;
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
