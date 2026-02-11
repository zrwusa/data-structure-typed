import { LinkedHashMap } from '../../../../src';

describe('LinkedHashMap toEntryFn remaining branch coverage', () => {
  it('default toEntryFn returns tuple when rawElement is an entry (isEntry true branch)', () => {
    const m = new LinkedHashMap<number, string>();
    const fn = m.toEntryFn as (raw: any) => [number, string];
    expect(fn([1, 'a'])).toEqual([1, 'a']);
  });
});
