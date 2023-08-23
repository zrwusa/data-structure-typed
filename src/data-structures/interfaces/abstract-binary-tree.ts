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

export interface IAbstractBinaryTreeNode<T, FAMILY extends IAbstractBinaryTreeNode<T, FAMILY>> {

    createNode(id: BinaryTreeNodeId, val?: T, count?: number): FAMILY;

    get id(): BinaryTreeNodeId

    set id(v: BinaryTreeNodeId)

    get val(): T | undefined

    set val(v: T | undefined)

    get left(): FAMILY | null | undefined

    set left(v: FAMILY | null | undefined)

    get right(): FAMILY | null | undefined

    set right(v: FAMILY | null | undefined)

    get parent(): FAMILY | null | undefined

    set parent(v: FAMILY | null | undefined)

    get familyPosition(): FamilyPosition

    set familyPosition(v: FamilyPosition)

    get count(): number

    set count(v: number)

    get height(): number

    set height(v: number)

    swapLocation(swapNode: FAMILY): FAMILY

    clone(): FAMILY | null;
}

export interface IAbstractBinaryTree<N extends AbstractBinaryTreeNode<N['val'], N>> {
    createNode(id: BinaryTreeNodeId, val: N['val'] | null, count?: number): N | null

    get loopType(): LoopType

    get visitedId(): BinaryTreeNodeId[]

    get visitedVal(): Array<N['val']>

    get visitedNode(): N[]

    get visitedCount(): number[]

    get visitedLeftSum(): number[]

    get autoIncrementId(): boolean

    get maxId(): number

    get isDuplicatedVal(): boolean

    get root(): N | null

    get size(): number

    get count(): number

    clear(): void

    isEmpty(): boolean

    add(id: BinaryTreeNodeId, val?: N['val'], count?: number): N | null | undefined

    addTo(newNode: N | null, parent: N): N | null | undefined

    addMany(data: N[] | Array<N['val']>): (N | null | undefined)[]

    fill(data: N[] | Array<N['val']>): boolean

    remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BinaryTreeDeletedResult<N>[]

    getDepth(node: N): number

    getHeight(beginRoot?: N | null): number

    getMinHeight(beginRoot?: N | null): number

    isBalanced(beginRoot?: N | null): boolean

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

    isBSTByRooted(node: N | null): boolean

    isBST(node?: N | null): boolean

    getSubTreeSizeAndCount(subTreeRoot: N | null | undefined): [number, number]

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

    // _setLoopType(value: LoopType): void
    //
    // _setVisitedId(value: BinaryTreeNodeId[]): void
    //
    // _setVisitedVal(value: Array<N>): void
    //
    // _setVisitedNode(value: N[]): void
    //
    // setVisitedCount(value: number[]): void
    //
    // _setVisitedLeftSum(value: number[]): void
    //
    // _setAutoIncrementId(value: boolean): void
    //
    // _setMaxId(value: number): void
    //
    // _setIsDuplicatedVal(value: boolean): void
    //
    // _setRoot(v: N | null): void
    //
    // _setSize(v: number): void
    //
    // _setCount(v: number): void
    //
    // _resetResults(): void

    // _pushByPropertyNameStopOrNot(cur: N, result: (N | null | undefined)[], nodeProperty: BinaryTreeNodeId | N, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean): void
    //
    // _accumulatedByPropertyName(node: N, nodeOrPropertyName ?: NodeOrPropertyName): void
    //
    // _getResultByPropertyName(nodeOrPropertyName ?: NodeOrPropertyName): AbstractBinaryTreeNodeProperties<N>

    // --- end additional methods ---
}