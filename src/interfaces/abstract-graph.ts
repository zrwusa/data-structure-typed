import {VertexKey} from '../types';

export interface IAbstractGraph<V, E> {
  hasVertex(vertexOrKey: V | VertexKey): boolean;

  addVertex(key: VertexKey, val?: V): boolean;

  removeVertex(vertexOrKey: V | VertexKey): boolean;

  removeAllVertices(vertices: V[] | VertexKey[]): boolean;

  degreeOf(vertexOrKey: V | VertexKey): number;

  edgesOf(vertexOrKey: V | VertexKey): E[];

  hasEdge(src: V | VertexKey, dest: V | VertexKey): boolean;

  getEdge(srcOrKey: V | VertexKey, destOrKey: V | VertexKey): E | null;

  edgeSet(): E[];

  addEdge(src: V | VertexKey, dest: V | VertexKey, weight: number, val: E): boolean;

  removeEdge(edge: E): E | null;

  setEdgeWeight(srcOrKey: V | VertexKey, destOrKey: V | VertexKey, weight: number): boolean;

  getMinPathBetween(v1: V | VertexKey, v2: V | VertexKey, isWeight?: boolean): V[] | null;

  getNeighbors(vertexOrKey: V | VertexKey): V[];
}
