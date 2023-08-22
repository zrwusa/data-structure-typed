import {BinaryTree, BinaryTreeNode, LoopType} from './binary-tree';
import {IBinaryTree, IBinaryTreeNode} from '../interfaces';

enum RBColor { Red, Black }

class RBNode<T> extends BinaryTreeNode<T> implements IBinaryTreeNode<T> {
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

class RBTree<T> extends BinaryTree<T> implements IBinaryTree<T> {
    constructor(options?: {
        loopType?: LoopType,
        autoIncrementId?: boolean,
        isDuplicatedVal?: boolean
    }) {
        super(options);
    }

    // override _createNode(id: BinaryTreeNodeId, val: T | null, count?: number): RBNode<T> | null {
    //     return val !== null ? new RBNode<T>(id, val, count) : null;
    // }

    // private override _root: BinaryTreeNode<T> | null = null;
    //
    // override get root(): BinaryTreeNode<T> | null {
    //     return this._root;
    // }

    insert(id: number, val: T | null) {

    }

    private leftRotate(node: RBNode<T>) {

    }

    private rightRotate(node: RBNode<T>) {

    }

    private insertFixup(node: RBNode<T>) {

    }

    private deleteFixup(node: RBNode<T>) {

    }

    private transplant(u: RBNode<T>, v: RBNode<T>) {

    }

    // override remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeleted<T>[] {
    //
    //     return [{deleted: new RBNode<T>(0, 0), needBalanced: null}];
    // }


}
