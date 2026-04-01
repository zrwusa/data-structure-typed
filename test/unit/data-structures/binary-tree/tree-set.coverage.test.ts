import { TreeSet } from '../../../../src';

describe('TreeSet branch coverage', () => {
  describe('_validateKey edge cases', () => {
    it('throws on NaN', () => {
      const ts = new TreeSet<number>();
      expect(() => ts.add(NaN)).toThrow(/NaN/);
    });

    it('throws on invalid Date', () => {
      const ts = new TreeSet<Date>();
      expect(() => ts.add(new Date('invalid'))).toThrow(/Date/);
    });

    it('throws on unsupported key type', () => {
      const ts = new TreeSet<object>();
      expect(() => ts.add({})).toThrow();
    });
  });

  describe('comparator branches', () => {
    it('NaN in comparison throws (a=NaN)', () => {
      const ts = new TreeSet<number>([1]);
      expect(() => ts.add(NaN)).toThrow(/NaN/); // compare(NaN, 1) → isNaN(a)
    });

    it('invalid Date in comparison throws', () => {
      const ts = new TreeSet<Date>([new Date('2020-01-01')]);
      expect(() => ts.add(new Date('invalid'))).toThrow(/Date/);
    });

    it('Date comparison covers all return branches', () => {
      const ts = new TreeSet<Date>();
      const d1 = new Date('2020-01-01');
      const d2 = new Date('2020-06-01');
      const d3 = new Date('2020-01-01'); // equal to d1
      ts.add(d1);
      ts.add(d2); // ta < tb → -1
      ts.add(d3); // ta === tb → 0 (duplicate, no insert)
      expect(ts.size).toBe(2);
    });

    it('-0 treated as 0 (both sides)', () => {
      const ts = new TreeSet<number>();
      ts.add(0);
      ts.add(-0); // a=-0 compared with b=0
      expect(ts.size).toBe(1);
      const ts2 = new TreeSet<number>();
      ts2.add(-0);
      ts2.add(0); // a=0 compared with b=-0
      expect(ts2.size).toBe(1);
      // Both sides: add 1 first, then -0 to ensure a=-0 branch
      ts2.add(1);
      ts2.add(-0);
      expect(ts2.size).toBe(2);
    });
  });

  describe('filter/every/some/find thisArg', () => {
    it('filter with thisArg', () => {
      const ts = new TreeSet<number>([1, 2, 3, 4]);
      const ctx = { min: 3 };
      const filtered = ts.filter(function (this: typeof ctx, v) {
        return v >= this.min;
      }, ctx);
      expect(filtered.size).toBe(2);
    });

    it('every with thisArg', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      const ctx = { max: 5 };
      expect(
        ts.every(function (this: typeof ctx, v) {
          return v <= this.max;
        }, ctx)
      ).toBe(true);
    });

    it('some with thisArg', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      const ctx = { target: 2 };
      expect(
        ts.some(function (this: typeof ctx, v) {
          return v === this.target;
        }, ctx)
      ).toBe(true);
    });

    it('find with thisArg', () => {
      const ts = new TreeSet<number>([1, 2, 3]);
      const ctx = { target: 2 };
      const found = ts.find(function (this: typeof ctx, v) {
        return v === this.target;
      }, ctx);
      expect(found).toBe(2);
    });
  });

  describe('rangeSearch bounds', () => {
    it('rangeSearch with exclusive bounds', () => {
      const ts = new TreeSet<number>([1, 2, 3, 4, 5]);
      expect(ts.rangeSearch([2, 4], { lowInclusive: false, highInclusive: false })).toEqual([3]);
      expect(ts.rangeSearch([2, 4], { lowInclusive: false })).toEqual([3, 4]);
    });
  });
});
