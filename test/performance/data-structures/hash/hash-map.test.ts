import {HashMap} from '../../../../src';
import {HashMap as CHashMap} from 'js-sdsl';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';
import {isCompetitor} from '../../../config';

const suite = new Benchmark.Suite();
const {TEN_THOUSAND} = magnitude;

suite.add(`${TEN_THOUSAND.toLocaleString()} set`, () => {
  const hm = new HashMap<number, number>();

  for (let i = 0; i < TEN_THOUSAND; i++) {
    hm.set(i, i);
  }
});
if (isCompetitor) {
  suite.add(`${TEN_THOUSAND.toLocaleString()} competitor set`, () => {
    const hm = new CHashMap<number, number>();

    for (let i = 0; i < TEN_THOUSAND; i++) {
      hm.setElement(i, i);
    }
  });
}
suite.add(`${TEN_THOUSAND.toLocaleString()} set & get`, () => {
  const hm = new HashMap<number, number>();

  for (let i = 0; i < TEN_THOUSAND; i++) {
    hm.set(i, i);
  }
  for (let i = 0; i < TEN_THOUSAND; i++) {
    hm.get(i);
  }
});
if (isCompetitor) {
  suite.add(`${TEN_THOUSAND.toLocaleString()} competitor set & get`, () => {
    const hm = new CHashMap<number, number>();

    for (let i = 0; i < TEN_THOUSAND; i++) {
      hm.setElement(i, i);
    }
    for (let i = 0; i < TEN_THOUSAND; i++) {
      hm.getElementByKey(i);
    }
  });
}
export {suite};
