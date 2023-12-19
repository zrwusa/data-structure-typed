/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { VertexKey } from '../../types';
import { IGraph } from '../../interfaces';
import { AbstractEdge, AbstractGraph, AbstractVertex } from './abstract-graph';
import { arrayRemove } from '../../utils';

export class UndirectedVertex<V = any> extends AbstractVertex<V> {
  /**
   * The constructor function initializes a vertex with an optional value.
   * @param {VertexKey} key - The `key` parameter is of type `VertexKey` and represents the identifier of the vertex. It is
   * used to uniquely identify the vertex within a graph or network.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It is used to initialize the value of the
   * vertex. If no value is provided, the vertex will be initialized with a default value.
   */
  constructor(key: VertexKey, value?: V) {
    super(key, value);
  }
}

export class UndirectedEdge<E = number> extends AbstractEdge<E> {
  vertexMap: [VertexKey, VertexKey];

  /**
   * The constructor function creates an instance of a class with two vertex IDs, an optional weight, and an optional
   * value.
   * @param {VertexKey} v1 - The first vertex ID of the edge.
   * @param {VertexKey} v2 - The parameter `v2` is a `VertexKey`, which represents the identifier of the second vertex in a
   * graph edge.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge.
   * @param {E} [value] - The "value" parameter is an optional parameter of type E. It is used to store a value associated
   * with the edge.
   */
  constructor(v1: VertexKey, v2: VertexKey, weight?: number, value?: E) {
    super(weight, value);
    this.vertexMap = [v1, v2];
  }
}

export class UndirectedGraph<
  V = any,
  E = any,
  VO extends UndirectedVertex<V> = UndirectedVertex<V>,
  EO extends UndirectedEdge<E> = UndirectedEdge<E>
>
  extends AbstractGraph<V, E, VO, EO>
  implements IGraph<V, E, VO, EO> {
  /**
   * The constructor initializes a new Map object to store edgeMap.
   */
  constructor() {
    super();
    this._edgeMap = new Map<VO, EO[]>();
  }

  protected _edgeMap: Map<VO, EO[]>;

  get edgeMap(): Map<VO, EO[]> {
    return this._edgeMap;
  }

  /**
   * The function creates a new vertex with an optional value and returns it.
   * @param {VertexKey} key - The `key` parameter is the unique identifier for the vertex. It is used to distinguish one
   * vertex from another in the graph.
   * @param [value] - The `value` parameter is an optional value that can be assigned to the vertex. If a value is provided,
   * it will be used as the value of the vertex. If no value is provided, the `key` parameter will be used as the value of
   * the vertex.
   * @returns The method is returning a new instance of the `UndirectedVertex` class, casted as type `VO`.
   */
  override createVertex(key: VertexKey, value?: VO['value']): VO {
    return new UndirectedVertex(key, value ?? key) as VO;
  }

  /**
   * The function creates an undirected edge between two vertexMap with an optional weight and value.
   * @param {VertexKey} v1 - The parameter `v1` represents the first vertex of the edge.
   * @param {VertexKey} v2 - The parameter `v2` represents the second vertex of the edge.
   * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the edge. If
   * no weight is provided, it defaults to 1.
   * @param [value] - The `value` parameter is an optional value that can be assigned to the edge. It can be of any type and
   * is used to store additional information or data associated with the edge.
   * @returns a new instance of the `UndirectedEdge` class, which is casted as type `EO`.
   */
  override createEdge(v1: VertexKey, v2: VertexKey, weight?: number, value?: EO['value']): EO {
    return new UndirectedEdge(v1, v2, weight ?? 1, value) as EO;
  }

  /**
   * Time Complexity: O(|E|), where |E| is the number of edgeMap incident to the given vertex.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(|E|), where |E| is the number of edgeMap incident to the given vertex.
   * Space Complexity: O(1)
   *
   * The function `getEdge` returns the first edge that connects two vertexMap, or undefined if no such edge exists.
   * @param {VO | VertexKey | undefined} v1 - The parameter `v1` represents a vertex or vertex ID. It can be of type `VO` (vertex
   * object), `undefined`, or `VertexKey` (a string or number representing the ID of a vertex).
   * @param {VO | VertexKey | undefined} v2 - The parameter `v2` represents a vertex or vertex ID. It can be of type `VO` (vertex
   * object), `undefined`, or `VertexKey` (vertex ID).
   * @returns an edge (EO) or undefined.
   */
  getEdge(v1: VO | VertexKey | undefined, v2: VO | VertexKey | undefined): EO | undefined {
    let edgeMap: EO[] | undefined = [];

    if (v1 !== undefined && v2 !== undefined) {
      const vertex1: VO | undefined = this._getVertex(v1);
      const vertex2: VO | undefined = this._getVertex(v2);

      if (vertex1 && vertex2) {
        edgeMap = this._edgeMap.get(vertex1)?.filter(e => e.vertexMap.includes(vertex2.key));
      }
    }

    return edgeMap ? edgeMap[0] || undefined : undefined;
  }

  /**
   * Time Complexity: O(|E|), where |E| is the number of edgeMap incident to the given vertex.
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(|E|), where |E| is the number of edgeMap incident to the given vertex.
   * Space Complexity: O(1)
   *
   * The function removes an edge between two vertexMap in a graph and returns the removed edge.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents either a vertex object (`VO`) or a vertex ID (`VertexKey`).
   * @param {VO | VertexKey} v2 - VO | VertexKey - This parameter can be either a vertex object (VO) or a vertex ID
   * (VertexKey). It represents the second vertex of the edge that needs to be removed.
   * @returns the removed edge (EO) if it exists, or undefined if either of the vertexMap (VO) does not exist.
   */
  deleteEdgeBetween(v1: VO | VertexKey, v2: VO | VertexKey): EO | undefined {
    const vertex1: VO | undefined = this._getVertex(v1);
    const vertex2: VO | undefined = this._getVertex(v2);

    if (!vertex1 || !vertex2) {
      return undefined;
    }

    const v1Edges = this._edgeMap.get(vertex1);
    let removed: EO | undefined = undefined;
    if (v1Edges) {
      removed = arrayRemove<EO>(v1Edges, (e: EO) => e.vertexMap.includes(vertex2.key))[0] || undefined;
    }
    const v2Edges = this._edgeMap.get(vertex2);
    if (v2Edges) {
      arrayRemove<EO>(v2Edges, (e: EO) => e.vertexMap.includes(vertex1.key));
    }
    return removed;
  }

  /**
   * Time Complexity: O(E), where E is the number of edgeMap incident to the given vertex.
   * Space Complexity: O(1)
   */


  /**
   * Time Complexity: O(E), where E is the number of edgeMap incident to the given vertex.
   * Space Complexity: O(1)
   *
   * The function `deleteEdge` deletes an edge between two vertexMap in a graph.
   * @param {EO | VertexKey} edgeOrOneSideVertexKey - The parameter `edgeOrOneSideVertexKey` can be
   * either an edge object or a vertex key.
   * @param {VertexKey} [otherSideVertexKey] - The parameter `otherSideVertexKey` is an optional
   * parameter that represents the key of the vertex on the other side of the edge. It is used when the
   * `edgeOrOneSideVertexKey` parameter is a vertex key, and it specifies the key of the vertex on the
   * other side of the
   * @returns The `deleteEdge` function returns either the deleted edge object (EO) or `undefined`.
   */
  deleteEdge(edgeOrOneSideVertexKey: EO | VertexKey, otherSideVertexKey?: VertexKey): EO | undefined {
    let oneSide: VO | undefined, otherSide: VO | undefined;
    if (this.isVertexKey(edgeOrOneSideVertexKey)) {
      if (this.isVertexKey(otherSideVertexKey)) {
        oneSide = this._getVertex(edgeOrOneSideVertexKey);
        otherSide = this._getVertex(otherSideVertexKey);
      } else {
        return;
      }
    } else {
      oneSide = this._getVertex(edgeOrOneSideVertexKey.vertexMap[0]);
      otherSide = this._getVertex(edgeOrOneSideVertexKey.vertexMap[1]);
    }

    if (oneSide && otherSide) {
      return this.deleteEdgeBetween(oneSide, otherSide);

    } else {
      return;
    }
  }

  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The `deleteVertex` function removes a vertex from a graph by its ID or by the vertex object itself.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method is returning a boolean value.
   */
  override deleteVertex(vertexOrKey: VO | VertexKey): boolean {
    let vertexKey: VertexKey;
    let vertex: VO | undefined;
    if (this.isVertexKey(vertexOrKey)) {
      vertex = this.getVertex(vertexOrKey);
      vertexKey = vertexOrKey;
    } else {
      vertex = vertexOrKey;
      vertexKey = this._getVertexKey(vertexOrKey)
    }

    const neighbors = this.getNeighbors(vertexOrKey)

    if (vertex) {
      neighbors.forEach(neighbor => {
        const neighborEdges = this._edgeMap.get(neighbor);
        if (neighborEdges) {
          const restEdges = neighborEdges.filter(edge => {
            return !edge.vertexMap.includes(vertexKey);
          });
          this._edgeMap.set(neighbor, restEdges);
        }
      })
      this._edgeMap.delete(vertex);

    }

    return this._vertexMap.delete(vertexKey);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `degreeOf` returns the degree of a vertex in a graph, which is the number of edgeMap connected to that
   * vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The function `degreeOf` returns the degree of a vertex in a graph. The degree of a vertex is the number of
   * edgeMap connected to that vertex.
   */
  degreeOf(vertexOrKey: VertexKey | VO): number {
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      return this._edgeMap.get(vertex)?.length || 0;
    } else {
      return 0;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function returns the edgeMap of a given vertex or vertex ID.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`. A `VertexKey` is a
   * unique identifier for a vertex in a graph, while `VO` represents the type of the vertex.
   * @returns an array of edgeMap.
   */
  edgesOf(vertexOrKey: VertexKey | VO): EO[] {
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      return this._edgeMap.get(vertex) || [];
    } else {
      return [];
    }
  }

  /**
   * Time Complexity: O(|V| + |E|), where |V| is the number of vertexMap and |E| is the number of edgeMap.
   * Space Complexity: O(|E|)
   */

  /**
   * Time Complexity: O(|V| + |E|), where |V| is the number of vertexMap and |E| is the number of edgeMap.
   * Space Complexity: O(|E|)
   *
   * The function "edgeSet" returns an array of unique edgeMap from a set of edgeMap.
   * @returns The method `edgeSet()` returns an array of type `EO[]`.
   */
  edgeSet(): EO[] {
    const edgeSet: Set<EO> = new Set();
    this._edgeMap.forEach(edgeMap => {
      edgeMap.forEach(edge => {
        edgeSet.add(edge);
      });
    });
    return [...edgeSet];
  }

  /**
   * Time Complexity: O(|V| + |E|), where |V| is the number of vertexMap and |E| is the number of edgeMap.
   * Space Complexity: O(|E|)
   */

  /**
   * Time Complexity: O(|V| + |E|), where |V| is the number of vertexMap and |E| is the number of edgeMap.
   * Space Complexity: O(|E|)
   *
   * The function "getNeighbors" returns an array of neighboring vertexMap for a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns an array of vertexMap (VO[]).
   */
  getNeighbors(vertexOrKey: VO | VertexKey): VO[] {
    const neighbors: VO[] = [];
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      const neighborEdges = this.edgesOf(vertex);
      for (const edge of neighborEdges) {
        const neighbor = this._getVertex(edge.vertexMap.filter(e => e !== vertex.key)[0]);
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "getEndsOfEdge" returns the vertexMap at the ends of an edge if the edge exists in the graph, otherwise
   * it returns undefined.
   * @param {EO} edge - The parameter "edge" is of type EO, which represents an edge in a graph.
   * @returns The function `getEndsOfEdge` returns an array containing two vertexMap `[VO, VO]` if the edge exists in the
   * graph. If the edge does not exist, it returns `undefined`.
   */
  getEndsOfEdge(edge: EO): [VO, VO] | undefined {
    if (!this.hasEdge(edge.vertexMap[0], edge.vertexMap[1])) {
      return undefined;
    }
    const v1 = this._getVertex(edge.vertexMap[0]);
    const v2 = this._getVertex(edge.vertexMap[1]);
    if (v1 && v2) {
      return [v1, v2];
    } else {
      return undefined;
    }
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function adds an edge to the graph by updating the adjacency list with the vertexMap of the edge.
   * @param {EO} edge - The parameter "edge" is of type EO, which represents an edge in a graph.
   * @returns a boolean value.
   */
  protected _addEdge(edge: EO): boolean {
    for (const end of edge.vertexMap) {
      const endVertex = this._getVertex(end);
      if (endVertex === undefined) return false;
      if (endVertex) {
        const edgeMap = this._edgeMap.get(endVertex);
        if (edgeMap) {
          edgeMap.push(edge);
        } else {
          this._edgeMap.set(endVertex, [edge]);
        }
      }
    }
    return true;
  }
}
