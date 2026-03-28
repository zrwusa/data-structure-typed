[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / UndirectedGraph

# Class: UndirectedGraph\<V, E, VO, EO\>

Defined in: [data-structures/graph/undirected-graph.ts:138](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L138)

Undirected graph implementation.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// basic UndirectedGraph vertex and edge creation
 // Create a simple undirected graph
    const graph = new UndirectedGraph<string>();

    // Add vertices
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');

    // Verify vertices exist
    console.log(graph.hasVertex('A')); // true;
    console.log(graph.hasVertex('B')); // true;
    console.log(graph.hasVertex('E')); // false;

    // Check vertex count
    console.log(graph.size); // 4;
```

```ts
// UndirectedGraph edge operations (bidirectional)
 const graph = new UndirectedGraph<string>();

    // Add vertices
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    // Add undirected edges (both directions automatically)
    graph.addEdge('A', 'B', 1);
    graph.addEdge('B', 'C', 2);
    graph.addEdge('A', 'C', 3);

    // Verify edges exist in both directions
    console.log(graph.hasEdge('A', 'B')); // true;
    console.log(graph.hasEdge('B', 'A')); // true; // Bidirectional!

    console.log(graph.hasEdge('C', 'B')); // true;
    console.log(graph.hasEdge('B', 'C')); // true; // Bidirectional!

    // Get neighbors of A
    const neighborsA = graph.getNeighbors('A');
    console.log(neighborsA[0].key); // 'B';
    console.log(neighborsA[1].key); // 'C';
```

```ts
// UndirectedGraph for social network connectivity analysis
 interface Person {
      id: number;
      name: string;
      location: string;
    }

    // UndirectedGraph is perfect for modeling symmetric relationships
    // (friendships, collaborations, partnerships)
    const socialNetwork = new UndirectedGraph<number, Person>();

    // Add people as vertices
    const people: [number, Person][] = [
      [1, { id: 1, name: 'Alice', location: 'New York' }],
      [2, { id: 2, name: 'Bob', location: 'San Francisco' }],
      [3, { id: 3, name: 'Charlie', location: 'Boston' }],
      [4, { id: 4, name: 'Diana', location: 'New York' }],
      [5, { id: 5, name: 'Eve', location: 'Seattle' }]
    ];

    for (const [id] of people) {
      socialNetwork.addVertex(id);
    }

    // Add friendships (automatically bidirectional)
    socialNetwork.addEdge(1, 2, 1); // Alice <-> Bob
    socialNetwork.addEdge(1, 3, 1); // Alice <-> Charlie
    socialNetwork.addEdge(2, 4, 1); // Bob <-> Diana
    socialNetwork.addEdge(3, 5, 1); // Charlie <-> Eve
    socialNetwork.addEdge(4, 5, 1); // Diana <-> Eve

    console.log(socialNetwork.size); // 5;

    // Find direct connections for Alice
    const aliceConnections = socialNetwork.getNeighbors(1);
    console.log(aliceConnections[0].key); // 2;
    console.log(aliceConnections[1].key); // 3;
    console.log(aliceConnections.length); // 2;

    // Verify bidirectional connections
    console.log(socialNetwork.hasEdge(1, 2)); // true;
    console.log(socialNetwork.hasEdge(2, 1)); // true; // Friendship works both ways!

    // Remove a person from network
    socialNetwork.deleteVertex(2); // Bob leaves
    console.log(socialNetwork.hasVertex(2)); // false;
    console.log(socialNetwork.size); // 4;

    // Alice loses Bob as a friend
    const updatedAliceConnections = socialNetwork.getNeighbors(1);
    console.log(updatedAliceConnections[0].key); // 3;
    console.log(updatedAliceConnections[1]); // undefined;

    // Diana loses Bob as a friend
    const dianaConnections = socialNetwork.getNeighbors(4);
    console.log(dianaConnections[0].key); // 5;
    console.log(dianaConnections[1]); // undefined;
```

## Extends

- [`AbstractGraph`](AbstractGraph.md)\<`V`, `E`, `VO`, `EO`\>

## Type Parameters

### V

`V` = `any`

Vertex value type.

### E

`E` = `any`

Edge value type.

### VO

`VO` *extends* [`UndirectedVertex`](UndirectedVertex.md)\<`V`\> = [`UndirectedVertex`](UndirectedVertex.md)\<`V`\>

Concrete vertex class (extends AbstractVertex&lt;V&gt;).

### EO

`EO` *extends* [`UndirectedEdge`](UndirectedEdge.md)\<`E`\> = [`UndirectedEdge`](UndirectedEdge.md)\<`E`\>

Concrete edge class (extends AbstractEdge&lt;E&gt;).

## Implements

- `IGraph`\<`V`, `E`, `VO`, `EO`\>

## Constructors

### Constructor

```ts
new UndirectedGraph<V, E, VO, EO>(options?): UndirectedGraph<V, E, VO, EO>;
```

Defined in: [data-structures/graph/undirected-graph.ts:152](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L152)

Construct an undirected graph with runtime defaults.

#### Parameters

##### options?

`Partial`\<`GraphOptions`\<`V`\>\>

`GraphOptions<V>` (e.g. `vertexValueInitializer`, `defaultEdgeWeight`).

#### Returns

`UndirectedGraph`\<`V`, `E`, `VO`, `EO`\>

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`constructor`](AbstractGraph.md#constructor)

## Accessors

### \_edgeConnector

#### Get Signature

```ts
get protected _edgeConnector(): string;
```

Defined in: [data-structures/graph/abstract-graph.ts:1087](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1087)

The edge connector string used in visual output.
Override in subclasses (e.g., '--' for undirected, '->' for directed).

##### Returns

`string`

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_edgeConnector`](AbstractGraph.md#edgeconnector)

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/graph/abstract-graph.ts:89](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L89)

Total number of entries.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Entry count.

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`size`](AbstractGraph.md#size)

## Methods

### \_addEdge()

```ts
protected _addEdge(edge): boolean;
```

Defined in: [data-structures/graph/undirected-graph.ts:968](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L968)

Internal hook to attach an undirected edge into adjacency maps.

#### Parameters

##### edge

`EO`

Edge instance.

#### Returns

`boolean`

`true` if both endpoints exist; otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`_addEdge`](AbstractGraph.md#addedge)

***

### \_addVertex()

```ts
protected _addVertex(newVertex): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:1054](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1054)

Insert a pre-built vertex into the graph.

#### Parameters

##### newVertex

`VO`

Concrete vertex instance.

#### Returns

`boolean`

`true` if inserted; `false` if key already exists.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_addVertex`](AbstractGraph.md#addvertex)

***

### \_createInstance()

```ts
protected _createInstance(_options?): this;
```

Defined in: [data-structures/graph/abstract-graph.ts:987](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L987)

Create an empty graph instance of the same concrete species.

#### Parameters

##### \_options?

`Partial`\<`Record`\<`string`, `unknown`\>\>

Snapshot options from `_snapshotOptions()`.

#### Returns

`this`

A new empty graph instance of `this` type.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_createInstance`](AbstractGraph.md#createinstance)

***

### \_createLike()

```ts
protected _createLike(iter?, options?): this;
```

Defined in: [data-structures/graph/abstract-graph.ts:1009](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1009)

Create a same-species graph populated with entries; preserves edges among kept vertices.

#### Parameters

##### iter?

`Iterable`\<\[`VertexKey`, `V` \| `undefined`\], `any`, `any`\>

Optional entries to seed the new graph.

##### options?

`Partial`\<`Record`\<`string`, `unknown`\>\>

Snapshot options.

#### Returns

`this`

A new graph of `this` type.

#### Remarks

Time O(V + E), Space O(V + E)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_createLike`](AbstractGraph.md#createlike)

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/graph/abstract-graph.ts:958](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L958)

Internal iterator over `[key, value]` entries in insertion order.

#### Returns

`IterableIterator`\<\[`VertexKey`, `V` \| `undefined`\]\>

Iterator of `[VertexKey, V | undefined]`.

#### Remarks

Time O(V), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_getIterator`](AbstractGraph.md#getiterator)

***

### \_getVertex()

```ts
protected _getVertex(vertexOrKey): VO | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:1068](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1068)

Resolve a vertex key or instance to the concrete vertex instance.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex key or existing vertex.

#### Returns

`VO` \| `undefined`

Vertex instance or `undefined`.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_getVertex`](AbstractGraph.md#getvertex)

***

### \_getVertexKey()

```ts
protected _getVertexKey(vertexOrKey): VertexKey;
```

Defined in: [data-structures/graph/abstract-graph.ts:1079](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1079)

Resolve a vertex key from a key or vertex instance.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex key or existing vertex.

#### Returns

`VertexKey`

The vertex key.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_getVertexKey`](AbstractGraph.md#getvertexkey)

***

### \_snapshotOptions()

```ts
protected _snapshotOptions(): Record<string, unknown>;
```

Defined in: [data-structures/graph/abstract-graph.ts:973](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L973)

Capture configuration needed to reproduce the current graph.

#### Returns

`Record`\<`string`, `unknown`\>

Options bag (opaque to callers).

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`_snapshotOptions`](AbstractGraph.md#snapshotoptions)

***

### \[iterator\]()

```ts
iterator: IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L22)

Default iterator yielding `[key, value]` entries.

#### Parameters

##### args

...`any`[]

#### Returns

`IterableIterator`\<\[`VertexKey`, `V` \| `undefined`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n) to iterate, Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`[iterator]`](AbstractGraph.md#iterator)

***

### addEdge()

Add an edge by instance or by `(src, dest, weight?, value?)`.

#### Param

Edge instance or source vertex/key.

#### Param

Destination vertex/key (when adding by pair).

#### Param

Edge weight.

#### Param

Edge payload.

#### Remarks

Time O(1) avg, Space O(1)

#### Call Signature

```ts
addEdge(edge): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:254](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L254)

##### Parameters

###### edge

`EO`

##### Returns

`boolean`

##### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 3);
console.log(g.hasEdge('A', 'B')); // true
console.log(g.hasEdge('B', 'A')); // true
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addEdge`](AbstractGraph.md#addedge)

#### Call Signature

```ts
addEdge(
   src, 
   dest, 
   weight?, 
   value?): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:256](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L256)

##### Parameters

###### src

`VertexKey` \| `VO`

###### dest

`VertexKey` \| `VO`

###### weight?

`number`

###### value?

`E`

##### Returns

`boolean`

##### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 3);
console.log(g.hasEdge('A', 'B')); // true
console.log(g.hasEdge('B', 'A')); // true
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addEdge`](AbstractGraph.md#addedge)

***

### addVertex()

Add a vertex by key/value or by pre-built vertex.

#### Param

Vertex key or existing vertex instance.

#### Param

Optional payload.

#### Remarks

Time O(1) avg, Space O(1)

#### Call Signature

```ts
addVertex(vertex): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:189](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L189)

##### Parameters

###### vertex

`VO`

##### Returns

`boolean`

##### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
console.log(g.hasVertex('A')); // true
```

##### Implementation of

```ts
IGraph.addVertex
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addVertex`](AbstractGraph.md#addvertex)

#### Call Signature

```ts
addVertex(key, value?): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:191](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L191)

##### Parameters

###### key

`VertexKey`

###### value?

`V`

##### Returns

`boolean`

##### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
console.log(g.hasVertex('A')); // true
```

##### Implementation of

```ts
IGraph.addVertex
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addVertex`](AbstractGraph.md#addvertex)

***

### bellmanFord()

```ts
bellmanFord(
   src, 
   scanNegativeCycle?, 
   getMin?, 
   genPath?): object;
```

Defined in: [data-structures/graph/abstract-graph.ts:705](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L705)

Bellman-Ford single-source shortest paths with option to scan negative cycles.

#### Parameters

##### src

`VertexKey` \| `VO`

Source vertex or key.

##### scanNegativeCycle?

`boolean`

If `true`, also detect negative cycles.

##### getMin?

`boolean`

If `true`, compute global minimum distance.

##### genPath?

`boolean`

If `true`, generate path arrays via predecessor map.

#### Returns

`object`

Result bag including distances, predecessors, and optional cycle flag.

##### distMap

```ts
distMap: Map<VO, number>;
```

##### hasNegativeCycle

```ts
hasNegativeCycle: boolean | undefined;
```

##### min

```ts
min: number;
```

##### minPath

```ts
minPath: VO[];
```

##### paths

```ts
paths: VO[][];
```

##### preMap

```ts
preMap: Map<VO, VO>;
```

#### Remarks

Time O(V * E), Space O(V + E)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 2);
    const result = g.bellmanFord('A');
console.log(result?.distMap.get(g.getVertex('C')!)); // 3
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`bellmanFord`](AbstractGraph.md#bellmanford)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/graph/undirected-graph.ts:627](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L627)

Remove all vertices and edges.

#### Returns

`void`

#### Remarks

Time O(V + E), Space O(1)

#### Implementation of

```ts
IGraph.clear
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`clear`](AbstractGraph.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/graph/undirected-graph.ts:637](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L637)

Deep clone as the same concrete class.

#### Returns

`this`

A new graph of the same concrete class (`this` type).

#### Remarks

Time O(V + E), Space O(V + E)

#### Implementation of

```ts
IGraph.clone
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`clone`](AbstractGraph.md#clone)

***

### createEdge()

```ts
createEdge(
   v1, 
   v2, 
   weight?, 
   value?): EO;
```

Defined in: [data-structures/graph/undirected-graph.ts:219](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L219)

Create an undirected edge instance. Does not insert into the graph.

#### Parameters

##### v1

`VertexKey`

One endpoint key.

##### v2

`VertexKey`

The other endpoint key.

##### weight?

`number`

Edge weight; defaults to `defaultEdgeWeight`.

##### value?

`EO`\[`"value"`\]

Edge payload.

#### Returns

`EO`

Concrete edge instance.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IGraph.createEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`createEdge`](AbstractGraph.md#createedge)

***

### createVertex()

```ts
createVertex(key, value?): VO;
```

Defined in: [data-structures/graph/undirected-graph.ts:206](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L206)

Create an undirected vertex instance. Does not insert into the graph.

#### Parameters

##### key

`VertexKey`

Vertex identifier.

##### value?

`VO`\[`"value"`\]

Optional payload.

#### Returns

`VO`

Concrete vertex instance.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IGraph.createVertex
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`createVertex`](AbstractGraph.md#createvertex)

***

### degreeOf()

```ts
degreeOf(vertexOrKey): number;
```

Defined in: [data-structures/graph/undirected-graph.ts:455](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L455)

Degree of a vertex (# of incident undirected edges).

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`number`

Non-negative integer.

#### Remarks

Time O(1) avg, Space O(1)

#### Implementation of

```ts
IGraph.degreeOf
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`degreeOf`](AbstractGraph.md#degreeof)

***

### deleteEdge()

```ts
deleteEdge(edgeOrOneSideVertexKey, otherSideVertexKey?): EO | undefined;
```

Defined in: [data-structures/graph/undirected-graph.ts:358](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L358)

Delete an edge by instance or by a pair of keys.

#### Parameters

##### edgeOrOneSideVertexKey

`VertexKey` \| `EO`

Edge instance or one endpoint vertex/key.

##### otherSideVertexKey?

`VertexKey`

Required second endpoint when deleting by pair.

#### Returns

`EO` \| `undefined`

Removed edge or `undefined`.

#### Remarks

Time O(1) avg, Space O(1)

 *

#### Example

```ts
const graph = new UndirectedGraph<string>();

    // Build a simple undirected graph
    graph.addVertex('X');
    graph.addVertex('Y');
    graph.addVertex('Z');
    graph.addEdge('X', 'Y', 1);
    graph.addEdge('Y', 'Z', 2);
    graph.addEdge('X', 'Z', 3);

    // Delete an edge
    graph.deleteEdge('X', 'Y');
console.log(graph.hasEdge('X', 'Y')); // false

    // Bidirectional deletion confirmed
console.log(graph.hasEdge('Y', 'X')); // false

    // Other edges should remain
console.log(graph.hasEdge('Y', 'Z')); // true
console.log(graph.hasEdge('Z', 'Y')); // true

    // Delete a vertex
    graph.deleteVertex('Y');
console.log(graph.hasVertex('Y')); // false
console.log(graph.size); // 2
```

#### Implementation of

```ts
IGraph.deleteEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`deleteEdge`](AbstractGraph.md#deleteedge)

***

### deleteEdgeBetween()

```ts
deleteEdgeBetween(v1, v2): EO | undefined;
```

Defined in: [data-structures/graph/undirected-graph.ts:280](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L280)

Delete a single undirected edge between two vertices.

#### Parameters

##### v1

`VertexKey` \| `VO`

One vertex or key.

##### v2

`VertexKey` \| `VO`

The other vertex or key.

#### Returns

`EO` \| `undefined`

Removed edge or `undefined`.

#### Remarks

Time O(1) avg, Space O(1)

***

### deleteVertex()

```ts
deleteVertex(vertexOrKey): boolean;
```

Defined in: [data-structures/graph/undirected-graph.ts:414](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L414)

Delete a vertex and remove it from all neighbor lists.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`boolean`

`true` if removed; otherwise `false`.

#### Remarks

Time O(deg), Space O(1)

 *

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B');
    g.deleteVertex('A');
console.log(g.hasVertex('A')); // false
```

#### Implementation of

```ts
IGraph.deleteVertex
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`deleteVertex`](AbstractGraph.md#deletevertex)

***

### dijkstraWithoutHeap()

```ts
dijkstraWithoutHeap(
   src, 
   dest?, 
   getMinDist?, 
genPaths?): DijkstraResult<VO>;
```

Defined in: [data-structures/graph/abstract-graph.ts:484](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L484)

Dijkstra without heap (array-based selection).

#### Parameters

##### src

`VertexKey` \| `VO`

Source vertex or key.

##### dest?

`VertexKey` \| `VO` \| `undefined`

Optional destination for early stop.

##### getMinDist?

`boolean` = `false`

If `true`, compute global minimum distance.

##### genPaths?

`boolean` = `false`

If `true`, also generate path arrays.

#### Returns

`DijkstraResult`\<`VO`\>

Result bag or `undefined` if source missing.

#### Remarks

Time O(V^2 + E), Space O(V + E)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`dijkstraWithoutHeap`](AbstractGraph.md#dijkstrawithoutheap)

***

### edgeSet()

```ts
edgeSet(): EO[];
```

Defined in: [data-structures/graph/undirected-graph.ts:512](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L512)

Unique set of undirected edges across endpoints.

#### Returns

`EO`[]

Array of edges.

#### Remarks

Time O(E), Space O(E)

 *

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B');
console.log(g.edgeSet().length); // 1
```

#### Implementation of

```ts
IGraph.edgeSet
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`edgeSet`](AbstractGraph.md#edgeset)

***

### edgesOf()

```ts
edgesOf(vertexOrKey): EO[];
```

Defined in: [data-structures/graph/undirected-graph.ts:470](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L470)

Incident undirected edges of a vertex.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`EO`[]

Array of incident edges.

#### Remarks

Time O(deg), Space O(deg)

#### Implementation of

```ts
IGraph.edgesOf
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`edgesOf`](AbstractGraph.md#edgesof)

***

### entries()

```ts
entries(): IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:31](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L31)

Iterate over `[key, value]` pairs (may yield `undefined` values).

#### Returns

`IterableIterator`\<\[`VertexKey`, `V` \| `undefined`\]\>

Iterator of `[K, V | undefined]`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`entries`](AbstractGraph.md#entries)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:66](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L66)

Test whether all entries satisfy the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if all pass; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`every`](AbstractGraph.md#every)

***

### filter()

```ts
filter(predicate, thisArg?): this;
```

Defined in: [data-structures/graph/abstract-graph.ts:897](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L897)

Induced-subgraph filter: keep vertices where `predicate(key, value)` is true,
and only keep edges whose endpoints both survive.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`this`

A new graph of the same concrete class (`this` type).

#### Remarks

Time O(V + E), Space O(V + E)

#### Implementation of

```ts
IGraph.filter
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`filter`](AbstractGraph.md#filter)

***

### filterEntries()

```ts
filterEntries(predicate, thisArg?): [VertexKey, V | undefined][];
```

Defined in: [data-structures/graph/abstract-graph.ts:913](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L913)

Preserve the old behavior: return filtered entries as an array.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

##### thisArg?

`any`

#### Returns

\[`VertexKey`, `V` \| `undefined`\][]

#### Remarks

Time O(V), Space O(V)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`filterEntries`](AbstractGraph.md#filterentries)

***

### find()

```ts
find(callbackfn, thisArg?): [VertexKey, V | undefined] | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L114)

Find the first entry that matches a predicate.

#### Parameters

##### callbackfn

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

\[`VertexKey`, `V` \| `undefined`\] \| `undefined`

Matching `[key, value]` or `undefined`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`find`](AbstractGraph.md#find)

***

### floydWarshall()

```ts
floydWarshall(): object;
```

Defined in: [data-structures/graph/abstract-graph.ts:798](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L798)

Floyd–Warshall all-pairs shortest paths.

#### Returns

`object`

`{ costs, predecessor }` matrices.

##### costs

```ts
costs: number[][];
```

##### predecessor

```ts
predecessor: (VO | undefined)[][];
```

#### Remarks

Time O(V^3), Space O(V^2)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 2);
    const { costs } = g.floydWarshall(); // costs is number[][]
console.log(costs.length); // 3
    const flatCosts = costs.flat().filter(c => c !== Infinity && c > 0);
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`floydWarshall`](AbstractGraph.md#floydwarshall)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L99)

Visit each entry, left-to-right.

#### Parameters

##### callbackfn

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `void`\>

`(key, value, index, self) => void`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`void`

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`forEach`](AbstractGraph.md#foreach)

***

### get()

```ts
get(key): V | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:156](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L156)

Get the value under a key.

#### Parameters

##### key

`VertexKey`

Key to look up.

#### Returns

`V` \| `undefined`

Value or `undefined`.

#### Remarks

Time O(n) generic, Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`get`](AbstractGraph.md#get)

***

### getAllPathsBetween()

```ts
getAllPathsBetween(
   v1, 
   v2, 
   limit?): VO[][];
```

Defined in: [data-structures/graph/abstract-graph.ts:309](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L309)

Enumerate simple paths up to a limit.

#### Parameters

##### v1

`VertexKey` \| `VO`

Source vertex or key.

##### v2

`VertexKey` \| `VO`

Destination vertex or key.

##### limit?

`number` = `1000`

Maximum number of paths to collect.

#### Returns

`VO`[][]

Array of paths (each path is an array of vertices).

#### Remarks

Time O(paths) worst-case exponential, Space O(V + paths)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');
    g.addEdge('B', 'C');
    const paths = g.getAllPathsBetween('A', 'C');
console.log(paths.length); // 2
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getAllPathsBetween`](AbstractGraph.md#getallpathsbetween)

***

### getBiconnectedComponents()

```ts
getBiconnectedComponents(): EO[][];
```

Defined in: [data-structures/graph/undirected-graph.ts:742](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L742)

Find biconnected components using edge-stack Tarjan variant.
A biconnected component is a maximal biconnected subgraph.

#### Returns

`EO`[][]

Array of edge arrays, each representing a biconnected component.

#### Remarks

Time O(V + E), Space O(V + E)

***

### getBridges()

```ts
getBridges(): EO[];
```

Defined in: [data-structures/graph/undirected-graph.ts:899](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L899)

Get bridges discovered by `tarjan()`.

#### Returns

`EO`[]

Array of edges that are bridges.

#### Remarks

Time O(B), Space O(1)

 *

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    const bridges = g.getBridges();
console.log(bridges.length); // 2
```

***

### getCutVertices()

```ts
getCutVertices(): VO[];
```

Defined in: [data-structures/graph/undirected-graph.ts:940](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L940)

Get articulation points discovered by `tarjan()`.

#### Returns

`VO`[]

Array of cut vertices.

#### Remarks

Time O(C), Space O(1)

 *

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    const cuts = g.getCutVertices();
console.log(cuts.length); // 1
console.log(cuts[0].key); // 'B'
```

***

### getCycles()

```ts
getCycles(isInclude2Cycle?): VertexKey[][];
```

Defined in: [data-structures/graph/abstract-graph.ts:838](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L838)

Enumerate simple cycles (may be expensive).

#### Parameters

##### isInclude2Cycle?

`boolean` = `false`

If `true`, include 2-cycles when graph semantics allow.

#### Returns

`VertexKey`[][]

Array of cycles (each as array of vertex keys).

#### Remarks

Time exponential in worst-case, Space O(V + E)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex(1);
    g.addVertex(2);
    g.addVertex(3);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 1);
console.log(g.getCycles().length); // > 0
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getCycles`](AbstractGraph.md#getcycles)

***

### getDFNMap()

```ts
getDFNMap(): Map<VO, number>;
```

Defined in: [data-structures/graph/undirected-graph.ts:949](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L949)

DFN index map computed by `tarjan()`.

#### Returns

`Map`\<`VO`, `number`\>

Map from vertex to DFN index.

#### Remarks

Time O(V), Space O(V)

***

### getEdge()

```ts
getEdge(v1, v2): EO | undefined;
```

Defined in: [data-structures/graph/undirected-graph.ts:258](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L258)

Get an undirected edge between two vertices, if present.

#### Parameters

##### v1

`VertexKey` \| `VO` \| `undefined`

One vertex or key.

##### v2

`VertexKey` \| `VO` \| `undefined`

The other vertex or key.

#### Returns

`EO` \| `undefined`

Edge instance or `undefined`.

#### Remarks

Time O(1) avg, Space O(1)

 *

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 7);
console.log(g.getEdge('A', 'B')?.weight); // 7
```

#### Implementation of

```ts
IGraph.getEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`getEdge`](AbstractGraph.md#getedge)

***

### getEndsOfEdge()

```ts
getEndsOfEdge(edge): [VO, VO] | undefined;
```

Defined in: [data-structures/graph/undirected-graph.ts:602](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L602)

Resolve an edge's two endpoints to vertex instances.

#### Parameters

##### edge

`EO`

Edge instance.

#### Returns

\[`VO`, `VO`\] \| `undefined`

`[v1, v2]` or `undefined` if either endpoint is missing.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IGraph.getEndsOfEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`getEndsOfEdge`](AbstractGraph.md#getendsofedge)

***

### getLowMap()

```ts
getLowMap(): Map<VO, number>;
```

Defined in: [data-structures/graph/undirected-graph.ts:958](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L958)

LOW link map computed by `tarjan()`.

#### Returns

`Map`\<`VO`, `number`\>

Map from vertex to LOW value.

#### Remarks

Time O(V), Space O(V)

***

### getMinCostBetween()

```ts
getMinCostBetween(
   v1, 
   v2, 
   isWeight?): number | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:362](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L362)

Minimum hops/weight between two vertices.

#### Parameters

##### v1

`VertexKey` \| `VO`

Source vertex or key.

##### v2

`VertexKey` \| `VO`

Destination vertex or key.

##### isWeight?

`boolean`

If `true`, compare by path weight; otherwise by hop count.

#### Returns

`number` \| `undefined`

Minimum cost or `undefined` if missing/unreachable.

#### Remarks

Time O((V + E) log V) weighted / O(V + E) unweighted, Space O(V + E)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getMinCostBetween`](AbstractGraph.md#getmincostbetween)

***

### getMinPathBetween()

```ts
getMinPathBetween(
   v1, 
   v2, 
   isWeight?, 
   isDFS?): VO[] | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:415](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L415)

Minimum path (as vertex sequence) between two vertices.

#### Parameters

##### v1

`VertexKey` \| `VO`

Source vertex or key.

##### v2

`VertexKey` \| `VO`

Destination vertex or key.

##### isWeight?

`boolean`

If `true`, compare by path weight; otherwise by hop count.

##### isDFS?

`boolean` = `false`

For weighted mode only: if `true`, brute-force all paths; if `false`, use Dijkstra.

#### Returns

`VO`[] \| `undefined`

Vertex sequence, or `undefined`/empty when unreachable depending on branch.

#### Remarks

Time O((V + E) log V) weighted / O(V + E) unweighted, Space O(V + E)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 1);
    g.addEdge('A', 'C', 10);
    const path = g.getMinPathBetween('A', 'C');
console.log(path?.length); // 3
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getMinPathBetween`](AbstractGraph.md#getminpathbetween)

***

### getNeighbors()

```ts
getNeighbors(vertexOrKey): VO[];
```

Defined in: [data-structures/graph/undirected-graph.ts:581](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L581)

UndirectedGraph connectivity and neighbors

 *

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

#### Returns

`VO`[]

#### Example

```ts
const graph = new UndirectedGraph<string>();

    // Build a friendship network
    const people = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    for (const person of people) {
      graph.addVertex(person);
    }

    // Add friendships (undirected edges)
    graph.addEdge('Alice', 'Bob', 1);
    graph.addEdge('Alice', 'Charlie', 1);
    graph.addEdge('Bob', 'Diana', 1);
    graph.addEdge('Charlie', 'Eve', 1);
    graph.addEdge('Diana', 'Eve', 1);

    // Get friends of each person
    const aliceFriends = graph.getNeighbors('Alice');
console.log(aliceFriends[0].key); // 'Bob'
console.log(aliceFriends[1].key); // 'Charlie'
console.log(aliceFriends.length); // 2

    const dianaFriends = graph.getNeighbors('Diana');
console.log(dianaFriends[0].key); // 'Bob'
console.log(dianaFriends[1].key); // 'Eve'
console.log(dianaFriends.length); // 2

    // Verify bidirectional friendship
    const bobFriends = graph.getNeighbors('Bob');
console.log(bobFriends[0].key); // 'Alice'
console.log(bobFriends[1].key); // 'Diana'
```

#### Implementation of

```ts
IGraph.getNeighbors
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`getNeighbors`](AbstractGraph.md#getneighbors)

***

### getPathSumWeight()

```ts
getPathSumWeight(path): number;
```

Defined in: [data-structures/graph/abstract-graph.ts:346](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L346)

Sum the weights along a vertex path.

#### Parameters

##### path

`VO`[]

Sequence of vertices.

#### Returns

`number`

Path weight sum (0 if empty or edge missing).

#### Remarks

Time O(L), Space O(1) where L is path length

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getPathSumWeight`](AbstractGraph.md#getpathsumweight)

***

### getVertex()

```ts
getVertex(vertexKey): VO | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:175](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L175)

Get vertex instance by key.

#### Parameters

##### vertexKey

`VertexKey`

Vertex key.

#### Returns

`VO` \| `undefined`

Vertex instance or `undefined`.

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('X');
console.log(g.getVertex('X')?.key); // 'X'
```

#### Implementation of

```ts
IGraph.getVertex
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getVertex`](AbstractGraph.md#getvertex)

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:129](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L129)

Whether the given key exists.

#### Parameters

##### key

`VertexKey`

Key to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n) generic, Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`has`](AbstractGraph.md#has)

***

### hasCycle()

```ts
hasCycle(): boolean;
```

Defined in: [data-structures/graph/undirected-graph.ts:840](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L840)

Detect whether the graph contains a cycle.
Uses DFS with parent tracking.

#### Returns

`boolean`

`true` if a cycle exists, `false` otherwise.

#### Remarks

Time O(V + E), Space O(V)

 *

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
console.log(g.hasCycle()); // false
    g.addEdge('C', 'A');
console.log(g.hasCycle()); // true
```

***

### hasEdge()

```ts
hasEdge(v1, v2): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:249](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L249)

Whether an edge exists between two vertices.

#### Parameters

##### v1

`VertexKey` \| `VO`

Endpoint A vertex or key.

##### v2

`VertexKey` \| `VO`

Endpoint B vertex or key.

#### Returns

`boolean`

`true` if present; otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B');
console.log(g.hasEdge('A', 'B')); // true
console.log(g.hasEdge('B', 'A')); // true
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`hasEdge`](AbstractGraph.md#hasedge)

***

### hasValue()

```ts
hasValue(value): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:143](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L143)

Whether there exists an entry with the given value.

#### Parameters

##### value

`V` \| `undefined`

Value to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`hasValue`](AbstractGraph.md#hasvalue)

***

### hasVertex()

```ts
hasVertex(vertexOrKey): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:185](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L185)

Whether a vertex exists.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`boolean`

`true` if present, otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
console.log(g.hasVertex('A')); // true
console.log(g.hasVertex('Z')); // false
```

#### Implementation of

```ts
IGraph.hasVertex
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`hasVertex`](AbstractGraph.md#hasvertex)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/graph/undirected-graph.ts:619](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L619)

Whether the graph has no vertices and no edges.

#### Returns

`boolean`

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IGraph.isEmpty
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`isEmpty`](AbstractGraph.md#isempty)

***

### isVertexKey()

```ts
isVertexKey(potentialKey): potentialKey is VertexKey;
```

Defined in: [data-structures/graph/abstract-graph.ts:215](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L215)

Type guard: check if a value is a valid vertex key.

#### Parameters

##### potentialKey

`any`

Value to test.

#### Returns

`potentialKey is VertexKey`

`true` if string/number; else `false`.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`isVertexKey`](AbstractGraph.md#isvertexkey)

***

### keys()

```ts
keys(): IterableIterator<VertexKey>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:42](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L42)

Iterate over keys only.

#### Returns

`IterableIterator`\<`VertexKey`\>

Iterator of keys.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`keys`](AbstractGraph.md#keys)

***

### map()

```ts
map<T>(callback, thisArg?): T[];
```

Defined in: [data-structures/graph/abstract-graph.ts:928](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L928)

Map entries using an implementation-specific strategy.

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `T`\>

##### thisArg?

`any`

#### Returns

`T`[]

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`map`](AbstractGraph.md#map)

***

### print()

```ts
print(options?): void;
```

Defined in: [data-structures/graph/abstract-graph.ts:1183](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1183)

Print the graph to console.

#### Parameters

##### options?

Display settings passed to `toVisual`.

###### showWeight?

`boolean`

#### Returns

`void`

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`print`](AbstractGraph.md#print)

***

### reduce()

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-entry-base.ts:171](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L171)

Reduce entries into a single accumulator.

#### Type Parameters

##### U

`U`

#### Parameters

##### callbackfn

`ReduceEntryCallback`\<`VertexKey`, `V` \| `undefined`, `U`\>

`(acc, value, key, index, self) => acc`.

##### initialValue

`U`

Initial accumulator.

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`reduce`](AbstractGraph.md#reduce)

***

### removeManyVertices()

```ts
removeManyVertices(vertexMap): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:234](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L234)

Delete multiple vertices.

#### Parameters

##### vertexMap

`VertexKey`[] \| `VO`[]

Array of vertices or keys.

#### Returns

`boolean`

`true` if any vertex was removed.

#### Remarks

Time O(sum(deg)), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`removeManyVertices`](AbstractGraph.md#removemanyvertices)

***

### setEdgeWeight()

```ts
setEdgeWeight(
   srcOrKey, 
   destOrKey, 
   weight): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:291](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L291)

Set the weight of an existing edge.

#### Parameters

##### srcOrKey

`VertexKey` \| `VO`

Source vertex or key.

##### destOrKey

`VertexKey` \| `VO`

Destination vertex or key.

##### weight

`number`

New weight.

#### Returns

`boolean`

`true` if updated; otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`setEdgeWeight`](AbstractGraph.md#setedgeweight)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:83](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L83)

Test whether any entry satisfies the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if any passes; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`some`](AbstractGraph.md#some)

***

### tarjan()

```ts
tarjan(): object;
```

Defined in: [data-structures/graph/undirected-graph.ts:677](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L677)

Tarjan-based bridge and articulation point detection.

#### Returns

`object`

`{ dfnMap, lowMap, bridges, cutVertices }`.

##### bridges

```ts
bridges: EO[];
```

##### cutVertices

```ts
cutVertices: VO[];
```

##### dfnMap

```ts
dfnMap: Map<VO, number>;
```

##### lowMap

```ts
lowMap: Map<VO, number>;
```

#### Remarks

Time O(V + E), Space O(V + E)

 *

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    const result = g.tarjan();
```

***

### toArray()

```ts
toArray(): [VertexKey, V | undefined][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`VertexKey`, `V` \| `undefined`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`toArray`](AbstractGraph.md#toarray)

***

### toDot()

```ts
toDot(options?): string;
```

Defined in: [data-structures/graph/abstract-graph.ts:1143](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1143)

Generate DOT language representation for Graphviz.

#### Parameters

##### options?

Optional display settings.

###### name?

`string`

Graph name (default: 'G').

###### showWeight?

`boolean`

Whether to label edges with weight (default: true).

#### Returns

`string`

DOT format string.

#### Example

```ts
const g = new UndirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B');
    const dot = g.toDot();
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`toDot`](AbstractGraph.md#todot)

***

### toVisual()

```ts
toVisual(options?): string;
```

Defined in: [data-structures/graph/abstract-graph.ts:1108](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1108)

Generate a text-based visual representation of the graph.

**Adjacency list format:**
```
Graph (5 vertices, 6 edges):
A -> B (1), C (2)
B -> D (3)
C -> (no outgoing edges)
D -> A (1)
E (isolated)
```

#### Parameters

##### options?

Optional display settings.

###### showWeight?

`boolean`

Whether to show edge weights (default: true).

#### Returns

`string`

The visual string.

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`toVisual`](AbstractGraph.md#tovisual)

***

### values()

```ts
values(): IterableIterator<V | undefined>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:53](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L53)

Iterate over values only.

#### Returns

`IterableIterator`\<`V` \| `undefined`\>

Iterator of values.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`values`](AbstractGraph.md#values)

***

### fromEntries()

```ts
static fromEntries<V>(entries): UndirectedGraph<V, undefined, UndirectedVertex<V>, UndirectedEdge<undefined>>;
```

Defined in: [data-structures/graph/undirected-graph.ts:191](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L191)

Construct an undirected graph from `[key, value]` entries.

#### Type Parameters

##### V

`V`

Vertex value type.

#### Parameters

##### entries

`Iterable`\<\[`VertexKey`, `V`\]\>

Iterable of `[key, value]` pairs.

#### Returns

`UndirectedGraph`\<`V`, `undefined`, [`UndirectedVertex`](UndirectedVertex.md)\<`V`\>, [`UndirectedEdge`](UndirectedEdge.md)\<`undefined`\>\>

UndirectedGraph with all vertices added.

#### Remarks

Time O(V), Space O(V)

***

### fromKeys()

```ts
static fromKeys<K>(keys): UndirectedGraph<K, undefined, UndirectedVertex<K>, UndirectedEdge<undefined>>;
```

Defined in: [data-structures/graph/undirected-graph.ts:174](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/undirected-graph.ts#L174)

Construct an undirected graph from keys with value initializer `v => v`.

#### Type Parameters

##### K

`K` *extends* `VertexKey`

Vertex key type.

#### Parameters

##### keys

`Iterable`\<`K`\>

Iterable of vertex keys.

#### Returns

`UndirectedGraph`\<`K`, `undefined`, [`UndirectedVertex`](UndirectedVertex.md)\<`K`\>, [`UndirectedEdge`](UndirectedEdge.md)\<`undefined`\>\>

UndirectedGraph with all keys added.

#### Remarks

Time O(V), Space O(V)
