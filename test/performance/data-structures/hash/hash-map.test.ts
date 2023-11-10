import {HashMap} from '../../../../src';
import {HashMap as CHashMap} from 'js-sdsl';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {LINEAR} = magnitude;

suite
  .add(`${LINEAR.toLocaleString()} set`, () => {
    const hm = new HashMap<number, number>();

    for (let i = 0; i < LINEAR; i++) {
      hm.set(i, i);
    }
  })
  .add(`${LINEAR.toLocaleString()} competitor set`, () => {
    const hm = new CHashMap<number, number>();

    for (let i = 0; i < LINEAR; i++) {
      hm.setElement(i, i);
    }
  })
  .add(`${LINEAR.toLocaleString()} set & get`, () => {
    const hm = new HashMap<number, number>();

    for (let i = 0; i < LINEAR; i++) {
      hm.set(i, i);
    }
    for (let i = 0; i < LINEAR; i++) {
      hm.get(i);
    }
  })
  .add(`${LINEAR.toLocaleString()} competitor set & get`, () => {
    const hm = new CHashMap<number, number>();

    for (let i = 0; i < LINEAR; i++) {
      hm.setElement(i, i);
    }
    for (let i = 0; i < LINEAR; i++) {
      hm.getElementByKey(i);
    }
  });

export {suite};
