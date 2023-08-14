/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import {arrayRemove, uuidV4} from '../../utils';
import {PriorityQueue} from '../priority-queue';
import type {DijkstraResult, IGraph, VertexId} from '../types';

export class AbstractVertex {
    constructor(id: VertexId) {
        this._id = id;
    }

    protected _id: VertexId;

    public get id(): VertexId {
        return this._id;
    }

    public set id(v: VertexId) {
        this._id = v;
    }
}

export abstract class AbstractEdge {

    static DEFAULT_EDGE_WEIGHT = 1;

    /**
     * The function is a protected constructor that initializes the weight and generates a unique hash code for an edge.
     * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the edge. If
     * no weight is provided, it will default to the value of `AbstractEdge.DEFAULT_EDGE_WEIGHT`.
     */
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

    /**
     * The function `getVertex` returns the vertex object associated with a given vertex ID or vertex object, or null if it
     * does not exist.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`.
     * @returns The function `getVertex` returns the vertex object (`V`) corresponding to the given `vertexOrId` parameter.
     * If the vertex is found in the `_vertices` map, it is returned. Otherwise, `null` is returned.
     */
    getVertex(vertexOrId: VertexId | V): V | null {
        const vertexId = this.getVertexId(vertexOrId);
        return this._vertices.get(vertexId) || null;
    }

    /**
     * The function `getVertexId` returns the id of a vertex, whether it is passed as an instance of `AbstractVertex` or as
     * a `VertexId`.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can be either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns the id of the vertex.
     */
    getVertexId(vertexOrId: V | VertexId): VertexId {
        return vertexOrId instanceof AbstractVertex ? vertexOrId.id : vertexOrId;
    }

    /**
     * The function checks if a vertex exists in a graph.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can accept either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns The method `containsVertex` returns a boolean value.
     */
    containsVertex(vertexOrId: V | VertexId): boolean {
        return this._vertices.has(this.getVertexId(vertexOrId));
    }

    /**
     * The function `vertexSet()` returns a map of vertices.
     * @returns The method `vertexSet()` returns a map of vertex IDs to vertex objects.
     */
    vertexSet(): Map<VertexId, V> {
        return this._vertices;
    }

    abstract getEdge(srcOrId: V | null | VertexId, destOrId: V | null | VertexId): E | null;

    /**
     * The addVertex function adds a new vertex to a graph if it does not already exist.
     * @param {V} newVertex - The parameter "newVertex" is of type V, which represents a vertex in a graph.
     * @returns The method is returning a boolean value. If the newVertex is already contained in the graph, it will return
     * false. Otherwise, it will add the newVertex to the graph and return true.
     */
    addVertex(newVertex: V): boolean {
        if (this.containsVertex(newVertex)) {
            return false;
        }
        this._vertices.set(newVertex.id, newVertex);
        return true;
    }

    /**
     * The `removeVertex` function removes a vertex from a graph by its ID or by the vertex object itself.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can be either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns The method `removeVertex` returns a boolean value.
     */
    removeVertex(vertexOrId: V | VertexId): boolean {
        const vertexId = this.getVertexId(vertexOrId);
        return this._vertices.delete(vertexId);
    }

    /**
     * The function removes all vertices from a graph and returns a boolean indicating if any vertices were removed.
     * @param {V[] | VertexId[]} vertices - The `vertices` parameter can be either an array of vertices (`V[]`) or an array
     * of vertex IDs (`VertexId[]`).
     * @returns a boolean value. It returns true if at least one vertex was successfully removed, and false if no vertices
     * were removed.
     */
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

    /**
     * The function checks if there is an edge between two vertices in a graph.
     * @param {VertexId | V} v1 - The parameter v1 can be either a VertexId or a V. A VertexId represents the identifier of
     * a vertex in a graph, while V represents the type of the vertex itself.
     * @param {VertexId | V} v2 - The parameter `v2` represents the second vertex in an edge. It can be either a `VertexId`
     * or a `V` type.
     * @returns The function `containsEdge` returns a boolean value. It returns `true` if there is an edge between the
     * vertices `v1` and `v2`, and `false` otherwise.
     */
    containsEdge(v1: VertexId | V, v2: VertexId | V): boolean {
        const edge = this.getEdge(v1, v2);
        return !!edge;
    }

    abstract addEdge(edge: E): boolean;

    /**
     * The function sets the weight of an edge between two vertices in a graph.
     * @param {VertexId | V} srcOrId - The `srcOrId` parameter can be either a `VertexId` or a `V` object. It represents
     * the source vertex of the edge.
     * @param {VertexId | V} destOrId - The `destOrId` parameter represents the destination vertex of the edge. It can be
     * either a `VertexId` or a vertex object `V`.
     * @param {number} weight - The weight parameter represents the weight of the edge between the source vertex (srcOrId)
     * and the destination vertex (destOrId).
     * @returns a boolean value. If the edge exists between the source and destination vertices, the function will update
     * the weight of the edge and return true. If the edge does not exist, the function will return false.
     */
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

    /**
     * The function `getAllPathsBetween` finds all paths between two vertices in a graph using depth-first search.
     * @param {V | VertexId} v1 - The parameter `v1` represents either a vertex object (`V`) or a vertex ID (`VertexId`).
     * It is the starting vertex for finding paths.
     * @param {V | VertexId} v2 - The parameter `v2` represents the destination vertex or its ID. It is the vertex that we
     * want to find paths to from the starting vertex `v1`.
     * @returns an array of arrays of vertices (V[][]). Each inner array represents a path between the given vertices (v1
     * and v2).
     */
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

    /**
     * The function calculates the sum of weights along a given path.
     * @param {V[]} path - An array of vertices (V) representing a path in a graph.
     * @returns The function `getPathSumWeight` returns the sum of the weights of the edges in the given path.
     */
    getPathSumWeight(path: V[]): number {
        let sum = 0;
        for (let i = 0; i < path.length; i++) {
            sum += this.getEdge(path[i], path[i + 1])?.weight || 0;
        }
        return sum;
    }

    /**
     * The function `getMinCostBetween` calculates the minimum cost between two vertices in a graph, either based on edge
     * weights or using a breadth-first search algorithm.
     * @param {V | VertexId} v1 - The parameter `v1` represents the starting vertex or vertex ID of the graph.
     * @param {V | VertexId} v2 - The parameter `v2` represents the second vertex in the graph. It can be either a vertex
     * object or a vertex ID.
     * @param {boolean} [isWeight] - isWeight is an optional parameter that indicates whether the graph edges have weights.
     * If isWeight is set to true, the function will calculate the minimum cost between v1 and v2 based on the weights of
     * the edges. If isWeight is set to false or not provided, the function will calculate the
     * @returns The function `getMinCostBetween` returns a number representing the minimum cost between two vertices (`v1`
     * and `v2`) in a graph. If the `isWeight` parameter is `true`, it calculates the minimum weight between the vertices.
     * If `isWeight` is `false` or not provided, it calculates the minimum number of edges between the vertices. If the
     * vertices are not
     */
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

    /**
     * The function `getMinPathBetween` returns the minimum path between two vertices in a graph, either based on weight or
     * using a breadth-first search algorithm.
     * @param {V | VertexId} v1 - The parameter `v1` represents the starting vertex or its ID.
     * @param {V | VertexId} v2 - The parameter `v2` represents the destination vertex or its ID. It is the vertex that we
     * want to find the minimum path to from the source vertex `v1`.
     * @param {boolean} [isWeight] - A boolean flag indicating whether to consider the weight of edges in finding the
     * minimum path. If set to true, the function will use Dijkstra's algorithm to find the minimum weighted path. If set
     * to false, the function will use breadth-first search (BFS) to find the minimum path. If
     * @returns The function `getMinPathBetween` returns an array of vertices (`V[]`) representing the minimum path between
     * two vertices (`v1` and `v2`). If no path is found, it returns `null`.
     */
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
     * The function `dijkstraWithoutHeap` implements Dijkstra's algorithm to find the shortest path between two vertices in
     * a graph without using a heap data structure.
     * @param {V | VertexId} src - The source vertex from which to start the Dijkstra's algorithm. It can be either a
     * vertex object or a vertex ID.
     * @param {V | VertexId | null} [dest] - The `dest` parameter in the `dijkstraWithoutHeap` function is an optional
     * parameter that specifies the destination vertex for the Dijkstra algorithm. It can be either a vertex object or its
     * identifier. If no destination is provided, the value is set to `null`.
     * @param {boolean} [getMinDist] - The `getMinDist` parameter is a boolean flag that determines whether the minimum
     * distance from the source vertex to the destination vertex should be calculated and returned in the result. If
     * `getMinDist` is set to `true`, the `minDist` property in the result will contain the minimum distance
     * @param {boolean} [genPaths] - The `genPaths` parameter is a boolean flag that determines whether or not to generate
     * paths in the Dijkstra algorithm. If `genPaths` is set to `true`, the algorithm will calculate and return the
     * shortest paths from the source vertex to all other vertices in the graph. If `genPaths
     * @returns The function `dijkstraWithoutHeap` returns an object of type `DijkstraResult<V>`.
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
     * The `dijkstra` function implements Dijkstra's algorithm to find the shortest path between a source vertex and an
     * optional destination vertex, and optionally returns the minimum distance, the paths, and other information.
     * @param {V | VertexId} src - The `src` parameter represents the source vertex from which the Dijkstra algorithm will
     * start. It can be either a vertex object or a vertex ID.
     * @param {V | VertexId | null} [dest] - The `dest` parameter is the destination vertex or vertex ID. It specifies the
     * vertex to which the shortest path is calculated from the source vertex. If no destination is provided, the algorithm
     * will calculate the shortest paths to all other vertices from the source vertex.
     * @param {boolean} [getMinDist] - The `getMinDist` parameter is a boolean flag that determines whether the minimum
     * distance from the source vertex to the destination vertex should be calculated and returned in the result. If
     * `getMinDist` is set to `true`, the `minDist` property in the result will contain the minimum distance
     * @param {boolean} [genPaths] - The `genPaths` parameter is a boolean flag that determines whether or not to generate
     * paths in the Dijkstra algorithm. If `genPaths` is set to `true`, the algorithm will calculate and return the
     * shortest paths from the source vertex to all other vertices in the graph. If `genPaths
     * @returns The function `dijkstra` returns an object of type `DijkstraResult<V>`.
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
        heap.add({id: 0, val: srcVertex});

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
                                        heap.add({id: dist + weight, val: neighbor});
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
     * The `bellmanFord` function implements the Bellman-Ford algorithm to find the shortest path from a source vertex to
     * all other vertices in a graph, and optionally detects negative cycles and generates the minimum path.
     * @param {V | VertexId} src - The `src` parameter is the source vertex from which the Bellman-Ford algorithm will
     * start calculating the shortest paths. It can be either a vertex object or a vertex ID.
     * @param {boolean} [scanNegativeCycle] - A boolean flag indicating whether to scan for negative cycles in the graph.
     * @param {boolean} [getMin] - The `getMin` parameter is a boolean flag that determines whether the algorithm should
     * calculate the minimum distance from the source vertex to all other vertices in the graph. If `getMin` is set to
     * `true`, the algorithm will find the minimum distance and update the `min` variable with the minimum
     * @param {boolean} [genPath] - A boolean flag indicating whether to generate paths for all vertices from the source
     * vertex.
     * @returns The function `bellmanFord` returns an object with the following properties:
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
     * The function implements the Floyd-Warshall algorithm to find the shortest path between all pairs of vertices in a
     * graph.
     * @returns The function `floyd()` returns an object with two properties: `costs` and `predecessor`. The `costs`
     * property is a 2D array of numbers representing the shortest path costs between vertices in a graph. The
     * `predecessor` property is a 2D array of vertices (or `null`) representing the predecessor vertices in the shortest
     * path between vertices in the
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
     * The `tarjan` function is used to perform various graph analysis tasks such as finding articulation points, bridges,
     * strongly connected components (SCCs), and cycles in a graph.
     * @param {boolean} [needArticulationPoints] - A boolean value indicating whether or not to calculate and return the
     * articulation points in the graph. Articulation points are the vertices in a graph whose removal would increase the
     * number of connected components in the graph.
     * @param {boolean} [needBridges] - A boolean flag indicating whether the algorithm should find and return the bridges
     * (edges whose removal would increase the number of connected components in the graph).
     * @param {boolean} [needSCCs] - A boolean value indicating whether the Strongly Connected Components (SCCs) of the
     * graph are needed. If set to true, the function will calculate and return the SCCs of the graph. If set to false, the
     * SCCs will not be calculated or returned.
     * @param {boolean} [needCycles] - A boolean flag indicating whether the algorithm should find cycles in the graph. If
     * set to true, the algorithm will return a map of cycles, where the keys are the low values of the SCCs and the values
     * are arrays of vertices that form cycles within the SCCs.
     * @returns The function `tarjan` returns an object with the following properties:
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
