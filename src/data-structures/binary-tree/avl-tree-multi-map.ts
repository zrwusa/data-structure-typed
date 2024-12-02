/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import { AVLTreeMultiMapOptions, BTNOptKeyOrNull } from '../../types';
import { AVLTree, AVLTreeNode } from './avl-tree';
import { IBinaryTree } from '../../interfaces';

export class AVLTreeMultiMapNode<K = any, V = any> extends AVLTreeNode<K, V[]> {
  override parent?: AVLTreeMultiMapNode<K, V> = undefined;

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

  override _left?: AVLTreeMultiMapNode<K, V> | null | undefined = undefined;

  override get left(): AVLTreeMultiMapNode<K, V> | null | undefined {
    return this._left;
  }

  override set left(v: AVLTreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: AVLTreeMultiMapNode<K, V> | null | undefined = undefined;

  override get right(): AVLTreeMultiMapNode<K, V> | null | undefined {
    return this._right;
  }

  override set right(v: AVLTreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 *
 */
export class AVLTreeMultiMap<K = any, V = any, R = object, MK = any, MV = any, MR = object>
  extends AVLTree<K, V[], R, MK, MV[], MR>
  implements IBinaryTree<K, V[], R, MK, MV, MR>
{
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
      isMapMode: this._isMapMode,
      ...options
    });
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `createNode` function in TypeScript overrides the default implementation to create a new
   * AVLTreeMultiMapNode with a specified key and value array.
   * @param {K} key - The `key` parameter represents the key of the node being created in the
   * AVLTreeMultiMap.
   * @param {V[]} value - The `value` parameter in the `createNode` method represents an array of
   * values associated with a specific key in the AVLTreeMultiMapNode. If no value is provided when
   * calling the method, an empty array `[]` is used as the default value.
   * @returns An AVLTreeMultiMapNode object is being returned, with the specified key and value. If the
   * AVLTreeMultiMap is in map mode, an empty array is used as the value, otherwise the provided value
   * array is used.
   */
  override createNode(key: K, value: V[] = []): AVLTreeMultiMapNode<K, V> {
    return new AVLTreeMultiMapNode<K, V>(key, this._isMapMode ? [] : value);
  }

  override add(
    keyNodeOrEntry: K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined
  ): boolean;

  override add(key: K, value: V): boolean;

  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(log n)
   *
   * The function `add` in this TypeScript code overrides the superclass method to add key-value pairs
   * to an AVLTreeMultiMap, handling different input types and scenarios.
   * @param [key] - The `key` parameter in the `override add` method represents the key of the entry to
   * be added to the AVLTreeMultiMap. It can be of type `K`, which is the key type of the map. The key
   * can be a single key value, a node of the AVLTree
   * @param {V[]} [values] - The `values` parameter in the `add` method represents an array of values
   * that you want to add to the AVLTreeMultiMap. It can contain one or more values associated with a
   * specific key.
   * @returns The `add` method is returning a boolean value, which indicates whether the operation was
   * successful or not.
   */
  override add(
    keyNodeOrEntry: K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined | K,
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
   * The function `deleteValue` removes a specific value from a key in an AVLTreeMultiMap data
   * structure and deletes the entire node if no values are left for that key.
   * @param {K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined | K} keyNodeOrEntry - The `keyNodeOrEntry`
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
  deleteValue(
    keyNodeOrEntry: K | AVLTreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined | K,
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
   * @returns A cloned tree object is being returned.
   */
  override clone() {
    const cloned = this.createTree();
    this._clone(cloned);
    return cloned;
  }
}
