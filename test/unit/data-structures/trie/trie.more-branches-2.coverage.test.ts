import { Trie } from '../../../../src';

describe('Trie additional branch coverage (batch 2)', () => {
  it('getWords() default prefix arg and isAllWhenEmptyPrefix behavior', () => {
    const t = new Trie();
    t.add('a');
    t.add('ab');

    // prefix default arg (empty) should not collect unless isAllWhenEmptyPrefix=true
    expect(t.getWords()).toEqual([]);
    expect(t.getWords('', 10, true).sort()).toEqual(['a', 'ab']);
  });

  it('map() covers thisArg branch and non-string return TypeError branch', () => {
    const t = new Trie();
    t.add('a');

    const ctx = { suf: 'x' };
    const mapped = t.map(function (this: any, w: string) {
      return w + this.suf;
    }, undefined as any, ctx);
    expect((mapped as any).has('ax')).toBe(true);

    expect(() =>
      t.map(() => 123 as any)
    ).toThrow(/must return string/i);
  });

  it('mapSame covers both ternary arms and _spawnLike/_createLike default-arg branches', () => {
    const t = new Trie();
    t.add('a');

    // thisArg === undefined arm
    const t2 = t.mapSame(w => w + 'b');
    expect(t2.has('ab')).toBe(true);

    // thisArg provided arm
    const ctx = { p: 'z' };
    const t3 = t.mapSame(function (this: any, w: string) {
      return this.p + w;
    }, ctx);
    expect(t3.has('za')).toBe(true);

    // protected helpers default args
    const like = (t as any)._createLike();
    expect(like.size).toBe(0);

    const spawned = (t as any)._spawnLike();
    expect(spawned.size).toBe(0);
  });
});
