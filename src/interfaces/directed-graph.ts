import {VertexKey} from '../types';
import {IAbstractGraph} from './abstract-graph';

export interface IDirectedGraph<V, E> extends IAbstractGraph<V, E> {
  incomingEdgesOf(vertex: V): E[];

  outgoingEdgesOf(vertex: V): E[];

  inDegreeOf(vertexOrKey: V | VertexKey): number;

  outDegreeOf(vertexOrKey: V | VertexKey): number;

  getEdgeSrc(e: E): V | null;

  getEdgeDest(e: E): V | null;

  removeEdgeSrcToDest(srcOrKey: V | VertexKey, destOrKey: V | VertexKey): E | null;

  removeEdgesBetween(v1: V | VertexKey, v2: V | VertexKey): E[];
}
