import { TreeMultiSet } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/perf.mjs';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND, MILLION } = magnitude;

// MultiSet operations: add/delete/setCount
const N_ADD = MILLION;
const N_QUERY = MILLION;
const N_MUTATE = HUNDRED_THOUSAND;

const randomAdd = getRandomIntArray(N_ADD, 0, N_ADD / 10, false); // Allow duplicates (MultiSet scenario)
const randomQuery = getRandomIntArray(N_QUERY, 0, N_ADD / 10, false);

// Prebuilt for lookup-only benchmarks
const tmsPrebuilt = new TreeMultiSet();
for (let i = 0; i < randomAdd.length; i++) {
  tmsPrebuilt.add(randomAdd[i]);
}

suite
  // Add benchmarks: fresh container inside each run
  .add(`${N_ADD.toLocaleString()} add (TreeMultiSet, expanded iteration)`, function () {
    const tms = new TreeMultiSet();
    for (let i = 0; i < randomAdd.length; i++) tms.add(randomAdd[i]);
    this.val = tms;
  })

  // Lookup-only benchmarks (no rebuild)
  .add(`${N_QUERY.toLocaleString()} has-only (TreeMultiSet)`, function () {
    for (let i = 0; i < randomQuery.length; i++) tmsPrebuilt.has(randomQuery[i]);
  })
  .add(`${N_QUERY.toLocaleString()} count-only (TreeMultiSet)`, function () {
    for (let i = 0; i < randomQuery.length; i++) tmsPrebuilt.count(randomQuery[i]);
  })

  // Build + lookup
  .add(`${N_QUERY.toLocaleString()} build+has (TreeMultiSet)`, function () {
    const tms = new TreeMultiSet();
    for (let i = 0; i < randomAdd.length; i++) tms.add(randomAdd[i]);
    for (let i = 0; i < randomQuery.length; i++) tms.has(randomQuery[i]);
    this.val = tms;
  })
  .add(`${N_QUERY.toLocaleString()} build+count (TreeMultiSet)`, function () {
    const tms = new TreeMultiSet();
    for (let i = 0; i < randomAdd.length; i++) tms.add(randomAdd[i]);
    for (let i = 0; i < randomQuery.length; i++) tms.count(randomQuery[i]);
    this.val = tms;
  })

  // Mutation: delete one occurrence
  .add(`${N_MUTATE.toLocaleString()} delete-one (TreeMultiSet)`, function () {
    const tms = new TreeMultiSet();
    for (let i = 0; i < randomAdd.length; i++) tms.add(randomAdd[i]);
    for (let i = 0; i < N_MUTATE; i++) tms.delete(randomQuery[i]);
    this.val = tms;
  })

  // setCount operation
  .add(`${N_MUTATE.toLocaleString()} setCount (TreeMultiSet)`, function () {
    const tms = new TreeMultiSet();
    for (let i = 0; i < randomAdd.length; i++) tms.add(randomAdd[i]);
    for (let i = 0; i < N_MUTATE; i++) tms.setCount(randomQuery[i], 5);
    this.val = tms;
  })

  // Iteration: expanded (default)
  .add(`${N_ADD.toLocaleString()} expanded iteration (TreeMultiSet)`, function () {
    let sum = 0;
    for (const val of tmsPrebuilt) sum += val;
    this.val = sum;
  })

  // Iteration: entries view
  .add(`${N_ADD.toLocaleString()} entries view (TreeMultiSet)`, function () {
    let sum = 0;
    for (const [val, count] of tmsPrebuilt.entries()) sum += val * count;
    this.val = sum;
  })

  // Size operations
  .add(`${N_ADD.toLocaleString()} size property (TreeMultiSet)`, function () {
    this.val = tmsPrebuilt.size;
  })
  .add(`${N_ADD.toLocaleString()} distinctSize property (TreeMultiSet)`, function () {
    this.val = tmsPrebuilt.distinctSize;
  });

export { suite };
