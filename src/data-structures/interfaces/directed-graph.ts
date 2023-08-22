import {VertexId} from '../types';
import {DirectedEdge, DirectedVertex} from '../graph';

export interface IDirectedGraph<V, E> {
    incomingEdgesOf(vertex: DirectedVertex<V>): DirectedEdge<E>[];

    outgoingEdgesOf(vertex: DirectedVertex<V>): DirectedEdge<E>[];

    inDegreeOf(vertexOrId: DirectedVertex<V> | VertexId): number;

    outDegreeOf(vertexOrId: DirectedVertex<V> | VertexId): number;

    getEdgeSrc(e: DirectedEdge<E>): DirectedVertex<V> | null;

    getEdgeDest(e: DirectedEdge<E>): DirectedVertex<V> | null;
}