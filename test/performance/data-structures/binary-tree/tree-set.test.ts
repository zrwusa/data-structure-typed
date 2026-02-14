import { RedBlackTree, TreeSet } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND, MILLION } = magnitude;

// Use a smaller N for operations that include allocations like rangeSearch.
const N_ADD = MILLION;
const N_QUERY = MILLION;
const N_RANGE = HUNDRED_THOUSAND;

const randomAdd = getRandomIntArray(N_ADD, 0, N_ADD - 1, true);
const randomQuery = randomAdd;

const treeSet = new TreeSet<number>();
const rbtSetLike = new RedBlackTree<number, undefined>();
const nativeSet = new Set<number>();

// Pre-seed structures for read-only benchmarks.
for (let i = 0; i < randomAdd.length; i++) {
  const k = randomAdd[i];
  treeSet.add(k);
  rbtSetLike.set(k, undefined);
  nativeSet.add(k);
}

suite
  .add(`${N_ADD.toLocaleString()} add (TreeSet)`, () => {
    for (let i = 0; i < randomAdd.length; i++) treeSet.add(randomAdd[i]);
  })
  .add(`${N_ADD.toLocaleString()} set (RedBlackTree set-like)`, () => {
    for (let i = 0; i < randomAdd.length; i++) rbtSetLike.set(randomAdd[i], undefined);
  })
  .add(`Native JS Set ${N_ADD.toLocaleString()} add`, () => {
    for (let i = 0; i < randomAdd.length; i++) nativeSet.add(randomAdd[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has (TreeSet)`, () => {
    for (let i = 0; i < randomQuery.length; i++) treeSet.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has (RedBlackTree set-like)`, () => {
    for (let i = 0; i < randomQuery.length; i++) rbtSetLike.has(randomQuery[i]);
  })
  .add(`Native JS Set ${N_QUERY.toLocaleString()} has`, () => {
    for (let i = 0; i < randomQuery.length; i++) nativeSet.has(randomQuery[i]);
  })
  .add(`${N_RANGE.toLocaleString()} rangeSearch (TreeSet)`, () => {
    const out = treeSet.rangeSearch([0, N_RANGE - 1]);
    return out.length > 0;
  })
  .add(`${N_RANGE.toLocaleString()} ceiling/floor/higher/lower (TreeSet)`, () => {
    for (let i = 0; i < N_RANGE; i++) {
      treeSet.ceiling(i);
      treeSet.floor(i);
      treeSet.higher(i);
      treeSet.lower(i);
    }
  });

export { suite };
