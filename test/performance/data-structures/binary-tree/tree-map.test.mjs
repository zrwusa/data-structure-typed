import { TreeMap } from '../../../../dist/esm/index.mjs';
import { OrderedMap } from 'js-sdsl';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/perf.mjs';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND, MILLION } = magnitude;

const N_SET = MILLION;
const N_GET = MILLION;
const N_RANGE = HUNDRED_THOUSAND;

const randomKeys = getRandomIntArray(N_SET, 0, N_SET - 1, true);

// Prebuilt containers for lookup-only benchmarks (read-only during runs)
const treeMapOn = new TreeMap();
const treeMapOff = new TreeMap([], { isMapMode: false });
const sdsl = new OrderedMap();

for (let i = 0; i < randomKeys.length; i++) {
  const k = randomKeys[i];
  treeMapOn.set(k, k);
  treeMapOff.set(k, k);
  sdsl.setElement(k, k);
}

suite
  // Insert benchmarks.
  .add(`${N_SET.toLocaleString()} set`, function () {
    const mp = new TreeMap();
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_SET.toLocaleString()} set (classic)`, function () {
    const mp = new TreeMap([], { isMapMode: false });
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_SET.toLocaleString()} set (js-sdsl)`, function () {
    const mp = new OrderedMap();
    for (let i = 0; i < randomKeys.length; i++) mp.setElement(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })

  // Lookup-only benchmarks (no rebuild).
  .add(`${N_GET.toLocaleString()} get`, function () {
    for (let i = 0; i < randomKeys.length; i++) treeMapOn.get(randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get (classic)`, function () {
    for (let i = 0; i < randomKeys.length; i++) treeMapOff.get(randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get (js-sdsl)`, function () {
    for (let i = 0; i < randomKeys.length; i++) sdsl.getElementByKey(randomKeys[i]);
  })

  // Range/Navigable (lookup-only, no rebuild).
  .add(`${N_RANGE.toLocaleString()} rangeSearch`, function () {
    const out = treeMapOn.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} rangeSearch (classic)`, function () {
    const out = treeMapOff.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} navigable`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeMapOn.ceiling(i);
      treeMapOn.floor(i);
      treeMapOn.higher(i);
      treeMapOn.lower(i);
    }
  })
  .add(`${N_RANGE.toLocaleString()} navigable (classic)`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeMapOff.ceiling(i);
      treeMapOff.floor(i);
      treeMapOff.higher(i);
      treeMapOff.lower(i);
    }
  });

export { suite };
