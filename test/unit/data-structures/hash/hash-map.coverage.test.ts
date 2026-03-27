import { HashMap, LinkedHashMap } from '../../../../src';

describe('HashMap misc coverage', () => {

  describe('/ Linkedbranch', () => {
  it('HashMap.setHashFn returns early when same fn is passed (covers _hashFn===fn branch)', () => {
      const m = new HashMap<any, any>();
      const fn = (m as any)._hashFn;
      expect(m.setHashFn(fn)).toBe(m);
    });

    it('HashMap._getNoObjKey covers symbol-key path and non-(string/number/symbol) path', () => {
      const m = new HashMap<any, any>();

      // symbol -> hits (..&&..&& keyType!=='symbol') final operand false arm
      const s = Symbol('k');
      m.set(s as any, 1);
      expect(m.get(s as any)).toBe(1);

      // boolean -> forces _hashFn(key) path
      m.set(true as any, 2);
      expect(m.get(true as any)).toBe(2);
    });

    it('LinkedHashMap.toEntryFn default throws when rawElement is not an entry (covers toEntryFn error)', () => {
      const m = new LinkedHashMap<number, number, any>();
      expect(() => (m as any).toEntryFn({ k: 1, v: 2 })).toThrow(/provide options\.toEntryFn/i);
    });

    it('LinkedHashMap set/get/delete branches for weak keys and missing nodes', () => {
      const m = new LinkedHashMap<object, number>();
      const obj = {};

      // insert weak key => new node
      m.set(obj, 1);
      expect(m.get(obj)).toBe(1);

      // update existing weak key => else-if(node) branch
      m.set(obj, 2);
      expect(m.get(obj)).toBe(2);

      // get missing weak key => node ? node.value : undefined false arm
      expect(m.get({} as any)).toBeUndefined();

      // delete missing weak key => if(!node) return false
      expect(m.delete({} as any)).toBe(false);
    });

    it('LinkedHashMap.deleteWhere covers weak-key delete path and noObj delete path and not-found return false', () => {
      const m = new LinkedHashMap<any, number>();
      const obj = {};
      m.set('a', 1);
      m.set(obj, 2);

      // deleteWhere hits predicate true for weak key => _objMap.delete branch
      expect(m.deleteWhere((k: any) => typeof k === 'object')).toBe(true);
      expect(m.has(obj)).toBe(false);

      // deleteWhere hits predicate true for noObj key => delete _noObjMap[hash]
      expect(m.deleteWhere((k: any) => k === 'a')).toBe(true);
      expect(m.has('a')).toBe(false);

      // not found
      expect(m.deleteWhere(() => false)).toBe(false);
    });
  });

  describe('LinkedtoEntryFn branch', () => {
    it('default toEntryFn returns tuple when rawElement is an entry (isEntry true branch)', () => {
      const m = new LinkedHashMap<number, string>();
      const fn = m.toEntryFn as (raw: any) => [number, string];
      expect(fn([1, 'a'])).toEqual([1, 'a']);
    });
  });

  describe('IterableEntryBase inherited methods', () => {
    it('hasValue returns true/false', () => {
      const hm = new HashMap<number, string>([[1, 'a'], [2, 'b']]);
      expect(hm.hasValue('a')).toBe(true);
      expect(hm.hasValue('z')).toBe(false);
    });

    it('toArray returns array of entries', () => {
      const hm = new HashMap<number, string>([[1, 'a']]);
      const arr = hm.toArray();
      expect(arr.length).toBe(1);
      expect(arr[0]).toEqual([1, 'a']);
    });

    it('print does not throw', () => {
      const hm = new HashMap<number, string>([[1, 'a']]);
      const spy = jest.spyOn(console, 'log').mockImplementation();
      hm.print();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('getter coverage', () => {
    it('toEntryFn returns the converter function', () => {
      const fn = (raw: [number, string]): [number, string] => [raw[0], raw[1]];
      const hm = new HashMap<number, string>([], { toEntryFn: fn });
      expect(hm.toEntryFn).toBe(fn);
    });

    it('toEntryFn returns undefined when not set', () => {
      const hm = new HashMap<number, string>();
      expect(hm.toEntryFn).toBeUndefined();
    });

    it('hashFn returns the hash function', () => {
      const hm = new HashMap<number, string>();
      expect(typeof hm.hashFn).toBe('function');
    });
  });

  describe('setHashFn and rehash', () => {
    it('setHashFn rehashes non-object keys', () => {
      const hm = new HashMap<string, number>();
      hm.set('a', 1);
      hm.set('b', 2);
      const customHash = (k: string) => `custom_${k}`;
      const result = hm.setHashFn(customHash);
      expect(result).toBe(hm); // returns this
      expect(hm.get('a')).toBe(1);
      expect(hm.get('b')).toBe(2);
      expect(hm.hashFn).toBe(customHash);
    });

    it('setHashFn with same function is no-op', () => {
      const hm = new HashMap<string, number>();
      const fn = hm.hashFn;
      const result = hm.setHashFn(fn);
      expect(result).toBe(hm);
    });
  });

  describe('LinkedHashMap begin iterator', () => {
    it('iterates multiple entries via begin()', () => {
      const { LinkedHashMap: LHM } = require('../../../../src');
      const lhm = new (LHM as any)([[1, 'a'], [2, 'b'], [3, 'c']]);
      const entries: [number, string][] = [];
      for (const entry of lhm.begin()) {
        entries.push(entry as [number, string]);
      }
      expect(entries.length).toBe(3);
    });
  });
});
