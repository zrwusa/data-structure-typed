/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { BTNOptKeyOrNull, TreeMultiMapOptions } from '../../types';
import { RedBlackTree, RedBlackTreeNode } from './red-black-tree';
import { IBinaryTree } from '../../interfaces';

export class TreeMultiMapNode<K = any, V = any> extends RedBlackTreeNode<K, V[]> {
  override parent?: TreeMultiMapNode<K, V> = undefined;

  /**
   * This TypeScript constructor initializes an object with a key of type K and an array of values of
   * type V.
   * @param {K} key - The `key` parameter is typically used to store a unique identifier or key for the
   * data being stored in the data structure. It helps in quickly accessing or retrieving the
   * associated value in the data structure.
   * @param {V[]} value - The `value` parameter in the constructor represents an array of values of
   * type `V`.
   */
  constructor(key: K, value?: V[]) {
    super(key, value);
  }

  override _left?: TreeMultiMapNode<K, V> | null | undefined = undefined;

  override get left(): TreeMultiMapNode<K, V> | null | undefined {
    return this._left;
  }

  override set left(v: TreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: TreeMultiMapNode<K, V> | null | undefined = undefined;

  override get right(): TreeMultiMapNode<K, V> | null | undefined {
    return this._right;
  }

  override set right(v: TreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 *
 * @example
 * // Find elements in a range
 *     const tmm = new TreeMultiMap<number>([10, 5, 15, 3, 7, 12, 18]);
 *     console.log(tmm.search(new Range(5, 10))); // [5, 7, 10]
 *     console.log(tmm.search(new Range(4, 12))); // [5, 7, 10, 12]
 *     console.log(tmm.search(new Range(15, 20))); // [15, 18]
 */
export class TreeMultiMap<K = any, V = any, R = object, MK = any, MV = any, MR = object>
  extends RedBlackTree<K, V[], R, MK, MV[], MR>
  implements IBinaryTree<K, V[], R, MK, MV, MR>
{
  /**
   * The constructor initializes an TreeMultiMap with the provided keys, nodes, entries, or raw data
   * and options.
   * @param keysNodesEntriesOrRaws - The `keysNodesEntriesOrRaws` parameter in the constructor is an
   * iterable that can contain either key-value pairs represented as `BTNRep<K, V[],
   * TreeMultiMapNode<K, V>>` or raw data represented as `R`. This parameter is used to initialize
   * the RedBlackTreeMulti
   * @param [options] - The `options` parameter in the constructor is of type
   * `TreeMultiMapOptions<K, V[], R>`. It is an optional parameter that allows you to specify
   * additional options for configuring the TreeMultiMap instance.
   */
  constructor(
    keysNodesEntriesOrRaws: Iterable<
      K | TreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined | R
    > = [],
    options?: TreeMultiMapOptions<K, V[], R>
  ) {
    super([], { ...options });
    if (keysNodesEntriesOrRaws) {
      this.addMany(keysNodesEntriesOrRaws);
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `createTree` function in TypeScript overrides the default implementation to create a new
   * TreeMultiMap with specified options.
   * @param [options] - The `options` parameter in the `createTree` method is of type
   * `TreeMultiMapOptions<K, V[], R>`. This parameter allows you to pass additional configuration
   * options when creating a new `TreeMultiMap` instance. It includes properties such as
   * `iterationType`, `specifyComparable
   * @returns A new instance of `TreeMultiMap` is being returned, with an empty array as the initial
   * data and the provided options merged with the existing properties of the current object.
   */
  override createTree(options?: TreeMultiMapOptions<K, V[], R>) {
    return new TreeMultiMap<K, V, R, MK, MV, MR>([], {
      iterationType: this.iterationType,
      specifyComparable: this._specifyComparable,
      toEntryFn: this._toEntryFn,
      isReverse: this._isReverse,
      isMapMode: this._isMapMode,
      ...options
    });
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `createNode` overrides the creation of a new TreeMultiMapNode with a specified key
   * and value array.
   * @param {K} key - The `key` parameter represents the key of the node being created in the
   * `TreeMultiMap`.
   * @param {V[]} value - The `value` parameter in the `createNode` method represents an array of
   * values associated with a specific key in the TreeMultiMap data structure.
   * @returns A new instance of `TreeMultiMapNode<K, V>` is being returned with the specified key and
   * value. If `_isMapMode` is true, an empty array is passed as the value, otherwise the provided
   * value is used.
   */
  override createNode(key: K, value: V[] = []): TreeMultiMapNode<K, V> {
    return new TreeMultiMapNode<K, V>(key, this._isMapMode ? [] : value);
  }

  override add(
    keyNodeOrEntry: K | TreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined
  ): boolean;

  override add(key: K, value: V): boolean;

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function overrides the add method to handle different types of input for a TreeMultiMap data
   * structure.
   * @param [key] - The `key` parameter in the `override add` method represents the key of the entry to
   * be added to the TreeMultiMap. It can be of type `K`, which is the key type of the TreeMultiMap, or
   * it can be a TreeMultiMapNode containing the key and its
   * @param {V[]} [values] - The `values` parameter in the `add` method represents an array of values
   * that you want to add to the TreeMultiMap. It can contain one or more values of type `V`.
   * @returns The `add` method is returning a boolean value, which indicates whether the operation was
   * successful or not.
   */
  override add(
    keyNodeOrEntry: K | TreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined,
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
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `deleteValue` removes a specific value from a key in a TreeMultiMap data structure
   * and deletes the entire node if no values are left for that key.
   * @param {K | TreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined} keyNodeOrEntry - The `keyNodeOrEntry`
   * parameter in the `deleteValue` function can be either a `BTNRep` object containing a key and an
   * array of values, or just a key itself.
   * @param {V} value - The `value` parameter in the `deleteValue` function represents the specific
   * value that you want to remove from the multi-map data structure associated with a particular key.
   * The function checks if the value exists in the array of values associated with the key, and if
   * found, removes it from the array.
   * @returns The `deleteValue` function returns a boolean value - `true` if the specified `value` was
   * successfully deleted from the values associated with the `keyNodeOrEntry`, and `false` otherwise.
   */
  deleteValue(
    keyNodeOrEntry: K | TreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined,
    value: V
  ): boolean {
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
   * @returns The `cloned` object is being returned.
   */
  override clone() {
    const cloned = this.createTree();
    this._clone(cloned);
    return cloned;
  }
}
