import { HashMap } from '../../../../src';
import { HashMap as CHashMap } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const { MILLION } = magnitude;

suite.add(`${MILLION.toLocaleString()} set`, () => {
  const hm = new HashMap<number, number>();

  for (let i = 0; i < MILLION; i++) {
    hm.set(i, i);
  }
});
if (isCompetitor) {
  suite.add(`${MILLION.toLocaleString()} CPT set`, () => {
    const hm = new CHashMap<number, number>();

    for (let i = 0; i < MILLION; i++) {
      hm.setElement(i, i);
    }
  });
}

suite.add(`${MILLION.toLocaleString()} set & get`, () => {
  const hm = new HashMap<number, number>();

  for (let i = 0; i < MILLION; i++) {
    hm.set(i, i);
  }
  for (let i = 0; i < MILLION; i++) {
    hm.get(i);
  }
});

suite.add(`${MILLION.toLocaleString()} Map set & get`, () => {
  const hm = new Map<number, number>();

  for (let i = 0; i < MILLION; i++) {
    hm.set(i, i);
  }
  for (let i = 0; i < MILLION; i++) {
    hm.get(i);
  }
});

suite.add(`${MILLION.toLocaleString()} Map set`, () => {
  const hm = new Map<number, number>();

  for (let i = 0; i < MILLION; i++) hm.set(i, i);
});

suite.add(`${MILLION.toLocaleString()} Set add`, () => {
  const hs = new Set<number>();

  for (let i = 0; i < MILLION; i++) hs.add(i);
});

suite.add(`${MILLION.toLocaleString()} Set add & has`, () => {
  const hs = new Set<number>();

  for (let i = 0; i < MILLION; i++) {
    hs.add(i);
  }
  for (let i = 0; i < MILLION; i++) {
    hs.has(i);
  }
});

if (isCompetitor) {
  suite.add(`${MILLION.toLocaleString()} CPT set & get`, () => {
    const hm = new CHashMap<number, number>();

    for (let i = 0; i < MILLION; i++) {
      hm.setElement(i, i);
    }
    for (let i = 0; i < MILLION; i++) {
      hm.getElementByKey(i);
    }
  });
}

suite.add(`${MILLION.toLocaleString()} ObjKey set & get`, () => {
  const hm = new HashMap<[number, number], number>();
  const objKeys:[number, number][] = [];
  for (let i = 0; i < MILLION; i++) {
    const obj: [number, number] = [i, i];
    objKeys.push(obj)
    hm.set(obj, i);
  }
  for (let i = 0; i < MILLION; i++) {
    hm.get(objKeys[i]);
  }
});

suite.add(`${MILLION.toLocaleString()} Map ObjKey set & get`, () => {
  const hm = new Map<[number, number], number>();
  const objs:[number, number][] = [];
  for (let i = 0; i < MILLION; i++) {
    const obj: [number, number] = [i, i];
    objs.push(obj)
    hm.set(obj, i);
  }
  for (let i = 0; i < MILLION; i++) {
    hm.get(objs[i]);
  }
});

suite.add(`${MILLION.toLocaleString()} Set ObjKey add & has`, () => {
  const hs = new Set<[number, number]>();
  const objs:[number, number][] = [];
  for (let i = 0; i < MILLION; i++) {
    const obj: [number, number] = [i, i];
    objs.push(obj)
    hs.add(obj);
  }
  for (let i = 0; i < MILLION; i++) {
    hs.has(objs[i]);
  }
});

export { suite };
