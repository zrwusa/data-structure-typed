import { HashMap, LinkedHashMap } from '../../../../src';
import { getRandomInt, getRandomIntArray } from '../../../utils';

describe('HashMap', () => {
  let hashMap: HashMap<string, number>;

  beforeEach(() => {
    hashMap = new HashMap<string, number>();
  });

  it('should initialize correctly', () => {
    expect(hashMap.size).toBe(0);
    expect(hashMap.isEmpty()).toBe(true);
  });

  it('should put and get values', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);
    hashMap.set('three', 3);

    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    expect(hashMap.get('three')).toBe(3);
  });

  it('should handle key collisions', () => {
    // Force a collision by setting two different keys to the same bucket
    hashMap.set('key1', 1);
    hashMap.set('key2', 2);

    expect(hashMap.get('key1')).toBe(1);
    expect(hashMap.get('key2')).toBe(2);
  });

  it('should delete values', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);

    hashMap.delete('one');
    expect(hashMap.get('one')).toBeUndefined();
    expect(hashMap.size).toBe(1);
  });

  it('should clear the HashMap', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);

    hashMap.clear();
    expect(hashMap.size).toBe(0);
    expect(hashMap.isEmpty()).toBe(true);
  });

  it('should iterate over entries', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);
    hashMap.set('three', 3);
  });

  it('should resize the table when load factor is exceeded', () => {
    // Set a small initial capacity for testing resizing
    hashMap = new HashMap<string, number>();

    hashMap.set('one', 1);
    hashMap.set('two', 2);
    hashMap.set('three', 3);
    hashMap.set('four', 4); // This should trigger a resize

    // expect(hashMap.table.length).toBe(8);
    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    expect(hashMap.get('three')).toBe(3);
    expect(hashMap.get('four')).toBe(4);
  });

  it('should allow using a custom hash function', () => {
    hashMap = new HashMap<string, number>();

    hashMap.set('one', 1);
    hashMap.set('two', 2);

    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    // Since the custom hash function always returns 0, these keys will collide.
    // Make sure they are stored separately.
    // expect(hashMap.table[0].length).toBe(2);
  });

  it('should clone', () => {
    hashMap = new HashMap<string, number>();

    hashMap.set('one', 1);
    hashMap.set('two', 2);
    for (let i = 3; i <= 100; i++) {
      hashMap.set(i.toString(), i);
    }

    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    expect(hashMap.get('86')).toBe(86);
    expect(hashMap.size).toBe(100);
    hashMap.delete('two');
    expect(hashMap.size).toBe(99);

    const cloned = hashMap.clone();
    expect(cloned.get('one')).toBe(1);
    expect(cloned.get('two')).toBe(undefined);
    expect(cloned.get('86')).toBe(86);
    expect(cloned.size).toBe(99);
  });

  describe('HashMap Test2', () => {
    let hashMap: HashMap;

    beforeEach(() => {
      hashMap = new HashMap();
    });

    it('should create an empty map', () => {
      expect(hashMap.size).toBe(0);
    });

    it('should add a key-value pair', () => {
      hashMap.set('key1', 'value1');
      expect(hashMap.get('key1')).toBe('value1');
    });

    it('should handle object keys correctly', () => {
      const keyObj = { id: 1 };
      hashMap.set(keyObj, 'objectValue');
      expect(hashMap.get(keyObj)).toBe('objectValue');
    });

    test('Inheritability test', () => {
      class ExtendedHashMap<K, V> extends HashMap<K, V> {
        someOtherParam?: string;

        constructor(
          elements: Iterable<[K, V]> = [],
          options?: {
            hashFn?: (key: K) => string;
            someOtherParam: string;
          }
        ) {
          const { someOtherParam, ...restOptions } = options || {};
          super(elements, restOptions);
          this.someOtherParam = someOtherParam;
        }
      }

      const eHM = new ExtendedHashMap<string, number>([], { someOtherParam: 'someOtherParam' });
      eHM.set('one', 1);
      expect(eHM.get('one')).toBe(1);
    });

    test('should raw elements toEntry', () => {
      const rawCollection = [
        { id: 1, name: 'item 1' },
        { id: 2, name: 'item 2' }
      ];
      const hm = new HashMap<number, string, { id: number; name: string }>(rawCollection, {
        toEntryFn: rawElement => [rawElement.id, rawElement.name]
      });

      expect(hm.has(1)).toBe(true);
      expect(hm.get(2)).toBe('item 2');
      expect(hm.size).toBe(2);
    });

    it('should update the value for an existing key', () => {
      hashMap.set('key1', 'value1');
      hashMap.set('key1', 'newValue');
      expect(hashMap.get('key1')).toBe('newValue');
    });

    it('should return undefined for a non-existent key', () => {
      expect(hashMap.get('nonExistentKey')).toBeUndefined();
    });

    it('should remove a key-value pair', () => {
      hashMap.set('key1', 'value1');
      hashMap.delete('key1');
      expect(hashMap.get('key1')).toBeUndefined();
    });

    it('should clear the map', () => {
      hashMap.set('key1', 'value1');
      expect(hashMap.size).toBe(1);

      hashMap.clear();
      expect(hashMap.size).toBe(0);
    });

    it('should iterate over values', () => {
      hashMap.set('key1', 'value1');
      hashMap.set('key2', 'value2');
      const values = [];
      for (const value of hashMap) {
        values.push(value);
      }
      expect(values).toEqual([
        ['key1', 'value1'],
        ['key2', 'value2']
      ]);
    });

    function compareHashMaps(hashMap: HashMap<unknown, unknown>, stdMap: Map<unknown, unknown>) {
      expect(hashMap.size).toEqual(stdMap.size);
      stdMap.forEach((value, key) => {
        expect(hashMap.get(key)).toEqual(value);
      });
    }

    const stdMap: Map<unknown, unknown> = new Map();
    const arr: number[] = getRandomIntArray(1000, 1, 10000);

    it('delete test', () => {
      for (const item of arr) {
        stdMap.set(item, item);
        hashMap.set(item, item);
      }
      for (const item of arr) {
        if (Math.random() > 0.6) {
          expect(hashMap.delete(item)).toEqual(stdMap.delete(item));
        }
      }
      compareHashMaps(hashMap, stdMap);

      for (let i = 0; i < 1000; ++i) {
        const random = getRandomInt(0, 100);
        expect(hashMap.delete(random)).toEqual(stdMap.delete(random));
      }
      compareHashMaps(hashMap, stdMap);
    });
  });

  describe('HashMap for coordinate object keys', () => {
    const hashMap: HashMap<[number, number], number> = new HashMap();
    const codObjs: [number, number][] = [];

    test('set elements in hash map', () => {
      for (let i = 0; i < 1000; i++) {
        const codObj: [number, number] = [getRandomInt(-10000, 10000), i];
        codObjs.push(codObj);
        hashMap.set(codObj, i);
      }
    });

    test('get elements in hash map', () => {
      for (let i = 0; i < 1000; i++) {
        const codObj = codObjs[i];
        if (codObj) {
          expect(hashMap.get(codObj)).toBe(i);
        }
      }
    });

    test('delete elements in hash map', () => {
      for (let i = 0; i < 1000; i++) {
        if (i === 500) expect(hashMap.size).toBe(500);
        const codObj = codObjs[i];
        if (codObj) hashMap.delete(codObj);
      }
      expect(hashMap.size).toBe(0);
    });
  });

  describe('HashMap setMany, keys, values', () => {
    const hm: HashMap<number, number> = new HashMap<number, number>();

    beforeEach(() => {
      hm.clear();
      hm.setMany([
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5]
      ]);
      hm.setMany([
        [2, 2],
        [3, 3],
        [4, 4],
        [6, 6]
      ]);
    });

    test('keys', () => {
      expect([...hm.keys()]).toEqual([2, 3, 4, 5, 6]);
    });

    test('values', () => {
      expect([...hm.values()]).toEqual([2, 3, 4, 5, 6]);
    });
  });

  describe('HashMap HOF', () => {
    let hashMap: HashMap;

    beforeEach(() => {
      hashMap = new HashMap<string, string>();
      hashMap.set('key1', 'value1');
      hashMap.set('key2', 'value2');
      hashMap.set('key3', 'value3');
    });

    test('every() returns true if all elements match the condition', () => {
      expect(hashMap.every(value => typeof value === 'string')).toBe(true);
    });

    test('some() returns true if any element matches the condition', () => {
      expect(hashMap.some((value, key) => key === 'key1')).toBe(true);
    });

    test('forEach() should execute a function for each element', () => {
      const mockCallback = jest.fn();
      hashMap.forEach(mockCallback);
      expect(mockCallback.mock.calls.length).toBe(3);
    });

    test('map() should transform each element', () => {
      const newHashMap = hashMap.map(value => value.toUpperCase());
      expect(newHashMap.get('key1')).toBe('VALUE1');
    });

    test('filter() should remove elements that do not match the condition', () => {
      const filteredHashMap = hashMap.filter((value, key) => key !== 'key1');
      expect(filteredHashMap.has('key1')).toBe(false);
    });

    test('reduce() should accumulate values', () => {
      const result = hashMap.reduce((acc, value) => acc + value, '');
      expect(result).toBe('value1value2value3');
    });
  });
});

describe('LinkedHashMap', () => {
  let hashMap: LinkedHashMap;

  beforeEach(() => {
    hashMap = new LinkedHashMap();
  });

  it('should create an empty map', () => {
    expect(hashMap.size).toBe(0);
  });

  it('should add a key-value pair', () => {
    hashMap.set('key1', 'value1');
    expect(hashMap.get('key1')).toBe('value1');
  });

  it('should handle object keys correctly', () => {
    const keyObj = { id: 1 };
    hashMap.set(keyObj, 'objectValue');
    expect(hashMap.get(keyObj)).toBe('objectValue');
  });

  it('should handle number keys correctly', () => {
    hashMap.set(999, { a: '999Value' });
    expect(hashMap.get(999)).toEqual({ a: '999Value' });
  });

  it('should update the value for an existing key', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key1', 'newValue');
    expect(hashMap.get('key1')).toBe('newValue');
  });

  it('should return undefined for a non-existent key', () => {
    expect(hashMap.get('nonExistentKey')).toBeUndefined();
  });

  it('should remove a key-value pair', () => {
    hashMap.set('key1', 'value1');
    hashMap.delete('key1');
    expect(hashMap.get('key1')).toBeUndefined();
  });

  it('should clear the map', () => {
    hashMap.set('key1', 'value1');
    expect(hashMap.size).toBe(1);

    hashMap.clear();
    expect(hashMap.size).toBe(0);
  });

  it('should iterate over values', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    const values = [];
    for (const value of hashMap) {
      values.push(value);
    }
    expect(values).toEqual([
      ['key1', 'value1'],
      ['key2', 'value2']
    ]);
  });

  function compareHashMaps(hashMap: LinkedHashMap<unknown, unknown>, stdMap: Map<unknown, unknown>) {
    expect(hashMap.size).toEqual(stdMap.size);
    let index = 0;
    stdMap.forEach((value, key) => {
      if (index === 0) {
        expect(hashMap.first).toEqual([key, value]);
        expect(hashMap.begin().next().value).toEqual([key, value]);
      } else if (index === hashMap.size - 1) {
        expect(hashMap.last).toEqual([key, value]);
        expect(hashMap.reverseBegin().next().value).toEqual([key, value]);
      } else if (index <= 1000) {
        expect(hashMap.at(index)).toBe(value);
      }
      expect(hashMap.get(key)).toEqual(value);
      index++;
    });
  }

  const stdMap: Map<unknown, unknown> = new Map();
  const arr: number[] = getRandomIntArray(1000, 1, 10000);

  it('delete test', () => {
    for (const item of arr) {
      stdMap.set(item, item);
      hashMap.set(item, item);
    }
    for (const item of arr) {
      if (Math.random() > 0.6) {
        expect(hashMap.delete(item)).toEqual(stdMap.delete(item));
      }
    }
    compareHashMaps(hashMap, stdMap);

    for (let i = 0; i < 1000; ++i) {
      const random = getRandomInt(0, 100);
      expect(hashMap.delete(random)).toEqual(stdMap.delete(random));
    }
    compareHashMaps(hashMap, stdMap);
  });

  test('should iterate correctly with reverse iterators', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    const iterator = hashMap.reverseBegin();
    expect(iterator.next().value).toEqual(['key2', 'value2']);
  });

  test('should return the last element', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    expect(hashMap.last).toEqual(['key2', 'value2']);
  });

  test('should return undefined for empty map', () => {
    expect(hashMap.last).toBeUndefined();
  });

  test('should get element at specific index', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    expect(hashMap.at(1)).toBe('value2');
  });

  describe('LinkedHashMap basic', () => {
    let hashMap: LinkedHashMap<string, number>;

    beforeEach(() => {
      hashMap = new LinkedHashMap<string, number>();
    });

    it('should initialize correctly', () => {
      expect(hashMap.size).toBe(0);
      // expect(hashMap.table.length).toBe(16);
      // expect(hashMap.loadFactor).toBe(0.75);
      // expect(hashMap.capacityMultiplier).toBe(2);
      // expect(hashMap.initialCapacity).toBe(16);
      expect(hashMap.isEmpty()).toBe(true);
    });

    it('should put and get values', () => {
      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('three', 3);

      expect(hashMap.get('one')).toBe(1);
      expect(hashMap.get('two')).toBe(2);
      expect(hashMap.get('three')).toBe(3);
    });

    it('should handle key collisions', () => {
      // Force a collision by setting two different keys to the same bucket
      hashMap.set('key1', 1);
      hashMap.set('key2', 2);

      expect(hashMap.get('key1')).toBe(1);
      expect(hashMap.get('key2')).toBe(2);
    });

    it('should delete values', () => {
      hashMap.set('one', 1);
      hashMap.set('two', 2);

      hashMap.delete('one');
      expect(hashMap.get('one')).toBeUndefined();
      expect(hashMap.size).toBe(1);
    });

    it('should clear the LinkedHashMap', () => {
      hashMap.set('one', 1);
      hashMap.set('two', 2);

      hashMap.clear();
      expect(hashMap.size).toBe(0);
      expect(hashMap.isEmpty()).toBe(true);
    });

    it('should iterate over entries', () => {
      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('three', 3);

      // const entries = Array.from(hashMap.entries());
      // expect(entries).toContainEqual(['one', 1]);
      // expect(entries).toContainEqual(['two', 2]);
      // expect(entries).toContainEqual(['three', 3]);
    });

    it('should resize the table when load factor is exceeded', () => {
      // Set a small initial capacity for testing resizing
      hashMap = new LinkedHashMap<string, number>();

      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('three', 3);
      hashMap.set('four', 4); // This should trigger a resize

      // expect(hashMap.table.length).toBe(8);
      expect(hashMap.get('one')).toBe(1);
      expect(hashMap.get('two')).toBe(2);
      expect(hashMap.get('three')).toBe(3);
      expect(hashMap.get('four')).toBe(4);
    });

    it('should allow using a custom hash function', () => {
      hashMap = new LinkedHashMap<string, number>();

      hashMap.set('one', 1);
      hashMap.set('two', 2);

      expect(hashMap.get('one')).toBe(1);
      expect(hashMap.get('two')).toBe(2);
      // Since the custom hash function always returns 0, these keys will collide.
      // Make sure they are stored separately.
      // expect(hashMap.table[0].length).toBe(2);
    });

    // it('should handle number keys correctly', () => {
    //   const hm = new LinkedHashMap();
    //   hm.set(999, { a: '999Value' });
    //   hm.set('999', {a: '999StrValue'})
    //   expect(hm.get(999)).toEqual({ a: '999Value' });
    //   expect(hm.get('999')).toEqual({ a: '999StrValue1' });
    // });
  });

  describe('coordinate object keys', () => {
    const hashMap: LinkedHashMap<[number, number], number> = new LinkedHashMap();
    const codObjs: [number, number][] = [];

    test('set elements in hash map', () => {
      for (let i = 0; i < 1000; i++) {
        const codObj: [number, number] = [getRandomInt(-10000, 10000), i];
        codObjs.push(codObj);
        hashMap.set(codObj, i);
      }
    });

    test('get elements in hash map', () => {
      for (let i = 0; i < 1000; i++) {
        const codObj = codObjs[i];
        if (codObj) {
          expect(hashMap.get(codObj)).toBe(i);
        }
      }
    });

    test('delete elements in hash map', () => {
      for (let i = 0; i < 1000; i++) {
        if (i === 500) expect(hashMap.size).toBe(500);
        const codObj = codObjs[i];
        if (codObj) hashMap.delete(codObj);
      }
      expect(hashMap.size).toBe(0);
    });
  });

  describe('setMany, keys, values', () => {
    const hm: LinkedHashMap<number, number> = new LinkedHashMap<number, number>();

    beforeEach(() => {
      hm.clear();
      hm.setMany([
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5]
      ]);
      hm.setMany([
        [2, 2],
        [3, 3],
        [4, 4],
        [6, 6]
      ]);
    });

    test('keys', () => {
      expect([...hm.keys()]).toEqual([2, 3, 4, 5, 6]);
    });

    test('values', () => {
      expect([...hm.values()]).toEqual([2, 3, 4, 5, 6]);
    });

    test('entries', () => {
      expect([...hm.entries()]).toEqual([
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6]
      ]);
    });

    test('every', () => {
      expect(hm.every(value => value > 4)).toBe(false);
    });

    test('some', () => {
      expect(hm.some(value => value > 6)).toBe(false);
    });

    test('hasValue', () => {
      expect(hm.hasValue(3)).toBe(true);
      expect(hm.hasValue(7)).toBe(false);
    });

    test('print', () => {
      // hm.print();
    });
  });
});
