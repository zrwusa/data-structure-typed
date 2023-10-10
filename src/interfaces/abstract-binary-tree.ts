import {
  AbstractBinaryTreeNodeProperties,
  AbstractBinaryTreeNodeProperty,
  BinaryTreeDeletedResult,
  BinaryTreeNodeKey,
  BinaryTreeNodePropertyName,
  DFSOrderPattern,
  FamilyPosition,
  LoopType,
  NodeOrPropertyName
} from '../types';
import {AbstractBinaryTreeNode} from '../data-structures';

export interface IAbstractBinaryTreeNode<T, NEIGHBOR extends IAbstractBinaryTreeNode<T, NEIGHBOR>> {
  key: BinaryTreeNodeKey;

  val: T | undefined;

  get left(): NEIGHBOR | null | undefined;

  set left(v: NEIGHBOR | null | undefined);

  get right(): NEIGHBOR | null | undefined;

  set right(v: NEIGHBOR | null | undefined);

  parent: NEIGHBOR | null | undefined;

  get familyPosition(): FamilyPosition;
}

export interface IAbstractBinaryTree<N extends AbstractBinaryTreeNode<N['val'], N>> {
  createNode(key: BinaryTreeNodeKey, val?: N['val'], count?: number): N | null;

  get loopType(): LoopType;

  get visitedKey(): BinaryTreeNodeKey[];

  get visitedVal(): Array<N['val']>;

  get visitedNode(): N[];

  get root(): N | null;

  get size(): number;

  swapLocation(srcNode: N, destNode: N): N;

  clear(): void;

  isEmpty(): boolean;

  add(key: BinaryTreeNodeKey | N, val?: N['val']): N | null | undefined;

  addMany(keysOrNodes: (BinaryTreeNodeKey | N | null)[], data?: N['val'][]): (N | null | undefined)[];

  refill(keysOrNodes: (BinaryTreeNodeKey | N | null)[], data?: N[] | Array<N['val']>): boolean;

  remove(key: BinaryTreeNodeKey, ignoreCount?: boolean): BinaryTreeDeletedResult<N>[];

  getDepth(node: N): number;

  getHeight(beginRoot?: N | null): number;

  getMinHeight(beginRoot?: N | null): number;

  isPerfectlyBalanced(beginRoot?: N | null): boolean;

  getNodes(nodeProperty: BinaryTreeNodeKey | N, propertyName?: BinaryTreeNodePropertyName, onlyOne?: boolean): N[];

  has(nodeProperty: BinaryTreeNodeKey | N, propertyName?: BinaryTreeNodePropertyName): boolean;

  get(nodeProperty: BinaryTreeNodeKey | N, propertyName?: BinaryTreeNodePropertyName): N | null;

  getPathToRoot(node: N): N[];

  getLeftMost(): N | null;

  getLeftMost(node: N): N;

  getLeftMost(node?: N | null): N | null;

  getRightMost(): N | null;

  getRightMost(node: N): N;

  getRightMost(node?: N | null): N | null;

  isSubtreeBST(node: N | null): boolean;

  isBST(): boolean;

  getSubTreeSize(subTreeRoot: N | null | undefined): number;

  // --- start additional methods ---

  subTreeSum(subTreeRoot: N, propertyName?: BinaryTreeNodePropertyName): number;

  subTreeAdd(subTreeRoot: N, delta: number, propertyName?: BinaryTreeNodePropertyName): boolean;

  bfs(): BinaryTreeNodeKey[];

  bfs(nodeOrPropertyName: 'key'): BinaryTreeNodeKey[];

  bfs(nodeOrPropertyName: 'val'): N['val'][];

  bfs(nodeOrPropertyName: 'node'): N[];

  bfs(nodeOrPropertyName: 'count'): number[];

  bfs(nodeOrPropertyName?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>;

  dfs(): BinaryTreeNodeKey[];

  dfs(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'key'): BinaryTreeNodeKey[];

  dfs(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): N[];

  dfs(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): N[];

  dfs(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];

  dfs(pattern?: 'in' | 'pre' | 'post', nodeOrPropertyName?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>;

  DFSIterative(): BinaryTreeNodeKey[];

  DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'key'): BinaryTreeNodeKey[];

  DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): N[];

  DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): N[];

  DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];

  DFSIterative(
    pattern?: 'in' | 'pre' | 'post',
    nodeOrPropertyName?: NodeOrPropertyName
  ): AbstractBinaryTreeNodeProperties<N>;

  levelIterative(node: N | null): BinaryTreeNodeKey[];

  levelIterative(node: N | null, nodeOrPropertyName?: 'key'): BinaryTreeNodeKey[];

  levelIterative(node: N | null, nodeOrPropertyName?: 'val'): N['val'][];

  levelIterative(node: N | null, nodeOrPropertyName?: 'node'): N[];

  levelIterative(node: N | null, nodeOrPropertyName?: 'count'): number[];

  levelIterative(node: N | null, nodeOrPropertyName?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>;

  listLevels(node: N | null): BinaryTreeNodeKey[][];

  listLevels(node: N | null, nodeOrPropertyName?: 'key'): BinaryTreeNodeKey[][];

  listLevels(node: N | null, nodeOrPropertyName?: 'val'): N['val'][][];

  listLevels(node: N | null, nodeOrPropertyName?: 'node'): N[][];

  listLevels(node: N | null, nodeOrPropertyName?: 'count'): number[][];

  listLevels(node: N | null, nodeOrPropertyName?: NodeOrPropertyName): AbstractBinaryTreeNodeProperty<N>[][];

  getPredecessor(node: N): N;

  morris(): BinaryTreeNodeKey[];

  morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'key'): BinaryTreeNodeKey[];

  morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): N[];

  morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): N[];

  morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];

  morris(pattern?: 'in' | 'pre' | 'post', nodeOrPropertyName?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>;

  // --- end additional methods ---
}
