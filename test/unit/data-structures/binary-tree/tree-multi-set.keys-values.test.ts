import { TreeMultiSet } from '../../../../src';

describe('TreeMultiSet keys() / values()', () => {
  it('@example [TreeMultiSet.keys] Iterate with multiplicity', () => {
    const ms = new TreeMultiSet<number>();
    ms.add(1);
    ms.add(1);
    ms.add(2);
    ms.add(3);
    ms.add(3);
    ms.add(3);
    expect([...ms.keys()]).toEqual([1, 1, 2, 3, 3, 3]);
  });

  it('@example [TreeMultiSet.values] Iterate with multiplicity', () => {
    const ms = new TreeMultiSet<number>();
    ms.add(5);
    ms.add(5);
    ms.add(10);
    expect([...ms.values()]).toEqual([5, 5, 10]);
  });

  it('consistent with spread', () => {
    const ms = new TreeMultiSet<number>();
    ms.add(1);
    ms.add(2);
    ms.add(2);
    expect([...ms.keys()]).toEqual([...ms]);
    expect([...ms.values()]).toEqual([...ms]);
  });

  it('empty set', () => {
    const ms = new TreeMultiSet<number>();
    expect([...ms.keys()]).toEqual([]);
    expect([...ms.values()]).toEqual([]);
  });
});
