export class TreeNode<T = number> {
    constructor(id: string, name?: string, value?: T, children?: TreeNode<T>[]) {
        this._id = id;
        this._name = name || '';
        this._value = value || undefined;
        this._children = children || [];
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    private _name?: string | undefined;

    get name(): string | undefined {
        return this._name;
    }

    set name(value: string | undefined) {
        this._name = value;
    }

    private _value?: T | undefined;

    get value(): T | undefined {
        return this._value;
    }

    set value(value: T | undefined) {
        this._value = value;
    }

    private _children?: TreeNode<T>[] | undefined;

    get children(): TreeNode<T>[] | undefined {
        return this._children;
    }

    set children(value: TreeNode<T>[] | undefined) {
        this._children = value;
    }

    addChildren(children: TreeNode<T> | TreeNode<T> []) {
        if (!this.children) {
            this.children = [];
        }
        if (children instanceof TreeNode) {
            this.children.push(children);
        } else {
            this.children = this.children.concat(children);
        }
    }

    getHeight() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const beginRoot = this;
        let maxDepth = 1;
        if (beginRoot) {
            const bfs = (node: TreeNode<T>, level: number) => {
                if (level > maxDepth) {
                    maxDepth = level;
                }
                const {children} = node;
                if (children) {
                    for (let i = 0, len = children.length; i < len; i++) {
                        bfs(children[i], level + 1);
                    }
                }
            };
            bfs(beginRoot, 1);
        }
        return maxDepth;
    }
}