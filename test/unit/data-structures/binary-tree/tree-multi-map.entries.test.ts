import { TreeMultiMap } from '../../../../src';

describe('TreeMultiMap.entries()', () => {
  it('@example [TreeMultiMap.entries] Iterate over entries', () => {
    const mm = new TreeMultiMap<number, string>();
    mm.set(1, 'a');
    mm.set(1, 'b');
    mm.set(2, 'c');
    expect([...mm.entries()]).toEqual([
      [1, ['a', 'b']],
      [2, ['c']]
    ]);
  });

  it('empty map returns empty iterator', () => {
    const mm = new TreeMultiMap<number, string>();
    expect([...mm.entries()]).toEqual([]);
  });

  it('single entry', () => {
    const mm = new TreeMultiMap<number, string>();
    mm.set(5, 'x');
    expect([...mm.entries()]).toEqual([[5, ['x']]]);
  });
});
