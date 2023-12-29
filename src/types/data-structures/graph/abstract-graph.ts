export type VertexKey = string | number;

export type DijkstraResult<V> =
  | {
  distMap: Map<V, number>;
  distPaths?: Map<V, V[]>;
  preMap: Map<V, V | undefined>;
  seen: Set<V>;
  paths: V[][];
  minDist: number;
  minPath: V[];
}
  | undefined;
