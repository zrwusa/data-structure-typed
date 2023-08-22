import {VertexId} from '../types';
import {AbstractEdge, AbstractVertex} from '../graph';

export interface IGraph<V, E> {

    hasVertex(vertexOrId: AbstractVertex<V> | VertexId): boolean;

    _getVertex(vertexOrId: VertexId | AbstractVertex<V>): AbstractVertex<V> | null;

    _getVertexId(vertexOrId: AbstractVertex<V> | VertexId): VertexId;

    createAddVertex(id: VertexId, val?: V): boolean;

    addVertex(newVertex: AbstractVertex<V>): boolean;

    removeVertex(vertexOrId: AbstractVertex<V> | VertexId): boolean;

    removeAllVertices(vertices: AbstractVertex<V>[] | VertexId[]): boolean;

    degreeOf(vertexOrId: AbstractVertex<V> | VertexId): number;

    edgesOf(vertexOrId: AbstractVertex<V> | VertexId): AbstractEdge<E>[];

    hasEdge(src: AbstractVertex<V> | VertexId, dest: AbstractVertex<V> | VertexId): boolean;

    getEdge(srcOrId: AbstractVertex<V> | VertexId, destOrId: AbstractVertex<V> | VertexId): AbstractEdge<E> | null;

    edgeSet(): AbstractEdge<E>[];

    createAddEdge(src: AbstractVertex<V> | VertexId, dest: AbstractVertex<V> | VertexId, weight: number, val: E): boolean;

    addEdge(edge: AbstractEdge<E>): boolean;

    removeEdgeBetween(src: AbstractVertex<V> | VertexId, dest: AbstractVertex<V> | VertexId): AbstractEdge<E> | null;

    removeEdge(edge: AbstractEdge<E>): AbstractEdge<E> | null;

    setEdgeWeight(srcOrId: AbstractVertex<V> | VertexId, destOrId: AbstractVertex<V> | VertexId, weight: number): boolean;

    getMinPathBetween(v1: AbstractVertex<V> | VertexId, v2: AbstractVertex<V> | VertexId, isWeight?: boolean): AbstractVertex<V>[] | null;

    getNeighbors(vertexOrId: AbstractVertex<V> | VertexId): AbstractVertex<V>[];
}