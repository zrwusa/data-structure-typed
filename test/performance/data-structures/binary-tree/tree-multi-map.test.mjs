import { TreeMultiMap } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND, MILLION } = magnitude;

// MultiMap operations: add/get/hasEntry/deleteValue
const N_ADD = MILLION;
const N_QUERY = MILLION;
const N_MUTATE = HUNDRED_THOUSAND;

const randomAdd = getRandomIntArray(N_ADD, 0, N_ADD / 10, false); // Allow duplicates (MultiMap scenario)
const randomQuery = getRandomIntArray(N_QUERY, 0, N_ADD / 10, false);

// Prebuilt for lookup-only benchmarks
const tmmPrebuilt = new TreeMultiMap();
for (let i = 0; i < randomAdd.length; i++) {
  tmmPrebuilt.add(randomAdd[i], randomAdd[i]); // key -> [values]
}

suite
  // Add benchmarks: fresh container inside each run
  .add(`${N_ADD.toLocaleString()} add (TreeMultiMap, bucketed)`, function () {
    const tmm = new TreeMultiMap();
    for (let i = 0; i < randomAdd.length; i++) tmm.add(randomAdd[i], randomAdd[i]);
    this.val = tmm;
  })

  // Lookup-only benchmarks (no rebuild)
  .add(`${N_QUERY.toLocaleString()} has-only (TreeMultiMap)`, function () {
    for (let i = 0; i < randomQuery.length; i++) tmmPrebuilt.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} get-only (TreeMultiMap)`, function () {
    for (let i = 0; i < randomQuery.length; i++) tmmPrebuilt.get(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} count-only (TreeMultiMap)`, function () {
    for (let i = 0; i < randomQuery.length; i++) tmmPrebuilt.count(randomQuery[i]);
  })

  // Build + lookup
  .add(`${N_QUERY.toLocaleString()} build+has (TreeMultiMap)`, function () {
    const tmm = new TreeMultiMap();
    for (let i = 0; i < randomAdd.length; i++) tmm.add(randomAdd[i], randomAdd[i]);
    for (let i = 0; i < randomQuery.length; i++) tmm.has(randomQuery[i]);
    this.val = tmm;
  })
  .add(`${N_QUERY.toLocaleString()} build+get (TreeMultiMap)`, function () {
    const tmm = new TreeMultiMap();
    for (let i = 0; i < randomAdd.length; i++) tmm.add(randomAdd[i], randomAdd[i]);
    for (let i = 0; i < randomQuery.length; i++) tmm.get(randomQuery[i]);
    this.val = tmm;
  })

  // Value equality operations
  .add(`${N_MUTATE.toLocaleString()} hasEntry (TreeMultiMap, Object.is)`, function () {
    const tmm = new TreeMultiMap();
    for (let i = 0; i < randomAdd.length; i++) tmm.add(randomAdd[i], randomAdd[i]);
    for (let i = 0; i < N_MUTATE; i++) tmm.hasEntry(randomQuery[i], randomQuery[i]);
    this.val = tmm;
  })
  .add(`${N_MUTATE.toLocaleString()} deleteValue (TreeMultiMap, Object.is)`, function () {
    const tmm = new TreeMultiMap();
    for (let i = 0; i < randomAdd.length; i++) tmm.add(randomAdd[i], randomAdd[i]);
    for (let i = 0; i < N_MUTATE; i++) tmm.deleteValue(randomQuery[i], randomQuery[i]);
    this.val = tmm;
  })

  // Navigable entry methods (RFC additions)
  .add(`${N_MUTATE.toLocaleString()} firstEntry/lastEntry (TreeMultiMap)`, function () {
    for (let i = 0; i < N_MUTATE; i++) {
      tmmPrebuilt.firstEntry();
      tmmPrebuilt.lastEntry();
    }
  })
  .add(`${N_MUTATE.toLocaleString()} ceilingEntry/floorEntry (TreeMultiMap)`, function () {
    for (let i = 0; i < N_MUTATE; i++) {
      tmmPrebuilt.ceilingEntry(randomQuery[i]);
      tmmPrebuilt.floorEntry(randomQuery[i]);
    }
  })

  // Iteration: bucket view (default)
  .add(`${N_ADD.toLocaleString()} bucket iteration (TreeMultiMap)`, function () {
    let sum = 0;
    for (const [key, bucket] of tmmPrebuilt) sum += key + bucket.length;
    this.val = sum;
  })

  // Iteration: flat entries view (RFC addition)
  .add(`${N_ADD.toLocaleString()} flatEntries iteration (TreeMultiMap)`, function () {
    let sum = 0;
    for (const [key, val] of tmmPrebuilt.flatEntries()) sum += key + val;
    this.val = sum;
  })

  // Size operations
  .add(`${N_ADD.toLocaleString()} size property (TreeMultiMap)`, function () {
    this.val = tmmPrebuilt.size;
  })
  .add(`${N_ADD.toLocaleString()} totalSize property (TreeMultiMap)`, function () {
    this.val = tmmPrebuilt.totalSize;
  });

export { suite };
