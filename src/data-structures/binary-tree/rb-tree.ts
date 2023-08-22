import {BinaryTree, BinaryTreeNode, LoopType} from './binary-tree';
import {IBinaryTree, IBinaryTreeNode} from '../interfaces';

enum RBColor { Red, Black }

class RBNode<T, FAMILY extends RBNode<T, FAMILY>> extends BinaryTreeNode<T, FAMILY> implements IBinaryTreeNode<T, FAMILY> {
    // override createNode(id: BinaryTreeNodeId, val: T | null, count?: number): RBNode<T> | null {
    //     return val !== null ? new RBNode<T>(id, val, count) : null;
    // }

    constructor(id: number, val: T, count?: number) {
        super(id, val, count);
    }

    private _color: RBColor = RBColor.Red;

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
    //         v.familyPosition = FamilyPosition.left;
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
    //         v.familyPosition = FamilyPosition.right;
    //     }
    //     this._right = v;
    // }
}

class RBTree<N extends RBNode<N['val'], N>> extends BinaryTree<N> implements IBinaryTree<N> {
    constructor(options?: {
        loopType?: LoopType,
        autoIncrementId?: boolean,
        isDuplicatedVal?: boolean
    }) {
        super(options);
    }

    // override _createNode(id: BinaryTreeNodeId, val: N | null, count?: number): RBNode<N> | null {
    //     return val !== null ? new RBNode<N>(id, val, count) : null;
    // }

    // private override _root: BinaryTreeNode<N> | null = null;
    //
    // override get root(): BinaryTreeNode<N> | null {
    //     return this._root;
    // }

    insert(id: number, val: N | null) {

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
