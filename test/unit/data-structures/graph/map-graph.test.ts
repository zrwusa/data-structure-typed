import {MapGraph, MapVertex} from '../../../../src';

describe('MapGraph Operation Test', () => {
  it('dijkstra shortest path', () => {
    const mapGraph = new MapGraph([5.500338, 100.173665]);

    mapGraph.addVertex(new MapVertex('Surin', 5.466724, 100.274805));
    mapGraph.addVertex(new MapVertex('Batu Feringgi Beach', 5.475141, 100.27667));
    mapGraph.addVertex(new MapVertex('Lotus', 5.459044, 100.308767));
    mapGraph.addVertex(new MapVertex('The Breeza', 5.454197, 100.307859));
    mapGraph.addVertex(new MapVertex('Hard Rock Hotel', 5.46785, 100.241876));
    mapGraph.addVertex(new MapVertex('Mira', 5.456749, 100.28665));
    mapGraph.addVertex(new MapVertex('Penang Bible Church', 5.428683, 100.314825));
    mapGraph.addVertex(new MapVertex('Queensbay', 5.33276, 100.306651));
    mapGraph.addVertex(new MapVertex('Saanen Goat Farm', 5.405738, 100.207699));
    mapGraph.addVertex(new MapVertex('Trinity Auto', 5.401126, 100.303739));
    mapGraph.addVertex(new MapVertex('Penang Airport', 5.293185, 100.265772));
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
});
