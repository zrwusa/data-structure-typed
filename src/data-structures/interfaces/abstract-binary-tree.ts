import {
    AbstractBinaryTreeNodeProperties,
    AbstractBinaryTreeNodeProperty,
    BinaryTreeDeletedResult,
    BinaryTreeNodeId,
    BinaryTreeNodePropertyName,
    DFSOrderPattern,
    FamilyPosition,
    LoopType,
    NodeOrPropertyName
} from '../types';
import {AbstractBinaryTreeNode} from '../binary-tree';

export interface IAbstractBinaryTreeNode<T, NEIGHBOR extends IAbstractBinaryTreeNode<T, NEIGHBOR>> {

    get id(): BinaryTreeNodeId

    set id(v: BinaryTreeNodeId)

    get val(): T | undefined

    set val(v: T | undefined)

    get left(): NEIGHBOR | null | undefined

    set left(v: NEIGHBOR | null | undefined)

    get right(): NEIGHBOR | null | undefined

    set right(v: NEIGHBOR | null | undefined)

    get parent(): NEIGHBOR | null | undefined

    set parent(v: NEIGHBOR | null | undefined)

    get familyPosition(): FamilyPosition

    get height(): number

    set height(v: number)
}

export interface IAbstractBinaryTree<N extends AbstractBinaryTreeNode<N['val'], N>> {
    createNode(id: BinaryTreeNodeId, val?: N['val'], count?: number): N | null

    get loopType(): LoopType

    get visitedId(): BinaryTreeNodeId[]

    get visitedVal(): Array<N['val']>

    get visitedNode(): N[]

    get visitedLeftSum(): number[]

    get root(): N | null

    get size(): number

    swapLocation(srcNode: N, destNode: N): N

    clear(): void

    isEmpty(): boolean

    add(id: BinaryTreeNodeId | N, val?: N['val']): N | null | undefined

    addMany(idsOrNodes: (BinaryTreeNodeId | N | null)[], data?: N['val'][]): (N | null | undefined)[]

    fill(idsOrNodes: (BinaryTreeNodeId | N | null)[], data?: N[] | Array<N['val']>): boolean

    remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeletedResult<N>[]

    getDepth(node: N): number

    getHeight(beginRoot?: N | null): number

    getMinHeight(beginRoot?: N | null): number

    isPerfectlyBalanced(beginRoot?: N | null): boolean

    getNodes(nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean): N[]

    has(nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName): boolean

    get(nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName): N | null

    getPathToRoot(node: N): N[]

    getLeftMost(): N | null;

    getLeftMost(node: N): N;

    getLeftMost(node?: N | null): N | null

    getRightMost(): N | null;

    getRightMost(node: N): N;

    getRightMost(node?: N | null): N | null

    isSubtreeBST(node: N | null): boolean

    isBST(): boolean

    getSubTreeSize(subTreeRoot: N | null | undefined): number

    // --- start additional methods ---

    subTreeSum(subTreeRoot: N, propertyName ?: BinaryTreeNodePropertyName): number

    subTreeAdd(subTreeRoot: N, delta: number, propertyName ?: BinaryTreeNodePropertyName): boolean

    BFS(): BinaryTreeNodeId[];

    BFS(nodeOrPropertyName: 'id'): BinaryTreeNodeId[];

    BFS(nodeOrPropertyName: 'val'): N['val'][];

    BFS(nodeOrPropertyName: 'node'): N[];

    BFS(nodeOrPropertyName: 'count'): number[];

    BFS(nodeOrPropertyName ?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>

    DFS(): BinaryTreeNodeId[];

    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];

    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): N[];

    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): N[];

    DFS(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];

    DFS(pattern ?: 'in' | 'pre' | 'post', nodeOrPropertyName ?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>

    DFSIterative(): BinaryTreeNodeId[];

    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];

    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): N[];

    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): N[];

    DFSIterative(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];

    DFSIterative(pattern ?: 'in' | 'pre' | 'post', nodeOrPropertyName ?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>

    levelIterative(node: N | null): BinaryTreeNodeId[];

    levelIterative(node: N | null, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];

    levelIterative(node: N | null, nodeOrPropertyName?: 'val'): N['val'][];

    levelIterative(node: N | null, nodeOrPropertyName?: 'node'): N[];

    levelIterative(node: N | null, nodeOrPropertyName?: 'count'): number[];

    levelIterative(node: N | null, nodeOrPropertyName ?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>

    listLevels(node: N | null): BinaryTreeNodeId[][];

    listLevels(node: N | null, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[][];

    listLevels(node: N | null, nodeOrPropertyName?: 'val'): N['val'][][];

    listLevels(node: N | null, nodeOrPropertyName?: 'node'): N[][];

    listLevels(node: N | null, nodeOrPropertyName?: 'count'): number[][];

    listLevels(node: N | null, nodeOrPropertyName?: NodeOrPropertyName): AbstractBinaryTreeNodeProperty<N>[][]

    getPredecessor(node: N): N

    morris(): BinaryTreeNodeId[];

    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'id'): BinaryTreeNodeId[];

    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'val'): N[];

    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'node'): N[];

    morris(pattern?: DFSOrderPattern, nodeOrPropertyName?: 'count'): number[];

    morris(pattern?: 'in' | 'pre' | 'post', nodeOrPropertyName?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>


    // --- end additional methods ---
}