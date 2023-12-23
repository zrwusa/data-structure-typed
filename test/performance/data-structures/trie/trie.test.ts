import { Trie } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomWords, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND } = magnitude;
const trie = new Trie();
const randomWords = getRandomWords(HUNDRED_THOUSAND, false);

suite
  .add(`${HUNDRED_THOUSAND.toLocaleString()} push`, () => {
    for (let i = 0; i < randomWords.length; i++) trie.add(randomWords[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} getWords`, () => {
    for (let i = 0; i < randomWords.length; i++) trie.getWords(randomWords[i]);
  });

export { suite };
