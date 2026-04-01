/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { MapGraphCoordinate, VertexKey } from '../../types';
import { DirectedEdge, DirectedGraph, DirectedVertex } from './directed-graph';

export class MapVertex<V = any> extends DirectedVertex<V> {
  lat: number;
  long: number;

  constructor(key: VertexKey, value: V, lat: number, long: number) {
    super(key, value);
    this.lat = lat;
    this.long = long;
  }
}

export class MapEdge<E = any> extends DirectedEdge<E> {
  constructor(src: VertexKey, dest: VertexKey, weight?: number, value?: E) {
    super(src, dest, weight, value);
  }
}

/**
 * Directed graph variant carrying geospatial coordinates.
 * @template V - Vertex value type.
 * @template E - Edge value type.
 * @template VO - Concrete vertex class (MapVertex<V>).
 * @template EO - Concrete edge class (MapEdge<E>).
 * @remarks Time O(1), Space O(1)
 * @example
 * // City navigation with shortest path
 *  const map = new MapGraph([0, 0], [10, 10]);
 *
 *     map.addVertex(new MapVertex('Home', '', 0, 0));
 *     map.addVertex(new MapVertex('Office', '', 3, 4));
 *     map.addVertex(new MapVertex('Cafe', '', 1, 2));
 *     map.addVertex(new MapVertex('Park', '', 2, 1));
 *
 *     map.addEdge('Home', 'Cafe', 2.2);
 *     map.addEdge('Cafe', 'Office', 3.5);
 *     map.addEdge('Home', 'Park', 2.0);
 *     map.addEdge('Park', 'Office', 4.0);
 *     map.addEdge('Home', 'Office', 7.0);
 *
 *     // Find shortest path
 *     const result = map.dijkstra('Home', 'Office', true, true);
 *     console.log(result?.minDist); // 5.7; // Home → Cafe → Office
 *     console.log(result?.minPath.map(v => v.key)); // ['Home', 'Cafe', 'Office'];
 * @example
 * // Delivery route optimization
 *  const routes = new MapGraph([0, 0], [10, 10]);
 *
 *     routes.addVertex(new MapVertex('Warehouse', '', 0, 0));
 *     routes.addVertex(new MapVertex('Customer A', '', 2, 3));
 *     routes.addVertex(new MapVertex('Customer B', '', 5, 1));
 *     routes.addVertex(new MapVertex('Customer C', '', 3, 5));
 *
 *     routes.addEdge('Warehouse', 'Customer A', 3.6);
 *     routes.addEdge('Warehouse', 'Customer B', 5.1);
 *     routes.addEdge('Customer A', 'Customer C', 2.2);
 *     routes.addEdge('Customer A', 'Customer B', 3.6);
 *     routes.addEdge('Customer B', 'Customer C', 4.5);
 *
 *     // Check outgoing neighbors of Customer A
 *     const neighbors = routes.getNeighbors('Customer A');
 *     console.log(neighbors.map(n => n.key).sort()); // ['Customer B', 'Customer C'];
 *
 *     // Shortest path from Warehouse to Customer C
 *     const path = routes.getMinPathBetween('Warehouse', 'Customer C', true);
 *     console.log(path?.map(v => v.key)); // ['Warehouse', 'Customer A', 'Customer C'];
 * @example
 * // Campus map with building connections
 *  const campus = new MapGraph([0, 0], [5, 5]);
 *
 *     campus.addVertex(new MapVertex('Library', '', 0, 0));
 *     campus.addVertex(new MapVertex('Lab', '', 1, 1));
 *     campus.addVertex(new MapVertex('Cafeteria', '', 2, 0));
 *
 *     campus.addEdge('Library', 'Lab', 5);
 *     campus.addEdge('Lab', 'Cafeteria', 3);
 *     campus.addEdge('Library', 'Cafeteria', 10);
 *
 *     console.log(campus.hasVertex('Library')); // true;
 *     console.log(campus.hasVertex('Gym')); // false;
 *
 *     // Direct distance vs shortest path
 *     const direct = campus.dijkstra('Library', 'Cafeteria', true, true);
 *     console.log(direct?.minDist); // 8;
 */
export class MapGraph<
  V = any,
  E = any,
  VO extends MapVertex<V> = MapVertex<V>,
  EO extends MapEdge<E> = MapEdge<E>
> extends DirectedGraph<V, E, VO, EO> {
  /**
   * Construct a MapGraph.
   * @param originCoord - Origin coordinate `[lat, long]` used as default.
   * @param bottomRight - Optional bottom-right coordinate for bounding boxes.
   * @remarks Time O(1), Space O(1)
   */
  constructor(originCoord: MapGraphCoordinate, bottomRight?: MapGraphCoordinate) {
    super();
    this._originCoord = originCoord;
    this._bottomRight = bottomRight;
  }

  protected _originCoord: MapGraphCoordinate = [0, 0];
  get originCoord(): MapGraphCoordinate {
    return this._originCoord;
  }

  protected _bottomRight: MapGraphCoordinate | undefined;
  get bottomRight(): MapGraphCoordinate | undefined {
    return this._bottomRight;
  }

  /**
   * Create a map vertex with optional coordinates.
   * @param key - Vertex identifier.
   * @param value - Optional payload.
   * @param lat - Latitude (defaults to `originCoord[0]`).
   * @param long - Longitude (defaults to `originCoord[1]`).
   * @returns MapVertex instance.
   * @remarks Time O(1), Space O(1)
   */
  override createVertex(
    key: VertexKey,
    value?: V,
    lat: number = this.originCoord[0],
    long: number = this.originCoord[1]
  ): VO {
    return new MapVertex(key, value, lat, long) as VO;
  }

  /**
   * Create a map edge (directed) with optional weight/value.
   * @param src - Source key.
   * @param dest - Destination key.
   * @param weight - Edge weight.
   * @param value - Edge payload.
   * @returns MapEdge instance.
   * @remarks Time O(1), Space O(1)
   */
  override createEdge(src: VertexKey, dest: VertexKey, weight?: number, value?: E): EO {
    return new MapEdge(src, dest, weight, value) as EO;
  }

  /**
   * Deep clone as the same concrete class.
   * @returns A new graph of the same concrete class (`this` type).
   * @remarks Time O(V + E), Space O(V + E)
   */
  override clone(): this {
    return super.clone();
  }

  /**
   * Include `originCoord` and `bottomRight` so `clone()/filter()` preserve geospatial settings.
   * @returns Options bag extending super snapshot.
   * @remarks Time O(1), Space O(1)
   */
  protected override _snapshotOptions(): Record<string, unknown> {
    return { ...super._snapshotOptions(), originCoord: this.originCoord, bottomRight: this.bottomRight };
  }

  /**
   * Re-create a same-species MapGraph instance from snapshot options.
   * @param options - Snapshot options providing `originCoord`/`bottomRight`.
   * @returns Empty MapGraph instance of `this` type.
   * @remarks Time O(1), Space O(1)
   */
  protected override _createInstance(options?: Partial<Record<string, unknown>>): this {
    const { originCoord, bottomRight } = (options || {}) as {
      originCoord?: [number, number];
      bottomRight?: [number, number] | undefined;
    };
    const oc = (originCoord ?? this.originCoord) as [number, number];
    const br = (bottomRight ?? this.bottomRight) as [number, number] | undefined;
    return new MapGraph<V, E, VO, EO>(oc, br) as this;
  }
}
