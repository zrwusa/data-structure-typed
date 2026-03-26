import { SkipList } from '../../../../src';

describe('SkipList additional branch coverage', () => {
  it('constructor applies options branches (maxLevel/probability) and first() returns undefined when empty', () => {
    const s = new SkipList<number, number>([], { maxLevel: 8, probability: 0.25 });
    expect(s.maxLevel).toBe(8);
    expect(s.probability).toBe(0.25);

    // first() returns undefined when empty
    expect(s.first()).toBeUndefined();
  });

  it('bigint keys work with default comparator', () => {
    const s = new SkipList<bigint, string>();
    s.set(3n, 'c');
    s.set(1n, 'a');
    s.set(2n, 'b');
    expect([...s.keys()]).toEqual([1n, 2n, 3n]);
  });

  it('comparator getter returns the comparator', () => {
    const cmp = (a: number, b: number) => b - a;
    const s = new SkipList<number, string>([], { comparator: cmp });
    expect(s.comparator).toBe(cmp);
  });

  it('print does not throw', () => {
    const s = new SkipList<number, string>([[1, 'a']]);
    const spy = jest.spyOn(console, 'log').mockImplementation();
    s.print();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('delete() covers the break branch when deleted node has smaller level than list level', () => {
    const s = new SkipList<number, string>();

    // Force deterministic node levels: first node makes list level high, second is low-level.
    const origRandomLevel = (s as any)._randomLevel;
    const levels = [4, 1];
    (s as any)._randomLevel = () => levels.shift() ?? 1;
    try {
      s.set(1, 'hi'); // level 4, raises list level
      s.set(2, 'lo'); // level 1, list level stays 4

      expect(s.delete(2)).toBe(true);
      expect(s.get(2)).toBeUndefined();
    } finally {
      (s as any)._randomLevel = origRandomLevel;
    }
  });
});
