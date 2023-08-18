export class TreeNode<T = number> {
    id: string;
    name?: string | undefined;
    value?: T | undefined;
    children?: TreeNode<T>[] | undefined;

    constructor(id: string, name?: string, value?: T, children?: TreeNode<T>[]) {
        this.id = id;
        this.name = name || '';
        this.value = value || undefined;
        this.children = children || [];
    }

    // TODO get set
    // get name (): string | undefined {
    //     return this.name;
    // }
    //
    // set name (name: string | undefined) {
    //     this.name = name;
    // }

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