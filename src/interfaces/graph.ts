import { VertexKey } from '../types';

export interface IGraph<V, E, VO, EO> {
  // Vertex factories
  createVertex(key: VertexKey, value?: V): VO;

  // Edge factories
  createEdge(srcOrV1: VertexKey, destOrV2: VertexKey, weight?: number, value?: E): EO;

  // Core vertex ops
  getVertex(vertexKey: VertexKey): VO | undefined;

  hasVertex(vertexOrKey: VO | VertexKey): boolean;

  addVertex(vertex: VO): boolean;

  addVertex(key: VertexKey, value?: V): boolean;

  deleteVertex(vertexOrKey: VO | VertexKey): boolean;

  // Core edge ops
  deleteEdge(edge: EO): EO | undefined;

  getEdge(srcOrKey: VO | VertexKey, destOrKey: VO | VertexKey): EO | undefined;

  degreeOf(vertexOrKey: VO | VertexKey): number;

  edgeSet(): EO[];

  edgesOf(vertexOrKey: VO | VertexKey): EO[];

  getNeighbors(vertexOrKey: VO | VertexKey): VO[];

  getEndsOfEdge(edge: EO): [VO, VO] | undefined;

  // Container-like ops
  isEmpty(): boolean;

  clear(): void;

  clone(): this;

  filter(...args: any[]): this;
}
