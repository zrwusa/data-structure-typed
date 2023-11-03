import {BinaryTree} from '../../../../src';
import * as Benchmark from 'benchmark';
import {getRandomIntArray, magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const biTree = new BinaryTree<number>();
const {N_LOG_N} = magnitude;
const arr = getRandomIntArray(N_LOG_N, 0, N_LOG_N, true);

suite
  .add(`${N_LOG_N} add randomly`, () => {
    biTree.clear();
    for (let i = 0; i < arr.length; i++) {
      biTree.add(arr[i]);
    }
  })
  .add(`${N_LOG_N} add & delete randomly`, () => {
    biTree.clear();
    for (let i = 0; i < arr.length; i++) {
      biTree.add(arr[i]);
    }
    for (let i = 0; i < arr.length; i++) {
      biTree.delete(arr[i]);
    }
  })
  .add(`${N_LOG_N} addMany`, () => {
    biTree.clear();
    biTree.addMany(arr);
  })
  .add(`${N_LOG_N} get`, () => {
    for (let i = 0; i < arr.length; i++) {
      biTree.get(arr[i]);
    }
  })
  .add(`${N_LOG_N} dfs`, () => {
    for (let i = 0; i < N_LOG_N; i++) biTree.dfs();
  })
  .add(`${N_LOG_N} bfs`, () => {
    for (let i = 0; i < N_LOG_N; i++) biTree.bfs();
  })
  .add(`${N_LOG_N} morris`, () => {
    for (let i = 0; i < N_LOG_N; i++) biTree.morris(n => n, 'pre');
  });

export {suite};
