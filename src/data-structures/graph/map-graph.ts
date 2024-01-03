import type { MapGraphCoordinate, VertexKey } from '../../types';
import { DirectedEdge, DirectedGraph, DirectedVertex } from './directed-graph';

export class MapVertex<V = any> extends DirectedVertex<V> {
  lat: number;
  long: number;

  /**
   * The constructor function initializes an object with an key, latitude, longitude, and an optional value.
   * @param {VertexKey} key - The `key` parameter is of type `VertexKey` and represents the identifier of the vertex.
   * @param {number} lat - The "lat" parameter represents the latitude of a vertex. Latitude is a geographic coordinate
   * that specifies the north-south position of a point on the Earth's surface. It is measured in degrees, with positive
   * values representing points north of the equator and negative values representing points south of the equator.
   * @param {number} long - The "long" parameter represents the longitude of a location. Longitude is a geographic
   * coordinate that specifies the east-west position of a point on the Earth's surface. It is measured in degrees, with
   * values ranging from -180 to 180.
   * @param {V} [value] - The "value" parameter is an optional value of type V. It is not required to be provided when
   * creating an instance of the class.
   */
  constructor(key: VertexKey, value: V, lat: number, long: number) {
    super(key, value);
    this.lat = lat;
    this.long = long;
  }
}

export class MapEdge<E = any> extends DirectedEdge<E> {
  /**
   * The constructor function initializes a new instance of a class with the given source, destination, weight, and
   * value.
   * @param {VertexKey} src - The `src` parameter is the source vertex ID. It represents the starting point of an edge in
   * a graph.
   * @param {VertexKey} dest - The `dest` parameter is the identifier of the destination vertex for an edge.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge.
   * @param {E} [value] - The "value" parameter is an optional parameter of type E. It is used to store additional
   * information or data associated with the edge.
   */
  constructor(src: VertexKey, dest: VertexKey, weight?: number, value?: E) {
    super(src, dest, weight, value);
  }
}

export class MapGraph<
  V = any,
  E = any,
  VO extends MapVertex<V> = MapVertex<V>,
  EO extends MapEdge<E> = MapEdge<E>
> extends DirectedGraph<V, E, VO, EO> {
  /**
   * The constructor function initializes the originCoord and bottomRight properties of a MapGraphCoordinate object.
   * @param {MapGraphCoordinate} originCoord - The `originCoord` parameter is a `MapGraphCoordinate` object that represents the
   * starting point or reference point of the map graph. It defines the coordinates of the top-left corner of the map
   * graph.
   * @param {MapGraphCoordinate} [bottomRight] - The `bottomRight` parameter is an optional parameter of type
   * `MapGraphCoordinate`. It represents the bottom right coordinate of a map graph. If this parameter is not provided,
   * it will default to `undefined`.
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
   * The function creates a new vertex with the given key, value, latitude, and longitude.
   * @param {VertexKey} key - The key parameter is the unique identifier for the vertex. It is of type VertexKey, which could
   * be a string or a number depending on how you define it in your code.
   * @param [value] - The `value` parameter is an optional value that can be assigned to the `value` property of the vertex. It
   * is of type `V`, which means it should be of the same type as the `value` property of the vertex class `VO`.
   * @param {number} lat - The `lat` parameter represents the latitude of the vertex. It is a number that specifies the
   * position of the vertex on the Earth's surface in the north-south direction.
   * @param {number} long - The `long` parameter represents the longitude coordinate of the vertex.
   * @returns The method is returning a new instance of the `MapVertex` class, casted as type `VO`.
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
   * The function creates a new instance of a MapEdge with the given source, destination, weight, and value.
   * @param {VertexKey} src - The source vertex ID of the edge. It represents the starting point of the edge.
   * @param {VertexKey} dest - The `dest` parameter is the identifier of the destination vertex for the edge being
   * created.
   * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the edge. It
   * is used to assign a numerical value to the edge, which can be used in algorithms such as shortest path algorithms.
   * If the weight is not provided, it can be set to a default value or left undefined.
   * @param [value] - The `value` parameter is an optional value that can be assigned to the edge. It can be of any type,
   * depending on the specific implementation of the `MapEdge` class.
   * @returns a new instance of the `MapEdge` class, cast as type `EO`.
   */
  override createEdge(src: VertexKey, dest: VertexKey, weight?: number, value?: E): EO {
    return new MapEdge(src, dest, weight, value) as EO;
  }

  /**
   * The override function is used to override the default behavior of a function.
   * In this case, we are overriding the clone() function from Graph&lt;V, E&gt;.
   * The clone() function returns a new graph that is an exact copy of the original graph.
   *
   * @return A mapgraph&lt;v, e, vo, eo&gt;
   */
  override clone(): MapGraph<V, E, VO, EO> {
    const cloned = new MapGraph<V, E, VO, EO>(this.originCoord, this.bottomRight);
    cloned.vertexMap = new Map<VertexKey, VO>(this.vertexMap);
    cloned.inEdgeMap = new Map<VO, EO[]>(this.inEdgeMap);
    cloned.outEdgeMap = new Map<VO, EO[]>(this.outEdgeMap);
    return cloned;
  }
}
