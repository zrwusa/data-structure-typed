import { TreeSet } from '../../../../dist/esm/index.mjs';
import { OrderedSet } from 'js-sdsl';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/perf.mjs';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND, MILLION } = magnitude;

// Keep add/get/has large; keep range operations smaller.
const N_ADD = MILLION;
const N_QUERY = MILLION;
const N_RANGE = HUNDRED_THOUSAND;

const randomAdd = getRandomIntArray(N_ADD, 0, N_ADD - 1, true);
const randomQuery = randomAdd;

// Prebuilt containers for lookup-only benchmarks (read-only during runs)
const treeSetOn = new TreeSet();
const treeSetOff = new TreeSet([], { isMapMode: false });
const sdslSet = new OrderedSet();

for (let i = 0; i < randomAdd.length; i++) {
  const k = randomAdd[i];
  treeSetOn.add(k);
  treeSetOff.add(k);
  sdslSet.insert(k);
}
const sdslEnd = sdslSet.end();

suite
  // Insert benchmarks: fresh container inside each run.
  .add(`${N_ADD.toLocaleString()} add`, function () {
    const st = new TreeSet();
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    this.val = st;
  })
  .add(`${N_ADD.toLocaleString()} add (classic)`, function () {
    const st = new TreeSet([], { isMapMode: false });
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    this.val = st;
  })
  .add(`${N_ADD.toLocaleString()} add (js-sdsl)`, function () {
    const st = new OrderedSet();
    for (let i = 0; i < randomAdd.length; i++) st.insert(randomAdd[i]);
    this.val = st;
  })

  // Lookup-only benchmarks (no rebuild).
  .add(`${N_QUERY.toLocaleString()} has`, function () {
    for (let i = 0; i < randomQuery.length; i++) treeSetOn.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has (classic)`, function () {
    for (let i = 0; i < randomQuery.length; i++) treeSetOff.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has (js-sdsl)`, function () {
    for (let i = 0; i < randomQuery.length; i++) sdslSet.find(randomQuery[i]).equals(sdslEnd);
  })

  // Range operations (lookup-only).
  .add(`${N_RANGE.toLocaleString()} rangeSearch`, function () {
    const out = treeSetOn.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} rangeSearch (classic)`, function () {
    const out = treeSetOff.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} navigable`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeSetOn.ceiling(i);
      treeSetOn.floor(i);
      treeSetOn.higher(i);
      treeSetOn.lower(i);
    }
  })
  .add(`${N_RANGE.toLocaleString()} navigable (classic)`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeSetOff.ceiling(i);
      treeSetOff.floor(i);
      treeSetOff.higher(i);
      treeSetOff.lower(i);
    }
  });

export { suite };
