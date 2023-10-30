/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {arrayRemove} from '../../utils';
import {AbstractEdge, AbstractGraph, AbstractVertex} from './abstract-graph';
import type {VertexKey} from '../../types';
import {IGraph} from '../../interfaces';

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
    this._vertices = [v1, v2];
  }

  private _vertices: [VertexKey, VertexKey];

  get vertices() {
    return this._vertices;
  }

  set vertices(v: [VertexKey, VertexKey]) {
    this._vertices = v;
  }
}

export class UndirectedGraph<
    V = any,
    E = any,
    VO extends UndirectedVertex<V> = UndirectedVertex<V>,
    EO extends UndirectedEdge<E> = UndirectedEdge<E>
  >
  extends AbstractGraph<V, E, VO, EO>
  implements IGraph<V, E, VO, EO>
{
  /**
   * The constructor initializes a new Map object to store edges.
   */
  constructor() {
    super();
    this._edges = new Map<VO, EO[]>();
  }

  protected _edges: Map<VO, EO[]>;

  get edges(): Map<VO, EO[]> {
    return this._edges;
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
   * The function creates an undirected edge between two vertices with an optional weight and value.
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
   * The function `getEdge` returns the first edge that connects two vertices, or null if no such edge exists.
   * @param {VO | VertexKey | null} v1 - The parameter `v1` represents a vertex or vertex ID. It can be of type `VO` (vertex
   * object), `null`, or `VertexKey` (a string or number representing the ID of a vertex).
   * @param {VO | VertexKey | null} v2 - The parameter `v2` represents a vertex or vertex ID. It can be of type `VO` (vertex
   * object), `null`, or `VertexKey` (vertex ID).
   * @returns an edge (EO) or null.
   */
  getEdge(v1: VO | VertexKey | null, v2: VO | VertexKey | null): EO | null {
    let edges: EO[] | undefined = [];

    if (v1 !== null && v2 !== null) {
      const vertex1: VO | null = this._getVertex(v1);
      const vertex2: VO | null = this._getVertex(v2);

      if (vertex1 && vertex2) {
        edges = this._edges.get(vertex1)?.filter(e => e.vertices.includes(vertex2.key));
      }
    }

    return edges ? edges[0] || null : null;
  }

  /**
   * The function removes an edge between two vertices in a graph and returns the removed edge.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents either a vertex object (`VO`) or a vertex ID (`VertexKey`).
   * @param {VO | VertexKey} v2 - VO | VertexKey - This parameter can be either a vertex object (VO) or a vertex ID
   * (VertexKey). It represents the second vertex of the edge that needs to be removed.
   * @returns the removed edge (EO) if it exists, or null if either of the vertices (VO) does not exist.
   */
  deleteEdgeBetween(v1: VO | VertexKey, v2: VO | VertexKey): EO | null {
    const vertex1: VO | null = this._getVertex(v1);
    const vertex2: VO | null = this._getVertex(v2);

    if (!vertex1 || !vertex2) {
      return null;
    }

    const v1Edges = this._edges.get(vertex1);
    let removed: EO | null = null;
    if (v1Edges) {
      removed = arrayRemove<EO>(v1Edges, (e: EO) => e.vertices.includes(vertex2.key))[0] || null;
    }
    const v2Edges = this._edges.get(vertex2);
    if (v2Edges) {
      arrayRemove<EO>(v2Edges, (e: EO) => e.vertices.includes(vertex1.key));
    }
    return removed;
  }

  /**
   * The deleteEdge function removes an edge between two vertices in a graph.
   * @param {EO} edge - The parameter "edge" is of type EO, which represents an edge in a graph.
   * @returns The method is returning either the removed edge (of type EO) or null if the edge was not found.
   */
  deleteEdge(edge: EO): EO | null {
    return this.deleteEdgeBetween(edge.vertices[0], edge.vertices[1]);
  }

  /**
   * The function `degreeOf` returns the degree of a vertex in a graph, which is the number of edges connected to that
   * vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The function `degreeOf` returns the degree of a vertex in a graph. The degree of a vertex is the number of
   * edges connected to that vertex.
   */
  degreeOf(vertexOrKey: VertexKey | VO): number {
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      return this._edges.get(vertex)?.length || 0;
    } else {
      return 0;
    }
  }

  /**
   * The function returns the edges of a given vertex or vertex ID.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`. A `VertexKey` is a
   * unique identifier for a vertex in a graph, while `VO` represents the type of the vertex.
   * @returns an array of edges.
   */
  edgesOf(vertexOrKey: VertexKey | VO): EO[] {
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      return this._edges.get(vertex) || [];
    } else {
      return [];
    }
  }

  /**
   * The function "edgeSet" returns an array of unique edges from a set of edges.
   * @returns The method `edgeSet()` returns an array of type `EO[]`.
   */
  edgeSet(): EO[] {
    const edgeSet: Set<EO> = new Set();
    this._edges.forEach(edges => {
      edges.forEach(edge => {
        edgeSet.add(edge);
      });
    });
    return [...edgeSet];
  }

  /**
   * The function "getNeighbors" returns an array of neighboring vertices for a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns an array of vertices (VO[]).
   */
  getNeighbors(vertexOrKey: VO | VertexKey): VO[] {
    const neighbors: VO[] = [];
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      const neighborEdges = this.edgesOf(vertex);
      for (const edge of neighborEdges) {
        const neighbor = this._getVertex(edge.vertices.filter(e => e !== vertex.key)[0]);
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  /**
   * The function "getEndsOfEdge" returns the vertices at the ends of an edge if the edge exists in the graph, otherwise
   * it returns null.
   * @param {EO} edge - The parameter "edge" is of type EO, which represents an edge in a graph.
   * @returns The function `getEndsOfEdge` returns an array containing two vertices `[VO, VO]` if the edge exists in the
   * graph. If the edge does not exist, it returns `null`.
   */
  getEndsOfEdge(edge: EO): [VO, VO] | null {
    if (!this.hasEdge(edge.vertices[0], edge.vertices[1])) {
      return null;
    }
    const v1 = this._getVertex(edge.vertices[0]);
    const v2 = this._getVertex(edge.vertices[1]);
    if (v1 && v2) {
      return [v1, v2];
    } else {
      return null;
    }
  }

  /**
   * The function adds an edge to the graph by updating the adjacency list with the vertices of the edge.
   * @param {EO} edge - The parameter "edge" is of type EO, which represents an edge in a graph.
   * @returns a boolean value.
   */
  protected _addEdgeOnly(edge: EO): boolean {
    for (const end of edge.vertices) {
      const endVertex = this._getVertex(end);
      if (endVertex === null) return false;
      if (endVertex) {
        const edges = this._edges.get(endVertex);
        if (edges) {
          edges.push(edge);
        } else {
          this._edges.set(endVertex, [edge]);
        }
      }
    }
    return true;
  }

  /**
   * The function sets the edges of a graph.
   * @param v - A map where the keys are of type VO and the values are arrays of type EO.
   */
  protected _setEdges(v: Map<VO, EO[]>) {
    this._edges = v;
  }
}
