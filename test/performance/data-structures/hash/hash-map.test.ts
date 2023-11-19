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
export { suite };
