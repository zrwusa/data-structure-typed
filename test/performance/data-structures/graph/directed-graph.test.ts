import { DirectedGraph } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIndex, getRandomWords, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const { THOUSAND } = magnitude;
const graph = new DirectedGraph<number, number>();
const vertexes = getRandomWords(THOUSAND);

suite
  .add(`${THOUSAND.toLocaleString()} addVertex`, () => {
    for (const v of vertexes) graph.addVertex(v);
  })
  .add(`${THOUSAND.toLocaleString()} addEdge`, () => {
    for (let i = 0; i < THOUSAND; i++) {
      const v1 = vertexes[getRandomIndex(vertexes)];
      const v2 = vertexes[getRandomIndex(vertexes)];
      graph.addEdge(v1, v2);
    }
  })
  .add(`${THOUSAND.toLocaleString()} getVertex`, () => {
    for (let i = 0; i < THOUSAND; i++) graph.getVertex(vertexes[getRandomIndex(vertexes)]);
  })
  .add(`${THOUSAND.toLocaleString()} getEdge`, () => {
    for (let i = 0; i < THOUSAND; i++)
      graph.getEdge(vertexes[getRandomIndex(vertexes)], vertexes[getRandomIndex(vertexes)]);
  })
  .add(`tarjan`, () => {
    graph.tarjan();
  })
  // .add(`tarjan all`, () => {
  //   graph.tarjan(true, true, true, true);
  // })
  .add(`topologicalSort`, () => {
    graph.topologicalSort('key');
  });

export { suite };
