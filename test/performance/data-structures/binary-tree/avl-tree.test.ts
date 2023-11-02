import {AVLTree} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude, randomInt, randomIntArray} from '../../../utils';

const suite = new Benchmark.Suite();
const avl = new AVLTree<number>();
const {N_LOG_N} = magnitude;

suite
  .add(`add ${N_LOG_N} randomly`, () => {
    for (let i = 0; i < N_LOG_N; i++) avl.add(randomInt(0, N_LOG_N));
  })
  .add(`delete ${N_LOG_N} randomly`, () => {
    for (let i = 0; i < N_LOG_N; i++) avl.delete(randomInt(0, N_LOG_N));
  })
  .add(`addMany ${N_LOG_N}`, () => {
    const arr = randomIntArray(N_LOG_N);
    avl.addMany(arr);
  })
  .add(`get ${N_LOG_N}`, () => {
    for (let i = 0; i < N_LOG_N; i++) avl.get(randomInt(-N_LOG_N, N_LOG_N));
  });

export {suite};
