import { TreeMap } from '../../../../src';

describe('TreeMap branch coverage', () => {
  describe('_validateKey edge cases', () => {
    it('throws on NaN key', () => {
      const tm = new TreeMap<number, string>();
      expect(() => tm.set(NaN, 'bad')).toThrow(/NaN/);
    });

    it('throws on invalid Date key', () => {
      const tm = new TreeMap<Date, string>();
      expect(() => tm.set(new Date('invalid'), 'bad')).toThrow(/Date/);
    });

    it('throws on unsupported key type with default comparator', () => {
      const tm = new TreeMap<object, string>();
      expect(() => tm.set({}, 'a')).toThrow();
    });

    it('skips validation with custom comparator', () => {
      const tm = new TreeMap<object, string>([], { comparator: () => 0 });
      expect(() => tm.set({}, 'a')).not.toThrow();
    });
  });

  describe('comparator NaN/Date branches', () => {
    it('comparator throws on NaN in comparison (a=NaN)', () => {
      const tm = new TreeMap<number, string>([[1, 'a']]);
      expect(() => tm.set(NaN, 'b')).toThrow(/NaN/); // compare(NaN, 1) → isNaN(a)
    });



    it('comparator throws on invalid Date in comparison', () => {
      const tm = new TreeMap<Date, string>([[new Date('2020-01-01'), 'a']]);
      expect(() => tm.set(new Date('invalid'), 'b')).toThrow(/Date/);
    });

    it('Date comparison covers all return branches', () => {
      const tm = new TreeMap<Date, string>();
      const d1 = new Date('2020-01-01');
      const d2 = new Date('2020-06-01');
      const d3 = new Date('2020-01-01');
      tm.set(d1, 'a');
      tm.set(d2, 'b'); // ta < tb
      tm.set(d3, 'c'); // ta === tb → update
      expect(tm.size).toBe(2);
      expect(tm.get(d1)).toBe('c');
    });

    it('comparator handles -0 as 0 (both sides)', () => {
      const tm = new TreeMap<number, string>();
      tm.set(0, 'zero');
      tm.set(-0, 'negzero'); // a=-0 compared with b=0
      expect(tm.size).toBe(1);
      const tm2 = new TreeMap<number, string>();
      tm2.set(-0, 'negzero');
      tm2.set(0, 'zero'); // a=0 compared with b=-0
      expect(tm2.size).toBe(1);
      tm2.set(1, 'one');
      tm2.set(-0, 'z'); // a=-0 compared with b=1 then b=0
      expect(tm2.size).toBe(2);
    });
  });

  describe('filter/every/some/find thisArg', () => {
    it('filter with thisArg', () => {
      const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
      const ctx = { min: 2 };
      const filtered = tm.filter(function (this: typeof ctx, _v, k) {
        return k >= this.min;
      }, ctx);
      expect(filtered.size).toBe(2);
    });

    it('every with thisArg', () => {
      const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
      const ctx = { max: 5 };
      expect(tm.every(function (this: typeof ctx, _v, k) {
        return k <= this.max;
      }, ctx)).toBe(true);
    });

    it('some with thisArg', () => {
      const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
      const ctx = { target: 2 };
      expect(tm.some(function (this: typeof ctx, _v, k) {
        return k === this.target;
      }, ctx)).toBe(true);
    });

    it('find with thisArg', () => {
      const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
      const ctx = { target: 'b' };
      const found = tm.find(function (this: typeof ctx, v) {
        return v === this.target;
      }, ctx);
      expect(found).toEqual([2, 'b']);
    });
  });

  describe('rangeSearch bounds', () => {
    it('rangeSearch with all options', () => {
      const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]);
      expect(tm.rangeSearch([2, 3], { lowInclusive: false, highInclusive: false })).toEqual([]);
      expect(tm.rangeSearch([2, 4], { lowInclusive: false })).toEqual([[3, 'c'], [4, 'd']]);
    });
  });
});
