/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { BTNOptKeyOrNull, ElemOf, EntryCallback, RedBlackTreeOptions, TreeMultiMapOptions } from '../../types';
import { RedBlackTree, RedBlackTreeNode } from './red-black-tree';
import { IBinaryTree } from '../../interfaces';

/**
 * Node used by TreeMultiMap; stores the key with a bucket of values (array).
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 */
export class TreeMultiMapNode<K = any, V = any> extends RedBlackTreeNode<K, V[]> {
  override parent?: TreeMultiMapNode<K, V> = undefined;

  /**
   * Create a TreeMultiMap node with an optional value bucket.
   * @remarks Time O(1), Space O(1)
   * @param key - Key of the node.
   * @param [value] - Initial array of values.
   * @returns New TreeMultiMapNode instance.
   */
  constructor(key: K, value?: V[]) {
    super(key, value);
  }

  override _left?: TreeMultiMapNode<K, V> | null | undefined = undefined;

  /**
   * Get the left child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Left child node, or null/undefined.
   */
  override get left(): TreeMultiMapNode<K, V> | null | undefined {
    return this._left;
  }

  /**
   * Set the left child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New left child node, or null/undefined.
   * @returns void
   */
  override set left(v: TreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._left = v;
  }

  override _right?: TreeMultiMapNode<K, V> | null | undefined = undefined;

  /**
   * Get the right child pointer.
   * @remarks Time O(1), Space O(1)
   * @returns Right child node, or null/undefined.
   */
  override get right(): TreeMultiMapNode<K, V> | null | undefined {
    return this._right;
  }

  /**
   * Set the right child and update its parent pointer.
   * @remarks Time O(1), Space O(1)
   * @param v - New right child node, or null/undefined.
   * @returns void
   */
  override set right(v: TreeMultiMapNode<K, V> | null | undefined) {
    if (v) {
      v.parent = this;
    }
    this._right = v;
  }
}

/**
 * Red-Black Tree–based multimap (key → array of values). Preserves O(log N) updates and supports map-like mode.
 * @remarks Time O(1), Space O(1)
 * @template K
 * @template V
 * @template R
 * @example
 * // players ranked by score with their equipment
 *     type Equipment = {
 *       name: string; // Equipment name
 *       quality: 'legendary' | 'epic' | 'rare' | 'common';
 *       level: number;
 *     };
 *
 *     type Player = {
 *       name: string;
 *       score: number;
 *       equipments: Equipment[];
 *     };
 *
 *     // Mock player data with their scores and equipment
 *     const players: Player[] = [
 *       {
 *         name: 'DragonSlayer',
 *         score: 8750,
 *         equipments: [
 *           { name: 'AWM', quality: 'legendary', level: 85 },
 *           { name: 'Level 3 Helmet', quality: 'epic', level: 80 },
 *           { name: 'Extended Quickdraw Mag', quality: 'rare', level: 75 },
 *           { name: 'Compensator', quality: 'epic', level: 78 },
 *           { name: 'Vertical Grip', quality: 'rare', level: 72 }
 *         ]
 *       },
 *       {
 *         name: 'ShadowNinja',
 *         score: 7200,
 *         equipments: [
 *           { name: 'M416', quality: 'epic', level: 75 },
 *           { name: 'Ghillie Suit', quality: 'rare', level: 70 },
 *           { name: 'Red Dot Sight', quality: 'common', level: 65 },
 *           { name: 'Extended QuickDraw Mag', quality: 'rare', level: 68 }
 *         ]
 *       },
 *       {
 *         name: 'RuneMaster',
 *         score: 9100,
 *         equipments: [
 *           { name: 'KAR98K', quality: 'legendary', level: 90 },
 *           { name: 'Level 3 Vest', quality: 'legendary', level: 85 },
 *           { name: 'Holographic Sight', quality: 'epic', level: 82 },
 *           { name: 'Suppressor', quality: 'legendary', level: 88 },
 *           { name: 'Level 3 Backpack', quality: 'epic', level: 80 }
 *         ]
 *       },
 *       {
 *         name: 'BattleKing',
 *         score: 8500,
 *         equipments: [
 *           { name: 'AUG', quality: 'epic', level: 82 },
 *           { name: 'Red Dot Sight', quality: 'rare', level: 75 },
 *           { name: 'Extended Mag', quality: 'common', level: 70 },
 *           { name: 'Tactical Stock', quality: 'rare', level: 76 }
 *         ]
 *       },
 *       {
 *         name: 'SniperElite',
 *         score: 7800,
 *         equipments: [
 *           { name: 'M24', quality: 'legendary', level: 88 },
 *           { name: 'Compensator', quality: 'epic', level: 80 },
 *           { name: 'Scope 8x', quality: 'legendary', level: 85 },
 *           { name: 'Level 2 Helmet', quality: 'rare', level: 75 }
 *         ]
 *       },
 *       {
 *         name: 'RushMaster',
 *         score: 7500,
 *         equipments: [
 *           { name: 'Vector', quality: 'rare', level: 72 },
 *           { name: 'Level 2 Helmet', quality: 'common', level: 65 },
 *           { name: 'Quickdraw Mag', quality: 'common', level: 60 },
 *           { name: 'Laser Sight', quality: 'rare', level: 68 }
 *         ]
 *       },
 *       {
 *         name: 'GhostWarrior',
 *         score: 8200,
 *         equipments: [
 *           { name: 'SCAR-L', quality: 'epic', level: 78 },
 *           { name: 'Extended Quickdraw Mag', quality: 'rare', level: 70 },
 *           { name: 'Holographic Sight', quality: 'epic', level: 75 },
 *           { name: 'Suppressor', quality: 'rare', level: 72 },
 *           { name: 'Vertical Grip', quality: 'common', level: 65 }
 *         ]
 *       },
 *       {
 *         name: 'DeathDealer',
 *         score: 7300,
 *         equipments: [
 *           { name: 'SKS', quality: 'epic', level: 76 },
 *           { name: 'Holographic Sight', quality: 'rare', level: 68 },
 *           { name: 'Extended Mag', quality: 'common', level: 65 }
 *         ]
 *       },
 *       {
 *         name: 'StormRider',
 *         score: 8900,
 *         equipments: [
 *           { name: 'MK14', quality: 'legendary', level: 92 },
 *           { name: 'Level 3 Backpack', quality: 'legendary', level: 85 },
 *           { name: 'Scope 8x', quality: 'epic', level: 80 },
 *           { name: 'Suppressor', quality: 'legendary', level: 88 },
 *           { name: 'Tactical Stock', quality: 'rare', level: 75 }
 *         ]
 *       },
 *       {
 *         name: 'CombatLegend',
 *         score: 7600,
 *         equipments: [
 *           { name: 'UMP45', quality: 'rare', level: 74 },
 *           { name: 'Level 2 Vest', quality: 'common', level: 67 },
 *           { name: 'Red Dot Sight', quality: 'common', level: 62 },
 *           { name: 'Extended Mag', quality: 'rare', level: 70 }
 *         ]
 *       }
 *     ];
 *
 *     // Create a TreeMultiMap for player rankings
 *     const playerRankings = new TreeMultiMap<number, Equipment, Player>(players, {
 *       toEntryFn: ({ score, equipments }) => [score, equipments],
 *       isMapMode: false
 *     });
 *
 *     const topPlayersEquipments = playerRankings.rangeSearch([8900, 10000], node => playerRankings.get(node));
 *     console.log(topPlayersEquipments); // [
 *  //      [
 *  //        {
 *  //          name: 'MK14',
 *  //          quality: 'legendary',
 *  //          level: 92
 *  //        },
 *  //        { name: 'Level 3 Backpack', quality: 'legendary', level: 85 },
 *  //        {
 *  //          name: 'Scope 8x',
 *  //          quality: 'epic',
 *  //          level: 80
 *  //        },
 *  //        { name: 'Suppressor', quality: 'legendary', level: 88 },
 *  //        {
 *  //          name: 'Tactical Stock',
 *  //          quality: 'rare',
 *  //          level: 75
 *  //        }
 *  //      ],
 *  //      [
 *  //        { name: 'KAR98K', quality: 'legendary', level: 90 },
 *  //        {
 *  //          name: 'Level 3 Vest',
 *  //          quality: 'legendary',
 *  //          level: 85
 *  //        },
 *  //        { name: 'Holographic Sight', quality: 'epic', level: 82 },
 *  //        {
 *  //          name: 'Suppressor',
 *  //          quality: 'legendary',
 *  //          level: 88
 *  //        },
 *  //        { name: 'Level 3 Backpack', quality: 'epic', level: 80 }
 *  //      ]
 *  //    ]
 */
export class TreeMultiMap<K = any, V = any, R = any> extends RedBlackTree<K, V[], R> implements IBinaryTree<K, V[], R> {
  /**
   * Create a TreeMultiMap and optionally bulk-insert items.
   * @remarks Time O(N log N), Space O(N)
   * @param [keysNodesEntriesOrRaws] - Iterable of keys/nodes/entries/raw items to insert.
   * @param [options] - Options for TreeMultiMap (comparator, reverse, map mode).
   * @returns New TreeMultiMap instance.
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

  override _createNode(key: K, value: V[] = []): TreeMultiMapNode<K, V> {
    return new TreeMultiMapNode<K, V>(key, this._isMapMode ? [] : value);
  }

  override add(
    keyNodeOrEntry: K | TreeMultiMapNode<K, V> | [K | null | undefined, V[] | undefined] | null | undefined
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
   * Delete a single value from the bucket at a given key. Removes the key if the bucket becomes empty.
   * @remarks Time O(log N), Space O(1)
   * @param keyNodeOrEntry - Key, node, or [key, values] entry to locate the bucket.
   * @param value - Value to remove from the bucket.
   * @returns True if the value was removed; false if not found.
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

      if (values.length === 0) this.delete(keyNodeOrEntry);

      return true;
    }
    return false;
  }

  override map<MK = K, MVArr extends unknown[] = V[], MR = any>(
    callback: EntryCallback<K, V[] | undefined, [MK, MVArr]>,
    options?: Partial<RedBlackTreeOptions<MK, MVArr, MR>>,
    thisArg?: unknown
  ): TreeMultiMap<MK, ElemOf<MVArr>, MR>;

  override map<MK = K, MV = V[], MR = any>(
    callback: EntryCallback<K, V[] | undefined, [MK, MV]>,
    options?: Partial<RedBlackTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): RedBlackTree<MK, MV, MR>;

  /**
   * Create a new tree by mapping each [key, values] bucket.
   * @remarks Time O(N log N), Space O(N)
   * @template MK
   * @template MV
   * @template MR
   * @param callback - Function mapping (key, values, index, tree) → [newKey, newValue].
   * @param [options] - Options for the output tree.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new RedBlackTree (or TreeMultiMap when mapping to array values; see overloads).
   */
  override map<MK, MV, MR extends object>(
    callback: EntryCallback<K, V[] | undefined, [MK, MV]>,
    options?: Partial<RedBlackTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): RedBlackTree<MK, MV, MR> {
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
  protected override _createInstance<TK = K, TV = V, TR = R>(options?: Partial<RedBlackTreeOptions<TK, TV, TR>>): this {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | RedBlackTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: RedBlackTreeOptions<TK, TV, TR>
    ) => RedBlackTree<TK, TV, TR>;
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
   * @returns A like-kind RedBlackTree built from the iterable.
   */
  protected override _createLike<TK = K, TV = V, TR = R>(
    iter: Iterable<
      TK | RedBlackTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR
    > = [],
    options?: Partial<RedBlackTreeOptions<TK, TV, TR>>
  ): RedBlackTree<TK, TV, TR> {
    const Ctor = this.constructor as unknown as new (
      iter?: Iterable<TK | RedBlackTreeNode<TK, TV> | [TK | null | undefined, TV | undefined] | null | undefined | TR>,
      opts?: RedBlackTreeOptions<TK, TV, TR>
    ) => RedBlackTree<TK, TV, TR>;
    return new Ctor(iter, { ...(this._snapshotOptions?.<TK, TV, TR>() ?? {}), ...(options ?? {}) });
  }
}
