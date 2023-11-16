export class TreeNode<V = any> {
  key: string;
  value?: V | undefined;
  children?: TreeNode<V>[] | undefined;

  constructor(key: string, value?: V, children?: TreeNode<V>[]) {
    this.key = key;
    this.value = value || undefined;
    this.children = children || [];
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
        const { children } = node;
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
