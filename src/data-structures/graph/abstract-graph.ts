/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { DijkstraResult, EntryCallback, VertexKey } from '../../types';
import { uuidV4 } from '../../utils';
import { IterableEntryBase } from '../base';
import { IGraph } from '../../interfaces';
import { Heap } from '../heap';
import { Queue } from '../queue';

export abstract class AbstractVertex<V = any> {
  key: VertexKey;
  value: V | undefined;

  /**
   * The function is a protected constructor that takes an key and an optional value as parameters.
   * @param {VertexKey} key - The `key` parameter is of type `VertexKey` and represents the identifier of the vertex. It is
   * used to uniquely identify the vertex object.
   * @param {V} [value] - The parameter "value" is an optional parameter of type V. It is used to assign a value to the
   * vertex. If no value is provided, it will be set to undefined.
   */
  protected constructor(key: VertexKey, value?: V) {
    this.key = key;
    this.value = value;
  }
}

export abstract class AbstractEdge<E = any> {
  value: E | undefined;
  weight: number;

  /**
   * The above function is a protected constructor that initializes the weight, value, and hash code properties of an
   * object.
   * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the object. If
   * a value is provided, it will be assigned to the `_weight` property. If no value is provided, the default value of 1
   * will be assigned.
   * @param {VO} [value] - The `value` parameter is of type `VO`, which means it can be any type. It is an optional parameter,
   * meaning it can be omitted when creating an instance of the class.
   */
  protected constructor(weight?: number, value?: E) {
    this.weight = weight !== undefined ? weight : 1;
    this.value = value;
    this._hashCode = uuidV4();
  }

  protected _hashCode: string;

  get hashCode(): string {
    return this._hashCode;
  }

  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   */
}

export abstract class AbstractGraph<
  V = any,
  E = any,
  VO extends AbstractVertex<V> = AbstractVertex<V>,
  EO extends AbstractEdge<E> = AbstractEdge<E>
>
  extends IterableEntryBase<VertexKey, V | undefined>
  implements IGraph<V, E, VO, EO> {
  constructor() {
    super();
  }

  protected _vertexMap: Map<VertexKey, VO> = new Map<VertexKey, VO>();

  get vertexMap(): Map<VertexKey, VO> {
    return this._vertexMap;
  }

  set vertexMap(v: Map<VertexKey, VO>) {
    this._vertexMap = v;
  }

  get size(): number {
    return this._vertexMap.size;
  }

  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   * @param key
   * @param value
   */
  abstract createVertex(key: VertexKey, value?: V): VO;

  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   * @param srcOrV1
   * @param destOrV2
   * @param weight
   * @param value
   */
  abstract createEdge(srcOrV1: VertexKey, destOrV2: VertexKey, weight?: number, value?: E): EO;

  abstract deleteEdge(edge: EO): EO | undefined;

  abstract getEdge(srcOrKey: VO | VertexKey, destOrKey: VO | VertexKey): EO | undefined;

  abstract degreeOf(vertexOrKey: VO | VertexKey): number;

  abstract edgeSet(): EO[];

  abstract edgesOf(vertexOrKey: VO | VertexKey): EO[];

  abstract getNeighbors(vertexOrKey: VO | VertexKey): VO[];

  abstract getEndsOfEdge(edge: EO): [VO, VO] | undefined;

  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function "getVertex" returns the vertex with the specified ID or undefined if it doesn't exist.
   * @param {VertexKey} vertexKey - The `vertexKey` parameter is the identifier of the vertex that you want to retrieve from
   * the `_vertexMap` map.
   * @returns The method `getVertex` returns the vertex with the specified `vertexKey` if it exists in the `_vertexMap`
   * map. If the vertex does not exist, it returns `undefined`.
   */
  getVertex(vertexKey: VertexKey): VO | undefined {
    return this._vertexMap.get(vertexKey) || undefined;
  }

  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function checks if a vertex exists in a graph.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns a boolean value.
   */
  hasVertex(vertexOrKey: VO | VertexKey): boolean {
    return this._vertexMap.has(this._getVertexKey(vertexOrKey));
  }

  addVertex(vertex: VO): boolean;

  addVertex(key: VertexKey, value?: V): boolean;

  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  addVertex(keyOrVertex: VertexKey | VO, value?: V): boolean {
    if (keyOrVertex instanceof AbstractVertex) {
      return this._addVertex(keyOrVertex);
    } else {
      const newVertex = this.createVertex(keyOrVertex, value);
      return this._addVertex(newVertex);
    }
  }

  isVertexKey(potentialKey: any): potentialKey is VertexKey {
    const potentialKeyType = typeof potentialKey;
    return potentialKeyType === 'string' || potentialKeyType === 'number';
  }

  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  abstract deleteVertex(vertexOrKey: VO | VertexKey): boolean;

  /**
   * Time Complexity: O(K), where K is the number of vertexMap to be removed.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  /**
   * Time Complexity: O(K), where K is the number of vertexMap to be removed.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function removes all vertexMap from a graph and returns a boolean indicating if any vertexMap were removed.
   * @param {VO[] | VertexKey[]} vertexMap - The `vertexMap` parameter can be either an array of vertexMap (`VO[]`) or an array
   * of vertex IDs (`VertexKey[]`).
   * @returns a boolean value. It returns true if at least one vertex was successfully removed, and false if no vertexMap
   * were removed.
   */
  removeManyVertices(vertexMap: VO[] | VertexKey[]): boolean {
    const removed: boolean[] = [];
    for (const v of vertexMap) {
      removed.push(this.deleteVertex(v));
    }
    return removed.length > 0;
  }

  /**
   * Time Complexity: O(1) - Depends on the implementation in the concrete class.
   * Space Complexity: O(1) - Depends on the implementation in the concrete class.
   */

  /**
   * Time Complexity: O(1) - Depends on the implementation in the concrete class.
   * Space Complexity: O(1) - Depends on the implementation in the concrete class.
   *
   * The function checks if there is an edge between two vertexMap and returns a boolean value indicating the result.
   * @param {VertexKey | VO} v1 - The parameter v1 can be either a VertexKey or a VO. A VertexKey represents the unique
   * identifier of a vertex in a graph, while VO represents the type of the vertex object itself.
   * @param {VertexKey | VO} v2 - The parameter `v2` represents the second vertex in the edge. It can be either a
   * `VertexKey` or a `VO` type, which represents the type of the vertex.
   * @returns A boolean value is being returned.
   */
  hasEdge(v1: VertexKey | VO, v2: VertexKey | VO): boolean {
    const edge = this.getEdge(v1, v2);
    return !!edge;
  }

  addEdge(edge: EO): boolean;

  addEdge(src: VO | VertexKey, dest: VO | VertexKey, weight?: number, value?: E): boolean;

  /**
   * Time Complexity: O(1) - Depends on the implementation in the concrete class.
   * Space Complexity: O(1) - Depends on the implementation in the concrete class.
   */

  addEdge(srcOrEdge: VO | VertexKey | EO, dest?: VO | VertexKey, weight?: number, value?: E): boolean {
    if (srcOrEdge instanceof AbstractEdge) {
      return this._addEdge(srcOrEdge);
    } else {
      if (dest instanceof AbstractVertex || typeof dest === 'string' || typeof dest === 'number') {
        if (!(this.hasVertex(srcOrEdge) && this.hasVertex(dest))) return false;
        if (srcOrEdge instanceof AbstractVertex) srcOrEdge = srcOrEdge.key;
        if (dest instanceof AbstractVertex) dest = dest.key;
        const newEdge = this.createEdge(srcOrEdge, dest, weight, value);
        return this._addEdge(newEdge);
      } else {
        throw new Error('dest must be a Vertex or vertex key while srcOrEdge is an Edge');
      }
    }
  }

  /**
   * Time Complexity: O(1) - Constant time for Map and Edge operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  /**
   * Time Complexity: O(1) - Constant time for Map and Edge operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function sets the weight of an edge between two vertexMap in a graph.
   * @param {VertexKey | VO} srcOrKey - The `srcOrKey` parameter can be either a `VertexKey` or a `VO` object. It represents
   * the source vertex of the edge.
   * @param {VertexKey | VO} destOrKey - The `destOrKey` parameter represents the destination vertex of the edge. It can be
   * either a `VertexKey` or a vertex object `VO`.
   * @param {number} weight - The weight parameter represents the weight of the edge between the source vertex (srcOrKey)
   * and the destination vertex (destOrKey).
   * @returns a boolean value. If the edge exists between the source and destination vertexMap, the function will update
   * the weight of the edge and return true. If the edge does not exist, the function will return false.
   */
  setEdgeWeight(srcOrKey: VertexKey | VO, destOrKey: VertexKey | VO, weight: number): boolean {
    const edge = this.getEdge(srcOrKey, destOrKey);
    if (edge) {
      edge.weight = weight;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Time Complexity: O(P), where P is the number of paths found (in the worst case, exploring all paths).
   * Space Complexity: O(P) - Linear space, where P is the number of paths found.
   */

  /**
   * Time Complexity: O(P), where P is the number of paths found (in the worst case, exploring all paths).
   * Space Complexity: O(P) - Linear space, where P is the number of paths found.
   *
   * The function `getAllPathsBetween` finds all paths between two vertexMap in a graph using depth-first search.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents either a vertex object (`VO`) or a vertex ID (`VertexKey`).
   * It is the starting vertex for finding paths.
   * @param {VO | VertexKey} v2 - The parameter `v2` represents either a vertex object (`VO`) or a vertex ID (`VertexKey`).
   * @param limit - The count of limitation of result array.
   * @returns The function `getAllPathsBetween` returns an array of arrays of vertexMap (`VO[][]`).
   */
  getAllPathsBetween(v1: VO | VertexKey, v2: VO | VertexKey, limit = 1000): VO[][] {
    const paths: VO[][] = [];
    const vertex1 = this._getVertex(v1);
    const vertex2 = this._getVertex(v2);

    if (!(vertex1 && vertex2)) {
      return [];
    }

    const stack: { vertex: VO; path: VO[] }[] = [];
    stack.push({ vertex: vertex1, path: [vertex1] });

    while (stack.length > 0) {
      const { vertex, path } = stack.pop()!;

      if (vertex === vertex2) {
        paths.push(path);
        if (paths.length >= limit) return paths;
      }

      const neighbors = this.getNeighbors(vertex);
      for (const neighbor of neighbors) {
        if (!path.includes(neighbor)) {
          const newPath = [...path, neighbor];
          stack.push({ vertex: neighbor, path: newPath });
        }
      }
    }
    return paths;
  }

  /**
   * Time Complexity: O(L), where L is the length of the path.
   * Space Complexity: O(1) - Constant space.
   */

  /**
   * Time Complexity: O(L), where L is the length of the path.
   * Space Complexity: O(1) - Constant space.
   *
   * The function calculates the sum of weights along a given path.
   * @param {VO[]} path - An array of vertexMap (VO) representing a path in a graph.
   * @returns The function `getPathSumWeight` returns the sum of the weights of the edgeMap in the given path.
   */
  getPathSumWeight(path: VO[]): number {
    let sum = 0;
    for (let i = 0; i < path.length; i++) {
      sum += this.getEdge(path[i], path[i + 1])?.weight || 0;
    }
    return sum;
  }

  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   */

  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   *
   * The function `getMinCostBetween` calculates the minimum cost between two vertexMap in a graph, either based on edge
   * weights or using a breadth-first search algorithm.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents the starting vertex or its ID.
   * @param {VO | VertexKey} v2 - The parameter `v2` represents the destination vertex or its ID. It is the vertex to which
   * you want to find the minimum cost or weight from the source vertex `v1`.
   * @param {boolean} [isWeight] - isWeight is an optional parameter that indicates whether the graph edgeMap have weights.
   * If isWeight is set to true, the function will calculate the minimum cost between v1 and v2 based on the weights of
   * the edgeMap. If isWeight is set to false or not provided, the function will calculate the
   * @returns The function `getMinCostBetween` returns a number representing the minimum cost between two vertexMap (`v1`
   * and `v2`). If the `isWeight` parameter is `true`, it calculates the minimum weight among all paths between the
   * vertexMap. If `isWeight` is `false` or not provided, it uses a breadth-first search (BFS) algorithm to calculate the
   * minimum number of
   */
  getMinCostBetween(v1: VO | VertexKey, v2: VO | VertexKey, isWeight?: boolean): number | undefined {
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
      const vertex2 = this._getVertex(v2);
      const vertex1 = this._getVertex(v1);
      if (!(vertex1 && vertex2)) {
        return undefined;
      }

      const visited: Map<VO, boolean> = new Map();
      const queue = new Queue<VO>([vertex1]);
      visited.set(vertex1, true);
      let cost = 0;
      while (queue.size > 0) {
        for (let i = 0; i < queue.size; i++) {
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
      return undefined;
    }
  }

  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   */

  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   *
   * The function `getMinPathBetween` returns the minimum path between two vertexMap in a graph, either based on weight or
   * using a breadth-first search algorithm.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents the starting vertex of the path. It can be either a vertex
   * object (`VO`) or a vertex ID (`VertexKey`).
   * @param {VO | VertexKey} v2 - VO | VertexKey - The second vertex or vertex ID between which we want to find the minimum
   * path.
   * @param {boolean} [isWeight] - A boolean flag indicating whether to consider the weight of edgeMap in finding the
   * minimum path. If set to true, the function will use Dijkstra's algorithm to find the minimum weighted path. If set
   * to false, the function will use breadth-first search (BFS) to find the minimum path.
   * @param isDFS - If set to true, it enforces the use of getAllPathsBetween to first obtain all possible paths,
   * followed by iterative computation of the shortest path. This approach may result in exponential time complexity,
   * so the default method is to use the Dijkstra algorithm to obtain the shortest weighted path.
   * @returns The function `getMinPathBetween` returns an array of vertexMap (`VO[]`) representing the minimum path between
   * two vertexMap (`v1` and `v2`). If there is no path between the vertexMap, it returns `undefined`.
   */
  getMinPathBetween(v1: VO | VertexKey, v2: VO | VertexKey, isWeight?: boolean, isDFS = false): VO[] | undefined {
    if (isWeight === undefined) isWeight = false;

    if (isWeight) {
      if (isDFS) {
        const allPaths = this.getAllPathsBetween(v1, v2, 10000);
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
        return allPaths[minIndex] || undefined;
      } else {
        return this.dijkstra(v1, v2, true, true)?.minPath ?? [];
      }
    } else {
      // DFS
      let minPath: VO[] = [];
      const vertex1 = this._getVertex(v1);
      const vertex2 = this._getVertex(v2);
      if (!(vertex1 && vertex2)) return [];

      const dfs = (cur: VO, dest: VO, visiting: Set<VO>, path: VO[]) => {
        visiting.add(cur);
        if (cur === dest) {
          minPath = [vertex1, ...path];
          return;
        }

        const neighbors = this.getNeighbors(cur);
        for (const neighbor of neighbors) {
          if (!visiting.has(neighbor)) {
            path.push(neighbor);
            dfs(neighbor, dest, visiting, path);
            path.pop();
          }
        }

        visiting.delete(cur);
      };

      dfs(vertex1, vertex2, new Set<VO>(), []);
      return minPath;
    }
  }

  /**
   *  Dijkstra algorithm time: O(VE) space: O(VO + EO)
   */

  /**
   * Time Complexity: O(V^2 + E) - Quadratic time in the worst case (no heap optimization).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   */

  /**
   * Time Complexity: O(V^2 + E) - Quadratic time in the worst case (no heap optimization).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   *
   * The function `dijkstraWithoutHeap` implements Dijkstra's algorithm to find the shortest path between two vertexMap in
   * a graph without using a heap data structure.
   * @param {VO | VertexKey} src - The source vertex from which to start the Dijkstra's algorithm. It can be either a
   * vertex object or a vertex ID.
   * @param {VO | VertexKey | undefined} [dest] - The `dest` parameter in the `dijkstraWithoutHeap` function is an optional
   * parameter that specifies the destination vertex for the Dijkstra algorithm. It can be either a vertex object or its
   * identifier. If no destination is provided, the value is set to `undefined`.
   * @param {boolean} [getMinDist] - The `getMinDist` parameter is a boolean flag that determines whether the minimum
   * distance from the source vertex to the destination vertex should be calculated and returned in the result. If
   * `getMinDist` is set to `true`, the `minDist` property in the result will contain the minimum distance
   * @param {boolean} [genPaths] - The `genPaths` parameter is a boolean flag that determines whether or not to generate
   * paths in the Dijkstra algorithm. If `genPaths` is set to `true`, the algorithm will calculate and return the
   * shortest paths from the source vertex to all other vertexMap in the graph. If `genPaths
   * @returns The function `dijkstraWithoutHeap` returns an object of type `DijkstraResult<VO>`.
   */
  dijkstraWithoutHeap(
    src: VO | VertexKey,
    dest: VO | VertexKey | undefined = undefined,
    getMinDist: boolean = false,
    genPaths: boolean = false
  ): DijkstraResult<VO> {
    let minDist = Infinity;
    let minDest: VO | undefined = undefined;
    let minPath: VO[] = [];
    const paths: VO[][] = [];

    const vertexMap = this._vertexMap;
    const distMap: Map<VO, number> = new Map();
    const seen: Set<VO> = new Set();
    const preMap: Map<VO, VO | undefined> = new Map(); // predecessor
    const srcVertex = this._getVertex(src);

    const destVertex = dest ? this._getVertex(dest) : undefined;

    if (!srcVertex) {
      return undefined;
    }

    for (const vertex of vertexMap) {
      const vertexOrKey = vertex[1];
      if (vertexOrKey instanceof AbstractVertex) distMap.set(vertexOrKey, Infinity);
    }
    distMap.set(srcVertex, 0);
    preMap.set(srcVertex, undefined);

    const getMinOfNoSeen = () => {
      let min = Infinity;
      let minV: VO | undefined = undefined;
      for (const [key, value] of distMap) {
        if (!seen.has(key)) {
          if (value < min) {
            min = value;
            minV = key;
          }
        }
      }
      return minV;
    };

    const getPaths = (minV: VO | undefined) => {
      for (const vertex of vertexMap) {
        const vertexOrKey = vertex[1];

        if (vertexOrKey instanceof AbstractVertex) {
          const path: VO[] = [vertexOrKey];
          let parent = preMap.get(vertexOrKey);
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

    for (let i = 1; i < vertexMap.size; i++) {
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
          return { distMap, preMap, seen, paths, minDist, minPath };
        }
        const neighbors = this.getNeighbors(cur);
        for (const neighbor of neighbors) {
          if (!seen.has(neighbor)) {
            const edge = this.getEdge(cur, neighbor);
            if (edge) {
              const curFromMap = distMap.get(cur);
              const neighborFromMap = distMap.get(neighbor);
              // TODO after no-non-undefined-assertion not ensure the logic
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

    getMinDist &&
    distMap.forEach((d, v) => {
      if (v !== srcVertex) {
        if (d < minDist) {
          minDist = d;
          if (genPaths) minDest = v;
        }
      }
    });

    genPaths && getPaths(minDest);

    return { distMap, preMap, seen, paths, minDist, minPath };
  }

  /**
   *  Dijkstra algorithm time: O(logVE) space: O(VO + EO)
   *
   * Dijkstra's algorithm only solves the single-source shortest path problem, while the Bellman-Ford algorithm and Floyd-Warshall algorithm can address shortest paths between all pairs of nodes.
   * Dijkstra's algorithm is suitable for graphs with non-negative edge weights, whereas the Bellman-Ford algorithm and Floyd-Warshall algorithm can handle negative-weight edgeMap.
   * The time complexity of Dijkstra's algorithm and the Bellman-Ford algorithm depends on the size of the graph, while the time complexity of the Floyd-Warshall algorithm is O(VO^3), where VO is the number of nodes. For dense graphs, Floyd-Warshall might become slower.
   *
   */

  /**
   * Time Complexity: O((V + E) * log(V)) - Depends on the implementation (using a binary heap).
   * Space Complexity: O(V + E) - Depends on the implementation (using a binary heap).
   */

  /**
   * Time Complexity: O((V + E) * log(V)) - Depends on the implementation (using a binary heap).
   * Space Complexity: O(V + E) - Depends on the implementation (using a binary heap).
   *
   * Dijkstra's algorithm is used to find the shortest paths from a source node to all other nodes in a graph. Its basic idea is to repeatedly choose the node closest to the source node and update the distances of other nodes using this node as an intermediary. Dijkstra's algorithm requires that the edge weights in the graph are non-negative.
   * The `dijkstra` function implements Dijkstra's algorithm to find the shortest path between a source vertex and an
   * optional destination vertex, and optionally returns the minimum distance, the paths, and other information.
   * @param {VO | VertexKey} src - The `src` parameter represents the source vertex from which the Dijkstra algorithm will
   * start. It can be either a vertex object or a vertex ID.
   * @param {VO | VertexKey | undefined} [dest] - The `dest` parameter is the destination vertex or vertex ID. It specifies the
   * vertex to which the shortest path is calculated from the source vertex. If no destination is provided, the algorithm
   * will calculate the shortest paths to all other vertexMap from the source vertex.
   * @param {boolean} [getMinDist] - The `getMinDist` parameter is a boolean flag that determines whether the minimum
   * distance from the source vertex to the destination vertex should be calculated and returned in the result. If
   * `getMinDist` is set to `true`, the `minDist` property in the result will contain the minimum distance
   * @param {boolean} [genPaths] - The `genPaths` parameter is a boolean flag that determines whether or not to generate
   * paths in the Dijkstra algorithm. If `genPaths` is set to `true`, the algorithm will calculate and return the
   * shortest paths from the source vertex to all other vertexMap in the graph. If `genPaths
   * @returns The function `dijkstra` returns an object of type `DijkstraResult<VO>`.
   */
  dijkstra(
    src: VO | VertexKey,
    dest: VO | VertexKey | undefined = undefined,
    getMinDist: boolean = false,
    genPaths: boolean = false
  ): DijkstraResult<VO> {
    let minDist = Infinity;
    let minDest: VO | undefined = undefined;
    let minPath: VO[] = [];
    const paths: VO[][] = [];
    const vertexMap = this._vertexMap;
    const distMap: Map<VO, number> = new Map();
    const seen: Set<VO> = new Set();
    const preMap: Map<VO, VO | undefined> = new Map(); // predecessor

    const srcVertex = this._getVertex(src);
    const destVertex = dest ? this._getVertex(dest) : undefined;

    if (!srcVertex) return undefined;

    for (const vertex of vertexMap) {
      const vertexOrKey = vertex[1];
      if (vertexOrKey instanceof AbstractVertex) distMap.set(vertexOrKey, Infinity);
    }

    const heap = new Heap<{ key: number; value: VO }>([], { comparator: (a, b) => a.key - b.key });
    heap.add({ key: 0, value: srcVertex });

    distMap.set(srcVertex, 0);
    preMap.set(srcVertex, undefined);

    /**
     * The function `getPaths` retrieves all paths from vertexMap to a specified minimum vertex.
     * @param {VO | undefined} minV - The parameter `minV` is of type `VO | undefined`. It represents the minimum vertex value or
     * undefined.
     */
    const getPaths = (minV: VO | undefined) => {
      for (const vertex of vertexMap) {
        const vertexOrKey = vertex[1];
        if (vertexOrKey instanceof AbstractVertex) {
          const path: VO[] = [vertexOrKey];
          let parent = preMap.get(vertexOrKey);
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
      const dist = curHeapNode?.key;
      const cur = curHeapNode?.value;
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
            return { distMap, preMap, seen, paths, minDist, minPath };
          }
          const neighbors = this.getNeighbors(cur);
          for (const neighbor of neighbors) {
            if (!seen.has(neighbor)) {
              const weight = this.getEdge(cur, neighbor)?.weight;
              if (typeof weight === 'number') {
                const distSrcToNeighbor = distMap.get(neighbor);
                if (distSrcToNeighbor) {
                  if (dist + weight < distSrcToNeighbor) {
                    heap.add({ key: dist + weight, value: neighbor });
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

    return { distMap, preMap, seen, paths, minDist, minPath };
  }

  /**
   * Time Complexity: O(V * E) - Quadratic time in the worst case (Bellman-Ford algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Bellman-Ford algorithm).
   * one to rest pairs
   */

  /**
   * Time Complexity: O(V * E) - Quadratic time in the worst case (Bellman-Ford algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Bellman-Ford algorithm).
   *
   * one to rest pairs
   * The Bellman-Ford algorithm is also used to find the shortest paths from a source node to all other nodes in a graph. Unlike Dijkstra's algorithm, it can handle edge weights that are negative. Its basic idea involves iterative relaxation of all edgeMap for several rounds to gradually approximate the shortest paths. Due to its ability to handle negative-weight edgeMap, the Bellman-Ford algorithm is more flexible in some scenarios.
   * The `bellmanFord` function implements the Bellman-Ford algorithm to find the shortest path from a source vertex to
   * all other vertexMap in a graph, and optionally detects negative cycles and generates the minimum path.
   * @param {VO | VertexKey} src - The `src` parameter is the source vertex from which the Bellman-Ford algorithm will
   * start calculating the shortest paths. It can be either a vertex object or a vertex ID.
   * @param {boolean} [scanNegativeCycle] - A boolean flag indicating whether to scan for negative cycles in the graph.
   * @param {boolean} [getMin] - The `getMin` parameter is a boolean flag that determines whether the algorithm should
   * calculate the minimum distance from the source vertex to all other vertexMap in the graph. If `getMin` is set to
   * `true`, the algorithm will find the minimum distance and update the `min` variable with the minimum
   * @param {boolean} [genPath] - A boolean flag indicating whether to generate paths for all vertexMap from the source
   * vertex.
   * @returns The function `bellmanFord` returns an object with the following properties:
   */
  bellmanFord(src: VO | VertexKey, scanNegativeCycle?: boolean, getMin?: boolean, genPath?: boolean) {
    if (getMin === undefined) getMin = false;
    if (genPath === undefined) genPath = false;

    const srcVertex = this._getVertex(src);
    const paths: VO[][] = [];
    const distMap: Map<VO, number> = new Map();
    const preMap: Map<VO, VO> = new Map(); // predecessor
    let min = Infinity;
    let minPath: VO[] = [];
    // TODO
    let hasNegativeCycle: boolean | undefined;
    if (scanNegativeCycle) hasNegativeCycle = false;
    if (!srcVertex) return { hasNegativeCycle, distMap, preMap, paths, min, minPath };

    const vertexMap = this._vertexMap;
    const numOfVertices = vertexMap.size;
    const edgeMap = this.edgeSet();
    const numOfEdges = edgeMap.length;

    this._vertexMap.forEach(vertex => {
      distMap.set(vertex, Infinity);
    });

    distMap.set(srcVertex, 0);

    for (let i = 1; i < numOfVertices; ++i) {
      for (let j = 0; j < numOfEdges; ++j) {
        const ends = this.getEndsOfEdge(edgeMap[j]);
        if (ends) {
          const [s, d] = ends;
          const weight = edgeMap[j].weight;
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

    let minDest: VO | undefined = undefined;
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
      for (const vertex of vertexMap) {
        const vertexOrKey = vertex[1];
        if (vertexOrKey instanceof AbstractVertex) {
          const path: VO[] = [vertexOrKey];
          let parent = preMap.get(vertexOrKey);
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
      const ends = this.getEndsOfEdge(edgeMap[j]);
      if (ends) {
        const [s] = ends;
        const weight = edgeMap[j].weight;
        const sWeight = distMap.get(s);
        if (sWeight) {
          if (sWeight !== Infinity && sWeight + weight < sWeight) hasNegativeCycle = true;
        }
      }
    }

    return { hasNegativeCycle, distMap, preMap, paths, min, minPath };
  }

  /**
   * Dijkstra algorithm time: O(logVE) space: O(VO + EO)
   */

  /**
   * Dijkstra algorithm time: O(logVE) space: O(VO + EO)
   * Dijkstra's algorithm is used to find the shortest paths from a source node to all other nodes in a graph. Its basic idea is to repeatedly choose the node closest to the source node and update the distances of other nodes using this node as an intermediary. Dijkstra's algorithm requires that the edge weights in the graph are non-negative.
   */

  /**
   * BellmanFord time:O(VE) space:O(VO)
   * one to rest pairs
   * The Bellman-Ford algorithm is also used to find the shortest paths from a source node to all other nodes in a graph. Unlike Dijkstra's algorithm, it can handle edge weights that are negative. Its basic idea involves iterative relaxation of all edgeMap for several rounds to gradually approximate the shortest paths. Due to its ability to handle negative-weight edgeMap, the Bellman-Ford algorithm is more flexible in some scenarios.
   * The `bellmanFord` function implements the Bellman-Ford algorithm to find the shortest path from a source vertex to
   */

  /**
   * Time Complexity: O(V^3) - Cubic time (Floyd-Warshall algorithm).
   * Space Complexity: O(V^2) - Quadratic space (Floyd-Warshall algorithm).
   * Not support graph with negative weight cycle
   * all pairs
   * The Floyd-Warshall algorithm is used to find the shortest paths between all pairs of nodes in a graph. It employs dynamic programming to compute the shortest paths from any node to any other node. The Floyd-Warshall algorithm's advantage lies in its ability to handle graphs with negative-weight edgeMap, and it can simultaneously compute shortest paths between any two nodes.
   */

  /**
   * Time Complexity: O(V^3) - Cubic time (Floyd-Warshall algorithm).
   * Space Complexity: O(V^2) - Quadratic space (Floyd-Warshall algorithm).
   *
   * Not support graph with negative weight cycle
   * all pairs
   * The Floyd-Warshall algorithm is used to find the shortest paths between all pairs of nodes in a graph. It employs dynamic programming to compute the shortest paths from any node to any other node. The Floyd-Warshall algorithm's advantage lies in its ability to handle graphs with negative-weight edgeMap, and it can simultaneously compute shortest paths between any two nodes.
   * The function implements the Floyd-Warshall algorithm to find the shortest path between all pairs of vertexMap in a
   * graph.
   * @returns The function `floydWarshall()` returns an object with two properties: `costs` and `predecessor`. The `costs`
   * property is a 2D array of numbers representing the shortest path costs between vertexMap in a graph. The
   * `predecessor` property is a 2D array of vertexMap (or `undefined`) representing the predecessor vertexMap in the shortest
   * path between vertexMap in the
   */
  floydWarshall(): { costs: number[][]; predecessor: (VO | undefined)[][] } {
    const idAndVertices = [...this._vertexMap];
    const n = idAndVertices.length;

    const costs: number[][] = [];
    const predecessor: (VO | undefined)[][] = [];
    // successors

    for (let i = 0; i < n; i++) {
      costs[i] = [];
      predecessor[i] = [];
      for (let j = 0; j < n; j++) {
        predecessor[i][j] = undefined;
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
    return { costs, predecessor };
  }

  /**
   * O(V+E+C)
   * O(V+C)
   */
  getCycles(isInclude2Cycle: boolean = false): VertexKey[][] {
    const cycles: VertexKey[][] = [];
    const visited: Set<VO> = new Set();

    const dfs = (vertex: VO, currentPath: VertexKey[], visited: Set<VO>) => {
      if (visited.has(vertex)) {
        if (
          ((!isInclude2Cycle && currentPath.length > 2) || (isInclude2Cycle && currentPath.length >= 2)) &&
          currentPath[0] === vertex.key
        ) {
          cycles.push([...currentPath]);
        }
        return;
      }

      visited.add(vertex);
      currentPath.push(vertex.key);

      for (const neighbor of this.getNeighbors(vertex)) {
        neighbor && dfs(neighbor, currentPath, visited);
      }

      visited.delete(vertex);
      currentPath.pop();
    };

    for (const vertex of this.vertexMap.values()) {
      dfs(vertex, [], visited);
    }

    // Use a set to eliminate duplicate cycles
    const uniqueCycles = new Map<string, VertexKey[]>();

    for (const cycle of cycles) {
      const sorted = [...cycle].sort().toString();

      if (uniqueCycles.has(sorted)) continue;
      else {
        uniqueCycles.set(sorted, cycle);
      }
    }

    // Convert the unique cycles back to an array
    return [...uniqueCycles].map(cycleString => cycleString[1]);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function iterates over key-value pairs in a data structure and returns an array of
   * pairs that satisfy a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes four arguments:
   * `value`, `key`, `index`, and `this`. It is used to determine whether an element should be included
   * in the filtered array. The callback function should return `true` if the element should be
   * included, and `
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the `predicate` function. It is used when you want to bind a
   * specific object as the context for the `predicate` function. If `thisArg` is provided, it will be
   * @returns The `filter` method returns an array of key-value pairs `[VertexKey, V | undefined][]`
   * that satisfy the given predicate function.
   */
  filter(predicate: EntryCallback<VertexKey, V | undefined, boolean>, thisArg?: any): [VertexKey, V | undefined][] {
    const filtered: [VertexKey, V | undefined][] = [];
    let index = 0;
    for (const [key, value] of this) {
      if (predicate.call(thisArg, value, key, index, this)) {
        filtered.push([key, value]);
      }
      index++;
    }
    return filtered;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function iterates over the elements of a collection and applies a callback function to
   * each element, returning an array of the results.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * map. It takes four arguments:
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. If `thisArg` is provided, it will be
   * used as the `this` value when calling the callback function. If `thisArg` is not provided, `
   * @returns The `map` function is returning an array of type `T[]`.
   */
  map<T>(callback: EntryCallback<VertexKey, V | undefined, T>, thisArg?: any): T[] {
    const mapped: T[] = [];
    let index = 0;
    for (const [key, value] of this) {
      mapped.push(callback.call(thisArg, value, key, index, this));
      index++;
    }
    return mapped;
  }

  protected* _getIterator(): IterableIterator<[VertexKey, V | undefined]> {
    for (const vertex of this._vertexMap.values()) {
      yield [vertex.key, vertex.value];
    }
  }

  protected abstract _addEdge(edge: EO): boolean;

  protected _addVertex(newVertex: VO): boolean {
    if (this.hasVertex(newVertex)) {
      return false;
      // throw (new Error('Duplicated vertex key is not allowed'));
    }
    this._vertexMap.set(newVertex.key, newVertex);
    return true;
  }

  protected _getVertex(vertexOrKey: VertexKey | VO): VO | undefined {
    const vertexKey = this._getVertexKey(vertexOrKey);
    return this._vertexMap.get(vertexKey) || undefined;
  }

  protected _getVertexKey(vertexOrKey: VO | VertexKey): VertexKey {
    return vertexOrKey instanceof AbstractVertex ? vertexOrKey.key : vertexOrKey;
  }
}
