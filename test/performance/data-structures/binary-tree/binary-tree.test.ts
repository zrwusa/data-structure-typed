import {BinaryTree} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude, randomInt, randomIntArray} from '../../../utils';

const suite = new Benchmark.Suite();
const biTree = new BinaryTree<number>();
const {N_LOG_N} = magnitude;

suite
  .add(`add ${N_LOG_N}`, () => {
    for (let i = 0; i < N_LOG_N; i++) biTree.add(randomInt(-N_LOG_N, N_LOG_N));
  })
  .add(`delete ${N_LOG_N}`, () => {
    for (let i = 0; i < N_LOG_N; i++) biTree.delete(randomInt(-N_LOG_N, N_LOG_N));
  })
  .add(`addMany ${N_LOG_N}`, () => {
    biTree.clear();
    const arr = randomIntArray(N_LOG_N);
    biTree.addMany(arr);
  })
  .add(`get ${N_LOG_N}`, () => {
    for (let i = 0; i < N_LOG_N; i++) biTree.get(randomInt(-N_LOG_N, N_LOG_N));
  });

export {suite};
