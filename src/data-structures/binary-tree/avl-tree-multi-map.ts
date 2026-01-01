/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type {
  AVLTreeMultiMapOptions,
  AVLTreeOptions,
  BTNOptKeyOrNull,
  ElemOf,
  EntryCallback,
  IterationType
} from '../../types';
import { AVLTree, AVLTreeNode } from './avl-tree';
import { IBinaryTree } from '../../interfaces';

/**
 * Node used by AVLTreeMultiMap; stores the key with a bucket of values (array).
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 */
export class AVLTreeMultiMapNode<K = any, V = any> extends AVLTreeNode<K, V[]> {
  override parent?: AVLTreeMultiMapNode<K, V> = undefined;

  /**
   * Create an AVLTreeMultiMap node with a value bucket.
   * @remarks Time O(1), Space O(1)
   * @param key - Key of the node.
   * @param value - Initial array of values.
   * @returns New AVLTreeMultiMapNode instance.
   */
  constructor(key: K, value: V[]) {
    super(key, value);
  }

  override _left?: AVLTreeMultiMapNode<K, V> | null | undefined = undefined;

  /**
   * Get the left child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Left child node, or null/undefined.
   */
  override get left(): AVLTreeMultiMapNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Set the left child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New left child node, or null/undefined.
   * @returns void
   */
  override set left(v: AVLTreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: AVLTreeMultiMapNode<K, V> | null | undefined = undefined;

  /**
   * Get the right child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Right child node, or null/undefined.
   */
  override get right(): AVLTreeMultiMapNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Set the right child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New right child node, or null/undefined.
   * @returns void
   */
  override set right(v: AVLTreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 * AVL-tree–based multimap (key → array of values). Preserves O(log N) updates and supports map-like mode.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 */
export class AVLTreeMultiMap<K = any, V = any, R = any> extends AVLTree<K, V[], R> implements IBinaryTree<K, V[], R> {
  /**
   * Create an AVLTreeMultiMap and optionally bulk-insert items.
   * @remarks Time O(N log N), Space O(N)
   * @param [keysNodesEntriesOrRaws] - Iterable of keys/nodes/entries/raw items to insert.
   * @param [options] - Options for AVLTreeMultiMap (comparator, reverse, map mode).
   * @returns New AVLTreeMultiMap instance.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined | R
    > = [],
    options?: AVLTreeMultiMapOptions<K, V[], R>
  ) {
    super([], { ...options, isMapMode: true });
    if (keysNodesEntriesOrRaws) {
      this.addMany(keysNodesEntriesOrRaws);
    }
  }

  override createNode(key: K, value: V[] = []): AVLTreeMultiMapNode<K, V> {
    return new AVLTreeMultiMapNode<K, V>(key, this._isMapMode ? [] : value);
  }

  override add(
    keyNodeOrEntry: K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined
  ): boolean;

  override add(key: K, value: V): boolean;

  /**
   * Insert a value or a list of values into the multimap. If the key exists, values are appended.
   * @remarks Time O(log N + M), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, values] entry.
   * @param [value] - Single value to add when a bare key is provided.
   * @returns True if inserted or appended; false if ignored.
   */
  override add(
    keyNodeOrEntry: K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined,
    value?: V
  ): boolean {
    if (this.isRealNode(keyNodeOrEntry)) return super.add(keyNodeOrEntry);

    const _commonAdd = (key?: BTNOptKeyOrNull<K>, values?: V[]) => {
      if (key === undefined || key === null) return false;

      const _addToValues = () => {
        const existingValues = this.get(key);
        if (existingValues !== undefined && values !== undefined) {
          for (const value of values) existingValues.push(value);
          return true;
        }
        return false;
      };

      const _addByNode = () => {
        const existingNode = this.getNode(key);
        if (this.isRealNode(existingNode)) {
          const existingValues = this.get(existingNode);
          if (existingValues === undefined) {
            super.add(key, values);
            return true;
          }
          if (values !== undefined) {
            for (const value of values) existingValues.push(value);
            return true;
          } else {
            return false;
          }
        } else {
          return super.add(key, values);
        }
      };

      if (this._isMapMode) {
        return _addByNode() || _addToValues();
      }
      return _addToValues() || _addByNode();
    };

    if (this.isEntry(keyNodeOrEntry)) {
      const [key, values] = keyNodeOrEntry;
      return _commonAdd(key, value !== undefined ? [value] : values);
    }

    return _commonAdd(keyNodeOrEntry, value !== undefined ? [value] : undefined);
  }

  /**
   * Delete a single value from the bucket at a given key. Removes the key if the bucket becomes empty.
   * @remarks Time O(log N), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, values] entry to locate the bucket.
   * @param value - Value to remove from the bucket.
   * @returns True if the value was removed; false if not found.
   */
  deleteValue(
    keyNodeOrEntry: K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined,
    value: V
  ): boolean {
    const values = this.get(keyNodeOrEntry);
    if (Array.isArray(values)) {
      const index = values.indexOf(value);
      if (index === -1) return false;
      values.splice(index, 1);

      if (values.length === 0) this.delete(keyNodeOrEntry);

      return true;
    }
    return false;
  }

  /**
   * Rebuild the tree into a perfectly balanced form using in-order nodes.
   * @remarks Time O(N), Space O(N)
   * @param [iterationType] - Traversal style to use when constructing the balanced tree.
   * @returns True if rebalancing succeeded (tree not empty).
   */
  override perfectlyBalance(iterationType: IterationType = this.iterationType): boolean {
    const nodes = this.dfs(node => node, 'IN', false, this._root, iterationType);
    const n = nodes.length;
    if (n === 0) return false;

    this._clearNodes();

    const build = (l: number, r: number, parent?: any): any | undefined => {
      if (l > r) return undefined;
      const m = l + ((r - l) >> 1);
      const root = nodes[m];
      root.left = build(l, m - 1, root);
      root.right = build(m + 1, r, root);
      root.parent = parent;
      const lh = root.left ? root.left.height : -1;
      const rh = root.right ? root.right.height : -1;
      root.height = Math.max(lh, rh) + 1;
      return root;
    };

    const newRoot = build(0, n - 1, undefined);
    this._setRoot(newRoot);
    this._size = n;
    return true;
  }

  /**
   * Create a new tree by mapping each [key, values] bucket.
   * @remarks Time O(N log N), Space O(N)
   * @template MK
   * @template MVArr
   * @template MR
   * @param callback - Function mapping (key, values, index, tree) → [newKey, newValue].
   * @param [options] - Options for the output tree.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new AVLTreeMultiMap when mapping to array values; see overloads.
   */
  override map<MK = K, MVArr extends unknown[] = V[], MR = any>(
    callback: EntryCallback<K, V[] | undefined, [MK, MVArr]>,
    options?: Partial<AVLTreeOptions<MK, MVArr, MR>>,
    thisArg?: unknown
  ): AVLTreeMultiMap<MK, ElemOf<MVArr>, MR>;

  /**
   * Create a new tree by mapping each [key, values] bucket.
   * @remarks Time O(N log N), Space O(N)
   * @template MK
   * @template MV
   * @template MR
   * @param callback - Function mapping (key, values, index, tree) → [newKey, newValue].
   * @param [options] - Options for the output tree.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new AVLTree when mapping to non-array values; see overloads.
   */
  override map<MK = K, MV = V[], MR = any>(
    callback: EntryCallback<K, V[] | undefined, [MK, MV]>,
    options?: Partial<AVLTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): AVLTree<MK, MV, MR>;

  /**
   * Create a new tree by mapping each [key, values] bucket.
   * @remarks Time O(N log N), Space O(N)
   * @template MK
   * @template MV
   * @template MR
   * @param callback - Function mapping (key, values, index, tree) → [newKey, newValue].
   * @param [options] - Options for the output tree.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns The mapped AVLTree or AVLTreeMultiMap depending on MV; see overloads.
   */
  override map<MK, MV, MR extends object>(
    callback: EntryCallback<K, V[] | undefined, [MK, MV]>,
    options?: Partial<AVLTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): AVLTree<MK, MV, MR> {
    const out = this._createLike<MK, MV, MR>([], options);
    let i = 0;
    for (const [k, v] of this) out.add(callback.call(thisArg, k, v, i++, this));
    return out;
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @template TK
   * @template TV
   * @template TR
   * @param [options] - Optional constructor options for the like-kind instance.
   * @returns An empty like-kind instance.
   */
  protected override _createInstance<TK = K, TV = V, TR = R>(options?: Partial<AVLTreeOptions<TK, TV, TR>>): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | AVLTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: AVLTreeOptions<TK, TV, TR>
    ) => AVLTree<TK, TV, TR>;
    return new Ctor([], { ...(this._snapshotOptions?.<TK, TV, TR>() ?? {}), ...(options ?? {}) }) as unknown as this;
  }

  /**
   * (Protected) Create a like-kind instance and seed it from an iterable.
   * @remarks Time O(N log N), Space O(N)
   * @template TK
   * @template TV
   * @template TR
   * @param iter - Iterable used to seed the new tree.
   * @param [options] - Options merged with the current snapshot.
   * @returns A like-kind AVLTree built from the iterable.
   */
  protected override _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<TK | AVLTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR> = [],
    options?: Partial<AVLTreeOptions<TK, TV, TR>>
  ): AVLTree<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | AVLTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: AVLTreeOptions<TK, TV, TR>
    ) => AVLTree<TK, TV, TR>;
    return new Ctor(iter, { ...(this._snapshotOptions?.<TK, TV, TR>() ?? {}), ...(options ?? {}) });
  }
}
