import { MapEdge, MapGraph, MapVertex } from '../../../../src';

describe('classic use', () => {
  it('@example City navigation with shortest path', () => {
    const map = new MapGraph([0, 0], [10, 10]);

    map.addVertex(new MapVertex('Home', '', 0, 0));
    map.addVertex(new MapVertex('Office', '', 3, 4));
    map.addVertex(new MapVertex('Cafe', '', 1, 2));
    map.addVertex(new MapVertex('Park', '', 2, 1));

    map.addEdge('Home', 'Cafe', 2.2);
    map.addEdge('Cafe', 'Office', 3.5);
    map.addEdge('Home', 'Park', 2.0);
    map.addEdge('Park', 'Office', 4.0);
    map.addEdge('Home', 'Office', 7.0);

    // Find shortest path
    const result = map.dijkstra('Home', 'Office', true, true);
    expect(result?.minDist).toBe(5.7); // Home → Cafe → Office
    expect(result?.minPath.map(v => v.key)).toEqual(['Home', 'Cafe', 'Office']);
  });

  it('@example Delivery route optimization', () => {
    const routes = new MapGraph([0, 0], [10, 10]);

    routes.addVertex(new MapVertex('Warehouse', '', 0, 0));
    routes.addVertex(new MapVertex('Customer A', '', 2, 3));
    routes.addVertex(new MapVertex('Customer B', '', 5, 1));
    routes.addVertex(new MapVertex('Customer C', '', 3, 5));

    routes.addEdge('Warehouse', 'Customer A', 3.6);
    routes.addEdge('Warehouse', 'Customer B', 5.1);
    routes.addEdge('Customer A', 'Customer C', 2.2);
    routes.addEdge('Customer A', 'Customer B', 3.6);
    routes.addEdge('Customer B', 'Customer C', 4.5);

    // Check outgoing neighbors of Customer A
    const neighbors = routes.getNeighbors('Customer A');
    expect(neighbors.map(n => n.key).sort()).toEqual(['Customer B', 'Customer C']);

    // Shortest path from Warehouse to Customer C
    const path = routes.getMinPathBetween('Warehouse', 'Customer C', true);
    expect(path?.map(v => v.key)).toEqual(['Warehouse', 'Customer A', 'Customer C']);
  });

  it('@example Campus map with building connections', () => {
    const campus = new MapGraph([0, 0], [5, 5]);

    campus.addVertex(new MapVertex('Library', '', 0, 0));
    campus.addVertex(new MapVertex('Lab', '', 1, 1));
    campus.addVertex(new MapVertex('Cafeteria', '', 2, 0));

    campus.addEdge('Library', 'Lab', 5);
    campus.addEdge('Lab', 'Cafeteria', 3);
    campus.addEdge('Library', 'Cafeteria', 10);

    expect(campus.hasVertex('Library')).toBe(true);
    expect(campus.hasVertex('Gym')).toBe(false);

    // Direct distance vs shortest path
    const direct = campus.dijkstra('Library', 'Cafeteria', true, true);
    expect(direct?.minDist).toBe(8); // Library → Lab → Cafeteria
  });
});

describe('MapGraph Operation Test', () => {
  let mapGraph: MapGraph;
  beforeEach(() => {
    mapGraph = new MapGraph([5.500338, 100.173665]);

    mapGraph.addVertex(new MapVertex('Surin', '', 5.466724, 100.274805));
    mapGraph.addVertex(new MapVertex('Batu Feringgi Beach', '', 5.475141, 100.27667));
    mapGraph.addVertex(new MapVertex('Lotus', '', 5.459044, 100.308767));
    mapGraph.addVertex(new MapVertex('The Breeza', '', 5.454197, 100.307859));
    mapGraph.addVertex(new MapVertex('Hard Rock Hotel', '', 5.46785, 100.241876));
    mapGraph.addVertex(new MapVertex('Mira', '', 5.456749, 100.28665));
    mapGraph.addVertex(new MapVertex('Penang Bible Church', '', 5.428683, 100.314825));
    mapGraph.addVertex(new MapVertex('Queensbay', '', 5.33276, 100.306651));
    mapGraph.addVertex(new MapVertex('Saanen Goat Farm', '', 5.405738, 100.207699));
    mapGraph.addVertex(new MapVertex('Trinity Auto', '', 5.401126, 100.303739));
    mapGraph.addVertex(new MapVertex('Penang Airport', '', 5.293185, 100.265772));
    mapGraph.addEdge('Surin', 'Lotus', 4.7);
    mapGraph.addEdge('Lotus', 'The Breeza', 1);
    mapGraph.addEdge('Batu Feringgi Beach', 'Hard Rock Hotel', 5.2);
    mapGraph.addEdge('Surin', 'Mira', 2.8);
    mapGraph.addEdge('Mira', 'Penang Bible Church', 7.0);
    mapGraph.addEdge('Lotus', 'Penang Bible Church', 5.7);
    mapGraph.addEdge('Penang Bible Church', 'Queensbay', 13.9);
    mapGraph.addEdge('Hard Rock Hotel', 'Saanen Goat Farm', 18.5);
    mapGraph.addEdge('The Breeza', 'Trinity Auto', 9.1);
    mapGraph.addEdge('Trinity Auto', 'Saanen Goat Farm', 26.3);
    mapGraph.addEdge('The Breeza', 'Penang Airport', 24.8);
    mapGraph.addEdge('Penang Airport', 'Saanen Goat Farm', 21.2);
  });

  it('dijkstra shortest path', () => {
    const expected1 = ['Surin', 'Lotus', 'The Breeza', 'Trinity Auto', 'Saanen Goat Farm'];

    const minPathBetween = mapGraph.getMinPathBetween('Surin', 'Saanen Goat Farm');
    expect(minPathBetween?.map(v => v.key)).toEqual(expected1);
    const surinToSaanenGoatFarmDij = mapGraph.dijkstra('Surin', 'Saanen Goat Farm', true, true);
    expect(surinToSaanenGoatFarmDij?.minPath.map(v => v.key)).toEqual(expected1);
    expect(surinToSaanenGoatFarmDij?.minDist).toBe(41.1);
    mapGraph.addEdge('Surin', 'Batu Feringgi Beach', 1.5);
    const expected2 = ['Surin', 'Batu Feringgi Beach', 'Hard Rock Hotel', 'Saanen Goat Farm'];
    const minPathBetweenViaBFB = mapGraph.getMinPathBetween('Surin', 'Saanen Goat Farm', true);
    expect(minPathBetweenViaBFB?.map(v => v.key)).toEqual(expected2);
    const surinToSaanenGoatFarmViaDij = mapGraph.dijkstra('Surin', 'Saanen Goat Farm', true, true);
    expect(surinToSaanenGoatFarmViaDij?.minPath.map(v => v.key)).toEqual(expected2);
    expect(surinToSaanenGoatFarmViaDij?.minDist).toBe(25.2);
  });

  it('should clone', () => {
    const cloned = mapGraph.clone();
    const expected1 = ['Surin', 'Lotus', 'The Breeza', 'Trinity Auto', 'Saanen Goat Farm'];

    const minPathBetween = cloned.getMinPathBetween('Surin', 'Saanen Goat Farm');
    expect(minPathBetween?.map(v => v.key)).toEqual(expected1);
    const surinToSaanenGoatFarmDij = cloned.dijkstra('Surin', 'Saanen Goat Farm', true, true);
    expect(surinToSaanenGoatFarmDij?.minPath.map(v => v.key)).toEqual(expected1);
    expect(surinToSaanenGoatFarmDij?.minDist).toBe(41.1);
    cloned.addEdge('Surin', 'Batu Feringgi Beach', 1.5);
    const expected2 = ['Surin', 'Batu Feringgi Beach', 'Hard Rock Hotel', 'Saanen Goat Farm'];
    const minPathBetweenViaBFB = cloned.getMinPathBetween('Surin', 'Saanen Goat Farm', true);
    expect(minPathBetweenViaBFB?.map(v => v.key)).toEqual(expected2);
    const surinToSaanenGoatFarmViaDij = cloned.dijkstra('Surin', 'Saanen Goat Farm', true, true);
    expect(surinToSaanenGoatFarmViaDij?.minPath.map(v => v.key)).toEqual(expected2);
    expect(surinToSaanenGoatFarmViaDij?.minDist).toBe(25.2);
  });
});

describe('MapGraph', () => {
  let mapGraph: MapGraph<string, string>;

  beforeEach(() => {
    // Create a new MapGraph instance before each test
    mapGraph = new MapGraph<string, string>([0, 0], [100, 100]);
  });

  // Test adding vertexMap to the graph
  it('should add vertexMap to the graph', () => {
    const locationA = new MapVertex('A', 'Location A', 10, 20);
    const locationB = new MapVertex('B', 'Location B', 30, 40);

    mapGraph.addVertex(locationA);
    mapGraph.addVertex(locationB);

    expect(mapGraph.hasVertex('A')).toBe(true);
    expect(mapGraph.hasVertex('B')).toBe(true);
  });

  // Test adding edges to the graph
  it('should add edges to the graph', () => {
    const locationA = new MapVertex('A', 'Location A', 10, 20);
    const locationB = new MapVertex('B', 'Location B', 30, 40);
    const edgeAB = new MapEdge('A', 'B', 50, 'Edge from A to B');

    mapGraph.addVertex(locationA);
    mapGraph.addVertex(locationB);
    mapGraph.addEdge(edgeAB);

    expect(mapGraph.hasEdge('A', 'B')).toBe(true);
  });

  // Test getting neighbors of a vertex
  it('should return the neighbors of a vertex', () => {
    const locationA = new MapVertex('A', 'Location A', 10, 20);
    locationA.lat = locationA.lat;
    locationA.long = locationA.long;
    const locationB = mapGraph.createVertex('B', 'Location B', 30, 40);

    const locationC = new MapVertex('C', 'Location C', 50, 60);
    const edgeAB = new MapEdge('A', 'B', 50, 'Edge from A to B');
    const edgeBC = new MapEdge('B', 'C', 60, 'Edge from B to C');

    expect(mapGraph.originCoord).toEqual([0, 0]);
    expect(mapGraph.bottomRight).toEqual([100, 100]);

    mapGraph.addVertex(locationA);
    mapGraph.addVertex(locationB);
    mapGraph.addVertex(locationC);
    mapGraph.addEdge(edgeAB);
    mapGraph.addEdge(edgeBC);

    const neighborsOfA = mapGraph.getNeighbors('A');
    const neighborsOfB = mapGraph.getNeighbors('B');

    expect(neighborsOfA).toEqual([locationB]);
    expect(neighborsOfB).toEqual([locationC]);
  });

  // Test finding the shortest path between locations
  it('should find the shortest path between two locations', () => {
    const locationA = new MapVertex('A', 'Location A', 10, 20);
    const locationB = new MapVertex('B', 'Location B', 30, 40);
    const locationC = new MapVertex('C', 'Location C', 50, 60);
    const edgeAB = new MapEdge('A', 'B', 50, 'Edge from A to B');
    const edgeBC = new MapEdge('B', 'C', 60, 'Edge from B to C');

    mapGraph.addVertex(locationA);
    mapGraph.addVertex(locationB);
    mapGraph.addVertex(locationC);
    mapGraph.addEdge(edgeAB);
    mapGraph.addEdge(edgeBC);

    const shortestPath = mapGraph.dijkstra('A', 'C');

    expect(shortestPath?.minPath.length).toEqual(0);
    expect(shortestPath?.distMap.size).toBe(3);
  });
});
