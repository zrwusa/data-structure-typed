import { HashMap } from '../../../../dist/esm/index.mjs';
import { HashMap as SdslHashMap, HashSet as SdslHashSet } from 'js-sdsl';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();
const { MILLION } = magnitude;

suite.add('1M set', function() {
  const hm = new HashMap();
  for (let i = 0; i < MILLION; i++) {
    hm.set(i, i);
  }
  this.val = hm;
});

suite.add('1M set (js-sdsl)', function() {
  const hm = new SdslHashMap();
  for (let i = 0; i < MILLION; i++) {
    hm.setElement(i, i);
  }
  this.val = hm;
});

suite.add('Native JS Map 1M set', function() {
  const hm = new Map();
  for (let i = 0; i < MILLION; i++) {
    hm.set(i, i);
  }
  this.val = hm;
});

suite.add('Native JS Set 1M add', function() {
  const hs = new Set();
  for (let i = 0; i < MILLION; i++) {
    hs.add(i);
  }
  this.val = hs;
});

suite.add('1M add (js-sdsl HashSet)', function() {
  const hs = new SdslHashSet();
  for (let i = 0; i < MILLION; i++) {
    hs.insert(i);
  }
  this.val = hs;
});

suite.add('1M set & get', function() {
  const hm = new HashMap();
  for (let i = 0; i < MILLION; i++) {
    hm.set(i, i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hm.get(i) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('1M set & get (js-sdsl)', function() {
  const hm = new SdslHashMap();
  for (let i = 0; i < MILLION; i++) {
    hm.setElement(i, i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hm.getElementByKey(i) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('Native JS Map 1M set & get', function() {
  const hm = new Map();
  for (let i = 0; i < MILLION; i++) {
    hm.set(i, i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hm.get(i) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('Native JS Set 1M add & has', function() {
  const hs = new Set();
  for (let i = 0; i < MILLION; i++) {
    hs.add(i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hs.has(i)) {
      count++;
    }
  }
  this.val = count;
});

suite.add('1M add & has (js-sdsl HashSet)', function() {
  const hs = new SdslHashSet();
  for (let i = 0; i < MILLION; i++) {
    hs.insert(i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hs.find(i).equals(hs.end()) === false) {
      count++;
    }
  }
  this.val = count;
});

suite.add('1M ObjKey set & get', function() {
  const hm = new HashMap();
  const objKeys = [];
  for (let i = 0; i < MILLION; i++) {
    const obj = { key: i, value: i };
    objKeys.push(obj);
    hm.set(obj, i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hm.get(objKeys[i]) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('1M ObjKey set & get (js-sdsl)', function() {
  const hm = new SdslHashMap();
  const objKeys = [];
  for (let i = 0; i < MILLION; i++) {
    const obj = { key: i, value: i };
    objKeys.push(obj);
    hm.setElement(obj, i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hm.getElementByKey(objKeys[i]) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('Native JS Map 1M ObjKey set & get', function() {
  const hm = new Map();
  const objs = [];
  for (let i = 0; i < MILLION; i++) {
    const obj = { key: i, value: i };
    objs.push(obj);
    hm.set(obj, i);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hm.get(objs[i]) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('Native JS Set 1M ObjKey add & has', function() {
  const hs = new Set();
  const objs = [];
  for (let i = 0; i < MILLION; i++) {
    const obj = { key: i, value: i };
    objs.push(obj);
    hs.add(obj);
  }
  let count = 0;
  for (let i = 0; i < MILLION; i++) {
    if (hs.has(objs[i])) {
      count++;
    }
  }
  this.val = count;
});

export { suite };
