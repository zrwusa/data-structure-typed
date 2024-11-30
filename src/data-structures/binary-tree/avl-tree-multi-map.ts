/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import { AVLTreeMultiMapOptions, BTNOptKeyOrNull, BTNRep, OptNodeOrNull } from '../../types';
import { AVLTree, AVLTreeNode } from './avl-tree';

export class AVLTreeMultiMapNode<K = any, V = any> extends AVLTreeNode<K, V[]> {
  /**
   * This TypeScript constructor initializes an object with a key of type K and an array of values of
   * type V.
   * @param {K} key - The `key` parameter is typically used to store a unique identifier or key for the
   * data being stored in the data structure. It helps in quickly accessing or retrieving the
   * associated value in the data structure.
   * @param {V[]} value - The `value` parameter in the constructor represents an array of values of
   * type `V`.
   */
  constructor(key: K, value: V[]) {
    super(key, value);
  }

  override parent?: AVLTreeMultiMapNode<K, V> = undefined;

  override _left?: OptNodeOrNull<AVLTreeMultiMapNode<K, V>> = undefined;

  override get left(): OptNodeOrNull<AVLTreeMultiMapNode<K, V>> {
    return this._left;
  }

  override set left(v: OptNodeOrNull<AVLTreeMultiMapNode<K, V>>) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: OptNodeOrNull<AVLTreeMultiMapNode<K, V>> = undefined;

  override get right(): OptNodeOrNull<AVLTreeMultiMapNode<K, V>> {
    return this._right;
  }

  override set right(v: OptNodeOrNull<AVLTreeMultiMapNode<K, V>>) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 *
 */
export class AVLTreeMultiMap<K = any, V = any, R = object, MK = any, MV = any, MR = object> extends AVLTree<
  K,
  V[],
  R,
  MK,
  MV,
  MR
> {
  /**
   * The constructor initializes an AVLTreeMultiMap with the provided keys, nodes, entries, or raw data
   * and options.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter in the constructor is an
   * iterable that can contain either key-value pairs represented as `BTNRep<K, V[],
   * AVLTreeMultiMapNode<K, V>>` or raw data represented as `R`. This parameter is used to initialize
   * the AVLTreeMulti
   * @param [options] - The `options` parameter in the constructor is of type
   * `AVLTreeMultiMapOptions<K, V[], R>`. It is an optional parameter that allows you to specify
   * additional options for configuring the AVLTreeMultiMap instance.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<BTNRep<K, V[], AVLTreeMultiMapNode<K, V>> | R> = [],
    options?: AVLTreeMultiMapOptions<K, V[], R>
  ) {
    super([], { ...options, isMapMode: true });
    if (keysNodesEntriesOrRaws) {
      this.addMany(keysNodesEntriesOrRaws);
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `createTree` in TypeScript overrides the creation of an AVLTreeMultiMap with
   * specified options.
   * @param [options] - The `options` parameter in the `createTree` function is of type
   * `AVLTreeMultiMapOptions<K, V[], R>`. This means it is an object that can have properties of type
   * `K`, `V[]`, and `R`. The function creates a new `AVL
   * @returns The `createTree` method is returning a new instance of `AVLTreeMultiMap` with the
   * provided options.
   */
  override createTree(options?: AVLTreeMultiMapOptions<K, V[], R>) {
    return new AVLTreeMultiMap<K, V, R, MK, MV, MR>([], {
      iterationType: this.iterationType,
      specifyComparable: this._specifyComparable,
      toEntryFn: this._toEntryFn,
      isReverse: this._isReverse,
      ...options
    });
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `createNode` overrides the method to create a new AVLTreeMultiMapNode with a
   * specified key and an empty array of values.
   * @param {K} key - The `key` parameter in the `createNode` method represents the key of the node
   * that will be created in the AVLTreeMultiMap.
   * @returns An AVLTreeMultiMapNode object is being returned, initialized with the provided key and an
   * empty array.
   */
  override createNode(key: K): AVLTreeMultiMapNode<K, V> {
    return new AVLTreeMultiMapNode<K, V>(key, []);
  }

  override add(node: BTNRep<K, V[], AVLTreeMultiMapNode<K, V>>): boolean;

  override add(key: K, value: V): boolean;

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `add` in TypeScript overrides the superclass method to add key-value pairs to an AVL
   * tree multi-map.
   * @param {BTNRep<K, V[], AVLTreeMultiMapNode<K, V>> | K} keyNodeOrEntry - The `keyNodeOrEntry`
   * parameter in the `override add` method can be either a key-value pair entry or just a key. If it
   * is a key-value pair entry, it will be in the format `[key, values]`, where `key` is the key and
   * `values`
   * @param {V} [value] - The `value` parameter in the `override add` method represents the value that
   * you want to add to the AVLTreeMultiMap. It can be a single value or an array of values associated
   * with a specific key.
   * @returns The `override add` method is returning a boolean value, which indicates whether the
   * addition operation was successful or not.
   */
  override add(keyNodeOrEntry: BTNRep<K, V[], AVLTreeMultiMapNode<K, V>> | K, value?: V): boolean {
    if (this.isRealNode(keyNodeOrEntry)) return super.add(keyNodeOrEntry);

    const _commonAdd = (key?: BTNOptKeyOrNull<K>, values?: V[]) => {
      if (key === undefined || key === null) return false;

      const existingValues = this.get(key);
      if (existingValues !== undefined && values !== undefined) {
        for (const value of values) existingValues.push(value);
        return true;
      }

      const existingNode = this.getNode(key);
      if (this.isRealNode(existingNode)) {
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

    if (this.isEntry(keyNodeOrEntry)) {
      const [key, values] = keyNodeOrEntry;
      return _commonAdd(key, value !== undefined ? [value] : values);
    }

    return _commonAdd(keyNodeOrEntry, value !== undefined ? [value] : undefined);
  }

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `deleteValue` removes a specific value from a key in an AVLTreeMultiMap data
   * structure and deletes the entire node if no values are left for that key.
   * @param {BTNRep<K, V[], AVLTreeMultiMapNode<K, V>> | K} keyNodeOrEntry - The `keyNodeOrEntry`
   * parameter in the `deleteValue` function can be either a `BTNRep` object representing a key-value
   * pair in the AVLTreeMultiMapNode, or just the key itself.
   * @param {V} value - The `value` parameter in the `deleteValue` function represents the specific
   * value that you want to delete from the multi-map data structure associated with a particular key.
   * The function checks if the value exists in the array of values associated with the key, and if
   * found, removes it from the array.
   * @returns The `deleteValue` function returns a boolean value. It returns `true` if the specified
   * `value` was successfully deleted from the array of values associated with the `keyNodeOrEntry`. If
   * the value was not found in the array, it returns `false`.
   */
  deleteValue(keyNodeOrEntry: BTNRep<K, V[], AVLTreeMultiMapNode<K, V>> | K, value: V): boolean {
    const values = this.get(keyNodeOrEntry);
    if (Array.isArray(values)) {
      const index = values.indexOf(value);
      if (index === -1) return false;
      values.splice(index, 1);

      // If no values left, remove the entire node
      if (values.length === 0) this.delete(keyNodeOrEntry);

      return true;
    }
    return false;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `clone` overrides the default cloning behavior to create a deep copy of a tree
   * structure.
   * @returns A cloned tree object is being returned.
   */
  override clone() {
    const cloned = this.createTree();
    this._clone(cloned);
    return cloned;
  }
}
