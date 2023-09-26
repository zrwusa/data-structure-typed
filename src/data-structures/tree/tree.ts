export class TreeNode<V = any> {
  constructor(id: string, value?: V, children?: TreeNode<V>[]) {
    this._id = id;
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

  private _value?: V | undefined;

  get value(): V | undefined {
    return this._value;
  }

  set value(value: V | undefined) {
    this._value = value;
  }

  private _children?: TreeNode<V>[] | undefined;

  get children(): TreeNode<V>[] | undefined {
    return this._children;
  }

  set children(value: TreeNode<V>[] | undefined) {
    this._children = value;
  }

  addChildren(children: TreeNode<V> | TreeNode<V>[]) {
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
      const bfs = (node: TreeNode<V>, level: number) => {
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
