import {VertexKey} from '../types';

export interface IGraph<V, E> {
  createVertex(key: VertexKey, val?: V): V;

  createEdge(srcOrV1: VertexKey | string, destOrV2: VertexKey | string, weight?: number, val?: E): E;
}
