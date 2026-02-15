import { BinaryTreeNode } from '../data-structures';
import type {
  BinaryTreeDeleteResult,
  BinaryTreeOptions,
  BTNRep,
  DFSOrderPattern,
  EntryCallback,
  IterationType,
  NodeCallback,
  NodePredicate,
  OptNodeOrNull,
  ReduceEntryCallback,
  ToEntryFn
} from '../types';

/**
 * Public, implementation-agnostic binary tree API.
 * K = key, V = value, R = raw/record used with toEntryFn (optional).
 * Transforming methods like `map` use method-level generics MK/MV/MR.
 */
export interface IBinaryTree<K = any, V = any, R = any> {
  // ---- state ----
  readonly size: number;
  readonly root: BinaryTreeNode<K, V> | null | undefined;
  readonly isMapMode: boolean;
  // NOTE: iterationType is mutable on the class; remove readonly here to match
  iterationType: IterationType;
  // Extra public state/getters implemented by BinaryTree (useful to callers)
  readonly NIL: BinaryTreeNode<K, V>;
  readonly store: Map<K, BinaryTreeNode<K, V>>;
  readonly toEntryFn?: ToEntryFn<K, V, R>;
  readonly isDuplicate: boolean;

  // ---- construction / mutation ----
  createNode(key: K, value?: BinaryTreeNode<K, V>['value']): BinaryTreeNode<K, V>;

  createTree(options?: Partial<BinaryTreeOptions<K, V, R>>): IBinaryTree<K, V, R>;

  add(keyOrNodeOrEntryOrRawElement: BTNRep<K, V, BinaryTreeNode<K, V>>, value?: V, count?: number): boolean;

  set(keyOrNodeOrEntryOrRawElement: BTNRep<K, V, BinaryTreeNode<K, V>>, value?: V, count?: number): boolean;

  // Accept raw R as well (when toEntryFn is configured)
  addMany(
    keysNodesEntriesOrRaws: Iterable<
      K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    >,
    values?: Iterable<V | undefined>
  ): boolean[];

  // Accept BTNRep, predicate, or raw R for deletion
  delete(
    keyNodeEntryRawOrPredicate: BTNRep<K, V, BinaryTreeNode<K, V>> | NodePredicate<BinaryTreeNode<K, V> | null>
  ): BinaryTreeDeleteResult<BinaryTreeNode<K, V>>[];

  clear(): void;

  isEmpty(): boolean;

  // ---- query / read ----

  // Widen `get` to support entry and optional traversal context (matches impl)
  get(
    keyNodeEntryOrPredicate: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): V | undefined;

  // `has` also supports node/entry/predicate and optional traversal context
  has(
    keyNodeEntryOrPredicate?:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): boolean;

  hasValue(value: V): boolean;

  find(predicate: EntryCallback<K, V | undefined, boolean>, thisArg?: unknown): [K, V | undefined] | undefined;

  // ---- iteration ----
  [Symbol.iterator](): IterableIterator<[K, V | undefined]>;

  entries(): IterableIterator<[K, V | undefined]>;

  keys(): IterableIterator<K>;

  values(): IterableIterator<V | undefined>;

  forEach(callbackfn: EntryCallback<K, V | undefined, void>, thisArg?: unknown): void;

  every(callbackfn: EntryCallback<K, V | undefined, boolean>, thisArg?: unknown): boolean;

  some(callbackfn: EntryCallback<K, V | undefined, boolean>, thisArg?: unknown): boolean;

  reduce<U>(reducer: ReduceEntryCallback<K, V | undefined, U>, initialValue: U): U;

  // ---- node access / extremes ----
  getNode(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): OptNodeOrNull<BinaryTreeNode<K, V>>;

  getLeftMost<C extends NodeCallback<OptNodeOrNull<BinaryTreeNode<K, V>>>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): ReturnType<C>;

  getRightMost<C extends NodeCallback<BinaryTreeNode<K, V> | undefined>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): ReturnType<C>;

  // ---- traversal ----
  dfs<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    onlyOne?: boolean,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): ReturnType<C>[];

  dfs<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    onlyOne?: boolean,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: boolean
  ): ReturnType<C>[];

  bfs<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[];

  bfs<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[];

  morris<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    pattern?: DFSOrderPattern,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): ReturnType<C>[];

  leaves<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): ReturnType<C>[];

  listLevels<C extends NodeCallback<BinaryTreeNode<K, V>>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: false
  ): ReturnType<C>[][];

  listLevels<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType,
    includeNull?: true
  ): ReturnType<C>[][];

  getPathToRoot<C extends NodeCallback<OptNodeOrNull<BinaryTreeNode<K, V>>>>(
    beginNode: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    callback?: C,
    isReverse?: boolean
  ): ReturnType<C>[];

  // ---- metrics & validation ----
  getDepth(
    dist: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): number;

  getHeight(
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): number;

  getMinHeight(
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): number;

  isPerfectlyBalanced(
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined
  ): boolean;

  isBST(
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): boolean;

  // ---- search helpers ----
  search<C extends NodeCallback<BinaryTreeNode<K, V> | null>>(
    keyNodeEntryOrPredicate:
      | K
      | BinaryTreeNode<K, V>
      | [K | null | undefined, V | undefined]
      | null
      | undefined
      | NodePredicate<BinaryTreeNode<K, V> | null>,
    onlyOne?: boolean,
    callback?: C,
    startNode?: K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined,
    iterationType?: IterationType
  ): ReturnType<C>[];

  // ---- immutable transforms ----
  clone(): this;

  filter(predicate: EntryCallback<K, V | undefined, boolean>, thisArg?: unknown): this;

  map<MK = K, MV = V, MR = any>(
    callback: EntryCallback<K, V | undefined, [MK, MV]>,
    options?: Partial<BinaryTreeOptions<MK, MV, MR>>,
    thisArg?: unknown
  ): IBinaryTree<MK, MV, MR>;

  // ---- bulk / interop ----
  merge(anotherTree: IBinaryTree<K, V, R>): void;

  refill(
    keysNodesEntriesOrRaws: Iterable<
      K | BinaryTreeNode<K, V> | [K | null | undefined, V | undefined] | null | undefined | R
    >,
    values?: Iterable<V | undefined>
  ): void;
}
