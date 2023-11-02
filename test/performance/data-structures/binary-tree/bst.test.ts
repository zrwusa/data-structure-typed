import {BST} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude, randomInt, randomIntArray} from '../../../utils';

const suite = new Benchmark.Suite();
const bst = new BST<number>();
const {N_LOG_N} = magnitude;

suite
  .add(`add ${N_LOG_N} randomly`, () => {
    for (let i = 0; i < N_LOG_N; i++) bst.add(randomInt(0, N_LOG_N));
  })
  .add(`delete ${N_LOG_N} randomly`, () => {
    for (let i = 0; i < N_LOG_N; i++) bst.delete(randomInt(0, N_LOG_N));
  })
  .add(`addMany ${N_LOG_N} balanced`, () => {
    const arr = randomIntArray(N_LOG_N);
    bst.addMany(arr);
  })
  .add(`get ${N_LOG_N}`, () => {
    for (let i = 0; i < N_LOG_N; i++) bst.get(randomInt(-N_LOG_N, N_LOG_N));
  });

export {suite};
