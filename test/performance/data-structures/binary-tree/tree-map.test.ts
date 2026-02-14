import { RedBlackTree, TreeMap } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND, MILLION } = magnitude;

const N_SET = MILLION;
const N_GET = MILLION;
const N_RANGE = HUNDRED_THOUSAND;

const randomKeys = getRandomIntArray(N_SET, 0, N_SET - 1, true);

const treeMap = new TreeMap<number, number>();
const rbtMapLike = new RedBlackTree<number, number>();
const nativeMap = new Map<number, number>();

// Pre-seed structures for read-only benchmarks.
for (let i = 0; i < randomKeys.length; i++) {
  const k = randomKeys[i];
  treeMap.set(k, k);
  rbtMapLike.set(k, k);
  nativeMap.set(k, k);
}

suite
  .add(`${N_SET.toLocaleString()} set (TreeMap)`, () => {
    for (let i = 0; i < randomKeys.length; i++) treeMap.set(randomKeys[i], randomKeys[i]);
  })
  .add(`${N_SET.toLocaleString()} set (RedBlackTree)`, () => {
    for (let i = 0; i < randomKeys.length; i++) rbtMapLike.set(randomKeys[i], randomKeys[i]);
  })
  .add(`Native JS Map ${N_SET.toLocaleString()} set`, () => {
    for (let i = 0; i < randomKeys.length; i++) nativeMap.set(randomKeys[i], randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get (TreeMap)`, () => {
    for (let i = 0; i < randomKeys.length; i++) treeMap.get(randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get (RedBlackTree)`, () => {
    for (let i = 0; i < randomKeys.length; i++) rbtMapLike.get(randomKeys[i]);
  })
  .add(`Native JS Map ${N_GET.toLocaleString()} get`, () => {
    for (let i = 0; i < randomKeys.length; i++) nativeMap.get(randomKeys[i]);
  })
  .add(`${N_RANGE.toLocaleString()} rangeSearch (TreeMap)`, () => {
    const out = treeMap.rangeSearch([0, N_RANGE - 1]);
    return out.length > 0;
  })
  .add(`${N_RANGE.toLocaleString()} ceiling/floor/higher/lower (TreeMap)`, () => {
    for (let i = 0; i < N_RANGE; i++) {
      treeMap.ceiling(i);
      treeMap.floor(i);
      treeMap.higher(i);
      treeMap.lower(i);
    }
  });

export { suite };
