import { RedBlackTree, TreeMap } from '../../../../dist/esm/index.mjs';
import { OrderedMap } from 'js-sdsl';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND, MILLION } = magnitude;

const N_SET = MILLION;
const N_GET = MILLION;
const N_RANGE = HUNDRED_THOUSAND;

const randomKeys = getRandomIntArray(N_SET, 0, N_SET - 1, true);

// Prebuilt containers for lookup-only benchmarks (read-only during runs)
const treeMapOn = new TreeMap();
const treeMapOff = new TreeMap([], { isMapMode: false });
const rbtOn = new RedBlackTree();
const rbtOff = new RedBlackTree([], { isMapMode: false });
const sdsl = new OrderedMap();

for (let i = 0; i < randomKeys.length; i++) {
  const k = randomKeys[i];
  treeMapOn.set(k, k);
  treeMapOff.set(k, k);
  rbtOn.set(k, k);
  rbtOff.set(k, k);
  sdsl.setElement(k, k);
}

suite
  // Insert benchmarks.
  .add(`${N_SET.toLocaleString()} set TreeMap`, function () {
    const mp = new TreeMap();
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_SET.toLocaleString()} set TreeMap (Node)`, function () {
    const mp = new TreeMap([], { isMapMode: false });
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_SET.toLocaleString()} set RBT`, function () {
    const mp = new RedBlackTree();
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_SET.toLocaleString()} set RBT (Node)`, function () {
    const mp = new RedBlackTree([], { isMapMode: false });
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_SET.toLocaleString()} set js-sdsl`, function () {
    const mp = new OrderedMap();
    for (let i = 0; i < randomKeys.length; i++) mp.setElement(randomKeys[i], randomKeys[i]);
    this.val = mp;
  })

  // Lookup-only benchmarks (no rebuild).
  .add(`${N_GET.toLocaleString()} get TreeMap`, function () {
    for (let i = 0; i < randomKeys.length; i++) treeMapOn.get(randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get TreeMap (Node)`, function () {
    for (let i = 0; i < randomKeys.length; i++) treeMapOff.get(randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get RBT`, function () {
    for (let i = 0; i < randomKeys.length; i++) rbtOn.get(randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get RBT (Node)`, function () {
    for (let i = 0; i < randomKeys.length; i++) rbtOff.get(randomKeys[i]);
  })
  .add(`${N_GET.toLocaleString()} get js-sdsl`, function () {
    for (let i = 0; i < randomKeys.length; i++) sdsl.getElementByKey(randomKeys[i]);
  })

  // Lookup benchmarks: build + lookup.
  .add(`${N_GET.toLocaleString()} build+get TreeMap`, function () {
    const mp = new TreeMap();
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    for (let i = 0; i < randomKeys.length; i++) mp.get(randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_GET.toLocaleString()} build+get TreeMap (Node)`, function () {
    const mp = new TreeMap([], { isMapMode: false });
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    for (let i = 0; i < randomKeys.length; i++) mp.get(randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_GET.toLocaleString()} build+get RBT`, function () {
    const mp = new RedBlackTree();
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    for (let i = 0; i < randomKeys.length; i++) mp.get(randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_GET.toLocaleString()} build+get RBT (Node)`, function () {
    const mp = new RedBlackTree([], { isMapMode: false });
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    for (let i = 0; i < randomKeys.length; i++) mp.get(randomKeys[i]);
    this.val = mp;
  })
  .add(`${N_GET.toLocaleString()} build+get js-sdsl`, function () {
    const mp = new OrderedMap();
    for (let i = 0; i < randomKeys.length; i++) mp.setElement(randomKeys[i], randomKeys[i]);
    for (let i = 0; i < randomKeys.length; i++) mp.getElementByKey(randomKeys[i]);
    this.val = mp;
  })

  // Range/Navigable (lookup-only, no rebuild).
  .add(`${N_RANGE.toLocaleString()} rangeSearch TreeMap`, function () {
    const out = treeMapOn.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} rangeSearch TreeMap (Node)`, function () {
    const out = treeMapOff.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} navigable TreeMap`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeMapOn.ceiling(i);
      treeMapOn.floor(i);
      treeMapOn.higher(i);
      treeMapOn.lower(i);
    }
  })
  .add(`${N_RANGE.toLocaleString()} navigable TreeMap (Node)`, function () {
    for (let i = 0; i < N_RANGE; i++) {
      treeMapOff.ceiling(i);
      treeMapOff.floor(i);
      treeMapOff.higher(i);
      treeMapOff.lower(i);
    }
  })

  // Range/Navigable (build inside run).
  .add(`${N_RANGE.toLocaleString()} build+rangeSearch TreeMap`, function () {
    const mp = new TreeMap();
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    const out = mp.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} build+rangeSearch TreeMap (Node)`, function () {
    const mp = new TreeMap([], { isMapMode: false });
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    const out = mp.rangeSearch([0, N_RANGE - 1]);
    this.val = out.length;
  })
  .add(`${N_RANGE.toLocaleString()} build+navigable TreeMap`, function () {
    const mp = new TreeMap();
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    for (let i = 0; i < N_RANGE; i++) {
      mp.ceiling(i);
      mp.floor(i);
      mp.higher(i);
      mp.lower(i);
    }
    this.val = mp;
  })
  .add(`${N_RANGE.toLocaleString()} build+navigable TreeMap (Node)`, function () {
    const mp = new TreeMap([], { isMapMode: false });
    for (let i = 0; i < randomKeys.length; i++) mp.set(randomKeys[i], randomKeys[i]);
    for (let i = 0; i < N_RANGE; i++) {
      mp.ceiling(i);
      mp.floor(i);
      mp.higher(i);
      mp.lower(i);
    }
    this.val = mp;
  });

export { suite };
