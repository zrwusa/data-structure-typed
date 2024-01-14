import { BinaryTree } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const biTree = new BinaryTree<number>();
const { THOUSAND } = magnitude;
const arr = getRandomIntArray(THOUSAND, 0, THOUSAND, true);

suite
  .add(`${THOUSAND.toLocaleString()} add randomly`, () => {
    biTree.clear();
    for (let i = 0; i < arr.length; i++) biTree.add(arr[i]);
  })
  .add(`${THOUSAND.toLocaleString()} add & delete randomly`, () => {
    biTree.clear();
    for (let i = 0; i < arr.length; i++) biTree.add(arr[i]);
    for (let i = 0; i < arr.length; i++) biTree.delete(arr[i]);
  })
  .add(`${THOUSAND.toLocaleString()} addMany`, () => {
    biTree.clear();
    biTree.addMany(arr);
  })
  .add(`${THOUSAND.toLocaleString()} get`, () => {
    for (let i = 0; i < arr.length; i++) biTree.get(arr[i]);
  })
  .add(`${THOUSAND.toLocaleString()} has`, () => {
    for (let i = 0; i < arr.length; i++) biTree.get(arr[i]);
  })
  .add(`${THOUSAND.toLocaleString()} dfs`, () => {
    for (let i = 0; i < THOUSAND; i++) biTree.dfs();
  })
  .add(`${THOUSAND.toLocaleString()} bfs`, () => {
    for (let i = 0; i < THOUSAND; i++) biTree.bfs();
  })
  .add(`${THOUSAND.toLocaleString()} morris`, () => {
    for (let i = 0; i < THOUSAND; i++) biTree.morris(n => n, 'PRE');
  });

// export { suite };
