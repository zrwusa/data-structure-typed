import {arrayRemove, uuidV4} from '../../utils';
import {PriorityQueue} from '../priority-queue';
import type {DijkstraResult, IGraph, VertexId} from '../types';

export class AbstractVertex {
    constructor(id: VertexId) {
        this._id = id;
    }

    private _id: VertexId;

    public get id(): VertexId {
        return this._id;
    }

    public set id(v: VertexId) {
        this._id = v;
    }
}

export abstract class AbstractEdge {

    static DEFAULT_EDGE_WEIGHT = 1;

    protected constructor(weight?: number) {
        if (weight === undefined) weight = AbstractEdge.DEFAULT_EDGE_WEIGHT;
        this._weight = weight;
        this._hashCode = uuidV4();
    }

    private _weight: number;

    get weight(): number {
        return this._weight;
    }

    set weight(v: number) {
        this._weight = v;
    }

    private _hashCode: string;

    get hashCode(): string {
        return this._hashCode;
    }

    set hashCode(v: string) {
        this._hashCode = v;
    }
}

// Connected Component === Largest Connected Sub-Graph
export abstract class AbstractGraph<V extends AbstractVertex, E extends AbstractEdge> implements IGraph<V, E> {

    protected _vertices: Map<VertexId, V> = new Map<VertexId, V>();

    abstract removeEdgeBetween(srcOrId: V | VertexId, destOrId: V | VertexId): E | null;

    abstract removeEdge(edge: E): E | null;

    getVertex(vertexOrId: VertexId | V): V | null {
        const vertexId = this.getVertexId(vertexOrId);
        return this._vertices.get(vertexId) || null;
    }

    getVertexId(vertexOrId: V | VertexId): VertexId {
        return vertexOrId instanceof AbstractVertex ? vertexOrId.id : vertexOrId;
    }

    containsVertex(vertexOrId: V | VertexId): boolean {
        return this._vertices.has(this.getVertexId(vertexOrId));
    }

    vertexSet(): Map<VertexId, V> {
        return this._vertices;
    }

    abstract getEdge(srcOrId: V | null | VertexId, destOrId: V | null | VertexId): E | null;

    addVertex(newVertex: V): boolean {
        if (this.containsVertex(newVertex)) {
            return false;
        }
        this._vertices.set(newVertex.id, newVertex);
        return true;
    }

    removeVertex(vertexOrId: V | VertexId): boolean {
        const vertexId = this.getVertexId(vertexOrId);
        return this._vertices.delete(vertexId);
    }

    removeAllVertices(vertices: V[] | VertexId[]): boolean {
        const removed: boolean[] = [];
        for (const v of vertices) {
            removed.push(this.removeVertex(v));
        }
        return removed.length > 0;
    }

    abstract degreeOf(vertexOrId: V | VertexId): number;

    abstract edgeSet(): E[];

    abstract edgesOf(vertexOrId: V | VertexId): E[];

    containsEdge(v1: VertexId | V, v2: VertexId | V): boolean {
        const edge = this.getEdge(v1, v2);
        return !!edge;
    }

    abstract addEdge(edge: E): boolean;

    setEdgeWeight(srcOrId: VertexId | V, destOrId: VertexId | V, weight: number): boolean {
        const edge = this.getEdge(srcOrId, destOrId);
        if (edge) {
            edge.weight = weight;
            return true;
        } else {
            return false;
        }
    }

    abstract getNeighbors(vertexOrId: V | VertexId): V[];

    getAllPathsBetween(v1: V | VertexId, v2: V | VertexId): V[][] {
        const paths: V[][] = [];
        const vertex1 = this.getVertex(v1);
        const vertex2 = this.getVertex(v2);
        if (!(vertex1 && vertex2)) {
            return [];
        }

        const dfs = (cur: V, dest: V, visiting: Map<V, boolean>, path: V[]) => {
            visiting.set(cur, true);

            if (cur === dest) {
                paths.push([vertex1, ...path]);
            }

            const neighbors = this.getNeighbors(cur);
            for (const neighbor of neighbors) {
                if (!visiting.get(neighbor)) {
                    path.push(neighbor);
                    dfs(neighbor, dest, visiting, path);
                    arrayRemove(path, (vertex: AbstractVertex) => vertex === neighbor);
                }
            }

            visiting.set(cur, false);
        };

        dfs(vertex1, vertex2, new Map<V, boolean>(), []);
        return paths;
    }


    getPathSumWeight(path: V[]): number {
        let sum = 0;
        for (let i = 0; i < path.length; i++) {
            sum += this.getEdge(path[i], path[i + 1])?.weight || 0;
        }
        return sum;
    }

    getMinCostBetween(v1: V | VertexId, v2: V | VertexId, isWeight?: boolean): number | null {
        if (isWeight === undefined) isWeight = false;

        if (isWeight) {
            const allPaths = this.getAllPathsBetween(v1, v2);
            let min = Infinity;
            for (const path of allPaths) {
                min = Math.min(this.getPathSumWeight(path), min);
            }
            return min;
        } else {
            // BFS
            const vertex2 = this.getVertex(v2);
            const vertex1 = this.getVertex(v1);
            if (!(vertex1 && vertex2)) {
                return null;
            }

            const visited: Map<V, boolean> = new Map();
            const queue: V[] = [vertex1];
            visited.set(vertex1, true);
            let cost = 0;
            while (queue.length > 0) {
                for (let i = 0; i < queue.length; i++) {
                    const cur = queue.shift();
                    if (cur === vertex2) {
                        return cost;
                    }
                    // TODO consider optimizing to AbstractGraph
                    if (cur !== undefined) {
                        const neighbors = this.getNeighbors(cur);
                        for (const neighbor of neighbors) {
                            if (!visited.has(neighbor)) {
                                visited.set(neighbor, true);
                                queue.push(neighbor);
                            }
                        }
                    }
                }
                cost++;
            }
            return null;
        }
    }

    getMinPathBetween(v1: V | VertexId, v2: V | VertexId, isWeight?: boolean): V[] | null {
        if (isWeight === undefined) isWeight = false;

        if (isWeight) {
            const allPaths = this.getAllPathsBetween(v1, v2);
            let min = Infinity;
            let minIndex = -1;
            let index = 0;
            for (const path of allPaths) {
                const pathSumWeight = this.getPathSumWeight(path);
                if (pathSumWeight < min) {
                    min = pathSumWeight;
                    minIndex = index;
                }
                index++;
            }
            return allPaths[minIndex] || null;
        } else {
            // BFS
            let minPath: V[] = [];
            const vertex1 = this.getVertex(v1);
            const vertex2 = this.getVertex(v2);
            if (!(vertex1 && vertex2)) {
                return [];
            }

            const dfs = (cur: V, dest: V, visiting: Map<V, boolean>, path: V[]) => {
                visiting.set(cur, true);

                if (cur === dest) {
                    minPath = [vertex1, ...path];
                    return;
                }

                const neighbors = this.getNeighbors(cur);
                for (const neighbor of neighbors) {
                    if (!visiting.get(neighbor)) {
                        path.push(neighbor);
                        dfs(neighbor, dest, visiting, path);
                        arrayRemove(path, (vertex: AbstractVertex) => vertex === neighbor);
                    }
                }

                visiting.set(cur, false);
            };

            dfs(vertex1, vertex2, new Map<V, boolean>(), []);
            return minPath;
        }
    }

    /**
     * Dijkstra algorithm time: O(VE) space: O(V + E)
     * @param src
     * @param dest
     * @param getMinDist
     * @param genPaths
     */
    dijkstraWithoutHeap(src: V | VertexId, dest?: V | VertexId | null, getMinDist?: boolean, genPaths?: boolean): DijkstraResult<V> {
        if (getMinDist === undefined) getMinDist = false;
        if (genPaths === undefined) genPaths = false;

        if (dest === undefined) dest = null;
        let minDist = Infinity;
        let minDest: V | null = null;
        let minPath: V[] = [];
        const paths: V[][] = [];

        const vertices = this._vertices;
        const distMap: Map<V, number> = new Map();
        const seen: Set<V> = new Set();
        const preMap: Map<V, V | null> = new Map(); // predecessor
        const srcVertex = this.getVertex(src);

        const destVertex = dest ? this.getVertex(dest) : null;

        if (!srcVertex) {
            return null;
        }

        for (const vertex of vertices) {
            const vertexOrId = vertex[1];
            if (vertexOrId instanceof AbstractVertex) distMap.set(vertexOrId, Infinity);
        }
        distMap.set(srcVertex, 0);
        preMap.set(srcVertex, null);

        const getMinOfNoSeen = () => {
            let min = Infinity;
            let minV: V | null = null;
            for (const [key, val] of distMap) {
                if (!seen.has(key)) {
                    if (val < min) {
                        min = val;
                        minV = key;
                    }
                }
            }
            return minV;
        };

        const getPaths = (minV: V | null) => {
            for (const vertex of vertices) {
                const vertexOrId = vertex[1];

                if (vertexOrId instanceof AbstractVertex) {
                    const path: V[] = [vertexOrId];
                    let parent = preMap.get(vertexOrId);
                    while (parent) {
                        path.push(parent);
                        parent = preMap.get(parent);
                    }
                    const reversed = path.reverse();
                    if (vertex[1] === minV) minPath = reversed;
                    paths.push(reversed);
                }
            }
        };

        for (let i = 1; i < vertices.size; i++) {
            const cur = getMinOfNoSeen();
            if (cur) {
                seen.add(cur);
                if (destVertex && destVertex === cur) {
                    if (getMinDist) {
                        minDist = distMap.get(destVertex) || Infinity;
                    }
                    if (genPaths) {
                        getPaths(destVertex);
                    }
                    return {distMap, preMap, seen, paths, minDist, minPath};
                }
                const neighbors = this.getNeighbors(cur);
                for (const neighbor of neighbors) {
                    if (!seen.has(neighbor)) {
                        const edge = this.getEdge(cur, neighbor);
                        if (edge) {
                            const curFromMap = distMap.get(cur);
                            const neighborFromMap = distMap.get(neighbor);
                            // TODO after no-non-null-assertion not ensure the logic
                            if (curFromMap !== undefined && neighborFromMap !== undefined) {
                                if (edge.weight + curFromMap < neighborFromMap) {
                                    distMap.set(neighbor, edge.weight + curFromMap);
                                    preMap.set(neighbor, cur);
                                }
                            }

                        }
                    }
                }
            }
        }

        getMinDist && distMap.forEach((d, v) => {
            if (v !== srcVertex) {
                if (d < minDist) {
                    minDist = d;
                    if (genPaths) minDest = v;
                }
            }
        });

        genPaths && getPaths(minDest);

        return {distMap, preMap, seen, paths, minDist, minPath};
    }


    /**
     * Dijkstra algorithm time: O(logVE) space: O(V + E)
     * @param src
     * @param dest
     * @param getMinDist
     * @param genPaths
     */
    dijkstra(src: V | VertexId, dest?: V | VertexId | null, getMinDist?: boolean, genPaths?: boolean): DijkstraResult<V> {
        if (getMinDist === undefined) getMinDist = false;
        if (genPaths === undefined) genPaths = false;

        if (dest === undefined) dest = null;
        let minDist = Infinity;
        let minDest: V | null = null;
        let minPath: V[] = [];
        const paths: V[][] = [];
        const vertices = this._vertices;
        const distMap: Map<V, number> = new Map();
        const seen: Set<V> = new Set();
        const preMap: Map<V, V | null> = new Map(); // predecessor

        const srcVertex = this.getVertex(src);
        const destVertex = dest ? this.getVertex(dest) : null;

        if (!srcVertex) {
            return null;
        }

        for (const vertex of vertices) {
            const vertexOrId = vertex[1];
            if (vertexOrId instanceof AbstractVertex) distMap.set(vertexOrId, Infinity);
        }

        const heap = new PriorityQueue<{ id: number, val: V }>({comparator: (a, b) => a.id - b.id});
        heap.offer({id: 0, val: srcVertex});

        distMap.set(srcVertex, 0);
        preMap.set(srcVertex, null);

        const getPaths = (minV: V | null) => {
            for (const vertex of vertices) {
                const vertexOrId = vertex[1];
                if (vertexOrId instanceof AbstractVertex) {
                    const path: V[] = [vertexOrId];
                    let parent = preMap.get(vertexOrId);
                    while (parent) {
                        path.push(parent);
                        parent = preMap.get(parent);
                    }
                    const reversed = path.reverse();
                    if (vertex[1] === minV) minPath = reversed;
                    paths.push(reversed);
                }

            }
        };

        while (heap.size > 0) {
            const curHeapNode = heap.poll();
            const dist = curHeapNode?.id;
            const cur = curHeapNode?.val;
            if (dist !== undefined) {
                if (cur) {
                    seen.add(cur);
                    if (destVertex && destVertex === cur) {
                        if (getMinDist) {
                            minDist = distMap.get(destVertex) || Infinity;
                        }
                        if (genPaths) {
                            getPaths(destVertex);
                        }
                        return {distMap, preMap, seen, paths, minDist, minPath};
                    }
                    const neighbors = this.getNeighbors(cur);
                    for (const neighbor of neighbors) {
                        if (!seen.has(neighbor)) {
                            const weight = this.getEdge(cur, neighbor)?.weight;
                            if (typeof weight === 'number') {
                                const distSrcToNeighbor = distMap.get(neighbor);
                                if (distSrcToNeighbor) {
                                    if (dist + weight < distSrcToNeighbor) {
                                        heap.offer({id: dist + weight, val: neighbor});
                                        preMap.set(neighbor, cur);
                                        distMap.set(neighbor, dist + weight);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        if (getMinDist) {
            distMap.forEach((d, v) => {
                if (v !== srcVertex) {
                    if (d < minDist) {
                        minDist = d;
                        if (genPaths) minDest = v;
                    }
                }
            });
        }


        if (genPaths) {
            getPaths(minDest);
        }


        return {distMap, preMap, seen, paths, minDist, minPath};
    }

    abstract getEndsOfEdge(edge: E): [V, V] | null;


    /**
     * BellmanFord time:O(VE) space:O(V)
     * one to rest pairs
     * @param src
     * @param scanNegativeCycle
     * @param getMin
     * @param genPath
     */
    bellmanFord(src: V | VertexId, scanNegativeCycle?: boolean, getMin?: boolean, genPath?: boolean) {
        if (getMin === undefined) getMin = false;
        if (genPath === undefined) genPath = false;

        const srcVertex = this.getVertex(src);
        const paths: V[][] = [];
        const distMap: Map<V, number> = new Map();
        const preMap: Map<V, V> = new Map(); // predecessor
        let min = Infinity;
        let minPath: V[] = [];
        // TODO
        let hasNegativeCycle: boolean | undefined;
        if (scanNegativeCycle) hasNegativeCycle = false;
        if (!srcVertex) return {hasNegativeCycle, distMap, preMap, paths, min, minPath};

        const vertices = this._vertices;
        const numOfVertices = vertices.size;
        const edges = this.edgeSet();
        const numOfEdges = edges.length;

        this._vertices.forEach(vertex => {
            distMap.set(vertex, Infinity);
        });

        distMap.set(srcVertex, 0);

        for (let i = 1; i < numOfVertices; ++i) {
            for (let j = 0; j < numOfEdges; ++j) {
                const ends = this.getEndsOfEdge(edges[j]);
                if (ends) {
                    const [s, d] = ends;
                    const weight = edges[j].weight;
                    const sWeight = distMap.get(s);
                    const dWeight = distMap.get(d);
                    if (sWeight !== undefined && dWeight !== undefined) {
                        if (distMap.get(s) !== Infinity && sWeight + weight < dWeight) {
                            distMap.set(d, sWeight + weight);
                            genPath && preMap.set(d, s);
                        }
                    }
                }
            }
        }

        let minDest: V | null = null;
        if (getMin) {
            distMap.forEach((d, v) => {
                if (v !== srcVertex) {
                    if (d < min) {
                        min = d;
                        if (genPath) minDest = v;
                    }
                }
            });
        }

        if (genPath) {
            for (const vertex of vertices) {
                const vertexOrId = vertex[1];
                if (vertexOrId instanceof AbstractVertex) {
                    const path: V[] = [vertexOrId];
                    let parent = preMap.get(vertexOrId);
                    while (parent !== undefined) {
                        path.push(parent);
                        parent = preMap.get(parent);
                    }
                    const reversed = path.reverse();
                    if (vertex[1] === minDest) minPath = reversed;
                    paths.push(reversed);
                }
            }
        }

        for (let j = 0; j < numOfEdges; ++j) {
            const ends = this.getEndsOfEdge(edges[j]);
            if (ends) {
                const [s] = ends;
                const weight = edges[j].weight;
                const sWeight = distMap.get(s);
                if (sWeight) {
                    if (sWeight !== Infinity && sWeight + weight < sWeight) hasNegativeCycle = true;
                }
            }
        }

        return {hasNegativeCycle, distMap, preMap, paths, min, minPath};
    }

    /**
     * Floyd algorithm time: O(V^3) space: O(V^2), not support graph with negative weight cycle
     * all pairs
     */
    floyd(): { costs: number[][], predecessor: (V | null)[][] } {
        const idAndVertices = [...this._vertices];
        const n = idAndVertices.length;

        const costs: number[][] = [];
        const predecessor: (V | null)[][] = [];
        // successors

        for (let i = 0; i < n; i++) {
            costs[i] = [];
            predecessor[i] = [];
            for (let j = 0; j < n; j++) {
                predecessor[i][j] = null;
            }
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                costs[i][j] = this.getEdge(idAndVertices[i][1], idAndVertices[j][1])?.weight || Infinity;
            }
        }

        for (let k = 0; k < n; k++) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (costs[i][j] > costs[i][k] + costs[k][j]) {
                        costs[i][j] = costs[i][k] + costs[k][j];
                        predecessor[i][j] = idAndVertices[k][1];
                    }
                }
            }
        }
        return {costs, predecessor};

    }


    /**--- start find cycles --- */

    /**
     * Tarjan is an algorithm based on DFS,which is used to solve the connectivity problem of graphs.
     * Tarjan can find cycles in directed or undirected graph
     * Tarjan can find the articulation points and bridges(critical edges) of undirected graphs in linear time,
     * Tarjan solve the bi-connected components of undirected graphs;
     * Tarjan can find the SSC(strongly connected components), articulation points, and bridges of directed graphs.
     */
    tarjan(needArticulationPoints?: boolean, needBridges?: boolean, needSCCs?: boolean, needCycles?: boolean) {
        // !! in undirected graph we will not let child visit parent when DFS
        // !! articulation point(in DFS search tree not in graph): (cur !== root && cur.has(child)) && (low(child) >= dfn(cur)) || (cur === root && cur.children() >= 2)
        // !! bridge: low(child) > dfn(cur)

        const defaultConfig = false;
        if (needArticulationPoints === undefined) needArticulationPoints = defaultConfig;
        if (needBridges === undefined) needBridges = defaultConfig;
        if (needSCCs === undefined) needSCCs = defaultConfig;
        if (needCycles === undefined) needCycles = defaultConfig;

        const dfnMap: Map<V, number> = new Map();
        const lowMap: Map<V, number> = new Map();
        const vertices = this._vertices;
        vertices.forEach(v => {
            dfnMap.set(v, -1);
            lowMap.set(v, Infinity);
        });

        const [root] = vertices.values();

        const articulationPoints: V[] = [];
        const bridges: E[] = [];
        let dfn = 0;
        const dfs = (cur: V, parent: V | null) => {
            dfn++;
            dfnMap.set(cur, dfn);
            lowMap.set(cur, dfn);

            const neighbors = this.getNeighbors(cur);
            let childCount = 0; // child in DFS tree not child in graph
            for (const neighbor of neighbors) {
                if (neighbor !== parent) {
                    if (dfnMap.get(neighbor) === -1) {
                        childCount++;
                        dfs(neighbor, cur);
                    }
                    const childLow = lowMap.get(neighbor);
                    const curLow = lowMap.get(cur);
                    // TODO after no-non-null-assertion not ensure the logic
                    if (curLow !== undefined && childLow !== undefined) {
                        lowMap.set(cur, Math.min(curLow, childLow));
                    }
                    const curFromMap = dfnMap.get(cur);
                    if (childLow !== undefined && curFromMap !== undefined) {
                        if (needArticulationPoints) {
                            if ((cur === root && childCount >= 2) || ((cur !== root) && (childLow >= curFromMap))) {
                                // todo not ensure the logic if (cur === root && childCount >= 2 || ((cur !== root) && (childLow >= curFromMap))) {
                                articulationPoints.push(cur);
                            }
                        }

                        if (needBridges) {
                            if (childLow > curFromMap) {
                                const edgeCurToNeighbor = this.getEdge(cur, neighbor);
                                if (edgeCurToNeighbor) {
                                    bridges.push(edgeCurToNeighbor);
                                }
                            }
                        }
                    }
                }
            }

        };

        dfs(root, null);

        let SCCs: Map<number, V[]> = new Map();

        const getSCCs = () => {
            const SCCs: Map<number, V[]> = new Map();
            lowMap.forEach((low, vertex) => {
                if (!SCCs.has(low)) {
                    SCCs.set(low, [vertex]);
                } else {
                    SCCs.get(low)?.push(vertex);
                }
            });
            return SCCs;
        };

        if (needSCCs) {
            SCCs = getSCCs();
        }

        const cycles: Map<number, V[]> = new Map();
        if (needCycles) {
            let SCCs: Map<number, V[]> = new Map();
            if (SCCs.size < 1) {
                SCCs = getSCCs();
            }

            SCCs.forEach((SCC, low) => {
                if (SCC.length > 1) {
                    cycles.set(low, SCC);
                }
            });
        }

        return {dfnMap, lowMap, bridges, articulationPoints, SCCs, cycles};
    }


    // unionFind() {
    // }

    /**--- end find cycles --- */


    // Minimum Spanning Tree
}
