export class TreeNode<V = any> {
  /**
   * The constructor function initializes a TreeNode object with a key, optional value, and optional
   * children.
   * @param {string} key - A string representing the key of the tree node.
   * @param {V} [value] - The `value` parameter is an optional parameter of type `V`. It represents the
   * value associated with the node. If no value is provided, it defaults to `undefined`.
   * @param {TreeNode<V>[]} [children] - The `children` parameter is an optional array of `TreeNode<V>`
   * objects. It represents the child nodes of the current node. If no children are provided, the
   * default value is an empty array.
   */
  constructor(key: string, value?: V, children?: TreeNode<V>[]) {
    this._key = key;
    this._value = value || undefined;
    this._children = children || [];
  }

  protected _key: string;

  /**
   * The function returns the value of the protected variable _key.
   * @returns The value of the `_key` property, which is a string.
   */
  get key(): string {
    return this._key;
  }

  /**
   * The above function sets the value of a protected variable called "key".
   * @param {string} value - The value parameter is a string that represents the value to be assigned
   * to the key.
   */
  set key(value: string) {
    this._key = value;
  }

  protected _value?: V | undefined;

  /**
   * The function returns the value stored in a variable, or undefined if the variable is empty.
   * @returns The value of the variable `_value` is being returned.
   */
  get value(): V | undefined {
    return this._value;
  }

  /**
   * The function sets the value of a variable.
   * @param {V | undefined} value - The parameter "value" is of type "V | undefined", which means it
   * can accept a value of type "V" or it can be undefined.
   */
  set value(value: V | undefined) {
    this._value = value;
  }

  protected _children?: TreeNode<V>[] | undefined;

  /**
   * The function returns an array of TreeNode objects or undefined.
   * @returns The `children` property is being returned. It is of type `TreeNode<V>[] | undefined`,
   * which means it can either be an array of `TreeNode<V>` objects or `undefined`.
   */
  get children(): TreeNode<V>[] | undefined {
    return this._children;
  }

  /**
   * The function sets the value of the children property of a TreeNode object.
   * @param {TreeNode<V>[] | undefined} value - The value parameter is of type TreeNode<V>[] |
   * undefined. This means that it can accept an array of TreeNode objects or undefined.
   */
  set children(value: TreeNode<V>[] | undefined) {
    this._children = value;
  }

  /**
   * The function `addChildren` adds one or more child nodes to the current node.
   * @param {TreeNode<V> | TreeNode<V>[]} children - The `children` parameter can be either a single
   * `TreeNode<V>` object or an array of `TreeNode<V>` objects.
   */
  addChildren(children: TreeNode<V> | TreeNode<V>[]) {
    if (!this._children) {
      this._children = [];
    }
    if (children instanceof TreeNode) {
      this._children.push(children);
    } else {
      this._children = this._children.concat(children);
    }
  }

  /**
   * The function `getHeight()` calculates the maximum depth of a tree structure by performing a
   * breadth-first search.
   * @returns the maximum depth or height of the tree.
   */
  getHeight() {
    let maxDepth = 0;
    if (this) {
      const bfs = (node: TreeNode<V>, level: number) => {
        if (level > maxDepth) {
          maxDepth = level;
        }
        const { _children } = node;
        if (_children) {
          for (let i = 0, len = _children.length; i < len; i++) {
            bfs(_children[i], level + 1);
          }
        }
      };
      bfs(this, 0);
    }
    return maxDepth;
  }
}
