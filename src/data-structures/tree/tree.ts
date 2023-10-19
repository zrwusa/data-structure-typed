export class TreeNode<V = any> {
  constructor(key: string, value?: V, children?: TreeNode<V>[]) {
    this._key = key;
    this._value = value || undefined;
    this._children = children || [];
  }

  private _key: string;

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
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
    let maxDepth = 0;
    if (this) {
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
      bfs(this, 0);
    }
    return maxDepth;
  }
}
