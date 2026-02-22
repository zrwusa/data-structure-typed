import { RedBlackTree, TreeSet } from '../../../../dist/esm/index.mjs';
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
const rbtSetOn = new RedBlackTree();
const rbtSetOff = new RedBlackTree([], { isMapMode: false });
const sdslSet = new OrderedSet();

for (let i = 0; i < randomAdd.length; i++) {
  const k = randomAdd[i];
  treeSetOn.add(k);
  treeSetOff.add(k);
  rbtSetOn.set(k, undefined);
  rbtSetOff.set(k, undefined);
  sdslSet.insert(k);
}
const sdslEnd = sdslSet.end();

suite
  // Insert benchmarks: fresh container inside each run.
  .add(`${N_ADD.toLocaleString()} add TreeSet`, function () {
    const st = new TreeSet();
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    this.val = st;
  })
  .add(`${N_ADD.toLocaleString()} add TreeSet (Node)`, function () {
    const st = new TreeSet([], { isMapMode: false });
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    this.val = st;
  })
  .add(`${N_ADD.toLocaleString()} add RBT`, function () {
    const st = new RedBlackTree();
    for (let i = 0; i < randomAdd.length; i++) st.set(randomAdd[i], undefined);
    this.val = st;
  })
  .add(`${N_ADD.toLocaleString()} add RBT (Node)`, function () {
    const st = new RedBlackTree([], { isMapMode: false });
    for (let i = 0; i < randomAdd.length; i++) st.set(randomAdd[i], undefined);
    this.val = st;
  })
  .add(`${N_ADD.toLocaleString()} add js-sdsl`, function () {
    const st = new OrderedSet();
    for (let i = 0; i < randomAdd.length; i++) st.insert(randomAdd[i]);
    this.val = st;
  })

  // Lookup-only benchmarks (no rebuild).
  .add(`${N_QUERY.toLocaleString()} has TreeSet`, function () {
    for (let i = 0; i < randomQuery.length; i++) treeSetOn.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has TreeSet (Node)`, function () {
    for (let i = 0; i < randomQuery.length; i++) treeSetOff.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has RBT`, function () {
    for (let i = 0; i < randomQuery.length; i++) rbtSetOn.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has RBT (Node)`, function () {
    for (let i = 0; i < randomQuery.length; i++) rbtSetOff.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} has js-sdsl`, function () {
    for (let i = 0; i < randomQuery.length; i++) sdslSet.find(randomQuery[i]).equals(sdslEnd);
  })

  // Lookup benchmarks: build + lookup.
  .add(`${N_QUERY.toLocaleString()} build+has TreeSet`, function () {
    const st = new TreeSet();
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    for (let i = 0; i < randomQuery.length; i++) st.has(randomQuery[i]);
    this.val = st;
  })
  .add(`${N_QUERY.toLocaleString()} build+has TreeSet (Node)`, function () {
    const st = new TreeSet([], { isMapMode: false });
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    for (let i = 0; i < randomQuery.length; i++) st.has(randomQuery[i]);
    this.val = st;
  })
  .add(`${N_QUERY.toLocaleString()} build+has RBT`, function () {
    const st = new RedBlackTree();
    for (let i = 0; i < randomAdd.length; i++) st.set(randomAdd[i], undefined);
    for (let i = 0; i < randomQuery.length; i++) st.has(randomQuery[i]);
    this.val = st;
  })
  .add(`${N_QUERY.toLocaleString()} build+has RBT (Node)`, function () {
    const st = new RedBlackTree([], { isMapMode: false });
    for (let i = 0; i < randomAdd.length; i++) st.set(randomAdd[i], undefined);
    for (let i = 0; i < randomQuery.length; i++) st.has(randomQuery[i]);
    this.val = st;
  })
  .add(`${N_QUERY.toLocaleString()} build+has js-sdsl`, function () {
    const st = new OrderedSet();
    for (let i = 0; i < randomAdd.length; i++) st.insert(randomAdd[i]);
    for (let i = 0; i < randomQuery.length; i++) st.find(randomQuery[i]).equals(st.end());
    this.val = st;
  })

  // Range operations (lookup-only).
  .add(`${N_RANGE.toLocaleString()} rangeSearch TreeSet`, function () {
    const out = treeSetOn.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} rangeSearch TreeSet (Node)`, function () {
    const out = treeSetOff.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} navigable TreeSet`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeSetOn.ceiling(i);
      treeSetOn.floor(i);
      treeSetOn.higher(i);
      treeSetOn.lower(i);
    }
  })
  .add(`${N_RANGE.toLocaleString()} navigable TreeSet (Node)`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeSetOff.ceiling(i);
      treeSetOff.floor(i);
      treeSetOff.higher(i);
      treeSetOff.lower(i);
    }
  })

  // Range operations (build + range).
  .add(`${N_RANGE.toLocaleString()} build+rangeSearch TreeSet`, function () {
    const st = new TreeSet();
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    const out = st.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} build+rangeSearch TreeSet (Node)`, function () {
    const st = new TreeSet([], { isMapMode: false });
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    const out = st.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} build+navigable TreeSet`, function () {
    const st = new TreeSet();
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    for (let i = 0; i < N_RANGE; i++) {
      st.ceiling(i);
      st.floor(i);
      st.higher(i);
      st.lower(i);
    }
    this.val = st;
  })
  .add(`${N_RANGE.toLocaleString()} build+navigable TreeSet (Node)`, function () {
    const st = new TreeSet([], { isMapMode: false });
    for (let i = 0; i < randomAdd.length; i++) st.add(randomAdd[i]);
    for (let i = 0; i < N_RANGE; i++) {
      st.ceiling(i);
      st.floor(i);
      st.higher(i);
      st.lower(i);
    }
    this.val = st;
  });

export { suite };
